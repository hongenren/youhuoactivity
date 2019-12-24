/**
 * Created by  on 2018/5/11.
 */
// 获取光标位置
function getCursortPosition(textDom) {
    var cursorPos = 0;
    if (!window.getSelection) {
        // IE Support
        textDom.focus();
        var selectRange = document.selection.createRange();
        selectRange.moveStart('character', -textDom.value.length);
        cursorPos = selectRange.text.length;
    } else if (textDom.selectionStart || textDom.selectionStart == '0') {
        // Firefox support
        cursorPos = textDom.selectionStart;
    }
    return cursorPos;
}

//获取焦点位置并插入内容
function insertHtmlAtCaret(html) {
    var sel, range;
    if (window.getSelection) {
        // IE9 and non-IE
        sel = window.getSelection();
        if (sel.getRangeAt && sel.rangeCount) {
            range = sel.getRangeAt(0);
            range.deleteContents();
            // Range.createContextualFragment() would be useful here but is
            // non-standard and not supported in all browsers (IE9, for one)
            var el = document.createElement("div");
            el.innerHTML = html;
            var frag = document.createDocumentFragment(), node, lastNode;
            while ((node = el.firstChild)) {
                lastNode = frag.appendChild(node);
            }
            range.insertNode(frag);
            // Preserve the selection
            if (lastNode) {
                range = range.cloneRange();
                range.setStartAfter(lastNode);
                range.collapse(true);
                sel.removeAllRanges();
                sel.addRange(range);
            }
        }
    } else if (document.selection && document.selection.type != "Control") {
        // IE < 9
        document.selection.createRange().pasteHTML(html);
    }
}

function _insertimg(str) {
    var selection = window.getSelection ? window.getSelection() : document.selection;
    var range = selection.createRange ? selection.createRange() : selection.getRangeAt(0);
    if (!window.getSelection) {
        document.getElementById('editor').focus();
//            var selection= window.getSelection ? window.getSelection() : document.selection;
//            var range= selection.createRange ? selection.createRange() : selection.getRangeAt(0);
        range.pasteHTML(str);
        range.collapse(false);
        range.select();
    } else {
        document.getElementById('editor').focus();

        range.collapse(false);
        var hasR = range.createContextualFragment(str);
        var hasR_lastChild = hasR.lastChild;
        while (hasR_lastChild && hasR_lastChild.nodeName.toLowerCase() == "br" && hasR_lastChild.previousSibling && hasR_lastChild.previousSibling.nodeName.toLowerCase() == "br") {
            var e = hasR_lastChild;
            hasR_lastChild = hasR_lastChild.previousSibling;
            hasR.removeChild(e)
        }
        range.insertNode(hasR);
        if (hasR_lastChild) {
            range.setEndAfter(hasR_lastChild);
            range.setStartAfter(hasR_lastChild)
        }
        selection.removeAllRanges();
        selection.addRange(range)
    }
    leng($("#editor"));
}

//过滤白名单
function optionlist() {
    return {
        a: ["target", "href", "title"],
        abbr: ["title"],
        address: [],
        area: ["shape", "coords", "href", "alt"],
        article: [],
        aside: [],
        audio: ["autoplay", "controls", "loop", "preload", "src"],
        b: [],
        bdi: ["dir"],
        bdo: ["dir"],
        big: [],
        blockquote: ["cite"],
        br: [],
        caption: [],
        center: [],
        cite: [],
        code: [],
        col: ["align", "valign", "span", "width"],
        colgroup: ["align", "valign", "span", "width"],
        dd: [],
        del: ["datetime"],
        details: ["open"],
        div: [],
        dl: [],
        dt: [],
        em: [],
        font: ["color", "size", "face"],
        footer: [],
        h1: [],
        h2: [],
        h3: [],
        h4: [],
        h5: [],
        h6: [],
        header: [],
        hr: [],
        i: [],
        img: ["src", "alt", "title", "width", "height"],
        ins: ["datetime"],
        li: [],
        mark: [],
        nav: [],
        ol: [],
        p: [],
        pre: [],
        s: [],
        section: [],
        small: [],
        span: [],
        sub: [],
        sup: [],
        strong: [],
        table: ["width", "border", "align", "valign"],
        tbody: ["align", "valign"],
        td: ["width", "rowspan", "colspan", "align", "valign"],
        tfoot: ["align", "valign"],
        th: ["width", "rowspan", "colspan", "align", "valign"],
        thead: ["align", "valign"],
        tr: ["rowspan", "align", "valign"],
        tt: [],
        u: [],
        ul: [],
        video: ["autoplay", "controls", "loop", "preload", "src", "height", "width"]
    }
}

//计算字符串和换行数量，图片数量
function leng(obj) {
    var len = 0;
    var that = obj;
    var divLen = that.find('div').text();
    var imgLen = that.find('img').length;
    that.find('div').each(function () {
        if ($(this).text() == '') {
            len++
        }
    });
    var allen = that.text().length + len;
    if (allen > 0) {
        $(".trl02").text("已经输入" + allen + "字符");
    }
    if (imgLen > 0) {
        $(".trl03").text("已经插入" + imgLen + "图");
    }
}

//替换IMG为ID
//var tes=$("#tes");
//var repLast=repBefore(tes);
//    var s = "LOVE LIFE ！ LOVE JAVA ...";
//    var tmp="LOVE ";
//    var reg=new RegExp("");
//    console.log(s.replace(/ /g,"爱"));

function repBefore(data) {
    var inner = data;
    var imgReps = function () {
        var imgs = inner.find("img");
        imgs.each(function () {
            $(this).replaceWith('[' + $(this).attr('id') + ']');
        });
    };
    return imgReps();
}

//复制、粘贴、删除、输入事件
$("#editor").bind({
    copy: function () {
        // console.log('copy!');
    },
    paste: function (e) {
        // console.log('paste!');
    },
    cut: function () {
        // console.log('cut!');
    },
    keyup: function () {
        // console.log("keyup!");
        setTimeout(function () {
            leng($(this));
        });
    },
    focus: function () {
        setTimeout(function () {
            leng($(this));
        });
    },
    blur: function () {
        setTimeout(function () {
            leng($(this));
            $("html,body").animate({'scrollTop': 0}, 500)
        });
    }
});
//根据分辨率头部显示不同内容
$(document).resize(function () {
    // evenTab();
    autoHeightEvent()
});

//根据屏幕高度设置元素高度
var autoHeightEvent = function () {
    if (/(iPhone|iPad|iPod|iOS|Android)/i.test(navigator.userAgent)) { //移动端
        var height = $(window).height();
        var togUseHeight = $('.togUse').outerHeight();
        var tabWrapHeight = $('.tabWrap').outerHeight();
        var trlHeight = $('.trl').outerHeight();
        var btnHeight = $('button.btn').outerHeight();
        var allHeights = parseInt(togUseHeight + tabWrapHeight + trlHeight + btnHeight)

        $(".dialogWrap").height(parseInt(height - allHeights) * 0.5);
        $("#editor").height(parseInt(height - allHeights) * 0.2);

        console.log(height);
        console.log(allHeights)
        console.log(height - allHeights)
    }
}

// function evenTab() {
//     var width = $(document).outerWidth();
//     if (width < 769) {
//         // $(".togUse").html($(".ctive").prop("outerHTML"));
//         $(".togUse").empty().text('好友列表');
//         $(".togUse").click(function () {
//             $(".userWrap").slideDown();
//         });
//         $(".useList").click(function () {
//             $(".userWrap").slideUp();
//         })
//     } else {
//         $(".togUse").empty().text('WEBSOCKET')
//     }
// }

var itemAdd = function (data) {
    obj[data] = {};
    obj[data]['id'] = data;
    obj[data]['message'] = '';
};
var itemRemove = function (data) {
    delete obj[data];
};

//左侧显示特殊消息
var specialUrlCall = function (_element) {//按钮点击事件
    var _parentElement = _element.parentNode;
    console.log(_element);
    console.log(_parentElement);
    console.log(_element.getAttribute('data-href'));
    console.log(_element.getAttribute('data-list'));
    //如果为true则删掉按钮
    if (_parentElement) {
        _parentElement.removeChild(_element);
    }
};

function sortNumber(a, b) {//根据num值排序
    return a['num'] - b['num']
}

var receiveSpecialMess = function (data, len) {
    console.log(data)
    let datas = JSON.parse(data['message']);
    let options = datas['options'];
    let specialData = datas['content'];
    let statusUrl = datas['statusUrl'];//ajax请求，返回true执行specialListEvent事件，false不执行
    let specialContent = '';
    let specialListEvent = function () {
        if (options.length > 0) {
            var sortList = options.sort(sortNumber);
            console.log(sortList);
            for (var i = 0; i < sortList.length; i++) {
                var urlist = '';
                var optionUrl = sortList[i]['optionUrl'];
                var urls = sortList[i]['requirementParam'];
                // if(sortList[i]['requirementParam']){
                //     urlist=sortList[i]['requirementParam']
                //     // if(optionUrl.indexOf('?')!==-1){
                //     //     urls='&';
                //     // }else{
                //     //     urls='?';
                //     // }
                //     // for(var j=0;j<urlist.length;j++){
                //     //     urls+=urlist[j]+'='+$.cookie(urlist[j])+'&'
                //     // }
                //     // optionUrl=optionUrl+urls.substr(0,urls.length-1)
                // }
                //console.log(optionUrl);
                specialContent += '<a class="sortListBut" href="javascript:void(0)" data-href="' + optionUrl + '" data-list=\'' + urls + '\'>' + sortList[i]['option'] + '</a>'
            }

        }
    };
    specialListEvent();
    let res = USER_INFO[get_querystr("otherId")]
    let headerImg = 'images/gysh.png';
    if (res["headerUrl"] != "") {
        headerImg = res["headerUrl"];
    }
    let lefts = '<div class="dialogLeft clearfix">'
        + '<div class="dialogPosition specialPosition">'
        + '<div class="dialogUse" style="background-image:url(\'' + headerImg + '\')"></div>'
        + '<div class="dialogIcon"></div>'
        + '<div class="dialogColumn dialogBase">'
        + '<div class="specialTxtWrap">' + specialData + '</div>'
        + '<div class="specialTxtNew" data-url="' + statusUrl + '"><button class="specialDetail_but">查看详情</button></div>'
        + '<div class="specialButton" style="display:none;">' + specialContent + '</div>'
        + '</div>'
        + '</div>'
        + '</div>';
    if (len == 1) {
        $(".dialogWrap").prepend(lefts);
    } else {
        $(".dialogWrap").append(lefts)
    }
    ;
};

//左侧消息显示
var receiveMess = function (id, data, len) {
    if (id == undefined) {
        return;
    }
    let res = USER_INFO[get_querystr("otherId")]
    // if(res ==undefined){
    //     return
    // }
    let headerImg = 'images/gysh.png';
    let resUrl = res["headerUrl"];
    if (resUrl != "") {
        headerImg = resUrl;
    }
    let lefts = '<div class="dialogLeft clearfix">'
        + '<div class="dialogPosition">'
        + '<div class="dialogUse" style="background-image:url(\'' + headerImg + '\')"></div>'
        + '<div class="dialogIcon"></div>'
        + '<div class="dialogColumn dialogBase">'
        + '<div>' + data + '</div>'
        + '</div>'
        + '</div>'
        + '</div>';
//    $(".dialogWrap").append(lefts);
//     if (obj[id] == undefined) {
//         obj[id] = {};
//     }
//     obj[id]['message'] = obj[id]['message'] + lefts;
//
//     let dialogHtml = $(".dialogWrap").html();
//     let togUseId = $(".togUse").attr('data-id');
//     if (dialogHtml == '') {
//         $(".dialogWrap").html(obj[id]['message']);
//     }
//     if (togUseId == id) {
//         $(".dialogWrap").html(obj[id]['message']);
//     }
    if (len == 1) {
        $(".dialogWrap").prepend(lefts)
    } else {
        $(".dialogWrap").append(lefts)
    }

};

//右侧显示特殊消息
var callSpecialMess = function (data, len) {
    console.log(data)
    let datas = JSON.parse(data['message']);
    let options = datas['options'];
    let specialData = datas['content'];
    let statusUrl = datas['statusUrl'];//ajax请求，specialCallListEvent，false不执行
    let specialContent = '';
    let specialCallListEvent = function () {
        if (options.length > 0) {
            var sortList = options.sort(sortNumber);
            console.log(sortList);
            for (var i = 0; i < sortList.length; i++) {
                var urlist = '';
                var optionUrl = sortList[i]['optionUrl'];
                var urls = '';
                if (sortList[i]['requirementParam']) {
                    urlist = sortList[i]['requirementParam'].split(';');
                    if (optionUrl.indexOf('?') !== -1) {
                        urls = '&';
                    } else {
                        urls = '?';
                    }
                    for (var j = 0; j < urlist.length; j++) {
                        urls += urlist[j] + '=' + $.cookie(urlist[j]) + '&'
                    }
                    optionUrl = optionUrl + urls.substr(0, urls.length - 1)
                }
                //console.log(optionUrl);
                specialContent += '<a href="javascript:void(0)" data-href="' + optionUrl + '">' + sortList[i]['option'] + '</a>'
            }

        }
    };
    specialCallListEvent();
    let res = USER_INFO[get_querystr("userId")]
    let headerImg = 'images/gysh.png';
    if (res["headerUrl"] != "") {
        headerImg = res["headerUrl"];
    }
    let rights = '<div class="dialogRight clearfix">'
        + '<div class="dialogPosition specialPosition">'
        + '<div class="dialogUse" style="background-image:url(\'' + headerImg + '\')"></div>'
        + '<div class="dialogIcon"></div>'
        + '<div class="dialogColumn dialogBase">'
        + '<div class="specialTxtWrap">' + specialData + '</div>'
        // + '<div class="specialTxtNew" data-url="' + statusUrl + '" style="font-size:16px;padding:5px 10px;"><button class="specialDetail_but">查看详情</button></div>'
        + '<div class="specialButton" style="display:none">' + specialContent + '</div>'
        + '</div>'
        + '</div>'
        + '</div>';
    if (len == 1) {
        $(".dialogWrap").prepend(rights);
    } else {
        $(".dialogWrap").append(rights)
    }
    ;
};

//右侧消息
var callMess = function (data, len) {
    let res = USER_INFO[get_querystr("userId")]
    let headerImg = 'images/gysh.png';
    if (res["headerUrl"] != "") {
        headerImg = res["headerUrl"];
    }
    let rights = '<div class="dialogRight clearfix">'
        + '<div class="dialogPosition">'
        + '<div class="dialogUse" style="background-image:url(\'' + headerImg + '\')"></div>'
        + '<div class="dialogIcon"></div>'
        + '<div class="dialogColumn dialogBase">'
        + '<div>' + data + '</div>'
        + '</div>'
        + '</div>'
        + '</div>';

    // let togUseId = $(".togUse").attr('data-id');
    // if (obj[togUseId] == null) {
    //     return;
    // }
    // obj[togUseId]['message'] = obj[togUseId]['message'] + rights;
    // $(".dialogWrap").html(obj[togUseId]['message']);
    if (len == 1) {
        $(".dialogWrap").prepend(rights)
    } else {
        $(".dialogWrap").append(rights)
    }

    $("#editor").html('');
    $(".trl02,.trl03").text('');
};

var preseMessHtml = function () {
    let dialogHtml = $(".dialogWrap").html();
    let togUseId = $(".togUse").attr('data-id');
    if (dialogHtml !== '') {
        if (obj[togUseId] != null) {
            obj[togUseId]['message'] = dialogHtml;
        }
    }
};

var displayMessHtml = function (data) {
    if (obj[data]['message'] !== '') {
        $(".dialogWrap").html(obj[data]['message'])
    } else {
        $(".dialogWrap").html('')
    }
};

//查看详情按钮事件
$(document).on("click", ".specialTxtNew", function () {
    var url = $(this).attr("data-url");
    var that = $(this);
    // alert(url);
    $.ajax({
        url: url,
        type: "get",
        dataType: "json",
        async: false,
        success: function (resp) {
            if (resp.code == 0) {
                if (resp.data.state == 0) {
                    that.next(".specialButton").show();
                    that.next().children(".sortListBut").attr("codes", resp.data.code);
                    // that.attr("codes",resp.data.code);
                    that.hide();
                } else {
                    that.next(".specialButton").hide();
                    that.text("该消息已处理").show();
                }
            }
        }
    });

})

//通过拒绝按钮
$(document).on("click", ".sortListBut", function () {
    var url = $(this).attr("data-href");
    var list = $(this).attr("data-list");
    var that = $(this);
    var token = $.cookie('token');
    $.ajax({
        url: url,
        type: "post",
        dataType: "json",
        headers: {'token': token},
        contentType: "application/json;charset=utf-8",
        async: false,
        data: JSON.stringify(JSON.parse(list)),
        success: function (resp) {
            if (resp.code == 0) {
                var co = that.attr("codes");
                var codes = "{\"code\":\"" + co.toString() + "\"}";
                $.ajax({
                    url: base_url + "html5/v1/sms/updateMsgState",
                    type: "post",
                    dataType: "json",
                    headers: {'token': token},
                    contentType: "application/json;charset=utf-8",
                    async: false,
                    data: JSON.stringify(JSON.parse(codes)),
                    success: function (resp) {
                        if (resp.code == 0) {
                            that.parents(".specialButton").prev(".specialTxtNew").text("该消息已处理").show();
                            that.parents(".specialButton").remove();
                        } else {
                            that.parents(".specialButton").prev(".specialTxtNew").text("处理失败").show();
                            that.parents(".specialButton").remove();
                        }
                    }
                });
            } else {
                that.parents(".specialButton").prev(".specialTxtNew").text("处理失败").show();
                that.parents(".specialButton").remove();
            }
        }
    });

})

$(document).keyup(function (e) {
    if (e.ctrlKey && e.which == 13) {

    }
});
//聊天记录滚动到底部
var listScrollTo = function () {
    var scrollHeight = $(".dialogWrap")[0].scrollHeight;
    var heights = $(".dialogWrap").height();
    $(".dialogWrap").animate({scrollTop: (scrollHeight - heights) + 'px'}, 500);
};
