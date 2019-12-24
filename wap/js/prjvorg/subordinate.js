    console.log(token);
    $(document).ready(function(){
        $('.warp_zy_l li').click(function(){
            $('.warp_zy_k_sp').hide();
            $('.warp_zy_k_sp').eq($(this).index()).show()
        });
    });
    $(function(){
        var cotrs = $(".warp_zy_l li");
        cotrs.click(function(){
            if($(this).index()==0){
                get_sub_org_msg(10);
            }else{
                get_sub_org_msg(20);
            }
            $(this).addClass("thisclass").siblings().removeClass("thisclass");
        });
    });
    $(function(){
        $(".warp_zy_k_st").live('click',function(){
            var id = $(this).parent().attr('data-val');
            $('#userid').val(id);
            $(".warp_zy_k_sr").fadeIn();
        })

        // $(".warp_zy_k_sj").live('click',function(){
        //     $(".warp_zy_k_sr").fadeOut();
        // })
    });
    //获取审核信息
    function get_sub_org_msg(state=10){
        var html = '';
    	$.ajax({
            xhrFields: {
               withCredentials: true
            },
            type:"post",
            url:base_url + "html5/v1/orgPlace/querySubOrgByParentAccountWithState",
            data:JSON.stringify({"parentOrgThirdAccount":prjvorgMsg.orgThirdAccount,"state":state}),
            dataType:'json',
            headers : {'token':token},
            contentType: "application/json;charset=utf-8",
            success:function(data){
                //console.log(data);
                if(data.code==0){
                    var data1 = data.data.records;
                    if(state==10){
                        html += org_list(data1);
                    }else{
                        html += ready_org_list(data1);
                    }
                    $("#state"+state).html(html);
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
    //审核子机构信息
    function verifySubOrg(obj){
        var id = parseInt($(obj).parent().attr("data-val"));
        var state = parseInt($(obj).attr("data-val"));
        var data = {"id":id,"verifyUser":prjvorgMsg.orgThirdAccount,"state":state};
        //console.log(JSON.stringify(data));
        layer.open({
            content: '您确定要这么做么？'
                ,btn: ['确定', '取消']
                ,yes: function(index){
                    $.ajax({
                        xhrFields: {
                           withCredentials: true
                        },
                        type:"post",
                        url:base_url + "html5/v1/orgPlace/verifySubOrg",
                        data:JSON.stringify(data),
                        dataType:'json',
                        headers : {'token':token},
                        contentType: "application/json;charset=utf-8",
                        beforeSend:function(mes){
                            layer.open({type: 2,content: '操作中，请稍后。'});
                        },
                        success:function(data){
                            layer.closeAll();
                            //console.log(data);
                            if(data.code==0){
                                layer.open({content: '审核成功',skin: 'msg',time: 1});
                                setTimeout(function(){window.location.reload();},1000);
                                $(".warp_zy_k_sr").fadeOut();
                            }else{
                                layer.open({content: data.msg,skin: 'msg',time: 1});
                                setTimeout(function(){window.location.reload();},1000);
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
                layer.close(index);
                }
        })
    }
    //变更联系人
    function changeSubOrgContact(){
        var id = $("#userid").val();
        var contactName = $.trim($("input[name='contactName']").val());
        var contactMobile = $.trim($("input[name='contactMobile']").val());
        if(contactName==''){
            layer.open({content: '请填写变更人姓名',skin: 'msg',time: 1 });
            return false;
        }
        if(contactMobile==''){
            layer.open({content: '请填写变更人手机',skin: 'msg',time: 1 });
            return false;
        }
        $.ajax({
            xhrFields: {
               withCredentials: true
            },
            type:"post",
            url:base_url + "html5/v1/orgPlace/changeSubOrgContact",
            data:JSON.stringify({"id":id,"contactName":contactName,"contactMobile":contactMobile}),
            dataType:'json',
            headers : {'token':token},
            contentType: "application/json;charset=utf-8",
            success:function(data){
                console.log(data);
                if(data.code==0){
                        layer.open({content: '修改成功',skin: 'msg',time: 1});
                        setTimeout(function(){location.reload;},1000);
                    }else{
                        layer.open({content: data.msg,skin: 'msg',time: 1});
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
    //待审核列表 html
    function org_list(data){
        html = '';
        $.each(data,function(index,val){
            html +='<li>\
                    <div class="warp_zy_k_su">\
                        <b>申请团体名称：'+val.orgThirdAccountName+'</b>\
                        <span>申请人姓名：<a href="tel:'+val.personFirstAccountMobile+'">'+val.personFirstAccountName+'</a></span>\
                        <span>申请人手机：'+val.personFirstAccountMobile+'</span>\
                        <span>申请时间：'+val.createTime+'</span>\
                    </div>\
                    <div class="warp_zy_k_sy" data-val="'+val.id+'">\
                        <a href="javascript:void(0)" class="verifySubOrg" data-val="20" onclick="verifySubOrg(this)">同意</a>\
                        <a href="javascript:void(0)" class="verifySubOrg" data-val="-10" onclick="verifySubOrg(this)">拒绝</a>\
                    </div>\
                </li>';
        });
        return html;
    }
    //已审核列表
    function ready_org_list(data){
        html = '';
        $.each(data,function(index,val){
            html +='<li>\
                        <div class="warp_zy_k_su">\
                            <b>下属团体名称：'+val.orgThirdAccountName+'</b>\
                            <span>管理员姓名：'+val.personFirstAccountName+'</span>\
                            <span>管理员手机：<a href="tel:'+val.personFirstAccountMobile+'">'+val.personFirstAccountMobile+'</a></span>\
                        </div>\
                        <div class="warp_zy_k_sy" data-val="'+val.id+'">\
                        </div>\
                    </li>';
        //<a href="javascript:void(0)" class="warp_zy_k_st">变更联系人</a>
        });
        return html;
    }
//     function verifySubOrg(){
       
//     }
// console.log(prjvorgMsg);

