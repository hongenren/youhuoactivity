
var activityCode = $.getUrlParam("activityCode"), sectionCode = $.getUrlParam("sectionCode"), page=1, size=10;
window.onload=function(){
    selectBySectionRecruit(page, size);
    $("#btn").click(function() {
        var json = [], i = 0;
        $.each($(".warp_zy_h_List li a"),function(index,val) {
            if($(this).hasClass("selected")){
                i++;
                var objJson = {};
                objJson.openId = $(this).attr("data-id");
                objJson.nickName = encodeURI ($(this).attr("data-name"));
                objJson.mobile = $(this).attr("data-mobile");
                json.push(objJson);
            }
        })
        if(i>0){
            window.location.href = encodeURI ("activity_manual_add_recruit_time2.html?activityCode="+activityCode+"&userList="+JSON.stringify(json)+"&sectionList="+sectionList);
        }else{
            layer.open({
                content: '请选择需要添加的人员'
                ,skin: 'msg'
                ,time: 1 //2秒后自动关闭
            });
        }
    })
}
function selectBySectionRecruit(pageNumber,pageSize) {
    if(pageNumber==1){
        page = 1;
    }
    var html = "";
    var datas = JSON.stringify({"sectionCode":sectionCode,"recruitCode":"","pageNumber":pageNumber,"pageSize":pageSize,"state":20});
    $.ajax({
        url: base_url + '/html5/v1/recruit/selectBySectionRecruit',
        type: "post",
        async: false,
        dataType: "json",
        data:datas,
        headers: {'Content-Type': 'application/json', 'token': $.cookie("token")},
        success: function (resp) {
            if (resp.code == 0) {
                var userList = resp.data.records;
                if(userList!=null && userList!=""){
                    $.each(userList,function(index,val) {
                        var manual = "未补登";
                        if(val.isManual==3){
                            manual = "已补登";
                        }
                        html += '<li>\
                                <a href="activity_manual_sign2.html?ticketCode='+val.ticket+'&userCode='+val.user+'&recruitName='+encodeURI(encodeURI(val.name))+'&arriveTime='+val.arriveTime
                            +'&times='+val.times+'&checkInTime='+val.checkInTime+'&checkOutTime='+val.checkOutTime+'&nickName='+encodeURI(encodeURI(val.nickName))+'&headImg='+val.headImg+'">\
                                    <span>' + val.nickName + '<b style="font-weight:normal;color: #acacb4;float: right;margin-right: 30px;">'+manual+'</b><span style="color: #acacb4;">' + val.mobile + '</span></span>\
                                </a>\
                            </li>';
                    });
                }
            }
        }
    });
    if(html==""){
        html = '<li>\
                    <a href="javascript:void(0)" style="background-image: none;">\
                        <span>暂无数据</span>\
                    </a>\
                </li>';
    }
    $(".warp_zy_h_List").html(html);
}
function getUser(pageNumber,pageSize) {
    if(pageNumber==1){
        page = 1;
    }
    var html = "";
    var datas = JSON.stringify({"searchValue":$(".memberSearchVal").val(), "sectionCode":sectionCode,"pageNumber":pageNumber,"pageSize":pageSize,"state":20, "recruitcode":""});
    //var datas = JSON.stringify({"userLoginMobile":$(".memberSearchVal").val()});
    $.ajax({
        url: base_url + '/html5/v1/recruit/searchByNameOrMobile',//岗位
        //ssurl: base_url + '/html5/v1/user/searchUserInfo',//岗位
        type: "post",
        async: false,
        dataType: "json",
        data:datas,
        headers: {'Content-Type': 'application/json', 'token': $.cookie("token")},
        success: function (resp) {
            if (resp.code == 0) {
                var userList = resp.data.records;
                if(userList!=null && userList!=""){
                    $.each(userList,function(index,val) {
                        var manual = "未补登";
                        if(val.isManual==3){
                            manual = "已补登";
                        }
                        /*if(val.isManual==1){
                            manual = "已补登";
                        }*/
                        html += '<li>\
                                <a href="activity_manual_sign2.html?ticketCode='+val.ticket+'&userCode='+val.user+'&recruitName='+encodeURI(encodeURI(val.name))+'&arriveTime='+val.arriveTime
                                    +'&times='+val.times+'&checkInTime='+val.checkInTime+'&checkOutTime='+val.checkOutTime+'&nickName='+encodeURI(encodeURI(val.nickName))+'&headImg='+val.headImg+'">\
                                    <span>' + val.nickName + '<b style="font-weight:normal;color: #acacb4;float: right;margin-right: 30px;">'+manual+'</b><span style="color: #acacb4;">' + val.mobile + '</span></span>\
                                </a>\
                            </li>';
                    });
                }
            }
        }
    });
    if(html==""){
        html = '<li>\
                    <a href="javascript:void(0)" style="background-image: none;">\
                        <span>暂无数据</span>\
                    </a>\
                </li>';
    }
    $(".warp_zy_h_List").html(html);
}
var page = 1, size = 10;
launchScroll();
function returnScroll(){
    page++;
    getUser(page, size);
}