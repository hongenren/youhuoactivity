var examineListEvent=function(){
    //通过
    $(".adoptBut").unbind('click').click(function(){
        var id=$(this).parents('.examineList').attr('data-id');
        var err={
            "id": id,
            "status": 20
        };
        layui.use('layer', function(){
            var $ = layui.jquery, layer = layui.layer;
            layer.open({
                type: 1
                ,title: false //不显示标题栏
                ,closeBtn: false
                ,area: '300px;'
                ,shade: 0.8
                ,id: 'LAY_layuipro' //设定一个id，防止重复弹出
                ,btn: ['确定', '取消']
                ,btnAlign: 'c'
                ,moveType: 1 //拖拽模式，0或者1
                ,content: '<div style="padding:30px;text-align:center;line-height: 22px; background-color: #393D49; color: #fff; font-weight: 300;">确定通过？</div>'
                ,success: function(layero){
                    console.log(layero);
                }
                ,yes:function(){
                    console.log('确定');
                    $.ajax({
                        type: "POST",
                        url:base_url + "verify",
                        timeout:5000,
                        data:JSON.stringify(err),
                        dataType: "json",
                        contentType:"application/json",
                        beforeSend:function(XMLHttpRequest){
                            XMLHttpRequest.setRequestHeader("token", $.cookie('token'));
                        },
                        success:function(data){
                            console.log(data);
                            if(data['code']==0||data['code']=="0"){
                                layTxt('通过成功')
                            }else{
                                layTxt('通过失败: '+data.msg)
                            }
                            $(".examineListWrap").empty();
                            pushNum=1;
                            queryVerifyListEvent()
                        },
                        error:function(error,status){
                            console.log('请求出错'+error)
                            errorStatusTime(status);
                        },
                        complete:function(){
                            console.log('请求完成')
                        }
                    });
                }
                ,end:function(){
                    console.log('取消');
                    return false;
                }
            });
        });

    });
    //拒绝
    $(".refuseBut").unbind('click').click(function(){
        var id=$(this).parents('.examineList').attr('data-id');
        var err={
            "id": id,
            "status": -10
        };

        layui.use('layer', function(){
            var $ = layui.jquery, layer = layui.layer;
            layer.open({
                type: 1
                ,title: false //不显示标题栏
                ,closeBtn: false
                ,area: '300px;'
                ,shade: 0.8
                ,id: 'LAY_layuipro' //设定一个id，防止重复弹出
                ,btn: ['确定', '取消']
                ,btnAlign: 'c'
                ,moveType: 1 //拖拽模式，0或者1
                ,content: '<div style="padding:10px 30px;text-align:center;line-height: 22px; background-color: #393D49; color: #fff; font-weight: 300;">确定拒绝？</div>'+
                    '<div class="row" style="width:100%;padding:5px;">\n' +
                    '            <div class="col-sm-12">\n' +
                    '<textarea name="refuseTxt" style="display:inline-block;width:100%;height:2rem;padding:5px;border:1px solid #eee;">您的拒绝原因</textarea>'+
                    '<div class="contentSize" style="padding:5px 10px;text-align:right;">130字以内</div>'+
                    '</div>'+
                    '              </div>'
                ,success: function(layero){
                    console.log(layero);
                    $("textarea[name='refuseTxt']").focus(function(){
                        var txt=$(this).val();
                        if(txt=='您的拒绝原因'){
                            $(this).val('')
                        }
                    });
                    $("textarea[name='refuseTxt']").keyup(function(){
                        var len=130;
                        var valSize=$(this).val();
                        if(valSize.length>len){
                            $(this).val(valSize.substring(0,len));
                            return false
                        }
                        if(len-valSize.length>=0){
                            $(".contentSize").text(len-valSize.length+'字以内')
                        }
                    })
                }
                ,yes:function(){
                    console.log('确定');
                    if($("textarea[name='refuseTxt']").val()==''){
                        layTxt('拒绝原因不能为空！');
                        return
                    }
                    err['rejectReason']=$("textarea[name='refuseTxt']").val();
                    $.ajax({
                        type: "POST",
                        url:base_url + "verify",
                        timeout:5000,
                        data:JSON.stringify(err),
                        dataType: "json",
                        contentType:"application/json",
                        beforeSend:function(XMLHttpRequest){
                            XMLHttpRequest.setRequestHeader("token", $.cookie('token'));
                        },
                        success:function(data){
                            console.log(data);
                            if(data['code']==0||data['code']=="0"){
                                layTxt('拒绝成功')
                            }else{
                                layTxt('拒绝失败: '+data.msg)
                            }
                            $(".examineListWrap").empty();
                            pushNum=1;
                            queryVerifyListEvent()
                        },
                        error:function(error,status){
                            console.log('请求出错'+error)
                            errorStatusTime(status);
                        },
                        complete:function(){
                            console.log('请求完成')
                        }
                    });
                }
                ,end:function(){
                    console.log('取消');
                    return false;
                }
            });
        });

    })
};

//列表
var queryVerifyListEvent=function(){
    var err={
        "orgThirdAccount": prjvorgMsg.orgThirdAccount,
        "pageNumber": pushNum,
        "pageSize": 20
    };
    $.ajax({
        type: "POST",
        url:base_url + "queryVerifyList",
        timeout:5000,
        data:JSON.stringify(err),
        dataType: "json",
        contentType:"application/json",
        beforeSend:function(XMLHttpRequest){
            XMLHttpRequest.setRequestHeader("token", $.cookie('token'));
        },
        success:function(data){
            layClose();
            console.log(data);
            if(data['code']==0||data['code']=="0"){
                scrollBool=false;
                if(data.data.records.length>0){

                    var records=data.data.records;
                    var li='';
                    for(var i=0;i<records.length;i++){
                        var orgName=records[i].orgName;
                        var initiateOrgName=records[i].initiateOrgName;
                        var createTime=records[i].createTime;
                        var allianceReason=records[i].allianceReason;
                        var adminName=records[i].adminName;
                        var adminMobile=records[i].adminMobile;
                        var initiateOrgThirdAccount=records[i].initiateOrgThirdAccount;
                        var id=records[i].id;
                        var addressDetail=records[i].addressDetail==''?'javascript:void(0)':records[i].addressDetail;

                        li+='<div class="examineList" data-id="'+id+'">\n' +
                            '            <div class="examineTitle">'+initiateOrgName+'</div>\n' +
                            '            <div class="examineTime"><span>时间: </span><span>'+createTime+'</span></div>\n' +
                            '            <div class="examineContent">结盟原因: '+allianceReason+'</div>\n' +
                            '            <div class="examineAdmin"><strong>管理员姓名:</strong><span>'+adminName+'</span></div>\n' +
                            '            <div class="examineAdmin"><strong>管理员电话:</strong><span>'+adminMobile+'</span></div>\n' +
                            '            <div class="examineButton">\n' +
                            '                <button class="b"><a href="../huangye/mobileDetail.html?orgThirdAccount='+records[i].initiateOrgThirdAccount+'">查看机构详情</a></button>\n' +
                            '                <button class="o"><a href="tel:'+adminMobile+'">联系</a></button>\n' +
                            '                <button class="adoptBut g">通过</button>\n' +
                            '                <button class="refuseBut r">拒绝</button>\n' +
                            '            </div>\n' +
                            '        </div>'
                    }
                    $(".examineListWrap").append(li);
                    examineListEvent();
                }else{
                    $("html,body").unbind('scroll');
                    pushNum-=1;
                    scrollBool=true;
                    $(".searchTxt").show();
                }
            }else{
                scrollBool=true
            }
        },
        error:function(error,status){
            console.log('请求出错'+error);
            errorStatusTime(status);
            layClose();
            scrollBool=true
        },
        complete:function(){
            console.log('请求完成');
            layClose();
        }
    });
};
$(function(){
    //loading
    layLoadAll();
    setTimeout(function(){
        queryVerifyListEvent();
    },500);
    //滚动事件
    var t=0;
    var p=0;
    $("html,body").scroll(function(e){
        t=$(this).scrollTop();
        var doc=$(document).height();
        var win=$(window).height();
        if(t>30){
            $(".sous").addClass("on");
        }else{
            $(".sous").removeClass("on");
        }
        if(p<=t){//console.log("向下");
            if(t>doc-(win+60)){
                // layLoadAll();
                if(this.scrollHeight - this.clientHeight == this.scrollTop){
                    //添加数据
                    if(!scrollBool){
                        pushNum+=1;
                        console.log(pushNum)
                        queryVerifyListEvent()
                    }
                }
            }else{
                layClose()
            }

        }else{//console.log("向上")
        }
        setTimeout(function(){p=t},0)
    });
});
