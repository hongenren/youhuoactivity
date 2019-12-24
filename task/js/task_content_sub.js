$(function() {
    var urls='/html5/v1/newTask/subTaskDetail';
    var arr={
        "subCode": pkPostCode
    };
    // if(groupType==2){
    //     urls='/html5/v1/newTask/detail';
    //     arr={
    //         "mainCode":type
    //     }
    // }
    $.ajax({
        xhrFields: {
            withCredentials: true
        },
        type: 'post',
        url: base_url + "/html5/v1/station/postApply/queryDayList",
        // data: JSON.stringify({"pkPostCode": pkPostCode, "user": user_msg.userId}),
        data: JSON.stringify({"pkPostCode": pkPostCode}),
        dataType: 'json',
        // headers: {'token': token},
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
        url: base_url + urls,
        data: JSON.stringify(arr),
        dataType: 'json',
        // headers: {'token': token},
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (data.code == 0) {
                var data_index = data.data;

                // if(data_index.state==30){
                //     $(".applyFooter").hide();
                // }
                var timestamp = new Date(data_index.endTime).getTime();
                var nowdate = new Date().getTime(); // 获取当前时间
                // if(nowdate>timestamp){//判断时间显示按钮
                //     $(".applyFooter").hide()
                // }

                var serviceDomain=data_index.serviceDomain;
                var servicePlace=data_index.servicePlace;
                var serviceTarget=data_index.serviceTarget;
                var welfareName=data_index.welfareName=='请选择'?'暂无':data_index.welfareName;
                var labels=[];
                if(serviceDomain!==''){
                    if(serviceDomain.indexOf(',')){
                        var serviceDomains=serviceDomain.split(',');
                        $.each(serviceDomains,function(index,item){
                            labels.push(item)
                        })
                    }else {
                        labels.push(serviceDomain)
                    }
                }
                if(servicePlace!==''){
                    if(servicePlace.indexOf(',')){
                        var servicePlaces=servicePlace.split(',');
                        $.each(servicePlaces,function(index,item){
                            labels.push(item)
                        })
                    }else {
                        labels.push(servicePlace)
                    }
                }
                if(serviceTarget!==''){
                    if(serviceTarget.indexOf(',')){
                        var serviceTargets=serviceTarget.split(',');
                        $.each(serviceTargets,function(index,item){
                            labels.push(item)
                        })
                    }else {
                        labels.push(serviceTarget)
                    }
                }
                if(labels.length>0){
                    $(".labelWrap").empty();
                    $.each(labels,function(index,item){
                        var li='<span>#'+item+'</span>';
                        $(".labelWrap").append(li)
                    })
                }
                var description=escapeHTML2(data_index.description);
                var consultantName=data_index.consultantName;
                var consultantMobile=data_index.consultantMobile;
                var managerName=data_index.managerName;
                var managerMobile=data_index.managerMobile;
                var content=data_index.content;
                var point=data_index.point==''?0:data_index.point;

                reqAttendTimes= data_index.reqAttendTimes;
                $("#name").html(data_index.name);
                $("#content").html(description);
                $("#consultantName").html(consultantName);
                $("#consultantMobile").html(consultantMobile);
                $("#managerName").html(managerName);
                $("#managerMobile").html(managerMobile);

                $("#times").html(data_index.beginTime+"至"+data_index.endTime);
                $("#address").html(data_index.address);
                $("#needNum").html(data_index.applyNum);
                $("#allNeed").html(data_index.needNum);
                $("#serviceTime").html(timeTransformToHour(data_index.serviceTime));
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

                if(content!==''){
                    $("#subContent").show().find('.subContent').text(content)
                }


                var applyType = "<p>报名条件：<i id=\"applyType\">";

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
                    applyType += "</i></p><p style=\"display:block;width:100%;\"><span style=\"opacity:0;\">报名条件：</span><i>无需审核";
                }else if(data_index.isAudit==1){
                    applyType += "</i></p><p style=\"display:block;width:100%;\"><span style=\"opacity:0;\">报名条件：</span><i>需审核";
                }

                if(data_index.hasQuestion==1){
                    applyType += "</i><span style=\"padding-left:.2rem;color:#999;\">报名时需填写调查问卷";
                }else {
                    applyType += "</i><span style=\"padding-left:.2rem;color:#999;\">";
                }
                applyType+='</span></p>'

                $(".applyType").html(applyType);
                $("#welfare").html(welfareName);
                $("#point").html(point);

                $("#orgName").html(data_index.orgName);
                if(data_index.orgLogo){
                    $("#orgLogo").attr("src", data_index.orgLogo);
                }

                hasQuestion = data_index.hasQuestion;
                // hasQuestion=1;
                if(hasQuestion==1){
                    // getQuestion();
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
    queryMembersForVerify(0,20,1)
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
        // $(".warp").show();
        // $("."+css).show();
        //$(".select-time").click();
        $(".user_div").hide();
        applyJudge()
    }else{
        layer.open({
            content: "请至少选择1人"
            ,skin: 'msg'
            ,time: 2 //2秒后自动关闭
        });
    }
}
var applyJudge=function(){
    if($.cookie('user_msg')==undefined||$.cookie('token')==undefined){
        layer.open({
            content: '请登陆后再进行操作'
            ,skin: 'msg'
            ,time: 1 //2秒后自动关闭
        });
        setTimeout(function(){
            window.location.href = '../login/login.html';
        },1000);
        return false
    }
    // console.log(hasQuestion)
    // var head = document.getElementsByTagName('head')[0];
    // var script = document.createElement('script');
    // script.type = 'text/javascript';
    // script.src = '../wap/js/user/user.js';
    // head.appendChild(script);
    if(hasQuestion==1){
        getQuestion()
    }else {
        apply()
    }
};
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

                        if (data.code == 0) {
                            layer.open({
                                content: data.msg
                                ,skin: 'msg'
                                ,time: 2 //2秒后自动关闭
                            });
                            // setTimeout(function(){window.location.href="./task_already_apply_list.html?type=1";},2000);
                            console.log($.getUrlParam('groupType'))
                            if($.getUrlParam('groupType')==1){
                                setTimeout(function(){window.location.href="./task_already_apply_list.html?type=1";},2000);
                            }else {
                                setTimeout(function(){window.location.href="./task_myOrder.html";},2000);
                            }

                        }else {
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
                            if($.getUrlParam('groupType')==1){
                                setTimeout(function(){window.location.href="./task_already_apply_list.html?type=1";},2000);
                            }else {
                                setTimeout(function(){window.location.href="./task_myOrder.html";},2000);
                            }
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

function getQuestion(){
    console.log(token)
    console.log(mainCode)
    $.ajax({
        xhrFields: {
            withCredentials: true
        },
        type: 'post',
        url: base_url + "html5/v1/station/question/list",
        data: JSON.stringify({"pkPostCode": mainCode}),
        dataType: 'json',
        headers: {'token': token},
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (data.code == 0) {
                var list = data.data, html="", htmlnull="";

                var typeHas = $.getUrlParam("type");

                if(list.length>0){
                    $(".warp").hide(); // 问题显示
                    $(".question_div").show();
                }else {
                    layer.open({
                        content: '没有调查问卷'
                        ,skin: 'msg'
                        ,time: 1 //2秒后自动关闭
                    });
                    $(".warp").show();
                    $(".question_div").hide();
                    $('#btn').attr("onclick","apply()");
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
            }else {
                layer.open({
                    content: data.msg
                    ,skin: 'msg'
                    ,time: 3 //2秒后自动关闭
                });
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
                layer.open({
                    content: '问题提交成功！'
                    ,skin: 'msg'
                    ,time: 3 //2秒后自动关闭
                });
                $(".warp").show();
                $(".question_div").hide();
                // $('#btn').attr("onclick","apply()");
                apply()
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
                content: '问题提交失败！'
                ,skin: 'msg'
                ,time: 1 //2秒后自动关闭
            });
        }
    })
}
