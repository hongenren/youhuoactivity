function saveMailInfo(){
    var userName = $.trim($("#userName").val());
    var ename = $.trim($("#ename").val());
    var city = $.trim($("#city").val());
    var area = $.trim($("#area").val());
    var address = $.trim($("#address").val());
    var mobile = $.trim($("#mobile").val());
    var verificationCode = $.trim($("#code").val());
    if(userName==""){
        layer.open({
            content: "请填写收件人"
            ,skin: 'msg'
            ,time: 2 //2秒后自动关闭
        });
        return false;
    }
    if(ename==""){
        layer.open({
            content: "请填写收件人姓名拼音"
            ,skin: 'msg'
            ,time: 2 //2秒后自动关闭
        });
        return false;
    }
    if(city==""){
        layer.open({
            content: "请选择市"
            ,skin: 'msg'
            ,time: 2 //2秒后自动关闭
        });
        return false;
    }
    if(area==""){
        layer.open({
            content: "请选择区"
            ,skin: 'msg'
            ,time: 2 //2秒后自动关闭
        });
        return false;
    }
    if(address==""){
        layer.open({
            content: "请填写详细地址"
            ,skin: 'msg'
            ,time: 2 //2秒后自动关闭
        });
        return false;
    }else{
        if(address.indexOf("请输入详细地址（30个汉字以内）")>-1){
            layer.open({
                content: "请填写详细地址"
                ,skin: 'msg'
                ,time: 2 //2秒后自动关闭
            });
            return false;
        }
    }
    if(mobile==""){
        layer.open({
            content: "请填写收件人手机号"
            ,skin: 'msg'
            ,time: 2 //2秒后自动关闭
        });
        return false;
    }else{
        if(!regular_tel(mobile)){
            return false;
        };
    }
    if(verification==1){
        if(verificationCode==""){
            layer.open({
                content: "请填写验证码"
                ,skin: 'msg'
                ,time: 2 //2秒后自动关闭
            });
            return false;
        }
    }
    var json = {"uuid": user_bank.uuid,"channel": user_bank.channel, "address": address, "district": area, "ename": ename, "mobile": mobile, "name": userName, "verification": verification, "verificationCode": verificationCode};

    $.ajax({
        xhrFields: {
            withCredentials: true
        },
        type: 'post',
        url: base_url + "/html5/v2/srcb/saveMailInfo",
        data: JSON.stringify(json),
        dataType: 'json',
        contentType: "application/json;charset=utf-8",
        beforeSend: function (XMLHttpRequest) {
            layer.open({
                content: "提交中，请稍后。。。"
                , skin: 'msg'
                , time: 999
            });
        },
        success: function (data) {
            layer.closeAll();
            if(data.code == 0) {
                var isType=$.getUrlParam('isType');
                localStorage.setItem('user_bank',JSON.stringify(data.data));
                jump("./submisstion.html?isType="+isType);
            }else{
                layer.open({
                    content: data.msg
                    , skin: 'msg'
                    , time: 10
                });
            }
        },
        error:function(e){
            layer.open({
                content: '提交失败！'
                ,skin: 'msg'
                ,time: 1
            });
            me.resetload();
        }
    })
}


var curCount = 30, InterValObj, verification = 0;
function sendMessages(){
    var tel=/^1\d{10}$/;
    var mobile=$("#mobile").val();
    if(!tel.test(mobile)){
        layer.open({
            content: '手机号格式错误'
            ,skin: 'msg'
            ,time: 1 //2秒后自动关闭
        });
        return false
    }
    $.ajax({
        xhrFields: {
            withCredentials: true
        },
        type:'post',
        url :base_url + "html5/v2/srcb/checkMobile",
        data:JSON.stringify({"mobile":mobile}),
        dataType:'json',
        contentType: "application/json;charset=utf-8",
        success:function(data){
            if(data.code == 0){
                sendMessage()
            }else if(data.code == -1){
                layer.open({
                    title:'提示',
                    content: data.msg
                    ,btn: ['确定', '取消']
                    ,yes: function(index){
                        layer.closeAll();
                        sendMessage()
                    }
                });
            }
        },
        error:function(e){
            layer.open({
                content: '手机号验证失败'
                ,skin: 'msg'
                ,time: 2 //2秒后自动关闭
            });
        }
    })
}
function sendMessage() {
    var mobile = $.trim($("#mobile").val());
    if(!regular_tel(mobile)){
        return false;
    };
    ajax_code(mobile);
}
var fn = function(){
    if (curCount == 0) {
        window.clearInterval(InterValObj);//停止计时器
        curCount = 30;
        $("#btnSendCode").attr("onClick", "sendMessage()");//启用按钮
        $("#btnSendCode").html("重新发送");
    }else {
        curCount--;
        $("#btnSendCode").html( + curCount + "秒再获取");
    }
}

function ajax_code(mobile){
    $.ajax({
        xhrFields: {
            withCredentials: true
        },
        type:'post',
        url :base_url + "html5/v1/sms/sendSms",
        data:JSON.stringify({"mobile":mobile,"signName":'公益上海'}),
        dataType:'json',
        contentType: "application/json;charset=utf-8",
        success:function(data){
            if(data.code == 0){
                str = true;
                layer.open({
                    content: data.msg
                    ,skin: 'msg'
                    ,time: 2 //2秒后自动关闭
                });
                $("#btnSendCode").html( + curCount + "秒再获取");
                InterValObj = window.setInterval(fn, 1000); //启动计时器，1秒执行一次
                $("#btnSendCode").attr("onClick", "alertMessage()");
            }else if(data.code == -1){
                layer.open({
                    content: data.msg
                    ,skin: 'msg'
                    ,time: 2 //2秒后自动关闭
                });
            }
        },
        error:function(e){
            layer.open({
                content: '短信发送失败'
                ,btn: '确定'
            });
        }
    })
}
function alertMessage(){
    layer.open({
        content: '短信发送中，不可重复点击！'
        ,skin: 'msg'
        ,time: 2 //2秒后自动关闭
    });
}
function queryuuid(){
    user_bank = JSON.parse(localStorage.getItem('user_bank'));
    console.log(user_bank);
    $.ajax({
        xhrFields: {
            withCredentials: true
        },
        type: 'get',
        url: base_url + "html5/v2/srcb/queryuuid/"+user_bank.uuid+"/"+user_bank.channel,
        dataType: 'json',
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            layer.closeAll();
            if (data.code == 0) {
                var data_ = data.data;
                verification = data_.verification;
                if(verification==0){
                    $("#codeDiv").hide();
                    $("#mobile").val(data_.mobile);
                    $("#mobile").attr("readonly", "readonly");
                }
                $("#userName").val(data_.userName);
                $("#ename").val($("#userName").toPinyin());
            }
        }
    })
}

$(function(){
    var str='请输入详细地址（30个汉字以内）\r\n仅支持上海地区邮寄，非上海地区请勿填写';
    $('textarea[name="text"]').val(str);
    $('textarea[name="text"]').bind('focus',function(){
        if($('textarea[name="text"]').val().indexOf("请输入详细地址（30个汉字以内）")>-1){
            $('textarea[name="text"]').val('');
            $('textarea[name="text"]').css("color", "#000000");
        }
    });
    $('textarea[name="text"]').bind('blur',function(){
        if(""==$('textarea[name="text"]').val()){
            $('textarea[name="text"]').val(str);
            $('textarea[name="text"]').css("color", "#9d9d9d");
        }
    });

    $.ajax({
        xhrFields: {
            withCredentials: true
        },
        type:'post',
        url:base_url + "/html5/v1/region/findByParent",
        data:JSON.stringify({ "parent": 155387}),
        dataType:'json',
        contentType: "application/json;charset=utf-8",
        success:function(data){
            var data_index = data.data;
            var html = "";
            $.each(data_index,function(k,val) {
                html += '<li>'+ val.name +'</li>';
            });
            $(".city ul").html(html);
        },
        error:function(){
            layer.open({
                content: '获取失败'
                ,skin: 'msg'
                ,time: 1 //2秒后自动关闭
            });
            return false;
        }
    })

    $("input[name='area']").focus(function(){
        $(".cityWrap").show();
        $(".city ul li").unbind('click').click(function(){
            var txt=$(this).text();
            $("input[name='area']").val(txt);
            $(".cityWrap").hide();
        })
    });
})
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
