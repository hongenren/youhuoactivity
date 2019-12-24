var orgThirdAccount= $_GET['orgThirdAccount'], type= $_GET['type'];
$(function() {
    get_list(0, 4);
})
function get_list(pageNumber,pageSize){
    $('#content').dropload({
        scrollArea: window,
        loadDownFn: function (me) {
            $(".dropload-down").remove();
            pageNumber++;
            var u = "html5/v1/license/queryLicenseCurrentMonthByOrgThirdAccount";
            if (type == 1) {
                u = "html5/v1/license/queryLicenseByOrgThirdAccount";
            }
            var html = '';
            $.ajax({
                xhrFields: {
                    withCredentials: true
                },
                type: "post",
                url: base_url + u,
                data: JSON.stringify({"orgThirdAccount": orgThirdAccount, "searchContent": $(".nameNo").val(), "pageNumber": pageNumber, "pageSize":pageSize}),
                dataType: 'json',
                headers: {'token': token},
                contentType: "application/json;charset=utf-8",
                success: function (data) {
                    //console.log(data);
                    if (data.code == 0) {
                        var data1 = data.data.records;
                        var html = "";
                        $.each(data1, function (index, val) {
                            html += '<li style="background: #FFFFFF;width: 100%;height: auto;padding-left: 3%;margin-bottom: 5px;border:0px;">\
                                        <div style="padding: 10px 0px;">\
                                            <div style="line-height: 30px">姓名：' + val.realName + '</div>\
                                            <div style="line-height: 30px;">性别：<b style="margin-right: 30px;font-weight:normal;">' + val.sex + '</b>国籍：' + val.nationality + '</div>\
                                            <div style="line-height: 30px">出生日期：' + val.birthday + '</div>\
                                            <div style="line-height: 30px">手机号：' + val.mobile + '</div>\
                                            <div style="line-height: 30px">公益护照编号：' + val.licenseCode + '</div>\
                                            <div style="line-height: 30px">申请日期：' + val.applyTime + '</div>\
                                        </div>\
                                    </li>';
                        })
                        if (html == "") {
                            html += '<li style="background: #FFFFFF;width: 100%;height: auto;padding-left: 3%;margin-bottom: 5px;border:0px;">\
                                        <a href="javascript:void(0)">\
                                            <b>暂无数据</b>\
                                            </a>\
                                    </li>';
                            me.lock();
                            me.noData();  //无数据重置
                        }
                        $(".warp_pws_g").append(html);
                        me.resetload();
                    } else {
                        layer.open({
                            content: data.msg
                            , skin: 'msg'
                            , time: 1 //2秒后自动关闭
                        });
                        me.lock();
                        me.noData();  //无数据重置
                        me.resetload();
                        return false;
                    }

                },
                error: function () {
                    layer.open({
                        content: '获取失败'
                        , skin: 'msg'
                        , time: 1 //2秒后自动关闭
                    });
                    me.lock();
                    me.noData();  //无数据重置
                    me.resetload();
                    return false;
                }
            })
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