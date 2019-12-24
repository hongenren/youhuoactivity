//获取url值
function queryString(key){
    var regex_str = "^.+\\?.*?\\b"+ key +"=(.*?)(?:(?=&)|$|#)";
    var regex = new RegExp(regex_str,"i");
    var url = window.location.toString();
    if(regex.test(url)) return RegExp.$1;
    return undefined;
}

//设置cookie
var setCookie=function(key,val){
    var expire= new Date();
    expire.setTime(expire.getTime() + (24*60*60 * 1000));
    $.cookie(key,val,{expires:expire,path:'/'});
};
var layTxt=function(content,time){
    layui.use('layer', function(){
        var $ = layui.jquery, layer = layui.layer;
        layer.open({
            content: content
            ,title:'提示'
            ,shadeClose:true
            ,closeBtn:0
            ,btn:''
            ,skin: 'msg'
            ,time: time||4000 //2秒后自动关闭
        });
    })
};
var layClose=function(time){
    setTimeout(function(){
        layui.use('layer', function(){
            var $ = layui.jquery, layer = layui.layer;
            layer.closeAll();
        })
    },time||0);
};
var layLoadAll=function(msg){
    layui.use('layer', function(){
        var $ = layui.jquery, layer = layui.layer;
        layer.load(1,{ // 此处1没有意义，随便写个东西
            icon: 1, // 0~2 ,0比较好看
            shade: [0.6,'black'] // 黑色透明度0.5背景
        });
    })
};

var errorStatusTime=function(status){
    if(status=='timeout'){
        layTxt("请求超时了，请检查您的网络！");
    }
    else{
        layTxt("网络异常了！");
    }
};
