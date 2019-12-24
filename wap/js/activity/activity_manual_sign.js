window.onload=function(){
    findByActivityCode(page,size);
}
function findByActivityCode(pageNumber,pageSize){
    if(pageNumber==1){
        page = 1;
    }
    var html = "";
    $.ajax({
        url: base_url + '/html5/v1/section/selectByName',
        type: "post",
        async: false,
        dataType: "json",
        data: JSON.stringify({"searchValue": $(".memberSearchVal").val(), "orgCode": prjvorgMsg.orgThirdAccount, "state": 20, "pageSize":pageSize, "pageNumber":pageNumber}),
        headers: {'Content-Type': 'application/json', 'token': $.cookie("token")},
        success: function (resp) {
            if (resp.code == 0) {
                var data1 = resp.data.records;
                if(data1!=null && data1!=""){
                    $.each(data1,function(index,val) {
                        html +='<li>\
                                <a href="activity_manual_sign1.html?activityCode='+val.activityCode+'&sectionCode='+val.code+'">\
                                    <span>' + val.name + '</span>\
                                    <span style="color: #acacb4">' + dateFormatting(val.day) + " " + val.startTime + " - " + val.endTime + '</span>\
                                    <span>' + val.address + '</span>\
                                </a>\
                            </li>';
                    })
                }else{
                    html +='<li>\
                                <a href="#">\
                                    <span>暂无数据</span>\
                                    <span style="color: #acacb4"></span>\
                                </a>\
                            </li>';
                }
            }
        }
    })
    $(".warp_zy_h_List").html(html);
}

var page = 1, size = 10;
launchScroll();
function returnScroll(){
    page++;
    findByActivityCode(page,size);
}