
window.onload=function(){
    var activityCode = $.getUrlParam("activityCode");
    var startDay = $.getUrlParam("startDay");
    var endDay = $.getUrlParam("endDay");
    getActivityList(page,size);
    $("#btn").click(function() {
        var user = "", activityCode = "";
        $.each($(".warp_zy_h_List li a"),function(index,val) {
            if($(this).hasClass("selected")){
                user = $(this).attr("data-id");
            }
        })
        $.each($(".warp_zy_h_List1 li a"),function(index,val) {
            if($(this).hasClass("selected")){
                activityCode = $(this).attr("data-code");
            }
        })
        if(activityCode!=null && user!=null && activityCode!="" && user!=""){
            window.location.href = "activity_afterwards_change_time1.html?activityCode="+activityCode+"&user="+user;
        }else{
            layer.open({
                content: '请选择人员和活动'
                ,skin: 'msg'
                ,time: 1 //2秒后自动关闭
            });
        }
    })
}
function getUser() {
    $.ajax({
        //url: base_url + '/html5/v1/orgPlace/queryMembersForVerify',
        url: base_url + '/html5/v1/user/searchUserInfo',
        //url: '/cm/termapi/geArticletListByMy',
        type: "post",
        async: false,
        dataType: "json",
        //data:JSON.stringify({"searchContent":$(".memberSearchVal").val(), "pageSize":10, "pageNumber":1, "prjvOrgId":prjvorgMsg.prjvOrgId}),
        data:JSON.stringify({"userLoginMobile":$(".memberSearchVal").val()}),
        headers: {'Content-Type': 'application/json', 'token': $.cookie("token")},
        success: function (resp) {
            if (resp.code == 0) {
                var userList = resp.data;
                var html = "";
                if(userList!=null && userList!=""){
                    //$.each(userList,function(index,val) {
                        html += '<li>\
                                <a href="javascript:void(0)" data-id="' + userList.userId + '">\
                                    <span>' + userList.userCertUserName + '<span style="color: #acacb4">' + userList.userLoginMobile + '</span></span>\
                                </a>\
                            </li>';
                    //});
                }else{
                    html = '<li>\
                                <a href="javascript:void(0)" style="background-image: none;">\
                                    <span>暂无数据</span>\
                                </a>\
                            </li>';
                }
                $(".warp_zy_h_List").html(html);
                clickUl("warp_zy_h_List");
            }
        }
    });
}

function getActivityList(pageNumber, pageSize) {
    $.ajax({
        url: base_url + '/html5/v1/activity/queryClosed',
        //url: '/cm/termapi/geArticletListByMy',
        type: "post",
        dataType: "json",
        data: "{\"orgCode\": \"" + prjvorgMsg.orgThirdAccount + "\", \"pageNumber\": \""+pageNumber+"\", \"pageSize\": \""+pageSize+"\", \"type\": 10, \"months\" :3}",
        headers: {'Content-Type': 'application/json', 'token': $.cookie("token")},
        success: function (resp) {
            if (resp.code == 0) {
                var html = "";
                var region = resp.data.records;
                for (var i in region) {
                    var userList = resp.data.records;
                    var html = "";
                    if(userList!=null && userList!=""){
                        $.each(userList,function(index,val) {
                            html += '<li>\
                                <a href="javascript:void(0)" data-code="' + val.activityCode + '">\
                                    <span>' + val.name + '<span style="color: #acacb4">' + dateFormatting(val.startDay) + '-' + dateFormatting(val.endDay) + '</span></span>\
                                    <span>' + val.address + '</span>\
                                </a>\
                            </li>';
                        });
                    }else{
                        html = '<li>\
                                <a href="javascript:void(0)" style="background-image: none;">\
                                    <span>暂无数据</span>\
                                </a>\
                            </li>';
                    }
                }
                $(".warp_zy_h_List1").append(html);
                clickUl("warp_zy_h_List1");
            }
        }
    });
}

function clickUl(className) {
    $("."+className+" li a").click(function() {
        if($(this).hasClass("selected")){
            $(this).removeClass("selected");
            $(this).css("background","#FFFFFF url( ../wap/img/pws_276.png) no-repeat center");
            $(this).css("background-size","15px 15px");
            $(this).css("background-position","97%");
        }else{
            removeUl(className);
            $(this).addClass("selected");
            $(this).css("background","#FFFFFF url( ../wap/img/pws_276_on.png) no-repeat center");
            $(this).css("background-size","15px 15px");
            $(this).css("background-position","97%");
        }
    })
}
function removeUl(className) {
    $.each($("."+className+" li a"),function(index,val) {
            $(this).removeClass("selected");
            $(this).css("background","#FFFFFF url( ../wap/img/pws_276.png) no-repeat center");
            $(this).css("background-size","15px 15px");
            $(this).css("background-position","97%");
    })
}

var page = 1, size = 10;
launchScroll();
function returnScroll(){
    page++;
    $("#btn").val("下一步");
    getActivityList(page,size);
}