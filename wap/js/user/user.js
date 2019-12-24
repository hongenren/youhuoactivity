function closeToast(){
    var m = document.getElementById('toast');
    setTimeout(function() {
        var d = 0.2;
        m.style.webkitTransition = '-webkit-transform ' + d + 's ease-in, opacity ' + d + 's ease-in';
        m.style.opacity = '0';
        setTimeout(function() { document.body.removeChild(m) }, d * 1000);
    }, 0);
}
function Toast(duration){
    duration = isNaN(duration) ? 3000 : duration;
    var m = document.createElement('div');
    m.id = 'toast';
    m.innerHTML = '<div style="line-height: 30px;font-size: 20px;margin-bottom: 5px;height: 30px;color: #72B81E;">登录</div>\
                <input name="name"  id="name" type="text" style="text-align:center;border-radius:5px;border:#72B81E 1px solid;height: 40px;width: 80%" \
                placeholder="输入身份证号或11位手机号">\
                <input name="password"  id="password" type="password" style="margin-top: 5%;text-align:center;border-radius:5px;border:#72B81E 1px solid;height: 40px;width: 80%" \
                placeholder="输入6-12位数字、字母密码">\
                \
                <input type="button" onclick="login_in_layer();" style="text-align:center;border-radius:5px;border:0px;height: 40px;width: 39%;margin-top:5%;background-color:#72B81E;color:#ffffff;" value="登录">\
                <input type="button" onclick="closeToast();" style="text-align:center;border-radius:5px;border:0px;height: 40px;width: 39%;margin-top: 5%;background-color:#72B81E;color:#ffffff;" value="取消">\
                <div class="warp_pws_r_su" style="padding-left: 10%;padding-right: 10%;width: 80%;margin-top: 5%;">\
                    <a id="registerA" href="javascript:void(0)"onclick="jumpBank(\'web/srcb/index?channel=P9a4c8c66b1c74b53b881a5f337745a84&name=&idCard=&phone=&userNo=\')" style="float: right">没有账号？<i>去注册</i></a>\
                    <a id="restart_pwdA" href="../register/restart_pwd.html" style="float: left;"><i>忘记密码</i></a>\
                </div>\
                <div class="ts_wz_p">\
                    <span style="display: block;color: #999999;font-size: 14px;text-align: left;">注：已领取护照但未设置密码的用户默认密码为000000，登录后请及时修改密码。</span>\
                </div><input type="hidden" name="loginType" value="1"/>';
    m.style.cssText = "width:80%;padding:5%;color: rgb(255, 255, 255);line-height: 30px;text-align: center;padding-top:3%;" +
        "position: fixed;top: 30%;left: 5%;z-index: 999999;border:#72B81E 1px solid;background-color: #ffffff;font-size: 22px;";
    document.body.appendChild(m);/*
    $("#registerA").attr("href", "../register/register.html?jumpAdd="+location.href);
    $("#restart_pwdA").attr("href", "../register/restart_pwd.html?jumpAdd="+location.href);*/
}
$(function(){
    if($.cookie('user_msg')==undefined||$.cookie('token')==undefined){
    //if($.cookie('user_msg')!=undefined||$.cookie('token')!=undefined){
        /*if(jumpAdd){
            window.location.href = '../login/login.html?jumpAdd='+jumpAdd;
        }else{
            window.location.href = '../login/login.html?jumpAdd='+location.href;
        }*/
        Toast();
    }
})
var user_msg = '';
var token = '';
var user_msg = JSON.parse($.cookie('user_msg'));
console.log(user_msg)
//console.log(user_msg);
var token = $.cookie('token');
//加载用户个人信息
function get_user_msg(){
	$.ajax({
        xhrFields: {
           withCredentials: true
        },
		type:"post",
        url:base_url + "html5/v1/user/center",
        //async:false,
        data:JSON.stringify({"userId":user_msg.userId}),
        headers : {'token':token},
        dataType:'json',
        contentType: "application/json;charset=utf-8",
        success:function(data){
        	if(data.code==0){
        		var data1 = data.data;
                return data1;
        		//$('.warp_pws_w_si span').html(data1.userNickName);
        	}else{
        		layer.open({
                content: '获取失败'
                ,skin: 'msg'
                ,time: 1 //2秒后自动关闭
            	});
        	}

        },
        error:function(){
        	layer.open({
                content: '获取失败'
                ,skin: 'msg'
                ,time: 1 //2秒后自动关闭
            });
        }
	})
}
//图片上传接口
function upload_headimg(src){
	var tre = false;
    $.ajax({
        xhrFields: {
           withCredentials: true
        },
        type:"post",
        async: false,
        url:base_url + "html5/v1/user/updateHead",
        data:JSON.stringify({"userId":user_msg.userId,"userHeadImg":src}),
        headers : {'token':token},
        dataType:'json',
        contentType: "application/json;charset=utf-8",
        success:function(data){
            console.log(data);
            if(data.code==0){
                tre = true;
            }else{
                return false;
            }
        },
        error:function(e){
            //layer.open({ content: '设置失败' ,skin: 'msg' ,time: 1 });
            return false;
        }
    })
    return tre;
}
//电子照片上传接口
function upload_ElePhoto(src){
    var tre = false;
    $.ajax({
        xhrFields: {
            withCredentials: true
        },
        type:"post",
        async: false,
        url:base_url + "html5/v1/user/updateElePhoto",
        data:JSON.stringify({"userId":user_msg.userId,"userCertImg1":src}),
        headers : {'token':token},
        dataType:'json',
        contentType: "application/json;charset=utf-8",
        success:function(data){
            console.log(data);
            if(data.code==0){
                tre = true;
            }else{
                return false;
            }
        },
        error:function(e){
            //layer.open({ content: '设置失败' ,skin: 'msg' ,time: 1 });
            return false;
        }
    })
    return tre;
}
//退出登录
function login_out(){
    $.ajax({
        xhrFields: {
            withCredentials: true
        },
        type: "post",
        url: base_url + "html5/v1/user/logout",
        data: JSON.stringify({"userId": userId}),
        headers : {'token':token},
        dataType: 'json',
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if(data.code==0){
                localStorage.removeItem("orgThirdAccount");//删除法人三类账户
                localStorage.removeItem("appUserInfo");//删除用户信息
                $.cookie('token','',{ expires: -1 , path: '/' ,domain:domain_url});
                $.cookie('user_msg','',{ expires: -1, path: '/',domain:domain_url});
                $.cookie('nn','',{ expires: -1, path: '/',domain:domain_url});
                $.cookie('ts','',{ expires: -1, path: '/',domain:domain_url});
                $.cookie('u','',{ expires: -1, path: '/',domain:domain_url});
                $.cookie('uh','',{ expires: -1, path: '/',domain:domain_url});
                $.cookie('un','',{ expires: -1, path: '/',domain:domain_url});
                $.cookie('uv','',{ expires: -1, path: '/',domain:domain_url});
                $.cookie('prjvorgMsg','',{ expires: -1, path: '/',domain:domain_url});
                $.cookie('userOrgTags','',{ expires: -1, path: '/',domain:domain_url});
                $.cookie('ut','',{ expires: -1, path: '/',domain:domain_url});
                localStorage.setItem('prjvorgMsg','');
                setCookie('user_msg', "");setCookie('u', "");setCookie('un', "");setCookie('ts', "");setCookie('prjvorgMsg', "");
                setCookie('nn', "");setCookie('uh', "");setCookie('uv', "");setCookie('token', "");setCookie('userOrgTags', "");setCookie('ut', "");
                //clearCookie();
                if($.cookie('token')==undefined || $.cookie('user_msg')==undefined ||
                    $.cookie('token')==null|| $.cookie('user_msg')==null ||
                    $.cookie('token')==''|| $.cookie('user_msg')==''){
                    var jumpAdd = $.cookie("jumpAdd");
                    if(jumpAdd!=undefined && jumpAdd!=null && jumpAdd!=""){
                        window.location.href = jumpAdd;
                    }else{
                        window.location.href ='/';
                    }
                }else{
                    layer.open({
                        content: '退出失败！'
                        ,skin: 'msg'
                        ,time: 1 //2秒后自动关闭
                    });
                    return false;
                }
            }else{
                layer.open({
                    content: '退出失败，请重试'
                    ,skin: 'msg'
                    ,time: 1 //2秒后自动关闭
                });
            }
        }
    });
}
function clearCookie(){
    var date=new Date();
    date.setTime(date.getTime()-10000);
    var keys=document.cookie.match(/[^ =;]+(?=\=)/g);
    if (keys) {
        for (var i =  keys.length; i--;)
            document.cookie=keys[i]+"=0; expire="+date.toGMTString()+"; path=/";
    }
}

function setCookie(name,value){
    var path = "";
    var exp  = new Date();
    exp.setTime (exp.getTime() - 1);
    var cookie =name+'='+encodeURIComponent(value)+';'  //设置Cookie的名称和Cookie的值，Cookie名称为必填项。
    cookie+='expires='+exp.toGMTString();　　//设置Cookie的过期事件,默认为Session
    if(!path){cookie+=';path=/'}　　//设置Cookie的路径，默认为 /
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

/**
 * 登录操作
 */
function login_in_layer(){
    var jumpAdd = $.getUrlParam("jumpAdd");
    var loginName = $.trim($("input[name='name']").val());
    var password = $.trim($("input[name='password']").val());
    var loginType = $.trim($("input[name='loginType']").val());
    /*if(!regular_tel(loginName)){
        return false;
    }*/
    if(!regular_pwd(password)){
        return false;
    }
    $.ajax({
        xhrFields: {
            withCredentials: true
        },
        type:"post",
        url:base_url + "html5/v1/user/userLogin",
        data:JSON.stringify({"loginName":loginName,"loginPassword":password,"loginType":loginType}),
        dataType:'json',
        contentType: "application/json;charset=utf-8",
        success:function(data){
            if(data.code==0){
                var data1 = data.data;
                var cookieResp =data1.cookieResp;
                var expiresDate= new Date();
                expiresDate.setTime(expiresDate.getTime() + (60*60*8000));
                var userdata = JSON.stringify({"userId":data1.userId,"userNo":data1.userNo,"userNickName":data1.userNickName,"userHeadImg":data1.userHeadImg});
                var appUserInfo = JSON.stringify(data1);
                $.cookie('user_msg',userdata, {expires: expiresDate, path:'/',domain:domain_url});
                $.cookie('u',cookieResp.u, {expires: expiresDate, path:'/',domain: domain_url});
                $.cookie('un',cookieResp.un, {expires: expiresDate, path:'/',domain:domain_url});
                $.cookie('ts',cookieResp.ts, {expires: expiresDate, path:'/' ,domain:domain_url});
                $.cookie('nn',cookieResp.nn, {expires: expiresDate, path:'/' ,domain:domain_url});
                $.cookie('uh',cookieResp.uh, {expires: expiresDate, path:'/' ,domain:domain_url});
                $.cookie('uv',cookieResp.uv, {expires: expiresDate, path:'/' ,domain:domain_url});
                $.cookie('token',cookieResp.token, {expires: expiresDate, path:'/' ,domain:domain_url});
                $.cookie('userOrgTags',JSON.stringify(cookieResp.userOrgTags), {expires: expiresDate, path:'/' ,domain:domain_url});
                /*setCookie('user_msg', userdata);setCookie('u', cookieResp.u);setCookie('un', cookieResp.un);setCookie('ts', cookieResp.ts);
                setCookie('nn', cookieResp.nn);setCookie('uh', cookieResp.uh);setCookie('uv', cookieResp.uv);setCookie('token', cookieResp.token);setCookie('userOrgTags', JSON.stringify(cookieResp.userOrgTags));
                */localStorage.setItem('appUserInfo',appUserInfo);
                if($.cookie('user_msg')||$.cookie('token')){
                    var url = '../user/user_index.html';
                    if($_GET['activityCode']===undefined){
                        var url = location.href;
                        if(jumpAdd){
                            url = jumpAdd;
                        }else{
                            //jumpAdd = getCookie("jumpAdd");
                            jumpAdd = $.cookie("jumpAdd");
                            if(jumpAdd!=undefined && jumpAdd!=null && jumpAdd!=""){
                                url = jumpAdd;
                            }
                        }
                    }else{
                        var url = '../activity/activity_enroll.html?activityCode='+$_GET['activityCode'];
                    }
                    window.location.href = url;
                }else{
                    alert('登录失败！！！');
                    return false;
                }
            }else if(data.code==-100){
                window.location.href = "../login/intercept.html";
            }else{
                alert(data.msg);
                return false;
            }
        },
        error:function(e){
            alert('登录失败！');
            return false;
        }
    })
}

function regular_tel(val){//手机验证
    var tel=/^1\d{10}$/;
    if(val==''){
        alert('请输入手机号码！');
        return false;
    }
    if(!tel.test(val)){
        alert('手机号码有误！');
        return false;
    }
    return true;
}
/*密码验证*/
function regular_pwd(val){
    // var pwd = /^\d{4,16}$/;
    var pwd = /^[a-zA-Z0-9]{6,12}$/;
    if(val==''){
        alert('请输入密码！');
        return false;
    }
    if(!pwd.test(val)){
        alert('请输入6-12位数字、字母密码！');
        return false;
    }
    return true;
}
