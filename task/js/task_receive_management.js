var trmAdoptEvent=function(obj,type){
    var id=$(obj).parents('.tped_buttons').attr('data-id');
    var dataJson={
        "id":id,
        "state":type
    };
    $.ajax({
        xhrFields: {
            withCredentials: true
        },
        type: 'post',
        url: base_url + "html5/v1/newTask/auditChangeApply",
        data: JSON.stringify(dataJson),
        dataType: 'json',
        headers: {'token': token},
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (data.code == 0) {
                var auditTxt='通过成功';
                if(type==-10){
                    auditTxt='拒绝成功'
                }
                layer.open({
                    content: auditTxt
                    ,skin: 'msg'
                    ,time: 2
                });
                setTimeout(function(){
                    $(".trm_personal_examine_wrap").hide();
                    if($(".tsm_box_btnA").hasClass('on')){
                        queryPostByOrgCode(0,10);
                    }else if($(".tsm_box_btnB").hasClass('on')){
                        queryPostByOrgCode(0,20);
                    }
                },2000)
            }else{
                layer.open({
                    content: data.msg
                    ,skin: 'msg'
                    ,time: 1
                });
            }
        },
        error:function(e){
            layer.open({
                content: '获取失败'
                ,skin: 'msg'
                ,time: 1
            });
        }
    })
};
var setChangeApply=function(obj){
    var objs=JSON.parse(obj);
    var receiverObj='';
    console.log(objs);
    if(objs.type==10){
        receiverObj='<div class="tped_user"><strong>接收人:</strong><a href="javascript:void(0)"><span>'+objs.receiverNickName+' <i class="tped_tell_icon"></i></span></a></div>\n'
    }
    var di='<div class="tped_user"><strong>申请人:</strong><a href="javascript:void(0)"><span>'+objs.applyNickName+' <i class="tped_tell_icon"></i></span></a></div>\n' +
        receiverObj+
        '        <div class="tped_user"><strong>转接日期:</strong><span>'+objs.createTime+'</span></div>\n' +
        '        <div class="tped_user"><strong>申请原因:</strong>'+objs.reason+'</div>\n' +
        '        <div class="tped_buttons" data-id="'+objs.id+'"><button onclick="trmAdoptEvent(this,20)">通过</button><button onclick="trmAdoptEvent(this,-10)" class="on">拒绝</button></div>'

    $(".trm_personal_examine_detail").html(di);
    $(".trm_personal_examine_wrap").show();
};
var queryChangeApply=function(obj){
    var objs=JSON.parse(decodeURI($(obj).attr('data-json')));
    var dataJson={
        "type":objs.type,
        "ticket":objs.ticket
    };
    $.ajax({
        xhrFields: {
            withCredentials: true
        },
        type: 'post',
        url: base_url + "html5/v1/newTask/queryChangeApply",
        data: JSON.stringify(dataJson),
        dataType: 'json',
        headers: {'token': token},
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (data.code == 0) {
                setChangeApply(JSON.stringify(objs))

            }else{
                layer.open({
                    content: data.msg
                    ,skin: 'msg'
                    ,time: 1
                });
            }
        },
        error:function(e){
            layer.open({
                content: '获取失败'
                ,skin: 'msg'
                ,time: 1
            });
        }
    })
};
function queryPostByOrgCode(pageNumber, type){
    var dataJson = {};
    // dataJson.user = prjvorgMsg.integralAccount;
    dataJson.subCode = $.getUrlParam('pkPostCode');
    dataJson.type = type;
    $(".tsm_personal_list_wrap").empty();
    layer.open({type: 2});
    $('#content').dropload({
        scrollArea: window,
        loadDownFn: function (me) {
            $(".dropload-down").remove();
            pageNumber++;
            dataJson.pageNumber=pageNumber;
            dataJson.pageSize=20;
            $.ajax({
                xhrFields: {
                    withCredentials: true
                },
                type: 'post',
                url: base_url + "html5/v1/newTask/ticketChangeList",
                data: JSON.stringify(dataJson),
                dataType: 'json',
                headers: {'token': token},
                contentType: "application/json;charset=utf-8",
                success: function (data) {
                    if (data.code == 0) {
                        var data_index = data.data.records;
                        var html = "";
                        if(data_index.length>0) {
                            $.each(data_index, function (k, val) {


                                var applyNickName=val.applyNickName;
                                var applyMobile=val.applyMobile;
                                var applyHeadImg=val.applyHeadImg==''?'../wap/img/pws_27.jpg':val.applyHeadImg;

                                //接收者
                                var receiverNickName=val.receiverNickName;
                                var receiverMobile=val.receiverMobile;
                                var receiverHeadImg=val.receiverHeadImg==''?'../wap/img/pws_27.jpg':val.receiverHeadImg;
                                var detailJson={
                                    "type":type,
                                    "ticket":val.ticket,
                                    "applyNickName":applyNickName,
                                    "applyMobile":applyMobile,
                                    "receiverNickName":receiverNickName,
                                    "receiverMobile":receiverMobile,
                                    "reason":val.reason,
                                    "createTime":val.createTime,
                                    "id":val.id
                                };
                                if(type==20){
                                    receiverNickName=applyNickName;
                                    receiverHeadImg=applyHeadImg;
                                }

                                html+='<div class="tsm_personal_list clearfix">\n' +
                                    '            <!--<div class="tem_enroll_radios"></div>-->\n' +
                                    '            <div class="tsm_personal_user" style="background-image:url(\''+receiverHeadImg+'\')"></div>\n' +
                                    '            <div class="tsm_personal_name">'+receiverNickName+'</div>\n' +
                                    '            <div class="trm_personal_detail" data-json="'+encodeURI(JSON.stringify(detailJson))+'" onclick="queryChangeApply(this)">查看详情 <i></i></div>\n' +
                                    '        </div>'
                            });

                            $(".noneLi").hide();
                            $(".tsm_personal_list_wrap").append(html);
                            me.resetload();
                        }else{
                            $(".noneLi").hide();
                            $(".tsm_personal_list_wrap").append(
                                "<div class='noneLi' style='text-align:center;line-height:50px;'>\
                                    <a href='javascript:void(0)'>\
                                    <h3 style='text-align: center;'>已经没有更多啦。。。</h3>\
                                    </a>\
                                </div>");
                            me.lock();
                            me.noData();//无数据重置
                            me.resetload();
                        }
                    }else{
                        layer.open({
                            content: data.msg
                            ,skin: 'msg'
                            ,time: 1
                        });
                        me.lock();
                        me.noData();
                    }
                },
                error:function(e){
                    layer.open({
                        content: '获取失败'
                        ,skin: 'msg'
                        ,time: 1
                    });
                    me.lock();
                    me.noData();//无数据重置
                    me.resetload();
                },
                complete:function(){
                    setTimeout(function(){
                        layer.closeAll()
                    },500);

                }

            })
        }
    })
}
