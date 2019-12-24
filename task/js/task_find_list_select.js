//日期
function queryPostByDay(pageNumber, pageSize){
    $(".warp_pws_c").show();
    $(".serverTarget_ul").hide();
    $(".warp_pws_c").html("");
    var enterTime = $('.input-enter').val();
    if(enterTime){
        enterTime = enterTime.substring(0, enterTime.length-1);
    }else{
        layer.open({
            content: '请选择日期进行查询！'
            ,skin: 'msg'
            ,time: 1
        });
        return false;
    }
    $('.warp_pws_c').dropload({
        scrollArea: window,
        loadDownFn: function (me) {
            $(".dropload-down").remove();
            pageNumber++;
            var dataJson = {"days": getDate(enterTime).split(","), "pageNumber":pageNumber, "pageSize":pageSize, "orgCode": prjvorgMsg.orgThirdAccount};
            if($("#name_input").val()){
                dataJson.name = $("#name_input").val();
            }
            if($("#days").html()){
                $("#days").html(enterTime);
            }else{
                $('#0').html("<pp id='days'>"+enterTime+"</pp>");
            }
            if(serverTargets!=""){
                $("#server").remove();
                dataJson.serverTargets=serverTargets.substring(0, serverTargets.length-1).split(",");
                if($("#server").html()){
                    $('#server').html("<span>&ndash;&gt;</span>"+serverTargetNames.substring(0, serverTargetNames.length-1)+"<span onclick='deleteSelect(\"server\")' class=\"delete-button\">X</span>");
                }else{
                    $('#0').html($('#0').html()+"<pp id='server'><span>&ndash;&gt;</span>"+serverTargetNames.substring(0, serverTargetNames.length-1)+"<span onclick='deleteSelect(\"server\")' class=\"delete-button\">X</span></pp>");
                }
            }
            if (adCode && adIf == 1) {
                dataJson.adCode = adCode;
                if ($("#adCode").html()) {
                    $("#adCode").html("<span>&ndash;&gt;</span>" + adName + "<span onclick='deleteSelect(\"adCode\")' class=\"delete-button\">X</span>");
                } else {
                    $('#0').html($('#0').html() + "<pp id='adCode'><span>&ndash;&gt;</span>" + adName + "<span onclick='deleteSelect(\"adCode\")' class=\"delete-button\">X</span></pp>");
                }
            }
            $.ajax({
                url: base_url + '/html5/v1/station/queryGroupPostByDay',
                type: "post",
                dataType: "json",
                headers: {'token': token},
                data: JSON.stringify(dataJson),
                contentType: "application/json;charset=utf-8",
                success: function (resp) {
                    $(".warp").show();
                    $(".select_div").hide();
                    if (resp.code == 0) {
                        var data_index = resp.data.records;
                        var html = "";
                        $(".title-num").html("共" + resp.data.total + "个");
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
                                if(val.applyType==4 || val.applyType==5){
                                    hot = '<div class="triangle-topright triangle-topright-lawngreen"></div><div class="triangle-topright-text" id="hot">结</div>'
                                }
                                html += '<li>\
                                                <a href="./task_content.html?pkPostCode=' + val.pkPostCode + '&type=group">\
                                                    <h3 id="name">' + val.name + '</h3>\
                                                    ' + hot + '\
                                                    <div class="hycon2">\
                                                        <img src="../wap/img/pws_125.png">\
                                                        <p>\
                                                            <span id="day">' + val.startDay + '   ' + val.serviceBeginTime + '-' + val.serviceEndTime + '</span>\
                                                        </p>\
                                                    </div>\
                                                    <div class="hycon2">\
                                                        <img src="../wap/img/pws_151.png">\
                                                        <p>\
                                                            <span id="address">' + val.address + '</span>\
                                                        </p>\
                                                    </div>\
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
                    me.resetload();
                }
            });
        }
    })
}
//服务对象
function queryPostByTargetService(pageNumber, pageSize){
    $(".warp_pws_c").show();
    $(".serverTarget_ul").remove();
    $(".warp_pws_c").html("");
    $('.warp_pws_c').dropload({
        scrollArea: window,
        loadDownFn: function (me) {
            $(".dropload-down").remove();
            pageNumber++;
            var dataJson = {"pageNumber":pageNumber, "pageSize":pageSize, "orgCode": prjvorgMsg.orgThirdAccount};
            var day = $('.input-enter').val();
            if(day){
                dataJson.days = day.substring(0, day.length-1).split(",");
                if($("#days").html()){
                    $("#days").html("<span>&ndash;&gt;</span>"+dataJson.days+"<span onclick='deleteSelect(\"days\")' class=\"delete-button\">X</span>");
                }else{
                    $('#0').html($('#0').html()+"<pp id='days'><span>&ndash;&gt;</span>"+dataJson.days+"<span onclick='deleteSelect(\"days\")' class=\"delete-button\">X</span></pp>");
                }
            }
            if(serverTargets!=""){
                dataJson.serverTargets=serverTargets.substring(0, serverTargets.length-1).split(",");
                if($("#serverTargets").html()){
                    $("#serverTargets").html(serverTargetNames.substring(0, serverTargetNames.length-1));
                }else{
                    $('#0').html("<pp id='serverTargets'>"+serverTargetNames.substring(0, serverTargetNames.length-1)+"</pp>");
                }
            }
            if (adCode && adIf == 1) {
                dataJson.adCode = adCode;
                if ($("#adCode").html()) {
                    $("#adCode").html("<span>&ndash;&gt;</span>" + adName + "<span onclick='deleteSelect(\"adCode\")' class=\"delete-button\">X</span>");
                } else {
                    $('#0').html($('#0').html() + "<pp id='adCode'><span>&ndash;&gt;</span>" + adName + "<span onclick='deleteSelect(\"adCode\")' class=\"delete-button\">X</span></pp>");
                }
            }
            if($("#name_input").val()){
                dataJson.name = $("#name_input").val();
            }
            $.ajax({
                url: base_url + '/html5/v1/station/queryGroupPostByTargetService',//服务对象
                type: "post",
                dataType: "json",
                headers: {'token': token},
                data: JSON.stringify(dataJson),
                contentType: "application/json;charset=utf-8",
                success: function (resp) {
                    $(".warp").show();
                    $(".select_div").hide();
                    if (resp.code == 0) {
                        var data_index = resp.data.records;
                        var html = "";
                        $(".title-num").html("共" + resp.data.total + "个");
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
                                if(val.applyType==4 || val.applyType==5){
                                    hot = '<div class="triangle-topright triangle-topright-lawngreen"></div><div class="triangle-topright-text" id="hot">结</div>'
                                }
                                html += '<li>\
                                                <a href="./task_content.html?pkPostCode=' + val.pkPostCode + '&type=group">\
                                                    <h3 id="name">' + val.name + '</h3>\
                                                    ' + hot + '\
                                                    <div class="hycon2">\
                                                        <img src="../wap/img/pws_125.png">\
                                                        <p>\
                                                            <span id="day">' + val.startDay + '   ' + val.serviceBeginTime + '-' + val.serviceEndTime + '</span>\
                                                        </p>\
                                                    </div>\
                                                    <div class="hycon2">\
                                                        <img src="../wap/img/pws_151.png">\
                                                        <p>\
                                                            <span id="address">' + val.address + '</span>\
                                                        </p>\
                                                    </div>\
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
                    me.resetload();
                }
            });
        }
    })
}

//地点
function queryPostByAdCode(pageNumber, pageSize){
    $(".warp_pws_c").show();
    $(".serverTarget_ul").hide();
    $(".warp_pws_c").html("");
    $('.warp_pws_c').dropload({
        scrollArea: window,
        loadDownFn: function (me) {
            $(".dropload-down").remove();
            pageNumber++;
            var dataJson = {"adCode": adCode, "pageNumber": pageNumber, "pageSize": pageSize, "orgCode": prjvorgMsg.orgThirdAccount};
            if ($("#adCode").html()) {
                $("#adCode").html(adName);
            } else {
                $('#0').html("<pp id='adCode'>" + adName + "</pp>");
            }
            var day = $('.input-enter').val();
            if (day) {
                dataJson.days = day.substring(0, day.length - 1).split(",");
                if ($("#days").html()) {
                    $("#days").html("<span>&ndash;&gt;</span>" + dataJson.days + "<span onclick='deleteSelect(\"days\")' class=\"delete-button\">X</span>");
                } else {
                    $('#0').html($('#0').html() + "<pp id='days'><span>&ndash;&gt;</span>" + dataJson.days + "<span onclick='deleteSelect(\"days\")' class=\"delete-button\">X</span></pp>");
                }
            }
            if (serverTargets != "") {
                $("#server").remove();
                dataJson.serverTargets = serverTargets.substring(0, serverTargets.length - 1).split(",");
                if ($("#server").html()) {
                    $('#server').html("<span>&ndash;&gt;</span>" + serverTargetNames.substring(0, serverTargetNames.length - 1) + "<span onclick='deleteSelect(\"server\")' class=\"delete-button\">X</span>");
                } else {
                    $('#0').html($('#0').html() + "<pp id='server'><span>&ndash;&gt;</span>" + serverTargetNames.substring(0, serverTargetNames.length - 1) + "<span onclick='deleteSelect(\"server\")' class=\"delete-button\">X</span></pp>");
                }
            }
            if($("#name_input").val()){
                dataJson.name = $("#name_input").val();
            }

            $.ajax({
                url: base_url + '/html5/v1/station/queryGroupPostByAdCode',
                type: "post",
                dataType: "json",
                headers: {'token': token},
                data: JSON.stringify(dataJson),
                contentType: "application/json;charset=utf-8",
                success: function (resp) {
                    $(".warp").show();
                    $(".select_add_div").hide();
                    $(".select_div").hide();
                    if (resp.code == 0) {
                        var data_index = resp.data.records;
                        var html = "";
                        $(".title-num").html("共" + resp.data.total + "个");
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
                                if(val.applyType==4 || val.applyType==5){
                                    hot = '<div class="triangle-topright triangle-topright-lawngreen"></div><div class="triangle-topright-text" id="hot">结</div>'
                                }
                                html += '<li>\
                                                <a href="./task_content.html?pkPostCode=' + val.pkPostCode + '&type=group">\
                                                    <h3 id="name">' + val.name + '</h3>\
                                                    ' + hot + '\
                                                    <div class="hycon2">\
                                                        <img src="../wap/img/pws_125.png">\
                                                        <p>\
                                                            <span id="day">' + val.startDay + '   ' + val.serviceBeginTime + '-' + val.serviceEndTime + '</span>\
                                                        </p>\
                                                    </div>\
                                                    <div class="hycon2">\
                                                        <img src="../wap/img/pws_151.png">\
                                                        <p>\
                                                            <span id="address">' + val.address + '</span>\
                                                        </p>\
                                                    </div>\
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
            });
        }
    })
}

function openDiv (type){
    if(type==0){
        $(".select_div").html("");
        $('.select-time').click();
        $(".select_div").show();
    }
    if(type==2){
        $.ajax({
            url: base_url+'/html5/v1/orgPlace/queryOrgServiceObjects',//服务对象
            type: "post",
            dataType: "json",
            data: "{}",
            headers: {'Content-Type': 'application/json'},
            success: function (resp) {
                if (resp.code == 0) {
                    $(".serverTarget_ul").html("");
                    var Objects = resp.data.data;
                    for(var z in Objects){
                        var class_ = "no_selectedSpen";
                        if(serverTargets.indexOf(Objects[z].code)>-1){
                            class_ = "selectedSpen";
                        }
                        var li='<li style="border-bottom: 0px;padding: 2% 3%;width: 33.3%;"><span onclick="selectedSpan(this,\''+Objects[z].code+'\')" class="'+class_+'">'+Objects[z].name+'</span></li>';
                        $(".serverTarget_ul").append(li);
                    }
                    $(".serverTarget_ul").append('<li id="button-div" style="margin-top: 3%">\n' +
                        '                    <input type="button" value="取消" onclick="closeDiv(2);" style="background-color: #72B81E;color: #ffffff;"/>\n' +
                        '                    <input type="button" value="确定" onclick="selectService();" style="margin-left: 20%;"/>\n' +
                        '                    </li>');
                }
            }
        });
        $(".warp_pws_c").hide();
        $(".serverTarget_ul").show();
    }
}
function closeDiv(type){
    if(type==2){
        $(".warp_pws_c").show();
        $(".serverTarget_ul").hide();
    }
}
function deleteSelect(id){
    if(id=="server"){
        serverTargets = "";
    }
    if(id=="adCode"){
        adCode = "";
    }
    if(id=="days"){
        $('.input-enter').val("");
    }

    if(type==0){
        queryPostByDay(0, 20);
    }
    if(type==1){
        queryPostByAdCode(0, 20);
    }
    if(type==2){
        queryPostByTargetService(0, 20);
    }
    $("#"+id).remove();
}

function getDate(enterTime){
    var s = enterTime.split(","), ss = "";
    for(var i = 0; i<s.length; i++){
        var date = new Date(s[i].replace(/\-/g,'/'));
        var Y = date.getFullYear() + '-';
        var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
        var D = (date.getDate()< 10? '0' + date.getDate():date.getDate());
        ss += Y+M+D+",";
    }
    return ss.substring(0, ss.length-1);
}
