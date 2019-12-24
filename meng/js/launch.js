var divideButtonEvent=function(){
    $(".divideButton").unbind('click').click(function(){
        $(".divideButton").removeClass('on');
        $(this).addClass('on')
    })
};
$(function(){
    //搜索
    $(".searchBut").click(function(){
        console.log('2');
        var serachTxt=$("input[name='search']").val();
        if(serachTxt.length>0){
            console.log(serachTxt);
        }else{
            return
        }
        layLoadAll();
        var err={
            "orgThirdAccount": prjvorgMsg.orgThirdAccount,
            "searchName": serachTxt
        };
        $.ajax({
            type: "POST",
            url:base_url + "orgList",
            timeout:5000,
            data:JSON.stringify(err),
            dataType: "json",
            contentType:"application/json",
            beforeSend:function(XMLHttpRequest){
                XMLHttpRequest.setRequestHeader("token", $.cookie('token'));
            },
            success:function(data){
                if(data['code']==0||data['code']=='0'){
                    if(data.data.length>0){
                        $(".searchTxt").hide().text('请使用‘搜索’功能，查询到要结盟的机构');
                        var datas=data.data;
                        var li='';
                        for(var i=0;i<datas.length;i++){
                            var orgName=datas[i].orgName;
                            var baseNo=datas[i].baseNo==''?'':'<span>'+datas[i].baseNo+'号公益基地</span>';
                            var addressDetail=datas[i].addressDetail;
                            var adminName=datas[i].adminName;
                            var adminMobile=datas[i].adminMobile;
                            var receiveOrgThirdAccount=datas[i].receiveOrgThirdAccount;
                            var status=datas[i].status;
                            var divideDom='<div class="divideButton"></div>';
                            var cityClass='';
                            if(status==10){
                                divideDom='<div class="divideText o">待审核</div>';
                                cityClass='on'
                            }else if(status==20){
                                divideDom='<div class="divideText g">已结盟</div>';
                                cityClass='on'
                            }

                            var icons='';
                            if(addressDetail!==''){
                                icons='<i></i><span>'+addressDetail+'</span>';
                            }

                            li+='<div class="divideList '+cityClass+'" data-id="'+receiveOrgThirdAccount+'">\n' +
                                '            <h2>'+orgName+'</h2>\n' +
                                '            <div class="divideType">'+baseNo+'</div>\n' +
                                '            <div class="divideMap">\n' +
                                icons+
                                '            </div>\n' +
                                '            <div class="divideAdmin"><strong>管理员姓名:</strong><span>'+adminName+'</span></div>\n' +
                                '            <div class="divideAdmin"><strong>管理员电话:</strong><span>'+adminMobile+'</span></div>\n' +
                                divideDom +
                                '        </div>'
                        }
                        $(".divideListWrap").html(li);
                        divideButtonEvent();
                    }
                    layClose();
                }else{
                    $(".searchTxt").show().text(data['msg']);

                    if(data.data.length>0){
                        var datas=data.data;
                        var li='';
                        for(var i=0;i<datas.length;i++){
                            var orgName=datas[i].orgName;
                            var baseNo=datas[i].baseNo==''?'':'<span>'+datas[i].baseNo+'号公益基地</span>';
                            var addressDetail=datas[i].addressDetail;
                            var adminName=datas[i].adminName;
                            var adminMobile=datas[i].adminMobile;
                            var receiveOrgThirdAccount=datas[i].receiveOrgThirdAccount;

                            var status=datas[i].status;
                            var divideDom='<div class="divideButton"></div>';
                            var cityClass='';
                            if(status==10){
                                divideDom='<div class="divideText o">待审核</div>';
                                cityClass='on'
                            }else if(status==20){
                                divideDom='<div class="divideText g">已结盟</div>';
                                cityClass='on'
                            }

                            var icons='';
                            if(addressDetail!==''){
                                icons='<i></i><span>'+addressDetail+'</span>';
                            }

                            li+='<div class="divideList '+cityClass+'" data-id="'+receiveOrgThirdAccount+'">\n' +
                                '            <h2>'+orgName+'</h2>\n' +
                                '            <div class="divideType">'+baseNo+'</div>\n' +
                                '            <div class="divideMap">\n' +
                                icons +
                                '            </div>\n' +
                                '            <div class="divideAdmin"><strong>管理员姓名:</strong><span>'+adminName+'</span></div>\n' +
                                '            <div class="divideAdmin"><strong>管理员电话:</strong><span>'+adminMobile+'</span></div>\n' +
                                divideDom +
                                '        </div>'
                        }
                        $(".divideListWrap").html(li);
                        divideButtonEvent();
                    }
                    layClose();
                }
            },
            error:function(error,status){
                console.log('请求出错'+error);
                errorStatusTime(status);
                layClose();
            },
            complete:function(){
                console.log('请求完成');
                layClose();
            }
        });
    });

    //下一步
    $(".targetNext").click(function(){
        var receiveOrgThirdAccountID='';
        var receiveOrgThirdAccountNAME='';
        $(".divideList").each(function(){
            if($(this).find('.divideButton').hasClass('on')){
                receiveOrgThirdAccountID=$(this).attr('data-id');
                receiveOrgThirdAccountNAME=$(this).find('h2').text();
            }
        });
        if(receiveOrgThirdAccountID!==''){
            setCookie('receiveOrgThirdAccount',receiveOrgThirdAccountID);
            setCookie('orgName',receiveOrgThirdAccountNAME);
            window.location.href='launchExplain.html'
        }else{
            layTxt('请选择您要结盟的机构');
            return false
        }

    })
});
