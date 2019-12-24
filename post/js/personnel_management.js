var pkUnitCodeList = {}, months = [], minMonth = 0, dayListStr = "", year = "", hasQuestion = "";
function getList(pkPostCode){
    $(".succeed-list-title").html("");
    $.ajax({
        xhrFields: {
            withCredentials: true
        },
        type: 'post',
        url: base_url + "/html5/v1/station/postApply/queryDayList",
        data: JSON.stringify({"pkPostCode": pkPostCode, "type": typeZ+1}),
        dataType: 'json',
        headers: {'token': token},
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (data.code == 0) {
                var data_index = data.data;
                var getListDaySize = 0;
                $.each(data_index, function (k, val) {
                    hasQuestion = " display: none; ";
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
                    if(k<5) {
                        if (k == 0) {
                            html = '<div class="succeed-list-title-div pitch-on" onclick="passListChoose(this, \'' + val.code + '\', 0, 20);">\
                                <div>\
                                    <span>' + getDate(0, val.day) + '</span>\
                                    <span>' + getDate(1, val.day) + '</span>\
                                    <span class="applyNum" id="' + val.code + '">'+val.auditNum+'人</span>\
                                </div>\
                             </div>';
                            if(pkUnitCodeZ=="") {
                                pkUnitCodeZ = val.code;
                            }
                        } else {
                            html = '<div class="succeed-list-title-div" onclick="passListChoose(this, \'' + val.code + '\', 0, 20);">\
                                <div>\
                                    <span>' + getDate(0, val.day) + '</span>\
                                    <span>' + getDate(1, val.day) + '</span>\
                                    <span class="applyNum" id="' + val.code + '">'+val.auditNum+'人</span>\
                                </div>\
                             </div>';
                        }
                    }
                    if(pkUnitCodeZ!=""){
                        if(data_index.length<5){
                            html ='';
                            if(pkUnitCodeZ==val.code){
                                html ='<div class="succeed-list-title-div pitch-on" onclick="passListChoose(this, \''+val.code+'\', 0, 20);">\
                                <div>\
                                    <span>'+getDate(0, val.day)+'</span>\
                                    <span>'+getDate(1, val.day)+'</span>\
                                    <span class="applyNum" id="'+val.code+'">'+val.auditNum+'人</span>\
                                </div>\
                             </div>';
                                pkUnitCodeZ = val.code;
                            }else{
                                html ='<div class="succeed-list-title-div" onclick="passListChoose(this, \''+val.code+'\', 0, 20);">\
                                    <div>\
                                        <span>'+getDate(0, val.day)+'</span>\
                                        <span>'+getDate(1, val.day)+'</span>\
                                        <span class="applyNum" id="'+val.code+'">'+val.auditNum+'人</span>\
                                    </div>\
                                 </div>';
                            }
                        }else{
                            html ='';
                            if(pkUnitCodeZ==val.code){
                                getListDaySize ++;
                                html ='<div class="succeed-list-title-div pitch-on" onclick="passListChoose(this, \''+val.code+'\', 0, 20);">\
                                <div>\
                                    <span>'+getDate(0, val.day)+'</span>\
                                    <span>'+getDate(1, val.day)+'</span>\
                                    <span class="applyNum" id="'+val.code+'">'+val.auditNum+'人</span>\
                                </div>\
                             </div>';
                                pkUnitCodeZ = val.code;
                            }else{
                                if(getListDaySize>0 && getListDaySize<5){
                                    getListDaySize ++;
                                    html ='<div class="succeed-list-title-div" onclick="passListChoose(this, \''+val.code+'\', 0, 20);">\
                                            <div>\
                                                <span>'+getDate(0, val.day)+'</span>\
                                                <span>'+getDate(1, val.day)+'</span>\
                                                <span class="applyNum" id="'+val.code+'">'+val.auditNum+'人</span>\
                                            </div>\
                                         </div>';
                                }
                            }
                        }
                    }
                    /*<span>'+val.failUserList.length+'人</span>\*/
                    $(".succeed-list-title").append(html);
                })
                auditList(0, 20);
                $(".succeed-list-title").append('<div class=\"succeed-list-title-div\" onclick="openDate();">\
                                                     <div style=\"border: 0px\">\
                                                     <img src="../wap/img/calendar.jpg">\
                                                     </div>\
                                                 </div>');
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
    }else{
        $('.succeed-list-ul').show();
        closeData();
    }
}
function passListChoose(obj, pkUnitCode, pageNumber, pageSize) {
    $('.succeed-list-title-div').removeClass('pitch-on');
    $(obj).addClass('pitch-on');
    pkUnitCodeZ = pkUnitCode;
    auditList(pageNumber, pageSize);
}
    var meZ;
function auditList(pageNumber, pageSize){
    $(".succeed-list-ul").html("");
    $('.hycon_con').dropload({
        scrollArea: window,
        loadDownFn: function (me) {
            $(".dropload-down").remove();
            meZ = me;
            pageNumber++;
            var state = 20;
            if (typeZ == 0) {
                state = 10;
            }
            var dataJson = {"pkUnitCode": pkUnitCodeZ, "state": state, "pageNumber": pageNumber, "pageSize": pageSize, "isSettle": 0};
            if(typeZ==2){
                dataJson.isSettle = 1;
            }
            if($("#name_input").val()){
                dataJson.searchValue = $("#name_input").val();
            }
            $.ajax({
                xhrFields: {
                    withCredentials: true
                },
                type: 'post',
                url: base_url + "/html5/v1/station/postApply/auditList",
                data: JSON.stringify(dataJson),
                dataType: 'json',
                headers: {'token': token},
                contentType: "application/json;charset=utf-8",
                success: function (data) {
                    if (data.code == 0) {
                        var data_index = data.data.records;
                        //$(".applyNum").html("");
                        //$("#"+pkUnitCodeZ).html(data.data.total+"人");
                        if(data_index.length>0) {
                            var html = "";
                            $.each(data_index, function (k, val) {
                                if (typeZ == 0) {
                                    html += '<li id="'+val.code+'">\
                                            <img src="' + val.headImg + '">\
                                            <span style="font-size: 16px;">' + val.nickName + '</span>\
                                            <p style="float: right;color: #72B81E; '+hasQuestion+'" onclick="jump(\'answerList.html?pkPostCode='+pkPostCode+'&user='+val.user+'\')">查看调查问卷</p><br/><br/>\
                                            <p style="width: auto">' + source(val.source, val.sourceOrgName) + '</p>\
                                            <br/><br/><div class="button-div">\
                                                <a style="border: 1px solid orange;color: orange;" href="tel:'+val.mobile+'">联系</a>\
                                                <input type="button" value="拒绝" onclick="apply(\''+val.code+'\', \''+val.ticket+'\', \''+val.ticketOrder+'\', \''+val.user+'\', -10, \'拒绝\', \''+ val.nickName +'\');" style="border: 1px solid red;color: red;"/>\
                                                <input type="button" value="通过" onclick="apply(\''+val.code+'\', \''+val.ticket+'\', \''+val.ticketOrder+'\', \''+val.user+'\', 20, \'通过\', \''+ val.nickName +'\');" style="border: 1px solid #72B81E;color: #72B81E;"/>\
                                            </div>\
                                        </li>';
                                }else if (typeZ == 1) {
                                    var checkTime = "";
                                    if (val.checkInTime) {
                                        checkTime += val.nickName + "在" + val.checkInTime + "签到打卡";
                                        if (val.checkOutTime) {
                                            checkTime += "<br />" + val.nickName + "在" + val.checkOutTime + "签出打卡";
                                        }
                                    }else{
                                        if (val.checkOutTime) {
                                            checkTime += val.nickName + "在" + val.checkOutTime + "签出打卡";
                                        }
                                    }
                                    if (checkTime == "") {
                                        checkTime = "暂无打卡记录"
                                    }
                                    var dianming = '';
                                    if(val.isManual==0){
                                        dianming += '<input type="button" value="签到点名" onclick="newPostSign(this, \'' + val.pkUnitCode + '\', \'' + val.user + '\');" style="border: 1px solid #72B81E;color: #72B81E;"/>';
                                    }else if(val.isManual==1){
                                        dianming += '<input type="button" value="签出点名" onclick="newPostSign(this, \'' + val.pkUnitCode + '\', \'' + val.user + '\');" style="border: 1px solid red;color: red;"/>';
                                    }
                                    html += '<li>\
                                            <img src="' + val.headImg + '">\
                                            <span style="font-size: 16px;">' + val.nickName + '</span>\
                                            <p></p><br/><br/>\
                                            <p>' + source(val.source, val.sourceOrgName) + '</p>\
                                            <div class="limit">' + checkTime + '</div>\
                                            <div class="button-div">\
                                                <a id="'+val.pkUnitCode+'" style="border: 1px solid orange;color: orange;" href="tel:'+val.mobile+'">联系</a>\
                                                '+dianming+'\
                                            </div>\
                                        </li>';
                                }else if (typeZ == 2) {
                                    var checkTime = "";
                                    if (val.checkInTime) {
                                        checkTime += val.nickName + "在" + val.checkInTime + "签到打卡";
                                        if (val.checkOutTime) {
                                            checkTime += "<br />" + val.nickName + "在" + val.checkOutTime + "签出打卡";
                                        }
                                    }else{
                                        if (val.checkOutTime) {
                                            checkTime += val.nickName + "在" + val.checkOutTime + "签出打卡";
                                        }
                                    }
                                    if (checkTime == "") {
                                        checkTime = "暂无打卡记录"
                                    }
                                    if(val.isManual==3){
                                        if(checkTime!=""){
                                            checkTime += "<br />"
                                        }
                                        checkTime += "管理员在" + val.manualTime + "调整时长为"+ChangeHourMinutestr(val.validTime);
                                    }
                                    html += '<li>\
                                            <img src="' + val.headImg + '">\
                                            <span style="font-size: 16px;">' + val.nickName + '</span>\
                                            <p style="float: right;">服务时长：' + toHourMinute(val.validTime) + '</p>\
                                            <p></p><br/><br/>\
                                            <p>' + source(val.source, val.sourceOrgName) + '</p>\
                                            <div class="limit">' + checkTime + '</div>\
                                            <div class="button-div">\
                                                <a id="'+val.pkUnitCode+'" style="border: 1px solid orange;color: orange;" href="tel:'+val.mobile+'">联系</a>\
                                                <input type="button" value="评价" onclick="jump(\'./evaluation.html?applyCode='+val.code+'&type=1\')" style="border: 1px solid #72B81E;color: #72B81E;"/>\                                  \
                                                <input type="button" value="调整时长" onclick="openD(\''+val.code+'\','+val.validTime+');" style="border: 1px solid red;color: red;"/>\
                                            </div>\
                                        </li>';
                                }
                            })
                            $(".succeed-list-ul").append(html);
                            me.resetload();
                        }else{
                            $(".noneLi").hide();
                            $(".succeed-list-ul").append(
                                "<li class='noneLi' style='background: #F2F2F2;'>\
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
                            content: data.msg
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


function newPostSign(obj, pkUnitCode, user){
    var aletrStr = "您已经签到成功，记得签出哦", aletrStr1 = "签到";
    if($(obj).val()=="签出点名"){
        aletrStr = "您已经签出成功，次日可查看服务时长", aletrStr1 = "签出";
    }
    layer.open({
        content: "确定要"+aletrStr1+"吗？"
        , btn: ['确定', '取消']
        , yes: function (index) {
            layer.open({
                content: aletrStr1 + '定位中，请稍后'
                ,skin: 'msg'
                ,time: 10
            });
            var json = {
                "user": user,
                "pkPostCode": pkPostCode,
                "pkUnitCode": pkUnitCode,
                "locationType": "GPS",
                "sourceType": 2
            };
            var map = new BMap.Map("allmap");
            var point = new BMap.Point(116.331398, 39.897445);
            map.centerAndZoom(point, 12);
            var geolocation = new BMap.Geolocation();
            geolocation.getCurrentPosition(function (r) {
                if (this.getStatus() == BMAP_STATUS_SUCCESS) {
                    var mk = new BMap.Marker(r.point);
                    map.addOverlay(mk);
                    map.panTo(r.point);
                    json.lat = r.point.lat;
                    json.lng = r.point.lng;
                    json.address = r.address.street;
                    $.ajax({
                        xhrFields: {
                            withCredentials: true
                        },
                        type: 'post',
                        url: base_url + "/html5/v1/station/newPostSign",
                        data: JSON.stringify(json),
                        dataType: 'json',
                        headers: {'token': token},
                        contentType: "application/json;charset=utf-8",
                        success: function (data) {
                            if (data.code == 0) {
                                layer.open({
                                    content: aletrStr
                                    , skin: 'msg'
                                    , time: 1 //2秒后自动关闭
                                });
                                if ($(obj).val() == "签到点名") {
                                    $(obj).val("签出点名");
                                }
                                if ($(obj).val() == "签出点名") {
                                    $(obj).hide();
                                }
                            } else {
                                layer.open({
                                    content: data.msg
                                    , skin: 'msg'
                                    , time: 1 //2秒后自动关闭
                                });
                            }
                        }
                    });
                } else {
                    layer.open({
                        content: '获取定位失败,请重试'
                        , skin: 'msg'
                        , time: 1 //2秒后自动关闭
                    });
                }
            });
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
function apply(pkPostCode, ticket, ticketOrder, user, state, name, nickName){
    layer.open({
        content: '确定要'+name+nickName+'岗位申请？'
        , btn: ['确定', '取消']
        , no: function (index) {

        }
        , yes: function (index) {
            var json = {
                "code": pkPostCode,
                "ticket": ticket,
                "ticketOrder": ticketOrder,
                "user": user,
                "state": state
            }
            $.ajax({
                xhrFields: {
                    withCredentials: true
                },
                type: 'post',
                url: base_url + "/html5/v1/station/postApply/audit",
                data: JSON.stringify(json),
                dataType: 'json',
                headers: {'token': token},
                contentType: "application/json;charset=utf-8",
                success: function (data) {
                    if (data.code == 0) {
                        layer.open({
                            content: name+'成功！'
                            ,skin: 'msg'
                            ,time: 2
                        });
                        $("#"+pkPostCode).hide();
                        auditList(0, 20);
                        //setTimeout(function(){location.reload();},1000);
                    }else{
                        layer.open({
                            content: data.msg
                            ,skin: 'msg'
                            ,time: 5
                        });
                    }
                }
            })
        }
    })
}

function mobile(id){
    $("#"+id).click();
}

function source(source, sourceOrgName){
    var r = "个人报名";
    if(source==20){
        r = "直接发证";
    }else if(source==30){
        r = "任务票";
    }else if(source==40){
        r = "顶岗/转接/转增";
    }else if(source==50){
        r = "补登";
    }else if(source==60){
        r = "团体报名："+sourceOrgName;
    }
    return r;
}

function openD(code, validTime){
    var h = Math.floor(validTime/60);
    var m = (validTime%60);
    $('#validTime').click();
    $('.dwcc').css("margin-top", "10px");

    $('.dwcc').before("<div class='serviceTimeDiv'>\
                                        <div class='serviceTimeDivContent' style='width: 100%;'>\
                                            <input value='"+h+"小时"+m+"分钟' type='text' id='serviceBeginTime1' placeholder='选择开始'>\
                                        </div>\
                                    </div>");
    $('.dwb-s').hide();
    $('.dwb-c').before('<div class="dwbw dwb-s">\
                                                        <div tabindex="0" role="button" class="dwb0 dwb-e dwb" onclick="changeValidTime(\''+code+'\')">确定</div>\
                                                    </div>');
}

function changeValidTime(code){
    var data = Number(($(".dwwl0 .dw-sel").attr("data-val"))*60) + Number($(".dwwl1 .dw-sel").attr("data-val"));
    $.ajax({
        xhrFields: {
            withCredentials: true
        },
        type: 'post',
        url: base_url + "/html5/v1/station/postApply/changeValidTime",
        data: JSON.stringify({"code":code, "validTime": data}),
        dataType: 'json',
        headers: {'token': token},
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (data.code == 0) {
                layer.open({
                    content: '调整成功，正在刷新，请稍后！'
                    ,skin: 'msg'
                    ,time: 4
                });
                $(".dwb1").click();
                meZ.unlock();
                meZ.noData(false);
                setTimeout(function(){updateType(2);},3000);
                //auditList(0, 20);
            }else{
                layer.open({
                    content: data.msg
                    ,skin: 'msg'
                    ,time: 3
                });
            }
        }
    })
}

function jumpWhere(){
    if(jump_where==0){
        $(location).attr('href', "./post_management.html");
    }else{
        $(location).attr('href', "./personal_post_list.html");
    }
}

function updateType(ty){
    typeZ = ty;
    if(typeZ==0){
        $("#1").removeClass("current");
        $("#2").removeClass("current");
        $("#0").addClass("current");
    }else if(typeZ==1){
        $("#0").removeClass("current");
        $("#2").removeClass("current");
        $("#1").addClass("current");
    }else if(typeZ==2){
        $("#0").removeClass("current");
        $("#1").removeClass("current");
        $("#2").addClass("current");
    }
    getList(pkPostCode);
}
