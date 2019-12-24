var sectionCode = $_GET['sectionCode'];
function get_activity_query(type,sectionCode,toid)
    {
        var html ='';
        var url = '';
        var data_list = '';
        var recruitCode = "";
        if(type=='work'){
            var url = base_url + "html5/v1/recruit/findBySectionCode";
        }
        $.ajax({
            xhrFields: {
               withCredentials: true
            },
            type:"post",
            url:url,
            data:JSON.stringify({"sectionCode":sectionCode}),
            dataType:'json',
            headers : {'token':token},
            contentType: "application/json;charset=utf-8",
            // beforeSend:function(XMLHttpRequest){
            //         $(toid).html("<img src='../wap/img/loading.gif' style='width:24px;heigth:24px; margin:0 auto;display:block'/>");
            //     },
            success:function(data){
                if(data.code==0){
                    //console.log(data);
                    data_list = data.data;
                    $('.warp_gl_l_so:eq(0)').find('b').text(data_list[0].name);
                    $('.warp_gl_l_si:eq(0)').find('i').text(data_list[0].applyCount);
                    $('.warp_gl_l_si:eq(0)').find('u').text(data_list[0].total);
                    $.each(data_list,function(index,val){
                        if(type=='work'){
                            html += '<li><a href="javascript:void(0)" data-type="'+type+'">'+val.name+'</a></li>';
                        }else if(type=='task'){
                            html += '<li><a href="javascript:void(0)" data-type="'+type+'">'+val.name+'</a></li>';
                        }
                        
                    })
                    $(toid).empty();
                    $(toid).html(html);
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
function mor_activity_query(type,sectionCode,toid,index=0)
    {
        var html ='';
        var url = '';
        var data_list = '';
        var recruitCode = "";
        if(type=='work'){
            var url = base_url + "html5/v1/recruit/findBySectionCode";
        }
        $.ajax({
            xhrFields: {
               withCredentials: true
            },
            type:"post",
            url:url,
            data:JSON.stringify({"sectionCode":sectionCode}),
            dataType:'json',
            headers : {'token':token},
            contentType: "application/json;charset=utf-8",
            // beforeSend:function(XMLHttpRequest){
            //         $(toid).html("<img src='../wap/img/loading.gif' style='width:24px;heigth:24px; margin:0 auto;display:block'/>");
            //     },
            success:function(data){
                if(data.code==0){
                    console.log(data);
                    var data_list = data.data;
                    $('.warp_gl_y_st').eq(toid).find('b').text(data_list[index].name);
                    var times = data_list[index].times;
                    $("input[name='times']").val(Math.ceil(times/60))//);
                    $("input[name='code']").val(data_list[index].code);
                    $("input[name='ticketOrder']").val(data_list[index].ticketOrder);
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
    //单查询  适合  管理员工作证 嘉宾 媒体证
    function get_result_msg(type){
        var url = '';
        if(type=='ticket'){
            var url = base_url + "html5/v1/public/queryBySectionCode";
            var data1 = {"sectionCode":sectionCode};
        }else if(type=='manage'){
            var url = base_url + "html5/v1/manager/queryBySectionCode";
            var data1 = {"sectionCode":sectionCode,'type':80};
        }else if(type=='guestcard'){
            var url = base_url + "html5/v1/mediaGuest/queryBySectionCode";
            var data1 = {"sectionCode":sectionCode,'type':50};
        }else if(type=='mediacard'){
            var url = base_url + "html5/v1/mediaGuest/queryBySectionCode";
            var data1 = {"sectionCode":sectionCode,'type':60};
        }
        $.ajax({
            xhrFields: {
               withCredentials: true
            },
            type:"post",
            url:url,
            data:JSON.stringify(data1),
            dataType:'json',
            headers : {'token':token},
            contentType: "application/json;charset=utf-8",
            success:function(data){
                if(data.code==0){
                    console.log(type);
                    console.log(data);
                    var data1 = data.data;
                    $('.'+type).attr('data-code',data1.code);
                    $('.'+type).attr('data-ticketOrder',data1.ticketOrder);
                    $('.'+type).children('.warp_gl_l_si').find('span').find('i').text(data1.applyCount);
                    $('.'+type).children('.warp_gl_l_si').find('span').find('u').text(data1.total);
                
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
    //提交岗位信息
    function sub(){
        var arr = $('#form1').serializeArray();
        var json = {};
            $.each(arr, function(){
                json[this.name] = this.value;
            });
            json['times'] = parseInt(json['times']*60);
            json['user'] = user_msg.userId;
        $.ajax({
            xhrFields: {
               withCredentials: true
            },
            type:"post",
            url:base_url + "html5/v1/recruit/updateTimes",
            data:JSON.stringify(json),
            dataType:'json',
            headers : {'token':token},
            contentType: "application/json;charset=utf-8",
            success:function(data){
                if(data.code==0){
                    layer.open({content: '操作成功',skin: 'msg',time: 1});
                    setTimeout(function(){location.reload();},1000);
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