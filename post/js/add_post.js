function add_job(){
    var serviceDayStr = $("#serviceDay").val();
    var serviceDayStrs = (serviceDayStr.substring(0, serviceDayStr.length-1)).split(",");
    var serviceDay = [];
    if(serviceDayStr!=""){
        for(var i=0;i<serviceDayStrs.length;i++){
            serviceDay.push(serviceDayStrs[i]);
        }
    }

    var data = {
        "userpostId": $("#userpostId").val(),
        "orgCode": prjvorgMsg.orgThirdAccount,
        "serviceDay": serviceDay,
        "serviceBeginTime": $("#serviceBeginTime").val(),
        "serviceEndTime": $("#serviceEndTime").val(),
        "applyTimeType": $("#applyTimeType").val(),
        "applyBeginTime": $("#applyBeginTime").val(),
        "applyEndTime": $("#applyEndTime").val(),
        "reqAttendTimes": $("#reqAttendTimes").val(),
        "needNum": $("#needNum").val(),
        "fieldAdmin": $("#fieldAdmin").val(),
        "point": $("#point").val(),
        "welfare": $("#welfare").val(),
        "welfareName": $("#welfare_name").html(),
        "linkActivity": ""};

    if(checkParameters(data)){
        $("#btn_add_job").attr("onclick", "");
        $.ajax({
            xhrFields: {
                withCredentials: true
            },
            type: 'post',
            url: base_url + "/html5/v1/station/add",
            data: JSON.stringify(data),
            dataType:'json',
            headers : {'token':token},
            contentType: "application/json;charset=utf-8",
            beforeSend: function(XMLHttpRequest) {
                $(".warp_jm").show();
                $(".warp_jm").html("<div class='warp_jz'><img src='../wap/img/preloader.gif' style='width:44px;height:44px; margin:0 auto;display:block;position: absolute;left: 50%;top: 50%;margin: -12px 0 0 -12px'/></div>");
            },
            success: function (data) {
                $("#btn_add_job").attr("onclick", "add_job();");
                $(".warp_jm").hide();
                $(".warp_jm").empty();
                if (data.code == 0) {
                    layer.open({
                        content: '添加成功！'
                        ,skin: 'msg'
                        ,time: 1 //2秒后自动关闭
                    });
                    setTimeout(function(){jump("./post_management.html");},2000);
                }else{
                    layer.open({
                        content: data.msg
                        ,skin: 'msg'
                        ,time: 3 //2秒后自动关闭
                    });
                }
            },
            error: function (e) {
                layer.open({
                    content: '添加失败！'
                    ,skin: 'msg'
                    ,time: 2 //2秒后自动关闭
                });
                $("#btn_add_job").attr("onclick", "add_job();");
            }
        });
    }
}
function userStationList(){
    $(".userPostList").html("");
    $.ajax({
        xhrFields: {
            withCredentials: true
        },
        type: 'post',
        url: base_url + "/html5/v1/station/userStation/list",
        data: JSON.stringify({"orgCode": prjvorgMsg.orgThirdAccount}),
        dataType:'json',
        headers : {'token':token},
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (data.code == 0) {
                var data_index = data.data;
                $.each(data_index, function (k, val) {
                    var html = '<li id="'+val.postNo+'">\
                                    <div onclick="clickUserPost(\''+val.id+'\',\''+val.name+'\');">'+val.name+'</div>\
                                    <div onclick="clickUserPost(\''+val.id+'\',\''+val.name+'\');">岗位编号：'+val.postNo+'</div>\
                                    <input type="button" onclick="deleteUserPost(\''+val.postNo+'\');" />\
                                    <div onclick="clickUserPost(\''+val.id+'\',\''+val.name+'\');">服务地点：'+val.address+'</div>\
                                </li>';
                    $(".userPostList").append(html);
                })
            }
        }
    });
}
$(function() {
    userStationList();
    $.ajax({
        url: base_url+'/html5/v1/orgPlace/queryOrgServiceObjects',//服务对象
        type: "post",
        dataType: "json",
        data: "{}",
        headers: {'Content-Type': 'application/json'},
        success: function (resp) {
            if (resp.code == 0) {
                var Objects = resp.data.data
                for(var z in Objects){
                    var li='<li><span onclick="selectedSpan(this,\'serverTarget\',\''+Objects[z].name+'\',\''+Objects[z].code+'\')" class="no_selectedSpen">'+Objects[z].name+'</span></li>';
                    $(".serverTarget_ul").append(li);
                }
            }
        }
    });
    $.ajax({
        url: base_url+'html5/v1/dict/baozhang/list',//志愿者保障
        type: "get",
        dataType: "json",
        headers: {'Content-Type': 'application/json'},
        success: function (resp) {
            if (resp.code == 0) {
                var Objects = resp.data.data;
                for(var z in Objects){
                    var li='<li><span onclick="selectedSpan(this,\'welfare\',\''+Objects[z].name+'\',\''+Objects[z].code+'\')" class="no_selectedSpen">'+Objects[z].name+'</span></li>';
                    $(".security_ul").append(li);
                }
            }
        }
    });
    $.ajax({
        xhrFields: {
            withCredentials: true
        },
        type: 'post',
        url: base_url + "html5/v1/orgPlace/queryOrgByPrjvOrgId",
        data: JSON.stringify({"prjvOrgId": prjvorgMsg.prjvOrgId}),
        dataType:'json',
        headers : {'token':token},
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (data.code == 0) {
                $('#jifen').text(data.data.integral);
            }
        }
    });

    $(".default-1 .increase").click();
    $(".decrease").click(function () {
        var parent = $(this).parent().parent();
        if(parent.hasClass('default-1')){
            if($(this).next().val()<1){
                $(this).next().next().click();
                layer.open({
                    content: parent.attr("data-name")+"不可小于1。"
                    ,skin: 'msg'
                    ,time: 1 //2秒后自动关闭
                });
            }
        }
    })
    $(".spinnerExample").on('input',function () {
        var parent = $(this).parent().parent();
        if(parent.hasClass('default-1')) {
            if ($(this).val() < 1) {
                $(this).next().click();
                layer.open({
                    content: parent.attr("data-name") + "不可小于1。"
                    , skin: 'msg'
                    , time: 1 //2秒后自动关闭
                });
            }
        }
    })
})
function conceal(type){
    $("."+type).toggle(500);
    if(type=="serverTarget_li"){
        $.ajax({
            url: base_url+'/html5/v1/orgPlace/queryOrgServiceObjects',//服务对象
            type: "post",
            dataType: "json",
            data: "{}",
            headers: {'Content-Type': 'application/json'},
            success: function (resp) {
                if (resp.code == 0) {
                    var Objects = resp.data.data;
                    console.log(Objects)
                    $(".serverTarget_ul").html("");
                    for(var z in Objects){
                        var css = "no_selectedSpen";
                        if(serverTargets.indexOf(Objects[z].code)>-1){
                            css = "selectedSpen";
                        }
                        var li='<li><span onclick="selectedSpan(this,\'serverTarget\',\''+Objects[z].name+'\',\''+Objects[z].code+'\')" class="'+css+'">'+Objects[z].name+'</span></li>';
                        $(".serverTarget_ul").append(li);
                    }
                }
            }
        });
    }
}
function show(type){
    $("."+type).show(500);
}
function hide(type){
    $("."+type).hide(500);
}
function selectedSpan(obj, id, name, val){
    if($(obj).hasClass('selectedSpen')) {
        $(obj).addClass('no_selectedSpen');
        $(obj).removeClass('selectedSpen');
        $("#"+id+"_name").html($("#"+id+"_name").html().replace(name+",", ""));
        $("#"+id+"_name").html($("#"+id+"_name").html().replace(","+name, ""));
        $("#"+id+"_name").html($("#"+id+"_name").html().replace(name, ""));
        $("#"+id).val($("#"+id).val().replace(val+",", ""));
        $("#"+id).val($("#"+id).val().replace(","+val, ""));
        $("#"+id).val($("#"+id).val().replace(val, ""));
        if($("#"+id+"_name").html()==""){
            $("#"+id+"_name").html("请选择");
            $("#"+id+"_name").css("color", "#9d9d9d");
        }
    }else{
        $(obj).addClass('selectedSpen');
        $(obj).removeClass('no_selectedSpen');
        if($("#"+id+"_name").html()=="请选择"){
            $("#"+id+"_name").html("");
            $("#"+id+"_name").css("color", "#000000");
        }
        if($("#"+id).val()!=""){
            $("#"+id).val($("#"+id).val()+","+val);
            $("#"+id+"_name").html($("#"+id+"_name").html()+","+name);
        }else{
            $("#"+id).val(val);
            $("#"+id+"_name").html(name);
        }
    }
}

function selectedSpanOnly(obj, id, val){
    if($(obj).hasClass('selectedSpen')) {
        $(obj).addClass('no_selectedSpen');
        $(obj).removeClass('selectedSpen');
        $("#"+id).val("");
    }else{
        $(obj).addClass('selectedSpen');
        $(obj).removeClass('no_selectedSpen');
        $(obj).parent().siblings().each(function(){
            $(this).children(":first").removeClass('selectedSpen');
            $(this).children(":first").addClass('no_selectedSpen');
        })
        $("#"+id).val(val);
    }
}
function time_apply(obj){
    if($(obj).val()=="") {
        $(obj).css('color', '#9d9d9d');
        $(".applyTime_li").hide();
    }else{
        $(obj).css('color', '#000000');
        $(".applyTime_li").hide();
        if($(obj).val()=="2"){
            $(".applyTime_li").show();
        }
    }
}
function checkMin(obj){
    if($(obj).val()<1){
        $(obj).next().click();
    }
}

function add_userPost(){
    var questionParamList = [], hasQuestion = 0;
    $(".question_list").each(function(index, obj){
        var title = {}, questionOptionList = [];
        $(obj).find("li").find("input").each(function(i, o){
            var content = {};
            if($(o).attr("id")=="question_inp"){
                title.title = $(o).val();
                if($.trim(title.title)!=""){
                    hasQuestion = 1;
                }
                if($.trim($(o).attr("data-id"))!=""){
                    title.id = $(o).attr("data-id");
                }
            }
            if($(o).attr("id")=="answer_inp"){
                content.content = $(o).val();
                if($(o).hasClass("true_answer")){
                    content.isStandard = 1;
                }else{
                    content.isStandard = 0;
                }
                if($.trim($(o).attr("data-id"))!=""){
                    content.id = $(o).attr("data-id");
                }
                questionOptionList.push(content);
                title.questionOptionList = questionOptionList;
            }
        });
        questionParamList.push(title);
    });
    var ifQuestion = "";
    if(hasQuestion==0){
        questionParamList = null;
    }else{
        $.each(questionParamList,function(index,question){
            var optionL = 0;
            var isStandard = 0;
            $.each(question.questionOptionList,function(i,option) {
                if(option.content){
                    optionL ++;
                }
                if(option.isStandard){
                    isStandard ++;
                }
            })
            if(optionL<2 ){
                ifQuestion = '调查问卷设置不完整！';
                return false;
            }
            if(isStandard<1){
                ifQuestion = '请设置问卷的参考答案！';
                return false;
            }
        })
        if(ifQuestion!=""){
            layer.open({
                content: ifQuestion
                ,skin: 'msg'
                ,time: 1 //2秒后自动关闭
            });
            return false;
        }
    }

    if(!adds){
        layer.open({
            content: '地址请从下拉列表中选择，不可手动修改！'
            ,skin: 'msg'
            ,time: 1 //2秒后自动关闭
        });
        return false;
    }
    var isAudit = 0;
    if($('#onoffswitch').is(':checked')) {
        isAudit = 1;
    }
    if($(':radio[name="zhaomuyaoqiu"]:checked').val()==2){
        if($("#applyType").val()==3 &&　isAudit==0){
            layer.open({
                content: '招募有要求时，条件不能为默认值！'
                ,skin: 'msg'
                ,time: 1 //2秒后自动关闭
            });
            return false;
        }
    }
    var data = {
        "user": user_msg.userId,
        "orgCode": prjvorgMsg.orgThirdAccount,
        "postNo": $("#postNo").val(),
        "name": $("#name").val(),
        "address": $("#suggestId").val(),
        "houseNo": $("#houseNo").val(),
        "radius": $("#radius").val()*1000,
        "content": $("#content").val(),
        "serverTarget": $("#serverTarget").val(),
        "serverTargetName": $("#serverTarget_name").html(),
        "contactName": $("#contactName").val(),
        "contactTel": $("#contactTel").val(),
        "applyType": $("#applyType").val(),
        "isAudit": isAudit,
        "lat": lat,
        "lng": lng,
        "province": province,
        "city": city,
        "district": district,
        "questionParamList": questionParamList
    };
    if(data.applyType==5){
        var name = "", code = "";
        $.each($(".delete_alliance"), function (k, val) {
            var n = $(val).attr("data-name");
            var c = $(val).attr("data-code");
            name = name + n +",";
            code = code + c +",";
        })
        data.allianceOrgCode = code.substring(0, code.length-1);
        data.allianceOrgName= name.substring(0, name.length-1);
    }
    if($('#suggestId').css('display')=='none'){
        data.address = $('#suggestId_update').val();
    }
    var url = "/html5/v1/station/userStation/add", type = "添加";
    if(ifPost==1){
        url = "/html5/v1/station/userStation/update";
        type = "修改";
        data.id = oldId;
    }
    if(checkParameters1(data)){
        $("#btn_add_userPost").attr("onclick", "");
        $.ajax({
            xhrFields: {
                withCredentials: true
            },
            type: 'post',
            url: base_url + url,
            data: JSON.stringify(data),
            dataType:'json',
            headers : {'token':token},
            contentType: "application/json;charset=utf-8",
            beforeSend: function(XMLHttpRequest) {
                $(".warp_jm").show();
                $(".warp_jm").html("<div class='warp_jz'><img src='../wap/img/preloader.gif' style='width:44px;height:44px; margin:0 auto;display:block;position: absolute;left: 50%;top: 50%;margin: -12px 0 0 -12px'/></div>");
            },
            success: function (data) {
                $("#btn_add_userPost").attr("onclick", "add_userPost();");
                $(".warp_jm").hide();
                $(".warp_jm").empty();
                if (data.code == 0) {
                    layer.open({
                        content: type + '成功！'
                        ,skin: 'msg'
                        ,time: 1 //2秒后自动关闭
                    });
                    $(".add_job").hide(500);
                    var val = data.data;
                    /*var val = data.data;
                    var html = '<li id="'+val.postNo+'" onclick="clickUserPost(\''+val.id+'\',\''+val.name+'\');">\
                                    <div>'+val.name+'</div>\
                                    <div>岗位编号：'+val.postNo+'</div>\
                                    <input type="button" onclick="deleteUserPost(\''+val.postNo+'\');" />\
                                    <div>服务地点：'+val.address+'</div>\
                                </li>';
                    $(".userPostList").append(html);*/
                    userStationList();
                    selectedUserPost(val.id,val.name);
                }else{
                    layer.open({
                        content: data.msg
                        ,skin: 'msg'
                        ,time: 1 //2秒后自动关闭
                    });
                    $(".add_job").show();
                }
            },
            error: function (e) {
                layer.open({
                    content: type + '失败！'
                    ,skin: 'msg'
                    ,time: 1 //2秒后自动关闭
                });
                $(".add_job").show();
                $("#btn_add_userPost").attr("onclick", "add_userPost();");
            }
        });
    }
}

var lng, lat, address, province, city, district;

// 百度地图API功能
var map = new BMap.Map("l-map");
map.centerAndZoom("上海",15);
var geolocation = new BMap.Geolocation();
$("#suggestId").removeAttr("disabled");
$("#shuru").html("请输入地址或名称进行查询：");

var ac = new BMap.Autocomplete(    //建立一个自动完成的对象
    {"input" : "suggestId"
        ,"location" : map
    });
ac.addEventListener("onhighlight", function(e) {  //鼠标放在下拉列表上的事件
    var str = "";
    var _value = e.fromitem.value;
    var value = "";
    if (e.fromitem.index > -1) {
        value = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
    }
    str = "FromItem<br />index = " + e.fromitem.index + "<br />value = " + value;

    value = "";
    if (e.toitem.index > -1) {
        _value = e.toitem.value;
        value = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
    }
    str += "<br />ToItem<br />index = " + e.toitem.index + "<br />value = " + value;
    $("#searchResultPanel").html(str);
});
var myValue;
ac.addEventListener("onconfirm", function(e) {    //鼠标点击下拉列表后的事件
    adds = true;
    var _value = e.item.value;
    myValue = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
    $("#searchResultPanel").html("onconfirm<br />index = " + e.item.index + "<br />myValue = " + myValue);
    setPlace();
});
function setPlace(){
    map.clearOverlays();    //清除地图上所有覆盖物
    function myFun(){
        var results = local.getResults();
        var p = results.getPoi(0);
        var pp = p.point;    //获取第一个智能搜索的结果
        lng = pp.lng;
        lat = pp.lat;
        address = p.address;
        province = p.province;
        city = p.city;
        district = p.district;
        map.centerAndZoom(pp, 18);
        map.addOverlay(new BMap.Marker(pp));    //添加标注

        var myGeo = new BMap.Geocoder();
        myGeo.getLocation(new BMap.Point(lng, lat), function(result){
            if (result){
                district = result.addressComponents.district;
            }
        });
    }
    var local = new BMap.LocalSearch(map, { //智能搜索
        onSearchComplete: myFun
    });
    local.search(myValue);
}
function addsFalse(){
    adds = false;
}

$(document).ready(function() {
    $("#onoffswitch").on('click', function () {
        clickSwitch()
    });
    var clickSwitch = function () {
        if ($("#onoffswitch").is(':checked')) {
            //console.log("在ON的状态下");
        } else {
            //console.log("在OFF的状态下");
        }
    };
})

function deleteUserPost(postNo){
    $.ajax({
        xhrFields: {
            withCredentials: true
        },
        type: 'post',
        url: base_url + "/html5/v1/station/userStation/delete",
        data: JSON.stringify({"orgCode": prjvorgMsg.orgThirdAccount,"postNo":postNo}),
        dataType: 'json',
        headers: {'token': token},
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (data.code == 0) {
                layer.open({
                    content: '删除成功！'
                    ,skin: 'msg'
                    ,time: 1 //2秒后自动关闭
                });
                $("#"+postNo).remove();
            }else{
                layer.open({
                    content: '删除失败！'
                    ,skin: 'msg'
                    ,time: 1 //2秒后自动关闭
                });
            }
            //conceal('job_warehouse');
        },
        error: function (e) {
            layer.open({
                content: '删除失败！'
                ,skin: 'msg'
                ,time: 1 //2秒后自动关闭
            });
            //conceal('job_warehouse');
        }
    });
}
var ifPost = 0, oldId = "", serverTargets = "";
function clickUserPost(id, name){
    $(".add_job").show();
    ifPost = 1, adds = true, oldId = id;
    $.ajax({
        xhrFields: {
            withCredentials: true
        },
        type: 'post',
        url: base_url + "html5/v1/station/userStation/detail",
        data: JSON.stringify({"id": id}),
        dataType:'json',
        headers : {'token':token},
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (data.code == 0) {
                $(".add_job").show(500);
                document.getElementById('miao').click();
                var detail = data.data;
                oldPost = detail;
                $("#postNo").val(detail.postNo);
                $("#name").val(detail.name);
                $("#content").val(detail.content);
                $("#suggestId_update").val(detail.address);
                $("#suggestId_update").show();
                $("#suggestId").hide();
                $("#houseNo").val(detail.houseNo);
                $("#serverTarget_name").html(detail.serverTargetName);
                serverTargets = detail.serverTarget;
                $("#serverTarget").val(detail.serverTarget);
                $("#contactName").val(detail.contactName);
                $("#contactTel").val(detail.contactTel);
                $("#radius").val(detail.radius/1000);
                if(detail.applyType==5){
                    $(".alliance").show();
                    var codes = detail.allianceOrgCode.split(',');
                    var names = detail.allianceOrgName.split(',');
                    var allianceList = "";
                    $.each(codes, function (k, val) {
                        allianceList += "<div id='"+val+"' onclick=\"deleteAlliance('"+val+"');\" style=\"position:relative;width: 90%;float: left;height: auto;min-height: 30px;line-height: 30px;margin: 3% 0px;padding-right: 10%;\">\
                                    "+names[k]+"\
                                    <p class=\"delete_alliance\" data-code='"+val+"' data-name='"+names[k]+"' style=\"color: red;position:absolute;right: 5%;top:0;line-height: 30px;\">X</p>\
                                </div>";
                    })
                    $("#allianceOrgName").html(allianceList);
                    if($("#allianceOrgName").html()!=""){
                        setTimeout(function(){
                            $.each($(".delete_alliance"), function (k, val) {
                                var t = (($(val).parent().height())/2)-15;
                                $(val).css("top", t);
                            })
                        }, 1000);
                    }else{
                        $("#allianceOrgName").html("请通过下面搜索查询结盟机构");
                    }
                }

                var questionList = "";
                $.each(detail.questionList, function (k, val) {
                    questionList += "<ul class=\"warp_hd_t_bu question_list\" id=\"questionList\">\
                            <li><input data-id='"+val.id+"' type=\"text\" id=\"question_inp\" placeholder=\"请填写问题\" value='"+val.title+"' /><input onclick=\"delQuestion(this, 0)\" id=\"question_del\" type=\"text\" value=\"删除\"></li>";
                    $.each(val.questionOptionList, function (k2, val1) {
                        if(val1.isStandard==1){
                            questionList += "<li> <input data-id='"+val.id+"' type =\"text\" class='true_answer' id=\"answer_inp\" placeholder=\"请填写答案\" value='"+val1.content+"'/><input onclick=\"selAnswer(this)\" id=\"answer_sel\" type=\"text\" style='color:#2bc946;' value=\"正确答案\"><input onclick=\"delQuestion(this, 1)\" id=\"answer_del\" type=\"text\" value=\"删除\"></li>";
                        }else{
                            questionList += "<li> <input data-id='"+val.id+"' type =\"text\" id=\"answer_inp\" placeholder=\"请填写答案\" value='"+val1.content+"'/><input onclick=\"selAnswer(this)\" id=\"answer_sel\" type=\"text\" value=\"设为答案\"><input onclick=\"delQuestion(this, 1)\" id=\"answer_del\" type=\"text\" value=\"删除\"></li>";
                        }
                    })
                    questionList += "</ul>";
                })
                if(questionList!=""){
                    conceal('questionList_li');
                    $("#questionList_div").html(questionList);
                }
                if(detail.applyType==3 && detail.isAudit==0){
                    $("#female").removeAttr("checked");
                    $("#male").attr("checked","checked");
                    $('.zhaomuyaoqiu_li').hide();
                }else{
                    $("#female").attr("checked","checked");
                    $("#male").removeAttr("checked");
                    $('.zhaomuyaoqiu_li').show();
                }
                $("#applyType").val(detail.applyType);
                if(detail.isAudit==1){
                    $('#onoffswitch').attr("checked", true);
                }else{
                    $('#onoffswitch').attr("checked", false);
                }
                $('#postNo').focus();
            }
        }
    });
}

function selectedUserPost(id, name){
    $("#userpostId").val(id);
    $("#userpostName").val(name);
    conceal('job_warehouse');
}

function checkParameters(data){
    if(!data.userpostId){
        layer.open({
            content: '请选择或添加岗位信息！'
            ,skin: 'msg'
            ,time: 2 //2秒后自动关闭
        });
        return false;
    }
    if(!data.serviceDay.length>0){
        layer.open({
            content: '请选择服务日期！'
            ,skin: 'msg'
            ,time: 2 //2秒后自动关闭
        });
        return false;
    }
    if(!data.serviceBeginTime){
        layer.open({
            content: '请选择服务开始时间！'
            ,skin: 'msg'
            ,time: 2 //2秒后自动关闭
        });
        return false;
    }else{
        if(!data.serviceEndTime){
            layer.open({
                content: '请选择服务结束时间！'
                ,skin: 'msg'
                ,time: 2 //2秒后自动关闭
            });
            return false;
        }else{
            var b = new Date(nowYear+"-"+nowMonth+"-"+nowDay+" "+data.serviceBeginTime+":00").getTime();
            var e = new Date(nowYear+"-"+nowMonth+"-"+nowDay+" "+data.serviceEndTime+":00").getTime();
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
    if(!data.applyTimeType){
        layer.open({
            content: '请选择报名时间类型！'
            ,skin: 'msg'
            ,time: 2 //2秒后自动关闭
        });
        return false;
    }else{
        if(data.applyTimeType==2){
            if(!data.applyBeginTime){
                layer.open({
                    content: '请选择报名开始时间！'
                    ,skin: 'msg'
                    ,time: 2 //2秒后自动关闭
                });
                return false;
            }else{
                if(!data.applyEndTime){
                    layer.open({
                        content: '请选择报名结束时间！'
                        ,skin: 'msg'
                        ,time: 2 //2秒后自动关闭
                    });
                    return false;
                }else{
                    var b = new Date(nowYear+"-"+nowMonth+"-"+nowDay+" "+data.applyBeginTime+":00").getTime();
                    var e = new Date(nowYear+"-"+nowMonth+"-"+nowDay+" "+data.applyEndTime+":00").getTime();
                    if(e<b){
                        layer.open({
                            content: '报名结束时间必须晚于开始时间！'
                            ,skin: 'msg'
                            ,time: 2 //2秒后自动关闭
                        });
                        return false;
                    }
                }
            }
        }
    }
    if(!data.reqAttendTimes){
        layer.open({
            content: '请选择最少服务次数！'
            ,skin: 'msg'
            ,time: 2 //2秒后自动关闭
        });
        return false;
    }
    if(!data.needNum){
        layer.open({
            content: '请选择招募人数！'
            ,skin: 'msg'
            ,time: 2 //2秒后自动关闭
        });
        return false;
    }
    if(!data.fieldAdmin){
        layer.open({
            content: '请填写现场管理员手机号！'
            ,skin: 'msg'
            ,time: 2 //2秒后自动关闭
        });
        return false;
    }
    if(data.welfare){
        if(data.welfareName=="请选择"){
            layer.open({
                content: '请选择志愿者保障！'
                ,skin: 'msg'
                ,time: 2 //2秒后自动关闭
            });
            return false;
        }
    }else{
        data.welfareName = "";
    }
    return true;
}

function checkParameters1(data){
    if(!data.postNo){
        layer.open({
            content: '请填写岗位编号！'
            ,skin: 'msg'
            ,time: 2 //2秒后自动关闭
        });
        return false;
    }
    if(!data.name){
        layer.open({
            content: '请填写岗位名称！'
            ,skin: 'msg'
            ,time: 2 //2秒后自动关闭
        });
        return false;
    }
    if(!data.content){
        layer.open({
            content: '请填写岗位职责！'
            ,skin: 'msg'
            ,time: 2 //2秒后自动关闭
        });
        return false;
    }
    if(!data.address){
        layer.open({
            content: '请选择地址！'
            ,skin: 'msg'
            ,time: 2 //2秒后自动关闭
        });
        return false;
    }
    if(!data.serverTarget){
        layer.open({
            content: '请选择服务对象！'
            ,skin: 'msg'
            ,time: 2 //2秒后自动关闭
        });
        return false;
    }else{
        if(data.serverTargetName=="请选择"){
            data.serverTargetName = "";
        }
    }
    if(!data.contactName){
        layer.open({
            content: '请填写咨询人姓名！'
            ,skin: 'msg'
            ,time: 2 //2秒后自动关闭
        });
        return false;
    }
    if(!data.contactTel){
        layer.open({
            content: '请填写咨询人电话！'
            ,skin: 'msg'
            ,time: 2 //2秒后自动关闭
        });
        return false;
    }
    if(!data.radius){
        layer.open({
            content: '请选择打卡范围！'
            ,skin: 'msg'
            ,time: 2 //2秒后自动关闭
        });
        return false;
    }
    if(data.applyType==5){
        if(!data.allianceOrgCode) {
            layer.open({
                content: '请选择指定结盟机构！'
                , skin: 'msg'
                , time: 2 //2秒后自动关闭
            });
            return false;
        }
    }
    return true;
}
var questionSum = 1;
function add_questionLi(){
    if(questionSum<10){
        $("#questionList_div").prepend(
            "<ul class=\"warp_hd_t_bu question_list\" id=\"questionList\">\
                <li><input type=\"text\" id=\"question_inp\" placeholder=\"请填写问题\" /><input readonly onclick=\"delQuestion(this, 0)\" id=\"question_del\" type=\"text\" value=\"删除\"></li>\
                <li><input type=\"text\" id=\"answer_inp\" placeholder=\"请填写答案\" /><input  readonly onclick=\"selAnswer(this)\" id=\"answer_sel\" type=\"text\" value=\"设为答案\"><input readonly onclick=\"delQuestion(this, 1)\" id=\"answer_del\" type=\"text\" value=\"删除\"></li>\
                <li><input type=\"text\" id=\"answer_inp\" placeholder=\"请填写答案\" /><input readonly onclick=\"selAnswer(this)\" id=\"answer_sel\" type=\"text\" value=\"设为答案\"><input readonly onclick=\"delQuestion(this, 1)\" id=\"answer_del\" type=\"text\" value=\"删除\"></li>\
                <li><input type=\"text\" id=\"answer_inp\" placeholder=\"请填写答案\" /><input readonly onclick=\"selAnswer(this)\" id=\"answer_sel\" type=\"text\" value=\"设为答案\"><input readonly onclick=\"delQuestion(this, 1)\" id=\"answer_del\" type=\"text\" value=\"删除\"></li>\
                <li><input type=\"text\" id=\"answer_inp\" id=\"bottom\" placeholder=\"请填写答案\" /><input readonly onclick=\"selAnswer(this)\" id=\"answer_sel\" type=\"text\" value=\"设为答案\"><input readonly onclick=\"delQuestion(this, 1)\" id=\"answer_del\" type=\"text\" value=\"删除\"></li>\
             </ul>"
        )
        questionSum++;
    }else{
        layer.open({
            content: '调查问卷最多只能设置10条！'
            ,skin: 'msg'
            ,time: 2 //2秒后自动关闭
        });
        return false;
    }
}
function delQuestion(obj, type){
    if(type==0){
        $(obj).parent().parent().remove();
    }
    if(type==1){
        $(obj).parent().remove();
    }
}
function selAnswer(obj){
    $(obj).parent().siblings().each(function(){
        $(this).find("#answer_inp").removeClass("true_answer");
        $(this).find("#answer_sel").val("设为答案").css("color", "#aaaaaa");
    })
    $(obj).val("正确答案").css("color", "#2bc946");
    $(obj).parent().find("#answer_inp").addClass("true_answer");
}

function updateAdds(){
    $("#suggestId_update").hide();
    $("#suggestId").show();
    $("#suggestId").val($("#suggestId_update").val());
}
var postNoL = "";
function checkLength_0(obj, l){
    var v = $(obj).val();
    if(v.length > l){
        layer.open({
            content: "岗位编号请填写"+l+"字以内！"
            ,skin: 'msg'
            ,time: 2 //2秒后自动关闭
        });
        $(obj).val(postNoL);
    }else{
        postNoL = v;
    }
}
var nameL = "";
$('#name').keyup(
    function(){
        var remain = $(this).val().length;
        if(remain > 15){
            layer.open({
                content: "岗位名称请填写15字以内！"
                ,skin: 'msg'
                ,time: 2 //2秒后自动关闭
            })
            $(this).val(nameL);
        }else{
            nameL = $(this).val();
        }
    }
);
var contentL = '';
$('#content').keyup(
    function(){
        var remain = $(this).val().length;
        if(remain > 130){
            layer.open({
                content: "岗位职责请填写130字以内！"
                ,skin: 'msg'
                ,time: 2 //2秒后自动关闭
            })
            $(this).val(contentL);
        }else{
            contentL = $(this).val();
        }
    }
);

function apply_type(obj){
    if($(obj).val()==5){
        $(".alliance").show();
    }else{
        $(".alliance").hide();
    }
}

function searchAllianceList(){
    $.ajax({
        xhrFields: {
            withCredentials: true
        },
        type: 'post',
        url: base_url + "/html5/v1/alliance/searchAllianceList",
        data: JSON.stringify({"orgThirdAccount": prjvorgMsg.orgThirdAccount, "searchName": $(".alliance_input").val()}),
        dataType: 'json',
        headers: {'token': token},
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            var html = "";
            var data1 = data.data;
            if (data.code == 0) {
                for(var z in data1){
                    html += "<li style='width: 100%;padding: 0px;background: white;border-bottom:1px solid #B3B3B3;padding-left: 3%;width: 97%;  ' class='no_data'><a onclick='seletAlliance(\""+data1[z].orgName+"\", \""+data1[z].orgThirdAccount+"\")' style='width: 100%;text-align: left;'><div style=\"width: 100%;height:38px;margin: 0px;line-height: 38px;font-size: 18px;\">"
                        +data1[z].orgName+
                        "</div></a></li>";
                }
            }else if (data.code == 1) {
                html += "<li style='width: 100%;padding: 0px;' class='no_data'><a style='width: 100%;text-align: center;'><div style=\"color:#828282;width: 100%;height:38px;margin: 0px;line-height: 38px;font-size: 14px;\">"+data.msg+"</div></a></li>"
                if(data1){
                    for(var z in data1){
                        html += "<li style='width: 100%;padding: 0px;background: white;border-bottom:1px solid #B3B3B3;padding-left: 3%;width: 97%;  ' class='no_data'><a onclick='seletAlliance(\""+data1[z].orgName+"\", \""+data1[z].orgThirdAccount+"\")' style='width: 100%;text-align: left;'><div style=\"width: 100%;height:38px;margin: 0px;line-height: 38px;font-size: 18px;\">"
                            +data1[z].orgName+
                            "</div></a></li>";
                    }
                }
            }
            $(".no_data").remove();
            $(".alliance_ul").append(html);
        }
    })
}
function seletAlliance(allianceOrgName, allianceOrgCode){
    if($("#"+allianceOrgCode).html()){
        layer.open({
            content: "不可重复选择！"
            ,skin: 'msg'
            ,time: 2 //2秒后自动关闭
        })
        return false;
    }
    var html = "<div id='"+allianceOrgCode+"' onclick=\"deleteAlliance('"+allianceOrgCode+"');\" style=\"position:relative;width: 90%;float: left;height: auto;min-height: 30px;line-height: 30px;margin: 3% 0px;padding-right: 10%;\">\
                    "+allianceOrgName+"\
                    <p class=\"delete_alliance\" data-code='"+allianceOrgCode+"' data-name='"+allianceOrgName+"' style=\"color: red;position:absolute;right: 5%;top:0;line-height: 30px;\">X</p>\
                </div>";
    $("#allianceOrgName").append(html);
    if($("#allianceOrgName").html()!=""){
        $.each($(".delete_alliance"), function (k, val) {
            var t = (($(val).parent().height())/2)-15;
            $(val).css("top", t);
        })
    }else{
        $("#allianceOrgName").html("请通过下面搜索查询结盟机构");
    }
}
function deleteAlliance(id){
    $("#"+id).remove();
}
