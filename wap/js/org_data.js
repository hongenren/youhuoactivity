var orgThirdAccount= $_GET['orgThirdAccount'], type= $_GET['type'];
$(function() {
    $("#licenseMonth").attr("href", "./org_data_license.html?type=0&orgThirdAccount="+orgThirdAccount);
    $("#license").attr("href", "./org_data_license.html?type=1&orgThirdAccount="+orgThirdAccount);
    selectMonthData();
    if(type==0){
        $(".subOrgSpan").hide();
        $(".subOrg").hide();
        $("#title").html("下属团体："+decodeURI($_GET['title']));
    }else{
        get_sub_org_msg(20);
    }
})
function selectMonthData(){
    console.log(nowMonth)
    var month = nowYear+"-"+(parseInt(nowMonth)+1);
    if((nowMonth+1)<10){
        month = nowYear+"-0"+(parseInt(nowMonth)+1);
    }
    $.ajax({
        type: "post",
        url: base_url + "html5/v1/orgPlace/selectMonthData",
        data: JSON.stringify({"orgThirdAccount": orgThirdAccount, "month": month}),
        headers: {'token': token},
        async: false,
        dataType: 'json',
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (data.code == 0) {
                if (data.data) {
                    var data1 = data.data;
                    if(data1.monthPNum){$("#monthPNum").html(data1.monthPNum);}//当月护照
                    if(data1.pnum){$("#pnum").html(data1.pnum);}//护照
                    if(data1.monthJoinNum){$("#monthJoinNum").html(data1.monthJoinNum);}//当月新增人员
                    if(data1.monthQuitNum){$("#monthQuitNum").html(data1.monthQuitNum);}//当月退出
                    if(data1.memberNum){$("#memberNum").html(data1.memberNum);}//人员总数
                    if(data1.monthVolHours){$("#monthVolHours").html(data1.monthVolHours);}//当月服务时间
                    if(data1.volHours){$("#volHours").html(data1.volHours);}//服务时间
                    if(data1.monthSectionCount){$("#monthSectionCount").html(data1.monthSectionCount);}//当月已结束活动
                    if(data1.sectionCount){$("#sectionCount").html(data1.sectionCount);}//已结束活动
                }
            }
        }
    })
}

function get_sub_org_msg(state=10){
    var html = '';
    $.ajax({
        xhrFields: {
            withCredentials: true
        },
        type:"post",
        url:base_url + "html5/v1/orgPlace/querySubOrgByParentAccountWithBeforeDay",
        data:JSON.stringify({"parentOrgThirdAccount":prjvorgMsg.orgThirdAccount}),
        dataType:'json',
        headers : {'token':token},
        contentType: "application/json;charset=utf-8",
        success:function(data){
            //console.log(data);
            if(data.code==0){
                var data1 = data.data.records;
                var html = "";
                $.each(data1,function(index,val){
                    html +='<li>\
                                 <a href="./org_data.html?orgThirdAccount='+val.orgThirdAccount+'&type=0&title='+val.name+'">\
                                    <b>'+val.name+'</b>\
                                 </a>\
                            </li>';
                })
                if(html==""){
                    html +='<li>\
                                <a href="javascript:void(0)" style="background: none;">\
                                    <b>暂无数据</b>\
                                    </a>\
                            </li>';
                }
                $(".subOrg").html(html);
            }else{
                layer.open({
                    content: data.msg
                    ,skin: 'msg'
                    ,time: 1 //2秒后自动关闭
                });
                return false;
            }

        },
        error:function(){
            layer.open({
                content: '获取失败'
                ,skin: 'msg'
                ,time: 1 //2秒后自动关闭
            });
            return false;
        }
    })
}
var e_mail= "";
function openEmail(){
    layer.open({
        content: '<div style="width: 100%;text-align: center;font-size: 20px;">下载</div>公益数据将会发送到您的邮箱<br /><input type="text" style="text-align:center;border-radius:5px;border:#D0D0D0 1px solid;height: 40px;width: 80%" oninput="setEmail(this);">'
        , btn: ['确定', '取消']
        , yes: function (index) {
            $.ajax({
                xhrFields: {
                    withCredentials: true
                },
                type: "post",
                url: base_url + "html5/v1/orgPlace/getExportData",
                data: JSON.stringify({"orgThirdAccount": orgThirdAccount, "receiverMail": e_mail}),
                dataType: 'json',
                headers: {'token': token},
                contentType: "application/json;charset=utf-8",
                beforeSend:function(mes){
                    layer.closeAll();
                    layer.open({type: 2,content: '发送中，请稍后。'});
                },
                success: function (data) {
                    layer.closeAll();
                    if (data.code == 0) {
                        layer.open({
                            content: '发送成功'
                            ,skin: 'msg'
                            ,time: 1 //2秒后自动关闭
                        });
                    }else{
                        layer.open({
                            content: '发送失败'
                            ,skin: 'msg'
                            ,time: 1 //2秒后自动关闭
                        });
                    }
                }
            })
        }
    })
}
function setEmail(obj){
    e_mail = $(obj).val();
}
