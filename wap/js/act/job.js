    // var user_msg = '';
    // var token = '';
    // var user_msg = JSON.parse($.cookie('user_msg'));
    // var token = $.cookie('token');
    //console.log(token);
    //加载岗位信息
        function ajax_job_list(arr){
            var html ='';
            var data_list = '';
            $.ajax({
                xhrFields: {
                   withCredentials: true
                },
                type:'post',
                url:base_url + "html5/v1/recruit/findBySectionCode",
                data:JSON.stringify({"sectionCode":arr.code}),
                dataType:'json',
                contentType: "application/json;charset=utf-8",
                beforeSend:function(XMLHttpRequest){
                    $(".warp_sh_u").html("<img src='../wap/img/loading.gif' style='width:24px;heigth:24px; margin:0 auto;display:block'/>");
                },
                success:function(data){
                    console.log(data);
                    if(data.code==0){
                        data_list = data.data;
                        html += '<li>\
                                    <div class="warp_sh_u_lp">\
                                        <span>'+arr.date1+arr.set+'岗位列表</span>\
                                    </div>\
                                    <div class="warp_sh_u_lo">';
                        $.each(data_list,function(index,val){
                            requirementsNumber += parseInt(val.total);
                            html +='<div>\
                                        <a class="msg_sm" data-code="'+val.code+'" href="javascript:void(0)">\
                                        <span>需要'+val.total+'人</span>\
                                        <b><i>*</i>'+val.name+'</b>\
                                        </a>\
                                    </div>';    
                        })
                        //console.log('js111'+arr.code);
                        if(localStorage.getItem('job_'+arr.code)==1){
                            html += '</div>\
                                </li>';
                           $("#setover").attr('data-code',arr.code).attr('value','已设置').attr("onclick",'');
                        }else{
                            html += '</div>\
                                    <a href="./act_job_add.html?activityCode='+$_GET["activityCode"]+'&sectionCode='+arr.code+'&day='+arr.date1+'&starttime='+arr.starttime+'&endtime='+arr.endtime+'" class="warp_sh_u_li"><i>+</i>增加岗位</a>\
                                </li>';
                           $("#setover").attr('data-code',arr.code).attr('value','本场次设置完成').attr("onclick",'setOver()');
                        }
                        $(".warp_sh_u").empty();        
                        $(".warp_sh_u").html(html);
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
  //添加岗位
    function userpost_add(){
        var arr = $('#form2').serializeArray();
        var json = {};
        $.each(arr, function(){
            json[this.name] = this.value;
        });
        if(!prjvorgMsg.prjvUserId){
             layer.open({
                content: '登录过期,请重新登录'
                ,skin: 'msg'
                ,time: 1 //1秒后自动关闭
                });  
            setTimeout(function(){window.location.href ='../login/login.html'},1000);
        }
        if($.trim(json.add_name)==''){
            layer.open({
                content: '岗位名称不能为空'
                ,skin: 'msg'
                ,time: 1 //1秒后自动关闭
                });
            return false;  
        }
        if($.trim(json.add_demo)==''){
            layer.open({
                content: '岗位描述不能为空'
                ,skin: 'msg'
                ,time: 1 //1秒后自动关闭
                });
            return false;
        }
        json['name'] = json.add_name;
        json['demo'] = json.add_demo;
        json['user'] = prjvorgMsg.prjvUserId;
        delete json.add_name;
        delete json.add_demo; //移除
        $.ajax({
                xhrFields: {
                   withCredentials: true
                },
                type:'post',
                url:base_url + "html5/v1/activity/addUserPost",
                data:JSON.stringify(json),
                headers : {'token':token},
                dataType:'json',
                contentType: "application/json;charset=utf-8",
                beforeSend:function(XMLHttpRequest){
                    $(".warp_sh_u").html("<img src='../wap/img/loading.gif' style='width:24px;heigth:24px; margin:0 auto;display:block'/>");
                },
                success:function(data){
                    if(data.code==0){
                        //$("input[name='name1']").val();
                        //$("input[name='demo1']").val();
                        $("input[name='name']").val(json['name']);
                        $("input[name='demo']").val(json['demo']);
                        layer.open({
                        content: '添加成功'
                        ,skin: 'msg'
                        ,time: 1 //1秒后自动关闭
                        });
                        setTimeout(function(){
                            $(".warp_pws_x").animate({right:"-100%"});
                        },1000);
                    }else{
                        layer.open({
                        content: data.msg
                        ,skin: 'msg'
                        ,time: 1 //1秒后自动关闭
                        });  
                    }
                },
                error:function(){
                    layer.open({
                        content: '网络错误，请重试'
                        ,skin: 'msg'
                        ,time: 1 //1秒后自动关闭
                        });  
                }
            })
    }
    //查询岗位信息
    function userpost_list(){
        var html = '';
         $.ajax({
                xhrFields: {
                   withCredentials: true
                },
                type:'post',
                url:base_url + "html5/v1/activity/findUserPostByUser",
                data:JSON.stringify({"user":prjvorgMsg.prjvUserId}),
                headers : {'token':token},
                dataType:'json',
                contentType: "application/json;charset=utf-8",
                beforeSend:function(XMLHttpRequest){
                    $(".warp_pws_x_sp").html("<img src='../wap/img/loading.gif' style='width:24px;heigth:24px; margin:0 auto;display:block'/>");
                },
                success:function(data){
                    console.log(data);
                    if(data.code==0){
                        $.each(data.data,function(index,val){
                            html+=' <li>\
                                    <a href="javascript:void(0)">\
                                        <b>'+val.name+'</b>\
                                        <span>'+val.demo+'</span>\
                                    </a>\
                                </li>';
                        })
                        $(".warp_pws_x_sp").empty();
                        $(".warp_pws_x_sp").html(html);
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
                    content: '获取失败'
                    ,skin: 'msg'
                    ,time: 1 //2秒后自动关闭
                    });
                    return false;
                }   
            })
    }
   
    $(function(){
        // //总提交遮罩层
        // $("#loading").ajaxStart(function(){
        //      layer.open({
        //         type: 2
        //         ,content: '提交中'
        //       });
        // });
        // //总提交成功后返回
        // $("#loading").ajaxSuccess(function(){
        //     layer.closeAll();
        //     // $(this).empty(); // 或者直接清除
        //  });
        //岗位相关岗位名称选择
        $(".warp_pws_m span").click(function(){
            userpost_list();
            $(".warp_pws_x").animate({right:"0"});
        })
        $(".click_black1").click(function(){
            $(".warp_pws_x").animate({right:"-100%"});
        })
        //点击关闭
        $('.warp_pws_x_sp li').live('click',function(){
            var job_name = $(this).find('a').find('b').text();
            var job_demo = $(this).find('a').find('span').text();
            $("input[name='name']").val(job_name);
            $("input[name='demo']").val(job_demo);
            $(".warp_pws_x").animate({right:"-100%"});
        })
        //岗位问卷显示
         $(".warp_pws_c_se").click(function(){
            $(".my_tp").animate({left:"0"})
            $(".my_tp .warp_pws_m_sw").animate({left:"0"})
        })
        //岗位问卷隐藏
        $(".my_to").click(function(){
            $(".my_tp").animate({left:"100%"})
            $(".my_tp .warp_pws_m_sw").animate({left:"100%"})
        })
        var html1 = '';
        var html1 = '<ul class="warp_pws_z">\
                        <li>\
                            <b href="javascript:void(0)" class="warp_pws_z_so1">删除</b>\
                            <input type="text" name="question" placeholder="请填写问题">\
                        </li>\
                        <input type="hidden" name="standard" value=""/>\
                        <li>\
                            <a href="javascript:void(0)" class="warp_pws_z_sp" data-val="1">设置为答案</a>\
                            <a href="javascript:void(0)" class="warp_pws_z_so">删除</a>\
                            <input type="text" placeholder="请填写选项" name="answer1" data-del="1">\
                            <div class="warp_pws_z_su">\
                                <a href="javascript:void(0)">恢复</a>\
                            </div>\
                        </li>\
                        <li>\
                            <a href="javascript:void(0)" class="warp_pws_z_sp" data-val="2">设置为答案</a>\
                            <a href="javascript:void(0)" class="warp_pws_z_so">删除</a>\
                            <input type="text" placeholder="请填写选项" name="answer2" data-del="1">\
                            <div class="warp_pws_z_su">\
                                <a href="javascript:void(0)">恢复</a>\
                            </div>\
                        </li>\
                        <li>\
                            <a href="javascript:void(0)" class="warp_pws_z_sp" data-val="3">设置为答案</a>\
                            <a href="javascript:void(0)" class="warp_pws_z_so">删除</a>\
                            <input type="text" placeholder="请填写选项" name="answer3" data-del="1">\
                            <div class="warp_pws_z_su">\
                                <a href="javascript:void(0)">恢复</a>\
                            </div>\
                        </li>\
                        <li>\
                            <a href="javascript:void(0)" class="warp_pws_z_sp" data-val="4">设置为答案</a>\
                            <a href="javascript:void(0)" class="warp_pws_z_so">删除</a>\
                            <input type="text" placeholder="请填写选项" name="answer4" data-del="1">\
                            <div class="warp_pws_z_su">\
                                <a href="javascript:void(0)">恢复</a>\
                            </div>\
                        </li>\
                    </ui>';
        //点击追加问题
        $('#addquestion').click(function(index){
            var status = true;
            var num = 0;
            var a = $(this).parent().parent().prev('.warp_pws_z');
            var question = $.trim(a.children('li').eq(0).find("input").val());
            //console.log(question);
            if(question==''){
                    layer.open({ content: '请填写上题的问题题目' ,skin: 'msg' ,time: 2 });
                    status = false;
                }
            //var answer = $.trim(a.children('li').find("input[name^='answer']").val());
            a.find('li').each(function(index,val){
                if($.trim($(this).find("input").val())==''){
                    num ++;
                }        
            })
            if(num>2){
                layer.open({ content: '请至少填写2个选项' ,skin: 'msg' ,time: 2 });
                status = false;
            }
            if(!status){
                return false;
            }
            $('.append1').before(html1);
        });
        
        //设置为正确答案
        $(".warp_pws_z_sp").live('click',function(){
            var val1 = $(this).attr('data-val');
            $(this).parent().parent().find("input[name='standard']").val(val1);
            $(this).addClass('thisclass').text('正确答案');
            $(this).parent().siblings().find('a:eq(0)').removeClass('thisclass').text('设置为答案');
            
        });
        ///问题
        $(".warp_pws_z_so").live('click',function(){
           // $(this).addClass('cla');
            //$(this).parent().addClass('cla');
            var lennum = $(this).parent().parent().find('.cla').length;
            if(lennum==2){
                layer.open({ content: '答案最少保留两个!' ,skin: 'msg' ,time: 2 });
                return false;
            }
            $(this).parent().find('div').addClass('cla');
            $(this).parent().find("input").attr('data-del',2);
        });
        //删除问题
        $('.warp_pws_z_so1').live('click',function(){
            if(confirm('确定删除此问题么？')){
                $(this).parent().parent().remove();
            }    
        })
        //问题
        $(".warp_pws_z_su").live('click',function(){

            $(this).removeClass('cla');
            $(this).parent().removeClass('cla');
            $(".warp_pws_z li .warp_pws_z_so").removeClass('cla');
            $(this).prev("input").attr('data-del',1);

        });
        //修改信息
        $(".msg_sm").live('click',function(){
            var code = $(this).attr('data-code');
            var cookiemsg = localStorage.getItem('job_'+code);
            if(!cookiemsg){
                layer.open({
                    content: '该岗位不可修改'
                    ,skin: 'msg'
                    ,time: 1 //1秒后自动关闭
                });
                return false;
            }
            var jsonParse = JSON.parse(cookiemsg); //json字符串 转成JSON对象
            //console.log(jsonParse);return;
            window.location.href ='./act_job_edit.html?code='+jsonParse.code;
           
        })
    })
    //保存场次问卷
    function question_list(){
        var list = [];
        var array1 =$('#form4').serializeArray();
        var question = "";
        var answer1 = "";
        var answer2 = "";
        var answer3 = "";
        var answer4 = "";
        var status = true;
        $("input[name='question']").each(function(index,val){
            var question = $(this).val();  //问题名称
            var answer1 = $(this).parent().parent().find('li:eq(1)').find('input');
            var answer2 = $(this).parent().parent().find('li:eq(2)').find('input');
            var answer3 = $(this).parent().parent().find('li:eq(3)').find('input');
            var answer4 = $(this).parent().parent().find('li:eq(4)').find('input');
            var standard = $(this).parent().next("input[name='standard']").val();
           
            //return;
            //问题以及答案和是否选中 判断
            if(!$.trim(question)){
                layer.open({ content: '请填写问题题目!' ,skin: 'msg' ,time: 2 });
                status = false;
            }
            if(!$.trim(answer1.val())&&answer1.attr('data-del')==1){
                layer.open({ content: '有问题第一个选项未填写!' ,skin: 'msg' ,time: 2 });
                status = false;
            }
            if(!$.trim(answer2.val())&&answer2.attr('data-del')==1){
                layer.open({ content: '有问题第二个选项未填写!' ,skin: 'msg' ,time: 2 });
                status = false;
            }
            if(!$.trim(answer3.val())&&answer3.attr('data-del')==1){
                layer.open({ content: '有问题第三个选项未填写!' ,skin: 'msg' ,time: 2 });
                status = false;
            }
            if(!$.trim(answer4.val())&&answer4.attr('data-del')==1){
                layer.open({ content: '有问题第四个选项未填写!' ,skin: 'msg' ,time: 2 });
                status = false;
            }
            if(standard==''){
                layer.open({ content: '请选择正确答案!' ,skin: 'msg' ,time: 2 });
                status = false;
            }
            //如果 正确的答案被删除 需重新选择
            var ded = $(this).parent().parent().find('li').eq(standard).find('input').attr('data-del');
            if(ded==2){
                layer.open({ content: '正确答案被删除请重新选择!' ,skin: 'msg' ,time: 2 });
                status = false;
            }
            var an1 = answer1.attr('data-del')==1?answer1.val() : "";
            var an2 = answer2.attr('data-del')==1?answer2.val() : "";
            var an3 = answer3.attr('data-del')==1?answer3.val() : "";
            var an4 = answer4.attr('data-del')==1?answer4.val() : "";
            //数组拼接
            list.push({"answer":[an1,an2,an3,an4],"question":question,"standard":standard});
            //status = true;
        })
        // console.log(list);
        if(!status){
            return false;
        }
        $("input[name='question_json']").val(JSON.stringify(list));
        layer.open({ content: '设置成功' ,skin: 'msg' ,time: 2 });
        $(".my_tp").animate({left:"100%"})
        $(".my_tp .warp_pws_m_sw").animate({left:"100%"})
    }
    //场次信息提交
    function add_job(){
        $(this).attr("disabled","true"); //设置变灰按钮
        var arr = $('#form1').serializeArray();
        var json = {};
        var question = [];
        $.each(arr, function(){
            json[this.name] = this.value;
        });
        if(!click_str_null(json['name'],'岗位名称不能为空')){
            return false;
        }
        if(!click_str_null(json['demo'],'岗位描述不能为空')){
            return false;
        }
        if(!click_str_null(json['total'],'请设置招募人数')){
            return false;
        }
        if(!click_str_null(json['arriveTime'],'请设置报到时间')){
            return false;
        }
        if(!click_str_null(json['times'],'请设置服务时长')){
            return false;
        }
        if(!click_str_null(json['applyBeginTime'],'请设置报名开始时间')){
            return false;
        }
        if(!click_str_null(json['applyEndTime'],'请设置报名结束时间')){
            return false;
        }
        if(!click_str_null(json['radius'],'请设置打卡范围')){
            return false;
        }
        if(!click_str_null(json['arriveAddress'],'请设置报到地点')){
            return false;
        }
        // if(!click_str_null(json['inIntegral'],'请设置积分赠送')){
        //     return false;
        // }
        if(json.type==20&&json['question_json']==''){
            layer.open({ content: '请设置调查问卷!' ,skin: 'msg' ,time: 2 });
            return false;
        }
        
        json['inIntegral'] = parseInt(json['inIntegral'])?parseInt(json['inIntegral']):0;
        json['lat'] = parseFloat(json['lat']);
        json['lng'] = parseFloat(json['lng']);
        json['radius'] = parseInt(json['radius'])*1000;//打卡半径，公里转化为米
        json['arriveTime'] = $_GET['day']+' '+json['arriveTime']+':00';
        json['applyBeginTime'] = json['applyBeginTime']+':00';
        json['applyEndTime'] = json['applyEndTime']+':00';
        json['serveObject'] = parseInt(json['serveObject']);
        json['servePerson'] = parseInt(json['servePerson']);
        json['serveType'] = parseInt(json['serveType']);
        json['times'] = parseInt(Number(json['times'])*Number(60));
        json['total'] = parseInt(json['total']);
        json['type'] = parseInt(json['type']);
        json['activityCode'] = $_GET['activityCode'];
        json['sectionCode'] = $_GET['sectionCode'];
        //json['day'] = $_GET['day'];
        //json['startTime'] = $_GET['starttime'];
        //json['endTime'] = $_GET['endtime'];
        /*2018.8.24 加*/
        json['user'] = prjvorgMsg.prjvUserId;
        json['orgCode'] = prjvorgMsg.orgThirdAccount;
        json['contactPhone'] = actMsg.contactPhone;  //活动咨询电话
        json['coverImg'] = actMsg.coverImg;  //活动封面图片
        //json['coverImg'] = actMsg.coverImg;  //活动咨询电话
        /* 结束*/
        
        if(json.type==10){
            json['self'] = parseInt(json['self']);
            json['insurance'] = parseInt(json['insurance']);
            json['audit'] = parseInt(json['audit']);
            delete json['self2'];
            delete json['insurance2'];
            question =[];
        }else{
            json['self'] = parseInt(json['self2']);
            json['insurance'] = parseInt(json['insurance2']);
            delete json['self2'];
            delete json['insurance2'];
            delete json['audit'];
            question = JSON.parse(json['question_json']);
            
        }
        json['question'] = question;
        delete json['question_json'];
        var jobdata = JSON.stringify(json);
        console.log(jobdata);
        $.ajax({
                xhrFields: {
                   withCredentials: true
                },
                type:'post',
                url:base_url + "html5/v1/recruit/addSectionRecruit",
                data:jobdata,
                headers : {'token':token},
                dataType:'json',
                contentType: "application/json;charset=utf-8",
                beforeSend:function(){
                    layer.open({
                    type: 2
                    ,content: '提交中'
                    });
                },
                success:function(data){
                    console.log(data);
                    if(data.code==0){
                        localStorage.setItem('job_'+data.data.code,JSON.stringify(data.data));
                        layer.open({
                        content: '添加成功'
                        ,skin: 'msg'
                        ,time: 1 //1秒后自动关闭
                        });  
                        setTimeout(function(){
                        layer.closeAll();window.history.go(-1);},1000);
                    }else{
                        layer.open({
                        content: data.msg
                        ,skin: 'msg'
                        ,time: 1 //2秒后自动关闭
                        });
                        setTimeout(function(){layer.closeAll();},1000);
                        return false;
                    }
                },
                error:function(e){
                    layer.open({
                    content: '添加失败'
                    ,skin: 'msg'
                    ,time: 1 //2秒后自动关闭
                    });
                    setTimeout(function(){layer.closeAll();},1000);
                    return false;
                }
            })
    }
    //修改场次信息提交
    function edit_job(){
        var arr = $('#form1').serializeArray();
        var json = {};
        var question = [];
        $.each(arr, function(){
            json[this.name] = this.value;
        });
        if(!click_str_null(json['name'],'岗位名称不能为空')){
            return false;
        }
        if(!click_str_null(json['demo'],'岗位描述不能为空')){
            return false;
        }
        if(!click_str_null(json['total'],'请设置招募人数')){
            return false;
        }
        if(!click_str_null(json['arriveTime'],'请设置报到时间')){
            return false;
        }
        if(!click_str_null(json['times'],'请设置服务时长')){
            return false;
        }
        if(!click_str_null(json['radius'],'请设置打卡范围')){
            return false;
        }
        if(!click_str_null(json['arriveAddress'],'请设置报到地点')){
            return false;
        }
        // if(!click_str_null(json['inIntegral'],'请设置积分赠送')){
        //     return false;
        // }
        json['audit'] = parseInt(json['audit']);
        json['inIntegral'] = parseInt(json['inIntegral'])?parseInt(json['inIntegral']):0;
        json['insurance'] = parseInt(json['insurance']);
        json['lat'] = parseFloat(json['lat']);
        json['lng'] = parseFloat(json['lng']);
        json['radius'] = parseInt(json['radius'])*1000;//打卡半径，公里转化为米
        json['self'] = parseInt(json['self']);
        json['arriveTime'] = json['date']+' '+json['arriveTime']+':00';
        json['serveObject'] = parseInt(json['serveObject']);
        json['servePerson'] = parseInt(json['servePerson']);
        json['serveType'] = parseInt(json['serveType']);
        json['times'] = parseInt(Number(json['times']*Number(60)));
        json['total'] = parseInt(json['total']);
        json['type'] = parseInt(json['type']);
        json['code'] = $_GET['code'];
        if(json.type==10){
            var question =[];
        }
        json['question'] = question;
        delete json['date'];
        var jobdata = JSON.stringify(json);
        $.ajax({
                xhrFields: {
                   withCredentials: true
                },
                type:'post',
                url:base_url + "html5/v1/recruit/updateInfo",
                data:jobdata,
                headers : {'token':token},
                dataType:'json',
                contentType: "application/json;charset=utf-8",
                success:function(data){
                    if(data.code==0){
                        localStorage.setItem('job_'+json['code'],JSON.stringify(json));
                        layer.open({
                        content: '修改成功'
                        ,skin: 'msg'
                        ,time: 1 //1秒后自动关闭
                        });  
                    setTimeout(function(){window.history.go(-1);},1000);
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
                    content: '添加失败'
                    ,skin: 'msg'
                    ,time: 1 //2秒后自动关闭
                    });
                    return false;
                }
            })
    }
    //删除岗位
    function del_msg(){
        layer.open({
            content: '您确定要这么做么？'
                ,btn: ['确定', '取消']
                ,yes: function(index){
                    var ticketOrder = $("input[name='ticketOrder']").val();
                    var code = $_GET['code'];
                    console.log(code);
                    console.log(ticketOrder);
                    $.ajax({
                        xhrFields: {
                           withCredentials: true
                        },
                        type:'post',
                        url:base_url + "html5/v1/recruit/delete",
                        data:JSON.stringify({"code":code,"ticketOrder":ticketOrder}),
                        headers : {'token':token},
                        dataType:'json',
                        contentType: "application/json;charset=utf-8",
                        success:function(data){
                            console.log(data);
                            if(data.code==0){
                                    localStorage.removeItem('job_'+code);
                                    layer.open({
                                    content: '删除成功'
                                    ,skin: 'msg'
                                    ,time: 1 //1秒后自动关闭
                                    });  
                                setTimeout(function(){window.history.go(-1);},1000);
                            }else{
                                layer.open({
                                content: '删除失败'
                                ,skin: 'msg'
                                ,time: 1 //2秒后自动关闭
                                });
                                return false;
                            }
                        },
                        error:function(e){
                            layer.open({
                            content: '删除失败'
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
    //查询 对应cookie查询的信息
    function get_cookie_msg(code){
        //var cookiemsg = $.cookie('job_'+code);
        var cookiemsg = localStorage.getItem('job_'+code);
        var jsonParse = JSON.parse(cookiemsg); //json字符串 转成JSON对象
        console.log(jsonParse);
        $.each(jsonParse,function(index,val){
            if(index=='times'){
               var val = Number(val)/Number(60);
            } 
            if(index=='arriveTime'){
                var atim = split_datetime(val);
                var val = atim.str;       
               $("input[name='date']").val(atim.date);
            }
            if(index=='radius'){
                var val = val/1000;
            }
            $("input[name='"+index+"']").val(val);
        })
        //如果类型为选拔制  加载
        if(jsonParse.type==20){
            get_question_list(code);
        }
        
        
    }
    //获取 岗位问卷
    //判断 底部按钮选择
    function botton_decide_class(){
        var cla = '';
        $('.warp_pws_c_st input').each(function(){
           var val1 = $(this).val();
           var cla = val1==10?'switch-on':'switch-off';
           $(this).prev('div').find('span').attr('class',cla);
        })
    }  
    //获取问卷
    function get_question_list(recruitCode){
        var code = recruitCode
        $.ajax({
            xhrFields: {
               withCredentials: true
            },
            type:'post',
            url:base_url + "html5/v1/recruit/queryQuestionByRecruitCode",
            data:JSON.stringify({"recruitCode":code}),
            //headers : {'token':token},
            dataType:'json',
            contentType: "application/json;charset=utf-8",
            success:function(data){
                console.log(data);
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
   
    

