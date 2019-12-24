
$(function() {
    $(".zw_sj_p").hide();
    $(".dropload-down").hide();
    $(".applyDate").each(function(j,item){
        $(item).height("165px");
        $(item).width("100%");
        console.log(item.value);  //输出input 中的 value 值到控制台
    });
    queryPersonalPostByUserAndStatus(0, 20);
    $("#content").css("margin-top", $(".header").height()+10);
})

var dataJson = {"user": user_msg.userId}
function queryPersonalPostByUserAndStatus(pageNumber, pageSize){
    $(".warp_pws_c").empty();
    $('#content').dropload({
        scrollArea: window,
        loadDownFn: function (me) {
            $(".dropload-down").remove();
            pageNumber++;
            if ($("#name_input").val()) {
                dataJson.name = $("#name_input").val();
            }
            dataJson.status = 2;
            dataJson.pageNumber = pageNumber;
            dataJson.pageSize = pageSize;
            $.ajax({
                xhrFields: {
                    withCredentials: true
                },
                type: 'post',
                url: base_url + "/html5/v1/station/userTicket/queryPersonalPostByUserAndStatus",
                data: JSON.stringify(dataJson),
                dataType: 'json',
                headers: {'token': token},
                contentType: "application/json;charset=utf-8",
                success: function (data) {
                    if (data.code == 0) {
                        var data_index = data.data.records;
                        var html = "";
                        if(data_index.length>0) {
                            $.each(data_index, function (k, val) {
                                if(val.type==90){
                                    html += '<li>\
                                            <a href="javascript:void(0);">\
                                                <h3 onclick="jump(\'./post_content.html?pkPostCode=' + val.pkPostCode + '\')" id="name">' + val.name + '</h3>\
                                                <div class="triangle-topright triangle-topright-orange"></div><div class="triangle-topright-text" id="hot">管理</div>\
                                                <br/><br/><div onclick="jump(\'./post_content.html?pkPostCode=' + val.pkPostCode + '\')" class="hycon2">\
                                                    <img src="../wap/img/pws_151.png">\
                                                    <p>\
                                                        <span id="address">' + val.address + '</span>\
                                                    </p>\
                                                </div>\
                                                <div onclick="jump(\'./post_content.html?pkPostCode=' + val.pkPostCode + '\')" class="hycon2">\
                                                    <img src="../wap/img/pws_125.png">\
                                                    <p>\
                                                        <span id="">' + getDate(val.startDay,val.lastDay,val.serviceBeginTime,val.serviceEndTime,val.numPost)+ '</span>\
                                                    </p>\
                                                </div>\
                                            </a>\
                                        </li>';
                                }else{
                                    html += '<li>\
                                            <a href="javascript:void(0);">\
                                                <h3 onclick="jump(\'./post_content.html?pkPostCode=' + val.pkPostCode + '\')" id="name">' + val.name + '</h3><br/><br/>\
                                                <div onclick="jump(\'./post_content.html?pkPostCode=' + val.pkPostCode + '\')" class="hycon2">\
                                                    <img src="../wap/img/pws_151.png">\
                                                    <p>\
                                                        <span id="address">' + val.address + '</span>\
                                                    </p>\
                                                </div>\
                                                <div onclick="jump(\'./post_content.html?pkPostCode=' + val.pkPostCode + '\')" class="hycon2">\
                                                    <img src="../wap/img/pws_125.png">\
                                                    <p>\
                                                        <span id="">' + getDate(val.startDay,val.lastDay,val.serviceBeginTime,val.serviceEndTime,val.numPost) +'</span>\
                                                    </p>\
                                                </div>\
                                                <div onclick="jump(\'./post_content.html?pkPostCode=' + val.pkPostCode + '\')" class="hycon2">\
                                                    <img src="../wap/img/pws_125.png">\
                                                    <p>\
                                                        <span>总服务时长：' + ChangeHourMinutestr(val.validTime) +'</span>\
                                                   </p>\
                                                </div>\
                                            </a>\
                                        ';
                                    var listL = val.list.length;
                                    if(listL<15){
                                        html += '<div class="swiper-slide applyDate">';
                                        $.each(val.list, function (kList, valList) {
                                            var state = getState(valList.checkInTime, valList.checkOutTime, valList.validTime, valList.isSettle, valList.isCancel, valList.state);
                                            html += '<div class="more" data-state="' + state + '" data-code="' + valList.applyCode + '">\
                                                <span class="border-span">' + getDay(valList.day) + '</span>\
                                                <span>' + state + '</span>\
                                            </div>';
                                        })
                                        html += '</div></li>';
                                    }else{
                                        var ll = Math.ceil(listL / 15);
                                        html += '<div class="swiper-container"><div class="swiper-wrapper">';
                                        for(var i=0; i<ll; i++){
                                            html += '<div class="swiper-slide applyDate">';
                                            $.each(val.list, function (kList, valList) {
                                                if(kList>=(i*15) && kList<(Number(i*15)+Number(15))){
                                                    var state = getState(valList.checkInTime, valList.checkOutTime, valList.validTime, valList.isSettle, valList.isCancel, valList.state);
                                                    html += '<div class="more" data-state="' + state + '" data-code="' + valList.applyCode + '">\
                                                                <span class="border-span">' + getDay(valList.day) + '</span>\
                                                                <span>' + state + '</span>\
                                                            </div>';
                                                }
                                            })
                                            html += '</div>';
                                        }
                                        html += '</div><div class="swiper-pagination" style="bottom:-6px;"></div></div></li>';
                                    }
                                }
                            })
                            $(".warp_pws_c").append(html);
                            $(".more").each(function(){
                                var that=$(this);
                                var offsetWidth=$(window).width() - that.offset().left - that.outerWidth();
                                if(offsetWidth<200){
                                    that.smartMenu(imageMenuData,{offsetX:-100});
                                }else {
                                    if(window.innerWidth<640){
                                        that.smartMenu(imageMenuData);
                                    }else{
                                        that.smartMenu(imageMenuData,{offsetX:-parseInt(that.offset().left)/1.7});
                                    }
                                }
                                console.log()
                            });
                            $(document).click(function(){
                                $.smartMenu.hide();
                                $("#smartMenu_").hide();
                            });
                            //$(".more").smartMenu(imageMenuData);
                            var mySwiper = new Swiper('.swiper-container', {
                                pagination : '.swiper-pagination',
                                autoplay: false,//可选选项，自动滑动
                                freeMode:false,//滑动不够一格，不会自动贴合
                                slidesPerView:1,//设置slider容器能够同时显示的slides数量
                                effect : 'cube'
                            })
                            me.resetload();
                        }else{
                            $(".noneLi").hide();
                            $(".warp_pws_c").append(
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
var dakaonclick = "";
function alertTiShi(){
    layer.closeAll();
    layer.open({
        content: '正在打卡中，不可重复打卡！'
        ,skin: 'msg'
        ,time: 10
    });
}
function newPostSign(pkPostCode){
    layer.open({
        content: "确定要打卡吗？"
        , btn: ['确定', '取消']
        , yes: function (index) {
            //layer.closeAll();
            layer.open({
                content: '打卡定位中，请稍后'
                ,skin: 'msg'
                ,time: 10
            });
            dakaonclick = $(".daka").attr("onclick");
            $(".daka").attr("onclick", "alertTiShi();");
            var json = {"user": user_msg.userId, "pkPostCode": pkPostCode, "locationType": "GPS", "sourceType": 1};
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
                            layer.closeAll();
                            $(".daka").attr("onclick", dakaonclick);
                            if (data.code == 0) {
                                layer.open({
                                    content: '打卡成功！'
                                    , skin: 'msg'
                                    , time: 1 //2秒后自动关闭
                                });
                                setTimeout(function () {
                                    location.reload();
                                }, 1000);
                            } else {
                                layer.open({
                                    content: data.msg
                                    , skin: 'msg'
                                    , time: 1 //2秒后自动关闭
                                });
                            }
                        },
                        error:function(){
                            layer.open({
                                content: '打卡失败'
                                ,skin: 'msg'
                                ,time: 1 //2秒后自动关闭
                            });
                            $(".daka").attr("onclick", dakaonclick);
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
function getDay(day){
    var date = new Date(day.replace(/\-/g,'/'));
    var Y = date.getFullYear().toString().substring(2,4) + '/';
    var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '/';
    var D = (date.getDate()< 10? '0' + date.getDate():date.getDate());
    return Y+M+D;
}
function getState(checkInTime, checkOutTime, validTime, isSettle, isCancel, state){
    if(state==10){
        validTime = "<span style='color: #999999'>待审核</span>";
    }else{
        if(isCancel==0){
            if(isSettle==0){
                if(checkInTime==undefined || checkInTime==null || checkInTime==""){
                    if(checkOutTime==undefined || checkOutTime==null || checkOutTime==""){
                        validTime = "<span style='color: #010101'>待打卡</span>";
                    }
                }else{
                    if(checkOutTime ==undefined || checkOutTime ==null || checkOutTime ==""){
                        validTime = "<span style='color: orange'>计时中</span>";
                    }else{
                        validTime = "<span style='color: red'>待结算</span>";
                    }
                }
            }else{
                validTime = "<span style='color: #010101;font-size: 8px;'>"+ChangeHourMinutestr(validTime)+"</span>";
            }
        }else if(isCancel==1){
            validTime = "<span style='color: #999999'>已顶岗</span>";
        }else if(isCancel==2){
            validTime = "<span style='color: #999999'>已退出</span>";
        }
    }
    return validTime;
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

    return (startyear+"").substring(2,4)+"年"+startmonth+"月"+startweekday+"日至"+(lastyear+"").substring(2,4)+"年"+lastmonth+"月"+lastweekday+"日"+"&nbsp;&nbsp;&nbsp;"+serviceBeginTime+"-"+serviceEndTime+"";

    /*if(startyear==lastyear && startmonth==lastmonth && startweekday==lastweekday){
        return startmonth+"月"+startweekday+"日"+"&nbsp;&nbsp;&nbsp;"+serviceBeginTime+"-"+serviceEndTime+"";
    }
    if(startyear==lastyear && (startmonth!=lastmonth|| startweekday!=lastweekday)){
        return startmonth+"月"+startweekday+"日至"+lastmonth+"月"+lastweekday+"日"+"&nbsp;&nbsp;&nbsp;"+serviceBeginTime+"-"+serviceEndTime+"";
    }
    if(startyear!=lastyear){
        return startyear+"年"+startmonth+"月"+startweekday+"日至"+lastyear+"年"+lastmonth+"月"+lastweekday+"日"+"&nbsp;&nbsp;&nbsp;"+serviceBeginTime+"-"+serviceEndTime+"";
    }*/
}
