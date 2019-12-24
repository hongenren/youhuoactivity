$(function(){
    var receiveOrgThirdAccount=$.cookie('receiveOrgThirdAccount');
    var orgName=$.cookie('orgName');
    if(!receiveOrgThirdAccount){
        window.location.href='launch.html'
    }
    $(".explainCont").text(orgName);

    //邀请结盟
    $(".sendDivide").click(function(){
        var allianceReason=$("textarea[name='content']").val();
        if(allianceReason==''||allianceReason=='请输入您要结盟的原因'){
            layTxt('原因不能为空');
            return false
        }
        var err={
            "initiateOrgThirdAccount": prjvorgMsg.orgThirdAccount,
            "receiveOrgThirdAccount": receiveOrgThirdAccount,
            "allianceReason": allianceReason
        };
        $.ajax({
            type: "POST",
            url:base_url + "apply",
            timeout:5000,
            data:JSON.stringify(err),
            dataType: "json",
            contentType:"application/json",
            beforeSend:function(XMLHttpRequest){
                XMLHttpRequest.setRequestHeader("token", $.cookie('token'));
            },
            success:function(data){
                console.log(data);
                if(data['code']==1||data['code']=="1"){
                    layTxt(data.msg)
                }else if(data['code']==0||data['code']=="0"){
                    layTxt('发起结盟邀请成功');
                    setTimeout(function(){
                        if($.getUrlParam("type")==1){
                            window.location.href=document.referrer;
                        }else{
                            window.location.href='launch.html';
                        }
                    },2000)
                }
            },
            error:function(error,status){
                errorStatusTime(status);
                console.log('请求出错'+error)
            },
            complete:function(){
                console.log('请求完成')
            }
        });
    });

});
