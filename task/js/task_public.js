
//限制字数并提示剩余字数
$(".txtChangeLimit").bind('keyup paste',function(){
    var len=parseInt($(this).attr('data-len'));
    var valSize=$(this).val();
    if(valSize.length>len){
        $(this).val(valSize.substring(0,len));
        return false
    }
    if(len-valSize.length>=0){
        $(this).siblings(".tsm_textarea_long").text(len-valSize.length+'字')
    }
});
