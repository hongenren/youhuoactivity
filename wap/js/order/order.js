//获取 订单列表
	var user_msg = '';
    var token = '';
    var user_msg = JSON.parse($.cookie('user_msg'));
    var token = $.cookie('token');
    //console.log(token)
	function order_list(){
		$.ajax({
            xhrFields: {
               withCredentials: true
            },
            type:"post",
            url:base_url + "html5/v1/userTicket/findHistoryByUser",
            data:JSON.stringify({"pageNumber":1,"pageSize":6,"user":user_msg.userId}),
            dataType:'json',
            headers : {'token':token},
            contentType: "application/json;charset=utf-8",
            success:function(data){
            	console.log(data);
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
	}
    //场次任务变更
    function querychange_order(){
        var sectionCode = $_GET['sectionCode'];
        var mark = parseInt($_GET['mark']);
        var ticket = $_GET['ticket'];
        var type = parseInt($_GET['type']);
        var formdata = {};
        //顶岗/转接/转增10 退出20 延期30
        if(type==10){   
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
            var formdata = {
                "sectionCode":sectionCode,
                "applyUser":user_msg.userId,
                "ticket":ticket,
                "mark":mark,
                "reason":reason,
                "receiverCardNo":cardno,
                "receiverMobile":mobile,
                "receiverNickName":nickname,
                "type":type
            }
            
        }else if(type==20){
            var reason =$.trim($(".warp_dd_i_st").val());
            if(reason==''){
                layer.open({content: '请填写原因',skin: 'msg',time: 1});
                return false;
            }
            var formdata = {"sectionCode":sectionCode,"applyUser":user_msg.userId,"ticket":ticket,"mark":mark,"reason":reason,"type":type}
        }else if(type==30){
            var poneendtime = $("input[name='poneendtime']").val();
            var reason =$.trim($(".warp_dd_i_st").val());
            if(poneendtime==''){
                layer.open({content: '请填写延期时间',skin: 'msg',time: 1});
                return false;
            }else{
                var now_time = getFormatDate(); //当前时间
                if(!compareTime(now_time,poneendtime)){
                    layer.open({content: '延期时间不可早于当前时间',skin: 'msg',time: 1});
                    return false;
                }
            }
            if(reason==''){
                layer.open({content: '请填写原因',skin: 'msg',time: 1});
                return false;
            }
            var formdata = {
                "sectionCode":sectionCode,
                "applyUser":user_msg.userId,
                "ticket":ticket,
                "mark":mark,
                "reason":reason,
                "postponeEndTime":poneendtime + ":00",
                "type":type
            }

        }else{
            layer.open({content: '参数错误请重试',skin: 'msg',time: 1});
            return false;
        }
        console.log(JSON.stringify(formdata));
        layer.open({
            content: '您确定要这么做么？'
                ,btn: ['确定', '取消']
                ,yes: function(index){
                    $.ajax({
                        xhrFields: {
                           withCredentials: true
                        },
                        type:"post",
                        url:base_url + "html5/v1/userTicket/changeApply",
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