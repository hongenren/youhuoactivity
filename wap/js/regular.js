/*公共正则表达式js*/
function regular_tel(val){//手机验证
var tel=/^1\d{10}$/;
	if(val==''){
		layer.open({
		    content: '请输入手机号码'
		    ,skin: 'msg'
		    ,time: 1 //2秒后自动关闭
		});
		return false;
	}
	if(!tel.test(val)){
		layer.open({
		    content: '手机号码有误'
		    ,skin: 'msg'
		    ,time: 1 //2秒后自动关闭
		});
		return false;
	}
	return true;
}
/*密码验证*/
function regular_pwd(val){
	// var pwd = /^\d{4,16}$/;
	var pwd = /^[a-zA-Z0-9]{6,12}$/;
	if(val==''){
		layer.open({
		    content: '请输入密码'
		    ,skin: 'msg'
		    ,time: 1 //2秒后自动关闭
		});
		return false;
	}
	if(!pwd.test(val)){
		layer.open({
		    content: '请输入6-12位数字、字母密码'
		    ,skin: 'msg'
		    ,time: 1 //2秒后自动关闭
		});
		return false;
	}
	return true;
}
function regular_code(val){//手机验证
	var ans=false;
	var str = /^\d{6}$/;
	if(val==''){
		layer.open({
		    content: '验证码不能为空'
		    ,skin: 'msg'
		    ,time: 1 //2秒后自动关闭
		});
		return false;
	}
	if(!str.test(val)){
		layer.open({
		    content: '验证码格式有误'
		    ,skin: 'msg'
		    ,time: 1 //2秒后自动关闭
		});
		return false;
	}
	return true;
}
	//验证支持手机号码、含区号固定电话、不含区号固定电话
 function checkTel(tel) {
            //var pattern = /(^[0-9]{3,4}\-[0-9]{3,8}$)|(^[0-9]{3,8}$)|(^\([0-9]{3,4}\)[0-9]{3,8}$)|(^1\d{10}$)/;
     		var pattern = /^[\u4e00-\u9fa5_a-zA-Z]+$/g;
            if (pattern.test(tel)) {
                return false;
            }
            else {
                return true;
            }

        }
