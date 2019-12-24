var type = $.getUrlParam("type"), shibai = $.getUrlParam("shibai");
var pkUnitCodeList = {}, months = [], minMonth = 0, dayListStr = "", year = "";
if(type==0){
    $(".warp_dd_p").hide();
    $("#ke").addClass("current");
    $("#yi").removeClass("current");
}else {
    $("#yi").addClass("current");
    $("#ke").removeClass("current");
    $(".warp_dd_p").show();
    if (shibai == 0) {
        $("#shibai").addClass("current");
        $("#shenhe").removeClass("current");
    } else {
        $("#shenhe").addClass("current");
        $("#shibai").removeClass("current");
    }
}
function getList(type, pkPostCode){
    if(type==0){
        $.ajax({
            xhrFields: {
                withCredentials: true
            },
            type: 'post',
            url: base_url + "/html5/v1/station/postApply/queryDayList",
            data: JSON.stringify({"pkPostCode": pkPostCode}),
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
                        auditNumList[nowYear+"-"+nowMonth+"-"+nowDay] = val.applyNum;
                        var html ='';
                        if(k<5){
                            if(pkUnitCodeZ!=""){
                                if(pkUnitCodeZ==val.code){
                                    html ='<div class="succeed-list-title-div pitch-on" onclick="passListChoose(this, \''+val.code+'\', 0, 20);">\
                                    <div>\
                                        <span>'+getDate(0, val.day)+'</span>\
                                        <span>'+getDate(1, val.day)+'</span>\
                                        <span>'+val.applyNum+'</span>\
                                    </div>\
                                 </div>';
                                    pkUnitCodeZ = val.code;
                                    auditList(0, 20);
                                }else{
                                    html ='<div class="succeed-list-title-div" onclick="passListChoose(this, \''+val.code+'\', 0, 20);">\
                                    <div>\
                                        <span>'+getDate(0, val.day)+'</span>\
                                        <span>'+getDate(1, val.day)+'</span>\
                                        <span>'+val.applyNum+'</span>\
                                    </div>\
                                 </div>';
                                }
                            }else{
                                if(k==0){
                                    html ='<div class="succeed-list-title-div pitch-on" onclick="passListChoose(this, \''+val.code+'\', 0, 20);">\
                                    <div>\
                                        <span>'+getDate(0, val.day)+'</span>\
                                        <span>'+getDate(1, val.day)+'</span>\
                                        <span>'+val.applyNum+'</span>\
                                    </div>\
                                 </div>';
                                    pkUnitCodeZ = val.code;
                                    auditList(0, 20);
                                }else{
                                    html ='<div class="succeed-list-title-div" onclick="passListChoose(this, \''+val.code+'\', 0, 20);">\
                                    <div>\
                                        <span>'+getDate(0, val.day)+'</span>\
                                        <span>'+getDate(1, val.day)+'</span>\
                                        <span>'+val.applyNum+'</span>\
                                    </div>\
                                 </div>';
                                }
                            }
                        }
                        /*<span>'+val.failUserList.length+'人</span>\*/
                        $(".succeed-list-title").append(html);
                    })
                    $(".succeed-list-title").append('<div class=\"succeed-list-title-div\" onclick="openDate();">\
                                                     <div style=\"border: 0px\">\
                                                     <img src="../wap/img/calendar.jpg">\
                                                     </div>\
                                                 </div>');
                }
            }
        })
    }else{
        failList();
    }
}
function openDate(){
    if($(".select_div").html().trim()==""){
        $('.succeed-list-ul').hide();
        $('.select-time').click();
        $.each(months, function (k, val) {
            $("#months_"+val).show();
        })
    }else{
        $('.succeed-list-ul').show();
        closeData();
    }
}
function passListChoose(obj, pkUnitCode, pageNumber, pageSize){
    $('.succeed-list-title-div').removeClass('pitch-on');
    $(obj).addClass('pitch-on');
    pkUnitCodeZ = pkUnitCode;
    auditList(pageNumber, pageSize);
}
function auditList(pageNumber, pageSize){
    $(".succeed-list-ul").html("");
    $('.hycon_con').dropload({
        scrollArea: window,
        loadDownFn: function (me) {
            $(".dropload-down").remove();
            pageNumber++;
            var json = {
                "orgCode": prjvorgMsg.orgThirdAccount,
                "pageNumber": pageNumber,
                "pageSize": pageSize,
                "pkUnitCode": pkUnitCodeZ
            };
            if($("#name_input").val()){
                json.searchValue = $("#name_input").val();
            }
            $.ajax({
                xhrFields: {
                    withCredentials: true
                },
                type: 'post',
                url: base_url + "/html5/v1/station/groupApply/passList",
                data: JSON.stringify(json),
                dataType: 'json',
                headers: {'token': token},
                contentType: "application/json;charset=utf-8",
                success: function (data) {
                    if (data.code == 0) {
                        var data_index = data.data.records;
                        if(data_index.length>0) {
                            var html = "";
                            $.each(data_index, function (k1, val1) {
                                var isManual = "";
                                if (val1.isManual == 0) {
                                    isManual = "未签到";
                                } else if (val1.isManual == 1) {
                                    isManual = "未签出";
                                } else if (val1.isManual == 2) {
                                    isManual = "自行打卡";
                                } else if (val1.isManual == 3) {
                                    isManual = "人工补登";
                                }
                                html += '<li>\
                                            <img src="' + val1.headImg + '">\
                                            <span style="font-size: 16px;">' + val1.nickName + '</span>\
                                            <p style="float: right;">' + val1.mobile + '</p>\
                                            <p></p><br/><br/>\
                                            <p>' + isManual + '</p>\
                                        </li>';
                            })
                            $(".succeed-list-ul").append(html);
                            me.resetload();
                        }else{
                            $(".noneLi").hide();
                            $(".succeed-list-ul").append(
                                "<li class='noneLi' style='background: #F2F2F2;border: 0px;'>\
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
}
function failList(){
    if(shibai==0){
        $.ajax({
            xhrFields: {
                withCredentials: true
            },
            type: 'post',
            url: base_url + "/html5/v1/station/groupApply/failList",
            data: JSON.stringify({"pkPostCode":pkPostCode}),
            dataType: 'json',
            headers: {'token': token},
            contentType: "application/json;charset=utf-8",
            success: function (data) {
                if (data.code == 0) {
                    var data_index = data.data;
                    $.each(data_index, function (k, val) {
                        var html ="<li>" +
                            "<div>"+val.day+"   "+val.serviceBeginTime+"</div><p>";
                        $.each(val.failUserList, function (kFailUserList, valFailUserList) {
                            html +=    valFailUserList.nickName+"、";
                        })
                        html = html.substring(0, html.length-1);
                        html += "</p></li>";
                        $(".failure-list").append(html);
                    })
                }
            }
        })
    }else{
        var dataJson = {"pkPostCode":pkPostCode};
        $.ajax({
            xhrFields: {
                withCredentials: true
            },
            type: 'post',
            url: base_url + "/html5/v1/station/postApply/queryAuditFailList",
            data: JSON.stringify(dataJson),
            dataType: 'json',
            headers: {'token': token},
            contentType: "application/json;charset=utf-8",
            success: function (data) {
                if (data.code == 0) {
                    var data_index = data.data;
                    $.each(data_index, function (k, val) {
                        if(val.auditFailUsers){
                            var html ="<li>" +
                                "<div>"+val.day+"</div><p>";
                            html +=  val.auditFailUsers;
                            //html = html.substring(0, html.length-1);
                            html += "</p></li>";
                            $(".failure-list").append(html);
                        }
                    })
                }
            }
        })
    }
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