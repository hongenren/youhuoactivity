/**
 * Created by podiannao on 2018/5/14.
 */
$(function () {
    //根据分辨率头部显示不同内容，点击用户列表执行不同事件
    // evenTab();

    //重新输入
    $(".btc").click(function () {
        $("#editor").html('')
    });

    //计算字符串和换行数量，图片数量
    $("#editor").bind({
        keyup: function () {
            leng($(this));
        },
        focus: function () {
            leng($(this));
        },
        blur: function () {
            leng($(this));
        }
    });

    //获取焦点清空
    $("#editor").text('请输入内容！').focus(function () {
        var fotest = ($(this).text()).toString();
        var folld = ('请输入内容！').toString();
        if (folld == fotest) {
            $("#editor").text('')
        }
    });
    //插入表情
    $(".tabTog").click(function (e) {
        $("#Modal").slideDown();
        e.stopPropagation();
    });
    $(".emoji-list li").click(function (e) {
        var emoji = $(this).find("img").attr('src');
        $("#editor").focus();
        var source = '<img src="' + emoji + '">';
        _insertimg(source);
        $("#Modal").slideUp();
        e.stopPropagation();
    });
    $(document).click(function () {
        $("#Modal").slideUp();
    });
    //插图、压缩
    $(".tabFileBut").click(function () {
        var fotest = ($("#editor").text()).toString();
        var folld = ('请输入内容！').toString();
        if (folld == fotest) {
            //document.getElementById('editor').focus();
            $("#editor").focus();
        }
        $("#editor").focus();
    });
    $("#file").change(function () {
        var that = this;
        lrz(this.files[0])
            .then(function (rst) {
                // 处理成功会执行
                var sources = '<img src="' + rst.base64 + '">';
                $("#editor").focus();
                _insertimg(sources);
//                        upImg();
//                        $(".trc").attr('src',rst.base64);

                printInfo('图片原始大小' + that.files[0].size / 1024);
                printInfo('压缩后大小' + rst.base64Len / 1024);
                $("#file").val('')
            })
            .catch(function (err) {
                printInfo(err, MessageLevel.ERROR);
                // 处理失败会执行
            })
            .always(function () {
                // 不管是成功失败，都会执行
                printInfo("lrz!");
            });
    });
});