var divideButtonEvent=function(){
    //解除结盟
    $(".divideButton").unbind('click').click(function(){
        var ids=$(this).parents('.divideList').attr('data-id');
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
                ,content: '<div style="padding:30px;text-align:center;line-height: 22px; background-color: #393D49; color: #fff; font-weight: 300;">确定解除结盟？</div>'
                ,success: function(layero){
                    console.log(layero);
                }
                ,yes:function(){
                    console.log('确定');
                    var err={
                        "orgThirdAccount": prjvorgMsg.orgThirdAccount,
                        "id": ids
                    };
                    $.ajax({
                        type: "POST",
                        url:base_url + "disband",
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
                                layTxt('解除结盟成功');
                                $(".divideListWrap").empty();
                                pushNum=1;
                                queryAllianceList()
                            }else{
                                layTxt(data.msg)
                            }

                        },
                        error:function(error,status){
                            console.log('请求出错'+error);
                            errorStatusTime(status);
                        },
                        complete:function(){
                            console.log('请求完成')
                        }
                    });
                    layClose()
                }
                ,end:function(){
                    console.log('取消');
                    return false;
                }
            });
        });

    });

};
//列表
var queryAllianceList=function(txt){
    // $(".divideListWrap").empty();
    var err={
        "orgThirdAccount": prjvorgMsg.orgThirdAccount,
        "pageNumber": pushNum,
        "searchName":txt||'',
        "pageSize": 20
    };
    $.ajax({
        type: "POST",
        url:base_url + "queryAllianceList",
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
                    layClose();
                    var records=data.data.records;
                    var li='';
                    for(var i=0;i<records.length;i++){
                        var orgName=records[i].orgName;
                        var baseNo=records[i].baseNo==''?'':'<span>'+records[i].baseNo+'号公益基地</span>';
                        var addressDetail=records[i].addressDetail;
                        var icons='';
                        if(addressDetail!==''){
                            icons=                            '                <i></i>\n' +
                                '                <span>'+addressDetail+'</span>\n'
                        }
                        var id=records[i].id;
                        var orgThirdAccount=records[i].orgThirdAccount;

                        li+='<div class="divideList" data-id="'+id+'">\n' +
                            '<div style="padding-bottom:3%;" onclick="jump(\'../huangye/mobileDetail.html?orgThirdAccount='+orgThirdAccount+'\')">' +
                            '            <h2>'+orgName+'</h2>\n' +
                            '            <div class="divideType">'+baseNo+'</div>\n' +
                            '            <div class="divideMap">\n' +
                            icons+
                            '            </div></div>\n' +
                            '            <div class="divideButton" style="padding-top: 0px;"><button>解除结盟关系</button></div>\n' +
                            '        </div>'
                    }
                    $(".divideListWrap").append(li)
                    divideButtonEvent();
                }else{
                    $("html,body").unbind('scroll');
                    pushNum-=1;
                    scrollBool=true;
                    $(".searchTxt").show()
                }

            }else{
                scrollBool=true;
                layTxt(data.msg);
                layClose();
            }
        },
        error:function(error,status){
            console.log('请求出错'+error);
            errorStatusTime(status);
            scrollBool=true;
        },
        complete:function(){
            console.log('请求完成');
            layClose()
        }
    });
};
$(function(){
    //loading
    layLoadAll();
    setTimeout(function(){
        queryAllianceList();
    },500);

    //搜索
    $(".searchBut").click(function(){
        var serachTxt=$("input[name='search']").val();
        $(".divideListWrap").empty();
        pushNum=1;
        if(serachTxt.length>0){
            console.log(serachTxt);
            queryAllianceList(serachTxt);
        }else{
            queryAllianceList();
        }
    });
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
                        queryAllianceList()
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
