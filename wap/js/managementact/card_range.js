var sectionCode = $_GET['sectionCode'];
  //获取当前场次下岗位信息
    function get_find_job(){
        var html = '';
        $.ajax({
            xhrFields: {
               withCredentials: true
            },
            type:"post",
                url:base_url + 'html5/v1/recruit/findBySectionCode',
                data:JSON.stringify({"sectionCode":sectionCode}),
                dataType:'json',
                contentType: "application/json;charset=utf-8",
                beforeSend:function(XMLHttpRequest){
                    layer.open({type: 2,content: '加载中'});
                },
                success:function(data){
                    console.log(data);
                    if(data.code==0){
                        layer.closeAll();
                        var data1 = data.data;
                        if(data1!=''){
                            $.each(data1,function(index,val){
                            html += ' <li data-code="'+val.sectionCode+'">\
                                        <a href="javascript:void(0)">\
                                            <b>'+val.name+'</b>\
                                            <span id="warp_dk">打卡范围：<i><input type="text" name="radius" value="'+(val.radius/1000)+'" readonly="readonly" unselectable="on" onfocus="this.blur()">公里</i></span>\
                                        </a>\
                                    </li>';
                            })
                            $('.warp_gl_u_sh').empty();
                            $('.warp_gl_u_sh').html(html);
                        }
                       
                    }else{
                        layer.closeAll();
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
                        content: '网络错误'
                        ,skin: 'msg'
                        ,time: 1 //2秒后自动关闭
                        });
                        return false;
                }
        })
    }

