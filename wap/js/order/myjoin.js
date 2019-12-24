var arr =new Array();
var un = getCookie("un");
    $(function(){
        var ticketStatus = '';
        /*user_msg.userId*/
        //拼装json串
        var d = {'pageNumber':1,'pageSize':5,'user':user_msg.userId}
        var html ='';
        
        $.ajax({
            xhrFields: {
               withCredentials: true
            },
            type:"post",
            url:base_url + "html5/v1/userTicket/findAttendByUser",
            data:JSON.stringify(d),
            headers : {'token':token},
            async: false,
            dataType:'json',
            contentType: "application/json;charset=utf-8",
            success:function(data){
                var text = data.data.records;
                if(text == ''){
                    html = "<div class=\"zw_sj_p\">\
                                <img src=\"../wap/img/pws_164.png\">\
                            </div>"
                    $(".warp_dd_o").html(html);
                }else{
                    $.each(text,function(index,data){
                        if(data.type == 10){//岗位
                            html += get_job_order_list(index,data,data.type);
                        }else if(data.type == 20){//任务
                            html += get_task_order_list(index,data,data.type);
                        }else if(data.type == 30){//公众
                            html += get_ticket_order_list(index,data,data.type);
                        }else if(data.type == 50){//嘉宾
                            html += get_guestcard_order_list(index,data,data.type);
                        }else if(data.type == 60){//媒体
                            html += get_mediacard_order_list(index,data,data.type);
                        }else if(data.type == 70){//活动管理员，通证
                            html +=get_manage_order_list(index,data,data.type);
                        }else if(data.type == 80){//场次管理员
                            html += get_fieldadmin_order_list(index,data,data.type);
                        }else if(data.type == 90){//临时管理员
                            html += get_temporaryadmin_order_list(index,data,data.type);
                        }
                        arr.push(data.qrCode);
                        //arr[index] = data.qrCode;
                    });
                    $("#before_html").before(html); //追加html
                    $(".warp_dd_o_so b").click(function () {
                        jump("../activity/activity_content.html?activityCode="+$(this).attr("data-id"));
                    });
                    //qrcodefor(arr);  //追加 二维码
                }
            },
            error:function(e){
                layer.open({
                    content: '查询失败'
                    ,skin: 'msg'
                    ,time: 1 //2秒后自动关闭
                });
                return false;
            }
        })
    })
//滑动加载更多
$(function(){
    // 页数
    var page = 1;
    var size = 5;
    var ticket ='';
    var html =''; 
    $('#content').dropload({
        scrollArea : window,
        loadDownFn : function(me){
            page++;
            $.ajax({
                xhrFields: {
                   withCredentials: true
                },
                type:"post",
                url:base_url + "html5/v1/userTicket/findAttendByUser",
                data:JSON.stringify({'pageNumber':page,'pageSize':size,'user':user_msg.userId}),
                headers : {'token':token},
                dataType:'json',
                contentType: "application/json;charset=utf-8",
                success:function(data){
                    var text = data.data.records;
                    if(text == ''){
                        me.lock();
                        // 无数据
                        me.noData();   
                    }else{
                        $.each(text,function(index,data){
                            var index = (page-1)*size+index;
                            if(data.type == 10){//岗位
                                html += get_job_order_list(index,data,data.type);
                            }else if(data.type == 20){//任务
                                html += get_task_order_list(index,data,data.type);
                            }else if(data.type == 30){//公众
                                html += get_ticket_order_list(index,data,data.type);
                            }else if(data.type == 50){//嘉宾
                                html += get_guestcard_order_list(index,data,data.type);
                            }else if(data.type == 60){//媒体
                                html += get_mediacard_order_list(index,data,data.type);
                            }else if(data.type == 70){//活动管理员，通证
                                html +=get_manage_order_list(index,data,data.type);
                            }else if(data.type == 80){//场次管理员
                                html += get_fieldadmin_order_list(index,data,data.type);
                            }else if(data.type == 90){//临时管理员
                                html += get_temporaryadmin_order_list(index,data,data.type);
                            }
                        arr.push(data.qrCode)
                        });
                        $("#before_html").before(html);
                        //qrcodefor(arr);  //追加 二维码
                        $(".warp_dd_o_so b").click(function () {
                            jump("../activity/activity_content.html?activityCode="+$(this).attr("data-id"));
                        });
                    }
                    me.resetload();
                },
                error: function(xhr, type){
                    
                    //alert('Ajax error!');
                    // 即使加载出错，也得重置
                    me.resetload();
                }
            })
        }
    })
})
//判断当前状态
function ticketStatus(state){
    var ticket = '';
    switch(state){
        case -10:
        ticket ='作废';
        break;
        case 10:
        ticket ='待使用';
        break;
        case 20:
        ticket ='使用中';
        break;
        case 30:
        ticket ='已结算';
        break;
        case 40:
        ticket ='转岗中';
        break;
        case 50:
        ticket ='冻结';
        break;
        default:
        ticket ='锁定';
        }
    return ticket;
}
//获取岗位信息列表
//@param 该岗位状态信息
function get_job_order_list(index,data,type){
    var html = '';
    var state = data.state
    var ticket = ticketStatus(state);
    var timeSrc = "可获取服务时长：";
    var times = ChangeHourMinutestr(data.times);
    var manual = "";
    if(state==30){
        manual = "（"+data.txtManual+"）";
        timeSrc = "已获取服务时长：";
        times = ChangeHourMinutestr(data.validTime);
    }
    if(ticket=="待使用"){
        manual = "";
    }
    var arriveTime = split_datetime(data.arriveTime);
    // if(data.times < 60){
    //     var minutes_s  = data.times/60;
    //     var showdetail = minutes_s+"分钟";
    // }else{
    //     var hour_s     = parseInt(data.times/60);
    //     var minutes_s  = (data.times - 60*hour_s).toFixed(2);
    //     if(minutes_s == 0){
    //         var showdetail = hour_s+"小时";
    //     }else{
    //         var showdetail = hour_s+"小时"+minutes_s+"分钟";
    //     }
    // }
    html += "<li>\
            <div class=\"warp_dd_o_sp\">\
                <div class=\"warp_dd_o_so\">\
                    <span class=\"warp_dd_o_so_1\">岗位</span>\
                    <span class=\"warp_dd_o_so_2\">"+ticket+"</span>\
                    <b data-id='"+data.activityCode+"'>"+data.name+"</b>\
                </div>\
                <div class=\"warp_dd_o_si\">\
                    <a href=\"./content.html?ticket="+data.ticket+"&type="+type+"&state="+state+"\" class=\"warp_dd_o_su\">\
                        <div id=\"qrcode"+index+"\">\
                            <img src=\"../wap/img/pws_280.jpg\">\
                        </div>\
                        <span>签到二维码</span>\
                    </a>\
                    <div class=\"warp_dd_o_sy\">\
                        <span style=\"background: url(../wap/img/pws_169.png) no-repeat left center;background-size: 13px 13px;background-position: 0 3px\">"+arriveTime.date + " " + arriveTime.str+"  报到</span>\
                        <span style=\"background: url(../wap/img/pws_169.png) no-repeat left center;background-size: 13px 13px;background-position: 0 3px\">"+timeSrc+times+manual+"</span>\
                        <span style=\"background: url(../wap/img/pws_170.png) no-repeat left center;background-size: 13px 14px;background-position: 0 3px\">"+data.address+"</span>\
                    </div>\
                </div>\
                <div class=\"warp_dd_o_st\" data-arrivetime=\""+arriveTime.date + " " + arriveTime.str+"\">";
        
    //html += "<a href=\"javascript:void(0)\">讨论</a>"
    html += "<a href=\"javascript:void(0)\" data-lat=\""+data.lat+"\" data-lng=\""+data.lng+"\" data-address=\""+data.address+"\" data-mobile=\""+data.contactPhone+"\" data-title=\""+data.title+"\" class=\"tc_dt_p\">地图</a>";
    //【使用中】、【已结算】的票，评价按钮全部显示，可用
    if(data.state==20||data.state==30){
        html += "<a href=\"./evaluate.html?ticket="+data.ticket+"\">评价</a>";
    }
    var newTime = new Date().getTime();
    var date = new Date((arriveTime.date + " " + arriveTime.str+":00").replace(/\-/g,'/'));
    var createTime = date.getTime() - 4 * 60 * 60 * 1000;//开始时间前的四小时
    var newDay = new Date(date.getFullYear()+"/"+(date.getMonth()+1)+"/"+date.getDate()+" 23:59:59").getTime();
    // 打卡显示规则：票的状态【待使用】、【使用中】时，显示该按钮
    if(data.state==10||data.state==20){
        if (newTime >= createTime) {//场次开始前4小时
            if (newTime <= newDay) {//开始当天24点
                if(un!=undefined && un!=null && un!=''){
                    html += "<a href=\"javascript:void(0)\" onclick=\"jumpScan1('"+encodeURI(data.qrCode)+"/"+un+"')\">打卡</a>";
                }else{
                    html += "<a href=\"javascript:void(0)\" style=\"background-color: #CCCCCC;\">打卡</a>";
                }/*
                    html += "<a href=\""+data.qrCode+"/"+data.user+"\">打卡</a>";*/
            } else {
                html += "<a href=\"javascript:void(0)\" style=\"background-color: #CCCCCC;\">打卡</a>";
            }
        } else {
            html += "<a href=\"javascript:void(0)\" style=\"background-color: #CCCCCC;\">打卡</a>";
        }
        
    }//
    // 退出 / 顶岗 显示规则：票的状态为【待使用】时，显示该按钮，其他状态均不显示 <a href=\"./order_quit.html?sectionCode="+data.sectionCode+"&ticket="+data.ticket+"&mark=10&type=20"+"\">退出</a>
    if(data.state==10){
        //html += "<a href=\"./work_on.html?sectionCode="+data.sectionCode+"&ticket="+data.ticket+"&mark=10&type=10"+"\">顶岗</a>";
        html += "<a href=\"javascript:void(0)\" onclick=\"click_jump_msg('./work_on','"+data.sectionCode+"','"+data.ticket+"',10,10,this)\">顶岗</a>";
        html += "<a href=\"javascript:void(0)\" onclick=\"click_jump_msg('./order_quit','"+data.sectionCode+"','"+data.ticket+"',10,20,this)\">退出</a>";
    }

    html += "</div></div></li>";

    return html;
}
$(function(){
    $(".daka").live('click',function(){
        layer.open({content: '用户信息读取错误，请重新登录',skin: 'msg',time: 1});
        return false;
    })
})
//获取任务订单列表信息
function get_task_order_list(index,data,type){
    var html = '';
    var state = data.state;
    var times = timeStamp(data.times);
    var ticket = ticketStatus(data.state);
    var timeSrc = "可获取服务时长：";
    var arriveTime = split_datetime(data.arriveTime);
    var manual = "";
    if(state==30){
        manual = "（"+data.txtManual+"）";
        timeSrc = "已获取服务时长：";
        times = ChangeHourMinutestr(data.validTime);
    }
    if(ticket=="待使用"){
        manual = "";
    }
    html += "<li>\
                <div class=\"warp_dd_o_sp\">\
                    <div class=\"warp_dd_o_so\">\
                        <span class=\"warp_dd_o_so_1\">任1务</span>\
                        <span class=\"warp_dd_o_so_2\">"+ticket+"</span>\
                        <b data-id='"+data.activityCode+"'>"+data.name+"1</b>\
                    </div>\
                    <div class=\"warp_dd_o_si\">\
                        <a href=\"./content.html?ticket="+data.ticket+"\&type="+type+"\" class=\"warp_dd_o_su\">\
                            <div id=\"qrcode"+index+"\">\
                                <img src=\"../wap/img/pws_280.jpg\">\
                            </div>\
                            <span>任务单</span>\
                        </a>\
                        <div class=\"warp_dd_o_sy\">\
                            <span style=\"background: url(../wap/img/pws_169.png) no-repeat left center;background-size: 13px 13px;background-position: 0 3px\">"+arriveTime.date + " " + arriveTime.str+" 截止</span>\
                            <span style=\"background: url(../wap/img/pws_169.png) no-repeat left center;background-size: 13px 13px;background-position: 0 3px\">"+timeSrc+times+manual+"</span>\
                            <span style=\"background: url(../wap/img/pws_170.png) no-repeat left center;background-size: 13px 14px;background-position: 0 3px\">"+data.address+"</span>\
                        </div>\
                    </div>\
                    <div class=\"warp_dd_o_st\" data-arrivetime=\""+arriveTime.date + " " + arriveTime.str+"\">"; 
                //html += "<a href=\"javascript:void(0)\">讨论</a>";
            if(data.state==20||data.state==30){

                html += "<a href=\"./evaluate.html?ticket="+data.ticket+"\">评价</a>";
            } 

        // 退出 / 转接 显示规则：票的状态为【待使用】时，显示该按钮，其他状态均不显示
        //延时： 显示规则：票的状态为【待使用】时，显示该按钮，其他状态均不显示
        //提交任务 显示规则：票的状态为【待使用】时，显示该按钮，其他状态均不显示
        if(data.state==10){
            html += "<a href=\"javascript:void(0)\" onclick=\"click_ticket('"+data.ticket+"','"+data.user+"')\">提交任务</a>";
            //html += "<a href=\"./order_delayed.html?sectionCode="+data.sectionCode+"&ticket="+data.ticket+"&arriveTime="+time3+"&mark=20&type=30"+"\">延时</a>"
            //html += "<a href=\"./order_transfer.html?sectionCode="+data.sectionCode+"&ticket="+data.ticket+"&mark=20&type=10"+"\">转接</a>"
            html += "<a href=\"javascript:void(0)\" onclick=\"click_jump_msg('./order_delayed','"+data.sectionCode+"','"+data.ticket+"',20,30,this,"+datetime_delayed(data.arriveTime)+")\">延时</a>";
            html += "<a href=\"javascript:void(0)\" onclick=\"click_jump_msg('./order_transfer','"+data.sectionCode+"','"+data.ticket+"',20,10,this)\">转接</a>";
            html += "<a href=\"javascript:void(0)\" onclick=\"click_jump_msg('./order_quit','"+data.sectionCode+"','"+data.ticket+"',20,20,this)\">退出</a>";
        }                    
    html += "</div></div></li>";
    return html;
}
/*检验信息跳转等
* url 跳转地址  
* param 参数   ./order_quit.html?sectionCode="+data.sectionCode+"&ticket="+data.ticket+"&mark=20&type=20"+"
*/
function click_jump_msg(url,sectionCode,ticket,mark,type,this1,time){
    var ticket_msg = ticket_state(ticket,type);  //检查当前票的状态
    if(ticket_msg===false){
        return false;
    }
    var arrivetime = $(this1).parent().attr('data-arrivetime');
    var txt = "", tim = "";
    if(url=='./order_quit'){
        txt = "退出";
        tim = "报到";
    }else if(url=='./work_on'){
        txt = "顶岗";
        tim = "报到";
    }else if(url=='./order_delayed'){
        txt = "延时";
        tim = "截止";
    }else if(url=='./order_transfer'){
        txt = "转接";
        tim = "截止";
    }
    if(ticket_msg.data==''){
        var now_time = getFormatDate(); //当前时间
        if(!compareTime(now_time,arrivetime)){
            layer.open({content:'已过'+tim+'时间，不可以'+txt,skin: 'msg',time: 1});
            return false;
        }else{
            if(url=='./order_delayed'){
                location.href = url + '.html?sectionCode=' + sectionCode +'&ticket='+ticket+'&mark='+mark+'&type='+type+"&arriveTime="+time;
            }else{
                location.href = url + '.html?sectionCode=' + sectionCode +'&ticket='+ticket+'&mark='+mark+'&type='+type;
            }
        }
    }else if(ticket_msg.data.state == -10 || ticket_msg.data.state == 10 || ticket_msg.data.state == 15 || ticket_msg.data.state == 20){
        location.href = url + '_content.html?sectionCode=' + sectionCode +'&ticket='+ticket+'&mark='+mark+'&type='+type;
    }else{
        var now_time = getFormatDate(); //当前时间
        if(!compareTime(now_time,arrivetime)){
            layer.open({content:'已过'+tim+'时间，不可以'+txt,skin: 'msg',time: 1});
            return false;
        }else{
            if(url=='./order_delayed'){
                location.href = url + '.html?sectionCode=' + sectionCode +'&ticket='+ticket+'&mark='+mark+'&type='+type+"&arriveTime="+time;
            }else{
                location.href = url + '.html?sectionCode=' + sectionCode +'&ticket='+ticket+'&mark='+mark+'&type='+type;
            }
        }
    }
}

//检查当前票的状态
/*
 *   ticket 票号  
 *   type 变更申请类型
 */
function ticket_state(ticket,type){
    var str = false;
    $.ajax({
        xhrFields: {
           withCredentials: true
        },
        type:"post",
        url:base_url + "html5/v1/userTicket/queryApply",
        data:JSON.stringify({"ticket":ticket,"type":type}),
        headers : {'token':token},
        async: false,
        dataType:'json',
        contentType: "application/json;charset=utf-8",
        success:function(data){
            if(data.code==0){
                    str = data;
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
                content: '网络错误,请重试'
                ,skin: 'msg'
                ,time: 1 //2秒后自动关闭
            });
            return str;
        }
    })
    return str;
}
//获取公众门票订单信息
function get_ticket_order_list(index,data,type){
    var html = '';
    var ticket = ticketStatus(data.state);
    var arriveTime = split_datetime(data.arriveTime);
    var times = timeStamp(data.times);
    html +="<li>\
                <div class=\"warp_dd_o_sp\">\
                    <div class=\"warp_dd_o_so\">\
                        <span class=\"warp_dd_o_so_1\">公众门票</span>\
                        <span class=\"warp_dd_o_so_2\">"+ticket+"</span>\
                        <b data-id='"+data.activityCode+"'>"+data.name+"</b>\
                    </div>\
                    <div class=\"warp_dd_o_si\">\
                        <a href=\"./content.html?ticket="+data.ticket+"&type="+type+"\" class=\"warp_dd_o_su\">\
                            <div id=\"qrcode"+index+"\">\
                                <img src=\"../wap/img/pws_280.jpg\">\
                            </div>\
                            <span>签到二维码</span>\
                        </a>\
                        <div class=\"warp_dd_o_sy\">\
                            <span style=\"background: url(../wap/img/pws_169.png) no-repeat left center;background-size: 13px 13px;background-position: 0 3px\">"+arriveTime.date + " " + arriveTime.str+" 报到</span>\
                            <span style=\"background: url(../wap/img/pws_170.png) no-repeat left center;background-size: 13px 14px;background-position: 0 3px\">"+data.address+"</span>\
                        </div>\
                    </div>\
                    <div class=\"warp_dd_o_st\" data-arrivetime=\""+arriveTime.date + " " + arriveTime.str+"\">"
            //html += "<a href=\"javascript:void(0)\">讨论</a>";
            html += "<a href=\"javascript:void(0)\" data-lat=\""+data.lat+"\" data-lng=\""+data.lng+"\" data-address=\""+data.address+"\" data-mobile=\""+data.contactPhone+"\" data-title=\""+data.title+"\" class=\"tc_dt_p\">地图</a>";
        //【使用中】、【已结算】的票，评价按钮全部显示，可用
        if(data.state==20||data.state==30){
            html += "<a href=\"./evaluate.html?ticket="+data.ticket+"\">评价</a>";
        } 
        //转赠：显示规则：票的状态为【待使用】时，显示该按钮，其他状态均不显示            
        if(data.state==10){
            //html += "<a href=\"javascript:void(0)\">转赠</a>";
        }                
        html += "</div></div></li>";
    return html;
}
//获取管理员工作证，通证
function get_manage_order_list(index,data,type){
    var html = '';
    var ticket = ticketStatus(data.state);
    var arriveTime = split_datetime(data.arriveTime);
    var times = timeStamp(data.times);
    html += "<li>\
                <div class=\"warp_dd_o_sp\">\
                    <div class=\"warp_dd_o_so\">\
                        <span class=\"warp_dd_o_so_1\">管理员工作证</span>\
                        <b data-id='"+data.activityCode+"'>"+data.name+"</b>\
                    </div>\
                    <div class=\"warp_dd_o_si\">\
                        <a href=\"./content.html?ticket="+data.ticket+"&type="+type+"\" class=\"warp_dd_o_su\">\
                            <div id=\"qrcode"+index+"\">\
                                <img src=\"../wap/img/pws_280.jpg\">\
                            </div>\
                            <span>签到二维码</span>\
                        </a>\
                        <div class=\"warp_dd_o_sy\">\
                            <span style=\"background: url(../wap/img/pws_169.png) no-repeat left center;background-size: 13px 13px;background-position: 0 3px\">"+arriveTime.date + " " + arriveTime.str+"  报到</span>\
                            <span style=\"background: url(../wap/img/pws_170.png) no-repeat left center;background-size: 13px 14px;background-position: 0 3px\">"+data.address+"</span>\
                        </div>\
                    </div>\
                    <div class=\"warp_dd_o_st\" data-arrivetime=\""+arriveTime.date + " " + arriveTime.str+"\">"
                //html += "<a href=\"javascript:void(0)\">讨论</a>";
                html += "<a href=\"../managementact/managementact_content_personal.html?type=70&activityCode="+data.activityCode+"&sectionCode="+data.sectionCode+"&ticket="+data.ticket+"\">管理</a>";
                html += "<a href=\"javascript:void(0)\" data-lat=\""+data.lat+"\" data-lng=\""+data.lng+"\" data-address=\""+data.address+"\" data-mobile=\""+data.contactPhone+"\" data-title=\""+data.title+"\" class=\"tc_dt_p\">地图</a>";
        //【使用中】、【已结算】的票，评价按钮全部显示，可用
        if(data.state==20||data.state==30){
            if(data.evaluate != 10 && data.evaluate != 30) {
                html += '<a href="./evaluate.html?ticket="+data.ticket+">评价</a>';
            }
        } 
        //管理：票的状态为【待使用】、【使用中】、【已结束】时，按钮都可用            
        if(data.state==10||data.state==20||data.state==30){
           // html += "<a href=\"javascript:void(0)\">管理</a>";
        }

            html += "</div></div></li>";
    return html;
}
//获取嘉宾证
function get_guestcard_order_list(index,data,type){
    var html = '';
    var ticket = ticketStatus(data.state);
    var arriveTime = split_datetime(data.arriveTime);
    var times = timeStamp(data.times);
    html += "<li>\
                <div class=\"warp_dd_o_sp\">\
                    <div class=\"warp_dd_o_so\">\
                        <span class=\"warp_dd_o_so_1\">嘉宾证</span>\
                        <b data-id='"+data.activityCode+"'>"+data.name+"</b>\
                    </div>\
                    <div class=\"warp_dd_o_si\">\
                        <a href=\"./content.html?ticket="+data.ticket+"&type="+type+"\" class=\"warp_dd_o_su\">\
                            <div id=\"qrcode"+index+"\">\
                                <img src=\"../wap/img/pws_280.jpg\">\
                            </div>\
                            <span>签到二维码</span>\
                        </a>\
                        <div class=\"warp_dd_o_sy\">\
                            <span style=\"background: url(../wap/img/pws_169.png) no-repeat left center;background-size: 13px 13px;background-position: 0 3px\">"+arriveTime.date + " " + arriveTime.str+"  报到</span>\
                            <span style=\"background: url(../wap/img/pws_170.png) no-repeat left center;background-size: 13px 14px;background-position: 0 3px\">"+data.address+"</span>\
                        </div>\
                    </div>\
                    <div class=\"warp_dd_o_st\" data-arrivetime=\""+arriveTime.date + " " + arriveTime.str+"\">";
                    //html += "<a href=\"javascript:void(0)\">讨论</a>"
                    html += "<a href=\"javascript:void(0)\" data-lat=\""+data.lat+"\" data-lng=\""+data.lng+"\" data-address=\""+data.address+"\" data-mobile=\""+data.contactPhone+"\" data-title=\""+data.title+"\" class=\"tc_dt_p\">地图</a>";
            //嘉宾和媒体 票的状态【待使用】时，显示按钮【地图】【讨论】，都可用 
            //票的状态【使用中】、【已结束】时，显示按钮【评价】【地图】【讨论】，都可用      
            if(data.state==20||data.state==30){
                html += "<a href=\"./evaluate.html?ticket="+data.ticket+"\">评价</a>";
            }  
            html += "</div></div></li>";
    return html;
}
//获取媒体证
function get_mediacard_order_list(index,data,type){
    var html = '';
    var ticket = ticketStatus(data.state);
    var arriveTime = split_datetime(data.arriveTime);
    var times = timeStamp(data.times);
    html += "<li>\
                <div class=\"warp_dd_o_sp\">\
                    <div class=\"warp_dd_o_so\">\
                        <span class=\"warp_dd_o_so_1\"> 媒体证</span>\
                        <b data-id='"+data.activityCode+"'>"+data.name+"</b>\
                    </div>\
                    <div class=\"warp_dd_o_si\">\
                        <a href=\"./content.html?ticket="+data.ticket+"&type="+type+"\" class=\"warp_dd_o_su\">\
                            <div id=\"qrcode"+index+"\">\
                                <img src=\"../wap/img/pws_280.jpg\">\
                            </div>\
                            <span>签到二维码</span>\
                        </a>\
                        <div class=\"warp_dd_o_sy\">\
                            <span style=\"background: url(../wap/img/pws_169.png) no-repeat left center;background-size: 13px 13px;background-position: 0 3px\">"+arriveTime.date + " " + arriveTime.str+"  报到</span>\
                            <span style=\"background: url(../wap/img/pws_170.png) no-repeat left center;background-size: 13px 14px;background-position: 0 3px\">"+data.address+"</span>\
                        </div>\
                    </div>\
                    <div class=\"warp_dd_o_st\" data-arrivetime=\""+arriveTime.date + " " + arriveTime.str+"\">"
                    //html += "<a href=\"javascript:void(0)\">讨论</a>"
                    html += "<a href=\"javascript:void(0)\" data-lat=\""+data.lat+"\" data-lng=\""+data.lng+"\" data-address=\""+data.address+"\" data-mobile=\""+data.contactPhone+"\" data-title=\""+data.title+"\" class=\"tc_dt_p\">地图</a>";
            //嘉宾和媒体 票的状态【待使用】时，显示按钮【地图】【讨论】，都可用 
            //票的状态【使用中】、【已结束】时，显示按钮【评价】【地图】【讨论】，都可用      
            if(data.state==20||data.state==30){
                html += "<a href=\"./evaluate.html?ticket="+data.ticket+"\">评价</a>";
            }  
            html += "</div></div></li>";
    return html;
}
//获取场次管理员
function get_fieldadmin_order_list(index,data,type){
    var html = '';
    var ticket = ticketStatus(data.state);
    var arriveTime = split_datetime(data.arriveTime);
    var times = timeStamp(data.times);
    html += "<li>\
                <div class=\"warp_dd_o_sp\">\
                    <div class=\"warp_dd_o_so\">\
                        <span class=\"warp_dd_o_so_1\">场次管理员</span>\
                        <b data-id='"+data.activityCode+"'>"+data.name+"</b>\
                    </div>\
                    <div class=\"warp_dd_o_si\">\
                        <a href=\"./content.html?ticket="+data.ticket+"&type="+type+"\" class=\"warp_dd_o_su\">\
                            <div id=\"qrcode"+index+"\">\
                                <img src=\"../wap/img/pws_280.jpg\">\
                            </div>\
                            <span>签到二维码</span>\
                        </a>\
                        <div class=\"warp_dd_o_sy\">\
                            <span style=\"background: url(../wap/img/pws_169.png) no-repeat left center;background-size: 13px 13px;background-position: 0 3px\">"+arriveTime.date + " " + arriveTime.str+"  报到</span>\
                            <span style=\"background: url(../wap/img/pws_170.png) no-repeat left center;background-size: 13px 14px;background-position: 0 3px\">"+data.address+"</span>\
                        </div>\
                    </div>\
                    <div class=\"warp_dd_o_st\" data-arrivetime=\""+arriveTime.date + " " + arriveTime.str+"\">";
                    //html += "<a href=\"javascript:void(0)\">讨论</a>"
                    html += "<a href=\"../managementact/managementact_content_personal.html?type=80&activityCode="+data.activityCode+"&sectionCode="+data.sectionCode+"&ticket="+data.ticket+"\">管理</a>";
                    html += "<a href=\"javascript:void(0)\" data-lat=\""+data.lat+"\" data-lng=\""+data.lng+"\" data-address=\""+data.address+"\" data-mobile=\""+data.contactPhone+"\" data-title=\""+data.title+"\" class=\"tc_dt_p\">地图</a>";
        //【使用中】、【已结算】的票，评价按钮全部显示，可用
        if(data.state==20||data.state==30){
            html += "<a href=\"./evaluate.html?ticket="+data.ticket+"\">评价</a>";
        } 
        //管理：票的状态为【待使用】、【使用中】、【已结束】时，按钮都可用            
        if(data.state==10||data.state==20||data.state==30){
            //html += "<a href=\"javascript:void(0)\">管理</a>";
        }  
            html += "</div></div></li>";
    return html;
}

//获取临时管理员
function get_temporaryadmin_order_list(index,data,type){
    var html = '';
    var ticket = ticketStatus(data.state);
    var arriveTime = split_datetime(data.arriveTime);
    var times = timeStamp(data.times);
    html += "<li>\
                <div class=\"warp_dd_o_sp\">\
                    <div class=\"warp_dd_o_so\">\
                        <span class=\"warp_dd_o_so_1\">临时管理员</span>\
                        <b data-id='"+data.activityCode+"'>"+data.name+"</b>\
                    </div>\
                    <div class=\"warp_dd_o_si\">\
                        <a href=\"./content.html?ticket="+data.ticket+"&type="+type+"\" class=\"warp_dd_o_su\">\
                            <div id=\"qrcode"+index+"\">\
                                <img src=\"../wap/img/pws_280.jpg\">\
                            </div>\
                            <span>签到二维码</span>\
                        </a>\
                        <div class=\"warp_dd_o_sy\">\
                            <span style=\"background: url(../wap/img/pws_169.png) no-repeat left center;background-size: 13px 13px;background-position: 0 3px\">"+arriveTime.date + " " + arriveTime.str+"  报到</span>\
                            <span style=\"background: url(../wap/img/pws_170.png) no-repeat left center;background-size: 13px 14px;background-position: 0 3px\">"+data.address+"</span>\
                        </div>\
                    </div>\
                    <div class=\"warp_dd_o_st\" data-arrivetime=\""+arriveTime.date + " " + arriveTime.str+"\">";
    //html += "<a href=\"javascript:void(0)\">讨论</a>"
    html += "<a href=\"../managementact/managementact_content_personal.html?type=90&activityCode="+data.activityCode+"&sectionCode="+data.sectionCode+"&ticket="+data.ticket+"\">管理</a>";
    html += "<a href=\"javascript:void(0)\" data-lat=\""+data.lat+"\" data-lng=\""+data.lng+"\" data-address=\""+data.address+"\" data-mobile=\""+data.contactPhone+"\" data-title=\""+data.title+"\" class=\"tc_dt_p\">地图</a>";
    //【使用中】、【已结算】的票，评价按钮全部显示，可用
    if(data.state==20||data.state==30){
        html += "<a href=\"./evaluate.html?ticket="+data.ticket+"\">评价</a>";
    }
    //管理：票的状态为【待使用】、【使用中】、【已结束】时，按钮都可用
    if(data.state==10||data.state==20||data.state==30){
        //html += "<a href=\"javascript:void(0)\">管理</a>";
    }
    html += "</div></div></li>";
    return html;
}
$(function(){
    $(".tc_dt_p").live('click',function(){
        var lat1 = $(this).attr('data-lat');
        var lng1 = $(this).attr('data-lng');
        var address = $(this).attr('data-address');
        var mobile = $(this).attr('data-mobile');
        var title = $(this).attr('data-title');
        new BaiduMap({
            id: "container1",
            title: {
                text: title,
                className: "title"
            },
            content: {
                className: "content",
                text: ["地址："+address, "电话："+mobile]
            },
            point: {
                lng: lng1,
                lat: lat1
            }
        });
    })
})
function click_ticket(ticket, user){
    $.ajax({
        xhrFields: {
            withCredentials: true
        },
        type:"post",
        url:base_url + "html5/v1/task/queryTaskSubmitByUser",
        data:JSON.stringify({"ticket":ticket,"user":user}),
        headers : {'token':token},
        async: false,
        dataType:'json',
        contentType: "application/json;charset=utf-8",
        success:function(data){
            if(data.code==7210){
                jump("./submit_task.html?ticket="+ticket);
            }else if(data.code==0){
                jump("./order_task.html?ticket="+ticket+"&user="+user);
            }
        },
        error:function(){
            layer.closeAll();
            layer.open({
                content: '网络错误,请重试'
                ,skin: 'msg'
                ,time: 1 //2秒后自动关闭
            });
            return str;
        }
    })
}