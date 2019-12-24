    var sectionCode = $_GET['sectionCode'];
    var user_msg = '';
    var token = '';
    var user_msg = JSON.parse($.cookie('user_msg'));
    var token = $.cookie('token');
    $(function(){
        //岗位 以及门票的切换
        $(".warp_gl_l_so span").live("click",function(){
            var type = $(this).parent().parent().attr('data-type');
            get_activity_query(type,sectionCode,'.warp_gl_y_sl');
            $(".warp_gl_y_sw").fadeIn();
        });
        $(".warp_gl_l_so span").live("click",function(){
            $(".warp_gl_y_sw").fadeIn();
        });
        //选择 具体 岗位、门票
        $(".warp_gl_y_sl li").live("click",function(){
            var index = $(this).index();
            var type = $(this).find('a').attr('data-type');
            mor_activity_query(type,sectionCode,1,index);
            $(".warp_gl_y_sw").fadeOut();
        });

        //增加名额弹窗
        $(".warp_gl_l_si a").live("click",function(){
            var code = $(this).parent().parent('.warp_gl_l_sp').attr('data-code');
            var ticketorder = $(this).parent().parent('.warp_gl_l_sp').attr('data-ticketorder');
            console.log(ticketorder);
            var type = $(this).parent().parent('.warp_gl_l_sp').attr('data-type');
            $("input[name='code']").val(code);
            $("input[name='ticketOrder']").val(ticketorder);
            $("input[name='type']").val(type);
            $(".warp_gl_l_sy").fadeIn();
        });
        //取消弹窗
        $(".warp_gl_l_sl a").live("click",function(){
            $(".warp_gl_l_sy").fadeOut();
        });
        //提交信息
        $(".warp_gl_l_sl input").live("click",function(){
            var arr = $('#form1').serializeArray();
            var json = {};
            $.each(arr, function(){
                json[this.name] = this.value;
            });
            if(json['type']=='work'){
                var url = base_url + "html5/v1/recruit/updateTotal";
            }else if(json['type']=='task'){
                var url = base_url + "html5/v1/task/updateTotal";
            }else if(json['type']=='ticket'){
                var url = base_url + "html5/v1/public/updateTotal";
            }else if(json['type']=='manage'){
                var url = base_url + "html5/v1/manager/updateTotal";
            }else if(json['type']=='guestcard'){
                var url = base_url + "html5/v1/mediaGuest/updateTotal";
            }else if(json['type']=='mediacard'){
                var url = base_url + "html5/v1/mediaGuest/updateTotal";
            }
            if(json['total']==0){
                layer.open({content: '新增人数要大于0',skin: 'msg',time: 1 });
                return false;
            }
            json['user'] = user_msg.userId;
            delete json['type'];
            //console.log(JSON.stringify(json));return;
            $.ajax({
                xhrFields: {
                   withCredentials: true
                },
                type:"post",
                url:url,
                data:JSON.stringify(json),
                dataType:'json',
                headers : {'token':token},
                contentType: "application/json;charset=utf-8",
                success:function(data){
                    //console.log(data)
                    if(data.code==0){
                        layer.open({content: '操作成功',skin: 'msg',time: 1});
                        setTimeout(function(){location.reload();},1000);
                    }else{
                        console.log(data);
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
        });
        //直接发证
        $('.certification').live('click',function(){
            var code = $(this).parent().parent().attr('data-code');
            var ticketorder = $(this).parent().parent().attr('data-ticketorder');
            window.location.href = "./certification.html?code="+code+"&ticketorder="+ticketorder;
        })
    });
    
    $(function(){
        var cotrs = $(".warp_gl_y_sl li");
        cotrs.click(function(){
            $(this).addClass("thisclass").siblings().removeClass("thisclass");
        });
    });

function get_activity_query(type,sectionCode,toid)
    {
        var html ='';
        var url = '';
        var data_list = '';
        var recruitCode = "";
        if(type=='work'){
            var url = base_url + "html5/v1/recruit/findBySectionCode";
        }else if(type=='task'){
            var url = base_url + "html5/v1/task/queryBySectionCode";
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
                console.log(data);
                if(data.code==0){ 
                    data_list = data.data;
                    $('.warp_gl_l_so:eq(0)').find('b').text(data_list[0].name);
                    $('.warp_gl_l_si:eq(0)').find('i').text(data_list[0].total);
                    $('.warp_gl_l_si:eq(0)').find('u').text(data_list[0].applyCount);
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
function mor_activity_query(type,sectionCode,oid,index=0)
    {
        var html ='';
        var url = '';
        var data_list = '';
        var recruitCode = "";
        if(type=='work'){
            var url = base_url + "html5/v1/recruit/findBySectionCode";
        }else if(type=='task'){
            var url = base_url + "html5/v1/task/queryBySectionCode";
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
                //console.log(data);
                if(data.code==0){
                    if(data.data!=''){
                        var data_list = data.data;
                        if(oid==0){
                            html += '<li>\
                                <div class="warp_gl_l_sp" data-code="'+data_list[index].code+'" data-ticketorder="'+data_list[index].ticketOrder+'" data-type="'+type+'">\
                                    <div class="warp_gl_l_so '+type+'">\
                                        <span></span>\
                                        <b>'+data_list[index].name+'</b>\
                                    </div>\
                                    <div class="warp_gl_l_si">\
                                        <a href="javascript:void(0)">增加名额</a>\
                                        <span>需报名<i>'+data_list[index].total+'</i>人/已报<u>'+data_list[index].applyCount+'</u>人</span>\
                                    </div>\
                                </div>\
                            </li>';
                            $("#duo").append(html);
                        }else{
                            //console.log(data_list);
                            $('.'+type).find('b').text(data_list[index].name);
                            $('.'+type).next('div').find('i').text(data_list[index].total);
                            $('.'+type).next('div').find('u').text(data_list[index].applyCount);
                            $('.'+type).parent('.warp_gl_l_sp').attr('data-code',data_list[index].code);
                            $('.'+type).parent('.warp_gl_l_sp').attr('data-ticketOrder',data_list[index].ticketOrder);
                        }
                        
                    }
                    
                    
                
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
        var html = '';
        if(type=='ticket'){
            var url = base_url + "html5/v1/public/queryBySectionCode";
            var data1 = {"sectionCode":sectionCode};
            var name = '公众门票';
        }else if(type=='manage'){
            var url = base_url + "html5/v1/manager/queryBySectionCode";
            var data1 = {"sectionCode":sectionCode,'type':80};
            var name = '管理员工作证';
        }else if(type=='guestcard'){
            var url = base_url + "html5/v1/mediaGuest/queryBySectionCode";
            var data1 = {"sectionCode":sectionCode,'type':50};
            var name = '嘉宾证';
        }else if(type=='mediacard'){
            var url = base_url + "html5/v1/mediaGuest/queryBySectionCode";
            var data1 = {"sectionCode":sectionCode,'type':60};
            var name = '媒体证';
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
                    if(data.data!=''){
                        var data1 = data.data;
                        html +=' <li>\
                                <div class="warp_gl_l_sp" data-type='+type+' data-code='+data1.code+' data-ticketorder='+data1.ticketOrder+'>\
                                    <div class="warp_gl_l_so" data-type='+type+'>';
                        if(type=='manage'){
                            html += '<a href="javascript:void(0)" class="certification">直接发证</a>';
                        }                    
                        html += '<b>'+name+'</b>\
                                    </div>\
                                    <div class="warp_gl_l_su"></div>\
                                    <div class="warp_gl_l_si">\
                                        <a href="javascript:void(0)">增加名额</a>\
                                        <span>需报名<i>'+data1.total+'</i>人/已报<u>'+data1.applyCount+'</u>人</span>\
                                    </div>\
                                </div>\
                            </li>';
                        $("#dan").append(html);
                    }   
                    // console.log(type);
                    // console.log(data);
                    // var data1 = data.data;
                    // $('.'+type).attr('data-code',data1.code);
                    // $('.'+type).attr('data-ticketorder',data1.ticketOrder);
                    // $('.'+type).children('.warp_gl_l_si').find('span').find('i').text(data1.applyCount);
                    // $('.'+type).children('.warp_gl_l_si').find('span').find('u').text(data1.total);
                
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