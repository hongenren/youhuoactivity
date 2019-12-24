function queryQuitByOrgCode(type){
    url = "html5/v1/station/unitPost/queryQuitByOrgCode";
    if(type==20){
        var url = "html5/v1/station/unitPostReplace/waitAuditList";
    }
    $.ajax({
        xhrFields: {
            withCredentials: true
        },
        type:"post",
        url:base_url + url,
        data:JSON.stringify({"orgCode":prjvorgMsg.orgThirdAccount, "pageNumber":1, "pageSize":20}),
        headers : {'token':token},
        dataType:'json',
        contentType: "application/json;charset=utf-8",
        success:function(data){
            if(data.code==0){
                var data_list=data.data.records;
                if(data_list.length>0){
                    if(type==20){//顶岗
                        $.each(data_list,function(index,val){
                            $('.warp_pws_g').append("<li>\
                                        <a href=\"./matters_detail.html?code="+val.code+"&type=20\">\
                                            <b>"+val.applyNickName+"</b>\
                                            <b style='float: right;'>"+val.day+"</b>\
                                        </a>\
                                    </li>");
                        })
                    }else{//退出
                        $.each(data_list,function(index,val){
                            $('.warp_pws_g').append("<li>\
                                        <a href=\"./matters_detail.html?code="+val.code+"&type=10\">\
                                            <b>"+val.nickName+"</b>\
                                            <b style='float: right;'>"+val.day+"</b>\
                                        </a>\
                                    </li>");
                        })
                    }
                }else{
                    $(".noneLi").hide();
                    $(".warp_pws_g").append(
                        "<li class='noneLi' style=''>\
                            <a href='javascript:void(0)' style='background: none;'>\
                            <h3 style='text-align: center;'>已经没有更多啦。。。</h3>\
                            </a>\
                        </li>");
                }
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
                content: '登录失败'
                ,skin: 'msg'
                ,time: 1 //2秒后自动关闭
            });
            return false;
        }
    })
}