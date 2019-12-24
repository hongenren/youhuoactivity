var total="", area_info_city_html="";
function login_in(pageNumber,pageSize,categoryCode,city,adCode){
    dataJson.address = adCode;
    var startDay = "";
    var endDay = "";
    var dayType = $(".orgTypesB").attr("data-id");
    if(dayType==1){//今天
        startDay = formatDate(new Date(nowYear, nowMonth, nowDay));
        endDay = startDay;
    }else if(dayType==2){//明天
        var date = new Date();
        date.setTime(now.getTime()+24*60*60*1000);
        startDay = formatDate(date);
        endDay = startDay;
    }else if(dayType==3){//本周
        startDay = getWeekStartDate();
        endDay = getWeekEndDate();
    }else if(dayType==4){//本周末
        startDay = getWeekendStartDate();
        endDay = getWeekEndDate();
    }else if(dayType==5){//本月
        startDay = getMonthStartDate();
        endDay = getMonthEndDate();
    }
    var lat = $('#allmap').attr('lat');
    var lng = $('#allmap').attr('lng');
    if(categoryCode=="FJ" && (lat=="" || lat==null || lat==undefined)){
        $(".noneLi").hide();
        $(".warp_bp_p").append(
            "<li class='noneLi' style='background: #F2F2F2;'>\
                <a href='javascript:void(0)'>\
                <h3 style='text-align: center;'>无法获得经纬度信息，请检查定位。</h3>\
                </a>\
            </li>");
        me.lock();
        me.noData();  //无数据重置
        me.resetload();
    }else{
        //searchMe.lock();
        var url = base_url + "html5/v1/activity/queryByCategory";
        $(".warp_bp_p").empty();
        $('#content').dropload({
            scrollArea : window,
            loadDownFn : function(me){
                queryMe = me;
                $(".noneLi").hide();
                $(".dropload-down").remove();
                pageNumber++;
                if(city==''){
                    var data = {"adCode":adCode,"lat":lat,"lng":lng,"startDay":startDay,"endDay":endDay,"categoryCode":categoryCode,"pageNumber":pageNumber,"pageSize":pageSize};
                }else{
                    var data = {"adCode":adCode,"lat":lat,"lng":lng,"startDay":startDay,"endDay":endDay,"categoryCode":categoryCode,"pageNumber":pageNumber,"pageSize":pageSize,"address":city};
                }
                $.ajax({
                    xhrFields: {
                        withCredentials: true
                    },
                    type:"post",
                    url:url,
                    data:JSON.stringify(data),
                    dataType:'json',
                    contentType: "application/json;charset=utf-8",
                    success:function(data){
                        //数据获取成功
                        if(data.code==0){
                            if(data.data!=''){
                                var data1 = data.data.records;
                                total = "<span style='width:50%;position: absolute;right: 0px;top: 0px;padding-right: 10%;font-size: 0.22rem;color: #9d9d9d;'>共"+data.data.total+"个</span>";
                                $("#area_info_city").html(area_info_city_html + total);
                                if(data1.length>0){
                                    var html = "";
                                    $.each(data1,function(v,k) {
                                        var starttimes = k.startDay;
                                        var endDay = k.endDay;
                                        html += '<li>\
                                                <a href="../activity/activity_content.html?activityCode='+k.activityCode+'">\
                                        <p><i>主办方：</i>'+k.orgName+'</p><br/>';
                                        if(k.coverImg!=''){
                                            html += '<img src="' +k.coverImg +'">';
                                        }else{
                                            if(k.orgLogo!='') {
                                                html += '<img src="' +k.orgLogo +'">';
                                            }else{
                                                html += '<img src="../wap/img/pws_37.jpg">';
                                            }
                                        }
                                        html += '<div class="warp_bp_p_sp">\
                                                <div class="warp_bp_p_so">\
                                                    <b style="font-size: 16px;font-weight: bold">'+k.name+'</b>\
                                                </div>\
                                                <div class="warp_bp_p_si">';
                                        /*<p class="bm_sl_p">\
                                        <b style="color: #999999;">'+'</b>\                                            \
                                        </p>\*/
                                        if(k.tag!=''){
                                            var tag_arr = k.tag.split(';');
                                            for(i=0;i<tag_arr.length;i++){
                                                if(tag_arr[i]!=''){
                                                    html += '<span>'+tag_arr[i]+'</span>';
                                                }
                                            }
                                        }
                                        html += '</div>';
                                        if(starttimes == '--') {
                                            html += '<p style="padding-top: 5px;width: 100%;overflow: hidden">时间：<i>' + endDay.substring(5,7)+'月'+endDay.substring(8,10) + '日</i></p>';
                                        }else{
                                            html += '<p style="padding-top: 5px;width: 100%;overflow: hidden;color: #999999;">时间：<i style="color: #000000;">' + starttimes.substring(5,7)+'月'+starttimes.substring(8,10)+'日-'+endDay.substring(5,7)+'月'+endDay.substring(8,10) + '日</i></p>';
                                        }
                                        html += '<p style="padding-top: 5px;width: 100%;overflow: hidden;color: #999999;">地点：<i style="color: #000000;">'+k.address+'</i></p>\
                                            <p style="padding-top: 5px;width: 100%;overflow: hidden;color: #999999;">已报名人次：<i style="color: #72B81E;">'+k.attend+'</i></p>\
                                                </div>\
                                                </a>\
                                                <div class="tickets_number">\
                                                    <div>'+k.recruitNeed+'<br/><i>岗位人数</i></div>\
                                                    <div>'+k.taskNeed+'<br/><i>任务人数</i></div>\
                                                    <div>'+k.publicNeed+'<br/><i>公众门票</i></div>\
                                                    <div style="border-right: 0px;">'+k.mediaGuestNeed+'<br/><i>媒体记者</i></div>\
                                                </div>\
                                            </li>';
                                    });
                                    $(".warp_bp_p").append(html); //追加html
                                    me.resetload();
                                }else{
                                    $(".noneLi").hide();
                                    if(categoryCode=="FJ"){
                                        $(".warp_bp_p").append(
                                            "<li class='noneLi' style='background: #F2F2F2;'>\
                                                <a href='javascript:void(0)'>\
                                                <h3 style='text-align: center;'>附近暂无活动。。。</h3>\
                                                </a>\
                                            </li>");
                                    }else{
                                        $(".warp_bp_p").append(
                                            "<li class='noneLi' style='background: #F2F2F2;'>\
                                                <a href='javascript:void(0)'>\
                                                <h3 style='text-align: center;'>已经没有更多啦。。。</h3>\
                                                </a>\
                                            </li>");
                                    }
                                    me.lock();
                                    me.noData();  //无数据重置
                                    me.resetload();
                                }
                            }else{
                                html += '<div class=\"zw_sj_p\">\
                                <img src=\"../wap/img/pws_164.png\" style="padding-top:30%;display:block">\
                                </div>';
                                $(".warp_bp_p").html(html);
                                me.lock();
                                me.noData();  //无数据重置
                            }
                        }else{
                            layer.open({
                                content: data.msg
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
                        me.resetload();
                    }
                })
            }
        })
    }
}
var dataJson = {"pageSize":20,"pageNumber":1};
function select_(name,val,obj,type){
    if(name=="address"){dataJson.address = val;}
    if(name=="searchValue"){dataJson.searchValue = val;}
    if(name=="Day"){
        updateWENZI("按时段","orgTypesB1", val,obj);
        getDay(val);
    }
    if(name=="time"){
        dataJson.startDay = $("#applyBeginTime").val();
        dataJson.endDay = $("#applyEndTime").val();
    }
    if(name=="tag"){dataJson.tag = val;}
    if(name=="hasIntegral"){dataJson.hasIntegral = val;}
    if(name=="user"){dataJson.user = val;}
    if(name=="state"){dataJson.state = val;}
    if(name=="applyState"){dataJson.applyState = val;}
    if(name=="numLevel"){dataJson.numLevel = val;}
    if(name=="orgType"){
        dataJson.orgType = val;
        updateWENZI("主办方性质","orgTypesB2", val,obj);
    }
    queryIndex();
    if(type!=1){
        $(".selectList2").hide();
        $(".hylistsxc").hide();
        $(".mb").hide();
        $(".screenBut").removeClass("choice");
    }
}
function select_address(name,id,val,city,type){
    if(type==0){
        select_("address",val);
    }else{
        get_district_msg2(id,1,city,val,132);
    }
    area_info_city_html = city+'<i></i>';
    $("#area_info_city").html(area_info_city_html);
}
function queryIndex(pageNumber=0,pageSize=20){
    queryMe.lock();
    var url = base_url + "html5/v1/activity/search";
    $(".warp_bp_p").empty();
    $('#content').dropload({
        scrollArea : window,
        loadDownFn : function(me){
            searchMe = me;
            $(".dropload-down").remove();
            pageNumber++;
            dataJson.pageNumber = pageNumber;
            dataJson.pageSize = pageSize;
            $.ajax({
                xhrFields: {
                    withCredentials: true
                },
                type:"post",
                url:url,
                data:JSON.stringify(dataJson),
                dataType:'json',
                contentType: "application/json;charset=utf-8",
                success:function(data){
                    //数据获取成功
                    if(data.code==0){
                        if(data.data!=''){
                            var data1 = data.data.records;
                            total = "<span style='width:50%;position: absolute;right: 0px;top: 0px;padding-right: 10%;font-size: 0.22rem;color: #9d9d9d;'>共"+data.data.total+"个</span>";
                            $("#area_info_city").html(area_info_city_html + total);
                            if(data1.length>0){
                                var html = "";
                                $.each(data1,function(v,k) {
                                    var starttimes = k.startDay;
                                    var endDay = k.endDay;
                                    html += '<li>\
                                                <a href="../activity/activity_content.html?activityCode='+k.activityCode+'">\
                                        <p><i>主办方：</i>'+k.orgName+'</p><br/>';
                                    if(k.coverImg!=''){
                                        html += '<img src="' +k.coverImg +'">';
                                    }else{
                                        if(k.orgLogo!='') {
                                            html += '<img src="' +k.orgLogo +'">';
                                        }else{
                                            html += '<img src="../wap/img/pws_37.jpg">';
                                        }
                                    }
                                    html += '<div class="warp_bp_p_sp">\
                                                <div class="warp_bp_p_so">\
                                                    <b style="font-size: 16px;font-weight: bold">'+k.name+'</b>\
                                                </div>\
                                                <div class="warp_bp_p_si">';
                                /*<p class="bm_sl_p">\
                                <b style="color: #999999;">'+'</b>\                                            \
                                </p>\*/
                                    if(k.tag!=''){
                                        var tag_arr = k.tag.split(';');
                                        for(i=0;i<tag_arr.length;i++){
                                            if(tag_arr[i]!=''){
                                                html += '<span>'+tag_arr[i]+'</span>';
                                            }
                                        }
                                    }
                                    html += '</div>';
                                    if(starttimes == '--') {
                                        html += '<p style="padding-top: 5px;width: 100%;overflow: hidden">时间：<i>' + endDay.substring(5,7)+'月'+endDay.substring(8,10) + '日</i></p>';
                                    }else{
                                        html += '<p style="padding-top: 5px;width: 100%;overflow: hidden;color: #999999;">时间：<i style="color: #000000;">' + starttimes.substring(5,7)+'月'+starttimes.substring(8,10)+'日-'+endDay.substring(5,7)+'月'+endDay.substring(8,10) + '日</i></p>';
                                    }
                                    html += '<p style="padding-top: 5px;width: 100%;overflow: hidden;color: #999999;">地点：<i style="color: #000000;">'+k.address+'</i></p>\
                                            <p style="padding-top: 5px;width: 100%;overflow: hidden;color: #999999;">已报名人次：<i style="color: #72B81E;">'+k.attend+'</i></p>\
                                                </div>\
                                                </a>\
                                                <div class="tickets_number">\
                                                    <div>'+k.recruitNeed+'<br/><i>岗位人数</i></div>\
                                                    <div>'+k.taskNeed+'<br/><i>任务人数</i></div>\
                                                    <div>'+k.publicNeed+'<br/><i>公众门票</i></div>\
                                                    <div style="border-right: 0px;">'+k.mediaGuestNeed+'<br/><i>媒体记者</i></div>\
                                                </div>\
                                            </li>';
                                });
                                $(".warp_bp_p").append(html); //追加html
                                me.resetload();
                            }else{
                                $(".noneLi").hide();
                                $(".warp_bp_p").append(
                                    "<li class='noneLi' style='background: #F2F2F2;'>\
                                        <a href='javascript:void(0)'>\
                                        <h3 style='text-align: center;'>已经没有更多啦。。。</h3>\
                                        </a>\
                                    </li>");
                                me.lock();
                                me.noData();  //无数据重置
                                me.resetload();
                            }
                        }else{
                            html += '<div class=\"zw_sj_p\">\
                                <img src=\"../wap/img/pws_164.png\" style="padding-top:30%;display:block">\
                                </div>';
                            $(".warp_bp_p").html(html);
                            me.lock();
                            me.noData();  //无数据重置
                        }
                    }else{
                        layer.open({
                            content: data.msg
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
                    me.resetload();
                }
            })
        }
    })
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
        get_district_msg3(id,1,name,areaCode,132);
    }else{
        $("#area_info").html(htmlSubstring(name)+'<i></i>');
        $("#area_info").attr('data-id',areaCode);
        select_("address",areaCode);
    }
    $(".screenButList").removeClass('choice');
    return ;
}
function get_district_msg(parent,type=0,name="",areaCode="",categoryCode){
    var city = $('#allmap').attr('city');
    if(type+1 == 5 || parent==-1){
        //判断 如果点击的是村级  则关闭选项并传值
        $(".hylistsx1").hide();
        $(".mb_1").hide();
        //$(".choice").removeClass("choice");
        $("#area_info").html(htmlSubstring(name)+'<i></i>');
        $("#area_info").attr('data-id',areaCode);
        if(categoryCode!=0) {
            select_('address', areaCode); //查询
        }
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
                                    <a href="javascript:void(0)" data-id="'+val.areaCode+'" onclick=get_district_msg2('+val.id+','+(type+1)+',"'+val.name+'",'+val.areaCode+',132)>'+val.name+'</a>\
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
function get_district_msg1(parent,type=0,name="",areaCode=""){
    //select_("address",name,null,1);
    //login_in(0,20,categorycode,name,areaCode);
    get_district_msg(parent,type,name,areaCode);
    $("#provinceDiv").hide();
    $("#cityDiv").show();
}
var cityId = "";
function get_district_msg2(parent,type,name="",areaCode="",categoryCode){
    area_info_city_html = htmlSubstring(name)+"<i></i>";
    $("#area_info_city").html(area_info_city_html+total);
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
    if(categoryCode!=0) {
        if(categoryCode==132){
            login_in(0,20,categorycode,name,areaCode);
        }else{
            select_('address', areaCode); //查询
        }
    }
}
var city_province = 0;
function get_district_msg3(parent,type,name="",areaCode="",categoryCode){
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
    if(categoryCode!=0) {
        if(categoryCode==132){
            login_in(0,20,categorycode,name,areaCode);
        }else{
            select_('address', areaCode); //查询
        }
    }
}
function selectByDict(){
    $.ajax({
        xhrFields: {
            withCredentials: true
        },
        type: "post",
        url: base_url + 'html5/v1/activity/selectByDict',
        data: "{\"dictName\":\"招募状态\"}",
        headers: {'token': token},
        dataType: 'json',
        contentType: "application/json;charset=utf-8",
        success: function (resp) {
            if (resp.code == 0) {
                var record = resp.data;
                for (var i in record) {
                    $(".recruiting").append("<li>\n" +
                        "                        <span onclick='selectedScreening(\"applyState\",\""+record[i].fieldValue+"\",this)'>"+record[i].fieldName+"</span>\n" +
                        "                    </li>");
                }
            }
        }
    })
    $.ajax({
        xhrFields: {
            withCredentials: true
        },
        type: "post",
        url: base_url + 'html5/v1/activity/selectByDict',
        data: "{\"dictName\":\"活动状态\"}",
        headers: {'token': token},
        dataType: 'json',
        contentType: "application/json;charset=utf-8",
        success: function (resp) {
            if (resp.code == 0) {
                var record = resp.data;
                for (var i in record) {
                    $(".active_state").append("<li>\n" +
                        "                        <span onclick='selectedScreening(\"state\",\""+record[i].fieldValue+"\",this)'>"+record[i].fieldName+"</span>\n" +
                        "                    </li>");
                }
            }
        }
    })
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
                var orgTypeList = data.orgTypeList;
                for (var i in orgTypeList) {
                    $(".natureUl").append("<li>\n" +
                        "                        <span onclick='select_(\"orgType\",\""+orgTypeList[i].code+"\",this)'>"+orgTypeList[i].name+"</span>\n" +
                        "                    </li>");
                }
                var orgServiceTypeList = data.orgServiceTypeList;
                for (var i in orgServiceTypeList) {
                    $(".service_sector").append("<li>\n" +
                        "                        <span onclick='selectedScreening(\"orgServiceType\",\""+orgServiceTypeList[i].code+"\",this)'>"+orgServiceTypeList[i].name+"</span>\n" +
                        "                    </li>");
                    //"                        <span onclick='selectedScreening(\"orgType\",\""+orgTypeList[i].code+"\")'>"+orgTypeList[i].name+"</span>\n" +
                }
            }
        }
    })
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
                    $("#hot_city").append("<div name='hot_city' onclick=\"select_address('address','"+record[i].id+"','"+record[i].areaCode+"','"+record[i].name+"',1)\" style=\"height: 25%;width: 33.3%;float: left;text-align: center;\">"+record[i].name+"</div>");
                }
                $("div[name='hot_city']").each(function () {
                    $(this).css("line-height",($(this).height()*2)+"px");
                })
            }
        }
    })
}
function switchWarp_hd_t_bu(type, obj){
    $(obj).css("background-color", "#40AFFE");
    $(obj).children("span").css("color", "#ffffff");
    if(type==0){
        $(obj).next().css("background-color", "#ffffff");
        $(obj).next().children("span").css("color", "#000000");
        $(".date_time_specified").show();
        $(".date_time_custom").hide();
    }else{
        $(obj).prev().css("background-color", "#ffffff");
        $(obj).prev().children("span").css("color", "#000000");
        $(".date_time_custom").show();
        $(".date_time_specified").hide();
    }
}
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
    if(type=="applyState"){
        if(dataJson.applyState == val && val!=undefined){
            dataJson.applyState = undefined;
            $(obj).css({"background-color": "#ffffff","color": " #000000"});
        }else{
            dataJson.applyState = val;
            $(obj).css({"background-color": "#72B81E","color": " #ffffff"});
        }
    }
    if(type=="state"){
        if(dataJson.state == val && val!=undefined){
            dataJson.state = undefined;
            $(obj).css({"background-color": "#ffffff","color": " #000000"});
        }else{
            dataJson.state = val;
            $(obj).css({"background-color": "#72B81E","color": " #ffffff"});
        }
    }
    if(type=="orgServiceType"){
        if(dataJson.orgServiceType == val && val!=undefined){
            dataJson.orgServiceType = undefined;
            $(obj).css({"background-color": "#ffffff","color": " #000000"});
        }else{
            dataJson.orgServiceType = val;
            $(obj).css({"background-color": "#72B81E","color": " #ffffff"});
        }
    }/*
    if(val == undefined){
        $(obj).css({"background-color": "#72B81E","color": " #ffffff"});
    }*/
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
            select_address('address',data_index[0].id,data_index[0].areaCode,data_index[0].name, data_index[0].level);
        }
    })
}
function getDay(val){
    if(val==1){//今天
        dataJson.startDay = formatDate(new Date(nowYear, nowMonth, nowDay));
        dataJson.endDay = dataJson.startDay;
    }else if(val==2){//明天
        var date = new Date();
        date.setTime(now.getTime()+24*60*60*1000);
        dataJson.startDay = formatDate(date);
        dataJson.endDay = dataJson.startDay;
    }else if(val==3){//本周
        dataJson.startDay = getWeekStartDate();
        dataJson.endDay = getWeekEndDate();
    }else if(val==4){//本周末
        dataJson.startDay = getWeekendStartDate();
        dataJson.endDay = getWeekEndDate();
    }else if(val==5){//本月
        dataJson.startDay = getMonthStartDate();
        dataJson.endDay = getMonthEndDate();
    }else{
        dataJson.startDay = "";
        dataJson.endDay = "";
    }
}

function jumpLink(href){
    window.location.href = href + '&adCode='+dataJson.address;
}