
/*--------------------实现2(返回 $_GET 对象, 仿PHP模式)----------------------*/
var $_GET = (function(){
    var url = window.document.location.href.toString();
    var u = url.split("?");
    if(typeof(u[1]) == "string"){
        u = u[1].split("&");
        var get = {};
        for(var i in u){
            var j = u[i].split("=");
            get[j[0]] = j[1];
        }
        return get;
    } else {
        return {};
    }
})();
// ----------------------------------------------------------------------
// 限制只能输入数字和字母
$.fn.onlyNumAlpha = function () {
        $(this).keypress(function (event) {
            var eventObj = event || e;
            var keyCode = eventObj.keyCode || eventObj.which;
            if ((keyCode >= 48 && keyCode <= 57) || (keyCode >= 65 && keyCode <= 90) || (keyCode >= 97 && keyCode <= 122))
                return true;
            else
                return false;
        }).focus(function () {
            this.style.imeMode = 'disabled';
        }).bind("paste", function () {
            var clipboard = window.clipboardData.getData("Text");
            if (/^(\d|[a-zA-Z])+$/.test(clipboard))
                return true;
            else
                return false;
        });
    };
function click_str_null(str,msg){
    if(!$.trim(str)||$.trim(str)==0){
        layer.open({
        content: msg
        ,skin: 'msg'
        ,time: 1 //2秒后自动关闭
        });
        return false;
    }
    return true;
}
 //时间字符串字符分割
    function split_datetime(datetime){
        var stime,str;
        var arr = {};
        stime = datetime.split(" ");  //分割时间 已年月日   时分秒 分割
        var str =stime[1].substring(0,stime[1].length-3);  //去掉字符串后三位
        var arr = {"date":stime[0],"str":str};
        return arr;
    }
    $.mergeJsonObject = function (jsonbject1, jsonbject2) {
        var resultJsonObject={};
    for(var attr in jsonbject1){
        resultJsonObject[attr]=jsonbject1[attr];
    }
    for(var attr in jsonbject2){
        resultJsonObject[attr]=jsonbject2[attr];
    }
    return resultJsonObject;
};
//时间 格式转化时间戳
    function datetime_delayed(arriveTime){
        var date = new Date(arriveTime.replace(/-/g, '/'));
        var time3 = Date.parse(date);
        return time3;
    }
//时间比较
function getFormatDate() {
        var date = new Date();
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        var getHours = date.getHours();
        var getMinutes = date.getMinutes();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        if (getHours >= 0 && getHours <= 9) {
            getHours = "0" + getHours;
        }
        if (getMinutes >= 0 && getMinutes <= 9) {
            getMinutes = "0" + getMinutes;
        }
        var currentDate = date.getFullYear() + "-" + month + "-" + strDate
                + " " + getHours + ":" + getMinutes;
        return currentDate;
    }
    //   直接传进开始时间很结束时间
   function compareTime(startTime,endTime) {
//          var start_time=startTime.replace(/-|\s|:|\//g,'').replace(' ', ''); //用这个加强版也可以
        var start_time = startTime.replace(/-|\s|:|\//g,'');
        var end_time = endTime.replace(/-|\s|:|\//g,'');
        if (start_time < end_time) {
            return true;
        }
        else {
            return false;
        }

   }
   //获取场次信息
    function get_session_type(type){
        var session_type = {"10":"全天","20":"上午","30":"下午","40":"晚上"};
        return session_type[type];
    }
    //时间戳返回 对应格式
    function showDate(datestr) {
        var temp = datestr.split("-");
        // var date1 = new Date(2018,10-1,30);
        // var date2 = new Date(2018,10-1,31);
        // console.log(date1)
        // console.log(date2)
        var date = new Date(temp[0],temp[1]-1,temp[2]);
        //console.log(date)
        return date;
    }
    //年份变月日 YYYY-MM-DD
    function get_day_msg(date1){
        date_arr = date1.split('-');
        var date = date_arr[1] + '月' + date_arr[2] +'日';
        return date;
    }
    //时间戳返回时间格式
    function get_time_mone(arriveTime,format="YYYY-MM-DD H:i:s"){
        var date = new Date(arriveTime);
        Y = date.getFullYear() + '-';
        M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
        D = (date.getDate()< 10? '0' + date.getDate():date.getDate()) + ' ';
        h = (date.getHours()<10? '0' + date.getHours():date.getHours()) + ':';
        m = (date.getMinutes()<10? '0' + date.getMinutes():date.getMinutes()) ;
        s = (date.getSeconds()<10 ?':0' + ':' + date.getSeconds():date.getSeconds());
        if(format=="YYYY-MM-DD H:i:s"){
            return Y+M+D+h+m+s;
        }else{
            return Y+M+D+h+m;
        }

    }
    //时间分割 -- time  天 /小时  /分
    function timeStamp(StatusMinute){
        if(StatusMinute!=0){
            var day=parseInt(StatusMinute/60/24);
            var hour=parseInt(StatusMinute/60%24);
            var min= parseInt(StatusMinute % 60);
            StatusMinute="";
            if (day > 0)
            {
                StatusMinute= day + "天";
            }
            if (hour>0)
            {
                StatusMinute += hour + "小时";
            }
            if (min>0)
            {
                StatusMinute += parseFloat(min) + "分钟";
            }
                return StatusMinute;
            }else{
                StatusMinute = '0分钟';
                return StatusMinute;
            }
        }

//返回确定
var backPageEvent=function(data){
    layer.open({
        content: data
        , btn: ['确定', '取消']
        , yes: function (index) {
            window.history.go(-1);
            //$(location).attr('href', "./act_base_add.html");
        }
        , no: function (index) {
            layer.closeAll();
            e.preventDefault();
        }
    })
};
//-----------------------------------------------------------------------------
//字符串转HTML
var escapeHTML=function(a){
    a = "" + a;
    // return a.replace(/&lt;/gi, "<").replace(/&gt;/gi, ">").replace(/&nbsp;/gi, " ");
    return a.replace(/&lt;/gi, "<").replace(/&gt;/gi, ">");
};
function escapeHTML2(a){
    return a.replace(/&lt; /gi, "<").replace(/&lt;/gi, "<").replace(/&gt;/gi, ">");
}

//
var timeTransformToHour=function(time){
    var times=0;
    if(time!==''&&time!==null){
        times=parseInt(time)/60
    }
    return times
};
var timeTransformToMinute=function(time){
    var times=0;
    if(time!==''&&time!==null){
        times=parseInt(time)*60
    }
    return times
};

//字体适配
function offset(){
    var width=window.innerWidth;
    var html = document.querySelector('html');
    var rem = width / 6.4;
    // if(width>640){
    //     if(width>750){
    //         rem = width / 12.8;
    //     }
    //     if(width>1400){
    //         rem = width / 20;
    //     }
    //     html.style.fontSize = rem + "px";
    // }
    // html.style.fontSize = rem + "px";
    if(width>640){
        rem = width / 10.5;
        if(width>750){
            rem = width / 12.5;
        }
        if(width>820){
            rem = width / 14.8;
        }
        if(width>900){
            rem = width / 16.8;
        }
        if(width>1020){
            rem = width / 18.8;
        }
        if(width>1160){
            rem = width / 20.8;
        }
        if(width>1320){
            rem = width / 22.8;
        }
        if(width>1400){
            rem = width / 23.8;
        }
        if(width>1580){
            rem = width / 24.8;
        }
        if(width>1700){
            rem = width / 25.8;
        }
        if(width>1880){
            rem = width / 27.8;
        }
        if(width>2060){
            rem = width / 28.8;
        }
        if(width>2140){
            rem = width / 29.8;
        }
        html.style.fontSize = rem + "px";
    }
    html.style.fontSize = rem + "px";

}
offset();
window.onresize=offset;
window.onload=function(){
    offset();
};
