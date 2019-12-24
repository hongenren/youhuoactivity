
$(function(){
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
                $("#pointB").attr('data-maxlength',parseInt(data.data.integral))
                $('.spinnerExampleB').spinner({});
            }
        }
    });
    //服务类型
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
                    var li='<li data-code="'+Objects[z].code+'"><span onclick="selectedSpan(this,\'serviceDomain\',\''+Objects[z].name+'\',\''+Objects[z].code+'\')" class="no_selectedSpen">'+Objects[z].name+'</span></li>';
                    $(".serviceDomain_ul").append(li);
                }
            }
        }
    });
    //服务对象
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
                    var li='<li data-code="'+Objects[z].code+'"><span onclick="selectedSpan(this,\'serviceTarget\',\''+Objects[z].name+'\',\''+Objects[z].code+'\')" class="no_selectedSpen">'+Objects[z].name+'</span></li>';
                    $(".serviceTarget_ul").append(li);
                }
            }
        }
    });
    //服务场所
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
                    var li='<li data-code="'+Objects[z].code+'"><span onclick="selectedSpan(this,\'servicePlace\',\''+Objects[z].name+'\',\''+Objects[z].code+'\')" class="no_selectedSpen">'+Objects[z].name+'</span></li>';
                    $(".servicePlace_ul").append(li);
                }
            }
        }
    });
    //志愿者
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
                    var li='<li data-code="'+Objects[z].code+'"><span onclick="selectedSpan(this,\'welfare\',\''+Objects[z].name+'\',\''+Objects[z].code+'\')" class="no_selectedSpen">'+Objects[z].name+'</span></li>';
                    $(".welfare_ul").append(li);
                }
            }
        }
    });
});

function conceal(type) {
    $("." + type).toggle(500);
    var selectArr = $('#' + type).val();
    if (selectArr) {
        if (selectArr.indexOf(',') > 0) {
            selectArr = selectArr.split(',')
        } else {
            selectArr = [selectArr]
        }
    }
    $.each($("." + type + "_ul").find('li'), function (index, item) {
        var class4 = 'no_selectedSpen';
        for (var j in selectArr) {
            if ($(item).attr('data-code') == selectArr[j]) {
                class4 = 'selectedSpen'
            }
        }
        $(item).find('span').attr('class', class4)
    });
}

// function conceal(type){
//     $("."+type).toggle(500);
//     if(type=='serviceDomain'){
//         $("."+type+"_ul").empty();
//         $.ajax({
//             url: base_url+'/html5/v1/dict/serviceType/list',//服务类型
//             type: "get",
//             dataType: "json",
//             data: "",
//             headers: {'Content-Type': 'application/json'},
//             success: function (resp) {
//                 if (resp.code == 0) {
//                     var Objects = resp.data.data
//                     var selectArr=$('#'+type).val();
//                     if(selectArr){
//                         if(selectArr.indexOf(',')>0){
//                             selectArr=selectArr.split(',')
//                         }else {
//                             selectArr=[selectArr]
//                         }
//                     }
//                     for(var z in Objects){
//                         var class4='no_selectedSpen';
//                         for(var j in selectArr){
//                             if(Objects[z].code==selectArr[j]){
//                                 class4='selectedSpen'
//                             }
//                         }
//                         var li='<li><span onclick="selectedSpan(this,\''+type+'\',\''+Objects[z].name+'\',\''+Objects[z].code+'\')" class="'+class4+'">'+Objects[z].name+'</span></li>';
//                         $("."+type+"_ul").append(li);
//                     }
//                 }
//             }
//         });
//     }else if(type=='serviceTarget'){
//         $("."+type+"_ul").empty();
//         $.ajax({
//             url: base_url+'/html5/v1/dict/serviceObject/list',//服务对象
//             type: "get",
//             dataType: "json",
//             data: "",
//             headers: {'Content-Type': 'application/json'},
//             success: function (resp) {
//                 if (resp.code == 0) {
//                     var Objects = resp.data.data
//                     var selectArr=$('#'+type).val();
//                     if(selectArr){
//                         if(selectArr.indexOf(',')>0){
//                             selectArr=selectArr.split(',')
//                         }else {
//                             selectArr=[selectArr]
//                         }
//                     }
//                     for(var z in Objects){
//                         var class4='no_selectedSpen';
//                         for(var j in selectArr){
//                             if(Objects[z].code==selectArr[j]){
//                                 class4='selectedSpen'
//                             }
//                         }
//                         var li='<li><span onclick="selectedSpan(this,\''+type+'\',\''+Objects[z].name+'\',\''+Objects[z].code+'\')" class="'+class4+'">'+Objects[z].name+'</span></li>';
//                         $("."+type+"_ul").append(li);
//                     }
//                 }
//             }
//         });
//     }else if(type=='servicePlace'){
//         $("."+type+"_ul").empty();
//         $.ajax({
//             url: base_url+'/html5/v1/dict/servicePlace/list',//服务场所
//             type: "get",
//             dataType: "json",
//             data: "",
//             headers: {'Content-Type': 'application/json'},
//             success: function (resp) {
//                 if (resp.code == 0) {
//                     var Objects = resp.data.data
//                     var selectArr=$('#'+type).val();
//                     if(selectArr){
//                         if(selectArr.indexOf(',')>0){
//                             selectArr=selectArr.split(',')
//                         }else {
//                             selectArr=[selectArr]
//                         }
//                     }
//                     for(var z in Objects){
//                         var class4='no_selectedSpen';
//                         for(var j in selectArr){
//                             if(Objects[z].code==selectArr[j]){
//                                 class4='selectedSpen'
//                             }
//                         }
//                         var li='<li><span onclick="selectedSpan(this,\''+type+'\',\''+Objects[z].name+'\',\''+Objects[z].code+'\')" class="'+class4+'">'+Objects[z].name+'</span></li>';
//                         $("."+type+"_ul").append(li);
//                     }
//                 }
//             }
//         });
//     }else if(type=='welfare'){
//         $("."+type+"_ul").empty();
//         $.ajax({
//             url: base_url+'/html5/v1/dict/baozhang/list',//志愿者
//             type: "get",
//             dataType: "json",
//             data: "",
//             headers: {'Content-Type': 'application/json'},
//             success: function (resp) {
//                 if (resp.code == 0) {
//                     var Objects = resp.data.data;
//                     var selectArr=$('#'+type).val();
//                     if(selectArr){
//                         if(selectArr.indexOf(',')>0){
//                             selectArr=selectArr.split(',')
//                         }else {
//                             selectArr=[selectArr]
//                         }
//                     }
//                     for(var z in Objects){
//                         var class4='no_selectedSpen';
//                         for(var j in selectArr){
//                             if(Objects[z].code==selectArr[j]){
//                                 class4='selectedSpen'
//                             }
//                         }
//                         var li='<li><span onclick="selectedSpan(this,\''+type+'\',\''+Objects[z].name+'\',\''+Objects[z].code+'\')" class="'+class4+'">'+Objects[z].name+'</span></li>';
//                         $("."+type+"_ul").append(li);
//                     }
//                 }
//             }
//         });
//     }
// }
