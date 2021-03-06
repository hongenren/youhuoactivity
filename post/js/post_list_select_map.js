var total="", area_info_city_html="", cityId = "";
function clickTitle(){
    $(".select_add_div").show();
    $(".type").show();
    get_msg();
    $(".mb").on("click",function(){
        $(".hylistsxc").hide();
        $(".mb").hide();
        $(".screenBut").removeClass("choice");
    })
}
function get_msg(){
    $('#allmap').attr('lat',31.24916171);
    $('#allmap').attr('lng',121.48789949);
    $('#allmap').attr('city',"上海");
    //$("#area_info_city").html('上海<i></i>'+total);
    var map = new BMap.Map("allmap");
    var point = new BMap.Point(116.331398,39.897445);
    map.centerAndZoom(point,12);
    var geolocation = new BMap.Geolocation();
    geolocation.getCurrentPosition(function(r){
        if(this.getStatus() == BMAP_STATUS_SUCCESS){
            var mk = new BMap.Marker(r.point);
            map.addOverlay(mk);
            map.panTo(r.point);
            latCurrent = r.point.lat;
            lngCurrent = r.point.lng;
            city = r.address.city;
            $('#allmap').attr('lat',latCurrent);
            $('#allmap').attr('lng',lngCurrent);
            $('#allmap').attr('city',city);
            area_info_city_html = city+'<i></i>';
            $("#GPS_city_b").html(city+"<i style=\"color: #999999;\">GPS定位</i>");
        }else{
            $("#GPS_city_b").html("上海市<i style=\"color: #999999;\">GPS定位</i>");
            area_info_city_html = '上海市<i></i>';
            layer.open({
                content: '获取定位失败,请重试'
                ,skin: 'msg'
                ,time: 1 //2秒后自动关闭
            });
        }
        $("#area_info_city").html(area_info_city_html+total);
        //queryIndex();
    });
    get_district_msg_city(adParent,1,initialAdName,initialAdCode);
    get_quanguo();
    clickProvince($("#andiquzhao"), 1);
}
function get_quanguo(){
    $(".mb_2").hide();
    var html = "";
    var arr = { "parent": 0};
    $.ajax({
        xhrFields: {
            withCredentials: true
        },
        type:'post',
        url:base_url + "/html5/v1/region/findByParent",
        data:JSON.stringify(arr),
        dataType:'json',
        contentType: "application/json;charset=utf-8",
        success:function(data){
            var data_index = data.data;
            $.each(data_index,function(k,val) {
                html += '<li style="width: 50%;float: left;text-align: center;">\
                                    <a href="javascript:void(0)" data-id="' + val.areaCode + '" onclick=get_district_msg_province(' + val.id + ',' + 0 + ',"' + val.name + '",' + val.areaCode + ')>' + val.name + '</a>\
                                </li>';
            });
            $("#province").html(html);
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
/*——————————————————————————————————————————————————————————————————————————————————————————————————————*/
function get_district_msg(parent,type,name,areaCode){
    var city = $('#allmap').attr('city');
    if(type+1 == 5 || parent==-1){
        //判断 如果点击的是村级  则关闭选项并传值
        $(".hylistsx1").hide();
        $(".mb_1").hide();
        //$(".choice").removeClass("choice");
        $("#area_info").html(htmlSubstring(name)+'<i></i>');
        $("#area_info").attr('data-id',areaCode);
        adCode = areaCode;
        adName = name;
        adIf = 1;
        queryByType();
        $(".chylisthead .screenButList").removeClass('choice');
        return ;
    }
    var html = '';
    $.ajax({
        xhrFields: {
            withCredentials: true
        },
        type:'post',
        url:base_url + "/html5/v1/region/findByParent",
        data:JSON.stringify({"parent":parent}),
        dataType:'json',
        contentType: "application/json;charset=utf-8",
        success:function(data){
            if(data.code==0){
                var data_index = data.data;
                $.each(data_index,function(k,val){
                    if(k==0){
                        if(type == 0) {
                            if(zhixiashi(name)){
                                html += '<li class="choice">\
                                    <a href="javascript:void(0)" data-id="310" onclick=get_district_list("'+name+'",'+areaCode+',0,'+val.id+')>全省</a>\
                                </li>';
                            }
                        }else if(type == 1){
                            html += '<li class="choice">\
                                    <a href="javascript:void(0)" data-id="310" onclick=get_district_list("'+name+'",'+areaCode+',1,'+val.id+')>全市</a>\
                                </li>';
                        }else if(type == 2){
                            html += '<li class="choice">\
                                    <a href="javascript:void(0)" data-id="-1" onclick=get_district_list("'+name+'",'+areaCode+',1,'+val.id+')>全区</a>\
                                </li>';
                        }else if(type == 3){
                            html += '<li class="choice">\
                                    <a href="javascript:void(0)" data-id="-1" onclick=get_district_list("'+name+'",'+areaCode+',1,'+val.id+')>全街道</a>\
                                </li>';
                        }
                    }
                    if(val.name != "市辖区"){
                        if(type == 0) {
                            html += '<li class="choice">\
                                    <a href="javascript:void(0)" data-id="'+val.areaCode+'" onclick=get_district_msg_city('+val.id+','+(type+1)+',"'+val.name+'",'+val.areaCode+')>'+val.name+'</a>\
                                </li>';
                        }else{
                            html += '<li class="choice">\
                                    <a href="javascript:void(0)" data-id="'+val.areaCode+'" onclick=get_district_msg('+val.id+','+(type+1)+',"'+val.name+'",'+val.areaCode+')>'+val.name+'</a>\
                                </li>';
                        }
                    }
                });
                if(type == 0){
                    //添加区
                    $("#city").show();
                    $("#city").html(html);
                }else if(type == 1){
                    $("#area").show();
                    $("#area_c1").hide();
                    $("#area_1").hide();

                    $("#area").html(html);
                }else if(type == 2){
                    $("#area").hide();
                    $("#area_c1").show();
                    $("#area_1").hide();

                    $("#area_c1").html(html);
                }else if(type == 3){
                    $("#area").hide();
                    $("#area_c1").hide();
                    $("#area_1").show();

                    $("#area_1").html(html);
                }
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
/*——————————————————————————————————————————————————————————————————————————————————————————————————————*/
function get_district_msg_province(parent,type,name,areaCode){
    get_district_msg(parent,type,name,areaCode);
    adCode = areaCode;
    adIf = 1;
    queryByType();
    adName = name;
    $("#provinceDiv").hide();
    $("#cityDiv").show();
    $(".choice").removeClass("choice");
}
function get_district_msg_city(parent,type,name,areaCode){
    area_info_city_html = name+'<i></i>';
    $("#area_info_city").html(area_info_city_html);
    $("#area_info").html('按区域<i></i>');
    $("#area_info").attr('data-id',"");
    cityId = parent;
    $("#provinceDiv").show();
    $("#cityDiv").hide();
    $(".hylistsxc").hide();
    $(".screenBut").removeClass("choice");
    $(".mb").hide();
    get_district_msg(parent,type,name,areaCode);
    adCode = areaCode;
    adName = name;
}

function get_district_list(name, areaCode, type, id){
    $(".hylistsx1").hide();
    $(".mb").hide();
    if(type==0){
        area_info_city_html = name+'<i></i>';
        $("#area_info_city").html(area_info_city_html);
        $("#area_info").html('按区域<i></i>');
        $("#area_info").attr('data-id',"");
        get_district_msg_city(id,1,name,areaCode);
    }else{
        $("#area_info").html(htmlSubstring(name)+'<i></i>');
        $("#area_info").attr('data-id',areaCode);
        adCode = areaCode;
        adName = name;
        adIf = 1;
        queryByType();
    }
    $(".screenButList").removeClass('choice');
    return ;
}
/*——————————————————————————————————————————————————————————————————————————————————————————————————————*/
function clickProvince(obj, type){
    if(type==0){
        $(".hylistsx1").css("top", "50");
        $("#hot_city").show();
        $("#gps_city").show();
        $("#city_name").show();
        $("#provinceDiv").show();
        $("#cityDiv").hide();
        $("#area").hide();
        $("#area_c1").hide();
        $("#area_1").hide();
        var cla=$(obj).attr("class");
        if(cla.indexOf("choice") > 0){
            $(".hylistsx1").hide();
            $(".mb_1").hide();
            $(obj).removeClass("choice")
        }else{
            $(obj).addClass("choice").siblings().removeClass("choice");
            $(".hylistsx1").show().siblings().hide();
            $(".mb_1").show();
        }
    }else{
        $(".hylistsx1").css("top", "280");
        $("#hot_city").hide();
        $("#gps_city").hide();
        $("#city_name").hide();
        $("#provinceDiv").hide();
        $("#cityDiv").hide();
        $("#area").show();
        $("#area_c1").hide();
        $("#area_1").hide();
        $(".hylistsx1").show().siblings().hide();
        $(".mb_1").show();
    }
}
function htmlSubstring(html){
    if(html){
        if(html.length>4){
            html = html.substring(0,3)+"...";
        }
    }
    return html;
}