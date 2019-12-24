//获取公益机构资源列表
get_msg();
function get_msg(pageNumber,pageSize,status,me=''){
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
            get_org_list(pageNumber,pageSize,status,me,latCurrent,lngCurrent)
 
        }
        else{
             layer.open({
                content: '获取定位失败,请重试'
                 ,skin: 'msg'
                ,time: 1 //2秒后自动关闭
            });
        }        
    });
}
function get_org_list(pageNumber,pageSize,status,me,latCurrent,lngCurrent){
	var distance = 3000;
	var arr = {"lng":lngCurrent,"lat":latCurrent,"distance":distance};
	$.ajax({
        xhrFields: {
           withCredentials: true
        },
    	type:'post',
        url:base_url + "html5/v1/orgPlace/chooseByLngLatAdCodeMarkTag",
        data:JSON.stringify(arr),
        dataType:'json',
        contentType: "application/json;charset=utf-8",
    	beforeSend:function(XMLHttpRequest){
            $(".warp_sh_u").html("<img src='../wap/img/loading.gif' style='width:24px;heigth:24px; margin:0 auto;display:block'/>");
        },
        success:function(data){
        	console.log(data);
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