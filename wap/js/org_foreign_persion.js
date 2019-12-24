
function datedifference(sDate) {    //sDate1和sDate2是2006-12-18格式
    var dateSpan,
        tempDate,
        iDays;
    var sDate1 = Date.parse(new Date());
    var sDate2 = Date.parse(sDate);
    dateSpan = sDate2 - sDate1;
    dateSpan = Math.abs(dateSpan);
    iDays = Math.floor(dateSpan / (24 * 3600 * 1000));
    return iDays
};
function updateList(obj,id){
    $.ajax({
        xhrFields: {
            withCredentials: true
        },
        type: 'post',
        url: base_url + "html5/v1/foreignPersion/findByOrgCode",
        data: JSON.stringify({"orgCode":prjvorgMsg.baseNo}),
        dataType:'json',
        headers : {'token':token},
        contentType: "application/json;charset=utf-8",
        beforeSend: function(XMLHttpRequest) {
            $(".warp_jm").show();
            $(".warp_jm").html("<div class='warp_jz'><img src='../wap/img/preloader.gif' style='width:44px;height:44px; margin:0 auto;display:block;position: absolute;left: 50%;top: 50%;margin: -12px 0 0 -12px'/></div>");
        },
        success: function (data) {
            $(".warp_jm").hide();
            $(".warp_jm").empty();
            if (data.code == 0) {
                layer.open({
                    content: '更新成功！'
                    ,skin: 'msg'
                    ,time: 1 //2秒后自动关闭
                });

                var datas = data.data;
                $.each(datas, function (index, val) {
                    if(val.id==id){
                        var psrents=$(obj).parents('li');

                        var sex = (val.sex == 2) ? '女' : '男';
                        var cardType = "";
                        if(val.cardType=="SFZ"){cardType = "身份证"}
                        if(val.cardType=="HZ"){cardType = "护照"}
                        if(val.cardType=="GAT"){cardType = "港澳台"}
                        if(val.cardType=="QT"){cardType = "其他"}
                        var li='<div style="padding: 10px 0px;">\n' +
                            '                                    <img src="' + val.headPic + '" style="float: right;width: 90px;height: 110px;margin-right: 10px;">\n' +
                            '                                    <div style="line-height: 30px">姓名：' + val.name + '</div>\n' +
                            '                                    <div style="line-height: 30px;">性别：<b style="margin-right: 30px;font-weight:normal;">' + sex + '</b>国籍：' + val.country + '</div>\n' +
                            '                                    <div style="line-height: 30px">出生日期：' + val.birthday + '</div>\n' +
                            '                                    <div style="line-height: 30px">登录账号：' + val.loginName + '</div>\n' +
                            '                                    <div style="line-height: 30px">证件类型：' + cardType + '</div>\n' +
                            '                                    <div style="line-height: 30px">证件号码：' + val.cardNo + '</div>\n' +
                            '                                    <div style="line-height: 30px">证件有效期：' + val.startDay+'至'+val.endDay +'</div>\n' +
                            '                                    <div style="line-height: 30px">公益护照编号：' + val.passport + '</div>\n' +
                            '                                    <div style="line-height: 30px">公益护照有效期：' + val.pstart+'至'+val.pend +'</div>\n'+
                            '                                    <div style="line-height: 30px">签发机构：' + val.orgName + '</div>\n' +
                            '                                </div>'
                        psrents.html(li)
                    }
                })
            }else{
                layer.open({
                    content: data.msg
                    ,skin: 'msg'
                    ,time: 3 //2秒后自动关闭
                });
            }
        },
        error: function (e) {
            layer.open({
                content: '更新失败！'
                ,skin: 'msg'
                ,time: 2 //2秒后自动关闭
            });
        }
    });
};
function renewPost(obj,id){
    $(obj).removeAttr('onclick','');
    layer.open({
        title:'提示',
        content: '您确定续签？'
        ,btn: ['确定', '取消']
        ,yes: function(index){
            layer.closeAll();
            $.ajax({
                xhrFields: {
                    withCredentials: true
                },
                type: 'post',
                url: base_url + "html5/v1/foreignPersion/renew",
                data: JSON.stringify({"id":id}),
                dataType:'json',
                headers : {'token':token},
                contentType: "application/json;charset=utf-8",
                beforeSend: function(XMLHttpRequest) {
                    $(".warp_jm").show();
                    $(".warp_jm").html("<div class='warp_jz'><img src='../wap/img/preloader.gif' style='width:44px;height:44px; margin:0 auto;display:block;position: absolute;left: 50%;top: 50%;margin: -12px 0 0 -12px'/></div>");
                },
                success: function (data) {
                    $(".warp_jm").hide();
                    $(".warp_jm").empty();
                    if (data.code == 0) {
                        layer.open({
                            content: '续签成功！'
                            ,skin: 'msg'
                            ,time: 1 //2秒后自动关闭
                        });
                        updateList(obj,id)
                        // setTimeout(function(){jump("../org/institutions.html");},2000);
                    }else{
                        $(obj).attr('onclick','renewPost(this,'+id+')');
                        layer.open({
                            content: data.msg
                            ,skin: 'msg'
                            ,time: 3 //2秒后自动关闭
                        });
                    }
                },
                error: function (e) {
                    $(obj).attr('onclick','renewPost(this,'+id+')');
                    layer.open({
                        content: '续签失败！'
                        ,skin: 'msg'
                        ,time: 2 //2秒后自动关闭
                    });
                }
            });
        }
        ,no: function(){
            $(obj).attr('onclick','renewPost(this,'+id+')');
        }
    });
}

var orgThirdAccount= $_GET['orgThirdAccount'], type= $_GET['type'];
function get_list(url){
    var html = '';
    var data1 = {"orgCode":prjvorgMsg.baseNo};
    if(url=="html5/v1/foreignPersion/findByOrgCodeAndCardNo"){
        data1.cardNo = $(".nameNo").val();
    }
    $.ajax({
        xhrFields: {
            withCredentials: true
        },
        type:"post",
        url:base_url + url,
        data:JSON.stringify(data1),
        dataType:'json',
        headers : {'token':token},
        contentType: "application/json;charset=utf-8",
        success:function(data){
            //console.log(data);
            if(data.code==0){
                var data1 = data.data;
                var html = "";
                if(url=="html5/v1/foreignPersion/findByOrgCode") {
                    $.each(data1, function (index, val) {
                        var sex = (val.sex == 2) ? '女' : '男';
                        var cardType = "";
                        if(val.cardType=="SFZ"){cardType = "身份证"}
                        if(val.cardType=="HZ"){cardType = "护照"}
                        if(val.cardType=="GAT"){cardType = "港澳台"}
                        if(val.cardType=="QT"){cardType = "其他"}

                        var ofp_time_txt='';
                        var ofp_btn_continue='';
                        if(val.pend){
                            var isLast=val.pend;
                            var timestamp = new Date(isLast).getTime();
                            var nowdate = new Date().getTime(); // 获取当前时间
                            if(nowdate>timestamp){
                                console.log('已过期')
                                ofp_time_txt='<span style="color:#F8960A;padding:0 5px;">已过期</span>';
                                ofp_btn_continue='<div style="text-align:center;padding:10px;"><button onclick="renewPost(this,'+val.id+')" style="display:inline-block;border-radius:6px;padding:10px 20px;color:#fff;background-color:#F8960A;">为Ta续签临时公益护照</button><p style="color:#999;padding:0 10px;font-size:14px;line-height:28px;">自续签成功日开始，一年内有效</p></div>'
                            }else if(datedifference(isLast)<30){
                                console.log('即将过期')
                                ofp_time_txt='<span style="color:#F8960A;padding:0 5px;">即将过期</span>';
                                ofp_btn_continue='<div style="text-align:center;padding:10px;"><button onclick="renewPost(this,'+val.id+')" style="display:inline-block;border-radius:6px;padding:10px 20px;color:#fff;background-color:#F8960A;">为Ta续签临时公益护照</button><p style="color:#999;padding:0 10px;font-size:14px;line-height:28px;">自续签成功日开始，一年内有效</p></div>'
                            }else {
                                console.log('未过期')
                            }
                        }


                        html += '<li style="background: #FFFFFF;width: 100%;height: auto;padding-left: 3%;margin-bottom: 5px;border:0px;">\
                                <div style="padding: 10px 0px;">\
                                    <img src="' + val.headPic + '" style="float: right;width: 90px;height: 110px;margin-right: 10px;">\
                                    <div style="line-height: 30px">姓名：' + val.name + '</div>\
                                    <div style="line-height: 30px;">性别：<b style="margin-right: 30px;font-weight:normal;">' + sex + '</b>国籍：' + val.country + '</div>\
                                    <div style="line-height: 30px">出生日期：' + val.birthday + '</div>\
                                    <div style="line-height: 30px">登录账号：' + val.loginName + '</div>\
                                    <div style="line-height: 30px">证件类型：' + cardType + '</div>\
                                    <div style="line-height: 30px">证件号码：' + val.cardNo + '</div>\
                                    <div style="line-height: 30px">证件有效期：' + val.startDay+'至'+val.endDay +'</div>\
                                    <div style="line-height: 30px">公益护照编号：' + val.passport + '</div>\
                                    <div style="line-height: 30px">公益护照有效期：' + val.pstart+'至'+val.pend +ofp_time_txt+'</div>\
                                    <div style="line-height: 30px">签发机构：' + val.orgName + '</div>\
                                    '+ofp_btn_continue+'\
                                </div>\
                            </li>';
                        //<div style="line-height: 30px">手机号：'+val.mobile+'</div>\
                        //<div style="line-height: 30px">有效期：' + val.createTime.substring(0, val.createTime.length - 9) + '</div>\
                    })
                }else{
                    if(data1){
                        var sex = (data1.sex == 2) ? '女' : '男';
                        var cardType = "";
                        if(data1.cardType=="SFZ"){cardType = "身份证"}
                        if(data1.cardType=="HZ"){cardType = "护照"}
                        if(data1.cardType=="GAT"){cardType = "港澳台"}
                        if(data1.cardType=="QT"){cardType = "其他"}

                        var ofp_time_txt='';
                        var ofp_btn_continue='';
                        if(data1.pend){
                            var isLast=data1.pend;
                            var timestamp = new Date(isLast).getTime();
                            var nowdate = new Date().getTime(); // 获取当前时间
                            if(nowdate>timestamp){
                                console.log('已过期')
                                ofp_time_txt='<span style="color:#F8960A;padding:0 5px;">已过期</span>';
                                ofp_btn_continue='<div style="text-align:center;padding:10px;"><button onclick="renewPost(this,'+data1.id+')" style="display:inline-block;border-radius:6px;padding:10px 20px;color:#fff;background-color:#F8960A;">为Ta续签临时公益护照</button><p style="color:#999;padding:0 10px;font-size:14px;line-height:28px;">自续签成功日开始，一年内有效</p></div>'
                            }else if(datedifference(isLast)<30){
                                console.log('即将过期')
                                ofp_time_txt='<span style="color:#F8960A;padding:0 5px;">即将过期</span>';
                                ofp_btn_continue='<div style="text-align:center;padding:10px;"><button onclick="renewPost(this,'+data1.id+')" style="display:inline-block;border-radius:6px;padding:10px 20px;color:#fff;background-color:#F8960A;">为Ta续签临时公益护照</button><p style="color:#999;padding:0 10px;font-size:14px;line-height:28px;">自续签成功日开始，一年内有效</p></div>'
                            }else {
                                console.log('未过期')
                            }
                        }

                        html += '<li style="background: #FFFFFF;width: 100%;height: auto;padding-left: 3%;margin-bottom: 5px;border:0px;">\
                                <div style="padding: 10px 0px;">\
                                    <img src="' + data1.headPic + '" style="float: right;width: 90px;height: 110px;margin-right: 10px;">\
                                    <div style="line-height: 30px">姓名：' + data1.name + '</div>\
                                    <div style="line-height: 30px;">性别：<b style="margin-right: 30px;font-weight:normal;">' + sex + '</b>国籍：' + data1.country + '</div>\
                                    <div style="line-height: 30px">出生日期：' + data1.birthday + '</div>\
                                    <div style="line-height: 30px">登录账号：' + data1.loginName + '</div>\
                                    <div style="line-height: 30px">证件类型：' + cardType + '</div>\
                                    <div style="line-height: 30px">证件号码：' + data1.cardNo + '</div>\
                                    <div style="line-height: 30px">证件有效期：' + data1.startDay+'至'+data1.endDay + '</div>\
                                    <div style="line-height: 30px">公益护照编号：' + data1.passport + '</div>\
                                    <div style="line-height: 30px">公益护照有效期：' + data1.pstart+'至'+data1.pend +ofp_time_txt+'</div>\
                                    <div style="line-height: 30px">签发机构：' + data1.orgName + '</div>\
                                    '+ofp_btn_continue+'\
                                </div>\
                            </li>';
                    }
                }
                if(html==""){
                    html +='<li style="background: #FFFFFF;width: 100%;height: auto;padding-left: 3%;margin-bottom: 5px;border:0px;">\
                                <a href="javascript:void(0)" style="background: none;">\
                                    <b>暂无数据</b>\
                                    </a>\
                            </li>';
                }
                $(".warp_pws_g").html(html);
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
