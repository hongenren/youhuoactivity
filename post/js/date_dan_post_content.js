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
            /*$('body').css({
              overflow: 'scroll'
            });*/
            // 主容器模板
            var dateTemplate = '\n        <div class =\'date container c-gray\' style="top:auto;left: auto;position:static;">\n          <h4 class="tac bold">共选择<span class=\'c-red\'>0</span>天</h4>\n          <div class=\'close-btn\' style="top:60px;">\u786E\u5B9A</div>\n    <div class=\'check-all-btn\' style="top:60px;padding: 8px 5px;">\u5168\u9009('+dayListLength+')</div>\n    </div>      \n      ';

            $('.date_div').append(dateTemplate); // 向body添加插件

            console.log(dateArr)
            // action容器模板
            dateArr.forEach(function (item, index) {
                var template = '\n          <div class=\'action mt10\'>\n            <div class=\'title tac c-blue\'><div class="y">' + item.getFullYear() + '</div>\u5E74<div class="m">' + (item.getMonth() + 1) + '</div>\u6708</div>\n            <ul class=\'week border-bottom\'><li>\u65E5</li><li>\u4E00</li><li>\u4E8C</li><li>\u4E09</li><li>\u56DB</li><li>\u4E94</li><li>\u516D</li></ul>\n            <ul class=\'day f-small\'></ul>\n          </div>        \n        ';
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
                    else if (i < nowdate.getDate() + nowweek - 1 && dateArr[index].getMonth() === nowdate.getMonth()) {
                        // 当月已经过去的日期 不能点击
                        listIndex++;
                        if (dayListStr.indexOf(listDate+",")!= -1) {
                            if (appliedDayList.indexOf(listDate+",")!= -1) {
                                template = '<li index=\'' + listIndex + '\' class=\'default\' style="" date-date="' + dateArr[index].getFullYear() + '-' + (dateArr[index].getMonth() + 1) + '-' + (i - nowweek + 1) + '">' + (i - nowweek + 1) + '已报</li>';
                            }else{
                                template = '<li index=\'' + listIndex + '\' class=\'disable\'>' + (i - nowweek + 1) + '</li>';
                            }
                        }else{
                            template = '<li index=\'' + listIndex + '\' class=\'disable\'>' + (i - nowweek + 1) + '</li>';
                        }
                    }
                    else if (dayListStr.indexOf(listDate+",")!= -1) {
                        listIndex++;
                        if (appliedDayList.indexOf(listDate+",")!= -1) {
                            if(type!="group"){
                                //$('.c-red').text(Number($('.c-red').text())+1);
                                template = '<li index=\'' + listIndex + '\' class=\'default\' style="" date-date="' + dateArr[index].getFullYear() + '-' + (dateArr[index].getMonth() + 1) + '-' + (i - nowweek + 1) + '">' + (i - nowweek + 1) + '已报</li>';
                                //template = '<li index=\'' + listIndex + '\' class=\'default\' style="line-height: 20px;" date-date="' + dateArr[index].getFullYear() + '-' + (dateArr[index].getMonth() + 1) + '-' + (i - nowweek + 1) + '">' + (i - nowweek + 1) + '<div>已报</div></li>';
                            }else{
                                template = '<li index=\'' + listIndex + '\' class=\'optional\' date-date="' + dateArr[index].getFullYear() + '-' + (dateArr[index].getMonth() + 1) + '-' + (i - nowweek + 1) + '">' + (i - nowweek + 1) + '</li>';
                            }
                        }else{
                            template = '<li index=\'' + listIndex + '\' class=\'optional\' date-date="' + dateArr[index].getFullYear() + '-' + (dateArr[index].getMonth() + 1) + '-' + (i - nowweek + 1) + '">' + (i - nowweek + 1) + '</li>';
                        }
                    }
                    else {
                        listIndex++;
                        template = '<li index=\'' + listIndex + '\' class=\'disable\'>' + (i - nowweek + 1) + '</li>';
                        //template = '<li index=\'' + listIndex + '\' date-date="' + dateArr[index].getFullYear() + '-' + (dateArr[index].getMonth() + 1) + '-' + (i - nowweek + 1) + '">' + (i - nowweek + 1) + '</li>';
                    }
                    $(item).find('.day').append(template);
                }
            });

            // 事件监听
            // 关闭插件
            $('.close-btn').on('click', function () {
                var enter = 0;
                applyDayList = [];
                $('.enter').each(function(){
                    enter += 1;
                    var enterTime = "";
                    var enterYear = $(this).parents('.day').siblings('.title').find('.y').text();
                    var enterMonth = $(this).parents('.day').siblings('.title').find('.m').text();
                    var enterDay = $(this).text();
                    enterTime = enterYear + '-' + enterMonth + '-' + enterDay;
                    $.each(dayList, function (k, val) {
                        var date = new Date(val.day);
                        var nowYear = date.getFullYear();
                        var nowMonth = date.getMonth() + 1;
                        var nowDay = date.getDate();
                        var dayStr = nowYear+"-"+nowMonth+"-"+nowDay;
                        if(dayStr == enterTime){
                            applyDayList.push(val.code);
                        }
                    })
                });
                if(enter!=0){
                    if(applyDayList.length<reqAttendTimes){
                        layer.open({
                            content: '至少报名参加'+reqAttendTimes+'次！'
                            ,skin: 'msg'
                            ,time: 1 //2秒后自动关闭
                        });
                        return false;
                    }
                    closeData();
                    if(hasQuestion==0){
                        apply();
                    }else{
                        if(type!="group"){
                            $(".warp").hide();
                            if(hasQuestionNull==0){
                                $(".question_div").show();
                            }else{
                                $(".warp").show();
                                apply();
                            }
                        }else{
                            apply();
                        }
                    }
                }
            });

            $('.check-all-btn').on('click', function () {
              if(optional==0){
                  $(this).html("取消全选（"+dayListLength+"）");
                  optional = 1;
                  $('.c-red').text(dayListLength);
                  $('.optional').each(function(){
                      $(this).addClass('enter');
                  })
              }else{
                  $(this).html("全选（"+dayListLength+"）");
                  optional = 0;
                  $('.c-red').text(0);
                  $('.optional').each(function(){
                      $(this).removeClass('enter');
                  })
              }
            })

            var num = 0;
            // 时间选择
            $('.day li').on('click', function () {
                if (!$(this).hasClass('disable') && !$(this).hasClass('default')) {
                    if($(this).hasClass('enter')){
                        $('.c-red').text(Number($('.c-red').text())-1);
                        $(this).removeClass('enter');
                    }else{
                        $('.c-red').text(Number($('.c-red').text())+1);
                        $(this).addClass('enter');
                    }
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

    $(".warp").show();
    $(".date_div").hide();
}
