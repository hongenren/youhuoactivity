//列表
var queryRecordListEvent=function(data,type){
    var err={
        "orgThirdAccount": prjvorgMsg.orgThirdAccount,
        "searchName": data||'',
        "type": type||0
    };
    $.ajax({
        type: "POST",
        url:base_url + "queryRecordList",
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
                if(data.data.records.length>0){
                    $(".searchTxt").hide();
                    var records=data.data.records;
                    var prjvorg=prjvorgMsg.orgThirdAccount;
                    var li='';
                    for(var i=0;i<records.length;i++){
                        var initiateOrgThirdAccounta=records[i].initiateOrgThirdAccount;//发起方
                        var receiveOrgThirdAccount=records[i].receiveOrgThirdAccount;//接收方
                        var orgThirdAccount=records[i].orgThirdAccount;
                        var disbandOrgThirdAccount=records[i].disbandOrgThirdAccount;//发起解除方
                        var orgName=records[i].orgName;
                        var id=records[i].id;
                        var recordTime=records[i].recordTime;
                        var status=records[i].status;//（-30撤销，-20解盟，-10拒绝，10审核，20结盟）
                        var statusTxt='';
                        var statusClass='';
                        var prjvorgClass='';
                        var iconPush='<div class="recordIcon"></div>';
                        if(prjvorg!==initiateOrgThirdAccounta){
                            prjvorgClass='doubleLeft'
                        }
                        switch(status) {
                            case 10:
                                statusTxt='待审核';
                                statusClass='o';
                                break;
                            case -10:
                                statusTxt='已拒绝';
                                statusClass='r';
                                break;
                            case 20:
                                statusTxt='已结盟';
                                statusClass='g';
                                break;
                            case -20:
                                statusTxt='解除结盟';
                                statusClass='i';
                                if(prjvorg!==initiateOrgThirdAccounta){//发起方不是自己
                                    if(disbandOrgThirdAccount!==prjvorg){//解除方不是自己
                                        prjvorgClass='double doubleB'
                                    }else{//解除方是自己
                                        prjvorgClass='double doubleD'
                                    }
                                }else{//发起方是自己
                                    if(disbandOrgThirdAccount!==prjvorg){//解除方不是自己
                                        prjvorgClass='double doubleA'
                                    }else{//解除方是自己
                                        prjvorgClass='double doubleC'
                                    }
                                }
                                iconPush='<div class="recordIconA"></div>\n' +
                                    '                    <div class="recordIconB"></div>';
                                break;
                            case -30:
                                statusTxt='已撤销';
                                statusClass='i';
                                break;
                            default:
                                statusTxt='';
                                statusClass='';
                        }

                        li+='<div class="recordList">\n' +
                            '<a href="retails.html?id='+id+'">'+
                            '            <div class="recordTop clearfix">\n' +
                            '                <div class="recordLeft '+prjvorgClass+'">\n' +
                            '                    <div class="recordStart">我</div>\n' +
                            '                    <div class="recordTitle">邀请结盟</div>\n' +
                            '                    <div class="recordMessage '+statusClass+'">'+statusTxt+'</div>\n' +
                            iconPush+
                            '                </div>\n' +
                            '                <div class="recordRight">'+orgName+'</div>\n' +
                            '            </div>\n' +
                            '            <div class="recordTime"><strong>时间:</strong><span>'+recordTime+'</span></div>\n' +
                            '</a>'+
                            '        </div>'
                    }
                    $(".recordListWrap").html(li);
                }else{
                    $(".recordListWrap").empty();
                    $(".searchTxt").show().text('什么也没有！')
                }
            }else{
                $(".searchTxt").show().text(data.msg)
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
        queryRecordListEvent();
    },500);

    //搜索
    $(".searchBut").click(function(){
        var serachTxt=$("input[name='search']").val();
        if(serachTxt.length>0){
            console.log(serachTxt);
            queryRecordListEvent(serachTxt,parseInt($('.selectList.on').attr('data-id')))
        }else{
            queryRecordListEvent('',parseInt($('.selectList.on').attr('data-id')))
        }
    });

    //选择全部、我和对方
    $(".recordSelectBut").click(function(){
        $(".recordSelect").slideDown();
    });
    $(".selectList").click(function(){
        $(".recordSelect").slideUp();
        $(".recordSelectBut span").text($(this).text())
        $(".selectList").removeClass("on");
        $(this).addClass("on");

        var serachTxt=$("input[name='search']").val();
        if(serachTxt.length>0){
            console.log(serachTxt);
            queryRecordListEvent(serachTxt,parseInt($(this).attr('data-id')))
        }else{
            queryRecordListEvent('',parseInt($(this).attr('data-id')))
        }
    })

});
