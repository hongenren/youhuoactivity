function get_cookie(Name) {
    var search = Name + "="//查询检索的值
    var returnvalue = "";//返回值
    if (document.cookie.length > 0) {
        sd = document.cookie.indexOf(search);
        if (sd != -1) {
            sd += search.length;
            end = document.cookie.indexOf(";", sd);
            if (end == -1) {
                end = document.cookie.length;
            }
            //unescape() 函数可对通过 escape() 编码的字符串进行解码。
            returnvalue = unescape(document.cookie.substring(sd, end))
        } else {
            window.location.href = CONTENT_PUB_ARTICLE_URL + '/login/login.html?jumpAdd='+location.href;
        }
    } else {
        window.location.href = CONTENT_PUB_ARTICLE_URL + '/login/login.html?jumpAdd='+location.href;
    }
    return returnvalue;
}

$(function () {
    function get_querystr(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return (r[2]);
        return null;
    }

    $(".seachBut").click(function () {
        var keyWord = $(".seachEditor").val();
        if (keyWord == null || keyWord == '') {
            alert("keyWord参数为空");
            return;
        }
        window.location.href = '/gysh_cm_pub/article/search.html?index=search&keyWord=' + keyWord;
    });

    var init = function () {
        // var uid = get_cookie('u');
        // var unickname = get_cookie('un');
        // var uicon = get_cookie('uh');
        var index = get_querystr('index');
        if (index == null || index == '') {
            index = "recommend";
        }
        var daoHang = "";
        if (index == "index") {
            daoHang += '     <div class="tabList on"><a href="/gysh_cm_pub/article/index.html?index=index">关注</a></div>\n' +
                '            <div class="tabList"><a href="http://news.shcvs.cn/gysh_cm_pub/article/recommend.html?index=recommend">推荐</a></div>\n' +
                // '            <div class="tabList"><a href="/gysh_cm_pub/inquire/question.html?index=question">问答</a></div>\n' +
                '            <div class="tabList"><a href="/gysh_cm_pub/article/picture.html?index=picture">图片</a></div>\n' +
                '            <div class="tabList"><a href="/gysh_cm_pub/article/video.html?index=video">视频</a></div>\n' +
                '            <div class="tabList"><a href="/gysh_cm_pub/subject/subject.html?index=subject">专题</a></div>\n' +
                '            <div class="tabList">公示</div>';
        } else if (index == "recommend") {
            daoHang += '     <div class="tabList"><a href="/gysh_cm_pub/article/index.html?index=index">关注</a></div>\n' +
                '            <div class="tabList on"><a href="http://news.shcvs.cn/gysh_cm_pub/article/recommend.html?index=recommend">推荐</a></div>\n' +
                // '            <div class="tabList"><a href="/gysh_cm_pub/inquire/question.html?index=question">问答</a></div>\n' +
                '            <div class="tabList"><a href="/gysh_cm_pub/article/picture.html?index=picture">图片</a></div>\n' +
                '            <div class="tabList"><a href="/gysh_cm_pub/article/video.html?index=video">视频</a></div>\n' +
                '            <div class="tabList"><a href="/gysh_cm_pub/subject/subject.html?index=subject">专题</a></div>\n' +
                '            <div class="tabList">公示</div>';
        } else if (index == "question") {
            daoHang += '     <div class="tabList "><a href="/gysh_cm_pub/article/index.html?index=index">关注</a></div>\n' +
                '            <div class="tabList"><a href="http://news.shcvs.cn/gysh_cm_pub/article/recommend.html?index=recommend">推荐</a></div>\n' +
                // '            <div class="tabList on"><a href="/gysh_cm_pub/inquire/question.html?index=question">问答</a></div>\n' +
                '            <div class="tabList"><a href="/gysh_cm_pub/article/picture.html?index=picture">图片</a></div>\n' +
                '            <div class="tabList"><a href="/gysh_cm_pub/article/video.html?index=video">视频</a></div>\n' +
                '            <div class="tabList"><a href="/gysh_cm_pub/subject/subject.html?index=subject">专题</a></div>\n' +
                '            <div class="tabList">公示</div>';
        } else if (index == "picture") {
            daoHang += '     <div class="tabList "><a href="/gysh_cm_pub/article/index.html?index=index">关注</a></div>\n' +
                '            <div class="tabList"><a href="http://news.shcvs.cn/gysh_cm_pub/article/recommend.html?index=recommend">推荐</a></div>\n' +
                // '            <div class="tabList"><a href="/gysh_cm_pub/inquire/question.html?index=question">问答</a></div>\n' +
                '            <div class="tabList on"><a href="/gysh_cm_pub/article/picture.html?index=picture">图片</a></div>\n' +
                '            <div class="tabList"><a href="/gysh_cm_pub/article/video.html?index=video">视频</a></div>\n' +
                '            <div class="tabList"><a href="/gysh_cm_pub/subject/subject.html?index=subject">专题</a></div>\n' +
                '            <div class="tabList">公示</div>';
        } else if (index == "video") {
            daoHang += '     <div class="tabList "><a href="/gysh_cm_pub/article/index.html?index=index">关注</a></div>\n' +
                '            <div class="tabList"><a href="http://news.shcvs.cn/gysh_cm_pub/article/recommend.html?index=recommend">推荐</a></div>\n' +
                // '            <div class="tabList"><a href="/gysh_cm_pub/inquire/question.html?index=question">问答</a></div>\n' +
                '            <div class="tabList"><a href="/gysh_cm_pub/article/picture.html?index=picture">图片</a></div>\n' +
                '            <div class="tabList on"><a href="/gysh_cm_pub/article/video.html?index=video">视频</a></div>\n' +
                '            <div class="tabList"><a href="/gysh_cm_pub/subject/subject.html?index=subject">专题</a></div>\n' +
                '            <div class="tabList">公示</div>';
        } else if (index == "subject") {
            daoHang += '     <div class="tabList "><a href="/gysh_cm_pub/article/index.html?index=index">关注</a></div>\n' +
                '            <div class="tabList"><a href="http://news.shcvs.cn/gysh_cm_pub/article/recommend.html?index=recommend">推荐</a></div>\n' +
                // '            <div class="tabList"><a href="/gysh_cm_pub/inquire/question.html?index=question">问答</a></div>\n' +
                '            <div class="tabList"><a href="/gysh_cm_pub/article/picture.html?index=picture">图片</a></div>\n' +
                '            <div class="tabList"><a href="/gysh_cm_pub/article/video.html?index=video">视频</a></div>\n' +
                '            <div class="tabList on"><a href="/gysh_cm_pub/subject/subject.html?index=subject">专题</a></div>\n' +
                '            <div class="tabList">公示</div>';
        } else if (index == "search") {
            daoHang += '     <div class="tabList "><a href="/gysh_cm_pub/article/index.html?index=index">关注</a></div>\n' +
                '            <div class="tabList"><a href="http://news.shcvs.cn/gysh_cm_pub/article/recommend.html?index=recommend">推荐</a></div>\n' +
                // '            <div class="tabList"><a href="/gysh_cm_pub/inquire/question.html?index=question">问答</a></div>\n' +
                '            <div class="tabList"><a href="/gysh_cm_pub/article/picture.html?index=picture">图片</a></div>\n' +
                '            <div class="tabList"><a href="/gysh_cm_pub/article/video.html?index=video">视频</a></div>\n' +
                '            <div class="tabList"><a href="/gysh_cm_pub/subject/subject.html?index=subject">专题</a></div>\n' +
                '            <div class="tabList">公示</div>';
        }
        $('.headTab').html(daoHang);

        var foot = '<div class="container">\n' +
            '        <div class="footBut">\n' +
            '            <div class="buttonWrap">\n' +
            '                <div class="bottonList">\n' +
            '                    <a href="' + CONTENT_PUB_ARTICLE_URL + '" data-href=\'/\'>\n' +
            '                        <div class="butIcon" style="background-image:url(\'' + CONTENT_PUB_ARTICLE_URL + '/wap/img/pws_29.png\')"></div>\n' +
            '                        <div class="butTxt">首页</div>\n' +
            '                    </a>\n' +
            '                </div>\n' +
            '                <div class="bottonList on">\n' +
            '                    <a href="http://news.shcvs.cn/gysh_cm_pub/article/recommend.html" data-href=\'/find/faxian.html\'>\n' +
            '                        <div class="butIcon" style="background-image:url(\'' + CONTENT_PUB_ARTICLE_URL + '/wap/img/pws_30_on.png\')"></div>\n' +
            '                        <div class="butTxt">发现</div>\n' +
            '                    </a>\n' +
            '                </div>\n' +
            '                <div class="bottonList bottonListTog qt_ft3">\n' +
            '                    <a href="javascript:void(0)">\n' +
            '                        <div class="butIcon butIconRelease">\n' +
            '                            <div class="releaseWrap" style="background-image:url(\'' + CONTENT_PUB_ARTICLE_URL + '/wap/img/pws_31.png\')">\n' +
            '                            </div>\n' +
            '                        </div>\n' +
            '                        <div class="butTxt">发布</div>\n' +
            '                    </a>\n' +
            '                </div>\n' +
            '                <div class="bottonList">\n' +
            '                    <a href="' + CONTENT_PUB_ARTICLE_URL + '/order/myjoin.html" data-href=\'/order/myorder.html\'>\n' +
            '                        <div class="butIcon" style="background-image:url(\'' + CONTENT_PUB_ARTICLE_URL + '/wap/img/pws_32.png\')"></div>\n' +
            '                        <div class="butTxt">订单</div>\n' +
            '                    </a>\n' +
            '                </div>\n' +
            '                <div class="bottonList">\n' +
            '                    <a href="' + CONTENT_PUB_ARTICLE_URL + '/user/user_index.html" data-href="/user/user_index.html" onclick="user_index()">\n' +
            '                        <div class="butIcon" style="background-image:url(\'' + CONTENT_PUB_ARTICLE_URL + '/wap/img/pws_33.png\')"></div>\n' +
            '                        <div class="butTxt">我的</div>\n' +
            '                    </a>\n' +
            '                </div>\n' +
            '            </div>\n' +
            '        </div>\n' +
            '    </div>\n' +
            '    <div class="bigButWrap bigButWrapOn">\n' +
            '        <div class="bigBut butScrollTop" style="background-image:url(\'images/top.png\')"></div>\n' +
            '    </div>\n' +
            '    <div class="warp_hd_y">\n' +
            '        <div class="warp_hd_y_lp"></div>\n' +
            '        <ul class="warp_hd_y_lo">\n' +
            '            <li class="warp_hd_y_lo_1">\n' +
            '                <a href="' + news_base_url + '/act/act_base_add.html">\n' +
            '                    <img src="' + news_base_url + '/wap/img/pws_dh_1.png">\n' +
            '                    <span>标准发布</span>\n' +
            '                </a>\n' +
            '            </li>\n' +
            '            <li class="warp_hd_y_lo_2">\n' +
            '                <a href="">\n' +
            '                    <img src="' + news_base_url + '/wap/img/pws_dh_2.png">\n' +
            '                    <span>快速发布</span>\n' +
            '                </a>\n' +
            '            </li>\n' +
            '            <li class="warp_hd_y_lo_3">\n' +
            '                <a href="' + news_base_url + '/find/tiwen.html">\n' +
            '                    <img src="' + news_base_url + '/wap/img/pws_dh_3.png">\n' +
            '                    <span>提问</span>\n' +
            '                </a>\n' +
            '            </li>\n' +
            '            <li class="warp_hd_y_lo_4">\n' +
            '                <a href="' + news_base_url + '/find/fabutuwen.html">\n' +
            '                    <img src="' + news_base_url + '/wap/img/pws_dh_4.png">\n' +
            '                    <span>发布图文</span>\n' +
            '                </a>\n' +
            '            </li>\n' +
            '            <li class="warp_hd_y_lo_5">\n' +
            '                <a href="' + news_base_url + '/find/fabutupian.html">\n' +
            '                    <img src="' + news_base_url + '/wap/img/pws_dh_5.png">\n' +
            '                    <span>发布图片</span>\n' +
            '                </a>\n' +
            '            </li>\n' +
            '            <li class="warp_hd_y_lo_6">\n' +
            '                <a href="' + news_base_url + '/find/fabushipin.html">\n' +
            '                    <img src="' + news_base_url + '/wap/img/pws_dh_6.png">\n' +
            '                    <span>发布视频</span>\n' +
            '                </a>\n' +
            '            </li>\n' +
            '        </ul>\n' +
            '        <div class="warp_hd_y_li">\n' +
            '            <a href="javascript:void(0)"></a>\n' +
            '        </div>\n' +
            '    </div>';
        $('#footEnd').html(foot);
        $(".qt_ft3 a").click(function () {
            $(".warp_hd_y").fadeIn();
            $(".warp_hd_y_lo_1").fadeIn("slow");
            $(".warp_hd_y_lo_2").fadeIn(1000);
            $(".warp_hd_y_lo_3").fadeIn(2000);
            $(".warp_hd_y_lo_4").fadeIn(3000);
            $(".warp_hd_y_lo_5").fadeIn(4000);
            $(".warp_hd_y_lo_6").fadeIn(5000);
        });
        $(".warp_hd_y_li a").click(function () {
            $(".warp_hd_y").fadeOut();
        });

        function user_index() {
            var url = '';
            if ($.cookie('user_msg') == undefined || $.cookie('token') == undefined) {
                var url = CONTENT_PUB_ARTICLE_URL + '/login/login.html?jumpAdd='+location.href;
            } else {
                var url = CONTENT_PUB_ARTICLE_URL + '/user/user_index.html';

            }
            window.location.href = url;

        }

        var curr_url = window.location.pathname + window.location.search;//获取当前URL
        $('#nav a').each(function (i, n) {  //循环导航的a标签
            var href = $(this).attr('data-href'); //a标签中的href链接
            if (href == curr_url) {  //如果当前URL,和a标签中的href相等。
                $(this).parent().addClass('current');  //那么就给这个a标签的父元素增加selected类。
            }
        })
    }
    init();
});