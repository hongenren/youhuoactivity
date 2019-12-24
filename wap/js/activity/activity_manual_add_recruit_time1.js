
window.onload=function(){
    var activityCode = $.getUrlParam("activityCode");
    var sectionList = $.getUrlParam("sectionList");
    getUser(page,size);
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
function getUser(pageNumber, pageSize) {
    if(pageNumber==1){
        page = 1;
    }
    $.ajax({
        //url: base_url + '/html5/v1/orgPlace/queryMembersForVerify',
        url: base_url + '/html5/v1/user/searchUserInfo',
        //url: '/cm/termapi/geArticletListByMy',
        type: "post",
        async: false,
        dataType: "json",
        //data:JSON.stringify({"searchContent":$(".memberSearchVal").val(), "pageNumber":pageNumber, "pageSize":pageSize, "prjvOrgId":prjvorgMsg.prjvOrgId}),
        data:JSON.stringify({"userLoginMobile":$(".memberSearchVal").val()}),
        headers: {'Content-Type': 'application/json', 'token': $.cookie("token")},
        success: function (resp) {
            if (resp.code == 0) {
                var userList = resp.data;
                var html = "";
                if(userList!=null && userList!=""){
                    //$.each(userList,function(index,val) {
                        html += '<li>\
                                <a href="javascript:void(0)" data-id="' + userList.userId + '" data-name="' + userList.userCertUserName + '" data-mobile="' + userList.userLoginMobile + '">\
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
                clickUser();
            }
        }
    });
}

function clickUser() {
    $(".warp_zy_h_List li a").click(function() {
        if($(this).hasClass("selected")){
            $(this).removeClass("selected");
            $(this).css("background","#FFFFFF url( ../wap/img/pws_276.png) no-repeat center");
            $(this).css("background-size","15px 15px");
            $(this).css("background-position","97%");
        }else{
            $(this).addClass("selected");
            $(this).css("background","#FFFFFF url( ../wap/img/pws_276_on.png) no-repeat center");
            $(this).css("background-size","15px 15px");
            $(this).css("background-position","97%");
        }
    })
}

var page = 1, size = 10;
launchScroll();
function returnScroll(){
    page++;
    $("#btn").val("下一步，新增记录");
    getUser(page,size);
}