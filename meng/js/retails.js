var detailEvent=function(){
    var indexID=queryString('id');
    if(!indexID){
        window.location.href='record.html'
    }
    var err={
        "orgThirdAccount": prjvorgMsg.orgThirdAccount,
        "id":indexID
    };
    $.ajax({
        type: "POST",
        url:base_url + "detail",
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
                if(data.data.status!==''){
                    var datas=data.data;
                    var status=datas.status;
                    var initiateOrgThirdAccount=datas.initiateOrgThirdAccount;//发起方机构账号
                    var allianceReason=datas.allianceReason;//结盟原因
                    var createTime=datas.createTime;//申请时间
                    var receiveOrgThirdAccount=datas.receiveOrgThirdAccount;//接收方机构账号
                    var rejectReason=datas.rejectReason;//拒绝原因
                    var verifyTime=datas.verifyTime;//审核时间
                    var disbandOrgThirdAccount=datas.disbandOrgThirdAccount;//解盟发起方
                    var disbandTime=datas.disbandTime;//解盟时间
                    var initiateStr=datas.initiateStr;//发起描述
                    var verifyStr=datas.verifyStr;//审核描述
                    var disbandStr=datas.disbandStr;//解盟描述

                    var orgName=datas.orgName;
                    var adminName=datas.adminName;
                    var adminMobile=datas.adminMobile;
                    $(".examineTitle").text(orgName);
                    $(".adminName").text(adminName);
                    $(".adminMobile").text(adminMobile);

                    var initiateStrTime=initiateStr.substring(0,parseInt(initiateStr.indexOf(':'))+3);
                    var initiateStrTxt=initiateStr.substring(parseInt(initiateStr.indexOf(':'))+3,parseInt(initiateStr.length));

                    var statusTxt='';
                    var statusClass='';
                    var li='<div class="retailTimeList">\n' +
                        '            <div class="retailTime"><span>'+initiateStrTime+'</span><strong>'+initiateStrTxt+'</strong></div>\n' +
                        '            <div class="retailTimeCont">原因: '+allianceReason+'</div>\n' +
                        '            <div class="retailTimeIcon"></div>\n' +
                        '        </div>';
                    switch(status) {
                        case 10:
                            statusTxt='待审核';
                            statusClass='o';
                            li+='<div class="retailTimeList">\n' +
                                '            <div class="retailTime on"><span>'+verifyTime+'</span><strong class="'+statusClass+'">'+statusTxt+'</strong></div>\n' +
                                '            <div class="retailTimeIcon"></div>'+
                                '        </div>';
                            if(initiateOrgThirdAccount==prjvorgMsg.orgThirdAccount){
                                $(".saveButton").text('撤销邀请').show().click(function(){
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
                                            ,content: '<div style="padding:30px;text-align:center;line-height: 22px; background-color: #393D49; color: #fff; font-weight: 300;">确定撤销邀请？</div>'
                                            ,success: function(layero){
                                                console.log(layero);
                                            }
                                            ,yes:function(){
                                                console.log('确定');
                                                $.ajax({
                                                    type: "POST",
                                                    url:base_url + "cancel",
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
                                                            layTxt('撤销邀请成功');
                                                            detailEvent();
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
                                            }
                                            ,end:function(){
                                                console.log('取消');
                                                return false;
                                            }
                                        });
                                    });

                                });
                            }
                            break;
                        case -10:
                            statusTxt='已拒绝';
                            statusClass='r';
                            li+='<div class="retailTimeList">\n' +
                                '            <div class="retailTime on"><span>'+verifyTime+'</span><strong class="'+statusClass+'">'+statusTxt+'</strong></div>' +
                                '            <div class="retailTimeCont">原因: '+rejectReason+'</div>'+
                                '            <div class="retailTimeIcon"></div>'+
                                '        </div>';
                            if(initiateOrgThirdAccount==prjvorgMsg.orgThirdAccount){
                                $(".saveButton").text('再次发起邀请').show().click(function(){
                                    setCookie('receiveOrgThirdAccount',receiveOrgThirdAccount);
                                    setCookie('orgName',$(".examineTitle").text());
                                    window.location.href='launchExplain.html?type=1'
                                });
                            }
                            break;
                        case 20:
                            statusTxt='已结盟';
                            statusClass='g';
                            li+='<div class="retailTimeList">\n' +
                                '            <div class="retailTime on"><span>'+verifyTime+'</span><strong class="'+statusClass+'">'+'建立结盟关系'+'</strong></div>\n' +
                                '            <div class="retailTimeIcon"></div>'+
                                '        </div>';
                            break;
                        case -20:
                            if(disbandOrgThirdAccount==prjvorgMsg.orgThirdAccount){
                                statusTxt='我发起解除结盟关系';
                            }else{
                                statusTxt='对方发起解除结盟关系';
                            }

                            statusClass='i';
                            li+='<div class="retailTimeList">\n' +
                                '            <div class="retailTime on"><span>'+verifyTime+'</span><strong class="'+statusClass+'">'+'建立结盟关系'+'</strong></div>\n' +
                                '            <div class="retailTime on"><span>'+disbandTime+'</span><strong class="'+statusClass+'">'+statusTxt+'</strong></div>\n' +
                                '            <div class="retailTimeIcon"></div>'+
                                '        </div>';
                            break;
                        case -30:
                            statusTxt='已撤销';
                            statusClass='i';
                            li+='<div class="retailTimeList">\n' +
                                '            <div class="retailTime on"><span>'+verifyTime+'</span><strong class="'+statusClass+'">'+statusTxt+'</strong></div>\n' +
                                '            <div class="retailTimeIcon"></div>'+
                                '        </div>';
                            $(".saveButton").text('再次发起邀请').show().click(function(){
                                setCookie('receiveOrgThirdAccount',receiveOrgThirdAccount);
                                setCookie('orgName',$(".examineTitle").text());
                                window.location.href='launchExplain.html?type=1'
                            });
                            break;
                        default:
                            statusTxt='';
                            statusClass='';
                    }
                    $(".retailTimeListWrap").html(li);
                }
            }else{
                layTxt(data.msg);
            }
        },
        error:function(error,status){
            console.log('请求出错'+error);
            errorStatusTime(status);
            layClose()
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
        detailEvent();
    },500);
});
