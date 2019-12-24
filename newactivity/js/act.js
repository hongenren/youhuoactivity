if(localStorage.getItem("actMsg")!=''){
   var actMsg = JSON.parse(localStorage.getItem("actMsg"));
}
    function ajax_get_date(){
        var activityCode = $_GET['activityCode'];
        var activityCode_ = activityCode.substring(activityCode.length-1, activityCode.length);
        if(activityCode_=="#"){
            activityCode = activityCode.substring(0, activityCode.length-1);
        }
        $.ajax({
            xhrFields: {
               withCredentials: true
            },
            type:"post",
            url:base_url + "html5/v1/section/findByActivityCode",
            data:JSON.stringify({"activityCode":activityCode}),
            dataType:'json',
            contentType: "application/json;charset=utf-8",
            success:function(data){
                if(data.code==0){
                    var res_data = data.data;
                    var html = ''; //html
                    var html2 = '';
                    var thisclass ='';
                    var date_list = JSON.stringify(res_data.list);
                    //$.cookie('date_list',date_list, {expires: expiresDate, path: '/' });
                    localStorage.setItem('date_list',date_list);
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
    //加载日期
    function ajax_date(){
        var date_list = '';
        if(localStorage.getItem('date_list')==''){
            layer.open({content: '加载日期失败',skin: 'msg',time: 1});
            return false;
        }
        var date_list = JSON.parse(localStorage.getItem('date_list'));
        var html = '';
        $.each(date_list,function(index,val){
            var thisclass = index==0?'thisclass':'';
                html +='<div style="cursor:pointer" class="swiper-slide '+thisclass+'">\
                        <a href="javascript:void(0)">\
							<span style="line-height: 42px;">'+val.day+'</span>\
						</a>\
                    </div>';
            });
        $('.swiper-wrapper').empty();
        $('.swiper-wrapper').html(html);

        var swiper = new Swiper('.swiper-container', {
            slidesPerView: 4,
            spaceBetween: 5,
            slidesPerGroup: 4,
            loop: false,
            loopFillGroupWithBlank: false,
            pagination: {
                el: '.swiper-pagination',
                clickable: true
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev'
            }
        });
        ajax_sections(date_list[0]['sections'],date_list[0]['day']);
    }
//加载场次
        function ajax_sections(sections,day,code=''){
            var html = '';
            var name = '';
            var index2 = '';
            $.each(sections,function(index2,val2){

                var class1 = index2==0?'thisclass':'';
                switch(val2.type){
                    case 10:
                    var name ='全天';
                    break;
                    case 20:
                    var name ='上午场';
                    break;
                    case 30:
                    var name ='下午场';
                    break;
                    case 40:
                    var name ='晚上场';
                    break;
                }
                html += '<li style="cursor:pointer" class="'+class1+'" data-date="'+day+'" data-code="'+val2.code+'" data-startTime="'+val2.startTime+'" data-endTime="'+val2.endTime+'">\
                        <span>'+name+'</span>\
                        <i></i>\
                        </li>';

            })
            $('.warp_sh_i').empty();
            $('.warp_sh_i').html(html);

    }
     //用户岗位库地址列表信息
    function user_addr_list(){
        var html = '';
        //var data1 = {"user":prjvorgMsg.prjvUserId}  html5/v1/useraddress/findByUser
        var data1 = {"orgCode":prjvorgMsg.orgThirdAccount};
        $.ajax({
                xhrFields: {
                   withCredentials: true
                },
                type:'post',
                url:base_url + "html5/v1/useraddress/findByOrgCode",
                data:JSON.stringify(data1),
                headers : {'token':token},
                dataType:'json',
                contentType: "application/json;charset=utf-8",
                beforeSend:function(XMLHttpRequest){
                    $(".warp_pws_v_sy").html("<img src='../wap/img/loading.gif' style='width:24px;heigth:24px; margin:0 auto;display:block'/>");
                },
                success:function(data){
                    if(data.code==0){
                        $.each(data.data,function(index,val){
                            html+='<li data-id="'+val.id+'" data-lat="'+val.lat+'" data-lng="'+val.lng+'" data-name="'+val.name+'" data-address="'+val.addressDetail+'">\
                                        <div>\
                                            <a style="color: #000;" href="javascript:void(0)"><b>'+val.name+'</b></a>\
                                            <a><span>'+val.addressDetail+'</span></a>\
                                        </div>\
                                        <a href="javascript:void(0)" class="warp_pws_v_sy_sc"></a>\
                                    </li>';
                        })
                        $(".warp_pws_v_sy").empty();
                        $(".warp_pws_v_sy").html(html);
                    }else{
                        layer.open({
                        content: '获取失败'
                        ,skin: 'msg'
                        ,time: 1 //2秒后自动关闭
                        });
                        return false;
                    }
                },
                error:function(e){
                    layer.open({
                    content: '获取失败'
                    ,skin: 'msg'
                    ,time: 1 //2秒后自动关闭
                    });
                    return false;
                }
            })
    }
    //添加地址库信息
    function user_addr_add(){
        var arr = $('#form3').serializeArray();
        var json = {};
        $.each(arr, function(){
            json[this.name] = this.value;
        });
        if($.trim(json.name)==''){
            layer.open({
                content: '地址名称不能为空'
                ,skin: 'msg'
                ,time: 1 //1秒后自动关闭
                });
            return false;
        }else{
            json.name = json.name+$.trim(json.addressDetail);
        }/*
        if($.trim(json.addressDetail)==''){
            layer.open({
                content: '地址详情不能为空'
                ,skin: 'msg'
                ,time: 1 //1秒后自动关闭
                });
            return false;
        }*/
        if(!prjvorgMsg.prjvUserId){
             layer.open({
                content: '登录过期,请重新登录'
                ,skin: 'msg'
                ,time: 1 //1秒后自动关闭
                });
            setTimeout(function(){window.location.href ='../login/login.html'},1000);
        }
        json['user'] = prjvorgMsg.prjvUserId;
        json['orgCode'] = prjvorgMsg.orgThirdAccount;
        $.ajax({
                xhrFields: {
                   withCredentials: true
                },
                type:'post',
                url:base_url + "html5/v1/useraddress/add",
                data:JSON.stringify(json),
                headers : {'token':token},
                dataType:'json',
                contentType: "application/json;charset=utf-8",
                beforeSend:function(XMLHttpRequest){
                    layer.open({type: 2,content: '提交中'});
                },
                success:function(data){
                    if(data.code==0){
                        var data1 = data.data;/*
                        $("input[name='name1']").val();
                        $("input[name='demo1']").val();
                        $("input[name='name']").val(json.name1);
                        $("input[name='demo']").val(json.demo1);*/
                        $("#lat").val(data1.lat);
                        $("#lng").val(data1.lng);
                        $(".address").text(data1.addressDetail);
                        $(".cnowiucioq").text(data1.name);
                        $("#job_address").val(data1.addressDetail);
                        $(".addr11").text(data1.addressDetail);
                        $("#address").val(data1.name);
                        $("#addressId").val(data1.id);
                        layer.closeAll();
                        layer.open({
                        content: '添加成功'
                        ,skin: 'msg'
                        ,time: 1 //1秒后自动关闭
                        });
                        setTimeout(function(){
                            $(".warp_ci").animate({left:"200%"});
                        },1000);
                    }else{
                        layer.closeAll();
                        layer.open({
                        content: '添加失败,请重试'
                        ,skin: 'msg'
                        ,time: 1 //1秒后自动关闭
                        });
                        return;
                    }
                },
                error:function(){
                    layer.closeAll();
                }
            })
    }
//添加地址库信息
function user_addr_add1(){
    var arr = $('#form3').serializeArray();
    var json = {};
    $.each(arr, function(){
        json[this.name] = this.value;
    });
    if($.trim(json.name)==''){
        layer.open({
            content: '地址名称不能为空'
            ,skin: 'msg'
            ,time: 1 //1秒后自动关闭
        });
        return false;
    }else{
        json.name = json.name+$.trim(json.addressDetail);
    }/*
        if($.trim(json.addressDetail)==''){
            layer.open({
                content: '地址详情不能为空'
                ,skin: 'msg'
                ,time: 1 //1秒后自动关闭
                });
            return false;
        }*/
    if(!prjvorgMsg.prjvUserId){
        layer.open({
            content: '登录过期,请重新登录'
            ,skin: 'msg'
            ,time: 1 //1秒后自动关闭
        });
        setTimeout(function(){window.location.href ='../login/login.html'},1000);
    }
    json['user'] = prjvorgMsg.prjvUserId;
    json['orgCode'] = prjvorgMsg.orgThirdAccount;
    $.ajax({
        xhrFields: {
            withCredentials: true
        },
        type:'post',
        url:base_url + "html5/v1/useraddress/add",
        data:JSON.stringify(json),
        headers : {'token':token},
        dataType:'json',
        contentType: "application/json;charset=utf-8",
        beforeSend:function(XMLHttpRequest){
            layer.open({type: 2,content: '提交中'});
        },
        success:function(data){
            if(data.code==0){
                var data1 = data.data;
                $('.addr11').parent().find("#lat").val(data1.lat);
                $('.addr11').parent().find("#lng").val(data1.lng);
                $('.addr11').parent().find(".cnowiucioq").text(data1.name);
                $('.addr11').parent().find("#address").val(data1.name);
                layer.closeAll();
                layer.open({
                    content: '添加成功'
                    ,skin: 'msg'
                    ,time: 1 //1秒后自动关闭
                });
                setTimeout(function(){
                    $(".warp_ci").animate({left:"200%"});
                },1000);
            }else{
                layer.closeAll();
                layer.open({
                    content: '添加失败,请重试'
                    ,skin: 'msg'
                    ,time: 1 //1秒后自动关闭
                });
                return;
            }
        },
        error:function(){
            layer.closeAll();
        }
    })
}
function punch_range(){
    $('.warp_punch').load('./act_punch_range.html');
    $(".warp_punch").animate({left:"0"})
}
    $(function(){
        //打卡范围相关
        $("#warp_dk").live('click',function(){
            $('.warp_punch').load('./act_punch_range.html');
            $(".warp_punch").animate({left:"0"})
        })
        $("#yes").live('click',function(){
            var num = $('#punch_num').text();
            $("input[name='radius']").val(num);
            $(".mb").hide()
            $(".dkfwtc").hide()
        })
        //地址相关
        $(".warp_pws_v_si").live('click',function(){
            user_addr_add();
        })
        //点击地址库加载地址
        $(".warp_pws_v_so .address_name").live('click',function(){
			       $(this).children('input').attr("readonly",true);
             $(".warp_ifrem").load('./act_addr_map.html')
             $(".warp_ifrem").fadeIn();
        })
        //删除
        $(".warp_pws_v_sy_sc").live('click',function(){
            var id = $(this).parent().attr('data-id');
            layer.open({
            content: '您确定要这么做么？'
                ,btn: ['确定', '取消']
                ,yes: function(index){
                    $.ajax({
                        xhrFields: {
                           withCredentials: true
                        },
                        type:'post',
                        url:base_url + "html5/v1/useraddress/remove",
                        data:JSON.stringify({"id":id}),
                        headers : {'token':token},
                        dataType:'json',
                        contentType: "application/json;charset=utf-8",
                        success:function(data){
                            if(data.code==0){
                                layer.open({content:'删除成功',skin: 'msg',time: 1});
                                user_addr_list();
                            }else{
                                layer.open({content:data.msg,skin: 'msg',time: 1});
                                return false;
                            }

                        },
                        error:function(e){
                            layer.open({content:'网络错误',skin: 'msg',time: 1});
                                return false;
                        }
                    })
                }
            })

        })
    })
    function get_district_msg(parent,class1){
        var html = '';
        $.ajax({
            xhrFields: {
               withCredentials: true
            },
            type:'post',
            url:base_url + "html5/v1/region/findByParent",
            data:JSON.stringify({"parent":parent}),
            headers : {'token':token},
            dataType:'json',
            contentType: "application/json;charset=utf-8",
            success:function(data){
                if(data.code==0){
                    var data1 = data.data;
                    html += '<option value="">请选择</option>';
                    $.each(data1,function(index,val){
                        html += '<option data-id="'+val.id+'"value="'+val.name+'" data-code="'+val.areaCode+'">'+val.name+'</option>';
                    })
                    $(class1).empty();
                    $(class1).html(html);
                }else{
                    layer.open({content:data.msg,skin: 'msg',time: 1});
                    return false;
                }
            },
            error:function(e){
                layer.open({content:'获取失败',skin: 'msg',time: 1});
                return false;

            }
        })
    }
    $(function(){
        $('.district').live('change',function(){
            var val = $(this).find("option:selected").attr('data-id');
            $("input[name='adCode']").val($(this).find("option:selected").attr('data-code'));
            get_district_msg(val,'.street');
        })
        $('.street').live('change',function(){
            var val = $(this).find("option:selected").attr('data-id');
            $("input[name='adCode']").val($(this).find("option:selected").attr('data-code'));
            get_district_msg(val,'.village');
        })
        $('.village').live('change',function(){
            $("input[name='adCode']").val($(this).find("option:selected").attr('data-code'));
        })
    })
    $(function(){
        $('.warp_gl_u_su').live('click',function(){
            var html = "";
            var searchContent = $("input[name='searchContent']").val();//(".warp_gl_u_sy").val();
            var pageSize = 1;
            var pageNumber = 1;
            var prjvOrgId = prjvorgMsg.prjvOrgId;//100020; //测试的 正式用  prjvorgMsg.prjvUserId
            if(searchContent==''){
                layer.open({content:'请输入姓名或者手机号',skin: 'msg',time: 1});
                return false;
            }
            var str = {"prjvOrgId":prjvOrgId,"searchContent":searchContent,"pageSize":pageSize,"pageNumber":pageNumber};
            queryList(str,1);
        })
         //移除
        $("#glry_tj li i").live('click',function(){
            $(this).parent().remove();
        })
        $("#orgAddrSub").live('click',function(){
            member_list_html = $("#glry_tj").html();
            var arr =$("#formOrgAdd").serializeArray();
            var html = appendOrgAddr(arr);
            $("#per_old").empty();
            $("#per_old").append(html);
            $(".member_list").animate({left: "100%" });
        })
    })
    function add_glry_txl(){
        $("#glry_tj").html(member_list_html);
        //通讯录信息追加到 已添加
        $("#glry_txl li u").live('click',function(){
            var realName = $(this).parent().find("input[name='realName']").val();
            var mobile = $(this).parent().find("input[name='mobile']").val();
            var prjvUserId = $(this).parent().find("input[name='prjvUserId']").val();
            var headUrl = $(this).parent().find("input[name='headUrl']").val();
            var str = [{"realName":realName,"mobile":mobile,"prjvUserId":prjvUserId,"headUrl":headUrl}];
            var html = readHtml(str);
            var prjvUserIdReadName = $("input[name='prjvUserIdRead']");
            var prjvUser = true
            if(prjvUserIdReadName.length!=0){
                prjvUserIdReadName.each(function(i, obj){
                    if($(obj).val()==prjvUserId){
                        prjvUser = false;
                    }
                });
            }
            if(prjvUser==true){
                $("#glry_tj").append(html);
            }
        })
    }