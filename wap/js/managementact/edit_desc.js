//获取岗位和任务
function get_activity_query(type,sectionCode,eidt_address,toid)
    {
        var html ='';
        var url = '';
        var data_list = '';
        var recruitCode = "";
        if(type=='work'){
        	var url = base_url + "html5/v1/recruit/findBySectionCode?t="+new Date().getTime();
        }else if(type=='task'){
        	var url = base_url + "html5/v1/task/queryBySectionCode?t="+new Date().getTime();
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
            beforeSend:function(XMLHttpRequest){
                    $(toid).html("<img src='../wap/img/loading.gif' style='width:24px;heigth:24px; margin:0 auto;display:block'/>");
                },
            success:function(data){
                if(data.code==0){
                    data_list = data.data;
                    console.log(data_list.length);
                    $.each(data_list,function(index,val){

                        if(type=='work'){
                            $('.workcount').html(data_list.length + '个');
                            var time3 = datetime_delayed(val.arriveTime); //时间戳转化;
                            var demo = encodeURI(encodeURI(val.demo));
                            html += '<li><a href="'+eidt_address+'?code='+val.code+'&demo='+demo+'&ticketOrder='+val.ticketOrder+'&arriveTime='+time3+'&inIntegral='+val.inIntegral+'">修改</a><span>'+val.name+'</span></li>';
                        }else if(type=='task'){
                            $('.taskcount').html(data_list.length + '个');
                            var time3 = datetime_delayed(val.stopTime);//1;
                            //var time3 = datetime_delayed(val.stopTime); //时间戳转化;
                            html += '<li><a href="'+eidt_address+'?code='+val.code+'&demo='+val.demo+'&ticketOrder='+val.ticketOrder+'&arriveTime='+time3+'&times='+val.times+'&inIntegral='+val.inIntegral+'">修改</a><span>'+val.name+'</span></li>';
                        }
                        
                    })
                    $(toid).empty(html);
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
    // 获取 单 信息   
    //type  string   ticket公众门票 manage管理人员工作证   guestcard媒体证   mediacard嘉宾证
    function get_activity_query_msg(type,sectionCode,datahref){
        var html = '';
        if(type=='ticket'){
            var url = base_url + "html5/v1/public/queryBySectionCode?t="+new Date().getTime(); //公众门票
            var data = {"sectionCode":sectionCode};
            var title = '公众门票';
            var msg = '普通参与者';
        }else if(type=='manage'){
            var url = base_url + "html5/v1/manager/queryBySectionCode?t="+new Date().getTime(); //管理员
            var data = {"sectionCode":sectionCode};
            var title = '管理人员工作证';
            var msg = '管理人员';
        }else if(type=='guestcard'){
            var url = base_url + "html5/v1/mediaGuest/queryBySectionCode?t="+new Date().getTime(); //媒体证 嘉宾证
            var data = {"sectionCode":sectionCode,"type": 50};
            var title = '媒体证';
            var msg = '媒体记者';
        }else if(type=='mediacard'){
            var url = base_url + "html5/v1/mediaGuest/queryBySectionCode?t="+new Date().getTime(); //媒体证 嘉宾证
            var data = {"sectionCode":sectionCode,"type": 60};
            var title = '嘉宾证';
            var msg = '邀请嘉宾';
        }

        $.ajax({
            xhrFields: {
               withCredentials: true
            },
            type:"post",
            url:url,
            data:JSON.stringify(data),
            dataType:'json',
            headers : {'token':token},
            contentType: "application/json;charset=utf-8",
            // beforeSend:function(XMLHttpRequest){
            //         $(toid).html("<img src='../wap/img/loading.gif' style='width:24px;heigth:24px; margin:0 auto;display:block'/>");
            //     },
            success:function(data){
                console.log(data)
                if(data.code==0){
                    var data1 =data.data;
                    if(data1!=''){
                        html += '<li class="warp_gl_q_sj">\
                                        <div class="warp_gl_q_sh">\
                                            <a href="javascript:void(0)" data-href="'+datahref+'" class="edit_msg">修改</a>\
                                            <img src="../wap/img/pws_275.jpg">\
                                            <div class="warp_gl_q_sg">\
                                                <b>'+title+'</b>\
                                                <span>'+msg+'</span>\
                                            </div>\
                                        </div>\
                                    </li>';
                        $("#dan").append(html);
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
//JS页面跳转
    $(function(){
        $(".edit_msg").live('click',function(){
            var href = $(this).attr('data-href');
            window.location.href =href + "?sectionCode=" + $_GET['sectionCode'];
        })
        window.addEventListener('pageshow', function(e) {
// 通过persisted属性判断是否存在 BF Cache
// alert(e.persisted);
            if (e.persisted) {
                location.reload();
            }
        });
    })