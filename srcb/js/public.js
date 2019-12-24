var layTxt=function(data){
    layer.open({
        content: data
        ,skin: 'msg'
        ,time: 2 //2秒后自动关闭
    });
};
var layClose=function(time){
    setTimeout(function(){
        layui.use('layer', function(){
            var $ = layui.jquery, layer = layui.layer;
            layer.closeAll();
        })
    },time||500);
};
var errorStatusTime=function(status){
    if(status=='timeout'){
        layTxt("请求超时了，请检查您的网络！");
    }
    else{
        layTxt("网络异常了！");
    }
};

