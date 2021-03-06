function jumpPosters(url, userId){
    $.ajax({
        xhrFields: {
            withCredentials: true
        },
        type: "post",
        url: base_url + "html5/v1/user/center",
        data: JSON.stringify({"userId": userId}),
        dataType: 'json',
        headers: {'token': token},
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (data.code == 0) {
                var data1 = data.data;
                $(location).attr('href', url+"&name="+encodeURI(encodeURI(data1.userCertUserName))+"&headImg="+data1.userHeadImg);
            }
        }
    })
}
function queryPostByOrgCode(pageNumber, pageSize){
    var dataJson = {};
    dataJson.orgCode = prjvorgMsg.orgThirdAccount;
    $(".warp_pws_c").empty();
    $('#content').dropload({
        scrollArea: window,
        loadDownFn: function (me) {
            $(".dropload-down").remove();
            pageNumber++;
            dataJson.pageNumber=pageNumber;
            dataJson.pageSize=pageSize;
            if($("#name_input").val()){
                dataJson.name = $("#name_input").val();
            }
            $.ajax({
                xhrFields: {
                    withCredentials: true
                },
                type: 'post',
                url: base_url + "/html5/v1/station/queryPostByOrgCode",
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
                                var hot = "";
                                if (val.hot == 1) {
                                    hot = '<div class="triangle-topright triangle-topright-red"></div><div class="triangle-topright-text" id="hot">热</div>'
                                } else if (val.hot == 1) {
                                    hot = '<div class="triangle-topright triangle-topright-orange"></div><div class="triangle-topright-text" id="hot">火</div>'
                                } else if (val.hot == 2) {
                                    hot = '<div class="triangle-topright triangle-topright-lawngreen"></div><div class="triangle-topright-text" id="hot">满</div>'
                                }
                            //<a href="./post_content.html?pkPostCode=' + val.pkPostCode + '">\
                                html += '<li>\
                                                <a href="javascript:void(0)">\
                                                    <h3 onclick="jump(\'./post_content.html?pkPostCode='+val.pkPostCode+'&type=19478f81h\')" id="name">' + val.name + '</h3>\
                                                    ' + hot + '\
                                                    <div class="hycon2">\
                                                        <img src="../wap/img/pws_125.png">\
                                                        <p>\
                                                            <span id="day">' + getDate(val.startDay,val.lastDay,val.serviceBeginTime,val.serviceEndTime,val.reqAttendTimes) + '</span>\
                                                        </p>\
                                                    </div>\
                                                    <div class="hycon2">\
                                                        <img src="../wap/img/pws_151.png">\
                                                        <p>\
                                                            <span id="address">' + val.address + val.houseNo + '</span>\
                                                        </p>\
                                                    </div>\
                                                    <div class="button-div">\
                                                        <input type="button" value="人员管理" onclick="jump(\'./personnel_management.html?where=0&type=0&pkPostCode='+val.pkPostCode+'\')" style="border: 1px solid red;color: red;"/>\
                                                        <input type="button" value="下载数据" onclick="jump(\'./download_data.html?pkPostCode='+val.pkPostCode+'\')" style="border: 1px solid #72B81E;color: #72B81E;"/>\
                                                        <input type="button" value="海报" onclick="jumpPosters(\'./posters.html?pkPostCode='+val.pkPostCode+'&userId='+user_msg.userId+'\',\''+user_msg.userId+'\')" style="border: 1px solid deepskyblue;color: deepskyblue;"/>\                                                     \
                                                        <input type="button" value="更多" data-code="'+val.pkPostCode+'"  data-beginTime="'+val.serviceBeginTime+'" data-endTime="'+val.serviceEndTime+'"\
                                                        class="more" style="border: 0px; color: #999999;margin: 0px;"/>\
                                                    </div>\
                                                </a>\
                                            </li>';
                            })
                            $(".noneLi").hide();
                            $(".warp_pws_c").append(html);
                            me.resetload();
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
/*
function openMore(obj){
    $(obj).mousedown();
}*/
function clickBeginTime(){
    window.clearInterval(int);
    serviceTimeId = "serviceBeginTime1"
    $('#serviceBeginTime').click();
    $('.dwcc').css("margin-top", "10px");
    $('.dwcc').before("<div class='serviceTimeDiv'>\
                                        <div class='serviceTimeDivTitle'>服务时间：</div>\
                                        <div class='serviceTimeDivContent'>\
                                            <input style='float: left' type='text'' id='serviceBeginTime1' placeholder='选择开始'><span style='float: left'>至</span>\
                                            <input style='float: left' type='text'' value='"+dwwl0+":"+dwwl1+"' id='serviceEndTime1' placeholder='选择结束' onclick='clickEndTime();'>\
                                        </div>\
                                    </div>");
    $('.dwb-s').hide();
    $('.dwb-c').before('<div class="dwbw dwb-s">\
                                                        <div tabindex="0" role="button" class="dwb0 dwb-e dwb" onclick="updateServiceTime()">确定</div>\
                                                    </div>');
    dwwl0 = $(".dwwl0 .dw-sel").attr("data-val");
    dwwl1 = $(".dwwl1 .dw-sel").attr("data-val");
    int = setInterval(fn,1000);
}
function clickEndTime(){
    window.clearInterval(int);
    serviceTimeId = "serviceEndTime1"
    $('#serviceEndTime').click();
    $('.dwcc').css("margin-top", "10px");
    $('.dwcc').before("<div class='serviceTimeDiv'>\
                                        <div class='serviceTimeDivTitle'>服务时间：</div>\
                                        <div class='serviceTimeDivContent'>\
                                            <input style='float: left' type='text' value='"+dwwl0+":"+dwwl1+"' id='serviceBeginTime1' placeholder='选择开始' onclick='clickBeginTime();'><span style='float: left'>至</span>\
                                            <input style='float: left' type='text' id='serviceEndTime1' placeholder='选择结束'>\
                                        </div>\
                                    </div>");
    $('.dwb-s').hide();
    $('.dwb-c').before('<div class="dwbw dwb-s">\
                                                        <div tabindex="0" role="button" class="dwb0 dwb-e dwb" onclick="updateServiceTime()">确定</div>\
                                                    </div>');
    dwwl0 = $(".dwwl0 .dw-sel").attr("data-val");
    dwwl1 = $(".dwwl1 .dw-sel").attr("data-val");
    int = setInterval(fn,1000);
}
function setServiceTime(obj){
    //alert($(obj).val());
}
var fn = function(){
    var data0 = getD($(".dwwl0 .dw-sel").attr("data-val"));
    var data1 = getD($(".dwwl1 .dw-sel").attr("data-val"));
    if(data0!=dwwl0){
        dwwl0 = data0;
        $("#"+serviceTimeId).val(dwwl0+":"+dwwl1);
    }
    if(data1!=dwwl1){
        dwwl1 = data1;
        $("#"+serviceTimeId).val(dwwl0+":"+dwwl1);
    }
}, dwwl0 = "", dwwl1 = "", serviceTimeId = "serviceBeginTime1", int, pkPostCode = "", serviceBeginTime = "", serviceEndTime = "";

function getD(val){
    val.length === 1 ? val = '0' + val : false;
    return val;
}

function updateServiceTime(){
    var serviceBeginTime = $("#serviceBeginTime1").val();
    var serviceEndTime =  $("#serviceEndTime1").val();
    var dataJson = {"pkPostCode": pkPostCode, "serviceBeginTime": serviceBeginTime, "serviceEndTime": serviceEndTime};
    if(!dataJson.serviceBeginTime){
        layer.open({
            content: '请选择服务开始时间！'
            ,skin: 'msg'
            ,time: 2 //2秒后自动关闭
        });
        return false;
    }else{
        if(!dataJson.serviceEndTime){
            layer.open({
                content: '请选择服务结束时间！'
                ,skin: 'msg'
                ,time: 2 //2秒后自动关闭
            });
            return false;
        }else{
            var b = new Date(nowYear+"-"+nowMonth+"-"+nowDay+" "+dataJson.serviceBeginTime+":00").getTime();
            var e = new Date(nowYear+"-"+nowMonth+"-"+nowDay+" "+dataJson.serviceEndTime+":00").getTime();
            if(e<b){
                e = e+24*60*60*1000;
            }
            var serviceTimeDifference = (e-b)/60/60/1000;
            if(serviceTimeDifference>12){
                layer.open({
                    content: '服务时间不能超过12小时！'
                    ,skin: 'msg'
                    ,time: 2 //2秒后自动关闭
                });
                return false;
            }
        }
    }
    window.clearInterval(int);
    $('.dwb1').click();
    $.ajax({
        xhrFields: {
            withCredentials: true
        },
        type: 'post',
        url: base_url + "/html5/v1/station/updateServiceTime",
        data: JSON.stringify(dataJson),
        dataType: 'json',
        headers: {'token': token},
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (data.code == 0) {
                layer.open({
                    content: "修改成功！"
                    ,skin: 'msg'
                    ,time: 1
                });
                setTimeout(function(){location.reload();},1000);
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
        r = startmonth+"月"+startweekday+"日";
        if(serviceBeginTime && serviceEndTime){
            r += "&nbsp;&nbsp;&nbsp;"+serviceBeginTime+"-"+serviceEndTime;
        }
        if(reqAttendTimes){
            r += "&nbsp;&nbsp;&nbsp;至少参加"+reqAttendTimes+"次";
        }
    }
    if(startyear==lastyear && (startmonth!=lastmonth|| startweekday!=lastweekday)){
        r =  startmonth+"月"+startweekday+"日至"+lastmonth+"月"+lastweekday+"日";
        if(serviceBeginTime && serviceEndTime){
            r += "&nbsp;&nbsp;&nbsp;"+serviceBeginTime+"-"+serviceEndTime;
        }
        if(reqAttendTimes){
            r += "&nbsp;&nbsp;&nbsp;至少参加"+reqAttendTimes+"次";
        }
    }
    if(startyear!=lastyear){
        r =  startyear+"年"+startmonth+"月"+startweekday+"日至"+lastyear+"年"+lastmonth+"月"+lastweekday+"日";
        if(serviceBeginTime && serviceEndTime){
            r += "&nbsp;&nbsp;&nbsp;"+serviceBeginTime+"-"+serviceEndTime;
        }
        if(reqAttendTimes){
            r += "&nbsp;&nbsp;&nbsp;至少参加"+reqAttendTimes+"次";
        }
    }
    return r;
}

function jumpInstitutions(){
    $(location).attr('href', "../org/institutions.html?prjvOrgId="+prjvorgMsg.prjvOrgId);
}
