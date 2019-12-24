var dataJson = {}
function listAllByPage(pageNumber, pageSize){
    $(".warp_bp_p").empty();
    $('#content').dropload({
        scrollArea: window,
        loadDownFn: function (me) {
            $(".dropload-down").remove();
            pageNumber++;
            if ($("#name_input").val()) {
                dataJson.name = $("#name_input").val();
            }
            dataJson.pageNumber = pageNumber;
            dataJson.pageSize = pageSize;

            $.ajax({
                xhrFields: {
                    withCredentials: true
                },
                type: 'post',
                url: base_url + "html5/v1/counselor/site/listAllByPage",
                data: JSON.stringify(dataJson),
                dataType: 'json',
                contentType: "application/json;charset=utf-8",
                success: function (data) {
                    if (data.code == 0) {
                        var data1 = data.data.records;
                        var html = "";
                        if(data1.length>0) {
                            var html = "";
                            $.each(data1,function(v,k) {
                                html += '<li><a href="./counselor_detail.html?code='+k.code+'">';
                                if(k.logo!=''){
                                    html += '<img src="' +k.logo +'">';
                                }else{
                                    html += '<img src="../wap/img/pws_37.jpg">';
                                }
                                html += '<div class="warp_bp_p_sp" style="height: 100%">\
                                                <div class="warp_bp_p_so">\
                                                    <b style="font-size: 16px;font-weight: bold;line-height: 64px">'+k.name+'</b>\
                                                </div>';
                                html += '</div></a></li>';
                            });
                            $(".warp_bp_p").append(html);
                            me.resetload();
                        }else{
                            $(".noneLi").hide();
                            $(".warp_bp_p").append(
                                "<li class='noneLi' style='background: #F2F2F2;'>\
                                    <a href='javascript:void(0)'>\
                                    <h3 style='text-align: center;'>已经没有更多啦。。。</h3>\
                                    </a>\
                                </li>");
                            me.lock();
                            me.noData();//无数据重置
                            me.resetload();
                        }
                    }else{
                        layer.open({
                            content: resp.msg
                            ,skin: 'msg'
                            ,time: 1
                        });
                        me.lock();
                        me.noData();
                    }
                },
                error:function(e){
                    layer.open({
                        content: '获取失败'
                        ,skin: 'msg'
                        ,time: 1
                    });
                    me.lock();
                    me.noData();//无数据重置
                    me.resetload();
                }
            })
        }
    })
}

function searchByName(){
    $(".warp_bp_p").empty();
            $.ajax({
                xhrFields: {
                    withCredentials: true
                },
                type: 'post',
                url: base_url + "html5/v1/counselor/site/searchByName",
                data: JSON.stringify({"name": $("#name_input").val()}),
                dataType: 'json',
                contentType: "application/json;charset=utf-8",
                success: function (data) {
                    if (data.code == 0) {
                        var data1 = data.data.records;
                        var html = "";
                        if(data1.length>0) {
                            var html = "";
                            $.each(data1,function(v,k) {
                                html += '<li><a href="./counselor_detail.html?code='+k.code+'">';
                                if(k.logo!=''){
                                    html += '<img src="' +k.logo +'">';
                                }else{
                                    html += '<img src="../wap/img/pws_37.jpg">';
                                }
                                html += '<div class="warp_bp_p_sp" style="height: 100%">\
                                                <div class="warp_bp_p_so">\
                                                    <b style="font-size: 16px;font-weight: bold;line-height: 64px">'+k.name+'</b>\
                                                </div>';
                                html += '</div></a></li>';
                            });
                            $(".warp_bp_p").append(html);
                        }else{
                            $(".noneLi").hide();
                            $(".warp_bp_p").append(
                                "<li class='noneLi' style='background: #F2F2F2;'>\
                                    <a href='javascript:void(0)'>\
                                    <h3 style='text-align: center;'>已经没有更多啦。。。</h3>\
                                    </a>\
                                </li>");
                        }
                    }else{
                        layer.open({
                            content: resp.msg
                            ,skin: 'msg'
                            ,time: 1
                        });
                    }
                },
                error:function(e){
                    layer.open({
                        content: '获取失败'
                        ,skin: 'msg'
                        ,time: 1
                    });
                }
            })
}