//获取机构类别
function get_orgTypes(){
    $.ajax({
            xhrFields: {
               withCredentials: true
            },
            type:"post",
            url:base_url + "html5/v1/orgPlace/orgTypes",
            dataType:'json',
            headers : {'token':token},
            contentType: "application/json;charset=utf-8",
            success:function(data){
                if(data.code==0){
                    var data1 = data.data.data;
                    sessionStorage.setItem('orgTypes',JSON.stringify(data1));
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
//获取机构详细信息
function get_org_msg() {
    var org_list = [];
    var imgs = '';
    var orgTypeName = '';
	$.ajax({
            xhrFields: {
               withCredentials: true
            },
            type:"post",
            url:base_url + "html5/v1/orgPlace/queryOrgByPrjvOrgId",
            data:JSON.stringify({"prjvOrgId":prjvorgMsg.prjvOrgId}),
            dataType:'json',
            headers : {'token':token},
            contentType: "application/json;charset=utf-8",
            beforeSend:function(){
            	layer.open({type: 2,content: '加载中'});
            },
            success:function(data){
                //console.log(data);
                if(data.code==0){
                layer.closeAll();
                	var data1 = data.data;
                	if(sessionStorage.getItem('orgTypes')!=''){
                        var orgTypes = JSON.parse(sessionStorage.getItem('orgTypes'));
                        $.each(orgTypes,function(index,val){
                            if(data1.orgType==val.code){
                                orgTypeName += val.name;
                            }
                        })
                        $("#orgType").text(orgTypeName);
                        $("#orgThirdAccountName").text(data1.orgThirdAccountName);
                        $("#orgThirdAccountNameEn").text(data1.orgThirdAccountNameEn);
                        $("#creditCode").text(data1.creditCode);
                        var creditCodeImgs = data1.creditCodeImgs.split(',');
                        for (var i = 0; i < creditCodeImgs.length; i++) {
                            imgs += '<img src="'+creditCodeImgs[i]+'">';         
                        };
                        $("#imgs").after(imgs);
                    }
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
