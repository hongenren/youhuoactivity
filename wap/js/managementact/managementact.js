    var user_msg = '';
    var token = '';
    var user_msg = JSON.parse($.cookie('user_msg'));
    var token = $.cookie('token');
    ////获取 我发布的活动列表
	function get_activity_list(){
        var html ='';
        var data_list = '';
		$.ajax({
            xhrFields: {
               withCredentials: true
            },
            type:"post",
            url:base_url + "html5/v1/activity/findByUser",
            data:JSON.stringify({"pageNumber":1,"pageSize":6,"user":user_msg.userId}),
            dataType:'json',
            headers : {'token':token},
            contentType: "application/json;charset=utf-8",
            beforeSend:function(XMLHttpRequest){
                    layer.open({type: 2,content: '加载中'});
                },
            success:function(data){
                if(data.code==0){
                    data_list = data.data.records;
                    $.each(data_list,function(index,val){
                        // html +="<a href='./managementact_content.html?activityCode="+val.activityCode+"'>"+val.name+"</a></br>";
                        // state -10 未发布 10未开始 20进行中 30已结束 50已封存
                        state = "";
                        if(val.state == -10){
                            state = "未发布"
                        }else if(val.state == 10){
                            state = "未开始"
                        }else if(val.state == 20){
                            state = "进行中"
                        }else if(val.state == 30){
                            state = "已结束"
                        }else if(val.state == 50){
                            state = "已封存"
                        }
                        html +="<li>\
                                    <a href='./managementact_content.html?activityCode="+val.activityCode+"'>\
                                        <img src='"+val.coverImg+"'>\
                                        <div class='warp_lb_r_sp'>\
                                            <div class='warp_lb_r_so'>\
                                                <i class='warp_lb_r_so_1'>"+state+"</i>\
                                                <span>"+val.name+"</span>\
                                            </div>\
                                            <div class='warp_lb_r_si'>\
                                                <span>活动时间："+val.startDay+"至"+val.endDay+"</span>\
                                            </div>\
                                        </div>\
                                    </a>\
                                </li>";
                    })
                    $('#managementact_list').html(html);
                    layer.closeAll();
                }else{
                    layer.closeAll();
                    layer.open({
                    content: '获取失败'
                    ,skin: 'msg'
                    ,time: 1 //2秒后自动关闭
                    });
                    return false;
                }
            	// console.log(data);
            },
            error:function(){
                layer.closeAll();
                layer.open({
                    content: '获取失败'
                    ,skin: 'msg'
                    ,time: 1 //2秒后自动关闭
                    });
                return false;
            }
        })
	}
    /*活动基础信息*/
    function activity_show(activityCode)
    {
        var html ='';
        var data_list = '';
        $.ajax({
            xhrFields: {
               withCredentials: true
            },
            type:"post",
            url:base_url + "html5/v1/activity/queryDetail",
            data:JSON.stringify({"activityCode":activityCode}),
            dataType:'json',
            async:false,
            headers : {'token':token},
            contentType: "application/json;charset=utf-8",
            beforeSend:function(XMLHttpRequest){
                    layer.open({type: 2,content: '加载中'});
                },
            success:function(data){
                // console.log(data);
                //console.log("zzp");
                if(data.code==0){
                    layer.closeAll();
                    data_list = data.data;
                    $('#name').html(data_list.name);
                    if(data_list.startDay=='--'||data_list.startDay==''){
                        $('#arriveTime').html(data_list.endDay);
                        $('#actTime').html(data_list.endDay);
                        $('#actTime').attr('data-startday',data_list.endDay).attr('data-endday',data_list.endDay);
                    }else{
                        $('#arriveTime').html(data_list.startDay+'-'+data_list.endDay);
                        $('#actTime').html(data_list.startDay+'-'+data_list.endDay);
                        $('#actTime').attr('data-startday',data_list.startDay).attr('data-endday',data_list.endDay);
                    }
                    $('#arriveAddress').html(data_list.address);
                }else{
                    layer.closeAll();
                    layer.open({
                    content: '获取失败'
                    ,skin: 'msg'
                    ,time: 1 //2秒后自动关闭
                    });
                    return false;
                }
                //console.log(data);
            },
            error:function(){
                layer.closeAll();
                layer.open({
                    content: '获取失败'
                    ,skin: 'msg'
                    ,time: 1 //2秒后自动关闭
                    });
                return false;
            }
        })
    }
    //活动场次
    function get_activity_detail(activityCode)
    {
        var html ='';
        var data_list = '';
        $.ajax({
            xhrFields: {
               withCredentials: true
            },
            type:"post",
            url:base_url + "/html5/v1/section/selectAuthList",
            data:JSON.stringify({"activityCode":activityCode,"orgCode":prjvorgMsg.orgThirdAccount,"pageSize":10000}),
            dataType:'json',
            headers : {'token':token},
            async:false,
            contentType: "application/json;charset=utf-8",
            beforeSend:function(XMLHttpRequest){
                    layer.open({type: 2,content: '加载中'});
                },
            success:function(data){
                // console.log(data);
                if(data.code==0){
                    data_list = data.data;
                    classHtml = "";
                    if(JSON.stringify(data_list)!="{}" && JSON.stringify(data_list)!="[]" && JSON.stringify(data_list)!="\"\""){
                        $.each(data_list,function(index,v){
                                //console.log(val.sections);
                                if(v.type == 10){
                                    typeName = "全天"
                                }else if(v.type == 20){
                                    typeName = "上午场"
                                }else if(v.type == 30){
                                    typeName = "下午场"
                                }else if(v.type == 40){
                                    typeName = "晚上场"
                                }
                                classHtml += '<option data-id="'+v.code+'" data-day="'+v.day+'" data-startTime="'+v.startTime+'" data-endTime="'+v.endTime+'" data-type="'+v.type+'">'+v.day+' '+typeName+'</option>';
                        })
                        sectionCode = data_list[0].code;
                        day = data_list[0].day;   //日期
                        startTime = data_list[0].startTime; //开始时间
                        endTime = data_list[0].endTime;  //结束时间
                        $("#actTime").attr("data-starttime",startTime); //第一场场次开始时间
                        $("#actTime").attr("data-endtime",endTime); //第一场场次结束时间
                        $("#arriveTime").html(startTime+"-"+endTime);
                        assgin_datetime(day,startTime,endTime);
                        get_activity_addr(sectionCode);
                        get_auditing_count(sectionCode);
                        $('#classList').html(classHtml);
                        check_button_more_state();
                    }
                    layer.closeAll();
                }else{
                    layer.closeAll();
                    layer.open({
                    content: '获取失败'
                    ,skin: 'msg'
                    ,time: 1 //2秒后自动关闭
                    });
                    return false;
                }
                //console.log(data);
            },
            error:function(){
                layer.closeAll();
                layer.open({
                    content: '网络错误，获取失败'
                    ,skin: 'msg'
                    ,time: 1 //2秒后自动关闭
                    });
                return false;
            }
        })
    }
     //检查编辑按钮状态
    function check_button_state(){
        var startday = $("#actTime").attr('data-startday');  //获取开始日期
        var endday = $("#actTime").attr('data-endday');  //获取结束日期
        var starttime = $("#actTime").attr('data-starttime'); //获取第一场开始时间
        var endtime = $("#actTime").attr('data-endtime'); //获取结束时间
        var now_time = getFormatDate(); //当前时间
        var start = startday +' '+ starttime;
        var end = endday +' '+ endtime;  //
        //此处为修改活动 按钮状态判断
        //条件  活动结束前都可修改，活动结束后，按钮灰色不可点击
        var base_edit = $(".warp_gl_p_sp li").eq(0).find('a');
        if(!compareTime(now_time,end)){
            base_edit.attr("style","color:#999999");
        }else{
            base_edit.addClass('hrefmsg');
        }
        var base_edit1 = $(".warp_gl_p_sp li").eq(1).find('a');
        if(!compareTime(now_time,start)){
            base_edit1.attr("style","color:#999999");
        }else{
            base_edit1.addClass('hrefmsg');
        }

    }
    //检查多个按钮状态
    function check_button_more_state(){
        var now_time = getFormatDate(); //当前时间
        var selected = $("#classList option:selected");
        var day = selected.attr("data-day");
        var starttime = selected.attr("data-starttime");
        var endtime = selected.attr("data-endtime");
        var date = day + ' ' + endtime
        if(!compareTime(now_time,date)){
            $('.cancel_session').attr("style","color:#999999");
            $('.cancel_session').removeClass('hrefmsg');
            $('.edit_desc').attr("style","color:#999999");
            $('.edit_desc').removeClass('hrefmsg');

            $('#scanQRCode').attr("style","color:#999999");
            $('#startCan').attr("style","color:#999999");
            $('#scanQRCode').removeClass('hrefmsg2');
            $('#startCan').removeClass('hrefmsg2');

            $('.changcigaiqi').attr("style","color:#999999");
            $('.changcigaiqi').removeClass('hrefmsg1');
            $('.biangengdidian').attr("style","color:#999999");
            $('.biangengdidian').removeClass('hrefmsg');
            $('.zengjiaminge').attr("style","color:#999999");
            $('.zengjiaminge').removeClass('hrefmsg');
            $('.gangweiyanshi').attr("style","color:#999999");
            $('.gangweiyanshi').removeClass('hrefmsg');
        }else{
            $('#scanQRCode').addClass('hrefmsg2');
            $('#scanQRCode').attr("style","color:#000000");
            $('#startCan').addClass('hrefmsg2');
            $('#startCan').attr("style","color:#000000");
            $('.cancel_session').addClass('hrefmsg');
            $('.cancel_session').attr("style","color:#000000");
            $('.edit_desc').addClass('hrefmsg');
            $('.edit_desc').attr("style","color:#000000");
            $('.changcigaiqi').addClass('hrefmsg1');//场次改期
            $('.changcigaiqi').attr("style","color:#000000");
            $('.biangengdidian').addClass('hrefmsg');//变更地点
            $('.biangengdidian').attr("style","color:#000000");
            $('.zengjiaminge').addClass('hrefmsg');//增加名额
            $('.zengjiaminge').attr("style","color:#000000");
            $('.gangweiyanshi').addClass('hrefmsg');//岗位延时
            $('.gangweiyanshi').attr("style","color:#000000");
        }
        linkJump();
        // console.log(day)
        // console.log(starttime)
        // console.log(endtime)
    }
    // //给 按钮 赋值 日期 时间、
    function assgin_datetime(date,startTime,endTime){
        $(".cancel_session").attr('data-date',date).attr('data-starttime',startTime).attr('data-starttime',endTime);
    }
    //获取报到时间报到地点
    function get_activity_addr(sectionCode)
    {
        var html ='';
        var data_list = '';
        $.ajax({
            xhrFields: {
               withCredentials: true
            },
            type:"post",
            url:base_url + "html5/v1/manager/queryBySectionCode",
            data:JSON.stringify({"sectionCode":sectionCode,"type":80}),
            dataType:'json',
            headers : {'token':token},
            contentType: "application/json;charset=utf-8",
            beforeSend:function(XMLHttpRequest){
                layer.open({type: 2,content: '加载中'});
            },
            success:function(data){
                // console.log(data);
                // console.log(111);
                if(data.code==0){
                    data_list = data.data;
                   // $("#arriveTime").html(data_list.arriveTime);
                    //$("#arriveAddress").html(data_list.arriveAddress);
                    $("#ticketOrder").val(data_list.ticketOrder)
                    // $("#thisDay").val(data_list.day)
                    // $("#thisStartTime").val(data_list.startTime)
                    // $("#thisEndTime").val(data_list.endTime)
                    layer.closeAll();
                }else{
                    layer.closeAll();
                    layer.open({
                    content: data.msg
                    ,skin: 'msg'
                    ,time: 1 //2秒后自动关闭
                    });
                    return false;
                }
                //console.log(data);
            },
            error:function(){
                layer.closeAll();
                layer.open({
                    content: '网络错误，获取失败'
                    ,skin: 'msg'
                    ,time: 1 //2秒后自动关闭
                    });
                return false;
            }
        })
        //check_button_more_state(); //检查各个按钮状态
    }
    //获取待审核人员数量和待审核事项
    function get_auditing_count(sectionCode){
        $.ajax({
            xhrFields: {
               withCredentials: true
            },
            type:"post",
            url:base_url + "html5/v1/section/auditingCount",
            data:JSON.stringify({"code":sectionCode}),
            dataType:'json',
            headers : {'token':token},
            contentType: "application/json;charset=utf-8",
            success:function(data){
                if(data.code==0){
                    var size = data.data.size;
                    if(size==0){
                        $(".auditing_count").hide()
                    }else{
                        $(".auditing_count").html(size)
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
            error:function(){
                layer.closeAll();
                layer.open({
                    content: '网络错误，获取失败'
                    ,skin: 'msg'
                    ,time: 1 //2秒后自动关闭
                    });
                return false;
            }
        })

        $.ajax({
            xhrFields: {
                withCredentials: true
            },
            type:"post",
            url:base_url + "html5/v1/userTicket/queryChangeApplyCount",
            data:JSON.stringify({"sectionCode":sectionCode}),
            dataType:'json',
            headers : {'token':token},
            contentType: "application/json;charset=utf-8",
            success:function(data){
                if(data.code==0){
                    var recruitReplace = data.data.recruitReplace;
                    var recruitQuit = data.data.recruitQuit;
                    var taskReplace = data.data.taskReplace;
                    var taskQuit = data.data.taskQuit;
                    var shcueriu = recruitReplace+recruitQuit+taskReplace+taskQuit;
                    if(shcueriu==0){
                        $(".matters_count").hide()
                    }else{
                        $(".matters_count").html(shcueriu)
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
            error:function(){
                layer.closeAll();
                layer.open({
                    content: '网络错误，获取失败'
                    ,skin: 'msg'
                    ,time: 1 //2秒后自动关闭
                });
                return false;
            }
        })
    }
    //获取全部岗位信息
    function get_activity_work(sectionCode, type){
        var html ='';
        var data_list = '';
        if(type==2){
            $.ajax({
                xhrFields: {
                    withCredentials: true
                },
                type:"post",
                url:base_url + "html5/v1/task/queryBySectionCode",
                data:JSON.stringify({"sectionCode":sectionCode,"user":user_msg.userId}),
                dataType:'json',
                headers : {'token':token},
                contentType: "application/json;charset=utf-8",
                success:function(data){
                    //console.log(data);
                    if(data.code==0){
                        data_list = data.data;
                        html += '<li><a href="javascript:;" onclick="evaluateScrollEvent(\''+$_GET['sectionCode']+'\',2)">全部任务</a></li>';
                        $.each(data_list,function(index,val){
                            html+='<li>\
                                    <a href="javascript:;" onclick="evaluateScrollEvent(\''+$_GET['sectionCode']+'\',2,recruitCode=\''+val.code+'\')">'+val.name+'</a>\
                                </li>';
                        })
                        $(".warp_gl_y_sl").html(html)
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
        }else{
            $.ajax({
                xhrFields: {
                    withCredentials: true
                },
                type:"post",
                url:base_url + "html5/v1/recruit/findBySectionCode",
                data:JSON.stringify({"sectionCode":sectionCode}),
                dataType:'json',
                headers : {'token':token},
                contentType: "application/json;charset=utf-8",
                success:function(data){
                    //console.log(data);
                    if(data.code==0){
                        data_list = data.data;
                        html += '<li><a href="javascript:;" onclick="evaluateScrollEvent(\''+$_GET['sectionCode']+'\',1)">全部岗位</a></li>';
                        $.each(data_list,function(index,val){
                            html+='<li>\
                                    <a href="javascript:;" onclick="evaluateScrollEvent(\''+$_GET['sectionCode']+'\',1,recruitCode=\''+val.code+'\')">'+val.name+'</a>\
                                </li>';
                        })
                        $(".warp_gl_y_sl").html(html)
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
    }
    //待审核人员
    function get_activity_auditee(sectionCode,typeNum,recruitCode="",taskCode="",page,size,status){
        get_activity_work(sectionCode, typeNum)
        if(typeNum == 1){
            var url   = base_url + "html5/v1/recruit/selectBySectionRecruit";
            var datas = JSON.stringify({"sectionCode":sectionCode,"recruitCode":recruitCode,"pageNumber":page,"pageSize":size,"state":10});
        }else if(typeNum == 2){
            var url = base_url + "html5/v1/task/selectAppliesBySectionTask";
            var datas = JSON.stringify({"sectionCode":sectionCode,"pageNumber":page,"pageSize":size,"state":10,"taskCode":taskCode});
        }else if(typeNum == 3){
            var url   = base_url + "html5/v1/public/selectAppliesBySection";
            var datas = JSON.stringify({"sectionCode":sectionCode,"pageNumber":page,"pageSize":size,"state":10});
        }else if(typeNum == 4){
            var url   = base_url + "html5/v1/manager/selectAppliesBySection";
            var datas = JSON.stringify({"sectionCode":sectionCode,"pageNumber":page,"pageSize":size,"state":10,"activityCode":$_GET['activityCode']});
        }else if(typeNum == 5){
            var url   = base_url + "html5/v1/mediaGuest/queryAppliesBySection";
            var datas = JSON.stringify({"sectionCode":sectionCode,"pageNumber":page,"pageSize":size,"state":10,"type":50});
        }else if(typeNum == 6){
            var url   = base_url + "html5/v1/mediaGuest/queryAppliesBySection";
            var datas = JSON.stringify({"sectionCode":sectionCode,"pageNumber":page,"pageSize":size,"state":10,"type":60});
        }
        //console.log(url)
        //console.log(datas)
        $.ajax({
            xhrFields: {
               withCredentials: true
            },
            type:"post",
            url:url,
            data:datas,
            dataType:'json',
            headers : {'token':token},
            contentType: "application/json;charset=utf-8",
            success:function(data){
                var html ='';
                var data_list = '';
                //console.log(data);
                if(status==1){
                    $("#warp_hm_o").empty()
                }
                if(data.code==0){
                    data_list = data.data;
                    var search_html = '';
                    if(typeNum == 1 || typeNum == 2){
                        search_html = '<div class="warp_hm_p">\
                                            <div class="warp_gl_u_so" style="float: left">\
                                                <span>';
                        if(typeNum == 1){
                            search_html += '全部岗位';
                        }else if(typeNum == 2){
                            search_html += '全部任务';
                        }
                        search_html += '</span>\
                                            </div>\
                                            <div class="warp_gl_u_so" style="float: right">\
                                                <span>答案正确</span>\
                                            </div>\
                                        </div>';
                    }
                    search_html += '<div class="warp_gl_u_si">\
                                            <input type="button" value="搜索" class="warp_gl_u_su">\
                                            <input type="text" placeholder="请输入姓名或手机号" class="warp_gl_u_sy" data-id="'+typeNum+'">\
                                        </div>';
                    $("#search").html(search_html)
                    $('.warp_gl_u_st').find('span').html('待审核'+data_list.total+'人')

                    if(data_list.records.length>0){
                        $.each(data_list.records,function(index,val){
                            var headImg = '';
                            if(val.headImg==''){
                                headImg = '../wap/img/pws_96.jpg';
                            }else{
                                headImg = val.headImg;
                            }
                            var userName = val.nickName, uesrIndex = '';
                            if(typeNum == 5 || typeNum == 6){
                                userName = val.realName;
                            }else{
                                //uesrIndex = '<i>查看个人主页</i>';
                            }
                            if(userName==null || userName==undefined){
                                userName = "";
                            }
                            html+='<li>\
                                <a href="javascript:;">\
                                    <div class="warp_gl_u_se">\
                                        <img src="'+headImg+'">\
                                        <div class="warp_gl_u_sw">\
                                            <div class="warp_gl_u_sq">\
                                                '+uesrIndex+'\
                                                <b>'+userName+'</b>\
                                            </div>\
                                            <p>报名来源：预报名</p>\
                                        </div>\
                                    </div>\
                                </a>\
                                <div class="warp_gl_u_sk" data-code="'+val.code+'" data-order="'+val.ticketOrder+'" data-user="'+val.user+'" data-num="'+typeNum+'" data-taskcode="'+val.taskCode+'" data-sectioncode="'+val.sectionCode+'" data-publicode="'+val.publicCode+'">\
                                    <a href="javascript:void(0)" class="agree1" value="-10">拒绝</a>\
                                    <a href="javascript:void(0)" class="agree1" value="20">通过</a>\
                                    <a href="tel:'+val.mobile+'">联系</a>\
                                </div>\
                            </li>';
                        })
                        $(".loadings").remove();
                        $("#warp_hm_o").append(html)
                    }else{
                        if($(".lastNothing").length>0){
                            $(".lastNothing").remove();
                        }
                        $(".loadings").remove();
                        if($(".loadings").length<=0){
                            $("#warp_hm_o").append('<div class="lastNothing" style="font-size:14px;line-height:50px;text-align:center;color:#666;">没有了</div>');
                        }
                    }

                }else{
                    $(".loadings").remove();
                    layer.open({
                    content: '获取失败'
                    ,skin: 'msg'
                    ,time: 1 //2秒后自动关闭
                    });
                    return false;
                }
                //console.log(data);
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
    function search_list(sectionCode,searchVal,typeNum,page,size,status=1)
    {
        var recruitcode = "";
        var taskcode    = "";

        if(typeNum == 1){
            var url   = base_url + "html5/v1/recruit/searchByNameOrMobile";
            var datas = JSON.stringify({"sectionCode":sectionCode,"recruitcode":recruitcode,"pageNumber":page,"pageSize":size,"state":10,"searchValue":searchVal});
        }else if(typeNum == 2){
            var url = base_url + "html5/v1/task/searchTaskSubmit";
            var datas = JSON.stringify({"sectionCode":sectionCode,"pageNumber":page,"pageSize":size,"searchValue":searchVal,"taskcode":taskcode});
        }else if(typeNum == 3){
            var url   = base_url + "html5/v1/public/searchApplies";
            var datas = JSON.stringify({"sectionCode":sectionCode,"pageNumber":page,"pageSize":size,"state":10,"searchValue":searchVal});
        }else if(typeNum == 4){
            var url   = base_url + "html5/v1/manager/searchApplies";
            var datas = JSON.stringify({"sectionCode":sectionCode,"pageNumber":page,"pageSize":size,"activityCode":$_GET['activityCode'],"searchValue":searchVal});
        }else if(typeNum == 5){
            var url   = base_url + "html5/v1/mediaGuest/searchApply";
            var datas = JSON.stringify({"sectionCode":sectionCode,"pageNumber":page,"pageSize":size,"state":10,"type":50,"searchValue":searchVal});
        }else if(typeNum == 6){
            var url   = base_url + "html5/v1/mediaGuest/searchApply";mediaGuest/queryAppliesBySection
            var datas = JSON.stringify({"sectionCode":sectionCode,"pageNumber":page,"pageSize":size,"state":10,"type":60,"searchValue":searchVal});
        }
        //console.log(url)
        //console.log(datas)
        $.ajax({
            xhrFields: {
               withCredentials: true
            },
            type:"post",
            url:url,
            data:datas,
            dataType:'json',
            headers : {'token':token},
            contentType: "application/json;charset=utf-8",
            success:function(data){
                var html ='';
                var data_list = '';
                //console.log(data);
                if(status==1){
                    $("#warp_hm_o").empty()
                }
                if(data.code==0){
                    data_list = data.data;
                    var search_html = '<div class="warp_hm_p">\
                                            <div class="warp_gl_u_so" style="float: left">\
                                                <span>全部岗位</span>\
                                            </div>\
                                            <div class="warp_gl_u_so" style="float: right">\
                                                <span>答案正确</span>\
                                            </div>\
                                        </div>\
                                        <div class="warp_gl_u_si">\
                                            <input type="button" value="搜索" class="warp_gl_u_su">\
                                            <input type="text" placeholder="请输入姓名或手机号" class="warp_gl_u_sy" data-id="'+typeNum+'">\
                                        </div>';
                    $("#search").html(search_html)
                    $('.warp_gl_u_st').find('span').html('待审核'+data_list.total+'人');
                    if(data_list.records.length>0){
                        $.each(data_list.records,function(index,val){
                            var headImg = '';
                            if(val.headImg==''){
                                headImg = '../wap/img/pws_96.jpg';
                            }else{
                                headImg = val.headImg;
                            }
                            var userName = val.nickName, uesrIndex = '';
                            if(typeNum == 5 || typeNum == 6){
                                userName = val.realName;
                            }else{
                                uesrIndex = '<i>查看个人主页</i>';
                            }
                            if(userName==null || userName==undefined){
                                userName = "";
                            }
                            html+='<li>\
                                <a href="javascript:;">\
                                    <div class="warp_gl_u_se">\
                                        <img src="'+headImg+'">\
                                        <div class="warp_gl_u_sw">\
                                            <div class="warp_gl_u_sq">\
                                                '+uesrIndex+'\
                                                <b>'+userName+'</b>\
                                            </div>\
                                            <p>报名来源：预报名</p>\
                                        </div>\
                                    </div>\
                                </a>\
                                <div class="warp_gl_u_sk" data-code="'+val.code+'" data-order="'+val.ticketOrder+'" data-user="'+val.user+'" data-num="'+typeNum+'" data-taskcode="'+val.taskCode+'" data-sectioncode="'+val.sectionCode+'" data-publicode="'+val.publicCode+'">\
                                    <a href="javascript:void(0)" class="agree1" value="-10">拒绝</a>\
                                    <a href="javascript:void(0)" class="agree1" value="20">通过</a>\
                                    <a href="tel:'+val.mobile+'">联系</a>\
                                </div>\
                            </li>';
                        })
                        $(".loadings").remove();
                        $("#warp_hm_o").append(html)
                    }else{
                        if($(".lastNothing").length>0){
                            $(".lastNothing").remove();
                        }
                        $(".loadings").remove();
                        if($(".loadings").length<=0){
                            $("#warp_hm_o").append('<div class="lastNothing" style="font-size:14px;line-height:50px;text-align:center;color:#666;">没有了</div>');
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
                //console.log(data);
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
    /*活动基础信息END*/
    //活动编辑回显活动详情页
    function get_activity_content(activityCode){
        var html ='';
        var data_list = '';
        $.ajax({
            xhrFields: {
               withCredentials: true
            },
            type:"post",
            url:base_url + "html5/v1/activity/queryDetail",
            data:JSON.stringify({"activityCode":activityCode}),
            dataType:'json',
            headers : {'token':token},
            contentType: "application/json;charset=utf-8",
            success:function(data){
                //console.log(data);
                if(data.code==0){
                    data_list = data.data;
                    $.each(data_list,function(index,val){
                        $("input[name='"+index+"']").val(val);
                    })
                    // $.each(data_list,function(index,val){
                    //         html +="<a href='./managementact_content.html?activityCode="+val.activityCode+"'>"+val.name+"</a></br>";
                    //     })
                    // $('.aa').html(html);
                }else{
                    layer.open({
                    content: '获取失败'
                    ,skin: 'msg'
                    ,time: 1 //2秒后自动关闭
                    });
                    return false;
                }
                //console.log(data);
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
    //
    $(function(){
        $('.agree1').live('click',function(){
            var typeNum = $(this).parent().attr('data-num');
            var state = $(this).attr('value');
            //console.log(state);
            var activityCode = $_GET['activityCode'];
            var code = $(this).parent().attr('data-code');
            var order = $(this).parent().attr('data-order');
            var user = $(this).parent().attr('data-user');
            var taskcode = $(this).parent().attr('data-taskcode');
            var sectioncode = $(this).parent().attr('data-sectioncode');
            var publicode = $(this).parent().attr('data-publicode');

            if(typeNum == 1){
                var url = base_url + "html5/v1/recruit/auditApply";
                var data1 = JSON.stringify({
                        "activityCode":activityCode,
                        "code":code,
                        "optionUser":user_msg.userId,
                        "state":state,
                        "ticketOrder":order,
                        "user":user
                        });
            }else if(typeNum == 2){
                var url = base_url + "html5/v1/task/audit";
                var data1 = JSON.stringify({
                        "activityCode":activityCode,
                        "taskCode":taskcode,
                        "publicTicketOrder":sectioncode,
                        "sendPublicTickets":20,
                        "optionUser":user_msg.userId,
                        "state":state,
                        "ticketOrder":order,
                        "user":user
                    });
            }else if(typeNum == 3){
                var url = base_url + "html5/v1/public/audit";
                var data1 = JSON.stringify({
                        "activityCode":activityCode,
                        "publicCode":publicode,
                        "optionUser":user_msg.userId,
                        "state":state,
                        "ticketOrder":order,
                        "user":user
                    });
            }else if(typeNum == 4){
                var url = base_url + "html5/v1/manager/verify";
                var data1 = JSON.stringify({
                        "activityCode":activityCode,
                        "code":code,
                        "optionUser":user_msg.userId,
                        "state":state,
                        "ticketOrder":order,
                        "user":user
                    });
            }else if(typeNum == 5){
                var url = base_url + "html5/v1/mediaGuest/audit";
                var data1 = JSON.stringify({
                        "activityCode":activityCode,
                        "code":code,
                        "optionUser":user_msg.userId,
                        "state":state,
                        "ticketOrder":order,
                        "user":user
                    });
            }else if(typeNum == 6){
                var url = base_url + "html5/v1/mediaGuest/audit";
                var data1 = JSON.stringify({
                        "activityCode":activityCode,
                        "code":code,
                        "optionUser":user_msg.userId,
                        "state":state,
                        "ticketOrder":order,
                        "user":user
                    });
            }

            if(state==-10){
                $("#reason").show();
                // btn_form(url,data1)
                $("#no_url").val(url);
                $("#no_data").val(data1);
                return;
            }else{
                layer.open({
                content: '您确定要这么做么？'
                    ,btn: ['确定', '取消']
                    ,yes: function(index){
                        // console.log(url)
                        // console.log(data1)
                        btn_form(url,data1)
                        layer.close(index);
                    }
                });
            }
        })
    })
    function btn_form(url,data1)
    {
        $.ajax({
                xhrFields: {
                   withCredentials: true
                },
                type:"post",
                url:url,
                data:data1,
                dataType:'json',
                headers : {'token':token},
                contentType: "application/json;charset=utf-8",
                success:function(data){
                    //console.log(data)
                    if(data.code==0){
                        layer.open({
                        content: '操作成功'
                        ,skin: 'msg'
                        ,time: 1 //2秒后自动关闭
                        });
                        setTimeout(function(){location.reload()},1000);
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
                    //console.log(e)
                    layer.open({
                        content: '操作失败'
                        ,skin: 'msg'
                        ,time: 1 //2秒后自动关闭
                        });
                    return false;
                }
            })
    }
