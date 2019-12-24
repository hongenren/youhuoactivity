function queryDayList(){
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
                var applySwitch = "{", jsonCode = "{", num = "{";
                $.each(data.data, function (k, val) {
                    var day1 = getDay(val.day);
                    dayList += day1 +",";
                    applySwitch += "'"+day1+"':'"+val.applyEndTimeSwitch+"',";
                    jsonCode += "'"+day1+"':'"+val.code+"',";
                    num += "'"+day1+"':'"+val.applyNum+"',";
                })
                applySwitch = applySwitch.substring(0, applySwitch.length-1);
                applySwitch += "}";
                applyEndTimeSwitch = eval('(' + applySwitch + ')');

                jsonCode = jsonCode.substring(0, jsonCode.length-1);
                jsonCode += "}";
                code = eval('(' + jsonCode + ')');
                num = num.substring(0, num.length-1);
                num += "}";
                applyNum = eval('(' + num + ')');
                $('.select-time').click();
            }
        }
    })
}

function updateApplyEndTimeSwitchByCode(obj, code_, applyEndTimeSwitch){
    var sp = $(obj).children(":first");
    $.ajax({
        xhrFields: {
            withCredentials: true
        },
        type: 'post',
        url: base_url + "/html5/v1/station/unitPost/updateApplyEndTimeSwitchByCode",
        data: JSON.stringify({"code": code_, "applyEndTimeSwitch": applyEndTimeSwitch}),
        dataType: 'json',
        headers: {'token': token},
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (data.code == 0) {
                layer.open({
                    content: '修改成功'
                    ,skin: 'msg'
                    ,time: 1
                });
                if(applyEndTimeSwitch==0){
                    $(obj).addClass("switchOpen");
                    sp.html("开");
                    sp.css("color", "#72B81E");
                }else{
                    $(obj).removeClass("switchOpen");
                    sp.html("关");
                    sp.css("color", "orange");
                }
            }else{
                layer.open({
                    content: '修改失败'
                    ,skin: 'msg'
                    ,time: 1
                });
            }
        },
        error:function(e){
            layer.open({
                content: '修改失败'
                ,skin: 'msg'
                ,time: 1
            });
            return false;
        }
    })
}

function getDay(val){
    var date = new Date(val);
    var yy = date.getFullYear();      //年
    var mm = date.getMonth() + 1;     //月
    var dd = date.getDate();          //日
    return yy+"-"+mm+"-"+dd;
}