//获取机构详细信息
function get_org_msg() {
	var starHtml = '';
	var starNum = 5; //星级分数为5
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
                console.log(data);
                if(data.code==0){
                layer.closeAll();
                	var data1 = data.data;
                	//$("#creditCodeImgs").attr('src',data1.creditCodeImgs);// 封面图
                	$("#orgname").text(data1.name);// 机构名称
                	//星级
                	for(i=0;i<data1.star;i++){
                		starHtml += '<span>\
						                <img src="../wap/huangye/images/star1.png">\
						            </span>';
                	}
                	var star = starNum-data1.star;
                	for (i1 = 0; i1 < star; i1++) {
               			starHtml += '<span></span>';
                	};
                	$("#star").html(starHtml);
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
