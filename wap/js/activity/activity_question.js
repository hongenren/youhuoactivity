// var user_msg = '';
// var token = '';
// if($.cookie('user_msg')){
//   user_msg = JSON.parse($.cookie('user_msg'));  
// }
var recruitCode = $_GET['recruitcode'];
//获取题目 以及答案信息
function get_question_msg(){
    var html = '';
     $.ajax({
            xhrFields: {
               withCredentials: true
            },
            type:'POST',
            url:base_url + 'html5/v1/recruit/queryQuestionByRecruitCode',
            data:JSON.stringify({'recruitCode':recruitCode}),
            dataType:'json',
            contentType: "application/json;charset=utf-8",
            beforeSend:function(XMLHttpRequest){
                $(".warp_hd_u_ba").html("<img src='/wap/img/loading.gif' style='width:24px;heigth:24px; margin:0 auto;display:block'/>");
            },
            success:function(data){
                console.log(data);
                if(data.code==0){
                    var data1 = data.data;
                    $.each(data1,function(index,val){
                        var num = index+1;
                        html += '<div class="warp_hd_u_bl">\
                                <p class="warp_hd_u_bk">'+num+'.'+val.question+'</p>\
                                <ul class="warp_hd_u_bj" data-code="'+val.code+'">';
                        var answer = JSON.parse(val.answer);
                        $.each(answer,function(index1,val1){
                            var anName = ["A","B","C","D"];
                            if(val1!=""){
                                html += '<li onclick="cilckI(this)" data-val="'+index1+'">\
                                        <i>'+anName[index1]+'</i>\
                                        <span>'+val1+'</span>\
                                    </li>';
                            }
                        })  
                        html += '</ul>\
                                </div>';
                    })
                    $('.qusetion').append(html);
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
///
function questionSub(){
    var status = true;
    var list =[];
    $(".warp_hd_u_bj").each(function(index,val){
       var answer = $(this).attr('data-answer');
       var code = $(this).attr('data-code');
       if(answer==''||answer==undefined){
            layer.open({content: '请确保所有问题都选择了答案',skin: 'msg',time: 1 });
            status = false;
       }
       if(code==''){
            layer.open({content: '题目code不能为空',skin: 'msg',time: 1 });
            status = false;
       }
       list.push({"answer":answer,"questionCode":code});
    })
    if(status==true){
        localStorage.setItem(recruitCode,JSON.stringify(list));
        if(localStorage.getItem(recruitCode)!=''){
            layer.open({content: '答题完毕，请点击对应岗位报名',skin: 'msg',time: 1});
            setTimeout(function(){window.history.go(-1);},1000);
        }
    }
}
$(function(){
        get_activity_msg();
        queryByTicketOrder();
        var cotrs = $(".warp_hd_u_bj li");
        cotrs.live('click',function(){
            var val = $(this).attr('data-val')        
            $(this).parent().attr('data-answer',val);
            $(this).addClass("thisclass").siblings().removeClass("thisclass");
        });
    });

function cilckI(obj){
    var val = $(obj).attr('data-val')
    $(obj).parent().attr('data-answer',val);
    $(obj).addClass("thisclass").siblings().removeClass("thisclass");
}

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
                $(".name").html(data1.name);
                $(".orgName").html("<i></i>"+data1.orgName);
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
function queryByTicketOrder(){
    var ticketOrder = $_GET['ticketOrder'];
    $.ajax({
        xhrFields: {
            withCredentials: true
        },
        type:"post",
        url:base_url + "html5/v1/recruit/queryByTicketOrder",
        data:JSON.stringify({"ticketOrder":ticketOrder}),
        dataType:'json',
        contentType: "application/json;charset=utf-8",
        success:function(data){
            //console.log(data)
            if(data.code==0){
                var data1 = data.data;
                $(".name1").html(data1.name);
                $(".demo").html(data1.demo);
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