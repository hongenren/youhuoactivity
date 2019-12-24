//获取全部岗位信息
    function get_activity_work(sectionCode)
    {
        var html ='';
        var data_list = '';
        var recruitCode = "";
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
                if(data.code==0){
                    data_list = data.data;
                    html = '<li><a href="javascript:;" onclick="get_activity_auditee(\''+$_GET['sectionCode']+'\',\'1\')">全部岗位</a></li>';
                    $.each(data_list,function(index,val){
                        html+='<li>\
                                    <a href="javascript:;" onclick="get_activity_auditee(\''+$_GET['sectionCode']+'\',1,recruitCode=\''+val.code+'\')">'+val.name+'</a>\
                                </li>';

                    })
                    $(".warp_gl_y_sl").html(html);
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
    $(function(){
        $('.swiper-slide a').click(function(){
            $(this).parent().addClass('current').siblings().removeClass('current');
        })
    })
var searchUrl ="", url, datas;
 //已报名列表 //pagenum页数  pagesize 每页个数 status ajax还是正常
    function get_activity_auditee(sectionCode,typeNum,recruitCode="",taskCode="",pageNumber=1,pageSize=10,status=1,me=''){
        $(".warp_gl_y_sw").hide();
        countCheckInTicket(sectionCode, recruitCode, typeNum+"0");
        var state = 20;
        $('.warp_gl_u_so').empty();
        if(typeNum == 1){
            searchUrl = "recruit/searchByNameOrMobile";
            url   = base_url + "html5/v1/recruit/selectBySectionRecruit";
            datas = JSON.stringify({"sectionCode":sectionCode,"recruitCode":recruitCode,"pageNumber":pageNumber,"pageSize":pageSize,"state":state});
            $('.warp_gl_u_so').html('<span>全部岗位</span>');
            $(".warp_gl_u_so span").click(function(){
                $(".warp_gl_y_sw").show();
            });
        }else if(typeNum == 2){
            searchUrl = "task/searchTaskSubmit";
            url = base_url + "html5/v1/task/selectAppliesBySectionTask";
            datas = JSON.stringify({"sectionCode":sectionCode,"pageNumber":pageNumber,"pageSize":pageSize,"state":state,"taskCode":taskCode});
        }else if(typeNum == 3){
            searchUrl = "public/searchApplies";
            url   = base_url + "html5/v1/public/selectAppliesBySection";
            datas = JSON.stringify({"sectionCode":sectionCode,"pageNumber":pageNumber,"pageSize":pageSize,"state":state});
        }else if(typeNum == 4){
            searchUrl = "manager/searchApplies";
            url   = base_url + "html5/v1/manager/selectAppliesBySection";
            datas = JSON.stringify({"sectionCode":sectionCode,"pageNumber":pageNumber,"pageSize":pageSize,"activityCode":$_GET['activityCode']});
        }else if(typeNum == 5){
            searchUrl = "mediaGuest/searchApply";
            url   = base_url + "html5/v1/mediaGuest/queryAppliesBySection";
            datas = JSON.stringify({"sectionCode":sectionCode,"pageNumber":pageNumber,"pageSize":pageSize,"state":state,"type":50});
        }else if(typeNum == 6){
            searchUrl = "mediaGuest/searchApply";
            url   = base_url + "html5/v1/mediaGuest/queryAppliesBySection";
            datas = JSON.stringify({"sectionCode":sectionCode,"pageNumber":pageNumber,"pageSize":pageSize,"state":state,"type":60});
        }
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
            // beforeSend:function(XMLHttpRequest){
            //         $(".warp_gl_u_sr").html("<img src='../wap/img/loading.gif' style='width:24px;heigth:24px; margin:0 auto;display:block'/>");
            //     },
            success:function(data){
                //console.log(data);
                var html ='';
                var data_list = '';
                if(data.code==0){
                    data_list = data.data.records;
                    $("#all_num").html(data.data.total)
                    if(data_list!=''){
                        $.each(data_list,function(index,val){
                            html += get_job_enroll_list(val,typeNum);
                        })
                        if(status==1){
                            $(".warp_gl_u_sr").empty();
                            $(".warp_gl_u_sr").html(html);
                        }else{

                            $(".warp_gl_u_sr").append(html); //追加html
                        }
                    }else{
                        if(status==1){
                            html += "<div class=\"zw_sj_p\">\
                                <img src=\"../wap/img/pws_164.png\">\
                            </div>";
                            $(".warp_gl_u_sr").empty()
                            $(".warp_gl_u_sr").html(html);
                        }else{
                            me.lock();
                            // 无数据
                            me.noData();
                        }

                    }
                    if(status==2){
                        me.resetload();
                    }
                }else{
                    layer.open({
                    content: '获取失败'
                    ,skin: 'msg'
                    ,time: 1 //2秒后自动关闭
                    });
                    $(".warp_gl_u_sr").empty()
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
                $(".warp_gl_u_sr").empty()
                return false;
            }
        })
    }
// 页数
var page = 0;//从1
var size = 10;
var ticket ='';
    //滑动加载更多
$(function(){

    // dropload
    $('#content').dropload({
        scrollArea : window,
        loadDownFn : function(me){
            page++;
            console.log(page)
            var dataType = $('.current').attr('data-type');
            get_activity_auditee($_GET['sectionCode'],dataType,"","",page,size,2,me);
        }
    })
})
var globalTypeNum  = 0;
    //岗位==任务
    function get_job_enroll_list(data,typeNum){
        globalTypeNum = typeNum;
        var html = '';
        html += '<li id="'+data.user+'">\
                    <a href="javascript:void(0)">\
                        <div class="warp_gl_u_se">';

        html += data.headImg?'<img src="'+data.headImg+'">':'<img src="../wap/img/pws_244.png">';

        html += '<div class="warp_gl_u_sw">\
                        <div class="warp_gl_u_sq">';

        html += data.shareUser?'<span>推荐人：'+data.shareUser+'</span>':'';

        var userName = data.nickName;
        if(typeNum == 5 || typeNum == 6){
            userName = data.realName;
        }
        html += userName?'<b name="nickName" data-id="'+data.user+'">'+userName+'</b>':'<b name="nickName" data-id="'+data.user+'"></b>';
        html +=    '</div>';
        var jobsName = "";
        if(typeNum == 1) {
            jobsName = '<br />岗位名称：'+data.name;
        }
        if(data.sourceType==10){
            html += '<p>报名来源：预报名'+jobsName+'</p>';
        }else if(data.sourceType==20){
            html += '<p>报名来源：直接发证'+jobsName+'</p>';
        }else if(data.sourceType==30){
            html += '<p>报名来源：任务'+jobsName+'</p>';
        }else if(data.sourceType==40){
            html += '<p>报名来源：顶岗/转接/转赠'+jobsName+'</p>';
        }else if(data.sourceType==50){
            html += '<p>补登'+jobsName+'</p>';
        }
        html += '</div></div>';
        if(data.ticketState==-10){
            html += '<div class="warp_gl_u_sj">\
                            <span><img src="../wap/img/pws_245.png"> 作废......</span>\
                        </div>';
        }else if(data.ticketState==10){
            html += '<div class="warp_gl_u_sj">\
                            <span><img src="../wap/img/pws_245.png"> 待使用......</span>\
                        </div>';
        }else if(data.ticketState==20){
            html += '<div class="warp_gl_u_sj">\
                        <span style="background-image:url(\'../wap/img/pws_245.png\');background-repeat:no-repeat;background-position:5% 50%;background-size:auto 30px;">签到时间：'
                            +get_date(data.checkInTime,0,0);
            if(typeNum == 1){
                html += '<br />签出时间：'+get_date(data.checkOutTime,0,1)+'</span>';
            }
            html += '</div>';
        }else if(data.ticketState==30){
            html += '<div class="warp_gl_u_sl">\
                            <span>总服务时长：'+toHourMinute(data.validTime)+'</span>\
                            <em></em>\
                            <!--<b>签到时间&nbsp;&nbsp;<time>15:00</time></b>-->\
                        </div>';
        }else if(data.ticketState==40){
            html += '<div class="warp_gl_u_sj">\
                    <span><img src="../wap/img/pws_245.png"> 转岗中......</span>\
                </div>';
        }else if(data.ticketState==50){
            html += '<div class="warp_gl_u_sj">\
                            <span><img src="../wap/img/pws_246.png">冻结中：XXX监管平台</span>\
                        </div>';
        }else if(data.ticketState==60){
            html += '<div class="warp_gl_u_sj">\
                            <span><img src="../wap/img/pws_246.png">锁定中：XXX监管平台</span>\
                        </div>';
        }

        html += '</a>\
                <div class="warp_gl_u_sk">';
        html += '<a href="tel:'+data.mobile+'">联系</a>';
        if(typeNum == 1) {
            //【点名】- 仅岗位票有1）显示规则：票的状态为【待使用】和【使用中】显示
            //使用规则：该【场次开始前4小时-场次当天24点】才可使用，其他时间段灰色不可点击
            var newTime = new Date();
            var date = data.arriveTime;
            date = date.replace(/-/g,'/');
            var createTime = (new Date(date).getTime()) - 4 * 60 * 60 * 1000;//开始时间前的四小时
            var newDay = new Date(newTime.getFullYear()+"/"+(newTime.getMonth()+1)+"/"+newTime.getDate()+" 23:59:59").getTime();
            if (data.ticketState == 10 ) {
                if (newTime.getTime() >= createTime) {//场次开始前4小时
                    if (newTime.getTime() <= newDay) {
                        html += "<a href=\"javascript:void(0)\" onclick='jumpScan(\""+data.qrCode+"\",\""+data.user+"\")'>点名</a>";
                    } else {
                        html += '<a href="javascript:void(0)" style="color: #AEAEAE">点名</a>';
                    }
                } else {
                    html += '<a href="javascript:void(0)" style="color: #AEAEAE">点名</a>';
                }
            } else {
                html += '<a href="javascript:void(0)" style="color: #AEAEAE">点名</a>';
            }
        }
        var signStatus = data.signStatus;
        if(signStatus==0 || signStatus==2){
            html += '<a href="javascript:void(0)" onclick="block_st(\'' + data.ticket + '\',\'' + data.user + '\',3,\'' + data.nickName + '\');">启用</a>';
        }else if(signStatus==1 || signStatus==3){
            html += '<a href="javascript:void(0)" onclick="block_st(\'' + data.ticket + '\',\'' + data.user + '\',2,\'' + data.nickName + '\');">停用</a>';
        }else if(signStatus==4){
            html += '<a href="javascript:void(0)" style="color: #AEAEAE">停用</a>';
        }
        if(typeNum == 1 || typeNum == 2 || typeNum == 7) {
            if (data.ticketState == 20 || data.ticketState == 30) {
                if(data.evaluate != 20 && data.evaluate != 30){
                    html += '<a href="/order/admin_evaluate.html?ticket=' + data.ticket +'">评价</a>';
                }
            }
        }
        html += '</div></li>';
        return html;
    }


var geolocation = new BMap.Geolocation(), lat="", lng="",lnglat="0", address="";
var gc = new BMap.Geocoder();
geolocation.getCurrentPosition( function(r) {   //定位结果对象会传递给r变量
        if(this.getStatus() == BMAP_STATUS_SUCCESS){  //通过Geolocation类的getStatus()可以判断是否成功定位。
            var pt = r.point;
            gc.getLocation(pt, function(rs){
                lat = rs.point.lat;
                lng = rs.point.lng;
                lnglat = lng+","+lat;
                address = rs.address;
            });
        }
    },{enableHighAccuracy: true}
)
  function block_st(ticketCode,user,status,nickName) {
      if(address==""){
          layer.open({
              content: "定位失败，请稍后重试。"
              , btn: ['确定']
          });
          return;
      }
      var statusTitle = '确定要启用“' + nickName + '”吗？启用“' + nickName + '”，开始计算TA的有效服务时长。', statusName = '启用';
      if(status==2){
          statusTitle = '确定要停用“' + nickName + '”吗？停用期间，“' + nickName + '”的服务时长不做计算', statusName = '停用';
      }
      layer.open({
          content: statusTitle
          , btn: ['确定', '取消']
          , yes: function (index) {
              $.ajax({
                  xhrFields: {
                      withCredentials: true
                  },
                  type: 'post',
                  url: base_url + "html5/v1/recruit/startOrStop",
                  data: JSON.stringify({
                      "address": address,
                      "lat": lat,
                      "lng": lng,
                      "locationType": "WIFI",
                      "signStatus": status,
                      "sourceType": 2,
                      "ticketCode": ticketCode,
                      "userCode": user
                  }),
                  dataType: 'json',
                  headers: {'Content-Type': 'application/json', 'token': getCookie("token")},
                  success: function (data) {
                      if (data.code == 0) {
                          layer.open({
                              content: "已经"+statusName+"。"
                              , btn: ['确定']
                              , yes: function (index){
                                  window.location.reload();
                                  //setTimeout(function(){window.location.reload();},1000);
                              }
                          });
                      }else{
                          layer.open({
                              content: data.msg
                              , btn: ['确定']
                          });
                      }
                  }
              });
          }
      })
  }
 $(".warp_gl_u_su").click(function () {
     var nickName = $(".warp_gl_u_sy").val();
     if(nickName==null || nickName==undefined || nickName==""){
         layer.open({
             content: '请输入查询条件'
             ,skin: 'msg'
             ,time: 1 //2秒后自动关闭
         });
         return;
     }
     var datas1 = JSON.parse(datas);
     datas1["searchValue"]=nickName;
     datas1["pageNumber"]=1;
     page = 1;
     //datas1.put("searchValue",nickName);
     $.ajax({
         xhrFields: {
             withCredentials: true
         },
         type:"post",
         url:base_url + "html5/v1/"+searchUrl,
         data:JSON.stringify(datas1),
         dataType:'json',
         headers : {'token':token},
         contentType: "application/json;charset=utf-8",
         success:function(data){
             var html ='';
             var data_list = '';
             if(data.code==0){
                 data_list = data.data.records;
                 $("#all_num").html(data.data.total)
                 if(data_list!=''){
                     $.each(data_list,function(index,val){
                         html += get_job_enroll_list(val,globalTypeNum);
                     })
                     $(".warp_gl_u_sr").empty();
                     $(".warp_gl_u_sr").html(html);
                 }else{
                     html += "<div class=\"zw_sj_p\">\
                            <img src=\"../wap/img/pws_164.png\">\
                        </div>";
                     $(".warp_gl_u_sr").empty()
                     $(".warp_gl_u_sr").html(html);
                 }
             }else{
                 layer.open({
                     content: '获取失败'
                     ,skin: 'msg'
                     ,time: 1 //2秒后自动关闭
                 });
                 $(".warp_gl_u_sr").empty()
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
             $(".warp_gl_u_sr").empty()
             return false;
         }
     })
     /*$("b[name='nickName']").each(function(i, obj){
         if($(obj).html().indexOf(nickName) >= 0){
             $("#"+$(obj).attr("data-id")).show();
         }else{
             $("#"+$(obj).attr("data-id")).hide();
         }
     });*/
 });
    //任务
    //function
    //  function block_st(ticket,user,status,nickName){
    //     var html ='确定要停用“'+nickName+'”吗？停用期间，'+nickName+'的服务时长无效';
    //     layer.open({
    //         content: html
    //             ,btn: ['确定', '取消']
    //             ,yes: function(index){
    //                 location.href= './sign_in.html?ticket='+ticket+"&usercode="+user+'&signstatus='+status+'';
    //             }
    //         })
    // }
