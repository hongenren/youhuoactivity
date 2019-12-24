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
                console.log(data);
                if(data.code==0){
                    var data_list = data.data;
                    if(data_list!=''){
                        $('.warp_gl_y_st').eq(toid).find('b').text(data_list[index].name);
                        $('.warp_glr_r:eq(0)').find('span').text(data_list[index].arriveAddress);
                        $("input[name='radius']:eq(0)").val(data_list[index].radius);
                        $("input[name='code']:eq(0)").val(data_list[index].code);
                        $("input[name='ticketOrder']:eq(0)").val(data_list[index].ticketOrder);
                        $("input[name='arriveAddress']:eq(0)").val(data_list[index].arriveAddress);
                        $("input[name='lat']:eq(0)").val(data_list[index].lat);
                        $("input[name='lng']:eq(0)").val(data_list[index].lng);
                    }else{
                        var html ='<li>\
                                    <div class="mr_w_nr">\
                                        <img src="../wap/img/pws_164.png">\
                                        <span>暂无内容</span>\
                                    </div>\
                                </li> ';
                        $(".warp_gl_y_su").empty();
                        $("#job").empty();
                        $(".warp_pws_m_sw").empty();
                        $(".warp_gl_y_su").html(html);
                        
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
        var html = ''
        var url = '';
        var url = base_url + "html5/v1/section/queryAddressList";
        var data1 = {"code":sectionCode,'type':60};
        /*if(type=='ticket'){
            var eq = 1;
            var url = base_url + "html5/v1/public/queryBySectionCode";
            var data1 = {"sectionCode":sectionCode};
        }else if(type=='manage'){
            var eq = 2;
            var url = base_url + "html5/v1/manager/queryBySectionCode";
            var data1 = {"sectionCode":sectionCode,'type':80};
        }else if(type=='guestcard'){
            var eq = 3;
            var url = base_url + "html5/v1/mediaGuest/queryBySectionCode";
            var data1 = {"sectionCode":sectionCode,'type':50};
        }else if(type=='mediacard'){
            var eq = 4;
            var url = base_url + "html5/v1/mediaGuest/queryBySectionCode";
            var data1 = {"sectionCode":sectionCode,'type':60};
        }*/
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
            // beforeSend:function(XMLHttpRequest){
            //     $('.warp_gl_y_su').html("<img src='../wap/img/loading.gif' style='width:24px;heigth:24px; margin:0 auto;display:block'/>");
            // },
            success:function(data){
                if(data.code==0){
                    //console.log(type);
                    //console.log(data);
                    var data1 = data.data;
                    if(data1!=''){
                        $.each(data1,function(v,k) {
                            html +='<form id="'+k.type+'">\
                                    <li>\
                                        <div class="warp_gl_y_sy">\
                                            <div class="warp_gl_y_st">\
                                                <b>'+k.name+'</b>\
                                            </div>\
                                            <div class="warp_glr_r">\
                                                <span class="cnowiucioq">'+k.arriveAddress+'</span>\
                                            </div>\
                                            <div class="warp_glr_e">\
                                                <input type="button" value="变更地点" class="warp_dd">\
                                                <input type="button" onclick="sub(this)" data-id="'+k.id+'" value="提交">\
                                            </div>\
                                        </div>\
                                        <input type="hidden" name="type" value="'+k.type+'"/>\
                                        \
                                        <input type="hidden" name="code" value="'+k.code+'"/>\
                                        <input type="hidden" name="ticketOrder" value="'+k.ticketOrder+'"/>\
                                        <input type="hidden" name="arriveAddress" id="address" value="'+k.arriveAddress+'"/>\
                                        <input type="hidden" name="lng" value="" id="job_lng" />\
                                        <input type="hidden" name="lat" value="" id="job_lat"/>\
                                        <input type="hidden" name="radius" id="job_radius" value=""/>\
                                    </li>\
                                </form>';
                        })
                    }
                    $('.warp_gl_y_su').append(html);
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
    function sub(obj){
        var arr = $(obj).parent().parent().parent().parent().serializeArray();
        var json = {};
            $.each(arr, function(){
                json[this.name] = this.value;
            });/*
            json['arriveAddress'] = $('.warp_glr_r:eq(0)').find('span').html();//报到地址
            json['code'] = code;//岗位标识
            json['ticketOrder'] = ticketOrder;//订单编号
            json['lng'] = "";//经度
            json['lat'] = "";//纬度
            json['radius'] = 3000;//打卡半径*/
            json['user'] = user_msg.userId;//操作人
        $.ajax({
            type:"post",
            url:base_url + "html5/v1/section/updateAddress",
            //url:base_url + "html5/v1/recruit/updateAddress",
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
        });
    }

    function save(){

    }