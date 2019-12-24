
var auditApplyEvent=function(state,list){
    var subCode=$.getUrlParam('pkPostCode');
    console.log(list)
    var applyCodeList=[];
    if(list.indexOf('-')>0){
        applyCodeList=list.split('-')
    }else{
        applyCodeList.push(list)
    }
    var txt=state==20?'通过':'拒绝';
    console.log(applyCodeList)
    console.log(txt);
    if(subCode){
        layer.open({
            title:'提示',
            content: '您确定'+txt+'？'
            ,btn: ['确定', '取消']
            ,yes: function(index){
                layer.closeAll();
                var arr={
                    "subCode":subCode,
                    "state":state,
                    "applyCodeList":applyCodeList
                };
                $.ajax({
                    xhrFields: {
                        withCredentials: true
                    },
                    type: 'post',
                    url: base_url + "html5/v1/newTask/auditApply",
                    data: JSON.stringify(arr),
                    dataType:'json',
                    headers : {'token':token},
                    contentType: "application/json;charset=utf-8",
                    success: function (data) {
                        console.log(data)
                        if (data.code == 0) {
                            pageNum=1;
                            stateType=10;
                            $(".tem_enroll_list_wrap").empty();
                            applyListGet(pageNum,stateType);
                            taskScrollEvent();
                        }else{
                            layer.open({
                                content: data.msg
                                ,skin: 'msg'
                                ,time: 1
                            });
                        }
                    },
                    error: function(){
                        layer.open({
                            content: txt+'失败'
                            ,skin: 'msg'
                            ,time: 1
                        });
                    }
                });
            }
        });

    }
};
var temEnrollBtns=function(){
    var code='';
    $(".temGrBtn").unbind('click').click(function(){
        code=$(this).parents('.tem_enroll_btns').attr('data-code');
        auditApplyEvent(20,code);
    });
    $(".temReBtn").unbind('click').click(function(){
        code=$(this).parents('.tem_enroll_btns').attr('data-code');
        auditApplyEvent(-10,code);
    });

    //调查问卷
    // $(".tem_enroll_question_togBtn").unbind('click').click(function(){
    //     var subCode=$(this).parents('.tem_enroll_list').attr('data-sub');
    //     var user=$(this).parents('.tem_enroll_list').attr('data-user')||user_msg.userId;
    //
    //     var arr={
    //         "subCode":subCode,
    //         "user":user
    //     };
    //     console.log(arr);
    //     $.ajax({
    //         xhrFields: {
    //             withCredentials: true
    //         },
    //         type: 'post',
    //         url: base_url + "/html5/v1/station/question/list",
    //         data: JSON.stringify(arr),
    //         dataType:'json',
    //         headers : {'token':token},
    //         contentType: "application/json;charset=utf-8",
    //         success: function (data) {
    //             console.log(data)
    //             if (data.code == 0) {
    //
    //             }else{
    //                 layer.open({
    //                     content: data.msg
    //                     ,skin: 'msg'
    //                     ,time: 1
    //                 });
    //             }
    //         },
    //         error: function(){
    //             layer.open({
    //                 content: txt+'失败'
    //                 ,skin: 'msg'
    //                 ,time: 1
    //             });
    //         }
    //     });
    // });

    //底部按钮
    var tebBool1=false;
    $(".tem_editor_btns").unbind('click').click(function(){
        if(!tebBool1){
            $(".tem_enroll_list").addClass('on').find('.tem_enroll_radios').removeClass('on').click(function(){
                $(this).toggleClass('on')
            });
            $(".tem_editor_all_btns").addClass('on');
            tebBool1=true
        }else {
            $(".tem_enroll_list").removeClass('on').find('.tem_enroll_radios').removeClass('on');
            $(".tem_editor_all_btns").removeClass('on');
            tebBool1=false
        }
    });
    var tebBool2=false;
    $(".tem_editor_all_btns").unbind('click').click(function(){
        if(!tebBool2){
            $('.tem_enroll_radios,.tem_editor_adopt_btns,.tem_editor_refuse_btns').addClass('on');
            tebBool2=true
        }else {
            $('.tem_enroll_radios,.tem_editor_adopt_btns,.tem_editor_refuse_btns').removeClass('on');
            tebBool2=false
        }
    });
    //批量通过
    $(".tem_editor_adopt_btns").unbind('click').click(function(){
        if($(".tem_enroll_radios.on").length>0){
            var codeArr='';
            $(".tem_enroll_radios.on").each(function(){
                var code=$(this).siblings('.tem_enroll_btns').attr('data-code');
                codeArr+=code+'-'
            });
            auditApplyEvent(20,codeArr.substring(0,codeArr.length-1))
        }else {
            layer.open({
                content: '请选择报名对象'
                ,skin: 'msg'
                ,time: 1
            });
        }
    });
    //批量拒绝
    $(".tem_editor_refuse_btns").unbind('click').click(function(){
        if($(".tem_enroll_radios.on").length>0){
            var codeArr='';
            $(".tem_enroll_radios.on").each(function(){
                var code=$(this).siblings('.tem_enroll_btns').attr('data-code');
                codeArr+=code+'-'
            });
            auditApplyEvent(-10,codeArr.substring(0,codeArr.length-1))
        }else {
            layer.open({
                content: '请选择报名对象'
                ,skin: 'msg'
                ,time: 1
            });
        }
    });

    //搜索
    $(".tem_searchBtn").unbind('click').click(function(){
        var searchValue=$("#searchValue").val();
        if(searchValue==''){
            layer.open({
                content: '搜索内容不能为空'
                ,skin: 'msg'
                ,time: 1
            });
        }else{
            pageNum=1;
            $(".tem_enroll_list_wrap").empty();
            applyListGet(pageNum,stateType);
            taskScrollEvent();
        }
    })
};
var isHas=function(){
    var tog=false;
    $(".tem_enroll_radios").each(function(){
        if($(this).hasClass('on')){
            tog=true;
            return tog
        }
    });
    return tog
};

function stopPropagation(e) {
    e = e || window.event;
    if(e.stopPropagation) { //W3C阻止冒泡方法
        e.stopPropagation();
    } else {
        e.cancelBubble = true; //IE阻止冒泡方法
    }
}
function getQuestionB(mainCode,user,name){
    console.log('123')
    stopPropagation()
    if(mainCode){
        $.ajax({
            xhrFields: {
                withCredentials: true
            },
            type: 'post',
            url: base_url + "html5/v1/station/question/list",
            data: JSON.stringify({"pkPostCode": mainCode,"user":user}),
            dataType: 'json',
            headers: {'token': token},
            contentType: "application/json;charset=utf-8",
            success: function (data) {
                console.log(data)
                if (data.code == 0) {
                    var list = data.data, html="<h3 class=\"tem_enroll_question_title\">"+name+"的调查问卷</h3>";

                    var typeHas = $.getUrlParam("type");

                    if(list.length<=0){
                        layer.open({
                            content: '没有调查问卷'
                            ,skin: 'msg'
                            ,time: 1 //2秒后自动关闭
                        });
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

                    // questionLength = list.length;
                    // $.each(list, function (k, val) {
                    //     htmlnull += val.title;
                    //     html += "<li class='question'>\
                    //                 "+val.title+"\
                    //          </li>"
                    //     $.each(val.questionOptionList, function (k1, option) {
                    //         htmlnull += option.content;
                    //         if(option.content){
                    //             html += "<li class='answer "+option.questionId+"' onclick='selectOption(this,\""+option.questionId+"\", \""+option.id+"\")' data-id='"+option.questionId+"' data-seq='"+option.seq+"'>\
                    //                 "+option.content+"<div class='"+option.questionId+"_answer' id='"+option.id+"'></div>\
                    //              </li>";
                    //         }
                    //     })
                    // })

                    var isSeq=function(num){
                        if(num=1){
                            return 'A'
                        }else if(num=2){
                            return 'B'
                        }else if(num=3){
                            return 'C'
                        }else if(num=4){
                            return 'D'
                        }
                    };

                    $.each(list,function(k,val){
                        var htmlnull2='', htmlnull="";
                        html+='<div class="tem_enroll_question_list">\n' +
                            '            <h4>'+(k+1)+'. '+val.title+'</h4>\n'

                        $.each(val.questionOptionList, function (k1, option) {
                            if(val.seq==option.seq){
                                html+='            <p><strong>答案:</strong>'+isSeq(option.seq)+'.'+option.content+'</p>\n'
                            }
                            if(option.isStandard==1){
                                htmlnull='正确答案:</strong>'+isSeq(option.seq)+'.'+option.content
                            }

                            if(option.isStandard==0&&val.seq==option.seq){
                                console.log(htmlnull)
                                htmlnull2='            <p class="on"><strong><span class="red">回答错误</span>'
                            }
                            if(option.isStandard==1&&val.seq==option.seq){
                                htmlnull2='            <p class="on"><span>回答正确</span>'
                            }

                        });

                        html+=htmlnull2+htmlnull;
                        html+='</p>\n</div>'
                    });
                    $(".tem_enroll_question_list_wrap").html(html);
                    $(".tem_enroll_question_wrap").show();
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

}
var applyListGet=function(num,state){
    var hasQuestion=$.getUrlParam('hasQuestion');
    var mainCode=$.getUrlParam('mainCode');
    var subCode=$.getUrlParam('pkPostCode');
    var searchValue=$("#searchValue").val();
    if(subCode){
        var arr={
            "subCode":subCode,
            "state":state||10,
            "searchValue":searchValue||'',
            "pageNumber":num||1,
            "pageSize":20
        };
        $.ajax({
            xhrFields: {
                withCredentials: true
            },
            type: 'post',
            url: base_url + "html5/v1/newTask/applyList",
            data: JSON.stringify(arr),
            dataType:'json',
            headers : {'token':token},
            contentType: "application/json;charset=utf-8",
            success: function (data) {
                console.log(data)
                if (data.code == 0) {
                    var records=data.data.records;
                    if(records.length>0){
                        var li='';
                        if(state==10){
                            for(var i in records){
                                var subCode=records[i].subCode
                                var nickName=records[i].nickName;
                                var headImg=records[i].headImg==''?'../wap/img/pws_275.jpg':records[i].headImg;
                                var ticketOrder=records[i].ticketOrder;
                                var applyCode=records[i].applyCode;
                                var mobile=records[i].mobile;
                                var user=records[i].user;
                                var source=records[i].source;
                                var sourceOrgName=records[i].sourceOrgName;
                                var sourceOrgCode=records[i].sourceOrgCode;
                                var sourceTxt='';
                                var sourceDom='';
                                if(source==10){
                                    sourceTxt='报名';
                                    sourceDom='<p><span style="margin-left:0;">'+sourceTxt+'</span></p>\n'
                                }else if(source==20){
                                    sourceTxt='直接发证';
                                    sourceDom='<p><span style="margin-left:0;">'+sourceTxt+'</span></p>\n'
                                }else if(source==30){
                                    sourceTxt='任务票(仅限门票)';
                                    sourceDom='<p><span style="margin-left:0;">'+sourceTxt+'</span></p>\n'
                                }else if(source==40){
                                    sourceTxt='顶岗/转接/转赠';
                                    sourceDom='<p><span style="margin-left:0;">'+sourceTxt+'</span></p>\n'
                                }else if(source==50){
                                    sourceTxt='补登';
                                    sourceDom='<p><span style="margin-left:0;">'+sourceTxt+'</span></p>\n'
                                }else if(source==60){
                                    sourceTxt='团体报名';
                                    sourceDom='<p data-code="'+sourceOrgCode+'"><strong>团队报名:</strong><span>'+sourceOrgName+'</span></p>\n'
                                }
                                var questionDom='';
                                if(hasQuestion==1&&mainCode!==null){
                                    questionDom='<span class="tem_enroll_question_togBtn" onclick="getQuestionB(\''+mainCode+'\',\''+user+'\',\''+nickName+'\')">查看调查问卷</span>'
                                }
                                li+='<div class="tem_enroll_list" data-sub="'+subCode+'" data-user="'+user+'">\n' +
                                    '                <div class="tem_enroll_radios"></div>\n' +
                                    '                <div class="tem_enroll_top clearfix">\n' +
                                    '                    <div class="tem_enroll_user" style="background-image:url(\''+headImg+'\')"></div>\n' +
                                    '                    <div class="tem_enroll_name">\n' +
                                    '                        <h2>'+nickName+' <a class="tem_enroll_question_tog" href="javascript:void(0)">'+questionDom+'<!--<span class="tem_enroll_question_togBtn">查看调查问卷</span>--></a></h2>\n' +
                                    sourceDom+
                                    '                    </div>\n' +
                                    '                </div>\n' +
                                    '                <div class="tem_enroll_btns" data-code="'+applyCode+'">\n' +
                                    '                    <button class="gr temGrBtn">通过</button>\n' +
                                    '                    <button class="re temReBtn">拒绝</button>\n' +
                                    '                    <a href="tel:'+mobile+'"><button class="ye">联系</button></a>\n' +
                                    '                </div>\n' +
                                    '            </div>'
                            }
                            $(".tem_enroll_list_examine_wrap").append(li);
                            temEnrollBtns()
                        }else if(state==20){
                            for(var i in records){
                                var subCode=records[i].subCode
                                var nickName=records[i].nickName;
                                var headImg=records[i].headImg==''?'../wap/img/pws_275.jpg':records[i].headImg;;
                                var ticketOrder=records[i].ticketOrder;
                                var applyCode=records[i].applyCode;
                                var mobile=records[i].mobile;
                                var user=records[i].user;
                                // var submitState=records[i].submitState;

                                var source=records[i].source;
                                var sourceOrgName=records[i].sourceOrgName;
                                var sourceOrgCode=records[i].sourceOrgCode;
                                var sourceTxt='';
                                var sourceDom='';
                                if(source==10){
                                    sourceTxt='个人报名';
                                    sourceDom='<p><span style="margin-left:0;">'+sourceTxt+'</span></p>\n'
                                }else if(source==20){
                                    sourceTxt='直接发证';
                                    sourceDom='<p><span style="margin-left:0;">'+sourceTxt+'</span></p>\n'
                                }else if(source==30){
                                    sourceTxt='任务票(仅限门票)';
                                    sourceDom='<p><span style="margin-left:0;">'+sourceTxt+'</span></p>\n'
                                }else if(source==40){
                                    sourceTxt='顶岗/转接/转赠';
                                    sourceDom='<p><span style="margin-left:0;">'+sourceTxt+'</span></p>\n'
                                }else if(source==50){
                                    sourceTxt='补登';
                                    sourceDom='<p><span style="margin-left:0;">'+sourceTxt+'</span></p>\n'
                                }else if(source==60){
                                    sourceTxt='团体报名';
                                    sourceDom='<p data-code="'+sourceOrgCode+'"><strong>团队报名:</strong><span>'+sourceOrgName+'</span></p>\n'
                                }

                                var submitState=records[i].submitState;
                                var submitStateClass='';
                                var submitStateClassTxt='任务待提交';
                                var submitStateClassTxt2='管理员审核中';
                                var validTime=records[i].validTime;
                                var validTimeTxt='0';
                                if(submitState==0){
                                    submitStateClass=1
                                }else if(submitState==10){
                                    submitStateClass=2
                                    submitStateClassTxt='任务提交成功'
                                }else if(submitState==15){
                                    submitStateClass=3
                                    submitStateClassTxt2='联系人审核通过'
                                }else if(submitState==20){
                                    submitStateClass=3
                                    submitStateClassTxt2='管理员审核通过'
                                }
                                // if(submitState==15){
                                //     submitStateClass=3
                                // }
                                li+='<div class="tem_enroll_list" data-sub="'+subCode+'" data-user="'+user+'">\n' +
                                    '                <div class="tem_enroll_radios"></div>\n' +
                                    '                <div class="tem_enroll_top clearfix">\n' +
                                    '                    <div class="tem_enroll_user" style="background-image:url(\''+headImg+'\')"></div>\n' +
                                    '                    <div class="tem_enroll_name">\n' +
                                    '                        <h2>'+nickName+' <a class="tem_enroll_question_tog" href="tel:'+mobile+'"><button>联系</button></a></h2>\n' +
                                    sourceDom +
                                    '                    </div>\n' +
                                    '                </div>\n' +
                                    '                <div class="tem_enroll_progress_wrap">\n' +
                                    '                    <div class="tme_progress clearfix">\n' +
                                    '                        <div class="tme_progress_left">任务进度</div>\n' +
                                    '                        <div class="tme_progress_right on clearfix">\n' +
                                    '                            <div class="tme_progress_list ao tme_progress_list_'+submitStateClass+'">\n' +
                                    '                                <i></i>\n' +
                                    '                                <strong>'+submitStateClassTxt+'</strong>\n' +
                                    // '                                <span>11-03 18:00</span>\n' +
                                    '                            </div>\n' +
                                    '                            <div class="tme_progress_list bo tme_progress_list_'+submitStateClass+'">\n' +
                                    '                                <i></i>\n' +
                                    '                                <strong>'+submitStateClassTxt2+'</strong>\n' +
                                    // '                                <span>11-03 18:00</span>\n' +
                                    '                            </div>\n' +
                                    '                            <div class="tme_progress_list co tme_progress_list_'+submitStateClass+'">\n' +
                                    '                                <i></i>\n' +
                                    '                                <strong>获得时长'+validTime+'小时</strong>\n' +
                                    // '                                <span>11-03 18:00</span>\n' +
                                    '                            </div>\n' +
                                    // '                            <div class="tme_progress_list do tme_progress_list_'+submitStateClass+'">\n' +
                                    // '                                <i></i>\n' +
                                    // '                                <strong>管理员审核通过</strong>\n' +
                                    // // '                                <span>11-03 18:00</span>\n' +
                                    // '                            </div>\n' +
                                    '                        </div>\n' +
                                    '                    </div>\n' +
                                    '                </div>\n' +
                                    '            </div>'
                            }
                            $(".tem_enroll_list_enrolment_wrap").append(li)
                        }


                    }else {
                        loadLastEvent()
                    }

                }
            }
        });
    }

};
//滚动事件
var pageNum=1;
var stateType=10;
var loadHideEvent=function(){
    $(".loadings").find('img').show();
    $(".loadings").hide().find('span').hide();
};
var loadShowEvent=function(){
    $(".loadings").find('img').show();
    $(".loadings").show().find('span').hide();
};
var loadLastEvent=function(txt){
    $(".loadings").find('img').hide();
    $(".loadings").show().find('span').show().text(txt||'已经没有更多了');
    pageNum-=1;
};
var taskScrollEvent=function(){
    var t=0;
    var p=0;
    $(document).scroll(function(e){
        t=$(this).scrollTop();
        var doc=$(document).height();
        var win=$(window).height();
        // console.log($(document).height() - $(window).height())
        // console.log($(window).scrollTop())
        if(p<=t){//console.log("向下");
            if(t>doc-(win+100)){
                loadShowEvent();
                if($(document).height() - $(window).height() - $(window).scrollTop()<5){
                    //添加数据
                    pageNum+=1;
                    applyListGet(pageNum,stateType)
                    console.log(pageNum)
                }
            }else{
                loadHideEvent();
            }

        }else{//console.log("向上")
        }
        setTimeout(function(){p=t},0)
    });
};
$(function(){
    $(".tem_enroll_list_wrap").empty();
    applyListGet(pageNum,stateType);
    taskScrollEvent();

    $(".tem_tab_enrolment").click(function(){
        $(this).addClass('on').siblings('.tem_tab_list').removeClass('on');
        $(".tem_enroll_examineA").hide();
        $(".tem_enroll_examineB").show();
        $(".tem_enroll_list_wrap").empty();
        stateType=20;
        pageNum=1;
        taskScrollEvent();
        applyListGet(pageNum,stateType);
    })
    $(".tem_tab_examine").click(function(){
        $(this).addClass('on').siblings('.tem_tab_list').removeClass('on');
        $(".tem_enroll_examineA").show();
        $(".tem_enroll_examineB").hide();
        $(".tem_enroll_list_wrap").empty();
        stateType=10;
        pageNum=1;
        taskScrollEvent();
        applyListGet(pageNum,stateType);
    })
});
