var user_msg = '';
var token = '';
if($.cookie('user_msg')){
  user_msg = JSON.parse($.cookie('user_msg'));
}
var token = $.cookie('token');
var contactPhone = '', orgCode = '', state = '';
//查询活动详情
	function get_activity_msg(){
        var activityCode = $_GET['activityCode'];
        $.ajax({
            xhrFields: {
               withCredentials: true
            },
            type:"post",
            url:base_url + "html5/v1/activity/queryDetail",
            data:JSON.stringify({"activityCode":activityCode}),
            dataType:'json',
            contentType: "application/json;charset=utf-8",
            success:function(data){
                //console.log(data)
            	if(data.code==0){
            		var data1 = data.data;
                    state = data1.state;
            		$('.warp_hd_u_bq b').text(data1.name);
                    contactPhone = data1.contactPhone;
                    orgCode = data1.orgCode;
            		$('.warp_hd_u_bq a').html('<i></i>'+data1.address);
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
    // 判断登录是否存在
    $(function(){
        if(!user_msg&&!token){
            $('.warp_hd_u_bf').empty();
            $('.warp_hd_u_bf').append('<li>\
                    <a href="../login/login.html?activityCode='+$_GET['activityCode']+'?jumpAdd='+location.href+'">马上登录</a>\
                    <span>登录后可参加本公益活动</span>\
                    </li>');
        }else{
            if(user_msg.userNo==''){
                $('.warp_hd_u_bf').empty();
                <!--../cert/cert_index.html?activityCode='+$_GET['activityCode']+'-->
                $('.warp_hd_u_bf').append('<li>\
                    <a href="javascript:void(0)" onclick="jumpBank(\'web/srcb/index?channel=P9a4c8c66b1c74b53b881a5f337745a84&name=&idCard=&phone=\')">去实名认证</a>\
                    <span>未实名认证，部分功能不可使用</span>\
                    </li>');
            }
        }

    })
//查询 场次信息
var warp_hd_u_bm_html = "报名";
$(function(){
        var activityCode = $_GET['activityCode'];
        //ajax_res("{:U('Activity/ajax_job')}",activityCode);
        ajax_res(activityCode,'job');
        var cotrs = $(".warp_hd_u_bh ul li");
        cotrs.click(function(){
            $(this).addClass("thisclass").siblings().removeClass("thisclass");
            var type = $(this).attr('data-type');
            if(type!="job" && type!="task"){
                warp_hd_u_bm_html = "领取";
            }else{
                warp_hd_u_bm_html = "报名";
            }
            ajax_res(activityCode,type);

        });
        //切换日期 不同结果
        var cotrs = $(".swiper-wrapper div");
        cotrs.live('click',function(index,val){
            var index = $(this).index();
            var type = $(this).attr('data-type');
            var date_list = JSON.parse(localStorage.getItem('act_date_list'));
            ajax_sections(date_list[index].sections,date_list[index].day,type);
            $(this).addClass("thisclass").siblings().removeClass("thisclass");
        });
        var cotrs = $(".warp_sh_i li");
        cotrs.live('click',function(){
            // var date1 = '';
            // var code = '';
            // var arr = {};
            // var code = $(this).attr('data-code');
            // var date1 = $(this).attr('data-date');
            // var starttime = $(this).attr('data-starttime');
            // var endtime = $(this).attr('data-endtime');
            // var set = $(this).find('span').text();
            // var arr = {
            // 'date1':date1,
            // 'code':code,
            // 'starttime':starttime,
            // 'endtime':endtime,
            // 'set':set
            // }
            var code = $(this).attr('data-code');
            var type = $(this).attr('data-type');
            //console.log(arr);return;
           // ajax_job_list(code);
            switch_type_list(type,code);
            $(this).addClass("thisclass").siblings().removeClass("thisclass");
            $(this).parent().parent().next('.warp_sh_u').find('li').hide()
            $(this).parent().parent().next('.warp_sh_u').find('li').eq($(this).index()).show();
        });
     });
	//获取场次
	function ajax_res(activityCode,type){
		var html = '';  //文字信息
        switch(type){
            case 'job':
                $(".warp_hd_u_bg").html("<img src='../wap/img/loading.gif' style='width:24px;heigth:24px; margin:0 auto;display:block'/>");
                html+= '<b style="background: url(../wap/img/pws_105.png) no-repeat left center;background-size: 20px 20px">志愿服务岗位</b>\
                        <span>按民政部规定获取法定志愿服务时间</span>';
                ajax_day_list(activityCode,type,1);
            break;
            case 'task':
                $(".warp_hd_u_bg").html("<img src='../wap/img/loading.gif' style='width:24px;heigth:24px; margin:0 auto;display:block'/>");
                html+= '<b style="background: url(../wap/img/pws_105.png) no-repeat left center;background-size: 20px 20px">志愿服务任务</b>\
                        <span>按任务是否达成计算志愿服务时间</span>';
                ajax_day_list(activityCode,type,1);  
            break;
            case 'ticket':
                $(".warp_hd_u_bg").html("<img src='../wap/img/loading.gif' style='width:24px;heigth:24px; margin:0 auto;display:block'/>");
                html+= '<b style="background: url(../wap/img/pws_108.png) no-repeat left center;background-size: 20px 20px">公众门票</b>\
                        <span>对公众开放的活动名额，不获取志愿服务时间</span><span>'+'</span>';
                ajax_ticket_list(activityCode)
            break;
            case 'manage':
                $(".warp_hd_u_bg").html("<img src='../wap/img/loading.gif' style='width:24px;heigth:24px; margin:0 auto;display:block'/>");
                html+= '<b style="background: url(../wap/img/pws_108.png) no-repeat left center;background-size: 20px 20px">管理人员工作证</b>\
                        <span>管理员将获取现场的管理权限</span>';
                ajax_manage_list(activityCode)
            break;
            case 'guestcard':
                $(".warp_hd_u_bg").html("<img src='../wap/img/loading.gif' style='width:24px;heigth:24px; margin:0 auto;display:block'/>");
                html+= '<b style="background: url(../wap/img/pws_110.png) no-repeat left center;background-size: 20px 20px">嘉宾邀请函<a href="tel:'+contactPhone+'">咨询电话：'+contactPhone+'</a></b>\
                        <span>参加本次活动的嘉宾</span>\
                        <div class="warp_hd_t_mg">\
                        <div class="warp_hd_p_sn">\
                            <em></em>\
                            <b>已邀请嘉宾</b>\
                        </div>\
                        <ul class="warp_hd_p_sc">\
                        </ul>\
                    </div>';
                ajax_guestcard_list(activityCode)
            break;
            case 'mediacard':
                $(".warp_hd_u_bg").html("<img src='../wap/img/loading.gif' style='width:24px;heigth:24px; margin:0 auto;display:block'/>");
                html+= '<b style="background: url(../wap/img/pws_111.png) no-repeat left center;background-size: 20px 20px">媒体采访邀请函<a href="tel:'+contactPhone+'">咨询电话：'+contactPhone+'</a></b>\
                        <span>参加本次活动的媒体记者</span>\
                                <div class="warp_hd_t_mg">\
                        <div class="warp_hd_p_sn">\
                        <em></em>\
                        <b>已邀请媒体</b>\
                        </div>\
                        <ul class="warp_hd_p_sc">\
                        </ul>\
                        </div>';
                ajax_mediacard_list(activityCode)
            break;
        }
        
        $('.warp_hd_u_bg').empty();
        $('.warp_hd_u_bg').html(html);
        
	}
    //获取已登录用户报名或者审核信息
    function get_user_recruit_msg(sectionCode,user){
        // console.log(sectionCode);
        console.log(111);
        $.ajax({
            xhrFields: {
               withCredentials: true
            },
            type:'POST',
            url: base_url + 'html5/v1/recruit/findBySectionCode',
            data:JSON.stringify({'sectionCode':sectionCode,'user':user.userId}),
            dataType:'json',
            contentType: "application/json;charset=utf-8",
            success:function(data){
                console.log(data);
                if(data.code==0){
                    console.log(data);
                }else{
                    layer.open({
                    content: data.msg
                    ,skin: 'msg'
                    ,time: 1 //2秒后自动关闭
                    });
                    return false;
                }

            },
            error:function(data){
                layer.open({
                    content: '获取失败'
                    ,skin: 'msg'
                    ,time: 1 //2秒后自动关闭
                    });
                    return false;
            }
        })
    }
    //获取 时间
    /** 
     *  @param activityCode 时间code
     *  @param type 类型
     * 是否需要日期
     */
    function ajax_day_list(activityCode,type,status=''){
    var html1 = '';  //文字信息
        $.ajax({
            xhrFields: {
               withCredentials: true
            },
            type:'POST',
            url: base_url + 'html5/v1/section/findByActivityCode',
            data:JSON.stringify({'activityCode':activityCode}),
            dataType:'json',
            contentType: "application/json;charset=utf-8",
            beforeSend:function(XMLHttpRequest){
                
                $(".warp_sh_p").html("<img src='../wap/img/loading.gif' style='width:24px;heigth:24px; margin:0 auto;display:block'/>");
            },
            success:function(data){
                console.log(data);
                if(data.code==0){
                    var data1 = data.data.list;
                    if(data1!=null && data1!=""){
                        localStorage.setItem('act_date_list',JSON.stringify(data1));
                        html1 +='<div class="warp_hr">\
                                    <div class="swiper-container">\
                                <div class="swiper-wrapper">';
                        $.each(data1,function(index,val){
                            var thisclass = index==0?'thisclass':'';
                            html1 +='<div data-actid="'+val['sections'][0]['code']+'" data-day="'+val.day+'" data-type="'+type+'" class="swiper-slide '+thisclass+'">\
                                    <a href="javascript:void(0)">'+val.day.slice(5)+'</a>\
                                 </div>';

                        });

                        html1 += '</div>\
                            </div>\
                            <div class="swiper-button-next"></div>\
                            <div class="swiper-button-prev"></div>\
                            </div>';
                        $('.warp_sh_p').empty();
                        $('.warp_sh_p').html(html1);
                        //ajax_sections(data1[0]['sections'],data1[0]['day'],type);

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
                        var zu = 0;
                        $(".swiper-wrapper div").each(function(index, val){
                            if($(this).attr('data-day')==formatDate(now)){
                                $(this).click();
                                zu = Math.ceil(((index+1)/4))-1;
                            }
                        });
                        if(zu==0){
                            ajax_sections(data1[0]['sections'],data1[0]['day'],type);
                        }else{
                            for(var i=0;i<zu;i++){
                                $(".swiper-button-next").click();
                            }
                        }
                    }else{
                        $('.warp_sh_p').empty();
                        layer.open({
                            content: '暂无数据'
                            ,skin: 'msg'
                            ,time: 1 //2秒后自动关闭
                        });
                        return false;
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
            error:function(data){
                layer.open({
                    content: '获取失败'
                    ,skin: 'msg'
                    ,time: 1 //2秒后自动关闭
                    });
                    return false;
            }
        })
  
    }
	function ajax_sections(sections,day,type){
            var html = '';
            var name = '';
            var index2 = '';
            //console.log(type);
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
                html += '<li style="cursor:pointer" class="'+class1+'" data-type="'+type+'" data-date="'+day+'" data-code="'+val2.code+'" data-startTime="'+val2.startTime+'" data-endTime="'+val2.endTime+'">\
                        <span>'+name+'</span>\
                        <i></i>\
                        </li>';

            })
            $('.warp_sh_i').empty();
            $('.warp_sh_i').html(html); 
            switch_type_list(type,sections[0]['code']);
    }
    //选择具体执行的 内容
    /**
     * type  执行获取的内容列表
     * code  获取具体场次
     */
    function switch_type_list(type,code){
        switch(type){
            case 'job':
            ajax_job_list(code);
            break;
            case 'task':
            ajax_task_list(code);
            break;
        }
    }
    //获取岗位报名列表
    function ajax_job_list(sectionCode){
    	var html = '';
        var type = '';
        var audit = '';
        var self = '';
        var insurance ='';
        if(user_msg!=''){
            var data = {'sectionCode':sectionCode,'user':user_msg.userId};
        }else{
            var data = {'sectionCode':sectionCode};
        }
    	//console.log(data);
    	$.ajax({
            xhrFields: {
               withCredentials: true
            },
            type:'POST',
            url: base_url + 'html5/v1/recruit/findBySectionCode',
            data:JSON.stringify(data),
            dataType:'json',
            contentType: "application/json;charset=utf-8",
            beforeSend:function(XMLHttpRequest){
                $(".warp_hd_u_ba").html("<img src='../wap/img/loading.gif' style='width:24px;heigth:24px; margin:0 auto;display:block'/>");
            },
            success:function(data){
                // console.log(2222);
                // console.log(data);
            	if(data.code==0){
            		var data1 = data.data;
                    if(data1==''){
                        layer.open({
                        content: '志愿服务岗位查询结果为空'
                        ,skin: 'msg'
                        ,time: 1 //2秒后自动关闭
                        });
                        $('.warp_hd_u_ba').empty();
                        return false;
                    }
                    //console.log(data1);

            		$.each(data1,function(index,val){
                        var dateStr = val.arriveTime;
                        var dat_msg = get_day_and_week(dateStr);
                        //console.log(dat_msg);
                        var type = val.type==10?'<span>报名制</span>':'<span>选拔制</span>';
                        var audit = val.audit==10?'<span>需审核</span>':'';
                        var self = val.self==10?'<span>本机构成员</span>':'';
                        var insurance = val.insurance==10?'<span>保险保障</span>':'';
            			html += '<li>\
			                <div class="warp_hd_u_bm">';
                        if(val.type==10){
                                if(val.applyState == 10){
                                    html += '<a href="javascript:void(0)" style="background: #999;">待审核</a>';
                                }else if(val.applyState == 20){
                                    html += '<a href="javascript:void(0)" style="background: #999;">已报名</a>';
                                }else{
                                    if(state==30 || state==40){
                                        html += '<a href="javascript:void(0)" style="background: #999;">已结束</a>';
                                    }else{
                                        html += '<a href="javascript:void(0)" data-actcode="'+$_GET['activityCode']+'" data-sectioncode="'+val.sectionCode+'" data-actjobcode="'+val.code+'" data-jobtype="'+val.type+'" data-type="job" data-name="岗位" data-audit="'+val.audit+'" data-order="'+val.ticketOrder+'">'+warp_hd_u_bm_html+'</a>';
                                    }
                                }
                        }else{
                            if(localStorage.getItem(val.code)==undefined){
                                if(state==30 || state==40){
                                    html += '<a href="javascript:void(0)" style="background: #999;">已结束</a>';
                                }else{
                                    html += '<b data-actcode="'+$_GET['activityCode']+'" data-sectioncode="'+val.sectionCode+'" data-actjobcode="'+val.code+'" data-jobtype="'+val.type+'" data-type="job" data-name="岗位" data-audit="'+val.audit+'" data-order="'+val.ticketOrder+'" onclick="openDaTi(this)">答题</b>';
                                }
                            }else{
                                if(val.applyState == 10){
                                    html += '<a href="javascript:void(0)" style="background: #999;">待审核</a>';
                                }else if(val.applyState == 20){
                                    html += '<a href="javascript:void(0)" style="background: #999;">已报名</a>';
                                }else{
                                    if(state==30 || state==40){
                                        html += '<a href="javascript:void(0)" style="background: #999;">已结束</a>';
                                    }else {
                                        html += '<a href="javascript:void(0)" data-actcode="' + $_GET['activityCode'] + '" data-sectioncode="' + val.sectionCode + '" data-actjobcode="' + val.code + '" data-jobtype="' + val.type + '" data-type="job" data-name="岗位" data-audit="' + val.audit + '" data-order="' + val.ticketOrder + '">'+warp_hd_u_bm_html+'</a>';
                                    }
                                }
                            }
			                
                        }
                        var arriveTime = split_datetime(val.arriveTime);
                        html += '<span>已报<i>'+val.applyCount+'</i>/需'+val.total+'</span>\
    			                </div>\
    			                <div class="warp_hd_u_bn">\
    			                    <b>'+val.name+'</b>\
    			                    <div class="warp_hd_u_bb">'+type+audit+self+insurance+'\
    			                    </div>\
    			                    <div class="warp_hd_u_bv">\
    			                        <span data-val="'+val.arriveTime+'" data-date="'+dat_msg.md+'">'+arriveTime.date + " " + arriveTime.str+'报到</span>\
    			                        <span>服务'+ChangeHourMinutestr(val.times)+'</span>\
    			                        <span>获赠'+val.inIntegral+'积分</span>\
    			                        <span>报名开始时间'+substrSeconds(val.applyBeginTime)+'</span>\
    			                        <span>报名结束时间'+substrSeconds(val.applyEndTime)+'</span>\
                                      <input type="hidden" value="'+dat_msg.week+'">\
    			                    </div>\
    			                </div>\
    			            </li>';
            		})
            	$('.warp_hd_u_ba').empty();
                $('.warp_hd_u_ba').html(html);
            	}else{
                    layer.open({
                    content: data.msg
                    ,skin: 'msg'
                    ,time: 1 //2秒后自动关闭
                    });
                    $('.warp_hd_u_ba').empty();
                    return false;
                }
            	
            },
            error:function(){
            	layer.open({
                content: '获取失败'
                ,skin: 'msg'
                ,time: 1 //2秒后自动关闭
                });
                $('.warp_hd_u_ba').empty();
                return false;
            }
        })
    }
    //获取服务任务列表
    function ajax_task_list(sectionCode){
        var html = '';
        var type = '';
        var audit = '';
        var self = '';
        var insurance = '';
        var sendPublicTickets = '';
        //console.log('task');
        if(user_msg!=''){
            var data = {'sectionCode':sectionCode,'user':user_msg.userId};
        }else{
            var data = {'sectionCode':sectionCode};
        }
        $.ajax({
            xhrFields: {
               withCredentials: true
            },
            type:'POST',
            url: base_url + 'html5/v1/task/queryBySectionCode',
            data:JSON.stringify(data),
            dataType:'json',
            contentType: "application/json;charset=utf-8",
            beforeSend:function(XMLHttpRequest){
                $(".warp_hd_u_ba").html("<img src='../wap/img/loading.gif' style='width:24px;heigth:24px; margin:0 auto;display:block'/>");
            },
            success:function(data){
                console.log(data);
                if(data.code==0){
                    var data1 = data.data;
                    if(data1==''){
                        layer.open({
                        content: '志愿服务任务查询结果为空'
                        ,skin: 'msg'
                        ,time: 1 //2秒后自动关闭
                        });
                        $('.warp_hd_u_ba').empty();
                        return false;
                    }
                    $.each(data1,function(index,val){
                        var audit = val.audit==10?'<span>需审核</span>':'';
                        var self = val.self==10?'<span>本机构成员</span>':'';
                        var insurance = val.insurance==10?'<span>保险保障</span>':'';
                        var sendPublicTickets = val.sendPublicTickets==10?'<span>需获得门票</span>':'';
                        var stopTime = get_date(val.stopTime, 0);
                        html += '<li>\
                            <div class="warp_hd_u_bm">';
                        if(val.applyState == 10){
                            html += '<a href="javascript:void(0)" style="background: #999;">待审核</a>';
                        }else if(val.applyState == 20){
                            html += '<a href="javascript:void(0)" style="background: #999;">已报名</a>';
                        }else{
                            if(state==30 || state==40){
                                html += '<a href="javascript:void(0)" style="background: #999;">已结束</a>';
                            }else {
                                html += '<a href="javascript:void(0)" data-actcode="' + $_GET['activityCode'] + '" data-sectioncode="' + val.sectionCode + '" data-actjobcode="' + val.code + '" data-jobtype="' + val.sendPublicTickets + '" data-type="task" data-name="任务" data-audit="' + val.audit + '" data-order="' + val.ticketOrder + '" data-publicorder="' + val.publicTicketOrder + '">'+warp_hd_u_bm_html+'</a>';
                            }
                        }
                        html += '<span>已报<i>'+val.applyCount+'</i>/需'+val.total+'</span>\
                            </div>\
                            <div class="warp_hd_u_bn">\
                                <b>'+val.name+'</b>\
                                <div class="warp_hd_u_bb">'+audit+self+insurance+sendPublicTickets+'\
                                </div>\
                                <div class="warp_hd_u_bv">\
                                    <span data-val="'+stopTime+'">'+stopTime+'截止</span>\
                                    <span>服务'+ChangeHourMinutestr(val.times)+'</span>\
                                    <span>获赠'+val.inIntegral+'积分</span>\
                                <span>报名开始时间'+substrSeconds(val.applyBeginTime)+'</span>\
                                <span>报名结束时间'+substrSeconds(val.applyEndTime)+'</span>\
                                </div>\
                            </div>\
                        </li>';
                    })
                $('.warp_hd_u_ba').empty();
                $('.warp_hd_u_ba').html(html);
                }else{
                    layer.open({
                    content: data.msg
                    ,skin: 'msg'
                    ,time: 1 //2秒后自动关闭
                    });
                    $('.warp_hd_u_ba').empty();
                    return false;
                }
                
            },
            error:function(){
                layer.open({
                content: '获取失败'
                ,skin: 'msg'
                ,time: 1 //2秒后自动关闭
                });
                $('.warp_hd_u_ba').empty();
                return false;
            }
        })
    }
    ///公众门票报名列表
    function ajax_ticket_list(activityCode){
        var html = '';
        var audit = '';
        var self = '';
        $('.warp_sh_i').empty();
        $('.warp_sh_p').empty();
        //console.log('task');
        if(user_msg!=''){
            var data = {'activityCode':activityCode,'user':user_msg.userId};
        }else{
            var data = {'activityCode':activityCode};
        }
        $.ajax({
            xhrFields: {
               withCredentials: true
            },
            type:'POST',
            url:base_url + 'html5/v1/public/queryList',
            data:JSON.stringify(data),
            dataType:'json',
            contentType: "application/json;charset=utf-8",
            beforeSend:function(XMLHttpRequest){
                $(".warp_hd_u_ba").html("<img src='../wap/img/loading.gif' style='width:24px;heigth:24px; margin:0 auto;display:block'/>");
            },
            success:function(data){
                console.log('门票');
                console.log(data);
                if(data.code==0){
                    var data1 = data.data;
                    //console.log(data1);
                    $.each(data1,function(index,val){
                        var audit = val.audit==10?'<span>需审核</span>':'';
                        var self = val.self==10?'<span>本机构成员</span>':'';
                        html += '<li>\
                            <div class="warp_hd_u_bm">';
                        if(val.applyState == 10){
                            html += '<a href="javascript:void(0)" style="background: #999;">待审核</a>';
                        }else if(val.applyState == 20){
                            html += '<a href="javascript:void(0)" style="background: #999;">已报名</a>';
                        }else {
                            if (state == 30 || state == 40) {
                                html += '<a href="javascript:void(0)" style="background: #999;">已结束</a>';
                            } else {
                                html += '<a href="javascript:void(0)" data-actcode="' + $_GET['activityCode'] + '" data-sectioncode="' + val.sectionCode + '" data-actjobcode="' + val.code + '" data-jobtype="' + val.type + '" data-type="ticket" data-name="公众门票" data-audit="' + val.audit + '">'+warp_hd_u_bm_html+'</a>';
                            }
                        }
                        html += '<span>已报<i>'+val.applyCount+'</i>/需'+val.total+'</span>\
                            </div>\
                            <div class="warp_hd_u_bn">\
                                <b>'+val.name+'</b>\
                                <div class="warp_hd_u_bb">'+audit+self+'\
                                </div>\
                                <div class="warp_hd_u_bv">\
                                    <span data-val="'+val.arriveAddress+'">地址：'+val.arriveAddress+'</span>\
                                    <span>时间：'+get_date(val.arriveTime,0)+'</span>\
                                    <span>获赠'+val.inIntegral+'积分</span>\
                                </div>\
                            </div>\
                        </li>';
                    })
                $('.warp_hd_u_ba').empty();
                $('.warp_hd_u_ba').html(html);
                }else{
                    layer.open({
                    content: data.msg
                    ,skin: 'msg'
                    ,time: 1 //2秒后自动关闭
                    });
                    $('.warp_hd_u_ba').empty();
                    return false;
                }
                
            },
            error:function(){
                layer.open({
                content: '获取失败'
                ,skin: 'msg'
                ,time: 1 //2秒后自动关闭
                });
                $('.warp_hd_u_ba').empty();
                return false;
            }
        })
    }
    ///管理员工作证
    function ajax_manage_list(activityCode){
        var html = '';
        var self = '';
        $('.warp_sh_i').empty();
        $('.warp_sh_p').empty();
        //console.log('task');
        if(user_msg!=''){
            var data = {'activityCode':activityCode,'user':user_msg.userId};
        }else{
            var data = {'activityCode':activityCode};
        }
        $.ajax({
            xhrFields: {
               withCredentials: true
            },
            type:'POST',
            url:base_url + 'html5/v1/manager/queryList',
            data:JSON.stringify(data),
            dataType:'json',
            contentType: "application/json;charset=utf-8",
            beforeSend:function(XMLHttpRequest){
                $(".warp_hd_u_ba").html("<img src='../wap/img/loading.gif' style='width:24px;heigth:24px; margin:0 auto;display:block'/>");
            },
            success:function(data){
                //console.log('管理');
                //console.log(data);
                if(data.code==0){
                    var data1 = data.data;
                    //console.log(data1);
                    $.each(data1,function(index,val){
                        var self = val.self==10?'<span>本机构成员</span>':'';
                        html += '<li>\
                            <div class="warp_hd_u_bm">';
                        if(val.applyState == 10){
                            html += '<a href="javascript:void(0)" style="background: #999;">待审核</a>';
                        }else if(val.applyState == 20){
                            html += '<a href="javascript:void(0)" style="background: #999;">已报名</a>';
                        }else{
                            if(state==30 || state==40){
                                html += '<a href="javascript:void(0)" style="background: #999;">已结束</a>';
                            }else {
                                html += '<a href="javascript:void(0)" data-actcode="' + $_GET['activityCode'] + '" data-sectioncode="' + val.sectionCode + '" data-actjobcode="' + val.code + '" data-jobtype="' + val.type + '" data-type="manage" data-name="管理员工作证" data-audit="' + val.audit + '" data-order="' + val.ticketOrder + '">'+warp_hd_u_bm_html+'</a>';
                            }
                        }
                        html += '<span>已报<i>'+val.applyCount+'</i>/需'+val.total+'</span>\
                            </div>\
                            <div class="warp_hd_u_bn">\
                                <b>'+val.name+'</b>\
                                <div class="warp_hd_u_bb">'+self+'\
                                </div>\
                                <div class="warp_hd_u_bv">\
                                    <span data-val="'+val.arriveAddress+'">报到地点：'+val.arriveAddress+'</span>\
                                    <span>时间：'+get_date(val.arriveTime,0)+'</span>\
                                    <span>获赠'+val.inIntegral+'积分</span>\
                                </div>\
                            </div>\
                        </li>';
                    })
                $('.warp_hd_u_ba').empty();
                $('.warp_hd_u_ba').html(html);
                }else{
                    layer.open({
                    content: data.msg
                    ,skin: 'msg'
                    ,time: 1 //2秒后自动关闭
                    });
                    $('.warp_hd_u_ba').empty();
                    return false;
                }
                
            },
            error:function(){
                layer.open({
                content: '获取失败'
                ,skin: 'msg'
                ,time: 1 //2秒后自动关闭
                });
                $('.warp_hd_u_ba').empty();
                return false;
            }
        })
    }
     ///嘉宾邀请函工作证
    function ajax_guestcard_list(activityCode){
        var html = '';
        var html1 = '';
        var audit = '';
        var self = '';
        $('.warp_sh_i').empty();
        $('.warp_sh_p').empty();
        //console.log('task');
        if(user_msg!=''){
            var data = {'activityCode':activityCode,"type":50,'user':user_msg.userId};
        }else{
            var data = {'activityCode':activityCode,"type":50};
        }
        $.ajax({
            xhrFields: {
               withCredentials: true
            },
            type:'POST',
            url:base_url + 'html5/v1/mediaGuest/queryMediaList',
            data:JSON.stringify(data),
            dataType:'json',
            contentType: "application/json;charset=utf-8",
            beforeSend:function(XMLHttpRequest){
                $(".warp_hd_u_ba").html("<img src='../wap/img/loading.gif' style='width:24px;heigth:24px; margin:0 auto;display:block'/>");
            },
            success:function(data){
                //console.log('嘉宾');
                //console.log(data);
                if(data.code==0){
                    var data1 = data.data.sectionMediaVOList;
                    var data2 = data.data.sectionMediaApplyList;
                    //console.log(data1);
                    $.each(data1,function(index,val){
                        var audit = val.audit==10?'<span>需审核</span>':'';
                        var self = val.self==10?'<span>本机构成员</span>':'';
                        html += '<li>\
                            <div class="warp_hd_u_bm">';
                            if(val.applyState == 10){
                                html += '<a href="javascript:void(0)" style="background: #999;">待审核</a>';
                            }else if(val.applyState == 20){
                                html += '<a href="javascript:void(0)" style="background: #999;">已报名</a>';
                            }else{
                                if(state==30 || state==40){
                                    html += '<a href="javascript:void(0)" style="background: #999;">已结束</a>';
                                }else {
                                    html += '<a href="javascript:void(0)" data-actcode="' + $_GET['activityCode'] + '" data-sectioncode="' + val.sectionCode + '" data-actjobcode="' + val.code + '" data-jobtype="' + val.type + '" data-type="guestcard" data-name="嘉宾邀请函" data-audit="' + val.audit + '" data-order="' + val.ticketOrder + '">'+warp_hd_u_bm_html+'</a>';
                                }
                            }
                            html += '<span>已报<i>'+val.applyCount+'</i>/需'+val.total+'</span>\
                            </div>\
                            <div class="warp_hd_u_bn">\
                                <b>'+val.name+'</b>\
                                <div class="warp_hd_u_bb">'+audit+self+'\
                                </div>\
                                <div class="warp_hd_u_bv">\
                                    <span data-val="'+val.arriveAddress+'">报到地点：'+val.arriveAddress+'</span>\
                                    <span>时间：'+get_date(val.arriveTime,0)+'</span>\
                                    <span>获赠'+val.inIntegral+'积分</span>\
                                </div>\
                            </div>\
                        </li>';
                       
                    })
                $.each(data2,function(index,val){
                        html1 +='<li>\
                                <img src="../wap/img/pws_244.png">\
                                <span>'+val.realName+'</span>\
                            </li>';
                    })
                $('.warp_hd_p_sc').empty();
                $('.warp_hd_p_sc').html(html1)
                $('.warp_hd_u_ba').empty();
                $('.warp_hd_u_ba').html(html);

                }else{
                    layer.open({
                    content: '嘉宾邀请函查询结果为空'
                    ,skin: 'msg'
                    ,time: 1 //2秒后自动关闭
                    });
                    $('.warp_hd_u_ba').empty();
                    return false;
                }
                
            },
            error:function(){
                layer.open({
                content: '获取失败'
                ,skin: 'msg'
                ,time: 1 //2秒后自动关闭
                });
                $('.warp_hd_u_ba').empty();
                return false;
            }
        })
    }
      ///媒体邀请函工作证
    function ajax_mediacard_list(activityCode){
        var html = '';
        var html1 = '';
        var audit = '';
        var self = '';
        $('.warp_sh_i').empty();
        $('.warp_sh_p').empty();
        //console.log('task');
        if(user_msg!=''){
            var data = {'activityCode':activityCode,"type":60,'user':user_msg.userId};
        }else{
            var data = {'activityCode':activityCode,"type":60};
        }
        $.ajax({
            xhrFields: {
               withCredentials: true
            },
            type:'POST',
            url:base_url + 'html5/v1/mediaGuest/queryMediaList',
            data:JSON.stringify(data),
            dataType:'json',
            contentType: "application/json;charset=utf-8",
            beforeSend:function(XMLHttpRequest){
                $(".warp_hd_u_ba").html("<img src='../wap/img/loading.gif' style='width:24px;heigth:24px; margin:0 auto;display:block'/>");
            },
            success:function(data){
                
                if(data.code==0){
                    var data1 = data.data.sectionMediaVOList;
                    var data2 = data.data.sectionMediaApplyList;
                    //console.log(data1);
                    $.each(data1,function(index,val){
                        var audit = val.audit==10?'<span>需审核</span>':'';
                        var self = val.self==10?'<span>本机构成员</span>':'';
                        html += '<li>\
                            <div class="warp_hd_u_bm">';
                            if(val.applyState == 10){
                                html += '<a href="javascript:void(0)" style="background: #999;">待审核</a>';
                            }else if(val.applyState == 20){
                                html += '<a href="javascript:void(0)" style="background: #999;">已报名</a>';
                            }else{
                                if(state==30 || state==40){
                                    html += '<a href="javascript:void(0)" style="background: #999;">已结束</a>';
                                }else {
                                    html += '<a href="javascript:void(0)" data-actcode="' + $_GET['activityCode'] + '" data-sectioncode="' + val.sectionCode + '" data-actjobcode="' + val.code + '" data-jobtype="' + val.type + '" data-type="mediacard" data-name="媒体邀请函" data-audit="' + val.audit + '" data-order="' + val.ticketOrder + '">'+warp_hd_u_bm_html+'</a>';
                                }
                            }
                            html += '<span>已报<i>'+val.applyCount+'</i>/需'+val.total+'</span>\
                            </div>\
                            <div class="warp_hd_u_bn">\
                                <b>'+val.name+'</b>\
                                <div class="warp_hd_u_bb">'+audit+self+'\
                                </div>\
                                <div class="warp_hd_u_bv">\
                                    <span data-val="'+val.arriveAddress+'">报到地点：'+val.arriveAddress+'</span>\
                                    <span>时间：'+get_date(val.arriveTime,0)+'</span>\
                                    <span>获赠'+val.inIntegral+'积分</span>\
                                </div>\
                            </div>\
                        </li>';
                       
                    })
                $.each(data2,function(index,val){
                        html1 +='<li>\
                                <img src="../wap/img/pws_244.png">\
                                <span style="height: 38px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">'+val.realName+"<br />"+val.unit+'</span>\
                            </li>';
                    })
                $('.warp_hd_p_sc').empty();
                $('.warp_hd_p_sc').html(html1)
                $('.warp_hd_u_ba').empty();
                $('.warp_hd_u_ba').html(html);

                }else{
                    layer.open({
                    content: data.msg
                    ,skin: 'msg'
                    ,time: 1 //2秒后自动关闭
                    });
                    $('.warp_hd_u_ba').empty();
                    return false;
                }
                
            },
            error:function(){
                layer.open({
                content: '获取失败'
                ,skin: 'msg'
                ,time: 1 //2秒后自动关闭
                });
                $('.warp_hd_u_ba').empty();
                return false;
            }
        })
    }
    //获取当前日期 以及 当前是星期几
    function get_day_and_week(dateStr){
        var json = {}
        var reg = /^(\d{4})-(\d{1,2})-(\d{1,2}) (\d{1,2}):(\d{1,2})$/;
        dateStr.match(reg);
        var year1 = (RegExp.$1);
        var mod = (RegExp.$2);
        var day1 = (RegExp.$3);
        //console.log(dateStr);
        var s = year1 +'-'+mod+'-'+day1; 
        var week = "星期"+"天一二三四五六 ".charAt(new   Date(s).getDay());
        var json = {"md":mod+'-'+day1,"week":week};
        return json;
    }
    $(document).on("click", ".warp_hd_u_bm a", function () {
    //$(".warp_hd_u_bm a").live("click",function(){
        var obj_msg = {};
        /******报名信息*****/
        var job = $(this).parent().next('.warp_hd_u_bn');
        var obj_msg ={
            "actcode" : $(this).attr('data-actcode'),
            "sectioncode" : $(this).attr('data-sectioncode'),
            "code" : $(this).attr('data-actjobcode'),
            "jobtype" : $(this).attr('data-jobtype'),
            "audit" : $(this).attr('data-audit'),
            "dname" : $(this).attr('data-name'),
            "type" : $(this).attr('data-type'),
            "name" :job.find('b').text(),
            "arrive_time" :job.find('.warp_hd_u_bv').find('span:eq(0)').attr('data-val'),
            "data_date" :job.find('.warp_hd_u_bv').find('span:eq(0)').attr('data-date'),
            "times" :job.find('.warp_hd_u_bv').find('span:eq(1)').text(),
            "week" :job.find('.warp_hd_u_bv').find('input').val(),
            "order" :$(this).attr('data-order'),
            "publicorder" : $(this).attr('data-publicorder'),
        }
        var this_msg = $(this);
        ajax_msg_enroll(obj_msg,this_msg);
        /*****报名信息******/
    });
    //岗位答题问卷跳转
    function openDaTi(obj){
    //$(".warp_hd_u_bm b").live('click',function(){
        //var title =$(".warp_hd_u_bq");
        var code = $(obj).attr("data-actjobcode");
        var activityCode = $(obj).attr("data-actcode");
        var ticketOrder = $(obj).attr("data-order");

        window.location.href = "./activity_question.html?activityCode="+activityCode+"&recruitcode="+code+"&ticketOrder="+ticketOrder;
    }
    $(document).on("click", ".warp_lb_t_li a", function () {
    //$(".warp_lb_t_li a").live("click",function(){
            $(".warp_lb_t").fadeOut();
            get_activity_msg();
    });
    //活动报名
    //ajax提交报名
    function ajax_msg_enroll(obj_msg,this_msg){
        switch(obj_msg.type){
            case "job":
            job_enroll(obj_msg,this_msg);
            break;
            case "task":
            task_enroll(obj_msg,this_msg);
            break;
            case "ticket":
            ticket_enroll(obj_msg,this_msg);
            break;
            case "manage":
            manage_enroll(obj_msg,this_msg);
            break;
            case "guestcard":
            guestcard_enroll(obj_msg,this_msg);
            break;
            case "mediacard":
            mediacard_enroll(obj_msg,this_msg);
            break;
        }

        // $.ajax({
        //     type:'POST',
        //     url:"{:U('Activity/ajax_enroll_"+obj_msg.type+"')}",
        //     data:obj_msg,
        //     dataType:'json',
        //     success:function(data){
        //         if(data.status==1){
        //             $(".warp_hd_t_mt b").text(obj_msg.data_date);
        //             $(".warp_hd_t_mt span").text(obj_msg.week);
        //             $(".warp_hd_t_mj span").html('"'+obj_msg.name+'"'+"<i>"+obj_msg.dname+"</i>");
        //             $(".warp_hd_t_mh").find('li').eq(0).find('span').text(obj_msg.arrive_time +' '+obj_msg.times);
        //             var addr = $(".warp_hd_u_bq a").text();
        //             $(".warp_hd_t_mh").find('li').eq(1).find('span').text(addr);
        //             $(".warp_hd_t").fadeIn();
        //         }else{
        //             layer.open({
        //             content: data.msg
        //             ,skin: 'msg'
        //             ,time: 1 //2秒后自动关闭
        //             });    
        //         }
        //     },
        //     error:function(e){
        //         layer.open({
        //             content: '报名失败'
        //             ,skin: 'msg'
        //             ,time: 1 //2秒后自动关闭
        //             });    
        //     }
        // })
    }
    
    //报名服务岗位
    function job_enroll(obj_msg,this_msg){
        //console.log(obj_msg);return;
        var str = false;
        if(!user_msg||!token){
            layer.open({
                content: '请先登录再报名'
                ,skin: 'msg'
                ,time: 1 //2秒后自动关闭
                });
            return str;
        }
        if(user_msg.userNo==''){
            layer.open({
                content: '请先实名认证后再报名'
                ,skin: 'msg'
                ,time: 1 //2秒后自动关闭
                });
            return str;
        }
        if(obj_msg.jobtype==10){
            var msgdata = JSON.stringify({
                "activityCode" : obj_msg.actcode,
                "sectionCode" : obj_msg.sectioncode,
                "recruitCode" : obj_msg.code,
                "ticketOrder" : obj_msg.order,
                "shareUser" : obj_msg.shareUser,
                "audit" : obj_msg.audit,
                "type" : obj_msg.jobtype,
                "user" : user_msg.userId,
                });
        }else{
            var question =JSON.parse(localStorage.getItem(obj_msg.code));
            var msgdata = JSON.stringify({
                "activityCode" : obj_msg.actcode,
                "sectionCode" : obj_msg.sectioncode,
                "recruitCode" : obj_msg.code,
                "question": question,
                "ticketOrder" : obj_msg.order,
                "shareUser" : obj_msg.shareUser,
                "audit" : obj_msg.audit,
                "type" : obj_msg.jobtype,
                "user" : user_msg.userId,
                });
        }
        //console.log(msgdata);return;
        $.ajax({
            xhrFields: {
               withCredentials: true
            },
            type:'POST',
            url: base_url + 'html5/v1/recruit/applySectionReruit',
            data:msgdata,
            headers : {'token':token},
            dataType:'json',
            contentType: "application/json;charset=utf-8",
            success:function(data){
                if(data.code==0){
                    $(".warp_hd_t_mt b").text(obj_msg.data_date);
                    $(".warp_hd_t_mt span").text(obj_msg.week);
                    $(".warp_hd_t_mj span").html('"'+obj_msg.name+'"'+"<i>"+obj_msg.dname+"</i>");
                    $(".warp_hd_t_mh").find('li').eq(0).find('span').text(obj_msg.arrive_time +' '+obj_msg.times);
                    var addr = $(".warp_hd_u_bq a").text();
                    $(".warp_hd_t_mh").find('li').eq(1).find('span').text(addr);
                    if(obj_msg.audit!=10){
                        var cot = this_msg.next('span').find('i').text();
                        var cot = Number(cot);
                        this_msg.next('span').find('i').text(cot+1);
                    }
                    change_button_msg(this_msg,obj_msg.audit)
                    $(".warp_hd_t").fadeIn();
                    str = true;
                }else if(data.code==7013){
                    layer.open({
                        content: '非本机构成员不可报名，是否加入本机构？'
                        ,btn: ['确定', '取消']
                        ,yes: function(index){
                            jump("../huangye/mobileDetail.html?orgThirdAccount="+orgCode);
                        }
                    });
                    return str;
                }else{
                     layer.open({
                        content: data.msg
                        ,skin: 'msg'
                        ,time: 1 //2秒后自动关闭
                        });
                        return str;
                }

            },
            error:function(){
                layer.open({
                content: '获取失败'
                ,skin: 'msg'
                ,time: 1 //2秒后自动关闭
                });
                return str;
            }
        })
        return str;
    }
     //报名任务
    function task_enroll(obj_msg,this_msg){
        var str = false;
        if(!user_msg||!token){
            layer.open({
                content: '请先登录再报名'
                ,skin: 'msg'
                ,time: 1 //2秒后自动关闭
                });
            return str;
        }
        if(user_msg.userNo==''){
            layer.open({
                content: '请先实名认证后再报名'
                ,skin: 'msg'
                ,time: 1 //2秒后自动关闭
                });
            return str;
        }
        if(obj_msg.jobtype==10){
           var arr = {
                "activityCode" : obj_msg.actcode,
                "audit" : obj_msg.audit,
                "sectionCode" : obj_msg.sectioncode,
                "sendPublicTickets": obj_msg.jobtype,
                "taskCode" : obj_msg.code,
                "ticketOrder" : obj_msg.order,
                "user" : user_msg.userId
                }
        }else{
            var arr = {
                "activityCode" : obj_msg.actcode,
                "audit" : obj_msg.audit,
                "publicTicketOrder" : obj_msg.publicorder,
                "sectionCode" : obj_msg.sectioncode,
                "sendPublicTickets": obj_msg.jobtype,
                "taskCode" : obj_msg.code,
                "ticketOrder" : obj_msg.order,
                "user" : user_msg.userId
                }
        }
        $.ajax({
            xhrFields: {
               withCredentials: true
            },
            type:'POST',
            url: base_url + 'html5/v1/task/apply',
            data:JSON.stringify(arr),
            headers : {'token':token},
            dataType:'json',
            contentType: "application/json;charset=utf-8",
            success:function(data){
                if(data.code==0){
                    $(".warp_hd_t_mt b").text(obj_msg.data_date);
                    $(".warp_hd_t_mt span").text(obj_msg.week);
                    $(".warp_hd_t_mj span").html('"'+obj_msg.name+'"'+"<i>"+obj_msg.dname+"</i>");
                    $(".warp_hd_t_mh").find('li').eq(0).find('span').text(obj_msg.arrive_time +' '+obj_msg.times);
                    var addr = $(".warp_hd_u_bq a").text();
                    $(".warp_hd_t_mh").find('li').eq(1).find('span').text(addr);
                    if(obj_msg.audit!=10){
                        var cot = this_msg.next('span').find('i').text();
                        var cot = Number(cot);
                        this_msg.next('span').find('i').text(cot+1);
                    }
                    change_button_msg(this_msg,obj_msg.audit)
                    $(".warp_hd_t").fadeIn();
                    str = true;
                }else{
                     layer.open({
                        content: data.msg
                        ,skin: 'msg'
                        ,time: 1 //2秒后自动关闭
                        });
                        return str;
                }

            },
            error:function(){
                layer.open({
                content: '获取失败'
                ,skin: 'msg'
                ,time: 1 //2秒后自动关闭
                });
                return str;
            }
        })
        return str;
    }
    //报名门票
    function ticket_enroll(obj_msg,this_msg){
        var str = false;
        if(!user_msg||!token){
            layer.open({
                content: '请先登录再报名'
                ,skin: 'msg'
                ,time: 1 //2秒后自动关闭
                });
            return str;
        }
        if(user_msg.userNo==''){
            layer.open({
                content: '请先实名认证后再报名'
                ,skin: 'msg'
                ,time: 1 //2秒后自动关闭
                });
            return str;
        }
        $.ajax({
            xhrFields: {
               withCredentials: true
            },
            type:'POST',
            url:base_url + 'html5/v1/public/apply',
            data:JSON.stringify({
                    "publicCode" : obj_msg.code,
                    //"ticketOrder" : obj_msg.audit,
                    "audit" : obj_msg.audit,
                    "user" : user_msg.userId
                    }),
            headers : {'token':token},
            dataType:'json',
            contentType: "application/json;charset=utf-8",
            success:function(data){
                if(data.code==0){
                    $(".warp_hd_t_mt b").text(obj_msg.data_date);
                    $(".warp_hd_t_mt span").text(obj_msg.week);
                    $(".warp_hd_t_mj span").html('"'+obj_msg.name+'"'+"<i>"+obj_msg.dname+"</i>");
                    $(".warp_hd_t_mh").find('li').eq(0).find('span').text(obj_msg.arrive_time +' '+obj_msg.times);
                    var addr = $(".warp_hd_u_bq a").text();
                    $(".warp_hd_t_mh").find('li').eq(1).find('span').text(addr);
                    if(obj_msg.audit!=10){
                        var cot = this_msg.next('span').find('i').text();
                        var cot = Number(cot);
                        this_msg.next('span').find('i').text(cot+1);
                    }
                    change_button_msg(this_msg,obj_msg.audit)
                    $(".warp_hd_t").fadeIn();
                    str = true;
                }else{
                     layer.open({
                        content: data.msg
                        ,skin: 'msg'
                        ,time: 1 //2秒后自动关闭
                        });
                        return str;
                }

            },
            error:function(){
                layer.open({
                content: '获取失败'
                ,skin: 'msg'
                ,time: 1 //2秒后自动关闭
                });
                return str;
            }
        })
        return str;
    }
    //报名 管理员工作证
    function manage_enroll(obj_msg,this_msg){
        var str = false;
        if(!user_msg||!token){
            layer.open({
                content: '请先登录再报名'
                ,skin: 'msg'
                ,time: 1 //2秒后自动关闭
                });
            return str;
        }
        if(user_msg.userNo==''){
            layer.open({
                content: '请先实名认证后再报名'
                ,skin: 'msg'
                ,time: 1 //2秒后自动关闭
                });
            return str;
        }
        $.ajax({
            xhrFields: {
               withCredentials: true
            },
            type:'POST',
            url:base_url + 'html5/v1/manager/apply',
            data:JSON.stringify({
                    "code" : obj_msg.code,
                    "ticketOrder" : obj_msg.order,
                    "user" : user_msg.userId
                    }),
            headers : {'token':token},
            dataType:'json',
            contentType: "application/json;charset=utf-8",
            success:function(data){
                if(data.code==0){
                    $(".warp_hd_t_mt b").text(obj_msg.data_date);
                    $(".warp_hd_t_mt span").text(obj_msg.week);
                    $(".warp_hd_t_mj span").html('"'+obj_msg.name+'"'+"<i>"+obj_msg.dname+"</i>");
                    $(".warp_hd_t_mh").find('li').eq(0).find('span').text(obj_msg.arrive_time +' '+obj_msg.times);
                    var addr = $(".warp_hd_u_bq a").text();
                    $(".warp_hd_t_mh").find('li').eq(1).find('span').text(addr);
                    if(obj_msg.audit!=10){
                        var cot = this_msg.next('span').find('i').text();
                        var cot = Number(cot);
                        this_msg.next('span').find('i').text(cot+1);
                    }
                    change_button_msg(this_msg,obj_msg.audit)
                    $(".warp_hd_t").fadeIn();
                    str = true;
                }else{
                     layer.open({
                        content: data.msg
                        ,skin: 'msg'
                        ,time: 1 //2秒后自动关闭
                        });
                        return str;
                }

            },
            error:function(){
                layer.open({
                content: '获取失败'
                ,skin: 'msg'
                ,time: 1 //2秒后自动关闭
                });
                return str;
            }
        })
        return str;
    }
     //报名 嘉宾邀请函工作证
    function guestcard_enroll(obj_msg,this_msg){
        var str = false;
        if(!user_msg||!token){
            layer.open({
                content: '请先登录再报名'
                ,skin: 'msg'
                ,time: 1 //2秒后自动关闭
                });
            return str;
        }
        if(user_msg.userNo==''){
            layer.open({
                content: '请先实名认证后再报名'
                ,skin: 'msg'
                ,time: 1 //2秒后自动关闭
                });
            return str;
        }
        $.ajax({
            xhrFields: {
               withCredentials: true
            },
            type:'POST',
            url:base_url + 'html5/v1/mediaGuest/apply',
            data:JSON.stringify({
                    "mediaGuestCode" : obj_msg.code,
                    "ticketOrder" :obj_msg.order,
                    "audit" : obj_msg.audit,
                    "user" : user_msg.userId
                    }),
            headers : {'token':token},
            dataType:'json',
            contentType: "application/json;charset=utf-8",
            success:function(data){
                if(data.code==0){
                    $(".warp_hd_t_mt b").text(obj_msg.data_date);
                    $(".warp_hd_t_mt span").text(obj_msg.week);
                    $(".warp_hd_t_mj span").html('"'+obj_msg.name+'"'+"<i>"+obj_msg.dname+"</i>");
                    $(".warp_hd_t_mh").find('li').eq(0).find('span').text(obj_msg.arrive_time +' '+obj_msg.times);
                    var addr = $(".warp_hd_u_bq a").text();
                    $(".warp_hd_t_mh").find('li').eq(1).find('span').text(addr);
                    if(obj_msg.audit!=10){
                        var cot = this_msg.next('span').find('i').text();
                        var cot = Number(cot);
                        this_msg.next('span').find('i').text(cot+1);
                    }
                    change_button_msg(this_msg,obj_msg.audit)
                    $(".warp_hd_t").fadeIn();
                    str = true;
                }else{
                     layer.open({
                        content: data.msg
                        ,skin: 'msg'
                        ,time: 1 //2秒后自动关闭
                        });
                        return str;
                }

            },
            error:function(){
                layer.open({
                content: '获取失败'
                ,skin: 'msg'
                ,time: 1 //2秒后自动关闭
                });
                return str;
            }
        })
        return str;
    }
     //报名 媒体邀请函工作证
    function mediacard_enroll(obj_msg,this_msg){
        var str = false;
        if(!user_msg||!token){
            layer.open({
                content: '请先登录再报名'
                ,skin: 'msg'
                ,time: 1 //2秒后自动关闭
                });
            return str;
        }
        if(user_msg.userNo==''){
            layer.open({
                content: '请先实名认证后再报名'
                ,skin: 'msg'
                ,time: 1 //2秒后自动关闭
                });
            return str;
        }
        $.ajax({
            xhrFields: {
               withCredentials: true
            },
            type:'POST',
            url:base_url + 'html5/v1/mediaGuest/apply',
            data:JSON.stringify({
                    "mediaGuestCode" : obj_msg.code,
                    "ticketOrder" :obj_msg.order,
                    "audit" : obj_msg.audit,
                    "unit": "",
                    "user" : user_msg.userId
                    }),
            headers : {'token':token},
            dataType:'json',
            contentType: "application/json;charset=utf-8",
            success:function(data){
                if(data.code==0){
                    $(".warp_hd_t_mt b").text(obj_msg.data_date);
                    $(".warp_hd_t_mt span").text(obj_msg.week);
                    $(".warp_hd_t_mj span").html('"'+obj_msg.name+'"'+"<i>"+obj_msg.dname+"</i>");
                    $(".warp_hd_t_mh").find('li').eq(0).find('span').text(obj_msg.arrive_time +' '+obj_msg.times);
                    var addr = $(".warp_hd_u_bq a").text();
                    $(".warp_hd_t_mh").find('li').eq(1).find('span').text(addr);
                    if(obj_msg.audit!=10){
                        var cot = this_msg.next('span').find('i').text();
                        var cot = Number(cot);
                        this_msg.next('span').find('i').text(cot+1);
                    }
                   
                    change_button_msg(this_msg,obj_msg.audit)
                    $(".warp_hd_t").fadeIn();
                    str = true;
                }else{
                     layer.open({
                        content: data.msg
                        ,skin: 'msg'
                        ,time: 1 //2秒后自动关闭
                        });
                        return str;
                }

            },
            error:function(){
                layer.open({
                content: '获取失败'
                ,skin: 'msg'
                ,time: 1 //2秒后自动关闭
                });
                return str;
            }
        })
        return str;
    }
    ///改变按钮样式以及信息
    function change_button_msg(this_msg,audit){
        if(audit==10){
            this_msg.text('待审核').attr('data-type','').attr('style','background: #999;');
        }else{
            this_msg.text('已报名').attr('data-type','').attr('style','background: #999;');
        }
        
    }

    function getText(type){
        if(state==30 || state==40){
            return "已结束";
        }else{
            return "报名";
        }
    }

    function acnuiqcu(){
        //var length = $(".swiper-wrapper div").length;
        var zu = 0;
            //var thisclass = val.day==formatDate(now)?'thisclass':'';
        $(".swiper-wrapper div").each(function(index, val){
            if($(this).attr('data-day')=='2019-05-31'){
                $(this).click();
                zu = Math.ceil(((index+1)/4))-1;
            }
        });
        for(var i=0;i<zu;i++){
            $(".swiper-button-next").click();
        }
    }