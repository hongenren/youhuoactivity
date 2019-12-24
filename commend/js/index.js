
$(function(){
    //textarea默认字符
    $(".txtChange,.txtChangeLimit").each(function(){
        var txt=$(this).attr('data-txt');
        $(this).val(txt).css('color','#999')
    });
    $(".txtChange,.txtChangeLimit").focus(function(){
        if($(this).val()==$(this).attr('data-txt')){
            $(this).val('').css('color','#333')
        }
    });
    $(".txtChange,.txtChangeLimit").blur(function(){
        if($(this).val()==''){
            $(this).val($(this).attr('data-txt')).css('color','#999');
        }
    });
    $(".txtChange").bind('keyup paste',function(){
        var len=parseInt($(this).attr('data-len'));
        var valSize=$(this).val();
        if(valSize.length>len){
            $(this).val(valSize.substring(0,len));
            return false
        }
    });
    $(".txtChangeLimit").bind('keyup paste',function(){
        var len=130;
        var valSize=$(this).val();
        if(valSize.length>len){
            $(this).val(valSize.substring(0,len));
            return false
        }
        if(len-valSize.length>=0){
            $(".strTxt").text(len-valSize.length+'字以内')
        }

    });
});
