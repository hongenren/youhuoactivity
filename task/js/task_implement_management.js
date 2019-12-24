var submitGradeEvent=function(obj){
    var timSub=$(obj).parents('.tme_sub_wrap');

    var arr={
        "adminComment":timSub.find('textarea[name="cont"]').val(),
        "adminCommentScore":timSub.find(".starsCheckBtns").find('i.on').length,
        "submitIdList":[parseInt(timSub.find('.tem_enroll_radios').attr('data-id'))],
        "times":parseInt($("input[name='total']").val())
    };
    var imgs='';
    if(timSub.find('.warp_pws_m_sy').not('.smallerStop').length>0){
        timSub.find('.warp_pws_m_sy').not('.smallerStop').each(function(){
            var img=$(this).css('background-image').replace(/url\(([^\)]+)\).*/gi,'$1');
            imgs+=img+';'
        });
        arr.adminCommentImg=imgs.substring(0,imgs.length-1)
    }
    console.log(arr)

    if(arr.adminComment==''){
        layer.open({
            content: '内容不能为空'
            ,skin: 'msg'
            ,time: 1
        });
        return false
    }
    if(arr.times==0){
        layer.open({
            content: '时长不能小于0'
            ,skin: 'msg'
            ,time: 1
        });
        return false
    }
    layer.open({
        title:'提示',
        content: '确认提交？'
        ,btn: ['确定', '取消']
        ,yes: function(index){
            layer.closeAll();

            $.ajax({
                xhrFields: {
                    withCredentials: true
                },
                type: 'post',
                url: base_url + "html5/v1/newTask/submitGrade",
                data: JSON.stringify(arr),
                dataType: 'json',
                headers: {'token': token},
                contentType: "application/json;charset=utf-8",
                success: function (data) {
                    if (data.code == 0) {
                        layer.open({
                            content: "提交成功"
                            ,skin: 'msg'
                            ,time: 1
                        });
                        submitListBySubCode(0)
                    }else{
                        layer.open({
                            content: data.msg
                            ,skin: 'msg'
                            ,time: 1
                        });
                    }
                },
                error:function(e){
                    layer.open({
                        content: '提交失败'
                        ,skin: 'msg'
                        ,time: 1
                    });
                }
            })
        }
    });

};

var initEvent=function(){
    var isAll=false;
    var isCheck=false;
    $(".tem_enroll_radios").unbind('click').click(function(){
        $(this).toggleClass('on')
    });
    $(".timEditorBtn").unbind('click').click(function(){
        if(!isAll){
            $(".tme_sub_wrap").addClass('on');
            $(".timEditorAll").addClass('on');
            isAll=true
        }else {
            $(".tme_sub_wrap").removeClass('on');
            $(".timEditorAll").removeClass('on');
            isAll=false
        }
        $(".tem_enroll_radios").removeClass('on')
    });
    $(".timEditorAll").unbind('click').click(function(){
        if(isAll){
            if(!isCheck){
                $(".tem_enroll_radios").addClass('on');
                $(".batchExamineBtn").addClass('on');
                $(".timEditorAll").text('全不选');
                isCheck=true
            }else {
                $(".tem_enroll_radios").removeClass('on');
                $(".batchExamineBtn").removeClass('on');
                $(".timEditorAll").text('全选');
                isCheck=false
            }

        }
    });
    $(".batchExamineBtn").unbind('click').click(function(){

        if($(".tme_sub_boxA .tem_enroll_radios.on").length>0){
            var serviceTime1=$(".tme_sub_boxA .tem_enroll_radios.on").eq(0).parents('.tme_sub_wrap').find('input[name="total"]').attr('data-maxlength');
            $("input[name='totalGrade']").attr('data-maxlength',parseInt(serviceTime1));
            $(".batchExamine_wrap").show();
            $('.spinnerExample1').spinner({});
            $(".batchExamine_submitBtn").click(function(){
                var arr={
                    "adminComment":$("textarea[name='contList']").val(),
                    "adminCommentScore":$(".checkScore").find('span').find('i.on').length,
                    "submitIdList":'',
                    "times":$("input[name='totalGrade']").val()
                };
                var list=[];
                $(".tme_sub_boxA .tem_enroll_radios.on").each(function(){
                    var tickets=$(this).attr('data-id');
                    list.push(tickets)
                });
                arr.submitIdList=list;
                console.log(arr);

                if(arr.adminComment==''){
                    layer.open({
                        content: '内容不能为空'
                        ,skin: 'msg'
                        ,time: 1
                    });
                    return false
                }
                // if(arr.times==0){
                //     layer.open({
                //         content: '时长不能小于0'
                //         ,skin: 'msg'
                //         ,time: 1
                //     });
                //     return false
                // }
                layer.open({
                    title:'提示',
                    content: '确定提交？'
                    ,btn: ['确定', '取消']
                    ,yes: function(index){
                        layer.closeAll();
                        $.ajax({
                            xhrFields: {
                                withCredentials: true
                            },
                            type: "post",
                            url: base_url + "html5/v1/newTask/submitGrade",
                            data: JSON.stringify(arr),
                            dataType: 'json',
                            headers: {'token': token},
                            contentType: "application/json;charset=utf-8",
                            success: function (data) {
                                if (data.code == 0) {
                                    layer.open({
                                        content: "批量审核成功"
                                        ,skin: 'msg'
                                        ,time: 1
                                    });
                                    submitListBySubCode(0)
                                }else{
                                    layer.open({
                                        content: data.msg
                                        ,skin: 'msg'
                                        ,time: 1
                                    });
                                }
                            },
                            error:function(e){
                                layer.open({
                                    content: '提交失败'
                                    ,skin: 'msg'
                                    ,time: 1
                                });
                            }
                        })
                    }
                });

            });

        }else {
            layer.open({
                content: '请选择需要审核的任务'
                ,skin: 'msg'
                ,time: 1
            });
        }

    });
    $(".batchExamine_closeBtn").click(function(){
        $(".batchExamine_wrap").hide();
    })
};

var dataJson = {};
function submitListBySubCode(pageNumber,state){
    $(".tme_sub_boxA").empty();
    $('#tme_sub_boxA').dropload({
        scrollArea: window,
        loadDownFn: function (me) {
            $(".dropload-down").remove();
            pageNumber++;
            if ($("#searchValue").val()!=='') {
                dataJson.searchValue = $("#searchValue").val();
            }else{
                dataJson.searchValue=''
            }
            dataJson.state = state||15;
            dataJson.pageNumber = pageNumber;
            dataJson.pageSize = 20;

            if(dataJson.state==20){
                $(".tem_enroll_editors").hide();
            }
            $.ajax({
                xhrFields: {
                    withCredentials: true
                },
                type: 'post',
                url: base_url + "html5/v1/newTask/submitListBySubCode",
                data: JSON.stringify(dataJson),
                dataType: 'json',
                headers: {'token': token},
                contentType: "application/json;charset=utf-8",
                success: function (data) {
                    if (data.code == 0) {
                        var data_index = data.data.records;
                        var html = "";
                        if(data_index.length>0) {
                            $.each(data_index, function (k, val) {

                                var subCode=val.subCode;
                                var ticket=val.ticket;
                                var id=val.id;
                                var nickName=val.nickName;
                                var headImg=val.headImg;
                                var createTime=val.createTime;
                                var serviceTime=timeTransformToHour(val.serviceTime);
                                var content=val.content;
                                var adminCommentScore=val.adminCommentScore;
                                var adminCommentImg=val.adminCommentImg;
                                var adminComment=val.adminComment;
                                var checkScore=0;
                                var img=val.img;
                                var times=val.times;
                                if(headImg==''){
                                    headImg='../wap/img/bp_1.jpg'
                                }
                                var span='<span>';
                                if(adminCommentScore>0){
                                    var index=parseInt(adminCommentScore);
                                    for(var i=0; i<index;i++){
                                        span+='<i class="on"></i>'
                                    }
                                    if(index<5){
                                        for(var i=0; i<(5-index);i++){
                                            span+='<i></i>'
                                        }
                                    }
                                }else {
                                    for(var i=0; i<5;i++){
                                        span+='<i></i>'
                                    }
                                }
                                span+="</span>";


                                var temImg='';
                                if(img!==''){
                                    imgs=img.split(';');
                                    for(var j=0;j<imgs.length;j++){
                                        if(imgs[j]!==''){
                                            temImg+=' <div class="temImg" style="background-image:url(\''+(imgs[j].replace(/\"/g,""))+'\')"></div>'
                                        }

                                    }
                                }
                                var imgWrap='';
                                var adminImg='';
                                if(adminCommentImg!==''){
                                    var adminImgs=adminCommentImg.split(';');
                                    for(var z=0;z<adminImgs.length;z++){
                                        if(adminImgs[z]!==''){
                                            adminImg+='<div class="warp_pws_m_sy" style="background-image:url(\''+(adminImgs[z].replace(/\"/g,""))+'\')">\n' +
                                                // '                <i onclick="deleteIImg(this)"></i>\n' +
                                                '            </div>'
                                        }

                                    }
                                }

                                var submitGradeArr={
                                    "id":id,
                                    "adminComment":content,
                                    "adminCommentImg":img,
                                    "adminCommentScore":adminCommentScore,
                                    "times":times
                                };

                                var submitGradeEventBtns='<div class="tme_sub_btn"><button onclick="submitGradeEvent(this)">确认提交</button></div>\n';
                                var contxt='<textarea name="cont" onkeyup="this.value=this.value.substring(0,130)" placeholder="请给志愿者留下您宝贵的建议(130汉字以内)"></textarea>\n';
                                var pointSpinner='<input id="point" type="text" name="total" value="'+serviceTime+'" data-time="'+serviceTime+'" data-maxlength="'+parseInt(serviceTime)+'" class="spinnerExample spinnerExample'+k+'"/>\n';
                                if(dataJson.state==20){
                                    submitGradeEventBtns='';
                                    checkScore=val.checkScore;
                                    imgWrap=adminImg;
                                    contxt='<p style="line-height:.4rem;">'+adminComment+'</p>\n'
                                    pointSpinner='<p style="height:.3rem;line-height:.3rem;float:right;">'+times+'</p>'
                                }else {
                                    imgWrap=
                                        '                <div class="warp_pws_m_sy smallerStop">\n' +
                                        '                    <div class="warp_pws_m_sq">\n' +
                                        '                       <form class="test_form" action="" method="post" enctype="multipart/form-data">'+
                                        '                           <img src="../wap/img/pws_96.jpg" id="img0" width="100" height="100">\n' +
                                        '                           <input type="file" onchange="uploadImg(this,'+k+')" name="gg">\n' +
                                        '                           <input type="hidden" id="imgsrc0" value=\'\' name="imgsrc">\n' +
                                        '                       </form>'+
                                        '                    </div>\n' +
                                        '                    <!--<i onclick="deleteIImg(this)"></i>-->\n' +
                                        '                </div>\n'
                                }
                                var span2='<span class="starsCheckBtns">';

                                console.log(checkScore);
                                if(checkScore>0){
                                    var index2=parseInt(checkScore);
                                    for(var i=0; i<index2;i++){
                                        span2+='<i class="on"></i>'
                                    }
                                    if(index2<5){
                                        for(var i=0; i<(5-index2);i++){
                                            span2+='<i></i>'
                                        }
                                    }
                                }else {
                                    for(var i=0; i<5;i++){
                                        span2+='<i></i>'
                                    }
                                }
                                span2+="</span>";

                                html+='<div class="tme_sub_wrap">\n' +
                                    '            <div class="tem_enroll_radios" data-id="'+val.id+'"></div>\n' +
                                    '            <div class="tmeSubUser clearfix">\n' +
                                    '                <div class="tme_sub_user" style="background-image:url(\''+headImg+'\')"></div>\n' +
                                    '                <div class="tme_sub_name tim_sub_name">'+nickName+'<span>个人报名</span></div>\n' +
                                    '            </div>\n' +
                                    '            <div class="tmeSubTimes">\n' +
                                    '                <strong>提交任务时间： </strong>\n' +
                                    '                <span>'+createTime+'</span>\n' +
                                    '            </div>\n' +
                                    '            <div class="tmeSubText">\n' +
                                    content+
                                    '            </div>\n' +
                                    '            <div class="tme_imgs_wrap clearfix" style="padding:.1rem 0;">\n' +
                                    '                <div class="tme_imgs">\n' +
                                    temImg+
                                    '                </div>\n' +
                                    '            </div>\n' +
                                    '            <div class="clearfix">\n' +
                                    '                <div class="tme_evaluate_list">\n' +
                                    '                    <strong>执行联系人给TA的评价</strong>\n' +
                                    span+
                                    '                </div>\n' +
                                    '                <div class="tme_evaluate_list">\n' +
                                    '                    <strong>任务达成度</strong>\n' +
                                    span2+
                                    '                </div>\n' +
                                    '            </div>\n' +
                                    '            <div class="warp_pws_c_sp clearfix">\n' +
                                    '                <b>获得志愿服务时长<span>（小时）</span></b>\n' +
                                    pointSpinner+
                                    '            </div>\n'
                                if(dataJson.state==20){html+='               <h2 class="adminEvaluateTitle">管理员给我的评价：</h2>'}
                                html+=
                                    '            <div class="tmc_textarea tim_textarea" style="padding-top:0;">\n' +
                                    contxt+
                                    '            </div>\n' +
                                    '            <div class="tmc_uploadImgs tim_uploadImgs clearfix">\n' +
                                    imgWrap+
                                    '            </div>\n' +
                                    '\n' +
                                    submitGradeEventBtns+
                                    '        </div>'

                            });
                            $(".tme_sub_boxA").append(html);
                            for(var s=0;s<data_index.length;s++){
                                $('.spinnerExample'+s).spinner({});
                            }
                            initEvent();
                            me.resetload();
                        }else{
                            $(".noneLi").hide();
                            $(".tme_sub_boxA").append(
                                "<div class='noneLi'>\
                                    <a href='javascript:void(0)'>\
                                        <h3 style='text-align: center;line-height:.7rem;'>已经没有更多啦。。。</h3>\
                                    </a>\
                                </div>");
                            me.lock();
                            me.noData();//无数据重置
                            me.resetload();
                        }
                    }else{
                        layer.open({
                            content: resp.msg
                            ,skin: 'msg'
                            ,time: 1
                        });
                        me.lock();
                        me.noData();
                    }
                },
                error:function(e){
                    layer.open({
                        content: '获取失败'
                        ,skin: 'msg'
                        ,time: 1
                    });
                    me.lock();
                    me.noData();//无数据重置
                    me.resetload();
                },
                complete:function(){

                }
            })
        }
    })
}
$(function(){
    var subCode=$.getUrlParam('pkPostCode');
    if(subCode!==''||subCode!=='undefined'){
        dataJson.subCode = subCode;
        submitListBySubCode(0)
    }else {
        layer.open({
            content: 'subCode为空'
            ,skin: 'msg'
            ,time: 1
        });
        setTimeout(function(){
            window.history.back()
        },1000)

    }

    $(".tem_searchBtn").click(function(){
        submitListBySubCode(0)
    })
    // var searchValue=$("#searchValue").val();
    // var pageNumber=1;
    // var pageSize=20;
    // var arr={
    //     "subCode":subCode,
    //     "pageNumber":pageNumber,
    //     "pageSize":pageSize
    // };
    // $.ajax({
    //     xhrFields: {
    //         withCredentials: true
    //     },
    //     type: "post",
    //     url: base_url + "html5/v1/newTask/submitListBySubCode",
    //     data: JSON.stringify(arr),
    //     dataType: 'json',
    //     headers: {'token': token},
    //     contentType: "application/json;charset=utf-8",
    //     success: function (data) {
    //         if (data.code == 0) {
    //             var data1 = data.data;
    //         }
    //     }
    // })
})
