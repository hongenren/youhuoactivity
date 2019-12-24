$(function(){
    $(".warp_cs").click(function(){
        //循环日期
        var endDate   = $("#serviceEndTime").val();
        var startDate = $("#serviceBeginTime").val();
        var startTime = showDate(startDate);
        var endTime   = showDate(endDate);
        //console.log(startDate)
        //console.log(endTime)
        //判断是否选择日期
        if(!startDate){
            layer.open({ content: '请先选择日期!' ,skin: 'msg' ,time: 2 });
            return false;
        }

        //初始化日期循环体
        var old_class_val = $("#carousel").html();
        // console.log(old_class_val)
        if(!old_class_val){
            var iKey = 0;
            var voDate_change = '';
            var voDate = '';
            //循环添加日期
            var chan_times = endTime.getTime()-startTime.getTime();
            var copyInt = 0;
            while(chan_times>=0){
                if(startTime.getTime() < 0){
                    chan_times = -1;
                    startTime  = showDate(endDate);
                }
                //console.log(startTime)
                var m_class = '';
                var m_class_change = '';
                iKey++;
                var year  = startTime.getFullYear();
                var month = (startTime.getMonth()+1).toString().length==1?"0"+(startTime.getMonth()+1).toString():(startTime.getMonth()+1);
                var day   = startTime.getDate().toString().length==1?"0"+startTime.getDate():startTime.getDate();
                if(iKey == 1){ var m_class = "thisclass" }
                voDate += '<div class="swiper-slide '+m_class+'">\
			                        <a href="javascript:;">\
										<span>'+month+"-"+day+'</span>\
									</a>\
			                  </div>';
                chan_times = endTime.getTime() - startTime.setDate(startTime.getDate()+1);
                if(iKey != 1){ var m_class_change = "style='display:none'" }
                voDate_change += '<li class="warp_pws_n_so" '+m_class_change+'>\
							            <div class="warp_pws_n_si">\
							                <div class="warp_pws_n_su">\
							                    <span>'+month+'月'+day+'日场次设置</span><br />\
							                </div>\
							                <menu class="warp_pws_n_sy" style="padding-top:0px;">\
							                    <a href="javascript:void(0)" id="singleSession" class="thisclass">单天单场次</a>\
							                </menu>\
							            </div>\
							            <ul class="warp_pws_n_st">\
							                <li>\
							                    <div class="warp_pws_n_st_bj"></div>\
							            		<input type="hidden" value="10" name="type[]">\
							            		<input type="hidden" value="'+year+'-'+month+'-'+day+'" name="day[]">\
							                    <div class="warp_pws_n_sr">\
							                        <div class="warp_pws_n_se">\
					                                    <input type="text" class="demo_time" id="'+month+day+'start" name="startTime[]" placeholder="00:00"/>\
					                                </div>\
							                        <h2><i>*</i>开始时间</h2>\
							                    </div>\
							                    <div class="warp_pws_n_sr">\
							                        <div class="warp_pws_n_se">\
					                                    <input type="text" class="demo_time" id="'+month+day+'end" name="endTime[]" placeholder="00:00"/>\
					                                </div>\
							                        <h2><i>*</i>结束时间</h2>\
							                    </div>\
							                    <div class="warp_pws_n_st_bj"></div>\
							                </li>\
							                <li style="display: none">\
							                    <div class="warp_pws_n_sk">\
							            		<input type="hidden" value="20" name="type[]" disabled>\
							            		<input type="hidden" value="'+year+'-'+month+'-'+day+'" name="day[]" disabled>\
							                        <div class="warp_pws_n_sj">\
							                            <a href="javascript:void(0)" id="'+month+day+'delete1"></a>\
							                            <span>上午场</span>\
							                        </div>\
							                        <div class="warp_pws_n_sr">\
							                            <div class="warp_pws_n_se">\
						                                    <input type="text" class="demo_time" id="'+month+day+'start1" name="startTime[]" placeholder="00:00"/ disabled>\
						                                </div>\
							                            <h2><i>*</i>开始时间</h2>\
							                        </div>\
							                        <div class="warp_pws_n_sr">\
							                            <div class="warp_pws_n_se">\
						                                    <input type="text" class="demo_time" id="'+month+day+'end1" name="endTime[]" placeholder="00:00"/ disabled>\
						                                </div>\
							                            <h2><i>*</i>结束</h2>\
							                        </div>\
							                        <div class="warp_pws_n_sh">\
							                            <a href="javascript:void(0)">恢复</a>\
							                        </div>\
							                    </div>\
							                    <div class="warp_pws_n_sk">\
							            			<input type="hidden" value="30" name="type[]" disabled>\
							            			<input type="hidden" value="'+year+'-'+month+'-'+day+'" name="day[]" disabled>\
							                        <div class="warp_pws_n_sj">\
							                            <a href="javascript:void(0)" id="'+month+day+'delete2"></a>\
							                            <span>下午场</span>\
							                        </div>\
							                        <div class="warp_pws_n_sr">\
							                            <div class="warp_pws_n_se">\
						                                    <input type="text" class="demo_time" id="'+month+day+'start2" name="startTime[]" placeholder="00:00" disabled/>\
						                                </div>\
							                            <h2><i>*</i>开始时间</h2>\
							                        </div>\
							                        <div class="warp_pws_n_sr">\
							                            <div class="warp_pws_n_se">\
						                                    <input type="text" class="demo_time" id="'+month+day+'end2" name="endTime[]" placeholder="00:00" disabled/>\
						                                </div>\
							                            <h2><i>*</i>结束</h2>\
							                        </div>\
							                        <div class="warp_pws_n_sh">\
							                            <a href="javascript:void(0)">恢复</a>\
							                        </div>\
							                    </div>\
							                    <div class="warp_pws_n_sk">\
							            			<input type="hidden" value="40" name="type[]" disabled>\
							            			<input type="hidden" value="'+year+'-'+month+'-'+day+'" name="day[]" disabled>\
							                        <div class="warp_pws_n_sj">\
							                            <a href="javascript:void(0)" id="'+month+day+'delete3"></a>\
							                            <span>晚上场</span>\
							                        </div>\
							                        <div class="warp_pws_n_sr">\
							                            <div class="warp_pws_n_se">\
						                                    <input type="text" class="demo_time" id="'+month+day+'start3" name="startTime[]" placeholder="00:00" disabled/>\
						                                </div>\
							                            <h2><i>*</i>开始时间</h2>\
							                        </div>\
							                        <div class="warp_pws_n_sr">\
							                            <div class="warp_pws_n_se">\
						                                    <input type="text" class="demo_time" id="'+month+day+'end3" name="endTime[]" placeholder="00:00" disabled/>\
						                                </div>\
							                            <h2><i>*</i>结束</h2>\
							                        </div>\
							                        <div class="warp_pws_n_sh">\
							                            <a href="javascript:void(0)">恢复</a>\
							                        </div>\
							                    </div>\
							                </li>\
							            </ul>\
							        </li>';
                copyInt++;
            }
            $("#carousel").html('');
            $("#carousel_change").html('');
            $("#carousel").append(voDate);
            // $("#carousel_change").empty();
            $("#carousel_change").append(voDate_change)
            if(copyInt<2){
                $(".warp_pws_n_sy1").html("");
            }
        }
        var theme = "ios";
        var mode = "scroller";
        var display = "bottom";
        var lang="zh";
        $('.demo_time').mobiscroll().time({ theme: theme, mode: mode,  display: display, lang: lang });
        var swiper = new Swiper('.swiper-container', {
            slidesPerView: 4,
            spaceBetween: 5,
            slidesPerGroup: 4,
            loop: false,
            loopFillGroupWithBlank: false,
            pagination: {
                el: '.swiper-pagination',
                clickable: true
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev'
            }
        });
        $(function(){
            var cotrs = $(".swiper-slide");
            cotrs.click(function(){
                $(this).addClass("thisclass").siblings().removeClass("thisclass");
            });
        });
        $(document).ready(function(){
            $('.swiper-slide').live('click',function(){
                $('.warp_pws_n_so').hide();
                $('.warp_pws_n_so').eq($(this).index()).show()
            });
        });
        if(window.innerWidth>640){
            $(".warp_cc_p").animate({left:"50%",marginLeft:'-320px'})
            $(".warp_cp").animate({left:"50%",marginLeft:'-320px'})
        }else{
            $(".warp_cc_p").animate({left:"0"})
            $(".warp_cp").animate({left:"0"})
        }
        // $(".warp_cc_p").animate({left:"0"})
        // $(".warp_cp").animate({left:"0"})
        $( '#carousel' ).elastislide();
    })

    $(".warp_dd").click(function(){
        if(window.innerWidth>640){
            $(".warp_ci").animate({left:"50%",marginLeft:'-320px'})
        }else{
            $(".warp_ci").animate({left:"0"})
        }

    })
    $(".warp_pws_v_si").click(function(){
        $(".warp_ci").animate({left:"200%"})
    })
    //单场次多场次
    $(function(){
        var cotrs = $(".warp_pws_n_sy a");
        cotrs.live('click',function(){
            $(this).addClass("thisclass").siblings().removeClass("thisclass");
            $(this).parents(".warp_pws_n_si").next("ul").find("li").hide();
            $(this).parents(".warp_pws_n_si").next("ul").find("li").eq($(this).index()).show()
            var index = $(this).index();
            var num = index==1?2:1; //判断index选取值改变单双场次
            st = $(this).parent().parent().next('.warp_pws_n_st');
            st.find('li').hide()
            st.find('input').attr("disabled",true);//不让提交
            var a = st.find('.t_type').val(num);
            st.find('li').eq($(this).index()).show();
            st.find('li').eq($(this).index()).find('input').attr("disabled",false);//让提交
        });
    });
    //删除恢复
    $(function(){
        $(".warp_pws_n_st li .warp_pws_n_sj a").live('click',function(){
            var len = 0;
            var len = $('.warp_pws_n_st li').find('.cla').length
            if(len==2){
                layer.open({ content: '场次最少保留一个!' ,skin: 'msg' ,time: 2 });
                return false;
            }
            $(this).parents('.warp_pws_n_sk').find('input').attr("disabled",true);
            $(this).parent().siblings().last('div').addClass('cla');
            $(this).parent().siblings().last('div').find('input').val(2)
        });
        $(".warp_pws_n_sh").live('click',function(){
            $(this).parents('.warp_pws_n_sk').find('input').attr("disabled",false);
            $(this).find('input').val(1)
            $(this).removeClass('cla');
        });
    })
    //时间
    var theme = "ios";
    var mode = "scroller";
    var display = "bottom";
    var lang="zh";
    $('.demo_time').live('click',function(){
        $('.demo_time').mobiscroll().time({ theme: theme, mode: mode,  display: display, lang: lang });
    })

    //设置完成
    $("#setClassBtn").live('click',function(){
        var classformVal = $('#classform').serializeJSON();//JSON.stringify($('#classform').serializeJSON())
        var result = [];
        var setStatus = 1;//js 中断标记 如果反回 0 中断js
        $.each(classformVal.day,function(key,val){
            if(!classformVal.startTime[key] || !classformVal.endTime[key]){
                layer.open({ content: val+'未设置完成!' ,skin: 'msg' ,time: 2 });
                setStatus = 0;
                return false;
            }
            var datetime = getFormatDate();
            var endtime = val+' '+classformVal.startTime[key];
            // console.log(datetime);
            // console.log(endtime);
            // console.log()
            if(compareTime(datetime,endtime)){
                layer.open({ content: val+'开始时间必须早于当前时间!' ,skin: 'msg' ,time: 2 });
                setStatus = 0;
                return false;
            }
            if(classformVal.startTime[key] >= classformVal.endTime[key]){
                layer.open({ content: val+'结束时间必须晚于开始时间!' ,skin: 'msg' ,time: 2 });
                setStatus = 0;
                return false;
            }
            result[key] = JSON.stringify({ "day": val, "endTime": classformVal.endTime[key], "startTime": classformVal.startTime[key], "type": classformVal.type[key] });
        })
        if(setStatus == 0){ return false; }//js 中断标记 如果反回 0 中断js
        classVal = $("#classVal").val(result);
        // console.log(JSON.stringify(classformVal))
        // localStorage.setItem('saveVal',JSON.stringify(classVal));
        isSetClassVal();

        $(".warp_cp").animate({left:"100%"})
        $(".warp_cc_p").animate({left:"100%"})
    })

})
function copySession(id_){
    if($("#singleSession").is('.thisclass')){
        var startTime = $("#"+id_+"start").val();
        var endTime = $("#"+id_+"end").val();
        $("input[name='startTime[]']").each(function () {
            if(($(this).attr("id")).endWith("start")){
                $(this).val(startTime);
            }
        });
        $("input[name='endTime[]']").each(function () {
            if(($(this).attr("id")).endWith("end")) {
                $(this).val(endTime);
            }
        });
    }

    if($("#moreSession").is('.thisclass')){
        var startTime1 = $("#"+id_+"start1").val();
        var endTime1 = $("#"+id_+"end1").val();
        var startTime2 = $("#"+id_+"start2").val();
        var endTime2 = $("#"+id_+"end2").val();
        var startTime3 = $("#"+id_+"start3").val();
        var endTime3 = $("#"+id_+"end3").val();
        $("input[name='startTime[]']").each(function () {
            if($(this).attr("id").endWith("start1")){
                $(this).val(startTime1);
                copyDelete(id_+"delete1", this);
            }
            if($(this).attr("id").endWith("start2")){
                $(this).val(startTime2);
                copyDelete(id_+"delete2", this);
            }
            if($(this).attr("id").endWith("start3")){
                $(this).val(startTime3);
                copyDelete(id_+"delete3", this);
            }
        });
        $("input[name='endTime[]']").each(function () {
            if($(this).attr("id").endWith("end1")) {
                $(this).val(endTime1);
            }
            if($(this).attr("id").endWith("end2")) {
                $(this).val(endTime2);
            }
            if($(this).attr("id").endWith("end3")) {
                $(this).val(endTime3);
            }
        });
    }
    layer.open({ content: '复制成功！' ,skin: 'msg' ,time: 2 });
}

function copyDelete(id, obj){
    if($("#"+id).parent().siblings().last('div').is('.cla')){
        $(obj).parent().parent().prev().children("a")       .parents('.warp_pws_n_sk').find('input').attr("disabled",true);
        $(obj).parent().parent().prev().children("a")       .parent().siblings().last('div').addClass('cla');
        $(obj).parent().parent().prev().children("a")       .parent().siblings().last('div').find('input').val(2);
    }else{
        $(obj).parent().parent().prev().children("a")       .parents('.warp_pws_n_sk').find('input').attr("disabled",false);
        $(obj).parent().parent().prev().children("a")       .parent().siblings().last('div').removeClass('cla');
        $(obj).parent().parent().prev().children("a")       .parent().siblings().last('div').find('input').val(1);
    }
}
