$(function() {
    $.ajax({
        xhrFields: {
            withCredentials: true
        },
        type: 'post',
        url: base_url + "/html5/v1/station/postApply/queryDayList",
        data: JSON.stringify({"pkPostCode": pkPostCode, "user": user_msg.userId}),
        dataType: 'json',
        headers: {'token': token},
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (data.code == 0) {
                dayList = data.data;
                dayListLength = dayList.length;
                $.each(dayList, function (k, val) {
                    var date = new Date(val.day);
                    var nowYear = date.getFullYear();
                    var nowMonth = date.getMonth() + 1;
                    var nowDay = date.getDate();
                    dayListStr += nowYear+"-"+nowMonth+"-"+nowDay+",";
                    if(val.isApply==1 &&　type!="group"){
                        hasQuestionNull = 1;
                        dayListLength -= 1;
                        appliedDayList += nowYear+"-"+nowMonth+"-"+nowDay+",";
                    }
                })
            }
        }
    })
    $.ajax({
        xhrFields: {
            withCredentials: true
        },
        type: 'post',
        url: base_url + "/html5/v1/newTask/subTaskDetail",
        data: JSON.stringify({"subCode": pkPostCode}),
        dataType: 'json',
        headers: {'token': token},
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (data.code == 0) {
                var data_index = data.data;

                // if(data_index.state==30){
                //     $(".applyFooter").hide();
                // }
                var timestamp = new Date(data_index.endTime).getTime();
                var nowdate = new Date().getTime(); // 获取当前时间
                if(nowdate>timestamp){
                    $(".applyFooter").hide()
                }

                reqAttendTimes= data_index.reqAttendTimes;
                $("#name").html(data_index.name);
                $("#content").html(data_index.content);
                $("#serviceTime").html(data_index.beginTime+"至"+data_index.endTime);
                $("#address").html(data_index.address);
                $("#serverTarget").html(data_index.serverTargetName);
                $("#needNum").html(data_index.needNum);
                $("#contactName").html(data_index.contactName);
                $("#contactTel").html(data_index.contactTel);
                $("#fieldAdminName").html(data_index.contactMobile);
                $("#fieldAdmin").html(data_index.consultantName);
                if(data_index.applyTimeType==2){
                    if(data_index.applyBeginTime && data_index.applyEndTime){
                        $("#applyTime").html(data_index.applyBeginTime+"   -   "+data_index.applyEndTime);
                    }else{
                        $("#applyTimeLi").hide();
                    }
                }else{
                    if(data_index.applyTimeType==0){
                        $("#applyTime").html("岗位每次服务结束前可报名");
                    }
                    if(data_index.applyTimeType==1){
                        $("#applyTime").html("岗位每次服务开始前可报名");
                    }
                }

                var applyType = "";

                if(data_index.applyType==0){
                    applyType += "仅本机构成员或团体报名";
                }else if(data_index.applyType==1){
                    applyType += "仅个人报名";
                }else if(data_index.applyType==2){
                    applyType += "仅团体报名";
                }else if(data_index.applyType==3){
                    applyType += "个人或团体均可报名";
                }else if(data_index.applyType==4){
                    applyType += "仅结盟机构团体报名";
                }else if(data_index.applyType==5){
                    applyType += "指定结盟机构团体报名";
                }

                if(data_index.isAudit==0){
                    applyType += "<br /><span>无需审核</span>";
                }else if(data_index.isAudit==1){
                    applyType += "<br /><span style='padding-left:1.15rem;line-height:2.4;'>需审核</span>";
                }

                $("#applyType").html(applyType);
                $("#point").html(data_index.point);
                $("#welfare").html(data_index.welfareName=='请选择'?'':data_index.welfareName);
                $("#orgName").html(data_index.orgName);
                hasQuestion = data_index.hasQuestion;
                // hasQuestion=1;
                if(hasQuestion==1){
                    getQuestion();
                }
                if(data_index.orgLogo){
                    $("#orgLogo").attr("src", data_index.orgLogo);
                }
                $(".img-li").attr("onclick","jump('../huangye/mobileDetail.html?prjvOrgId="+data_index.orgId+"');");
                //applyType
            }
        }
    });
})
function closeDiv(css){
    $(".warp").show();
    $("."+css).hide();
    if(css=="date_div"){
        //ajaxPage( "scrA", "../wap/js/user/user.js" );
        closeData();
    }
}
var applyDayList = [], dayList = {}, dayListStr = "", appliedDayList = "", dayListLength = 0, optional = 0, userList = [];
function openDiv(css){
    $(".warp").hide();
    $("."+css).show();
    var h = 0;
    $(".user-list-ul li").each(function(i, obj) {
        if(obj.offsetHeight>h){
            h = obj.offsetHeight;
        }
    });
    $(".user-list-ul li").each(function(i, obj) {
        $(obj).height(h);
    });
}
function openDiv_(css){
    if(selectNum>0){
        $(".warp").show();
        // $("."+css).show();
        //$(".select-time").click();
        $(".user_div").hide();
        apply()
    }else{
        layer.open({
            content: "请至少选择1人"
            ,skin: 'msg'
            ,time: 2 //2秒后自动关闭
        });
    }
}
function apply(){

    if(groupType==1){
        $.each($(".select"), function () {
            //<i id="'+val.prjvUserId+'" data-headImg="'+val.headUrl+'" data-mobile="'+val.mobile+'" data-nickName="'+val.realName+'" class="mect_sc"></i>\
            var user = {};
            user.headImg = $(this).attr("data-headImg");
            user.mobile = $(this).attr("data-mobile");
            user.nickName = $(this).attr("data-nickName");
            user.user = $(this).attr("id");
            userList.push(user);
        });
        layer.open({
            content: '确定报名吗？'
            , btn: ['确定', '取消']
            , yes: function (index) {
                $.ajax({
                    xhrFields: {
                        withCredentials: true
                    },
                    type: 'post',
                    url: base_url + "/html5/v1/newTask/groupApply",
                    data: JSON.stringify({"orgCode": prjvorgMsg.orgThirdAccount, "orgName": prjvorgMsg.orgThirdAccountName, "subCode": $.getUrlParam("pkPostCode"), "userList": userList}),
                    dataType: 'json',
                    headers: {'token': token},
                    contentType: "application/json;charset=utf-8",
                    success: function (data) {
                        layer.open({
                            content: data.msg
                            ,skin: 'msg'
                            ,time: 2 //2秒后自动关闭
                        });
                        if (data.code == 0) {
                            setTimeout(function(){window.location.href="./task_already_apply_list.html?type=1";},1000);
                        }
                    },
                    error: function (e) {
                        layer.open({
                            content: '报名失败！'
                            ,skin: 'msg'
                            ,time: 2 //2秒后自动关闭
                        });
                    }
                })
            }
        });

    }else {
        layer.open({
            content: '确定报名吗？'
            , btn: ['确定', '取消']
            , yes: function (index) {
                $.ajax({
                    xhrFields: {
                        withCredentials: true
                    },
                    type: 'post',
                    url: base_url + "/html5/v1/newTask/apply",
                    data: JSON.stringify({"subCode": $.getUrlParam("pkPostCode"), "user": user_msg.userId}),
                    dataType: 'json',
                    headers: {'token': token},
                    contentType: "application/json;charset=utf-8",
                    success: function (data) {
                        if (data.code == 0) {
                            layer.open({
                                content: '报名成功！'
                                ,skin: 'msg'
                                ,time: 2 //2秒后自动关闭
                            });
                            // setTimeout(function(){jump("./personal_post_list.html");},2000);
                        }else{
                            layer.open({
                                content: data.msg
                                ,skin: 'msg'
                                ,time: 2 //2秒后自动关闭
                            });
                        }
                    },
                    error: function (e) {
                        layer.open({
                            content: '报名失败！'
                            ,skin: 'msg'
                            ,time: 1 //2秒后自动关闭
                        });
                    }
                })
            }
        });

    }
    // if(type=="group"){
    //     $.each($(".select"), function () {
    //         //<i id="'+val.prjvUserId+'" data-headImg="'+val.headUrl+'" data-mobile="'+val.mobile+'" data-nickName="'+val.realName+'" class="mect_sc"></i>\
    //         var user = {};
    //         user.headImg = $(this).attr("data-headImg");
    //         user.mobile = $(this).attr("data-mobile");
    //         user.nickName = $(this).attr("data-nickName");
    //         user.user = $(this).attr("id");
    //         userList.push(user);
    //     })
    //     $.ajax({
    //         xhrFields: {
    //             withCredentials: true
    //         },
    //         type: 'post',
    //         url: base_url + "/html5/v1/station/groupApply/apply",
    //         data: JSON.stringify({"orgCode": prjvorgMsg.orgThirdAccount, "orgName": prjvorgMsg.orgThirdAccountName, "pkPostCode": $.getUrlParam("pkPostCode"), "pkUnitCodeList":applyDayList, "userList": userList}),
    //         dataType: 'json',
    //         headers: {'token': token},
    //         contentType: "application/json;charset=utf-8",
    //         success: function (data) {
    //             layer.open({
    //                 content: data.msg
    //                 ,skin: 'msg'
    //                 ,time: 2 //2秒后自动关闭
    //             });
    //             if (data.code == 0) {
    //                 setTimeout(function(){window.location.href="./group_already_apply_list.html?type=1";},1000);
    //             }
    //         },
    //         error: function (e) {
    //             layer.open({
    //                 content: '报名失败！'
    //                 ,skin: 'msg'
    //                 ,time: 2 //2秒后自动关闭
    //             });
    //         }
    //     })
    // }else{
    //     $.ajax({
    //         xhrFields: {
    //             withCredentials: true
    //         },
    //         type: 'post',
    //         url: base_url + "/html5/v1/station/postApply/apply",
    //         data: JSON.stringify({"pkPostCode": $.getUrlParam("pkPostCode"), "user": user_msg.userId, "pkUnitCodeList":applyDayList}),
    //         dataType: 'json',
    //         headers: {'token': token},
    //         contentType: "application/json;charset=utf-8",
    //         success: function (data) {
    //             if (data.code == 0) {
    //                 layer.open({
    //                     content: '报名成功！'
    //                     ,skin: 'msg'
    //                     ,time: 2 //2秒后自动关闭
    //                 });
    //                 setTimeout(function(){jump("./personal_post_list.html");},2000);
    //             }else{
    //                 layer.open({
    //                     content: data.msg
    //                     ,skin: 'msg'
    //                     ,time: 2 //2秒后自动关闭
    //                 });
    //             }
    //         },
    //         error: function (e) {
    //             layer.open({
    //                 content: '报名失败！'
    //                 ,skin: 'msg'
    //                 ,time: 1 //2秒后自动关闭
    //             });
    //         }
    //     })
    // }
}
function selectPhoto(id){
    if($("#"+id).is(':hidden')){　　//如果node是隐藏的则显示node元素，否则隐藏
        $("#"+id).addClass("select");
        selectNum += 1;
        $("#nextStep").val("下一步（"+selectNum+"）");
    }else{
        $("#"+id).removeClass("select");
        selectNum -= 1;
        $("#nextStep").val("下一步（"+selectNum+"）");
    }
    $("#"+id).toggle();
}
function selectAll(obj){
    var h = $(obj).val();
    //$("#selectAll").val("全选"+selectAllNum);
    if(h.indexOf("取消全选")== -1){
        selectNum = selectAllNum;
        $(obj).val("取消全选（"+selectAllNum+"）");
        $("#nextStep").val("下一步（"+selectAllNum+"）");
        $(".mect_sc").show();
        $(".mect_sc").addClass("select");
    }else{
        $(obj).val("全选（"+selectAllNum+"）");
        $("#nextStep").val("下一步（0）");
        selectNum = 0;
        $(".mect_sc").hide();
        $(".mect_sc").removeClass("select");
    }
}
function queryMembersForVerify(pageNumber, pageSize, type){
    $(".user-list-ul").html("");
    $('.user-list').dropload({
        scrollArea: window,
        loadDownFn: function (me) {
            $(".dropload-down").remove();
            pageNumber++;
            var data = {"prjvOrgId": prjvorgMsg.prjvOrgId, "pageSize": pageSize, "pageNumber": pageNumber};
            var searchContent = $("#name_input").val();
            if (searchContent) {
                data.searchContent = searchContent;
            }
            $.ajax({
                xhrFields: {
                    withCredentials: true
                },
                type: 'post',
                url: base_url + "/html5/v1/orgPlace/queryMembersForVerify",
                data: JSON.stringify(data),
                dataType: 'json',
                headers: {'token': token},
                contentType: "application/json;charset=utf-8",
                success: function (data) {
                    if (data.code == 0) {
                        var dayList = data.data.records;
                        var html = "";
                        selectAllNum = data.data.total;
                        $("#selectAll").val("全选（"+selectAllNum+"）");
                        if(dayList.length>0) {
                            $.each(dayList, function (k, val) {
                                var photo = "../wap/img/none.png";
                                if (val.elePhoto) {
                                    photo = val.elePhoto;
                                }
                                html += '<li onclick="selectPhoto(\'' + val.prjvUserId + '\')">\
                                                <div>\
                                                    <img class="photo" src="' + photo + '">\
                                                    <i id="' + val.prjvUserId + '" data-headImg="' + photo + '" data-mobile="' + val.mobile + '" data-nickName="' + val.realName + '" class="mect_sc"></i>\
                                                    ' + val.realName + '\
                                                </div>\
                                        </li>';
                            })
                            $(".user-list-ul").html(html);
                            me.resetload();
                        }else{
                            $(".noneLi").hide();
                            $(".user-list-ul").append(
                                "<li class='noneLi' style='background: #F2F2F2;width: 100%;'>\
                                    <a href='javascript:void(0)'>\
                                    <h3 style='text-align: center;'>已经没有更多啦。。。</h3>\
                                    </a>\
                                </li>");
                            me.lock();
                            me.noData();//无数据重置
                            me.resetload();
                        }
                    }else{
                        layer.open({
                            content: resp.msg
                            ,skin: 'msg'
                            ,time: 1
                        });
                        me.lock();
                        me.noData();
                    }
                },
                error:function(e){
                    layer.open({
                        content: '获取失败'
                        ,skin: 'msg'
                        ,time: 1
                    });
                    me.lock();
                    me.noData();//无数据重置
                    me.resetload();
                }
            })
        }
    })
    if(type==0){
        var data = {"prjvOrgId": prjvorgMsg.prjvOrgId, "pageSize": pageSize, "pageNumber": pageNumber};
        var searchContent = $("#name_input").val();
        if (searchContent) {
            data.searchContent = searchContent;
        }
        $.ajax({
            xhrFields: {
                withCredentials: true
            },
            type: 'post',
            url: base_url + "/html5/v1/orgPlace/queryMembersForVerify",
            data: JSON.stringify(data),
            dataType: 'json',
            headers: {'token': token},
            contentType: "application/json;charset=utf-8",
            success: function (data) {
                if (data.code == 0) {
                    var dayList = data.data.records;
                    selectAllNum = data.data.total;
                    $("#selectAll").val("全选（"+selectAllNum+"）");
                    var html = "";
                    if(dayList.length>0) {
                        $.each(dayList, function (k, val) {
                            var photo = "../wap/img/none.png";
                            if (val.elePhoto) {
                                photo = val.elePhoto;
                            }
                            html += '<li onclick="selectPhoto(\'' + val.prjvUserId + '\')">\
                                                <div>\
                                                    <img class="photo" src="' + photo + '">\
                                                    <i id="' + val.prjvUserId + '" data-headImg="' + val.headUrl + '" data-mobile="' + val.mobile + '" data-nickName="' + val.realName + '" class="mect_sc"></i>\
                                                    ' + val.realName + '\
                                                </div>\
                                        </li>';
                        })
                        $(".user-list-ul").html(html);
                    }else{
                        $(".noneLi").hide();
                        $(".user-list-ul").append(
                            "<li class='noneLi' style='background: #F2F2F2;width: 100%;'>\
                                <a href='javascript:void(0)'>\
                                <h3 style='text-align: center;'>已经没有更多啦。。。</h3>\
                                </a>\
                            </li>");
                    }
                }else{
                    layer.open({
                        content: resp.msg
                        ,skin: 'msg'
                        ,time: 1
                    });
                }
            },
            error:function(e){
                layer.open({
                    content: '获取失败'
                    ,skin: 'msg'
                    ,time: 1
                });
            }
        })
    }
}

function getQuestion(){
    // alert('1')
    $.ajax({
        xhrFields: {
            withCredentials: true
        },
        type: 'post',
        url: base_url + "/html5/v1/station/question/list",
        data: JSON.stringify({"pkPostCode": mainCode,"user":user_msg.userId}),
        dataType: 'json',
        headers: {'token': token},
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (data.code == 0) {
                var list = data.data, html="", htmlnull="";

                var typeHas = $.getUrlParam("type");

                if(list.length>0){
                    if(groupType==1){
                        $(".warp").hide(); // 问题显示
                        $(".question_div").show();
                    }

                }


                // list=[{
                //     "questionOptionList": [{
                //         "content": "06-01",
                //         "isStandard": 0
                //     },
                //         {
                //             "content": "07-01",
                //             "isStandard": 1
                //         },
                //         {
                //             "content": "08-01",
                //             "isStandard": 0
                //         }
                //     ],
                //     "title": "垃圾分类从几月几号正式开始呢"
                // },
                //     {
                //         "questionOptionList": [{
                //             "content": "2",
                //             "isStandard": 0
                //         },
                //             {
                //                 "content": "3",
                //                 "isStandard": 0
                //             },
                //             {
                //                 "content": "4",
                //                 "isStandard": 1
                //             }
                //         ],
                //         "title": "垃圾分类有几种分类"
                //     }
                // ]
                questionLength = list.length;
                $.each(list, function (k, val) {
                    htmlnull += val.title;
                    html += "<li class='question'>\
                                    "+val.title+"\
                             </li>"
                    $.each(val.questionOptionList, function (k1, option) {
                        htmlnull += option.content;
                        if(option.content){
                            html += "<li class='answer "+option.questionId+"' onclick='selectOption(this,\""+option.questionId+"\", \""+option.id+"\")' data-id='"+option.questionId+"' data-seq='"+option.seq+"'>\
                                    "+option.content+"<div class='"+option.questionId+"_answer' id='"+option.id+"'></div>\
                                 </li>";
                        }
                    })
                })
                if($.trim(htmlnull)==""){
                    hasQuestionNull = 1;
                }
                $(".question_ul").html(html);
            }
        }
    })
}

function selectOption(obj, questionId, id){
    if($(obj).hasClass('selectOption')){
        $("."+questionId).removeClass("selectOption");
        $(obj).removeClass("selectOption");
        $("."+questionId+"_answer").hide();
    }else{
        $("."+questionId).removeClass("selectOption");
        $(obj).addClass("selectOption");
        $("."+questionId+"_answer").hide();
        $("#"+id).show();
    }
}
var questionLength = 0;
function applyQuestion(){
    var answerList = [], ifChooseSeq = 0;
    $.each($(".selectOption"), function () {
        ifChooseSeq ++;
        var question = {};
        question.questionId = $(this).attr("data-id");
        question.chooseSeq = $(this).attr("data-seq");
        answerList.push(question);
    })
    if(questionLength>ifChooseSeq){
        layer.open({
            content: '请完成问卷！'
            ,skin: 'msg'
            ,time: 3 //2秒后自动关闭
        });
        return;
    }
    $.ajax({
        xhrFields: {
            withCredentials: true
        },
        type: 'post',
        url: base_url + "/html5/v1/station/question/answer",
        data: JSON.stringify({"pkPostCode": pkPostCode, "answerList": answerList, "user": user_msg.userId}),
        dataType: 'json',
        headers: {'token': token},
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (data.code == 0) {
                /*layer.open({
                    content: '提交成功！'
                    ,skin: 'msg'
                    ,time: 3 //2秒后自动关闭
                });*/
                $(".warp").show();
                $(".question_div").hide();
                // apply();
            }else{
                layer.open({
                    content: data.msg
                    ,skin: 'msg'
                    ,time: 1 //2秒后自动关闭
                });
            }
        },
        error: function (e) {
            layer.open({
                content: '提交失败！'
                ,skin: 'msg'
                ,time: 1 //2秒后自动关闭
            });
        }
    })
}
