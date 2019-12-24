var serviceDay = [], year = "", dddday = [], ddddday = [], orginServiceDay = "", orginServiceDay_ = "", newServiceDay = "", months = [], minMonth = 0, minYear = 0, dayListLength = 0, optional = 0;
$(function() {
    $.ajax({
        xhrFields: {
            withCredentials: true
        },
        type: 'post',
        url: base_url + "/html5/v1/station/postApply/queryDayList",
        data: JSON.stringify({"pkPostCode": pkPostCode}),
        dataType: 'json',
        async: false,
        headers: {'token': token},
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (data.code == 0) {
                var dayList = data.data;
                dayListLength = dayList.length;
                $.each(dayList, function (k, val) {
                    var date = new Date(val.day);
                    var nowYear = date.getFullYear();
                    var nowMonth = date.getMonth() + 1;
                    var nowDay = date.getDate();

                    if(minMonth==0){
                        minMonth = nowMonth;
                        minYear = nowYear;
                    }else{
                        if(nowMonth<minMonth){
                            if(minYear==nowYear) {
                                minMonth = nowMonth;
                            }
                        }
                    }
                    months.push(nowMonth);
                    year = nowYear;
                    dddday.push((nowYear+"").substring(2,4)+"."+nowMonth+"."+nowDay);
                    ddddday.push(nowYear+"-"+nowMonth+"-"+nowDay);
                    dayListStr += nowYear+"-"+nowMonth+"-"+nowDay+",";
                })
            }
        }
    })
    if(type==0 || type==1){
        $('.select-time').hotelDate();
        $('.select-time').show();
        $('.select-time').click();
        if(type==1){
            $.each(months, function (k, val) {
                $("#months_"+val).show();
            })
            $(".close-btn").after("<div class=\"check-all-btn\" style=\"top:5px;padding: 8px 5px;\" onclick='selectAll(this);'>全选("+dayListLength+")</div>");
        }else{
            $(".mt10").show();
        }
    }else{
        $('.select_div').hide();
        $('.change_div').show();
        //$('#year').html(year+"年");
        $.each(dddday, function (k, val) {
            $('#days').append("<div class=\"div\" data-date='"+ddddday[k]+"' onclick='selectDay(this)'>"+val+"</div>");
        })
    }
})
function selectAll(obj){
    if(optional==0){
        $(obj).html("取消全选（"+dayListLength+"）");
        optional = 1;
        $('.c-red').text(dayListLength);
        $('.default').each(function(){
            $(this).removeClass('default');
            $(this).addClass('enter');
            $(this).html($(this).html().replace("已发", ""));
        })
    }else{
        $(obj).html("全选（"+dayListLength+"）");
        optional = 0;
        $('.c-red').text(0);
        $('.enter').each(function(){
            $(this).removeClass('enter');
            $(this).addClass('default');
            $(this).html($(this).html()+"已发");
        })
    }
}
function openDate(){
    var i = 0;
    $.each($(".select"), function (k, val) {
        i ++;
        var ht = $(val).attr("data-date");
        var hts = ht.split("-");
        var yyy = hts[0];
        var mmm = hts[1];
        var ddd = hts[2];
        mmm.length === 1 ? mmm = '0' + mmm : false;
        ddd.length === 1 ? ddd = '0' + ddd : false;
        orginServiceDay = ht;
        orginServiceDay_ = yyy + "-" + mmm + "-" + ddd;
    })
    if(i==0){
        layer.open({
            content: '请选择日期！'
            ,skin: 'msg'
            ,time: 1
        });
    }else{
        $('.select-time').hotelDate();
        $('.select-time').show();
        $('.select-time').click();
        $('.select_div').show();
        $('.change_div').hide();
        $(".mt10").show();
    }
}

function selectDay(obj){
    $(".div").removeClass("select");
    if($(obj).hasClass("select")){
        $(obj).removeClass("select");
    }else{
        $(obj).addClass("select");
    }
}
function addServiceDay(){
    $.ajax({
        xhrFields: {
            withCredentials: true
        },
        type: 'post',
        url: base_url + "/html5/v1/station/addServiceDay",
        data: JSON.stringify({"pkPostCode": pkPostCode, "serviceDay": serviceDay}),
        dataType: 'json',
        headers: {'token': token},
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (data.code == 0) {
                layer.open({
                    content: '新增成功！'
                    ,skin: 'msg'
                    ,time: 1
                });
                setTimeout(function(){location.reload();},1000);
            }else{
                layer.open({
                    content: data.msg
                    ,skin: 'msg'
                    ,time: 1
                });
            }
        }
    })
}

function cancelServiceDay(){
    $.ajax({
        xhrFields: {
            withCredentials: true
        },
        type: 'post',
        url: base_url + "/html5/v1/station/cancelServiceDay",
        data: JSON.stringify({"pkPostCode": pkPostCode, "serviceDay": serviceDay}),
        dataType: 'json',
        headers: {'token': token},
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (data.code == 0) {
                layer.open({
                    content: '取消成功！'
                    ,skin: 'msg'
                    ,time: 1
                });
                setTimeout(function(){location.reload();},1000);
            }else{
                layer.open({
                    content: data.msg
                    ,skin: 'msg'
                    ,time: 1
                });
            }
        }
    })
}

function changeServiceDay(){
    $.ajax({
        xhrFields: {
            withCredentials: true
        },
        type: 'post',
        url: base_url + "/html5/v1/station/changeServiceDay",
        data: JSON.stringify({"pkPostCode": pkPostCode, "orginServiceDay": orginServiceDay_, "newServiceDay": newServiceDay}),
        dataType: 'json',
        headers: {'token': token},
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (data.code == 0) {
                layer.open({
                    content: '修改成功！'
                    ,skin: 'msg'
                    ,time: 1
                });
                setTimeout(function(){location.reload();},1000);
            }else{
                layer.open({
                    content: data.msg
                    ,skin: 'msg'
                    ,time: 1
                });
            }
        }
    })
}
