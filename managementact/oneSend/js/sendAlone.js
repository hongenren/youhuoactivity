$(function () {
    $("#qfHref").attr('href', '../broadcast.html?' + urlGet());
    $("#dfHref").attr('href', 'sendAlone.html?' + urlGet());
    var userIds = "";
    //切换列表选中
    // $(document).on('click', '#cleanContent', function () {
    $("#cleanContent").click(function () {
        $("#search").val("");
    });
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

    //搜索
    $(document).on('click', '.sendInspectSearchRight', function () {
        var searchContent = $("#search").val();
        if (searchContent == "") {
            getList();
            return;
        }
        var lists = [];
        var activityCode = $.getUrlParam("activityCode");
        var token = $.cookie('token');
        $.ajax({
            url: base_url + '/html5/v1/activity/queryApplies',
            type: "post",
            dataType: "json",
            headers: {'token': token},
            data: JSON.stringify({"activityCode": activityCode}),
            contentType: "application/json",
            async: false,
            success: function (resp) {
                if (resp.code == 0) {
                    var list = resp.data;
                    if (list.length == 0) {
                        alert("没有人参加活动");
                        $("#initList").html(html);
                    } else {
                        for (var i in list) {
                            var users = [];
                            var lenth = list[i].user.length;
                            if (lenth <= 7) {
                                // var user = "userId:" + list[i].user;
                                var headImg = list[i].headImg;
                                if (headImg == "" || headImg == undefined || headImg == null) {
                                    headImg = "images/use.png";
                                }else {
                                    headImg = headImg+"?x-oss-process=image/crop,x_0,y_0";
                                }
                                users["nickName"] = list[i].nickName;
                                users["user"] = list[i].user;
                                users["headImg"] = headImg;
                                lists.push(users)
                            }
                        }
                        console.log(lists);
                    }
                } else {
                    alert("未知错误！");
                }
            }
        });
        var res = seachList(lists, searchContent);
        var html = "";
        for (var i = 0; i < res.length; i++) {
            var lenth = res[i].user.length;
            if (lenth <= 7) {
                var user = "userId:" + res[i].user;
                var headImg = res[i].headImg+"?x-oss-process=image/crop,x_0,y_0'";
                html += "<div class=\"sendInspectList\"  data-user='" + user + "'>\n" +
                    "                <button class=\"sendListCheck\"><input type=\"checkbox\"></button>\n" +
                    "                <div class=\"sendListUse\" style=\"background-image:url('" + headImg + "')\"></div>\n" +
                    "                <div class=\"sendListName\">\n" +
                    "                    <h2 data-user='" + res[i].user + "' data-head='" + headImg + "'>" + res[i].nickName + "</h2>\n" +
                    "                    <p>" + res[i].user + "</p>\n" +
                    "                </div>\n" +
                    "                <div class=\"sendListInfor\">\n" +
                    "                    <i></i>\n" +
                    "                    <span></span>\n" +
                    "                </div>\n" +
                    "            </div>";
            }
        }
        $("#initList").html(html);
    });

    function seachList(list, keyWord) {
        //字符串方法indexOf
        var len = list.length;
        var arr = [];
        for (var i = 0; i < len; i++) {
            //如果字符串中不包含目标字符会返回-1
            if (list[i]["nickName"].indexOf(keyWord) >= 0) {
                arr.push(list[i]);
            }
        }
        return arr;
    }

    //下一步弹层
    // $(document).on('click', '.sendNextButton', function () {
    $(".sendNextButton").click(function () {
        try {
            var list = [];
            $(".sendListCheck.on").each(function () {
                var users = $(this).parents('.sendInspectList').attr('data-user');
                list.push(users)
            });
            console.log(list.join(","));
            userIds = list.join(",");
            if (userIds == '') {
                alert("请选择发送对象！");
                return;
            }
            $(".sendAloneLayerWrap").show();
        } catch (error) {
            alert(error)
        }
    });
    // $(document).on('click', '.sendLayerClose', function () {
    $(".sendLayerClose").click(function () {
        $("#sendContent").val('请输入通知广播内容');
        $('.sendAloneLayerTxt').removeClass('on')
        $(".sendAloneLayerWrap").hide();
    });
    // $(document).on('click', '.sendLayerSubmit', function () {
    $(".sendLayerSubmit").click(function () {
        var msg = $("#sendContent").val();
        if (msg == "请输入通知广播内容" || msg == undefined || msg == null || msg == "") {
            alert("请输入内容！");
            return;
        }
        var user_msg = JSON.parse($.cookie('user_msg'));
        $.ajax({
            url: '//im.shcvs.cn/api/sendNoticeMsg',
            type: "post",
            dataType: "json",
            data: {
                "sourceClient": "prjvOrgId:" + user_msg.prjvOrgId,
                "clients": userIds,
                "message": msg
            },
            success: function (resp) {
                if (resp.success == true) {
                    alert("发送成功！");
                    window.location.reload();
                } else {
                    alert("发送失败！");
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

    function urlGet() {
        var aQuery = window.location.href.split("?");  //取得Get参数
        if (aQuery.length == 2) {
            return aQuery[1];
        } else {
            return "";
        }
    }


    getList();

    function getList() {
        var html = "";
        var activityCode = $.getUrlParam("activityCode");
        var token = $.cookie('token');
        $.ajax({
            url: base_url + '/html5/v1/activity/queryApplies',
            type: "post",
            dataType: "json",
            headers: {'token': token},
            data: JSON.stringify({"activityCode": activityCode}),
            contentType: "application/json",
            success: function (resp) {
                if (resp.code == 0) {
                    var list = resp.data;
                    if (list.length == 0) {
                        alert("没有人参加活动");
                        $("#initList").html(html);
                    } else {
                        var clients = '';
                        for (var i in list) {
                            var lenth = list[i].user.length;
                            if (lenth <= 7) {
                                var user = "userId:" + list[i].user;
                                var headImg = list[i].headImg;
                                if (headImg == "" || headImg == undefined || headImg == null) {
                                    headImg = "images/use.png";
                                }else {
                                    headImg = headImg+"?x-oss-process=image/crop,x_0,y_0";
                                }
                                html += "<div class=\"sendInspectList\"  data-user='" + user + "'>\n" +
                                    "                <button class=\"sendListCheck\"><input type=\"checkbox\"></button>\n" +
                                    "                <div class=\"sendListUse\" style=\"background-image:url('" + headImg + "')\"></div>\n" +
                                    "                <div class=\"sendListName\">\n" +
                                    "                    <h2 data-user='" + list[i].user + "' data-head='" + headImg + "'>" + list[i].nickName + "</h2>\n" +
                                    "                    <p>" + list[i].user + "</p>\n" +
                                    "                </div>\n" +
                                    "                <div class=\"sendListInfor\">\n" +
                                    "                    <i></i>\n" +
                                    "                    <span></span>\n" +
                                    "                </div>\n" +
                                    "            </div>";
                            }
                        }
                        $("#initList").html(html);
                    }
                } else {
                    alert("未知错误！");
                }
            }
        });
    }
});