function jump(url){
    $(location).attr('href', url);
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
        }
    }
    return 0;
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
    if(domain){cookie+';domain='+domain}　　//设置Cookie的存储域，默认为当前js执行的网页的域
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

//二维码存为图片--start--
function base64ToBlob(code) {
    let parts = code.split(';base64,');
    let contentType = parts[0].split(':')[1];
    let raw = window.atob(parts[1]);
    let rawLength = raw.length;
    let uInt8Array = new Uint8Array(rawLength);
    for (let i = 0; i < rawLength; ++i) {
        uInt8Array[i] = raw.charCodeAt(i);
    }
    return new Blob([uInt8Array], {type: contentType});
}
function downImg(err){
    // var qrcode= $('#divOne').qrcode('http://www.gongjuji.net/').hide();
    var option=$.extend(
        {
            render: 'canvas',
            width: 200,
            height: 200,
            textUrl:'http://www.gongjuji.net/',
            format:'image/jpg',
            name:'img.jpg'
        },
        err
    );

    var qrcode=$('#divOne').qrcode({
        render: option.render,
        width: option.width,
        height: option.height,
        text: option.textUrl
    }).hide();
    var canvas=qrcode.find('canvas').get(0);
    var url=canvas.toDataURL(option.format);
    var blob = base64ToBlob(url);
    var urlDown = window.URL.createObjectURL(blob);
    var a = $("<a></a>").attr("href", urlDown).attr("download", option.name).appendTo("body");
    a[0].click();
    a.remove();
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
//--end--