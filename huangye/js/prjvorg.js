
if($.cookie('user_msg')==undefined||$.cookie('token')==undefined){
    window.location.href = '../login/login.html?jumpAdd='+location.href;
}
var user_msg = '';

var user_msg = JSON.parse($.cookie('user_msg'));

var token = $.cookie('token'); 
if(localStorage.getItem('prjvorgMsg')==undefined||localStorage.getItem('prjvorgMsg')==""){
    alert('暂无权限');
    window.history.go(-1);   
}
var prjvorgMsg = JSON.parse(localStorage.getItem('prjvorgMsg'));
//console.log(prjvorgMsg);