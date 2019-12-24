
function findByActivityCode2(num){
    $(".warp_zy_h_List2").empty();
    findByActivityCode(num)
}
function findByActivityCode(pageNumber){
    var arr={
        "searchValue": $(".memberSearchVal").val(),
        "orgCode": prjvorgMsg.orgThirdAccount,
        "state": 30,
        "pageSize":10,
        "pageNumber":pageNumber
    };
    $.ajax({
        url: base_url + 'html5/v1/newTask/subTaskByOrg',
        type: "post",
        async: false,
        dataType: "json",
        data: JSON.stringify(arr),
        headers: {'Content-Type': 'application/json', 'token': $.cookie("token")},
        beforeSend:function(XMLHttpRequest){
            $(".loadings").show();
            $(".lastext").hide();
        },
        success: function (resp) {
            if (resp.code == 0) {
                var data1 = resp.data.records;
                var html = "";
                if(data1!=null && data1!=""){
                    $.each(data1,function(index,val) {
                        var orgName=val.orgName;
                        var address=val.address;
                        var beginTime=val.beginTime;
                        var endTime=val.endTime;
                        var mainCode=val.mainCode;
                        var subCode=val.subCode;
                        var serviceTime=timeTransformToHour(val.serviceTime);
                        var name=val.name;
                        // html +='<li>\
                        //         <a href="activity_manual_sign1.html?activityCode='+val.activityCode+'&sectionCode='+val.code+'">\
                        //             <span>' + val.name + '</span>\
                        //             <span style="color: #acacb4">' + dateFormatting(val.day) + " " + val.startTime + " - " + val.endTime + '</span>\
                        //             <span>' + val.address + '</span>\
                        //         </a>\
                        //     </li>';
                        var postfile={
                            "name":name,
                            "beginTime":beginTime,
                            "endTime":endTime,
                            "serviceTime": serviceTime,
                            "subCode":subCode
                        };
                        html+='<li>\n' +
                            '            <a data-json="'+encodeURI(JSON.stringify(postfile))+'" href="javascript:void(0)">\n' +
                            // '                <span>'+orgName+'</span>\n' +
                            '                <span class="trac_list_title">'+name+'</span>\n' +
                            '                <span style="color: #acacb4">'+(beginTime.replace(/\-/g,'/')).substring(0,beginTime.indexOf(':')+3)+' 至 '+(endTime.replace(/\-/g,'/')).substring(0,endTime.indexOf(':')+3)+'</span>\n' +
                            '                <span>'+address+'</span>\n' +
                            '            </a>\n' +
                            '        </li>'
                    })
                }else{
                    $(".loadings").hide();
                    $(".lastext").show();
                    scrollEvent(pageNumber-1)
                }
                $(".warp_zy_h_List2").append(html);
            }
        },
        error:function(){
            layer.open({
                content: '获取失败'
                ,skin: 'msg'
                ,time: 1 //2秒后自动关闭
            });
            return false;
        },
        complete:function(){
            $(".loadings").hide();
        }
    })

}
var scrollEvent=function(pageNumber){
    var pageNumber=pageNumber||1
    //滚动事件
    var t=0;
    var p=0;
    $(window).scroll(function(e){
        t=$(this).scrollTop();
        var doc=$(document).height();
        var win=$(window).height();
        console.log('doc-'+doc,' win-'+win)
        if(p<=t){//console.log("向下");
            if(t>doc-(win+100)){

                if($(document).height() - $(window).height() - $(window).scrollTop()<5){
                    //添加数据
                    pageNumber+=1;
                    findByActivityCode(pageNumber)

                }
            }else{
                $(".loadings").hide();
                $(".lastext").hide();
            }

        }else{//console.log("向上")
        }
        setTimeout(function(){p=t},0)
    });
};
window.onload=function(){
    findByActivityCode(1);
    scrollEvent(1)
};


