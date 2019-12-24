var dataJson = {"pageSize":20,"pageNumber":1}, total="", area_info_city_html="", cuieqhcuob=0;
function queryIndex(type,pageNumber=1,pageSize=20) {
    dataJson.pageNumber = pageNumber;
    $.ajax({
        url: base_url + '/html5/v1/orgPlace/queryYellowIndexPage2',
        type: "post",
        dataType: "json",
        data: JSON.stringify(dataJson),
        headers: {'Content-Type': 'application/json'},
        success: function (resp) {
            if (resp.code == 0) {
                if(type==0){
                    $(".warp_bp_p").empty();
                }
                var data = resp.data;
                var orgPlaceList = data.records;
                total = "<span style='width:50%;position: absolute;right: 0px;top: 0px;padding-right: 10%;font-size: 0.22rem;color: #9d9d9d;'>共"+data.total+"个</span>";
                $("#area_info_city").html(area_info_city_html + total);
                if(data.total<(data.size*data.current)){
                    pageNumber_=1;
                    pageSize_=20;
                    dataJson.pageNumber = 1;
                    dataJson.pageSize = 20;
                }
                for (var i in orgPlaceList) {
                    var markTags = "";
                    if(orgPlaceList[i].markTags!=null && orgPlaceList[i].markTags!=""){
                        var markTags_arr = orgPlaceList[i].markTags.split(";");
                        for (var j = 0; j < markTags_arr.length; j++) {
                            var markTagsArr = markTags_arr[j];
                            if (markTagsArr != "") {
                                if (markTagsArr.indexOf("公益基地") >= 0) {
                                    if (orgPlaceList[i].baseNo != undefined && orgPlaceList[i].baseNo != null && orgPlaceList[i].baseNo != "") {
                                        markTags += '<dd>' + orgPlaceList[i].baseNo + "号公益基地</dd>";
                                    }
                                } else {
                                    markTags += '<dd>' + markTagsArr + '</dd>';
                                }
                            }
                        }
                    }else{
                        if(orgPlaceList[i].baseNo!=null && orgPlaceList[i].baseNo!=""){
                            markTags += '<dd>'+orgPlaceList[i].baseNo+"号</dd>";
                        }
                    }
                    var jumpStr = "mobileDetailClaim.html?id=" + orgPlaceList[i].id;
                    if (orgPlaceList[i].orgThirdAccount && orgPlaceList[i].personFirstAccount) {
                        markTags += '<dd><img src="images/hylist4.png" style="width: 0.22rem;height: 0.22rem;"><i>实名</i></dd>';
                        jumpStr = "mobileDetail.html?id=" + orgPlaceList[i].id + "&prjvUserId=" + orgPlaceList[i].prjvUserId;
                    } else {
                        markTags += '<dd class="on">待认领</dd>';
                    }

                    var district = orgPlaceList[i].district;
                    district = district != undefined && district != null && district != "" ? district : "";
                    var addressDetail = orgPlaceList[i].addressDetail;
                    addressDetail = addressDetail != undefined && addressDetail != null && addressDetail != "" ? addressDetail : "";
                    var address = district + addressDetail;
                    if (addressDetail.indexOf(district) != -1) {
                        address = addressDetail;
                    }
                    $(".warp_bp_p").append(
                        "<li onclick='jump(\"" + jumpStr + "\")'>\
                            <a href='javascript:void(0)'>\
                            <h3>" + orgPlaceList[i].name + "</h3>\
                            <dl>\
                                " + markTags.replace("1001:", "") + "\
                            </dl>\
                            <div class='hycon2'>\
                                <img src='images/hylist5.png' style='width: 0.2rem;height: 0.2rem;'/>\
                                <p style='margin-bottom: 0px;'><span>" + address + "</span></p>\
                            </div>\
                            </a>\
                        </li>");
                }
                if(orgPlaceList.length==0){/*
                    if(cuieqhcuob == 0){
                        cuieqhcuob = 1;*/
                        $(".noneLi").hide();
                        $(".warp_bp_p").append(
                            "<li class='noneLi' style='background: #F2F2F2;'>\
                                <a href='javascript:void(0)'>\
                                <h3 style='text-align: center;'>已经没有更多啦。。。</h3>\
                                </a>\
                            </li>");
                    //}
                }else{
                    //cuieqhcuob = 0;
                }
            }
        }
    });
}
function get_quanguo(){
    $(".mb_2").hide();
    var html = "";
    var arr = { "parent": 0};
    $.ajax({
        xhrFields: {
            withCredentials: true
        },
        type:'post',
        url:base_url + "/html5/v1/region/findByParent",
        data:JSON.stringify(arr),
        dataType:'json',
        contentType: "application/json;charset=utf-8",
        success:function(data){
            var data_index = data.data;
            $.each(data_index,function(k,val) {
                html += '<li style="width: 50%;float: left;text-align: center;">\
                                    <a href="javascript:void(0)" data-id="' + val.areaCode + '" onclick=get_district_msg1(' + val.id + ',' + 0 + ',"' + val.name + '",' + val.areaCode + ')>' + val.name + '</a>\
                                </li>';
            });
            $("#province").html(html);
        },
        error:function(){
            layer.open({
                content: '获取失败'
                ,skin: 'msg'
                ,time: 1 //2秒后自动关闭
            });
            return false;
        }
    })
}
function get_quxian(name){
    var html = "";
    var arr = { "name": name};
    $.ajax({
        xhrFields: {
            withCredentials: true
        },
        type:'post',
        url:base_url + "/html5/v1/region/findByName",
        data:JSON.stringify(arr),
        dataType:'json',
        contentType: "application/json;charset=utf-8",
        success:function(data){
            var data_index = data.data
            parent = data_index[0].id
            get_district_msg(parent, 1);
        },
        error:function(){
            layer.open({
                content: '获取失败'
                ,skin: 'msg'
                ,time: 1 //2秒后自动关闭
            });
            return false;
        }
    })
}
function get_district_list(name, areaCode, type, id){
    $(".hylistsx1").hide();
    $(".mb").hide();
    if(type==0){
        area_info_city_html = name+'<i></i>';
        $("#area_info_city").html(area_info_city_html);
        $("#area_info").html('按区域<i></i>');
        $("#area_info").attr('data-id',"");
        get_district_msg3(id,1,name,areaCode);
    }else{
        $("#area_info").html(htmlSubstring(name)+'<i></i>');
        $("#area_info").attr('data-id',areaCode);
        select_("adCode",areaCode);
    }
    $(".screenButList").removeClass('choice');
    return ;
}
function get_district_msg(parent,type=0,name="",areaCode=""){
    var city = $('#allmap').attr('city');
    if(type+1 == 5 || parent==-1){
        //判断 如果点击的是村级  则关闭选项并传值
        $(".hylistsx1").hide();
        $(".mb_1").hide();
        //$(".choice").removeClass("choice");
        $("#area_info").html(htmlSubstring(name)+'<i></i>');
        $("#area_info").attr('data-id',areaCode);
        select_("adCode",areaCode);
        $(".chylisthead .screenButList").removeClass('choice');
        return ;
    }
    var html = '';
    $.ajax({
        xhrFields: {
            withCredentials: true
        },
        type:'post',
        url:base_url + "/html5/v1/region/findByParent",
        data:JSON.stringify({"parent":parent}),
        dataType:'json',
        contentType: "application/json;charset=utf-8",
        success:function(data){
            if(data.code==0){
                var data_index = data.data;
                $.each(data_index,function(k,val){
                    if(k==0){
                        if(type == 0) {
                            if(zhixiashi(name)){
                                html += '<li class="choice">\
                                    <a href="javascript:void(0)" data-id="310" onclick=get_district_list("'+name+'",'+areaCode+',0,'+val.id+')>全省</a>\
                                </li>';
                            }
                        }else if(type == 1){
                            html += '<li class="choice">\
                                    <a href="javascript:void(0)" data-id="310" onclick=get_district_list("'+name+'",'+areaCode+',1,'+val.id+')>全市</a>\
                                </li>';
                        }else if(type == 2){
                            html += '<li class="choice">\
                                    <a href="javascript:void(0)" data-id="-1" onclick=get_district_list("'+name+'",'+areaCode+',1,'+val.id+')>全区</a>\
                                </li>';
                        }else if(type == 3){
                            html += '<li class="choice">\
                                    <a href="javascript:void(0)" data-id="-1" onclick=get_district_list("'+name+'",'+areaCode+',1,'+val.id+')>全街道</a>\
                                </li>';
                        }
                    }
                    if(val.name != "市辖区"){
                        if(type == 0) {
                            html += '<li class="choice">\
                                    <a href="javascript:void(0)" data-id="'+val.areaCode+'" onclick=get_district_msg2('+val.id+','+(type+1)+',"'+val.name+'",'+val.areaCode+')>'+val.name+'</a>\
                                </li>';
                        }else{
                            html += '<li class="choice">\
                                    <a href="javascript:void(0)" data-id="'+val.areaCode+'" onclick=get_district_msg('+val.id+','+(type+1)+',"'+val.name+'",'+val.areaCode+')>'+val.name+'</a>\
                                </li>';
                        }
                    }
                });
                if(type == 0){
                    //添加区
                    $("#cityDiv").show();
                    $("#city").html(html);
                    $("#city_province").html(html);
                }else if(type == 1){
                    $("#areaDiv").show();
                    $("#area_c1Div").hide();
                    $("#area_1Div").hide();

                    $("#area").html(html);
                }else if(type == 2){
                    $("#areaDiv").hide();
                    $("#area_c1Div").show();
                    $("#area_1Div").hide();

                    $("#area_c1").html(html);
                }else if(type == 3){
                    $("#areaDiv").hide();
                    $("#area_c1Div").hide();
                    $("#area_1Div").show();

                    $("#area_1").html(html);
                }
            }else{
                layer.open({content:data.msg,skin: 'msg',time: 1});
                return false;
            }
        },
        error:function(e){
            layer.open({content:'获取失败',skin: 'msg',time: 1});
            return false;

        }
    })
}
function select_address(name,id,val,city,type){
    if(type==0){
        select_("adCode",val);
    }else{
        get_district_msg2(id,1,city,val);
    }
    area_info_city_html = city+'<i></i>';
    $("#area_info_city").html(area_info_city_html);
}
function get_district_msg1(parent,type=0,name="",areaCode=""){
    get_district_msg(parent,type,name,areaCode);
    select_("adCode",areaCode,null,1);
    $("#provinceDiv").hide();
    $("#cityDiv").show();
    $(".choice").removeClass("choice");
}
var cityId = "";
function get_district_msg2(parent,type,name="",areaCode=""){
    area_info_city_html = name+'<i></i>';
    $("#area_info_city").html(area_info_city_html);
    $("#area_info").html('按区域<i></i>');
    $("#area_info").attr('data-id',"");
    cityId = parent;
    $("#provinceDiv").show();
    $("#cityDiv").hide();
    $(".hylistsxc").hide();
    $(".screenBut").removeClass("choice");
    $(".mb_2").hide();
    if(city_province==1){
        city_province=0;
        $(".mb_1").hide();
        $(".hylistsx1").css("top", "280");
        $("#hot_city").hide();
        $("#gps_city").hide();
        $("#city_name").show();
        $("#provinceDiv").hide();
        $("#cityDiv").hide();
        $("#city_provinceDiv").hide();
        $("#areaDiv").show();
        $("#area_c1Div").hide();
        $("#area_1Div").hide();
        $(".hylistsx1").show().siblings().hide();
        $(".mb_2").show();
    }
    get_district_msg(parent,type,name,areaCode);
    select_('adCode',areaCode,null,1); //查询
}
var city_province = 0;
function get_district_msg3(parent,type,name="",areaCode=""){
    city_province = 1;
    area_info_city_html = htmlSubstring(name)+"<i></i>";
    $("#area_info_city").html(area_info_city_html+total);
    $("#area_info").html('按区域<i></i>');
    $("#area_info").attr('data-id',"");
    cityId = parent;
    $("#provinceDiv").show();
    $("#cityDiv").hide();
    $("#city_provinceDiv").show();
    $("#areaDiv").hide();
    $(".hylistsxc").hide();
    $(".screenBut").removeClass("choice");
    $(".mb_2").hide();
    get_district_msg(parent,type,name,areaCode);
    select_('adCode',areaCode); //查询
}
function select_(name,val,obj,type){
    if(name=="searchContent"){dataJson.searchContent = val;}
    if(name=="adCode"){dataJson.adCode = val;}
    if(name=="orgType"){
        dataJson.orgType = val;
        updateWENZI("单位性质","orgTypesB1", val,obj);
    }
    if(name=="isFanCount"){
        dataJson.isFanCount = true;
        dataJson.lat = "";dataJson.lng = "";dataJson.isVolHours = "";dataJson.isVolPersonCount = "";
        updateWENZI("排序","orgTypesB3", "1",obj);
    }else if(name=="lnglat"){
        dataJson.lat = latCurrent;dataJson.lng = lngCurrent;
        dataJson.isFanCount = "";dataJson.isVolHours = "";dataJson.isVolPersonCount = "";
        updateWENZI("排序","orgTypesB3", "1",obj);
    }else if(name=="isVolHours"){
        dataJson.isVolHours = true;
        dataJson.isFanCount = "";dataJson.lat = "";dataJson.lng = "";dataJson.isVolPersonCount = "";
        updateWENZI("排序","orgTypesB3", "1",obj);
    }else if(name=="isVolPersonCount"){
        dataJson.isVolPersonCount = true;
        dataJson.isFanCount = "";dataJson.lat = "";dataJson.lng = "";dataJson.isVolHours = "";
        updateWENZI("排序","orgTypesB3", "1",obj);
    }

    if(name=="markTag"){
        dataJson.markTag = val;
        $(".orgTypesB2").html(htmlSubstring($(obj).html()));
    }else if(name=="orgNature"){
        dataJson.orgNature = val;
        $(".orgTypesB2").html(htmlSubstring($(obj).html()));
    }else if(name=="industryType"){
        dataJson.industryType = val;
        $(".orgTypesB2").html(htmlSubstring($(obj).html()));
    }else if(name=="serviceType"){
        dataJson.serviceType = val;
        $(".orgTypesB2").html(htmlSubstring($(obj).html()));
    }
    queryIndex(0);
    if(type!=1) {
        $(".hylistsxc").hide();
        $(".mb").hide();
        $(".screenBut").removeClass("choice");
    }
}
function queryOrgClassify(){
    $.ajax({
        xhrFields: {
            withCredentials: true
        },
        type: "post",
        url: base_url + 'html5/v1/orgPlace/queryOrgClassify',
        headers: {'token': token},
        dataType: 'json',
        contentType: "application/json;charset=utf-8",
        success: function (resp) {
            if (resp.code == 0) {
                var data = resp.data;
                var markTagList = data.markTagList;
                for (var i in markTagList) {
                    $(".markTagList").append("<li>\
                                                <span onclick='selectedScreening(\"markTag\",\""+markTagList[i].code+"\",this)'>"+markTagList[i].name+"</span>\
                                            </li>");
                }
                var orgNatureList = data.orgNatureList;
                for (var i in orgNatureList) {
                    $(".orgNatureList").append("<li>\
                                                <span onclick='selectedScreening(\"orgNature\",\""+orgNatureList[i].code+"\",this)'>"+orgNatureList[i].name+"</span>\
                                            </li>");
                }
                var industryTypeList = data.industryTypeList;
                for (var i in industryTypeList) {
                    $(".industryTypeList").append("<li>\
                                                <span onclick='selectedScreening(\"industryType\",\""+industryTypeList[i].code+"\",this)'>"+industryTypeList[i].name+"</span>\
                                            </li>");
                }
                var orgServiceTypeList = data.orgServiceTypeList;
                for (var i in orgServiceTypeList) {
                    $(".orgServiceTypeList").append("<li>\
                                                <span onclick='selectedScreening(\"serviceType\",\""+orgServiceTypeList[i].code+"\",this)'>"+orgServiceTypeList[i].name+"</span>\
                                            </li>");
                }
                var orgTypeList = data.orgTypeList;
                for (var i in orgTypeList) {
                    $(".orgTypeList").append("<li>\
                                                <span onclick='select_(\"orgType\",\""+orgTypeList[i].code+"\",this)'>"+orgTypeList[i].name+"</span>\
                                            </li>");
                }
            }
        }
    })
}
var sortBy = function (filed, rev, primer) {
    rev = (rev) ? -1 : 1;
    return function (a, b) {
        a = a[filed];
        b = b[filed];
        if (typeof (primer) != 'undefined') {
            a = primer(a);
            b = primer(b);
        }
        if (a < b) { return rev * -1; }
        if (a > b) { return rev * 1; }
        return 1;
    }
};
function htmlSubstring(html){
    if(html){
        if(html.length>4){
            html = html.substring(0,3)+"...";
        }
    }
    return html;
}
function selectedScreening(type,val,obj){
    cancelSelected(obj);
    if(type=="markTag"){
        if(dataJson.markTag == val && val!=undefined){
            dataJson.markTag = undefined;
            $(obj).css({"background-color": "#ffffff","color": " #000000"});
        }else{
            dataJson.markTag = val;
            $(obj).css({"background-color": "#72B81E","color": " #ffffff"});
        }
    }
    if(type=="orgNature"){
        if(dataJson.orgNature == val && val!=undefined){
            dataJson.orgNature = undefined;
            $(obj).css({"background-color": "#ffffff","color": " #000000"});
        }else{
            dataJson.orgNature = val;
            $(obj).css({"background-color": "#72B81E","color": " #ffffff"});
        }
    }
    if(type=="industryType"){
        if(dataJson.industryType == val && val!=undefined){
            dataJson.industryType = undefined;
            $(obj).css({"background-color": "#ffffff","color": " #000000"});
        }else{
            dataJson.industryType = val;
            $(obj).css({"background-color": "#72B81E","color": " #ffffff"});
        }
    }
    if(type=="serviceType"){
        if(dataJson.serviceType == val && val!=undefined){
            dataJson.serviceType = undefined;
            $(obj).css({"background-color": "#ffffff","color": " #000000"});
        }else{
            dataJson.serviceType = val;
            $(obj).css({"background-color": "#72B81E","color": " #ffffff"});
        }
    }
}
function cancelSelected(obj){
    $(obj).parent("li").siblings().each(function(){
        $(this).children("span").css({"background-color": "#ffffff","color": " #000000"});
    })
}
function updateWENZI(name, cla, val, obj){
    if(val=="" || val==undefined){
        $("."+cla).children("a").children("b").html(name);
    }else{
        $("."+cla).children("a").children("b").html(htmlSubstring($(obj).html()));
    }
}
function findCity(name){
    $.ajax({
        xhrFields: {
            withCredentials: true
        },
        type:'post',
        url:base_url + "/html5/v1/region/findByName",
        data:JSON.stringify({ "name": name}),
        dataType:'json',
        contentType: "application/json;charset=utf-8",
        success:function(data){
            var data_index = data.data;
            select_address('adCode',data_index[0].id,data_index[0].areaCode,data_index[0].name, data_index[0].level);
        }
    })
}


//获取滚动条当前的位置
function getScrollTop() {
    var scrollTop = 0;
    if(document.documentElement && document.documentElement.scrollTop) {
        scrollTop = document.documentElement.scrollTop;
    } else if(document.body) {
        scrollTop = document.body.scrollTop;
    }
    return scrollTop;
}
//获取当前可视范围的高度
function getClientHeight() {
    var clientHeight = 0;
    if(document.body.clientHeight && document.documentElement.clientHeight) {
        clientHeight = Math.min(document.body.clientHeight, document.documentElement.clientHeight);
    } else {
        clientHeight = Math.max(document.body.clientHeight, document.documentElement.clientHeight);
    }
    return clientHeight;
}
//获取文档完整的高度
function getScrollHeight() {
    return Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
}//滚动事件触发
var pageNumber_=1,pageSize_=20;
window.onscroll = function() {
    if(getScrollTop() + getClientHeight() == getScrollHeight()) {
        pageNumber_++;
        queryIndex(1,pageNumber_,pageSize_);
    }
}
function selectByDict(){
    $.ajax({
        xhrFields: {
            withCredentials: true
        },
        type: "post",
        url: base_url + 'html5/v1/region/hotCity',
        dataType: 'json',
        contentType: "application/json;charset=utf-8",
        success: function (resp) {
            if (resp.code == 0) {
                var record = resp.data.data;
                for (var i in record) {
                    $("#hot_city").append("<div name='hot_city' onclick=\"select_address('adCode','"+record[i].id+"','"+record[i].areaCode+"','"+record[i].name+"',1)\" style=\"height: 25%;width: 33.3%;float: left;text-align: center;\">"+record[i].name+"</div>");
                }
                $("div[name='hot_city']").each(function () {
                    $(this).css("line-height",($(this).height()*2)+"px");
                })
            }
        }
    })
}