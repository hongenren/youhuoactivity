$(function () {
    var sendListCheck = function () {
        $('.sendInspectList').each(function () {
            var bool = $(this).find('input[type="checkbox"]').is(':checked');
            if (!bool) {
                $(this).find('.sendListCheck').removeClass('on')
            } else {
                $(this).find('.sendListCheck').addClass('on')
            }
        })
    };
    sendListCheck();
    $(document).on('click', '.sendInspectList', function () {
        var bool = $(this).find('input[type="checkbox"]').prop('checked');
        console.log(bool);
        if (!bool) {
            $(this).find('input[type="checkbox"]').prop('checked', true);
            sendListCheck();
        } else {
            $(this).find('input[type="checkbox"]').prop('checked', false);
            sendListCheck();
        }
    });
})
var clients = "", prjvOrgId = "", userIds = "";
function failList(pkPostCode){
    $.ajax({
        xhrFields: {
            withCredentials: true
        },
        type: 'post',
        url: base_url + "/html5/v1/station/detail",
        data: JSON.stringify({"pkPostCode": pkPostCode, "user": user_msg.userId}),
        dataType: 'json',
        headers: {'token': token},
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (data.code == 0) {
                prjvOrgId = data.data.orgId;
            }
        }
    })
    var queryDayListType = 2;
    if(type==1){
        queryDayListType = 4;
    }
    $.ajax({
        xhrFields: {
            withCredentials: true
        },
        type: 'post',
        url: base_url + "/html5/v1/station/postApply/queryDayList",
        data: JSON.stringify({"pkPostCode": pkPostCode, "type": queryDayListType}),
        dataType: 'json',
        headers: {'token': token},
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (data.code == 0) {
                var data_index = data.data;
                $.each(data_index, function (k, val) {
                    var date = new Date(val.day);
                    var nowYear = date.getFullYear();
                    var nowMonth = date.getMonth() + 1;
                    var nowDay = date.getDate();

                    if(minMonth==0){
                        minMonth = nowMonth;
                    }else{
                        if(nowMonth<minMonth){
                            minMonth = nowMonth;
                        }
                    }
                    months.push(nowMonth);
                    year = nowYear;
                    dayListStr += nowYear+"-"+nowMonth+"-"+nowDay+",";
                    pkUnitCodeList[nowYear+"-"+nowMonth+"-"+nowDay] = val.code;
                    auditNumList[nowYear+"-"+nowMonth+"-"+nowDay] = val.auditNum;
                    var html ='';
                    if(k<5){
                        if(pkUnitCodeZ!=""){
                            if(pkUnitCodeZ==val.code){
                                html ='<div class="succeed-list-title-div pitch-on" onclick="passListChoose(this, \''+val.code+'\', 0, 20);">\
                                    <div>\
                                        <span>'+getDate(0, val.day)+'</span>\
                                        <span>'+getDate(1, val.day)+'</span>\
                                        <span>'+val.auditNum+'</span>\
                                    </div>\
                                 </div>';
                                pkUnitCodeZ = val.code;
                                auditList(0, 20);
                            }else{
                                html ='<div class="succeed-list-title-div" onclick="passListChoose(this, \''+val.code+'\', 0, 20);">\
                                    <div>\
                                        <span>'+getDate(0, val.day)+'</span>\
                                        <span>'+getDate(1, val.day)+'</span>\
                                        <span">'+val.auditNum+'</span>\
                                    </div>\
                                 </div>';
                            }
                        }else{
                            if(k==0){
                                html ='<div class="succeed-list-title-div pitch-on" onclick="passListChoose(this, \''+val.code+'\', 0, 20);">\
                                    <div>\
                                        <span>'+getDate(0, val.day)+'</span>\
                                        <span>'+getDate(1, val.day)+'</span>\
                                        <span>'+val.auditNum+'</span>\
                                    </div>\
                                 </div>';
                                pkUnitCodeZ = val.code;
                                auditList(0, 20);
                            }else{
                                html ='<div class="succeed-list-title-div" onclick="passListChoose(this, \''+val.code+'\', 0, 20);">\
                                    <div>\
                                        <span>'+getDate(0, val.day)+'</span>\
                                        <span>'+getDate(1, val.day)+'</span>\
                                        <span>'+val.auditNum+'</span>\
                                    </div>\
                                 </div>';
                            }
                        }
                    }
                    $(".succeed-list-title").append(html);
                })
                // $(".succeed-list-title").append('<div class=\"succeed-list-title-div\" onclick="openDate();">\
                //                                      <div style=\"border: 0px\">\
                //                                      <img src="../wap/img/calendar.jpg">\
                //                                      </div>\
                //                                  </div>');
                $(".succeed-list").hide();
                $(".hided").css('marginTop',"45px")
            }
        }
    })
}
function openDate(){
    if($(".select_div").html().trim()==""){
        $('.succeed-list-ul').hide();
        $('.select-time').click();
        $.each(months, function (k, val) {
            $("#months_"+val).show();
        })
        $(".hided").hide();
    }else{
        $('.succeed-list-ul').show();
        closeData();
        $(".hided").show();
    }
}
function passListChoose(obj, code){
    $('.succeed-list-title-div').removeClass('pitch-on');
    $(obj).addClass('pitch-on');
    pkUnitCodeZ = code;
    auditList();
}
function auditList(){
    var json = {"pkUnitCode": pkUnitCodeZ, "state": 20, "pageNumber": 1, "pageSize":99999};
    if($("#search").val()){
        json.searchValue = $("#search").val();
    }
    clients = "";
    $.ajax({
        xhrFields: {
            withCredentials: true
        },
        type: 'post',
        url: base_url + "/html5/v1/station/postApply/auditList",
        data: JSON.stringify(json),
        dataType: 'json',
        headers: {'token': token},
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (data.code == 0) {
                var data_index = data.data.records;
                var html = "";
                $.each(data_index, function (k, val) {
                    if(type==0){
                        if (k <= 7) {
                            var user = "userId:" + val.user;
                            clients += user + ",";
                        }
                    }else{
                        var user = "userId:" + val.user;
                        var headImg = val.headImg + "?x-oss-process=image/crop,x_0,y_0'";
                        html += "<div class=\"sendInspectList\"  data-user='" + user + "'>\n" +
                            "                <button class=\"sendListCheck\"><input type=\"checkbox\"></button>\n" +
                            "                <div class=\"sendListUse\" style=\"background-image:url('" + headImg + "')\"></div>\n" +
                            "                <div class=\"sendListName\">\n" +
                            "                    <h2 data-user='" + val.user + "' data-head='" + headImg + "'>" + val.nickName + "</h2>\n" +
                            "                    <p>" + val.user + "</p>\n" +
                            "                </div>\n" +
                            "            </div>";
                        /*"                <div class=\"sendListInfor\">\n" +
                        "                    <i></i>\n" +
                        "                    <span></span>\n" +
                        "                </div>\n" +*/
                    }
                })
                $("#initList").html(html);
            }
        }
    })
}
function getDate(type, day){
    var date = new Date(day.replace(/\-/g,'/'));
    var Y = date.getFullYear().toString();
    var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1);
    var D = (date.getDate()< 10? '0' + date.getDate():date.getDate());
    if(type==0){
        return M + '-' + D;
    }else{
        var today = new Array('周日','周一','周二','周三','周四','周五','周六');
        var week = today[date.getDay()];
        return week;
    }
}


//用户列表点击事件
$(document).on('click', '.warp_pws_b_su', function () {
    var activityCode = $.getUrlParam("activityCode");
    var token = $.cookie('token');
    var msg = $(".warp_gl_q_sw").val();
    if (msg == '' || msg == null || msg == undefined) {
        layer.open({
            content: '请输入群发内容！'
            ,skin: 'msg'
            ,time: 2 //2秒后自动关闭
        });
        return;
    }
    if (clients == "") {
        layer.open({
            content: '没有人报名岗位！'
            ,skin: 'msg'
            ,time: 2 //2秒后自动关闭
        });
        return;
    }else{
        $.ajax({
            url: '//im.shcvs.cn/api/sendNoticeMsg',
            type: "post",
            dataType: "json",
            data: {
                "sourceClient": "prjvOrgId:" + prjvOrgId,
                "clients": clients,
                "message": msg
            },
            success: function (resp) {
                if (resp.success == true) {
                    layer.open({
                        content: '群发成功！'
                        ,skin: 'msg'
                        ,time: 2 //2秒后自动关闭
                    });
                    setTimeout(function(){window.location.reload();},1000);
                } else {
                    layer.open({
                        content: '群发失败！'
                        ,skin: 'msg'
                        ,time: 2 //2秒后自动关闭
                    });
                }
            }
        });
    }
});


//单发
$(".sendNextButton").click(function () {
    userIds = "";
    try {
        var list = [];
        $(".sendListCheck.on").each(function () {
            var users = $(this).parents('.sendInspectList').attr('data-user');
            list.push(users)
        });
        console.log(list.join(","));
        userIds = list.join(",");
        if (userIds == '') {
            layer.open({
                content: '请选择发送对象！'
                ,skin: 'msg'
                ,time: 2 //2秒后自动关闭
            });
            return;
        }
        $(".sendAloneLayerWrap").show();
    } catch (error) {
        layer.open({
            content: error
            ,skin: 'msg'
            ,time: 2 //2秒后自动关闭
        });
    }
});

$(".sendLayerClose").click(function () {
    $("#sendContent").val('请输入通知广播内容');
    $('.sendAloneLayerTxt').removeClass('on')
    $(".sendAloneLayerWrap").hide();
});

// $(document).on('click', '.sendLayerSubmit', function () {
$(".sendLayerSubmit").click(function () {
    var msg = $("#sendContent").val();
    if (msg == "请输入通知广播内容" || msg == undefined || msg == null || msg == "") {
        layer.open({
            content: '请输入内容！'
            ,skin: 'msg'
            ,time: 2 //2秒后自动关闭
        });
        return;
    }
    var user_msg = JSON.parse($.cookie('user_msg'));
    $.ajax({
        url: '//im.shcvs.cn/api/sendNoticeMsg',
        type: "post",
        dataType: "json",
        data: {
            "sourceClient": "prjvOrgId:" + prjvOrgId,
            "clients": userIds,
            "message": msg
        },
        success: function (resp) {
            if (resp.success == true) {
                layer.open({
                    content: '发送成功！'
                    ,skin: 'msg'
                    ,time: 2 //2秒后自动关闭
                });
                setTimeout(function(){window.location.reload();},1000);
            } else {
                layer.open({
                    content: '发送失败！'
                    ,skin: 'msg'
                    ,time: 2 //2秒后自动关闭
                });
            }
        }
    });
});
//弹层获取焦点失去焦点事件
$(document).on('focus', '.sendAloneLayerTxt textarea', function () {
    var txt = $(this).val();
    if (txt == '请输入通知广播内容') {
        $(this).val('');
        $('.sendAloneLayerTxt').addClass('on')
    }
}).on('blur', '.sendAloneLayerTxt textarea', function () {
    var txt = $(this).val();
    if (txt == '') {
        $(this).val('请输入通知广播内容');
        $('.sendAloneLayerTxt').removeClass('on')
    }
})
