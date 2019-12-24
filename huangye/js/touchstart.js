var titleImgArray = ["images/hylist3.png"];
var num=0;
function photo_Slide() {
    var titleImgObj = $("#titleImg");
    $.ajax({
        url: titleImgArray[num]+"?x-oss-process=image/info",
        type: "get",
        dataType: "json",
        success: function (resp) {
            titleImgObj.css("height","100%");
            titleImgObj.attr("src", titleImgArray[num]+"?x-oss-process=image/resize,m_fixed,h_"+resp.ImageHeight.value+",w_"+resp.ImageWidth.value);
        },error: function () {
            titleImgObj.attr("src", titleImgArray[num]);
            titleImgObj.css("height","auto");
        }
    })
}
photo_Slide();
function aprev_photo_Slide(){
    num--;
    if(num==-1){
        num=titleImgArray.length-1;
    }
    photo_Slide();
}
function anext_photo_Slide(){
    num++;
    if(num==titleImgArray.length){
        num=0;
    }
    photo_Slide();
}

var startX = 0, startY = 0, moveEndX = 0, moveEndY = 0;
$("#titleImg").on("touchstart", function(e) {
    // 判断默认行为是否可以被禁用
    if (e.cancelable) {
        // 判断默认行为是否已经被禁用
        if (!e.defaultPrevented) {
            e.preventDefault();
        }
    }
    startX = e.originalEvent.changedTouches[0].pageX,
    startY = e.originalEvent.changedTouches[0].pageY;
});
$("#titleImg").on("touchend", function(e) {
    // 判断默认行为是否可以被禁用
    if (e.cancelable) {
        // 判断默认行为是否已经被禁用
        if (!e.defaultPrevented) {
            e.preventDefault();
        }
    }
    moveEndX = e.originalEvent.changedTouches[0].pageX,
    moveEndY = e.originalEvent.changedTouches[0].pageY;
    var X = moveEndX - startX;
    var Y = moveEndY - startY;
    if ( X > 0 ) {
        aprev_photo_Slide();
    }else if ( X < 0 ) {
        anext_photo_Slide();
    }
/* //下滑
 else if ( Y > 0) {
     alert('下滑');    
 }
 //上滑
 else if ( Y < 0 ) {
     alert('上滑');    
 }
 //单击
 else{
     alert('单击');    
 }*/
});