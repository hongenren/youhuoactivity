var u = navigator.userAgent, app = navigator.appVersion
var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
$(document).ready(function(){
    $("input").blur(function(){
        if (isIOS) {
            var scrollTops=$(document).scrollTop();
            // blurAdjust(scrollTops)
            // alert("1231321233")
        }
    });
});
// 解决苹果不回弹页面
function blurAdjust(scroll){
    setTimeout(function(){
        if(document.activeElement.tagName == 'INPUT' || document.activeElement.tagName == 'TEXTAREA'){
            return
        }
        var result = 'pc';
        if(/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) { //判断iPhone|iPad|iPod|iOS
            result = 'ios'
        }else if(/(Android)/i.test(navigator.userAgent)) {  //判断Android
            result = 'android'
        }

        if( result = 'ios' ){
            $('html,body').animate({scrollTop:scroll},500)
            //document.activeElement.scrollIntoViewIfNeeded(true);
        }
    },100)
}

var _hmt = _hmt || [];
(function() {
    var hm = document.createElement("script");
    hm.src = "https://hm.baidu.com/hm.js?3dc9457e60b864cf71b12ba8070a29dd";
    var s = document.getElementsByTagName("script")[0];
    s.parentNode.insertBefore(hm, s);

    if(getCookie('token')==undefined){
        var jumpAdd = $.getUrlParam("jumpAdd");
        if(jumpAdd){
            window.location.href = '../login/login.html?jumpAdd='+jumpAdd;
        }else{
            window.location.href = '../login/login.html?jumpAdd='+location.href;
        }
    }
})();

function jump(url){
    $(location).attr('href', url);
}
function jumpNewsBaseUrl(url){
    $(location).attr('href', news_base_url+url);
}

function jumpCheckUser(url, login){
    var user_msg = getCookie('user_msg');
    var token = getCookie('token');
    if(user_msg==undefined || token==undefined || user_msg=="" || token==""){
        layer.open({
            content: '请先登录'
            , btn: ['确定', '取消']
            , yes: function (index) {
                $(location).attr("href", login);
            }
        });
    }else{
        $(location).attr('href', url);
    }
}
function checkRealName(){
    var user_msg = getCookie('user_msg');
    var token = getCookie('token');
    if(user_msg==undefined || token==undefined || user_msg=="" || token==""){
        return 'login/login.html?jumpAdd='+location.href;
    }else{
        var un = getCookie('un');
        if(un==null || un==undefined || un==""){
            //return 'cert/cert_index.html';
            jumpBank('web/srcb/index?channel=P9a4c8c66b1c74b53b881a5f337745a84&name=&idCard=&phone=');
            return 1;
        }
    }
    return 0;
}

function jumpScan(qrCode, prjvUserId){
    if(","==lnglat){
        lnglat = "0";
    }
    $.ajax({
        xhrFields: {
            withCredentials: true
        },
        type:"post",
        url:base_url + "html5/v1/admin/scan/s",
        data:JSON.stringify({"qrCode":qrCode, "firstAccount":prjvUserId, "recruitCode":"","lnglat":lnglat}),
        headers : {'token':token},
        dataType:'json',
        contentType: "application/json;charset=utf-8",
        success:function(data){
            if(data.code==200){//跳转
                location.href = data.data.url;
            }else if(data.code==0){
                alert(data.msg);
            }else{
                alert(data.msg);
            }
        },
        error:function(){
            alert("失败");
        }
    })
}
function jumpScan1(qrCode){
    //$(location).attr('href', qrCode+"/"+lnglat+"/");
    var map = new BMap.Map("allmap");
    var point = new BMap.Point(116.331398,39.897445);
    map.centerAndZoom(point,12);
    var geolocation = new BMap.Geolocation();
    geolocation.getCurrentPosition(function(r){
        if(this.getStatus() == BMAP_STATUS_SUCCESS){
            var mk = new BMap.Marker(r.point);
            map.addOverlay(mk);
            map.panTo(r.point);
            $(location).attr('href', qrCode+"/"+r.point.lng+","+r.point.lat+"/");
        }else {
            layer.open({
                content: '获取定位失败,请重试'
                ,skin: 'msg'
                ,time: 1 //2秒后自动关闭
            });
        }
    });
}

(function ($) {
    $.getUrlParam = function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]); return null;
    }
})(jQuery);

(function($) {
    $.extend({
        myTime: {
            /**
             * 当前时间戳
             * @return <int>        unix时间戳(秒)
             */
            CurTime: function(){
                return Date.parse(new Date())/1000;
            },
            /**
             * 日期 转换为 Unix时间戳
             * @param <string> 2014-01-01 20:20:20  日期格式
             * @return <int>        unix时间戳(秒)
             */
            DateToUnix: function(string) {
                var f = string.split(' ', 2);
                var d = (f[0] ? f[0] : '').split('-', 3);
                var t = (f[1] ? f[1] : '').split(':', 3);
                return (new Date(
                    parseInt(d[0], 10) || null,
                    (parseInt(d[1], 10) || 1) - 1,
                    parseInt(d[2], 10) || null,
                    parseInt(t[0], 10) || null,
                    parseInt(t[1], 10) || null,
                    parseInt(t[2], 10) || null
                )).getTime() / 1000;
            },
            /**
             * 时间戳转换日期
             * @param <int> unixTime    待时间戳(毫秒)
             * @param <bool> isFull    返回完整时间(Y-m-d 或者 Y-m-d H:i:s)
             * @param <int>  timeZone   时区
             */
            UnixToDate: function(unixTime, isFull, timeZone) {
                if (typeof (timeZone) == 'number')
                {
                    unixTime = parseInt(unixTime) + parseInt(timeZone) * 60 * 60;
                }
                var time = new Date(unixTime);
                var ymdhis = "";
                ymdhis += time.getUTCFullYear() + "-";
                ymdhis += (time.getUTCMonth()+1) + "-";
                ymdhis += time.getUTCDate();
                if (isFull === true)
                {
                    ymdhis += " " + time.getUTCHours() + ":";
                    ymdhis += time.getUTCMinutes() + ":";
                    ymdhis += time.getUTCSeconds();
                }
                return ymdhis;
            }
        }
    });
})(jQuery);

function setCookie(name,value){
    var domain = "auth.shgongdi.cn";
    var path = "";
    var exp  = new Date();
    exp.setTime(exp.getTime() + 5*24*60*60*1000);
    var cookie =name+'='+encodeURIComponent(value)+';'  //设置Cookie的名称和Cookie的值，Cookie名称为必填项。
    cookie+=';expires='+exp.toGMTString();　　//设置Cookie的过期事件,默认为Session
    if(!path){cookie+=';path=/'}　　//设置Cookie的路径，默认为 /
    if(domain){cookie+';domain='+domain_url}　　//设置Cookie的存储域，默认为当前js执行的网页的域
    document.cookie= cookie;
}

function getCookie(name){
    var search = name+"="//查询检索的值
    var returnvalue = "";//返回值
    if (document.cookie.length > 0) {
        sd = document.cookie.indexOf(search);
        if (sd!= -1) {
            sd += search.length;
            end = document.cookie.indexOf(";", sd);
            if (end == -1){
                end = document.cookie.length;
            }
            //unescape() 函数可对通过 escape() 编码的字符串进行解码。
            returnvalue=unescape(document.cookie.substring(sd, end));
        }
    }
    return returnvalue;
}


/*根据出生日期算出年龄*/
function jsGetAge(strBirthday){
    var returnAge;
    /*var strBirthdayArr=strBirthday.split("-");
    var birthYear = strBirthdayArr[0];
    var birthMonth = strBirthdayArr[1];
    var birthDay = strBirthdayArr[2];*/
    var birthYear = strBirthday.slice(0,4);
    var birthMonth = strBirthday.slice(4,6);
    var birthDay = strBirthday.slice(6,8);
    d = new Date();
    var nowYear = d.getFullYear();
    var nowMonth = d.getMonth() + 1;
    var nowDay = d.getDate();

    if(nowYear == birthYear){
        returnAge = 0;//同年 则为0岁
    }
    else{
        var ageDiff = nowYear - birthYear ; //年之差
        if(ageDiff > 0){
            if(nowMonth == birthMonth) {
                var dayDiff = nowDay - birthDay;//日之差
                if(dayDiff < 0)
                {
                    returnAge = ageDiff - 1;
                }
                else
                {
                    returnAge = ageDiff ;
                }
            }
            else
            {
                var monthDiff = nowMonth - birthMonth;//月之差
                if(monthDiff < 0)
                {
                    returnAge = ageDiff - 1;
                }
                else
                {
                    returnAge = ageDiff ;
                }
            }
        }
        else
        {
            returnAge = -1;//返回-1 表示出生日期输入错误 晚于今天
        }
    }

    return returnAge;//返回周岁年龄

}

//判断是否是微信浏览器的函数
function isWeiXin(){
    //window.navigator.userAgent属性包含了浏览器类型、版本、操作系统类型、浏览器引擎类型等信息，这个属性可以用来判断浏览器类型
    var ua = window.navigator.userAgent.toLowerCase();
    //通过正则表达式匹配ua中是否含有MicroMessenger字符串
    if(ua.match(/MicroMessenger/i) == 'micromessenger'){
        return true;
    }else{
        return false;
    }
}
//判断是否是微信qq浏览器的函数
function isWeiXinQQ(){
    //window.navigator.userAgent属性包含了浏览器类型、版本、操作系统类型、浏览器引擎类型等信息，这个属性可以用来判断浏览器类型
    var ua = window.navigator.userAgent.toLowerCase();
    //通过正则表达式匹配ua中是否含有MicroMessenger字符串
    if(ua.match(/MicroMessenger\/[0-9]/i)){
        return true;
    }else{
        if(ua.match(/QQ\/[0-9]/i)){
            return true;
        }else{
            return false;
        }
    }
}

function IsWhat(){
    if(IsPC()){
        return 3
    }else{
        return IsIOSOrAndroid();
    }
}

function IsPC() {
    var userAgentInfo = navigator.userAgent;
    var Agents = ["Android", "iPhone",
        "SymbianOS", "Windows Phone",
        "iPad", "iPod"];
    var flag = true;
    for (var v = 0; v < Agents.length; v++) {
        if (userAgentInfo.indexOf(Agents[v]) > 0) {
            flag = false;
            break;
        }
    }
    return flag;
}

function IsIOSOrAndroid(){//0是安卓，1是苹果
    var u = navigator.userAgent, app = navigator.appVersion;
    var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //g
    var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
    if (isAndroid) {
        return 0;
        //这个是安卓操作系统
    }
    if (isIOS) {
        return 1;
        //这个是ios操作系统
    }
}

//时间返回时间格式
function get_date(arriveTime, type, returnType){
    if(arriveTime==undefined || arriveTime==null || arriveTime==""){
        if(returnType==0){
            return "未签到";
        }else if(returnType==1){
            return "未签出";
        }else{
            return "";
        }
    }
    var date = new Date(arriveTime.replace(/\-/g,'/'));
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
    var D = (date.getDate()< 10? '0' + date.getDate():date.getDate()) + ' ';
    var h = (date.getHours()<10? '0' + date.getHours():date.getHours()) + ':';
    var m = (date.getMinutes()<10? '0' + date.getMinutes():date.getMinutes()) ;
    if(type==0){
        return Y+M+D+h+m;
    }else{
        var s = (date.getSeconds()<10 ?':0' + ':' + date.getSeconds():date.getSeconds());
        return Y+M+D+h+m+s;
    }
}

// 将分钟数量转换为小时和分钟字符串
function toHourMinute(minutes){
    var h = Math.floor(minutes/60);
    var m = (minutes%60);
    if(h!=0 && m!=0){
        return h + "小时" + m + "分";
    }
    if(h==0){
        return m + "分钟";
    }
    if(m==0){
        return h + "小时";
    }
}

//分钟数转换为 小时：分钟
function ChangeHourMinutestr(str) {
    if (str != "0" && str != "" && str != null) {
        var hh = ((Math.floor(str / 60)).toString().length < 2 ? "" + (Math.floor(str / 60)).toString() :
            (Math.floor(str / 60)).toString())
        if(hh!="0"){
            hh += "小时";
        }else{
            hh = "";
        }
        var mm = ((str % 60).toString().length < 2 ? "" + (str % 60).toString() : (str % 60).toString());
        if(mm!="0"){
            mm += "分钟";
        }else{
            mm = "";
        }
        return  hh + mm;
    }else{
        return "0分钟";
    }
}

function getTypeName(type){
    var typename = "";
    if(type==10){
        typename = "岗位名称：";
    }else if(type==20){
        typename = "任务名称：";
    }else if(type==30){
        typename = "公众门票名称：";
    }else if(type==40){
        typename = "名称：";
    }else if(type==50){
        typename = "嘉宾证名称：";
    }else if(type==60){
        typename = "媒体证名称：";
    }else if(type==70){
        typename = "活动管理员名称：";
    }else if(type==80){
        typename = "场次管理员名称：";
    }else if(type==90){
        typename = "临时管理员名称：";
    }
    return typename;
}

//判断字符串是否以某字符串结尾
String.prototype.endWith=function(endStr){
    var d=this.length-endStr.length;
    return (d>=0&&this.lastIndexOf(endStr)==d)
}

//格式化日期：yyyy-MM-dd
function formatDate(date) {
    var myyear = date.getFullYear();
    var mymonth = date.getMonth() + 1;
    var myweekday = date.getDate();
    if (mymonth < 10) {
        mymonth = "0" + mymonth;
    }
    if (myweekday < 10) {
        myweekday = "0" + myweekday;
    }
    return (myyear + "-" + mymonth + "-" + myweekday);
}
var now = new Date(); //当前日期
var nowDayOfWeek = now.getDay();
var nowDay = now.getDate(); //当前日
var nowMonth = now.getMonth(); //当前月
var nowYear = now.getFullYear(); //当前年
//获得本周的开始日期
function getWeekStartDate() {
    var weekStartDate = new Date(nowYear, nowMonth, (nowDay - nowDayOfWeek) + 1);
    return formatDate(weekStartDate);
}
//获得本周末的开始日期
function getWeekendStartDate() {
    var weekStartDate = new Date(nowYear, nowMonth, nowDay + (6 - nowDayOfWeek));
    return formatDate(weekStartDate);
}
//获得本周的结束日期
function getWeekEndDate() {
    var weekEndDate = new Date(nowYear, nowMonth, (nowDay + (6 - nowDayOfWeek)) + 1);
    return formatDate(weekEndDate);
}
//获得本月的开始日期
function getMonthStartDate() {
    var monthStartDate = new Date(nowYear, nowMonth, 1);
    return formatDate(monthStartDate);
}
//获得本月的结束日期
function getMonthEndDate() {
    var monthEndDate = new Date(nowYear, nowMonth, getMonthDays(nowMonth));
    return formatDate(monthEndDate);
}
//获得某月的天数
function getMonthDays(myMonth) {
    var monthStartDate = new Date(nowYear, myMonth, 1);
    var monthEndDate = new Date(nowYear, myMonth + 1, 1);
    var days = (monthEndDate - monthStartDate) / (1000 * 60 * 60 * 24);
    return days;
}

function dateFormatting(date){
    var dates = date.split("-");
    return dates[0]+"年"+dates[1]+"月"+dates[2]+"日";
}

function dateFormattingInt(date){
    var dates = date.split("-");
    return parseInt(dates[0])+"年"+parseInt(dates[1])+"月"+parseInt(dates[2])+"日";
}

function launchScroll(){
    $(window).scroll(
        function () {
            var top = $(document).scrollTop();
            var height = document.body.clientHeight;
            var z_height = $(document).height();
            var stats = ( z_height - height-top < 5) ;
            if (stats) {
                $("#btn").val("加载中...");
                throttle(returnScroll);
            }
        }
    );
}

function throttle(fun) {
    if (fun.timeoutId) {
        window.clearTimeout(fun.timeoutId);
    }
    fun.timeoutId = window.setTimeout(function () {
        fun();
        fun.timeoutId = null;
    }, 1000);
}

function isCardNo(card) {
    // 身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X
    var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
    if(reg.test(card) === false){
        return  false;
    }
}

function copyText(text) {
    var textarea = document.createElement("textarea");
    var currentFocus = document.activeElement;
    document.body.appendChild(textarea);
    textarea.value = text;
    textarea.focus();
    if (textarea.setSelectionRange)
        textarea.setSelectionRange(0, textarea.value.length);
    else
        textarea.select();
    try {
        var flag = document.execCommand("copy");
    } catch(eo){
        var flag = false;
    }
    document.body.removeChild(textarea);
    currentFocus.focus();
    return flag;
}

function substrSeconds(date){
    if(date){
        return date.substr(0,date.length-3)
    }else{
        return date;
    }
}
function checkNumber(obj,len){
    let value=$(obj).val();
    $(obj).val(value.substring(0,len));
}
function autoHeightArea(obj){
    // alert('123')
    var textarea=$(obj);
//设置高度
    textarea.css('height','34px');
    console.log(obj.scrollHeight);
    console.log(textarea[0].scrollHeight)
    textarea.height(textarea[0].scrollHeight-16+ 'px')
    // textarea.style.height = textarea.scrollHeight + 'px';


}

function historyLocalStorage(){
    localStorage.setItem('user_bank', "");
    window.history.go(-1);
}

function jumpBankIndex(url){
    var user_msg = getCookie('user_msg');
    if(user_msg){
        var userNo = JSON.parse(user_msg).userNo;
        if(userNo){
            $(location).attr('href', url+"&userNo="+userNo);
        }else{
            $(location).attr('href', url+"&userNo=");
        }
    }else{
        $(location).attr('href', url+"&userNo=");
    }
}
function jumpBank(url){
    var user_msg = getCookie('user_msg');
    if(user_msg){
        var userNo = JSON.parse(user_msg).userNo;
        if(userNo){
            $(location).attr('href', base_url+url+"&userNo="+userNo);
        }else{
            $(location).attr('href', base_url+url+"&userNo=");
        }
    }else{
        $(location).attr('href', base_url+url+"&userNo=");
    }
}
function zhixiashi(name){
    if(name=="北京" || name=="北京市" ||
        name=="天津" || name=="天津市" ||
        name=="上海" || name=="上海市" ||
        name=="重庆" || name=="重庆市" ){
        return false;
    }
    return true;
}


