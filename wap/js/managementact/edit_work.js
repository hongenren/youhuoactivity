
//查询回显岗位信息
    function get_work_msg(){
        var demo = decodeURI(decodeURI($_GET['demo']));//获取岗位描述
        var arriveTime = datetime_msg($_GET['arriveTime']); //报到时间 
        var inIntegral = $_GET['inIntegral'];

        $("input[name='demo']").val(demo);
        $(".demo_time").val(arriveTime);
        $("input[name='inIntegral']").val(inIntegral);
    }
    //获取时间信息
    function datetime_msg(arriveTime){
        var arriveTime = parseInt(arriveTime);
        var date = new Date(arriveTime);
        Y = date.getFullYear() + '-';
        M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
        D = (date.getDate()< 10? '0' + date.getDate():date.getDate()) + ' ';
        h = (date.getHours()<10? '0' + date.getHours():date.getHours()) + ':';
        m = (date.getMinutes()<10? '0' + date.getMinutes():date.getMinutes());
        s = (date.getSeconds()<10 ?'0' + date.getSeconds():date.getSeconds()); 
        return Y+M+D+h+m;
    }
    //提交修改信息\
    function edit_sub(){
        var arr = $('#form').serializeArray();
        var json = {};
        $.each(arr, function(){
            json[this.name] = this.value;
        });
        json['arriveTime'] = json['arriveTime']+":00";
        json['code'] = $_GET['code'];
        json['ticketOrder'] = $_GET['ticketOrder'];
        //console.log(json);return;
        $.ajax({
            xhrFields: {
               withCredentials: true
            },
            type:"post",
            url:base_url +'html5/v1/recruit/changeInfo',
            data:JSON.stringify(json),
            dataType:'json',
            headers : {'token':token},
            contentType: "application/json;charset=utf-8",
            success:function(data){
                if(data.code==0){
                    layer.open({content: '操作成功',skin: 'msg',time: 1});
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