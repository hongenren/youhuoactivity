//获取当前定位信息
function selectMap(){
    var map = new BMap.Map("allmap");
    var point = new BMap.Point(116.331398,39.897445);
    map.centerAndZoom(point,12);
    var geolocation = new BMap.Geolocation();
    var latCurrent = '';
    var lngCurrent = '';
    geolocation.getCurrentPosition(function(r){
        if(this.getStatus() == BMAP_STATUS_SUCCESS){
            var mk = new BMap.Marker(r.point);
            map.addOverlay(mk);
            map.panTo(r.point);
            latCurrent = r.point.lat;
            lngCurrent = r.point.lng;
            var city = r.address.city;
            //get_index_msg(city,latCurrent,lngCurrent);
        }else {
            layer.open({
                content: '获取定位失败,请重试'
                ,skin: 'msg'
                ,time: 1 //2秒后自动关闭
            });
        }
    });
    localStorage.setItem('latCurrent',latCurrent);
    localStorage.setItem('lngCurrent',lngCurrent);
}
//获取当前定位信息
function get_current_msg(){
    var map = new BMap.Map("allmap");
    var point = new BMap.Point(116.331398,39.897445);
    map.centerAndZoom(point,12);
    var geolocation = new BMap.Geolocation();
    var latCurrent = '';
    var lngCurrent = '';
    geolocation.getCurrentPosition(function(r){
        if(this.getStatus() == BMAP_STATUS_SUCCESS){
            var mk = new BMap.Marker(r.point);
            map.addOverlay(mk);
            map.panTo(r.point);
            latCurrent = r.point.lat;
            lngCurrent = r.point.lng;
            var city = r.address.city;
            //get_index_msg(city,latCurrent,lngCurrent);
        }else {
            layer.open({
                content: '获取定位失败,请重试'
                ,skin: 'msg'
                ,time: 1 //2秒后自动关闭
            });
        }
    });
    localStorage.setItem('latCurrent',latCurrent);
    localStorage.setItem('lngCurrent',lngCurrent);
    get_index_msg("上海",latCurrent,lngCurrent);
}
//获取主页信息
function get_index_msg(city,latCurrent,lngCurrent){
    var user_msg = $.cookie('user_msg');
    var Formdata={"city":city,"lat":latCurrent,"lng":lngCurrent};
    if(user_msg!==undefined){
        var user_msg = JSON.parse(user_msg);
        if(user_msg.userCode){
            Formdata.userCode = user_msg.userCode;
        }
        if(user_msg.userId){
            Formdata.prjvUserId=user_msg.userId
        }
    }

    $.ajax({
        xhrFields: {
           withCredentials: true
        },
        type:"post",
        url:base_url + "html5/v1/index",
        //async:false,
        data:JSON.stringify(Formdata) ,
        headers : {'token':''},
        dataType:'json',
        contentType: "application/json;charset=utf-8",
        success:function(data){
            if(data.code==0){
                var data1 = data.data;
                city_msg(city);// 定位城市信息
                //weather_msg(data1.weather);//天气信息
                banner_msg(data1.ads);//加载轮播图信息
                goods_msg(data1.goods);// 加载资源秒杀信息
                look_msg(data1.look); //加载 附近活动信息
                act_msg(data1.acts); //加载 附近活动信息

                if(data1.mypost!==''){
                    var myposts=data1.mypost[0];
                    var address=myposts.address;
                    var name=myposts.name;
                    var pkPostCode=myposts.pkPostCode;
                    var startDay=myposts.startDay;
                    var lastDay=myposts.lastDay;
                    var serviceBeginTime=myposts.serviceBeginTime;
                    var serviceEndTime=myposts.serviceEndTime;
                    var list=myposts.list[0];
                    var time=list.day+' '+serviceBeginTime+'-'+serviceEndTime;
                    // if(startDay==lastDay){
                    //     time=startDay+' '+serviceBeginTime+'-'+serviceEndTime
                    // }else {
                    //     time=startDay+' '+serviceBeginTime+'-'+lastDay+' '+serviceEndTime
                    // }
                    var btnTxt='签到打卡';
                    if(list.isManual==1){
                        btnTxt='签出打卡'
                    }

                    var li='<h2>'+name+' <button class="postClockBtn" onclick="newPostSign(\''+pkPostCode+'\')">'+btnTxt+'</button></h2>\n' +
                        '            <div class="postClockList">'+time+'</div>\n' +
                        '            <div class="postClockList op">'+address+'</div>';

                    if($.cookie('user_msg')==undefined||$.cookie('token')==undefined){
                        $(".warp_pws_clock").hide();
                    }else {
                        $(".warp_pws_clock").show();
                    }
                    $(".postClockWrap").html(li)
                }else {
                    $(".warp_pws_clock").hide();
                }
            }
        },
        error:function(){
            layer.open({
                content: '获取失败'
                ,skin: 'msg'
                ,time: 1 //2秒后自动关闭
            });
        }
    })
}
//主页定位信息
function city_msg(city){
    $(".warp_pws_p_sp span").html(city+'<i></i>');
}
//天气信息
function weather_msg(data){
    $(".warp_pws_p_si img").attr('src',data.icon);
    $(".warp_pws_p_si span").text(data.temp);
}
//主页轮播图信息
function banner_msg(data){
    var html = '';
    $.each(data,function(index,val){
        //if(index==1){
            html += '<div class="swiper-slide">\
                    <a href="javascript:void(0)" onclick="jumpBankIndex(\''+val.url+'\')"><img src="'+val.img+'"></a>\
                </div>';
       /* }else{
            html += '<div class="swiper-slide">\
                    <a href="'+val.url+'"><img src="'+val.img+'"></a>\
                </div>';
        }*/
    })
    $(".swiper-wrapper").empty();
    $(".swiper-wrapper").append(html);
    var mySwiper2 = new Swiper('#banner',{
        autoplay:5000,
        visibilityFullFit : true,
        loop:true,//无限循环
        pagination : '.pagination'
    })
}
// //资源秒杀
// function goods_msg(data){
//     var day =  get_day_msg(data.day);
//     $("#days").text(day +'场');
//     $(".warp_pws_y_i b").text(data.title);
//     $(".warp_pws_y_p").attr('src',data.icon);
//     $("#total").text(data.total);
//     $("#jifen").text(data.jifen);
//     $("#residue").text(data.residue);
//     $("#gname").text(data.name);

// }
//资源秒杀
function goods_msg(data){
    //var day =  get_day_msg(data.day);
    //$("#days").text(day +'场');
    //$(".warp_pws_y_i b").text(data.title);
    $(".warp_pws_y").attr('href',data.url);
    //$("#total").text(data.total);
    //$("#jifen").text(data.jifen);
    //$("#residue").text(data.residue);
    //$("#gname").text(data.name);

}
//大家都在看
function look_msg(data){
    var html = '';
    $.each(data,function(index,val){
        html += '<li>\
                    <a href="'+val.url+'">\
                        <img src="'+val.img+'">\
                    </a>\
                </li>';
    })
    $(".warp_pws_t_su").empty();
    $(".warp_pws_t_su").html(html);
}
//附近活动
function act_msg(data){
    var html = '';
    $.each(data,function(index,val){
        var startDay = get_day_msg(val.startDay);
        var endDay = get_day_msg(val.endDay);
        html += '<li>\
                    <a href="./activity/activity_content.html?activityCode='+val.activityCode+'">';
                if(val.coverImg!=''){
                    html += '<img src="'+val.coverImg+'?x-oss-process=image/crop,w_1000,h_500,g_center">';//
                }else{
                    html += '<img src="./wap/img/pws_37.jpg">';
                }
                if(val.startDay=='--'){
                    html += '<b>'+val.name+'</b>\
						<span>'+endDay+'</span>\
						</a>\
					</li>';
                }else{
                    html += '<b>'+val.name+'</b>\
						<span>'+startDay+'-'+endDay+'</span>\
						</a>\
					</li>';
                }

    })
    $(".warp_pws_t_sy").empty();
    $(".warp_pws_t_sy").append(html);
}

$.ajax({
    type:"get",
    url:news_base_url+"/cm/unitapi/getIndexList?type=2&autitFlag=2&pageNum=0&pageSize=1",
    dataType:'json',
    success:function(data){
        if(data.success==1){
            var data1 = data.data;
            if(data1!=null){
                var tit = data1[0].title;
                if(tit.length>=15){
                    tit = tit.substring(0, 15)+"...";
                }
                $(".warp_pws_i").show().html(
                    '<img src="./wap/img/pws_12.jpg" class="warp_pws_i_ip">\
                    <em></em>\
                    <img src="'+data1[0].title_img+'" class="warp_pws_i_io">\
                    <div class="warp_pws_i_ii">\
                    <span style="white-space:pre-wrap;">'+tit+'</span>\
                    </div>\
                    <i>'+data1[0].news_date.substr(0,data1[0].news_date.length-3)+'</i>');
                $(".warp_pws_i").click(function(){
                    $(location).attr('href', news_base_url+'/gysh_cm_pub/article/normal/detail/'+data1[0].article_id+'.html');
                });
            }
        }
    }
})
