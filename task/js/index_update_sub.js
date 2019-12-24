//修改任务
var up_job=function(){
    var mainCodes=$.getUrlParam('mainCode');
    var subCode=$.getUrlParam('pkPostCode');
    $.ajax({
        xhrFields: {
            withCredentials: true
        },
        type: 'post',
        url: base_url + "html5/v1/newTask/subTaskDetail",
        data: JSON.stringify({"subCode": subCode}),
        dataType:'json',
        headers : {'token':token},
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            console.log(data)
            if (data.code == 0) {
                var datas=data.data;
                var subTaskList=datas.subTaskList;
                var subTask=datas;
                // subTaskList.forEach(function(item,index){
                //     if(item.subCode==subCode){
                //         subTask=item
                //     }
                // });
                // console.log(subTask);
                if(subTask){
                    $('.task_sub_list').find("#suggestId1").attr('data-id',subTask.addressId).val(subTask.address).trigger('input')
                    $('.task_sub_list').find("#serviceBeginTime").val(subTask.beginTime)
                    $('.task_sub_list').find("#contactMobile").val(subTask.contactMobile)
                    $('.task_sub_list').find("#contentB").val(subTask.content)
                    $('.task_sub_list').find("#serviceEndTime").val(subTask.endTime)
                    $('.task_sub_list').find("#needNum").val(subTask.needNum)
                    $('.task_sub_list').find("#serviceTime").val(timeTransformToHour(subTask.serviceTime))
                }
            }
        }
    });
};


//正则验证
var isScope=function(begin,end){
    var tog=true;
    var b = new Date(begin).getTime();
    var e = new Date(end).getTime();

    if(e<b){
        tog=false;
    }
    return tog
};
var checkTel=function(tel){
    var mobile = /^1[3|5|8]\d{9}$/ , phone = /^0\d{2,3}-?\d{7,8}$/;
    return mobile.test(tel) || phone.test(tel);
};

function checkParameters(data){
    if(!data.content){
        layer.open({
            content: '请输入子任务内容！'
            ,skin: 'msg'
            ,time: 2 //2秒后自动关闭
        });
        return false;
    }
    // if(!data.contactMobile){
    //     layer.open({
    //         content: '请输入联系人电话！'
    //         ,skin: 'msg'
    //         ,time: 2 //2秒后自动关闭
    //     });
    //     return false;
    // }
    // if(!checkTel(data.contactMobile)){
    //     layer.open({
    //         content: '咨询人电话格式错误！'
    //         ,skin: 'msg'
    //         ,time: 2 //2秒后自动关闭
    //     });
    //     return false;
    // }
    // if(!data.contactName){
    //     layer.open({
    //         content: '请输入咨询人姓名！'
    //         ,skin: 'msg'
    //         ,time: 2 //2秒后自动关闭
    //     });
    //     return false;
    // }
    if(!data.beginTime){
        layer.open({
            content: '请输入开始时间！'
            ,skin: 'msg'
            ,time: 2 //2秒后自动关闭
        });
        return false;
    }
    if(!data.endTime){
        layer.open({
            content: '请输入结束时间！'
            ,skin: 'msg'
            ,time: 2 //2秒后自动关闭
        });
        return false;
    }
    if(!isScope(data.beginTime,data.endTime)){
        layer.open({
            content: '子任务结束时间不能小于开始时间！'
            ,skin: 'msg'
            ,time: 2 //2秒后自动关闭
        });
        return false;
    }
    if(!data.addressId){
        layer.open({
            content: '请输入地点！'
            ,skin: 'msg'
            ,time: 2 //2秒后自动关闭
        });
        return false;
    }

    return true;
}
//添加任务


function add_job(){
    var subArr={
        "subCode": $.getUrlParam('pkPostCode'),
        "addressId": $("#suggestId1").attr('data-id'),
        "beginTime": $("#serviceBeginTime").val(),
        "contactMobile": $("#contactMobile").val(),
        "contactName": $("#contactName").val(),
        "content": $("#contentB").val(),
        "endTime": $("#serviceEndTime").val(),
        "needNum": $("#needNum").val(),
        "serviceTime": timeTransformToMinute($("#serviceTime").val())
    };

    //验证管理员手机号数量
    if(subArr.contactMobile.length<11){
        subArr.managerMobile=''
    }
    if($("#contactMobile").attr('data-prjvId')){
        subArr['contactUser']=$("#contactMobile").attr('data-prjvId')
    }

    if(checkParameters(subArr)){
        $("#btn_add_job").attr("onclick", "");
        var b = new Date(subArr.beginTime).getTime();
        var e = new Date(subArr.endTime).getTime();
        subArr.beginTime=b;
        subArr.endTime=e;
        layer.open({
            title:'提示',
            content: '您确定修改子任务？'
            ,btn: ['确定', '取消']
            ,yes: function(index){
                layer.closeAll();
                $.ajax({
                    xhrFields: {
                        withCredentials: true
                    },
                    type: 'post',
                    url: base_url + "/html5/v1/newTask/updateSubTask",
                    data: JSON.stringify(subArr),
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
                                content: '修改成功！'
                                ,skin: 'msg'
                                ,time: 1 //2秒后自动关闭
                            });
                            setTimeout(function(){jump("task_management.html");},2000);
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
                            content: '修改失败！'
                            ,skin: 'msg'
                            ,time: 2 //2秒后自动关闭
                        });
                        $("#btn_add_job").attr("onclick", "add_job();");
                    }
                });
            }
        });

    }
}
$(function() {
    //剩余积分
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
    //加减微调事件
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
    });

//    添加子任务
    var len=1;
    $(".task_add_subBtn").click(function(){
        len+=1;
        var li=' <div class="task_sub_list">\n' +
            '                <div style="padding: 3%;padding-bottom: 0px;color: #9d9d9d;font-size: 15px;position:relative"><span style="color:#27b63f;">任务执行信息</span>(选填) <button class="removeParent_subBtn">删除</button></div>\n' +
            '                <ul class="warp_pws_c warp_pws_m_sp">\n' +
            '                    <li>\n' +
            '                        <div class="task_editor_title">子任务内容（100个汉字以内）</div>\n' +
            '                        <a href="javascript:void(0)" style="height:auto;background-image:none;">\n' +
            '                            <!--<input placeholder="子任务内容（100个汉字以内）" type="text" style="text-align: left;" disabled/>-->\n' +
            '                            <textarea id="contentB" class="task_area" placeholder="点击编辑内容" type="text"></textarea>\n' +
            '                        </a>\n' +
            '                    </li>\n' +
            '                    <li>\n' +
            '                        <a href="javascript:void(0)" style="background: none;">\n' +
            '                            <input id="contactMobile" placeholder="选填，请填写手机号"  type="text"/>\n' +
            '                            <b>子任务联系人 <button class="task_help_togBtn" data-txt="说明内容"></button></b>\n' +
            '                        </a>\n' +
            '                    </li>\n' +
            '                    <li>\n' +
            '                        <a href="javascript:void(0)" style="background: none;">\n' +
            '                            <input class=\'demo_time'+len+'\' id="serviceEndTime" type="text" readonly="true" name="applyBeginTime" placeholder="选择结束" value=""/>\n' +
            '                            <span style="margin:0px;float: right;width: 10%;text-align: center;">至</span>\n' +
            '                            <input class=\'demo_time'+len+'\' id="serviceBeginTime" type="text" readonly="true" name="applyBeginTime" placeholder="选择开始" value=""/>\n' +
            '                            <b>子任务时间</b>\n' +
            '                        </a>\n' +
            '                    </li>\n' +
            '                    <li>\n' +
            '                        <a id="addres" href="javascript:void(0)"><!--\n' +
            '                        <input type="button" value="搜索"/>-->\n' +
            '                            <input type="text" id="suggestId_update" placeholder="请输入地点或名称进行查询" class="mapTest" readonly onFocus="updateAdds();" style="display: none;"/>\n' +
            '                            <input type="text" id="suggestId'+len+'" placeholder="请输入地点或名称进行查询" class="mapTest" disabled="disabled" oninput="addsFalse();"/>\n' +
            '                            <div id="searchResultPanel'+len+'" style="border:1px solid #C0C0C0;width:100%;height:auto; display:none;"></div>\n' +
            '                            <div id="l-map'+len+'" style="display: none;"></div>\n' +
            '                            <input type="hidden" id="address">\n' +
            '                            <b>子任务地点</b>\n' +
            '                        </a>\n' +
            '                    </li>\n' +
            '                    <li>\n' +
            '                        <div class="warp_pws_c_sp default-'+len+'" data-name="子任务招募人数">\n' +
            '                            <b>子任务招募人数<span style="color: #9d9d9d;">（每人每次）</span></b>\n' +
            '                            <input id="needNum" type="text" name="total" class="spinnerExample spinnerExample'+len+'"/>\n' +
            '                        </div>\n' +
            '                    </li>\n' +
            '                    <li>\n' +
            '                        <div class="warp_pws_c_sp default-'+len+'" data-name="志愿者服务时长">\n' +
            '                            <b>志愿者服务时长<span style="color: #9d9d9d;">（小时）</span></b>\n' +
            '                            <input id="serviceTime" type="text" name="total" class="spinnerExample spinnerExample'+len+'"/>\n' +
            '                        </div>\n' +
            '                        <p class="warp_pws_c_so" style="height:auto;margin-top:.1rem;color:#999;text-align:justify;text-align-last:left">志愿者在完成任务并提交后，管理员根据其达成度给与的最大服务时长</p>\n' +
            '                    </li>\n' +
            '                </ul>\n' +
            '            </div>';
        $(".task_sub_list_wrap").append(li);

        //
        $('.demo_time'+len).mobiscroll().datetime({
            theme: theme,
            mode: mode,
            display: display,
            lang: lang,
            timeWheels: 'HHii',//HH:24小时制；hh:12小时制
            dateFormat:"yy/mm/dd",
            timeFormat: 'HH:ii',
            startYear: currYear,
            endYear: currYear +30,
            stepMinute: 1,
            showNow: true
        });

        $('.spinnerExample'+len).spinner({});

        //微调默认值和加减事件
        $(".default-"+len+" .increase").click();
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
        });
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
        });

        //地点
        // acMapEvent(len);

        //删除按钮显示和事件
        if($(".task_sub_list_wrap").find('.task_sub_list').length>1){
            $(".removeParent_subBtn").show().unbind('click').click(function(){
                if($(".task_sub_list_wrap").find('.task_sub_list').length>1){
                    $(".removeParent_subBtn").hide()
                }
                $(this).parents('.task_sub_list').remove()
            });
        }
    })
});

//服务类型、对象、场所和志愿者保障下拉
// function concealTog(type){
//     $("."+type).toggle(500);
// }
function conceal(type){
    $("."+type).toggle(500);
    if(type=='serviceDomain'){
        $("."+type+"_ul").empty();
        $.ajax({
            url: base_url+'/html5/v1/dict/serviceType/list',//服务类型
            type: "get",
            dataType: "json",
            data: "",
            headers: {'Content-Type': 'application/json'},
            success: function (resp) {
                if (resp.code == 0) {
                    var Objects = resp.data.data
                    for(var z in Objects){
                        var li='<li><span onclick="selectedSpan(this,\''+type+'\',\''+Objects[z].name+'\',\''+Objects[z].code+'\')" class="no_selectedSpen">'+Objects[z].name+'</span></li>';
                        $("."+type+"_ul").append(li);
                    }
                }
            }
        });
    }else if(type=='serviceTarget'){
        $("."+type+"_ul").empty();
        $.ajax({
            url: base_url+'/html5/v1/dict/serviceObject/list',//服务对象
            type: "get",
            dataType: "json",
            data: "",
            headers: {'Content-Type': 'application/json'},
            success: function (resp) {
                if (resp.code == 0) {
                    var Objects = resp.data.data
                    for(var z in Objects){
                        var li='<li><span onclick="selectedSpan(this,\''+type+'\',\''+Objects[z].name+'\',\''+Objects[z].code+'\')" class="no_selectedSpen">'+Objects[z].name+'</span></li>';
                        $("."+type+"_ul").append(li);
                    }
                }
            }
        });
    }else if(type=='servicePlace'){
        $("."+type+"_ul").empty();
        $.ajax({
            url: base_url+'/html5/v1/dict/servicePlace/list',//服务场所
            type: "get",
            dataType: "json",
            data: "",
            headers: {'Content-Type': 'application/json'},
            success: function (resp) {
                if (resp.code == 0) {
                    var Objects = resp.data.data
                    for(var z in Objects){
                        var li='<li><span onclick="selectedSpan(this,\''+type+'\',\''+Objects[z].name+'\',\''+Objects[z].code+'\')" class="no_selectedSpen">'+Objects[z].name+'</span></li>';
                        $("."+type+"_ul").append(li);
                    }
                }
            }
        });
    }else if(type=='welfare'){
        $("."+type+"_ul").empty();
        $.ajax({
            url: base_url+'/html5/v1/dict/baozhang/list',//志愿者
            type: "get",
            dataType: "json",
            data: "",
            headers: {'Content-Type': 'application/json'},
            success: function (resp) {
                if (resp.code == 0) {
                    var Objects = resp.data.data
                    for(var z in Objects){
                        var li='<li><span onclick="selectedSpan(this,\''+type+'\',\''+Objects[z].name+'\',\''+Objects[z].code+'\')" class="no_selectedSpen">'+Objects[z].name+'</span></li>';
                        $("."+type+"_ul").append(li);
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



// 百度地图API功能------子任务地点
var adds = false;
var lng, lat, address, province, city, district;
var acMapEvent=function(i){
    var map = new BMap.Map("l-map"+i);
    map.centerAndZoom("上海",15);
    var geolocation = new BMap.Geolocation();
    $("#suggestId"+i).removeAttr("disabled");
    $("#shuru").html("请输入地址或名称进行查询：");

    var ac = new BMap.Autocomplete(    //建立一个自动完成的对象
        {"input" : "suggestId"+i
            ,"location" : map
        });
    ac.addEventListener("onhighlight", function(e) {  //鼠标放在下拉列表上的事件
        var str = "";
        var _value = e.fromitem.value;
        var value = "";
        console.log(e)
        console.log(e.fromitem)
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
        $("#searchResultPanel"+i).html(str);
        $("#suggestId"+i).attr('data-id',e.target.$G)
    });
    var myValue;
    ac.addEventListener("onconfirm", function(e) {    //鼠标点击下拉列表后的事件
        adds = true;
        var _value = e.item.value;
        myValue = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
        $("#searchResultPanel").html("onconfirm<br />index = " + e.item.index + "<br />myValue = " + myValue);
        setPlace();
    });
    // ac.setInputValue('南通市启东市江苏省启东中学');
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
};
// acMapEvent(1);

var acMapGetId=function(){
    var map = new BMap.Map("l-map1");
    // map.centerAndZoom(new BMap.Point(116.404, 39.915), 11);
// 创建地址解析器实例
    var myGeo = new BMap.Geocoder();
// 将地址解析结果显示在地图上，并调整地图视野
    myGeo.getPoint("南通市启东市江苏省启东中学", function(point){
        console.log(point)
        x = point.lng;   //获取鼠标当前点击的经纬度
        y = point.lat;
        var points = new BMap.Point(x, y);
        myGeo.getLocation(points, function (rs) {
            console.log(rs)
            console.log(rs, "当前点击位置信息")
        });
        });
    myGeo.getCurrentPosition(function(r){
        console.log(r)
        //r为当前所在城市的信息。
    })
}
// acMapGetId()

//调查问卷
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
function addsFalse(){
    adds = false;
}


//检查管理员手机号是否实名
function checkLength_99(obj, l){
    var v = $(obj).val();
    console.log(v)
    if(v.length >= l){
        $(obj).val(v.substring(0,11));
        $.ajax({
            xhrFields: {
                withCredentials: true
            },
            type: 'post',
            url: base_url + "html5/v1/user/queryGyshUser",
            data: JSON.stringify({"mobile": v}),
            dataType:'json',
            headers : {'token':token},
            contentType: "application/json;charset=utf-8",
            success: function (data) {
                console.log(data)
                if (data.code == 0) {
                    // $('#jifen').text(data.data.integral);
                    if(data.data==''){
                        console.log('不存在');
                        $(".managerMobileHas").find('font').remove();
                        $(".managerMobileHas").append('<font style="color:#f03727">该手机号没有在系统实名注册</font>');
                        setTimeout(function(){
                            $(obj).val('')
                        },500)
                    }else{
                        $(".managerMobileHas").find('font').remove();
                        if(data.data.firstAccount!==''){
                            $(".managerMobileHas").append('<font style="color:#72b81e">该手机号为实名注册</font>')
                        }else{
                            $(".managerMobileHas").append('<font style="color:#f03727">该手机号没有在系统实名注册</font>')
                            setTimeout(function(){
                                $(obj).val('')
                            },500)
                        }
                    }
                }
            }
        });
    }else{
        // postNoL = v;
    }
}
function checkLength_98(obj, l){
    var v = $(obj).val();
    var psrentObj=$(obj).parents('a');
    console.log(v)
    if(v.length >= l){
        $(obj).val(v.substring(0,11));
        $.ajax({
            xhrFields: {
                withCredentials: true
            },
            type: 'post',
            url: base_url + "html5/v1/user/queryGyshUser",
            data: JSON.stringify({"mobile": v}),
            dataType:'json',
            headers : {'token':token},
            contentType: "application/json;charset=utf-8",
            success: function (data) {
                console.log(data)
                if (data.code == 0) {
                    // $('#jifen').text(data.data.integral);
                    if(data.data==''){
                        console.log('不存在');

                        psrentObj.find("#contactName").show().removeAttr('disabled');
                        psrentObj.find('.task_help_txt').show().html('<font style="color:#f03727">该手机号没有在系统实名注册，请补全联系人姓名</font>');

                    }else{
                        psrentObj.find("#contactName").hide();
                        psrentObj.find('.task_help_txt').html('').hide();

                        if(data.data.firstAccount!==''){
                            psrentObj.find("#contactName").show().val(data.data.realName).attr('disabled','disabled');
                            psrentObj.find('.task_help_txt').show().html('<font style="color:#72b81e">该手机号为实名注册</font>');
                            $(obj).attr('data-prjvId',data.data.prjvUserId)
                        }else{
                            psrentObj.find("#contactName").show().removeAttr('disabled');
                            psrentObj.find('.task_help_txt').show().html('<font style="color:#f03727">该手机号没有在系统实名注册，请补全联系人姓名</font>');
                            setTimeout(function(){
                                $(obj).val('')
                            },500)
                        }
                    }
                }
            }
        });
    }else{
        // postNoL = v;
    }
}
function checkLength_97(obj, l){
    var v = $(obj).val();
    console.log(v)
    if(v.length >= l){
        $(obj).val(v.substring(0,11));
        $.ajax({
            xhrFields: {
                withCredentials: true
            },
            type: 'post',
            url: base_url + "html5/v1/user/queryGyshUser",
            data: JSON.stringify({"mobile": v}),
            dataType:'json',
            headers : {'token':token},
            contentType: "application/json;charset=utf-8",
            success: function (data) {
                console.log(data)
                if (data.code == 0) {
                    if(data.data!==''){
                        $(obj).attr('data-prjvId',data.data.prjvUserId)
                    }
                }
            }
        });
    }else{
        // postNoL = v;
    }
}

//输入框限制字数
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

//指定结盟机构团体报名----显示指定机构搜索
function apply_type(obj){
    if($(obj).val()==5){
        $(".alliance").show();
    }else{
        $(".alliance").hide();
    }
}

//指定结盟机构团体报名
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
                    html += "<li style='width: 100%;padding: 0px;background: white;border-bottom:1px solid #B3B3B3;padding-left: 3%;padding-right:3%;' class='no_data'><a onclick='seletAlliance(\""+data1[z].orgName+"\", \""+data1[z].orgThirdAccount+"\")' style='width: 100%;text-align: left;'><div style=\"width: 100%;height:38px;margin: 0px;line-height: 49px;font-size: 14px;\">"
                        +data1[z].orgName+
                        "</div></a></li>";
                }
            }else if (data.code == 1) {
                html += "<li style='width: 100%;padding: 0px;' class='no_data'><a style='width: 100%;text-align: center;background-image:none;'><div style=\"color:#828282;width: 100%;height:38px;margin: 0px;line-height:49px;font-size: 14px;\">"+data.msg+"</div></a></li>"
                if(data1){
                    for(var z in data1){
                        html += "<li style='width: 100%;padding: 0px;background: white;border-bottom:1px solid #B3B3B3;padding-left: 3%;padding-right:3%;' class='no_data'><a onclick='seletAlliance(\""+data1[z].orgName+"\", \""+data1[z].orgThirdAccount+"\")' style='width: 100%;text-align: left;'><div style=\"width: 100%;height:38px;margin: 0px;line-height: 49px;font-size: 14px;\">"
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
