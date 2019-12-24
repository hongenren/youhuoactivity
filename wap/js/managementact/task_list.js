    var user_msg = '';
    var token = '';
    var user_msg = JSON.parse($.cookie('user_msg'));
    var token = $.cookie('token');
    $(function(){
        $(".warp_gl_y_sl li").live("click",function(){
            var text = $(this).find('a').text();
            $(".warp_gl_u_so span").text(text);
            $(".warp_gl_y_sw").fadeOut();
        });
        //取消按钮
        $(".cancel_a").click(function(){
            $(".warp_gl_w_sf").fadeOut();
        })
        //提交按钮
        $(".subm_a").click(function(){
            var ticket = $("input[name='ticket']").val();
            var state = $("input[name='state']").val();
            var user = $("input[name='user']").val();
            var reason = $.trim($(".reason1").val());
            if(reason==""){
                layer.open({ content:"请填写原因",skin: 'msg',time: 1 });
                return false;
            }
            var data = {"ticket":ticket,"state":state,"user":user,"reason":reason}
            task_sub_do(data);
        })
        $(".warp_gl_u_su").click(function(){
            layer.open({type: 2,content: '查询中'});
            var key1 = $.trim($("input[name='key']").val());
            if(key1!=''){
                get_task_sublist($_GET['sectionCode'],"",key1);
            }else{
                get_task_sublist($_GET['sectionCode']);
            }
            layer.closeAll();
        })
    });
    function warp_gl_y_swClick(){
        $(".warp_gl_y_sw").fadeIn();
    }
 //获取该场次任务列表
    function get_task_list(sectionCode){
        var html ='';
        var data_list = '';
        var recruitCode = "";
        $.ajax({
            xhrFields: {
               withCredentials: true
            },
            type:"post",
            url:base_url + "html5/v1/task/queryBySectionCode",
            data:JSON.stringify({"sectionCode":sectionCode,"user":user_msg.userId}),
            dataType:'json',
            headers : {'token':token},
            contentType: "application/json;charset=utf-8",
            success:function(data){
                if(data.code==0){
                    data_list = data.data;
                    html += '<li><a href="javascript:;" onclick="get_task_sublist(\''+$_GET['sectionCode']+'\')">全部任务</a></li>';
                    $.each(data_list,function(index,val){  
                        html += '<li>\
                                    <a href="javascript:;" onclick="get_task_sublist(\''+$_GET['sectionCode']+'\',\''+val.code+'\')">'+val.name+'</a>\
                                </li>';
                       
                    })
                    $(".warp_gl_y_sl").html(html)
                }else{
                    layer.open({
                    content: data.msg
                    ,skin: 'msg'
                    ,time: 1 //2秒后自动关闭
                    });
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
    }

 //获取任务列表
    function get_task_sublist(sectionCode,taskCode="",keyval="",pageNumber=1,pageSize=3,status=1,me=''){
        if(keyval==""){
            var url = base_url + "html5/v1/task/queryTaskSubmitList";
            var data = JSON.stringify({"sectionCode":sectionCode,"taskCode":taskCode,"pageNumber":pageNumber,"pageSize":pageSize});
        }else{
            var url = base_url + "html5/v1/task/searchTaskSubmit";
            var data = JSON.stringify({"sectionCode":sectionCode,"taskCode":taskCode,"searchValue":keyval,"pageNumber":pageNumber,"pageSize":pageSize});
        }
        $.ajax({
            xhrFields: {
               withCredentials: true
            },
            type:"post",
            url:url ,
            data:data,
            dataType:'json',
            contentType: "application/json;charset=utf-8",
            success:function(data){
                var html ='';
                var data_list = '';
                if(data.code==0){
                    data_list = data.data.records;
                    if(data_list!=''){
                        $.each(data_list,function(index,val){
                            html += task_list_msg(val);
                        })
                        if(status==1){
                            $(".warp_gl_q").empty();
                            $(".warp_gl_q").html(html);
                        }else{
                           
                            $(".warp_gl_q").append(html); //追加html
                        }    
                    }else{
                        if(status==1){
                            html += "<div class=\"zw_sj_p\">\
                                <img src=\"../wap/img/pws_164.png\">\
                            </div>";
                            $(".warp_gl_q").empty()
                            $(".warp_gl_q").html(html);
                        }else{
                            me.lock();
                            // 无数据
                            me.noData();
                        }
                        
                    }
                    if(status==2){
                        me.resetload();
                    }       
                }else{
                    layer.open({
                    content: '获取失败'
                    ,skin: 'msg'
                    ,time: 1 //2秒后自动关闭
                    });
                    //$(".warp_gl_u_sr").empty()
                    return false;
                }
            },
            error:function(e){
                layer.open({
                    content: '查询失败'
                    ,skin: 'msg'
                    ,time: 1 //2秒后自动关闭
                });
                return false;
            }
        })
    }
    //任务列表信息
    function task_list_msg(data){
        //console.log(data);
        var html = '';
        html+='<li data-ticket="'+data.ticket+'" data-user="'+data.user+'">\
                <div class="warp_gl_u_se">';
        html += data.headImg?'<img src="'+data.headImg+'">':'<img src="../wap/img/pws_244.png">';
        html +=     '<div class="warp_gl_u_sw">\
                        <div class="warp_gl_u_sq">';
        if(data.evaluate != 20 && data.evaluate != 30) {
            html += '<a href="./evaluate.html?ticket=' + data.ticket + '">评价</a>';
        }
        if(data.mobile==''){
            html += '<a href="javascript:alert(\'暂无联系方式\')">联系</a>';
        }else{
            html += '<a href="tel:'+data.mobile+'">联系</a>';
        }
        var stopTime = split_datetime(data.stopTime);
        var state = "";
        if(data.state==20){
            state = "任务成功";
        }else if(data.state==-10){
            state = "任务失败";
        }
        html += '<b>'+data.nickName+'</b>\
                        </div>\
                        <p>服务时长：'+(data.times/60)+'小时</p>\
                    </div>\
                </div>\
                <div class="warp_gl_q_sp">\
                    <span>'+data.taskName+'</span>\
                    <span>提交截止时间：'+stopTime.date +' '+ stopTime.str +'</span>\
                </div>\
                <div class="warp_gl_q_sp">\
                    <span>提交内容：<a href="./task_content.html?taskCode='+data.taskCode+'&user='+data.user+'">点击查看</a></span>\
                    <span>提交时间：'+data.createTime+'<span style="float: right">'+state+'</span></span>\
                </div>';
        html += '<div class="warp_gl_q_sp">';
        //延迟申请存在
        if(data.reason!=''&&data.delayAuditState==10){
            html += '<span>申请延时原因：'+data.reason+'</span>'; 
            html +=' <span>申请延时审核结果：<i>待审核</i></span>';
        }else if(data.reason!=''&&data.delayAuditState==20){
            html += '<span>申请延时原因：'+data.reason+'</span>'; 
            html +=' <span>申请延时审核结果：<i>通过</i></span>';
        }else if(data.reason!=''&&data.delayAuditState==-10){
            html += '<span>申请延时原因：'+data.reason+'</span>'; 
            html +=' <span>申请延时审核结果：<i>拒绝</i></span>';
        }
        html += '</div>\
                <div class="warp_gl_q_so">';
                //任务成功：只要有任务内容提交，就显示【任务成功】按钮
                //任务失败：不管是否有任务内容提交，都显示【任务失败】按钮
        if(state==""){
            if(data.delayAuditState==10){
                html += '<span style="background:#E5E5E5;color:#AAA1A8">任务失败</span>\
                         <span style="background:#E5E5E5;color:#AAA1A8">任务成功</span>';
            }else{
                html += '<span data-state="-10" class="task_sub" onclick>任务失败</span>\
                         <span data-state="20" class="task_sub" onclick>任务成功</span>';
            }
        }
        
        if(data.delayAuditState==10){
            html += '<span data-state="-10" class="auditApply" onclick>延时拒绝</span>\
                     <span data-state="20" class="auditApply" onclick>延时通过</span>';
            }
        html += '</div></li>';
        return html;
    }
$(function(){
     // 页数
        var page = 1;
        var size = 3;
        var ticket ='';
        
    // dropload
    $('#content').dropload({
        scrollArea : window,
        loadDownFn : function(me){
            page++;
            get_task_sublist($_GET['sectionCode'],"","",page,size,2,me);
        }
    })       
})
    //提交任务审核
    $('.task_sub').live('click',function(){
        var ticket  = $(this).parent().parent().attr('data-ticket');
        var state = $(this).attr('data-state'); 
        var user = $(this).parent().parent().attr('data-user');
        if(state==-10){
            $("input[name='ticket']").val(ticket);
            $("input[name='state']").val(state);
            $("input[name='user']").val(user);
            $(".warp_gl_w_sf").show();
        }else{
            var data = {"ticket":ticket,"state":state,"user":user,"reason":''}
            task_sub_do(data);
        }

    })
    //任务提交
    function task_sub_do(data){
        //console.log(data);
        layer.open({
            content: '您确定要这么做么？'
                ,btn: ['确定', '取消']
                ,yes: function(index){
                    $.ajax({
                        xhrFields: {
                           withCredentials: true
                        },
                        type:"post",
                        url:base_url + "html5/v1/task/auditTaskSubmit",
                        data:JSON.stringify(data),
                        headers : {'token':token},
                        dataType:'json',
                        contentType: "application/json;charset=utf-8",
                        success:function(data){
                            if(data.code==0){
                                layer.open({content: '操作成功',skin: 'msg',time: 1});
                                setTimeout(function(){location.reload()},1000);
                            }else{
                                layer.open({content: data.msg,skin: 'msg',time: 1});
                                return false;
                            }
                            //console.log(data);

                        },
                        error:function(e){
                            layer.open({
                                content: '查询失败'
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
    $('.auditApply').live('click',function(){
        var ticket  = $(this).parent().parent().attr('data-ticket');
        var dataState = $(this).attr('data-state');
        var state = dataState; 
        var user = $(this).parent().parent().attr('data-user'); 
        var type = 30;
        layer.open({
            content: '您确定要这么做么？'
                ,btn: ['确定', '取消']
                ,yes: function(index){
                    //console.log(JSON.stringify({"ticket":ticket,"type":type,"state":state,"user":user}));return;
                    $.ajax({
                        xhrFields: {
                           withCredentials: true
                        },
                        type:"post",
                        url:base_url + "html5/v1/userTicket/auditChangeApply",
                        data:JSON.stringify({"ticket":ticket,"type":type,"state":state,"user":user}),
                        dataType:'json',
                        headers : {'token':token},
                        contentType: "application/json;charset=utf-8",
                        success:function(data){
                            //console.log(data);
                            if(data.code==0){
                                layer.open({content: '操作成功',skin: 'msg',time: 1});
                                setTimeout(function(){location.reload()},1000);
                            }else{
                                layer.open({content: data.msg,skin: 'msg',time: 1});
                                return false;
                            }
                        },
                        error:function(e){
                            layer.open({
                                content: '查询失败'
                                ,skin: 'msg'
                                ,time: 1 //2秒后自动关闭
                            });
                            return false;
                        }
                    })
                layer.close(index);
                }
            })
        
    })
       
