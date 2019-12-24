    // var user_msg = '';
    // var token = '';
    // var user_msg = JSON.parse($.cookie('user_msg'));
    // var token = $.cookie('token');
    //加载任务信息
        function ajax_task_list(arr){
            var html ='';
            var data_list = '';
            $.ajax({
                xhrFields: {
                   withCredentials: true
                },
                type:'post',
                url:base_url + "html5/v1/task/queryBySectionCode",
                data:JSON.stringify({"sectionCode":arr.code}),
                dataType:'json',
                contentType: "application/json;charset=utf-8",
                beforeSend:function(XMLHttpRequest){
                    $(".warp_sh_u").html("<img src='../wap/img/loading.gif' style='width:24px;heigth:24px; margin:0 auto;display:block'/>");
                },
                success:function(data){
                    console.log(data);
                    if(data.code==0){
                        data_list = data.data;
                        html += '<li>\
                                    <div class="warp_sh_u_lp">\
                                        <span>'+arr.date1+arr.set+'任务列表</span>\
                                    </div>\
                                    <div class="warp_sh_u_lo">';
                        $.each(data_list,function(index,val){
                            requirementsNumber += parseInt(val.total);
                            html +='<div>\
                                        <a class="msg_sm" data-code="'+val.code+'" href="javascript:void(0)">\
                                        <span>需要'+val.total+'人</span>\
                                        <b><i>*</i>'+val.name+'</b>\
                                        </a>\
                                    </div>';    
                        })
                        if(localStorage.getItem('task_'+arr.code)==1){
                            html += '</div>\
                                </li>';
                           $("#setover").attr('data-code',arr.code).attr('value','已设置').attr("onclick",'');
                        }else{
                            html += '</div>\
                                    <a href="./act_task_add.html?activityCode='+$_GET["activityCode"]+'&sectionCode='+arr.code+'&day='+arr.date1+'&starttime='+arr.starttime+'&endtime='+arr.endtime+'" class="warp_sh_u_li"><i>+</i>增加任务</a>\
                                </li>';
                           $("#setover").attr('data-code',arr.code).attr('value','本场次设置完成').attr("onclick",'setOver()');
                        }
                        $(".warp_sh_u").empty();        
                        $(".warp_sh_u").html(html);
                        
                    }else{
                        layer.open({
                        content: '获取失败'
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
     //修改信息
        $(".msg_sm").live('click',function(){
            var code = $(this).attr('data-code');
            var cookiemsg = localStorage.getItem('task_'+code);
            if(!cookiemsg){
                layer.open({
                    content: '该任务不可修改'
                    ,skin: 'msg'
                    ,time: 1 //1秒后自动关闭
                });
                return false;
            }
            var jsonParse = JSON.parse(cookiemsg); //json字符串 转成JSON对象
            //console.log(jsonParse);return;
            window.location.href ='./act_task_edit.html?code='+jsonParse.code;
           
        }) 
    //场次信息提交
    function add_task(){
        var arr = $('#form1').serializeArray();
        var json = {};
        var quesion = [];
        $.each(arr, function(){
            json[this.name] = this.value;
        });
        
        if(!click_str_null(json['name'],'任务名称不能为空')){
            return false;
        }
        if(!click_str_null(json['demo'],'任务描述不能为空')){
            return false;
        }
        if(!click_str_null(json['total'],'请设置招募人数')){
            return false;
        }
        if(!click_str_null(json['times'],'请设置服务时长')){
            return false;
        }
        if(!click_str_null(json['stopTime'],'请设置截止时间')){
            return false;
        }
        if(!click_str_null(json['applyBeginTime'],'请设置报名开始时间')){
            return false;
        }
        if(!click_str_null(json['applyEndTime'],'请设置报名结束时间')){
            return false;
        }
        // if(!click_str_null(json['inIntegral'],'请设置积分赠送')){
        //     return false;
        // }
    
        json['audit'] = parseInt(json['audit']);
        json['inIntegral'] = parseInt(json['inIntegral']);
        json['insurance'] = parseInt(json['insurance']);
        //json['radius'] = parseInt(json['radius']);
        json['self'] = parseInt(json['self']);
        json['times'] = parseInt(Number(json['times'])*Number(60));
        json['total'] = parseInt(json['total']);
        json['stopTime'] =json['stopTime']+':00';
        json['applyBeginTime'] =json['applyBeginTime']+':00';
        json['applyEndTime'] =json['applyEndTime']+':00';
        json['sendPublicTickets'] = parseInt(json['sendPublicTickets']);
        json['activityCode'] = $_GET['activityCode'];
        json['sectionCode'] = $_GET['sectionCode'];
        //json['day'] = $_GET['day'];
        //json['startTime'] = $_GET['starttime'];
        //json['endTime'] = $_GET['endtime'];
        json['user'] = prjvorgMsg.prjvUserId;
        json['orgCode'] = prjvorgMsg.orgThirdAccount;
        json['coverImg'] = actMsg.coverImg;  //活动封面图片
        json['address'] = actMsg.address;  //活动地址
        json['contactPhone'] = actMsg.contactPhone;
        console.log(json);
        $.ajax({
                xhrFields: {
                   withCredentials: true
                },
                type:'post',
                url: base_url + "html5/v1/task/save",
                data:JSON.stringify(json),
                headers : {'token':token},
                dataType:'json',
                contentType: "application/json;charset=utf-8",
                success:function(data){
                    console.log(data);
                    if(data.code==0){
                        localStorage.setItem('task_'+data.data.code,JSON.stringify(data.data));
                        layer.open({
                        content: '添加成功'
                        ,skin: 'msg'
                        ,time: 2 //1秒后自动关闭
                        });  
                    setTimeout(function(){window.history.go(-1);},3000);
                    }else{
                        layer.open({
                        content: data.msg
                        ,skin: 'msg'
                        ,time: 1 //2秒后自动关闭
                        });
                        return false;
                    }
                },
                error:function(e){
                    layer.open({
                    content: '添加失败'
                    ,skin: 'msg'
                    ,time: 1 //2秒后自动关闭
                    });
                    return false;
                }
            })
    }
    //修改任务
    function edit_task(){
        var arr = $('#form1').serializeArray();
        var json = {};
        var quesion = [];
        $.each(arr, function(){
            json[this.name] = this.value;
        });
        
        if(!click_str_null(json['name'],'任务名称不能为空')){
            return false;
        }
        if(!click_str_null(json['demo'],'任务描述不能为空')){
            return false;
        }
        if(!click_str_null(json['total'],'请设置招募人数')){
            return false;
        }
        if(!click_str_null(json['times'],'请设置服务时长')){
            return false;
        }
        if(!click_str_null(json['stopTime'],'请设置截止时间')){
            return false;
        }
        // if(!click_str_null(json['inIntegral'],'请设置积分赠送')){
        //     return false;
        // }
    
        json['audit'] = parseInt(json['audit']);
        json['inIntegral'] = parseInt(json['inIntegral']);
        json['insurance'] = parseInt(json['insurance']);
        //json['radius'] = parseInt(json['radius']);
        json['self'] = parseInt(json['self']);
        json['times'] = parseInt(Number(json['times'])*Number(60));
        json['total'] = parseInt(json['total']);
        json['sendPublicTickets'] = parseInt(json['sendPublicTickets']);
        json['activityCode'] = $_GET['activityCode'];
        json['sectionCode'] = $_GET['sectionCode'];
        //json['day'] = $_GET['day'];
        //json['startTime'] = $_GET['starttime'];
        //json['endTime'] = $_GET['endtime'];
        json['user'] = prjvorgMsg.prjvUserId;
        json['stopTime'] = json['stopTime']+':00';
        delete json['date'];
        $.ajax({
                xhrFields: {
                   withCredentials: true
                },
                type:'post',
                url:base_url + "html5/v1/task/save",
                data:JSON.stringify(json),
                headers : {'token':token},
                dataType:'json',
                contentType: "application/json;charset=utf-8",
                success:function(data){
                    if(data.code==0){
                        localStorage.setItem('task_'+data.data.code,JSON.stringify(data.data));
                        layer.open({
                        content: '修改成功'
                        ,skin: 'msg'
                        ,time: 1 //1秒后自动关闭
                        });  
                    setTimeout(function(){window.history.go(-1);location.reload();},1000);
                    }else{
                        layer.open({
                        content: data.msg
                        ,skin: 'msg'
                        ,time: 1 //2秒后自动关闭
                        });
                        return false;
                    }
                },
                error:function(e){
                    layer.open({
                    content: '修改失败'
                    ,skin: 'msg'
                    ,time: 1 //2秒后自动关闭
                    });
                    return false;
                }
            })
    }
    //查询 对应cookie查询的信息
    function get_cookie_msg(code){
        var cookiemsg = localStorage.getItem('task_'+code);
        var jsonParse = JSON.parse(cookiemsg); //json字符串 转成JSON对象
        //console.log(jsonParse);
        $.each(jsonParse,function(index,val){ 
            if(index=='times'){
               var val = Number(val)/Number(60);
            } 
            if(index=='stopTime'){
               //var atim = split_datetime(val);
                var val = val.substring(0,val.length-3);  //去掉字符串后三位;       
               //$("input[name='date']").val(atim.date);
            } 
            $("input[name='"+index+"']").val(val);
        })
        
    }
    //判断 底部按钮选择
    function botton_decide_class(){
        var cla = '';
        $('.warp_pws_c_st input').each(function(){
           var val1 = $(this).val();
           var cla = val1==10?'switch-on':'switch-off';
           $(this).prev('div').find('span').attr('class',cla);
        })
    }
    //删除任务
    function del_msg(){
        layer.open({
            content: '您确定要这么做么？'
                ,btn: ['确定', '取消']
                ,yes: function(index){
                    var ticketOrder = $("input[name='ticketOrder']").val();
                    var code = $_GET['code'];
                    console.log(code);
                    console.log(ticketOrder);
                    $.ajax({
                        xhrFields: {
                           withCredentials: true
                        },
                        type:'post',
                        url:base_url + "html5/v1/task/delete",
                        data:JSON.stringify({"code":code,"ticketOrder":ticketOrder}),
                        headers : {'token':token},
                        dataType:'json',
                        contentType: "application/json;charset=utf-8",
                        success:function(data){
                            console.log(data);
                            if(data.code==0){
                                    localStorage.removeItem('task_'+code);
                                    layer.open({
                                    content: '删除成功'
                                    ,skin: 'msg'
                                    ,time: 1 //1秒后自动关闭
                                    });  
                                setTimeout(function(){window.history.go(-1);location.reload();},1000);
                            }else{
                                layer.open({
                                content: '删除失败'
                                ,skin: 'msg'
                                ,time: 1 //2秒后自动关闭
                                });
                                return false;
                            }
                        },
                        error:function(e){
                            layer.open({
                            content: '删除失败'
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

    

