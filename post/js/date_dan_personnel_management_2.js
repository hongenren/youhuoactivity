'use strict';

// 日期选择插件(自定义)

var date = function ($) {

    $.fn.hotelDate = function (options) {

        var nowdate = new Date(); // 获取当前时间
        var dateArr = new Array(); // 获取到的时间数据集合
        var btn = $(this);

        btn.on('click', initTemplate); // 初始化(显示)插件

        // 初始化模板
        function initTemplate() {
            var entertime = $('.entertime').text();
            var input_enter = $('.input-enter').val();
            var listIndex = 0;
            $('body').css({
              overflow: 'scroll'
            });
            // 主容器模板
            var dateTemplate = '\n        <div class =\'date container c-gray\' style="top:auto;left: auto;position:static;">\n   </div>      \n      ';
            $('.select_div').append(dateTemplate); // 向body添加插件

            // action容器模板
            dateArr.forEach(function (item, index) {
                var template = '\n          <div class=\'action mt10\' id="months_'+(item.getMonth() + 1)+'" style="display: none;">\n            <div class=\'title tac c-blue\'><div class="y">' + item.getFullYear() + '</div>\u5E74<div class="m">' + (item.getMonth() + 1) + '</div>\u6708</div>\n            <ul class=\'week border-bottom\'><li>\u65E5</li><li>\u4E00</li><li>\u4E8C</li><li>\u4E09</li><li>\u56DB</li><li>\u4E94</li><li>\u516D</li></ul>\n            <ul class=\'day f-small\'></ul>\n          </div>        \n        ';
                $('.date').append(template);
            });

            // 天数模板
            $('.action').each(function (index, item) {

                var days = getDays(dateArr[index]); // 当月天数
                var nowweek = dateArr[index].getDay(); // 当月1号是星期几
                for (var i = 0; i < days + nowweek; i++) {
                    var template = '', listDate = dateArr[index].getFullYear() + '-' + (dateArr[index].getMonth() + 1) + '-' + (i - nowweek + 1);
                    // 空白填充
                    if (i < nowweek) {
                        template = '<li class="disable"></li>';
                    }
                    else if (dayListStr.indexOf(listDate+",")!= -1) {
                        listIndex++;
                        template = '<li style="line-height: 20px;margin-top: 5px;margin-bottom: 5px;" index=\'' + listIndex + '\' data-code="'+pkUnitCodeList[listDate]+'"><b>' + (i - nowweek + 1) +'</b><br />'+ auditNumList[listDate] + '人</li>';
                    }
                    else {
                        listIndex++;
                        template = '<li index=\'' + listIndex + '\' class=\'disable\' style="" date-date="' + dateArr[index].getFullYear() + '-' + (dateArr[index].getMonth() + 1) + '-' + (i - nowweek + 1) + '">' + (i - nowweek + 1) + '</li>';
                    }
                    $(item).find('.day').append(template);
                }
            });

            var num = 0;
            // 时间选择
            $('.day li').on('click', function () {
                if (!$(this).hasClass('disable') && !$(this).hasClass('default')) {
                    pkUnitCodeZ = $(this).attr("data-code");
                    getListDay(pkPostCode);
                    //auditList(0, 20);
                    closeData();
                    $('.succeed-list-ul').show();
                    $(".hided").show();
                }
            });
        }

        // 获取num个月的时间数据
        function getDate(num) {

            var year = nowdate.getFullYear();
            var month = nowdate.getMonth() - 1;
            for (var i = 0; i < num; i++) {
                month <= 12 ? month++ : (month = 1, year++);
                var data = new Date(year, month); // 从当前月开始算 一共个6个月的数据
                dateArr.push(data);
            }
        }

        // 获取当月天数
        function getDays(date) {
            //构造当前日期对象
            var date = date;
            //获取年份
            var year = date.getFullYear();
            //获取当前月份
            var mouth = date.getMonth() + 1;
            //定义当月的天数；
            var days;
            //当月份为二月时，根据闰年还是非闰年判断天数
            if (mouth == 2) {
                days = year % 4 == 0 ? 29 : 28;
            } else if (mouth == 1 || mouth == 3 || mouth == 5 || mouth == 7 || mouth == 8 || mouth == 10 || mouth == 12) {
                //月份为：1,3,5,7,8,10,12 时，为大月.则天数为31；
                days = 31;
            } else {
                //其他月份，天数为：30.
                days = 30;
            }
            return days;
        }

        function initDay() {
            var enterYear = String(nowdate.getFullYear());
            enterYear.length === 1 ? enterYear = '0' + enterYear : false;
            var enterMonth = String(nowdate.getMonth() + 1);
            enterMonth.length === 1 ? enterMonth = '0' + enterMonth : false;
            var enterDay = String(nowdate.getDate());
            enterDay.length === 1 ? enterDay = '0' + enterDay : false;
            var enterTime = enterYear + '-' + enterMonth + '-' + enterDay;
            // 获取离开时间
            var leaveYear = String(nowdate.getFullYear());
            leaveYear.length === 1 ? leaveYear = '0' + leaveMonth : false;
            var leaveMonth = String(nowdate.getMonth() + 1);
            leaveMonth.length === 1 ? leaveMonth = '0' + leaveMonth : false;
            var leaveDay = String(nowdate.getDate() + 1);
            leaveDay.length === 1 ? leaveDay = '0' + leaveDay : false;
        }
        function addDate(date, days) {
            if (days == undefined || days == '') {
                days = 1;
            }
            var date = new Date(date);
            date.setDate(date.getDate() + days);
            var month = date.getMonth() + 1;
            var day = date.getDate();
            return date.getFullYear() + '-' + getFormatDate(month) + '-' + getFormatDate(day);
        }
        // 日期月份/天的显示，如果是1位数，则在前面加上'0'
        function getFormatDate(arg) {
            if (arg == undefined || arg == '') {
                return '';
            }

            var re = arg + '';
            if (re.length < 2) {
                re = '0' + re;
            }

            return re;
        }
        getDate(6); // 获取数据 参数: 拿6个月的数据
        initDay(); // 初始化入住和离店时间
    };
}(jQuery);
function openData(){
    if($(".date_li").is(':hidden')){
        $(".date_li").toggle(500);
    }else{
        closeData();
    }
}
function closeData(){
    $("#carousel").empty();
    $("#carousel_change").empty();
    $('.date').remove(); // 移除插件
    $(".select_div").html("");
    $(".warp").show();
}
function getListDay(pkPostCode){
    $(".succeed-list-title").html("");
    var getListDaySize = 0;
    $.ajax({
        xhrFields: {
            withCredentials: true
        },
        type: 'post',
        url: base_url + "/html5/v1/station/postApply/queryDayList",
        data: JSON.stringify({"pkPostCode": pkPostCode}),
        dataType: 'json',
        headers: {'token': token},
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (data.code == 0) {
                var data_index = data.data;
                $.each(data_index, function (k, val) {
                    var date = new Date(val.day);
                    var nowYear = date.getFullYear();
                    var nowMonth = date.getMonth() + 1;
                    var nowDay = date.getDate();

                    if(minMonth==0){
                        minMonth = nowMonth;
                    }else{
                        if(nowMonth<minMonth){
                            minMonth = nowMonth;
                        }
                    }
                    months.push(nowMonth);
                    year = nowYear;
                    dayListStr += nowYear+"-"+nowMonth+"-"+nowDay+",";
                    pkUnitCodeList[nowYear+"-"+nowMonth+"-"+nowDay] = val.code;
                    var html ='';
                    if(pkUnitCodeZ!=""){
                        if(data_index.length<5){
                            if(pkUnitCodeZ==val.code){
                                html ='<div class="succeed-list-title-div pitch-on" onclick="passListChoose(this, \''+val.code+'\', 0, 20);">\
                                    <div>\
                                        <span>'+getDate(0, val.day)+'</span>\
                                        <span>'+getDate(1, val.day)+'</span>\
                                        <span class="applyNum">'+val.applyNum+'人</span>\
                                    </div>\
                                 </div>';
                                //pkUnitCodeZ = val.code;
                            }else{
                                html ='<div class="succeed-list-title-div" onclick="passListChoose(this, \''+val.code+'\', 0, 20);">\
                                    <div>\
                                        <span>'+getDate(0, val.day)+'</span>\
                                        <span>'+getDate(1, val.day)+'</span>\
                                        <span class="applyNum">'+val.applyNum+'人</span>\
                                    </div>\
                                 </div>';
                            }
                        }else{
                            if(pkUnitCodeZ==val.code){
                                getListDaySize ++;
                                html ='<div class="succeed-list-title-div pitch-on" onclick="passListChoose(this, \''+val.code+'\', 0, 20);">\
                                    <div>\
                                        <span>'+getDate(0, val.day)+'</span>\
                                        <span>'+getDate(1, val.day)+'</span>\
                                        <span class="applyNum">'+val.applyNum+'人</span>\
                                    </div>\
                                 </div>';
                                //pkUnitCodeZ = val.code;
                            }else{
                                if(getListDaySize>0 && getListDaySize<5){
                                    getListDaySize ++;
                                    html ='<div class="succeed-list-title-div" onclick="passListChoose(this, \''+val.code+'\', 0, 20);">\
                                        <div>\
                                            <span>'+getDate(0, val.day)+'</span>\
                                            <span>'+getDate(1, val.day)+'</span>\
                                            <span class="applyNum">'+val.applyNum+'人</span>\
                                        </div>\
                                     </div>';
                                }
                            }
                        }
                    }
                    /*<span>'+val.failUserList.length+'人</span>\*/
                    $(".succeed-list-title").append(html);
                })
                auditList(0, 20);
                $(".succeed-list-title").append('<div class=\"succeed-list-title-div\" onclick="openDate();">\
                                                     <div style=\"border: 0px\">\
                                                     <img src="../wap/img/calendar.jpg">\
                                                     </div>\
                                                 </div>');
            }
        }
    })
}