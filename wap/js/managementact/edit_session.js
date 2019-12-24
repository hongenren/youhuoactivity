    //选项卡切换
    $(".ccgq_t li").click(function(){
        $(this).addClass("choice").siblings().removeClass("choice");
        var type = $(this).attr("data-type");
        $(".ccgq_c li").eq($(this).index()).show().siblings().hide();
        $(".type").val(type);
    })
    $(function(){
        var sectionCode = $_GET['sectionCode'];
        var day = $_GET['day']?$_GET['day']:'0000-00-00';
        var starttime = $_GET['starttime'];
        var endtime = $_GET['endtime'];
        var type = get_session_type($_GET['type']);
        var day_msg = day.split('-');
        var day_str = day_msg[1] + "月" + day_msg[2] + "日" + type + " " + starttime +'-'+ endtime;
        $('.ccgqhead').find('i').text(day_str);
        $("input[name='day']").val(day);
        $("input[name='startTime']").val(starttime);

    })
    function sub(){
        var arr = $('#form1').serializeArray();
        var json = {};
        $.each(arr, function(){
            json[this.name] = this.value;
        });
        var type = $('.type').val();
        if(type==1){
            var datetime = getFormatDate();
            if(!compareTime(datetime,(json['newDay'] + " 00:00:00"))){
                layer.open({ content: '所选时间不能小于当前时间' ,skin: 'msg' ,time: 1});    
                return false;
            }
            if(json['reason1']==''){
                layer.open({ content: '请填写原因' ,skin: 'msg' ,time: 1});    
                return false;
            }
            json['reason'] = json['reason1'];

        }else{
            if(json['reason2']==''){
                layer.open({ content: '请填写原因' ,skin: 'msg' ,time: 1});    
                return false;
            }
            json['reason'] = json['reason2'];
            json['newDay'] = "";
        }
        delete json['reason1'];
        delete json['reason2'];
        json['code'] = $_GET['sectionCode'];
        json['user'] = user_msg.userId;
        //console.log(json);
        $.ajax({
                xhrFields: {
                   withCredentials: true
                },
                type:"post",
                url:base_url +'/html5/v1/section/changeSectionDate',
                data:JSON.stringify(json),
                dataType:'json',
                headers : {'token':token},
                contentType: "application/json;charset=utf-8",
                beforeSend:function(XMLHttpRequest){
                    layer.open({type: 2,content: '提交中'});
                },
                success:function(data){
                    //console.log(data);
                    if(data.code==0){
                        layer.closeAll();
                        layer.open({content: '操作成功',skin: 'msg',time: 1});
                        setTimeout(function(){window.history.back();},1000);
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
                        content: '获取失败'
                        ,skin: 'msg'
                        ,time: 1 //2秒后自动关闭
                        });
                        return false;
                }
            })
    }

    var theme = "ios";
    var mode = "scroller";
    var display = "bottom";
    var lang="zh";
    var currYear = (new Date()).getFullYear();
    // Date & Time demo initialization
    $('.demo_time').mobiscroll().date({
        theme: theme,
        mode: mode,
        display: display,
        lang: lang,
        //timeWheels: 'HHiiss',//HH:24小时制；hh:12小时制
        dateFormat:"yy-mm-dd",
        //timeFormat: 'HH:ii',
        startYear: currYear,
        endYear: currYear +30,
        stepMinute: 1,
        showNow: true
    });
