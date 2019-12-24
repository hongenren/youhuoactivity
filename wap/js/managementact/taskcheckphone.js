var activityCode = $_GET['activityCode'];

// 验证发布者手机号

    function check_phone(){
        var phone_status = false;
        var phone = $.trim($("input[name='phone']").val());
        if(phone==''){
            layer.open({content: '请填写手机号',skin: 'msg',time: 1});
            return phone_status;
        }
        $.ajax({
            xhrFields: {
               withCredentials: true
            },
            type:"post",
            url:base_url + "html5/v1/activity/checkContactPhone",
            data:JSON.stringify({"activityCode":activityCode,"contactPhone": phone}),
            dataType:'json',
            contentType: "application/json;charset=utf-8",
            success:function(data){
                //console.log(data.data.status);
                if(data.code==0){
                    if(data.data.status==true){
                        sendMessage(phone);
                        phone_status = true;
                    }else{
                        layer.open({content:'发布者手机号错误',skin:'msg',time: 1});
                        //return phone_status
                    }
                }else{
                    layer.open({content:data.msg,skin: 'msg',time: 1});
                    return phone_status;
                }
            },
            error:function(){
                layer.open({
                    content: '获取失败'
                    ,skin: 'msg'
                    ,time: 1 //2秒后自动关闭
                    });
                return phone_status;
            }
        })
        return phone_status;
    }
    var InterValObj; //timer变量，控制时间
    var count = 30; //间隔函数，1秒执行
    var curCount;//当前剩余秒数
    var code = ""; //验证码
    var codeLength = 6;//验证码长度
    function sendMessage(phone) {
        curCount = count;
//产生验证码
        for (var i = 0; i < codeLength; i++) {
            code += parseInt(Math.random() * 9).toString();
        }
//设置button效果，开始计时
        $("#btnSendCode").attr("disabled", "true");
        $("#btnSendCode").val( + curCount + "秒再获取");
        InterValObj = window.setInterval(SetRemainTime, 1000); //启动计时器，1秒执行一次
        ajax_code(phone);
    }
    //timer处理函数
    function SetRemainTime() {
        if (curCount == 0) {
            window.clearInterval(InterValObj);//停止计时器
            $("#btnSendCode").removeAttr("disabled");//启用按钮
            $("#btnSendCode").val("重新发送");
            code = ""; //清除验证码。如果不清除，过时间后，输入收到的验证码依然有效
        }
        else {
            curCount--;
            $("#btnSendCode").val( + curCount + "秒再获取");
        }
    }
    function ajax_code(mobile){
        var str = false;
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
                if(data.data.status){
                   str = true;
                }else{
                     layer.open({
                        content: data.msg
                        ,skin: 'msg'
                        ,time: 2 //2秒后自动关闭
                      });
                      return str;       
                }
                
            },
            error:function(e){
                layer.open({
                    content: '短信发送失败'
                    ,btn: '确定'
                });
                return str;
            }
        })
        return str;
    }
    function ajax_check_code(){
        var str1 = false;
        var mobile = $.trim($("input[name='phone']").val());
        var code = $.trim($("input[name='code']").val());
        if(!regular_code(code)){
            return false;
        }
        $.ajax({
            xhrFields: {
               withCredentials: true
            },
            type:'post',
            url :base_url + "html5/v1/sms/verifyCode",
            data:JSON.stringify({'mobile':mobile,'code':code}),
            dataType:'json',
            contentType: "application/json;charset=utf-8",
            async: false,
            success:function(data){
                console.log(data);
                if(data.code==0){
                    if(data.data.status){
                        str1 = true;
                    }else{
                        layer.open({
                            content: '验证码不正确',
                            skin: 'msg',
                            time: 2 //2秒后自动关闭
                        });
                        return str1;    
                    }
                }else{
                    layer.open({
                        content: '验证码不正确1',
                        skin: 'msg',
                        time: 2 //2秒后自动关闭
                    });     
                    return str1;
                }
                
            },
            error:function(e){
                layer.open({
                        content: '验证失败'
                        ,skin: 'msg'
                        ,time: 2 //2秒后自动关闭
                    });
                return str1;
            }
        })
        return str1;
    }
