var applyCode = $_GET['applyCode'];

//场次任务变更
function unitPost(type){
    var formdata = {};
    var url = "";
    //顶岗10 退出20
    if(type==10){
        url = "html5/v1/station/unitPostReplace/add";
        var nickname = $.trim($("input[name='nickname']").val());
        var mobile = $.trim($("input[name='mobile']").val());
        var cardno = $.trim($("input[name='cardno']").val());
        var reason =$.trim($(".warp_dd_i_st").val());
        if(nickname==''){
            layer.open({content: '姓名不能为空',skin: 'msg',time: 1});
            return false;
        }
        if(mobile==''&&cardno==''){
            layer.open({content: '手机号、证件号填写一个即可',skin: 'msg',time: 1});
            return false;
        }
        if(reason==''){
            layer.open({content: '请填写原因',skin: 'msg',time: 1});
            return false;
        }
        formdata = {
            "applyCode":applyCode,
            "applyUser":user_msg.userId,
            "reason":reason,
            "receiverCardNo":cardno,
            "receiverMobile":mobile,
            "receiverNickName":nickname
        }

    }else if(type==20){
        url = "html5/v1/station/unitPost/applyQuit";
        var reason =$.trim($(".warp_dd_i_st").val());
        if(reason==''){
            layer.open({content: '请填写原因',skin: 'msg',time: 1});
            return false;
        }
        formdata = {
            "code":applyCode,
            "reason":reason
        }
    }else{
        layer.open({content: '参数错误请重试',skin: 'msg',time: 1});
        return false;
    }
    layer.open({
        content: '您确定要这么做么？'
        ,btn: ['确定', '取消']
        ,yes: function(index){
            $.ajax({
                xhrFields: {
                    withCredentials: true
                },
                type:"post",
                url:base_url + url,
                data:JSON.stringify(formdata),
                dataType:'json',
                headers : {'token':token},
                contentType: "application/json;charset=utf-8",
                success:function(data){
                    //console.log(data);
                    if(data.code==0){
                        layer.open({content: '提交成功',skin: 'msg',time: 1});
                        setTimeout(function(){history.back(-1)},1000);
                    }else{
                        layer.open({content: data.msg,skin: 'msg',time: 1});
                        return false;
                    }
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
            layer.close(index);
        }
    })
}