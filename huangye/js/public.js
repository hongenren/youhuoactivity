
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

//cookie
function get_prjvOrgId(){
    var prjvOrgId_txt=$.cookie("prjvOrgId");
    return prjvOrgId_txt
}
function get_addressId(){
    var addressId_txt=$.cookie("addressId");
    return addressId_txt
}

//时间格式转换
function dateTime(time){
    var newDate = new Date();
    newDate.setTime(time);
    Date.prototype.toLocaleDateString = function() {
        return this.getFullYear() + "/" + ((this.getMonth() + 1)<10?0+(this.getMonth() + 1).toString():(this.getMonth() + 1)) + "/" + this.getDate();
    };
    return newDate.toLocaleDateString()
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
//年份变月日 YYYY-MM-DD
function get_day_msg(date1){
    date_arr = date1.split('-');
    var date = date_arr[1] + '月' + date_arr[2] +'日';
    return date;
}

//字符串转HTML
var escapeHTML=function(a){
    a = "" + a;
    return a.replace(/&lt;/gi, "<").replace(/&gt;/gi, ">").replace(/&amp;nbsp;/gi, '&nbsp;');
};
