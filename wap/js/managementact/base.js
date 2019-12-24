//加载机构积分
get_prjvorg_msg();
    function get_prjvorg_msg(){
        //console.log(prjvorgMsg.prjvOrgId);
         $.ajax({
                xhrFields: {
                   withCredentials: true
                },
                type:'post',
                url:base_url + "html5/v1/orgPlace/queryOrgByPrjvOrgId",
                data:JSON.stringify({"prjvOrgId":prjvorgMsg.prjvOrgId}),
                headers : {'token':token},
                dataType:'json',
                contentType: "application/json;charset=utf-8",
                beforeSend:function(XMLHttpRequest){
                    $(".warp_pws_v_sy").html("<img src='../wap/img/loading.gif' style='width:24px;heigth:24px; margin:0 auto;display:block'/>");
                },
                success:function(data){
                    if(data.code==0){
                        var data1 = data.data;
                        $(".warp_pws_c_si i").html(data1.integral);
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
                    content: '网络错误'
                    ,skin: 'msg'
                    ,time: 1 //2秒后自动关闭
                    });
                    return false;
                }   
            })
    }