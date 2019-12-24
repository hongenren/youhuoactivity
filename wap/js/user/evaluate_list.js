 //管理员的评论 和自己的评论
    function get_evaluate_list(pageNumber=1,pageSize=3,type=10){
        var json = JSON.stringify({"pageNumber":pageNumber,"pageSize": pageSize,"prjvUserId":user_msg.userId,"type": type});
        $.ajax({
            xhrFields: {
               withCredentials: true
            },
            type:"post",
            url:base_url + "html5/v1/activityEvaluate/selectByPrjvUserIdAndType",
            data:json,
            headers : {'token':token},
            dataType:'json',
            contentType: "application/json;charset=utf-8",
            beforeSend:function(XMLHttpRequest){   
                $(".warp_gl_w_si").html("<img src='../wap/img/loading.gif' style='width:24px;heigth:24px; margin:0 auto;display:block'/>");
            },
            success:function(data){
                if(data.code==0){
                    var data1 = data.data.records;
                    //console.log(data1);
                    evaluate_html(data1,type);
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
// 评价信息加载 html
    function evaluate_html(data,type){
        var html = '';
        $.each(data,function(index,val){
            html += ' <li class="warp_gl_w_su">\
                                    <div class="warp_gl_w_sy">';
                        var img = "", morenimg = "", name = ""
                        if(type==10){
                            img = val.headImg;
                            morenimg = "../wap/img/pws_244.png";
                            name = val.nickName;
                        }else{
                            img = val.orgImges;
                            morenimg = "../wap/img/jg_tp_4.png";
                            name = val.orgName;
                        }
                        if(img==null || img==undefined || img==""){
                            html += '<img src="'+morenimg+'" style="background-color: #72B81E;" class="warp_gl_w_sy_ig">';
                        }else{
                            html += '<img src="'+img+'" class="warp_gl_w_sy_ig">';
                        }                   
                            html +=     '<div class="warp_gl_w_st">\
                                            <div class="warp_gl_w_sr">\
                                                <i>'+val.createTime+'</i>';
                        if(name==null || name==undefined || name==""){
                            html += '<span></span>';
                        }                        
                            html += '<span>'+name+'</span>';
                        if(type==20 && val.prjvUserName!=""){
                            html += '<br /><span>对'+val.prjvUserName+'的评价</span>';
                        }
                        html  +=         '</div>\
                                            <div class="warp_gl_w_se">';
                        for (var i = 0; i < val.star; i++) {
                            html  += '<img src="../wap/img/pws_267.png">';
                        };
                        for (var i = 0; i < (5-val.star); i++) {
                            html  += '<img src="../wap/img/pws_266.png">';
                        };                        
                        html  +=    '</div>\
                                        </div>\
                                    </div>\
                                    <div class="warp_gl_w_sw">';
                        if(val.content==''){
                            html += '<span></span>';
                        }else{
                            html += '<span>'+val.content+'</span>'
                        }
                        html += '</div>\
                                    <div class="exc2">\
                                        <div class="list">\
                                            <ul>';
                        if(val.imgs!=''){
                            var imgs = val.imgs.split(',');
                            for (var i = 0; i < imgs.length; i++) {
                                if(imgs[i]!=''){
                                    html += '<li style="width: 30%;"><a href="javascript:void(0)"><img name="evaluateImgs" style="" src="'+imgs[i]+'"></a></li>';
                                }   
                            };
                        }
                            html +=     '</ul>\
                                        </div>\
                                    </div>\
                                    <div class="warp_gl_w_sq">\
                                        <span>来自【'+val.activityName+'】评价</span>\
                                    </div>\
                                    <ul class="warp_gl_w_sl">';
                            if(type==10){
                                html +=    '<li class="warp_gl_w_sl_1" val-star="'+val.star+'" val-imgs="'+val.imgs+'" val-id="'+val.id+'" val-ticketCode="'+val.ticketCode+'" val-content="'+val.content+'">\
                                                <a href="javascript:void(0)"><img src="../wap/img/pws_271.png">修改评价</a>\
                                            </li>\
                                            <li class="warp_gl_w_sl_2">\
                                                    <a href="javascript:void(0)" data-id="'+val.id+'"><img src="../wap/img/pws_272.png">删除</a>\
                                            </li>';
                            }else{
                                html +=    '<li class="warp_gl_w_sl_3" val-star="'+val.star+'" val-imgs="'+val.imgs+'" val-id="'+val.id+'" val-ticketCode="'+val.ticketCode+'" val-content="'+val.content+'">\
                                                <a href="javascript:void(0)"><img src="../wap/img/pws_271.png">回复</a>\
                                            </li>';
                            }
                        var replyList = val.replyList;
                        for (var i = 0; i < replyList.length; i++) {
                            if(replyList[i].headImg==null || replyList[i].headImg==undefined || replyList[i].headImg==""){
                                if(type==10){
                                    replyList[i].headImg = "<img src=\"../wap/img/pws_244.png\">";
                                }else{
                                    replyList[i].headImg = "<img src=\"../wap/img/jg_tp_4.png\" style=\"background-color: #72B81E;\">";
                                }
                            }else{
                                replyList[i].headImg = "<img src=\""+replyList[i].headImg+"\">";
                            }
                            html +=   '<div class="warp_gl_w_sk">\
                                                                '+replyList[i].headImg+'\
                                                                <div class="warp_gl_w_sj">\
                                                                    <div class="warp_gl_w_sh">\
                                                                        <i>'+replyList[i].createTime+'</i>\
                                                                        <span>'+replyList[i].prjvUserName+'</span>\
                                                                    </div>\
                                                                    <div class="warp_gl_w_sg">\
                                                                        <span>'+replyList[i].content+'</span>\
                                                                    </div>\
                                                                </div>\
                                                            </div>';
                        }
                        html +=   '</ul></li>';
        })
        $(".warp_gl_w_si").empty(html);
        $(".warp_gl_w_si").append(html);
        $("img[name='evaluateImgs']").each(function(i){
            $(this).height($(this).width());
            $(this).attr("src", $(this).attr("src")+"?x-oss-process=image/resize,m_pad,h_"+$(this).width()+",w_"+$(this).width()+",color_FFFFFF");
        })
    }
    $(function(){
        $('.warp_gl_w_sp li').click(function(){
            var val = $(this).val();
            $('.warp_gl_w_so').hide();
            $('.warp_gl_w_so').eq($(this).index()).show();
            $(this).addClass("thisclass").siblings().removeClass("thisclass");
            if(val==10){
                get_evaluate_list(1,3,10);
            }else if(val==20){
                get_evaluate_list(1,3,20);
            }else{

            }
        });
        $(".warp_gl_w_sl_1 a").live("click",function(){
            //console.log($(this).parent().attr('val-id'));
            $("input[name='id']").val($(this).parent().attr('val-id'));
            $("input[name='ticketCode']").val($(this).parent().attr('val-ticketCode'));
            $("input[name='star']").val($(this).parent().attr('val-star'));
            $("input[name='imgs']").val($(this).parent().attr('val-imgs'));
            $("#content").val($(this).parent().attr('val-content'));
            $("#xiugai").fadeIn();
        });
        $(".chance").live("click",function(){
            $("#xiugai").fadeOut();
            $("#huifu").fadeOut();
        })
        $(".sub").live("click",function(){
            var id = parseInt($("input[name='id']").val());
            var ticketCode = $("input[name='ticketCode']").val();
            var star = $("input[name='star']").val();
            var imgs = $("input[name='imgs']").val();
            var content = $.trim($("#content").val());
            var str = JSON.stringify({"id":id,"ticketCode":ticketCode,"star":parseInt(star),"imgs":imgs,"content":content,"prjvUserId":user_msg.userId});
            $.ajax({
                    xhrFields: {
                       withCredentials: true
                    },
                    type:"post",
                    url:base_url + "html5/v1/activityEvaluate/updateActivityEvaluate",
                    data:str,
                    headers : {'token':token},
                    dataType:'json',
                    contentType: "application/json;charset=utf-8",
                    success:function(data){
                        if(data.code==0){
                            layer.open({
                                content: '修改成功'
                                ,skin: 'msg'
                                ,time: 1 //2秒后自动关闭
                            });
                            setTimeout(function(){window.location.href ='./evaluate_list.html'},1000);
                        }else{
                            layer.open({
                                content: data.msg
                                ,skin: 'msg'
                                ,time: 1 //2秒后自动关闭
                            });
                        }
                       
                    },
                    error:function(e){
                        layer.open({
                            content: '网络错误'
                            ,skin: 'msg'
                            ,time: 1 //2秒后自动关闭
                        });
                        return false;
                    }
            })
        })
        $(".subhuifu").live("click",function(){
            var id = parseInt($("input[name='id']").val());
            var content = $.trim($("#contenthuifu").val());
            var str = JSON.stringify({"activityEvaluateId":id,"prjvUserId":user_msg.userId,"prjvUserName":"","nickName":user_msg.userNickName,"headImg":user_msg.userHeadImg,"content":content,"type":10});
            $.ajax({
                xhrFields: {
                    withCredentials: true
                },
                type:"post",
                url:base_url + "html5/v1/activityEvaluate/saveReply",
                data:str,
                headers : {'token':token},
                dataType:'json',
                contentType: "application/json;charset=utf-8",
                success:function(data){
                    if(data.code==0){
                        layer.open({
                            content: '回复成功'
                            ,skin: 'msg'
                            ,time: 1 //2秒后自动关闭
                        });
                        $("#huifu").fadeOut();
                        //setTimeout(function(){window.location.href ='./evaluate_list.html'},1000);
                    }else{
                        layer.open({
                            content: data.msg
                            ,skin: 'msg'
                            ,time: 1 //2秒后自动关闭
                        });
                    }

                },
                error:function(e){
                    layer.open({
                        content: '网络错误'
                        ,skin: 'msg'
                        ,time: 1 //2秒后自动关闭
                    });
                    return false;
                }
            })
        })
        // $(".warp_gl_w_sm a").live("click",function(){
        //     $(".warp_gl_w_sf").fadeOut();
        // });
        $(".warp_gl_w_sb span").live("click",function(){
            $(".warp_gl_y_sw").fadeIn();
        });
        $(".warp_gl_y_sl li").live("click",function(){
             $(this).addClass("thisclass").siblings().removeClass("thisclass");
            $(".warp_gl_y_sw").fadeOut();
        });
        
        $(".exc1 a").touchTouch();
        $(".exc2 .list").each(function(){
            $(this).find("a").touchTouch();
        });
        //删除
        $(".warp_gl_w_sl_2 a").live("click",function(){
            var id = $(this).attr('data-id');
            var data = {"id":id};
            console.log(id);
            layer.open({
            content: '您确定要这么做么？'
                ,btn: ['确定', '取消']
                ,yes: function(index){    
                    $.ajax({
                        xhrFields: {
                           withCredentials: true
                        },
                        type:"post",
                        url:base_url + "html5/v1/activityEvaluate/delByAdmin",
                        data:JSON.stringify(data),
                        headers : {'token':token},
                        dataType:'json',
                        contentType: "application/json;charset=utf-8",
                        success:function(data){
                            if(data.code==0){
                                layer.open({content: '删除成功',skin: 'msg',time: 1});
                                setTimeout(function(){location.reload();},1000);
                            }else{
                                layer.open({
                                content: '网络错误'
                                ,skin: 'msg'
                                ,time: 1 //2秒后自动关闭
                                });
                                return false; 
                            }
                        },
                        error:function(e){
                            layer.open({
                                content: '网络错误'
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
        //回复
        $(".warp_gl_w_sl_3 a").live("click",function(){
            //console.log($(this).parent().attr('val-id'));
            $("input[name='id']").val($(this).parent().attr('val-id'));
            $(".subhuifu").fadeIn();
            $("#huifu").fadeIn();
        });
    });
