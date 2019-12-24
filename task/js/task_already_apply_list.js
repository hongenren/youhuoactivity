var dataJson = {}
function queryPostByRecommend(pageNumber, pageSize){
    if(type==0){
        $("#ke").addClass("current");
        $("#yi").removeClass("current");
    }else{
        $("#yi").addClass("current");
        $("#ke").removeClass("current");
    }
    // dataJson.applyType = type;
    dataJson.orgCode = prjvorgMsg.orgThirdAccount;
    $(".warp_pws_c").empty();
    $('#content').dropload({
        scrollArea: window,
        loadDownFn: function (me) {
            $(".dropload-down").remove();
            pageNumber++;
            if ($("#name_input").val()) {
                dataJson.name = $("#name_input").val();
            }
            dataJson.pageNumber = pageNumber;
            dataJson.pageSize = pageSize;

            $.ajax({
                xhrFields: {
                    withCredentials: true
                },
                type: 'post',
                url: base_url + "/html5/v1/newTask/groupAppliedList",
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
                                var user_list = "";
                                var postonclick = 'onclick="jump(\'./post_content.html?pkPostCode='+val.pkPostCode+'&type=group\')"';
                                var user_list = "";
                                if(type==1){
                                    user_list = '<div class="button-div">\
                                                    <input type="button" value="报名成功" onclick="jump(\'task_apply_user_list.html?type=0&pkPostCode='+val.subCode+'\')" style="border: 1px solid red;color: red;"/>\
                                                    <input type="button" value="报名失败" onclick="jump(\'task_apply_user_list.html?type=2&pkPostCode='+val.subCode+'&shibai=0\')" style="border: 1px solid orange;color: orange;"/>\
                                                    <input type="button" value="下载数据" onclick="jump(\'task_download_management.html?type=0&pkPostCode='+val.subCode+'\')" style="border: 1px solid #72B81E;color: #72B81E;"/>\
                                                </div>';
                                }
                                html += '<li>\
                                                    <a href="javascript:void(0);">\
                                                        <h3 '+postonclick+' id="name">'+val.name+'</h3>\
                                                        ' + hot + '\
                                                        <div '+postonclick+' class="hycon2">\
                                                            <img src="../wap/img/pws_125.png">\
                                                            <p>\
                                                                <span id="day">' + val.beginTime+'-'+val.endTime+ '</span>\
                                                            </p>\
                                                        </div>\
                                                        <div '+postonclick+' class="hycon2">\
                                                            <img style="width: 0.15rem;" src="../wap/img/pws_151.png">\
                                                            <p>\
                                                                <span id="address">' + val.address + '</span>\
                                                            </p>\
                                                        </div>\
                                                        <div '+postonclick+' class="hycon2">\
                                                            <img style="width: 0.15rem;" src="../wap/img/pws_1966.png">\
                                                            <p>\
                                                                <span id="address">' + val.orgName + '</span>\
                                                            </p>\
                                                        </div>\
                                                        '+user_list+'\
                                                    </a>\
                                                </li>';
                            })
                            $(".warp_pws_c").append(html);
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

function jumpSelect(url){
    $(location).attr('href', url+"&adCode="+dataJson.adCode);
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
