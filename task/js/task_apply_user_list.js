var type = $.getUrlParam("type"), shibai = $.getUrlParam("shibai");
var pkUnitCodeList = {}, months = [], minMonth = 0, dayListStr = "", year = "";
var typeEvent=function(type){
    if(type==0){
        $(".warp_dd_p").hide();
        // $("#ke").addClass("current");
        // $("#yi").removeClass("current");

            $("#title").html("报名成功");
            $(".succeed-list").show();
            $(".succeed-list-ul").show();
            $(".task_failure-list").hide();
    }else {
        $("#yi").addClass("current");
        $("#ke").removeClass("current");
        $(".warp_dd_p").show();
        if (type == 1) {
            $("#shibai").addClass("current");
            $("#shenhe").removeClass("current");
        } else if(type==2){
            $("#shenhe").addClass("current");
            $("#shibai").removeClass("current");
        }
    }
};

var time1='';
var time2='';
var time3='';
var gressStyleEvent=function(types,times){
    // var types=20;
    var time=times||0;
    var submitStateClass=1;
    var submitStateClassTx='任务待提交';
    var submitStateClassTxt='管理员审核中';
    var submitStateClassTxt2='获得时长'+time+'小时';

    // var time1='11-03 18:00';
    // var time2='11-03 18:00';
    // var time3='11-03 18:00';
    if(types==10){
        submitStateClass=2;
        submitStateClassTx='任务提交成功';
        submitStateClassTxt='管理员审核中';

        if($.getUrlParam('type')!==null&&$.getUrlParam('type')==2){
            $(".sendButtonWrap").hide();
        }else {
            $(".sendButtonWrap").show();
        }

    }else if(types==15){
        submitStateClass=2;
        submitStateClassTx='任务提交成功';
        submitStateClassTxt='联系人审核中';
    }else if(types==20){
        submitStateClass=3;
        submitStateClassTx='任务提交成功';
        submitStateClassTxt='管理员审核中'
    }else if(types==-10){
        submitStateClassTx='任务提交成功';
        submitStateClass=3+' red';
        submitStateClassTxt2='管理员拒绝'
    }

    var gress='<div class="tme_progress_list ao tme_progress_list_'+submitStateClass+'">\n' +
        '                    <i></i>\n' +
        '                    <strong>'+submitStateClassTx+'</strong>\n' +
        '                    <span>'+time1+'</span>\n' +
        '                </div>\n' +
        '                <div class="tme_progress_list bo tme_progress_list_'+submitStateClass+'">\n' +
        '                    <i></i>\n' +
        '                    <strong>'+submitStateClassTxt+'</strong>\n' +
        '                    <span>'+time2+'</span>\n' +
        '                </div>\n' +
        '                <div class="tme_progress_list co tme_progress_list_'+submitStateClass+'">\n' +
        '                    <i></i>\n' +
        '                    <strong>'+submitStateClassTxt2+'</strong>\n' +
        '                    <span>'+time3+'</span>\n' +
        '                </div>';

    return gress
};
var groupApplyList=function(pageNumber, type){
    typeEvent(type);
    var json = {
        "orgCode": prjvorgMsg.orgThirdAccount,
        "pageNumber": pageNumber,
        "pageSize": 20,
        "state":20,
        "subCode": pkPostCode
    };
    if(type==0){
        $(".tem_enroll_list_wrap").html("");
        json.state=20
        $('.hycon_con').dropload({
            scrollArea: window,
            loadDownFn: function (me) {
                $(".dropload-down").remove();
                pageNumber++;


                var json = {
                    "orgCode": prjvorgMsg.orgThirdAccount,
                    "pageNumber": pageNumber,
                    "pageSize": 20,
                    "state":20,
                    "subCode": pkPostCode
                };
                if($("#name_input").val()){
                    json.searchValue = $("#name_input").val();
                }
                $.ajax({
                    xhrFields: {
                        withCredentials: true
                    },
                    type: 'post',
                    url: base_url + "/html5/v1/newTask/groupApplyList",
                    data: JSON.stringify(json),
                    dataType: 'json',
                    headers: {'token': token},
                    contentType: "application/json;charset=utf-8",
                    success: function (data) {
                        if (data.code == 0) {
                            var data_index = data.data.records;;
                            var html = "";
                            if(data_index.length>0) {
                                $.each(data_index, function (k1, val1) {
                                    var gress = gressStyleEvent(val1.state, val1.validTime);
                                    var headImg = val1.headImg == '' ? '../wap/img/pws_27.jpg' : val1.headImg;
                                    html += ' <div class="tem_enroll_list">\n' +
                                        '                <div class="tem_enroll_radios on"></div>\n' +
                                        '                <div class="tem_enroll_top clearfix">\n' +
                                        '                    <div class="tem_enroll_user" style="background-image:url(\'' + headImg + '\')"></div>\n' +
                                        '                    <div class="tem_enroll_name">\n' +
                                        '                        <h2>' + (val1.nickName==''?'名字':val1.nickName) + '<a class="tem_enroll_question_tog" href="javascript:void(0)"></a></h2>\n' +
                                        '                        <p><span style="margin-left:0;">' + (val1.mobile==''?'电话':val1.mobile)  + '</span></p>\n' +
                                        '                    </div>\n' +
                                        '                </div>\n' +
                                        '                <div class="tem_enroll_progress_wrap">\n' +
                                        '                    <div class="tme_progress clearfix">\n' +
                                        '                        <div class="tme_progress_left">任务进度</div>\n' +
                                        '                        <div class="tme_progress_right clearfix">\n' +
                                        gress +
                                        '                        </div>\n' +
                                        '                    </div>\n' +
                                        '                </div>\n' +
                                        '            </div>';
                                });
                                $(".tem_enroll_list_wrap").append(html);
                            }else {
                                $(".noneLi").hide();
                                $(".tem_enroll_list_wrap").append(
                                    "<li class='noneLi' style='background: #F2F2F2;border: 0px;'>\
                                        <a href='javascript:void(0)'>\
                                            <h3 style='text-align: center;color:#333;line-height:50px;'>已经没有更多啦。。。</h3>\
                                        </a>\
                                    </li>");
                                me.lock();
                                me.noData();//无数据重置
                                me.resetload();
                            }
                            me.resetload();
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
    }else if(type==2){
        json.state=-10;
        $.ajax({
            xhrFields: {
                withCredentials: true
            },
            type: 'post',
            url: base_url + "/html5/v1/newTask/groupApplyList",
            data: JSON.stringify(json),
            dataType: 'json',
            headers: {'token': token},
            contentType: "application/json;charset=utf-8",
            success: function (data) {
                if (data.code == 0) {
                    var data_index = data.data.records;
                    if(data_index.length>0){
                        var span1=''
                        $.each(data_index, function (k, val) {
                            if(val.nickName!==''){
                                span1+='<span>'+val.nickName+'</span>'+'、'
                            }
                        });
                        $(".task_failure-list").html(span1.substring(0,span1.length-1));
                    }else {
                        $(".noneLi").hide();
                        $(".task_failure-list").html(
                            "<div class='noneLi' style='border: 0px;'>\
                                <a href='javascript:void(0)'>\
                                    <h3 style='text-align: center;color:#333;line-height:50px;'>已经没有更多啦。。。</h3>\
                                </a>\
                            </div>");
                    }
                }else{
                    layer.open({
                        content: data.msg
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
    }else if(type==1){
        failList()
    }

}
function failList(){
    // if(shibai==0){
        $.ajax({
            xhrFields: {
                withCredentials: true
            },
            type: 'post',
            url: base_url + "/html5/v1/newTask/groupApplyFailList",
            data: JSON.stringify({"subCode":pkPostCode,"orgCode":prjvorgMsg.orgThirdAccount}),
            dataType: 'json',
            headers: {'token': token},
            contentType: "application/json;charset=utf-8",
            success: function (data) {
                if (data.code == 0) {
                    var data_index = data.data;
                    if(data_index.failUserList){
                        data_index = data.data.failUserList;
                        if(data_index.length>0){
                            var span1=''
                            $.each(data_index, function (k, val) {
                                if(val.nickName!==''){
                                    span1+='<span>'+val.nickName+'</span>'+'、'
                                }
                            });
                            $(".task_failure-list").html(span1.substring(0,span1.length-1));
                        }else {
                            $(".noneLi").hide();
                            $(".task_failure-list").html(
                                "<div class='noneLi' style='border: 0px;'>\
                                    <a href='javascript:void(0)'>\
                                        <h3 style='text-align: center;color:#333;line-height:50px;'>已经没有更多啦。。。</h3>\
                                    </a>\
                                </div>");
                        }
                    }

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

function jumpCode(url){
    $(location).attr('href', url+"&pkPostCode="+pkPostCode);
}
