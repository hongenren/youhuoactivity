var dataJson = {}
function queryPostByRecommend(){
    if($("#name_input").val()){
        dataJson.name = $("#name_input").val();
    }
    $.ajax({
        xhrFields: {
            withCredentials: true
        },
        type: 'post',
        url: base_url + "/html5/v1/station/queryPostByRecommend",
        data: JSON.stringify(dataJson),
        dataType: 'json',
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (data.code == 0) {
                var data_index = data.data;
                var html = "";
                if(data_index.length>0){
                    $.each(data_index, function (k, val) {
                        var hot = "";
                        if(val.hot==1){
                            hot = '<div class="triangle-topright triangle-topright-red"></div><div class="triangle-topright-text" id="hot">热</div>'
                        }else if(val.hot==1){
                            hot = '<div class="triangle-topright triangle-topright-orange"></div><div class="triangle-topright-text" id="hot">火</div>'
                        }else if(val.hot==2){
                            hot = '<div class="triangle-topright triangle-topright-lawngreen"></div><div class="triangle-topright-text" id="hot">满</div>'
                        }
                        html += '<li>\
                                        <a href="./post_content.html?pkPostCode='+val.pkPostCode+'">\
                                            <h3 id="name">'+val.name+'</h3>\
                                            '+hot+'\
                                            <div class="hycon2">\
                                                <img src="../wap/img/pws_125.png">\
                                                <p>\
                                                    <span id="day">'+getDate(val.startDay,val.lastDay,val.serviceBeginTime,val.serviceEndTime,val.reqAttendTimes)+'</span>\
                                                </p>\
                                            </div>\
                                            <div class="hycon2">\
                                                <img style="width: 0.15rem;" src="../wap/img/pws_151.png">\
                                                <p>\
                                                    <span id="address">'+val.address+val.houseNo+'</span>\
                                                </p>\
                                            </div>\
                                        </a>\
                                    </li>';
                    })
                    $(".warp_pws_c").html(html);
                    $(".warp_pws_c").append(
                        "<li class='noneLi' style='background: #F2F2F2;'>\
                            <a href='javascript:void(0)'>\
                            <h3 style='text-align: center;font-size: 100%;color: #999999;'>想迅速找到合适自己的岗位？<br />您可以进行搜索或按日期、地区、服务对象直接查找</h3>\
                            </a>\
                        </li>");
                }else{
                    $(".warp_pws_c").html(
                        "<li class='noneLi' style='background: #F2F2F2;'>\
                            <a href='javascript:void(0)'>\
                            <h3 style='text-align: center;'>已经没有更多啦。。。</h3>\
                            </a>\
                        </li>");
                }
            }
        }
    })
}

function jumpSelect(url){
    if(whole_province==0){
        $(location).attr('href', url+"&adCode="+dataJson.adCode+"&adParent="+dataJson.adParent+"&adName="+encodeURI(encodeURI(dataJson.adName)));
    }else{
        whole_province = 38927;
        $(".hylistsx1").css("top", "50");
        $("#hot_city").show();
        $("#gps_city").show();
        $("#city_name").show();
        $("#provinceDiv").hide();
        $("#cityDiv").show();
        $("#area").hide();
        $("#area_c1").hide();
        $("#area_1").hide();
        var cla=$(".screenButListNew").attr("class");
        if(cla.indexOf("choice") > 0){
            $(".hylistsx1").hide();
            $(".mb_1").hide();
            $(".screenButListNew").removeClass("choice")
        }else{
            $(".screenButListNew").addClass("choice").siblings().removeClass("choice");
            $(".hylistsx1").show().siblings().hide();
            $(".mb_1").show();
        }
    }
}
function getDate(startDay, lastDay, serviceBeginTime , serviceEndTime, reqAttendTimes){
    var r = "";

    var start = new Date(startDay);
    var last = new Date(lastDay);
    var startyear = start.getFullYear();
    var startmonth = start.getMonth() + 1;
    var startweekday = start.getDate();

    var lastyear = last.getFullYear();
    var lastmonth = last.getMonth() + 1;
    var lastweekday = last.getDate();
    if(startyear==lastyear && startmonth==lastmonth && startweekday==lastweekday){
        return startmonth+"月"+startweekday+"日"+"&nbsp;&nbsp;&nbsp;"+serviceBeginTime+"-"+serviceEndTime+"&nbsp;&nbsp;&nbsp;至少参加"+reqAttendTimes+"次";
    }
    if(startyear==lastyear && (startmonth!=lastmonth|| startweekday!=lastweekday)){
        return startmonth+"月"+startweekday+"日至"+lastmonth+"月"+lastweekday+"日"+"&nbsp;&nbsp;&nbsp;"+serviceBeginTime+"-"+serviceEndTime+"&nbsp;&nbsp;&nbsp;至少参加"+reqAttendTimes+"次";
    }
    if(startyear!=lastyear){
        return startyear+"年"+startmonth+"月"+startweekday+"日至"+lastyear+"年"+lastmonth+"月"+lastweekday+"日"+"&nbsp;&nbsp;&nbsp;"+serviceBeginTime+"-"+serviceEndTime+"&nbsp;&nbsp;&nbsp;至少参加"+reqAttendTimes+"次";
    }
}