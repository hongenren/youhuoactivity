/**
 * 生成随机序列
 * @param len
 * @param radix
 * @returns {string}
 */

let uuid = function (len, radix) {
    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
    var uuid = [], i;
    radix = radix || chars.length;

    if (len) {
        // Compact form
        for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
    } else {
        // rfc4122, version 4 form
        var r;

        // rfc4122 requires these characters
        uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
        uuid[14] = '4';

        // Fill in random data. At i==19 set the high bits of clock sequence as
        // per rfc4122, sec. 4.1.5
        for (i = 0; i < 36; i++) {
            if (!uuid[i]) {
                r = 0 | Math.random() * 16;
                uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
            }
        }
    }

    return uuid.join('');
}

/**
 * 输出信息
 * @param message
 * @param level
 */
let printInfo = function (message, level = MessageLevel.INFO) {

    if (level == MessageLevel.ERROR) {
        console.error(message);
        return;
    }

    if (IS_DEBUG) {
        switch (level) {
            case MessageLevel.INFO:
                console.log(message);
                break;
            case MessageLevel.DEBUG:
                console.debug(message);
                break;
            case MessageLevel.WARNING:
                console.warn(message);
                break;
            default:
        }
    }
}

/**
 * 数组排序
 * @param data
 * @returns {null}
 */
let arraySort = function (data) {
    return data;
    // if (data instanceof Array) {
    //     let returnArr = [];
    //     let tempArr = [];
    //     let tempMap = new Map();
    //     data.forEach((item) => {
    //         try {
    //             tempArr.push(item["time"]);
    //             tempMap.set(item["time"], item);
    //         } catch (e) {
    //             printInfo(e, MessageLevel.ERROR);
    //         }
    //     });
    //
    //     tempArr.sort((num1, num2) => {
    //         let iNum1 = parseInt(num1);
    //         let iNum2 = parseInt(num2);
    //         if (iNum1 > iNum2) {
    //             return 1;
    //         } else if (iNum1 < iNum2) {
    //             return -1
    //         } else {
    //             return 0;
    //         }
    //
    //         tempArr.forEach(function (item) {
    //             returnArr.push(tempMap.get(item))
    //         });
    //
    //     });
    //     return returnArr;
    // }
    //
    // return null;
}

/**
 * 将信息存储至缓存
 * @param data 待存储学习
 */
let storageToCookie = function (key, data) {

    if (null == data) {
        return;
    }

    var expiresDate = new Date();
    expiresDate.setTime(expiresDate.getTime() + (60 * 60 * 8000));

    let cookie = $.cookie(key) ? JSON.parse($.cookie(key)) : [];
    $.cookie(key, JSON.stringify(cookie.concat(data)), {expires: expiresDate, path: '/', domain: domain_url});
    // setTimeout(function(){
    //     loadHistoryMessageList(data[0]['target'])
    // },500)

}

/**
 * 存储接收的信息
 * @param client
 * @param data
 */
let storageReceiveMessage = function (client, data) {
    storageToCookie(COOKIE_RECEIVE_MESSAGE_KEY + "_" + USER_NAME + "_" + client, arraySort(data));
}

/**
 * 存储客户端发送的消息
 * @param client
 * @param data
 */
let storageSendMessage = function (client, data) {
    storageToCookie(COOKIE_SEND_MESSAGE_KEY + "_" + USER_NAME + "_" + client, arraySort(data));
}

/**
 * 加载历史记录
 * @param client
 */
//聊天记录滚动顶部加载事件
let scrollGetList = function (page, mes) {
    var t = 0;
    var p = 0;
    var bool = true;

    $(".dialogWrap").unbind('scroll').scroll(function (e) {
        t = $(this).scrollTop();
        if (p >= t) {//console.log("向上");
            if (t < 50 && bool) {
                if (mes == 'notMess') {
                    loadHistoryNotReadMessageList(parseInt(page) + 1)
                } else if (mes == 'mess') {
                    loadHistoryMessageList(parseInt(page) + 1);//聊天记录请求数据，并插入到聊天窗口内容前面
                }
                bool = false;
            }
        } else {//console.log("向下")
        }
        setTimeout(function () {
            p = t
        }, 0)
    });
};
let loadHistoryMessageList = function (page) {

    // $(".dialogWrap").empty();

    $.ajax({
        type: "GET",
        url: "//im.shcvs.cn/api/getHistoryPageById",
        data: {
            'sourceClient': get_querystr("userId"),
            'targetClient': get_querystr("otherId"),
            'page': page,
            'pageSize': 10
        },
        beforeSend: function (XMLHttpRequest) {
        },
        success: function (data) {
            console.log(data);
            if (data) {
                var datas = data.data;
                for (var i = 0; i < datas.length; i++) {
                    var createdDate = datas[i].createdDate;
                    var id = datas[i].id;
                    var messageContent = datas[i].messageContent;
                    var messageCreatedDate = datas[i].messageCreatedDate;
                    var sourceClient = datas[i].sourceClient;
                    var targetClient = datas[i].targetClient;
                    var mineClient = get_querystr("userId");

                    if (targetClient !== mineClient) {
                        //callSpecialMess
                        if (sourceClient.indexOf('#') !== -1 && messageContent.length > 0) {
                            var tsMsgLeft = [];
                            tsMsgLeft["message"] = messageContent;
                            callSpecialMess(tsMsgLeft, 1);
                        } else {
                            callMess(messageContent, 1)
                        }
                    } else {
                        if (sourceClient.indexOf('#') !== -1 && messageContent.length > 0) {
                            var tsMsg = [];
                            tsMsg["message"] = messageContent;
                            receiveSpecialMess(tsMsg, 1);
                        } else {
                            receiveMess(sourceClient, messageContent, 1);
                        }

                    }

                }
                if (datas.length > 0) {
                    scrollGetList(page, 'mess');
                    $(".dialogWrap").animate({scrollTop: '60px'}, 500);
                    $(".scrollTxt").remove();
                } else {
                    $(".dialogWrap").prepend('<p class="scrollTxt" style="font-size:16px;line-height:50px;text-align:center;">没有内容了！</p>')
                }
            }
            // if(!scrollBool){
            //     listScrollTo();
            //     scrollBool=true
            // }

        },
        error: function () {
            console.log('失败')
        }

    });

    // let sendArr = ($.cookie(COOKIE_SEND_MESSAGE_KEY + "_" + USER_NAME + "_" + client) != undefined) ?
    //     JSON.parse($.cookie(COOKIE_SEND_MESSAGE_KEY + "_" + USER_NAME + "_" + client)) : [];
    // let receiveArr = ($.cookie(COOKIE_RECEIVE_MESSAGE_KEY + "_" + USER_NAME + "_" + client) != undefined) ?
    //     JSON.parse($.cookie(COOKIE_RECEIVE_MESSAGE_KEY + "_" + USER_NAME + "_" + client)) : [];
    //
    // let sendLength = sendArr.length;
    // let receiveLength = receiveArr.length;
    //
    // let i, j;
    // for (i = 0, j = 0; i < sendLength && j < receiveLength;) {
    //     let sendItem = sendArr[i];
    //     let receiveItem = receiveArr[j];
    //
    //     if (sendItem["time"] < receiveItem["time"]) {
    //         let html = filterXSS(sendItem["message"], options);
    //         callMess(html);//发送成功保存显示内容obj
    //         i++;
    //     } else {
    //         j++;
    //         receiveMess(receiveItem["source"], receiveItem["message"]);
    //     }
    // }
    //
    // if (i === sendLength) {
    //     for (; j < receiveLength; j++) {
    //         let receiveItem = receiveArr[j];
    //         receiveMess(receiveItem["source"], receiveItem["message"]);
    //     }
    // } else if (j === receiveLength) {
    //     for (; i < sendLength; i++) {
    //         let sendItem = sendArr[i];
    //         let html = filterXSS(sendItem["message"], options);
    //         callMess(html);//发送成功保存显示内容obj
    //     }
    // }

}

let loadHistoryNotReadMessageList = function (page) {

    // $(".dialogWrap").empty();

    $.ajax({
        type: "GET",
        url: "//im.shcvs.cn/api/getNotReadHistoryPageById",
        data: {
            'sourceClient': get_querystr("userId"),
            'targetClient': get_querystr("otherId"),
            'page': page,
            'pageSize': 10
        },
        success: function (data) {
            console.log(data);
            if (data) {
                var datas = data.data;
                if (datas.length > 0) {
                    for (var i = 0; i < datas.length; i++) {
                        var createdDate = datas[i].createdDate;
                        var id = datas[i].id;
                        var messageContent = datas[i].messageContent;
                        var messageCreatedDate = datas[i].messageCreatedDate;
                        var sourceClient = datas[i].sourceClient;
                        var targetClient = datas[i].targetClient;
                        var mineClient = get_querystr("userId");

                        if (targetClient !== mineClient) {
                            if (sourceClient.indexOf('#') !== -1 && messageContent.length > 0) {
                                var tsMsgLeft = [];
                                tsMsgLeft["message"] = messageContent;
                                callSpecialMess(tsMsgLeft, 1);
                            } else {
                                callMess(messageContent, 1)
                            }
                        } else {
                            if (sourceClient.indexOf('#') !== -1 && messageContent.length > 0) {
                                var tsMsg = [];
                                tsMsg["message"] = messageContent;
                                receiveSpecialMess(tsMsg);
                            } else {
                                receiveMess(targetClient, messageContent, 1)
                            }
                        }

                    }

                    var scrollNotHeight = $(".dialogWrap")[0].scrollHeight;
                    var notHeight = $(".dialogWrap").outerHeight();
                    console.log(scrollNotHeight)
                    console.log(notHeight)

                    if (scrollNotHeight <= notHeight) {
                        if (datas.length > 10) {
                            loadHistoryNotReadMessageList(parseInt(page + 1))
                        }
                        if (datas.length < 10) {
                            $(".dialogWrap").prepend('<p class="scrolloadBut" style="font-size:16px;line-height:50px;text-align:center;color:blue">加载聊天记录</p>')
                            setTimeout(function () {
                                $('.scrolloadBut').unbind('click').click(function () {
                                    $(this).remove();
                                    loadHistoryMessageList(1)
                                })
                            }, 500)
                        }
                    } else {
                        scrollGetList(page, 'notMess');
                        if (!scrollBool) {
                            listScrollTo();
                            scrollBool = true
                        }
                    }
                } else {
                    loadHistoryMessageList(1)
                }
            }
        },
        error: function () {
            console.log('失败')
        }

    });
}


function get_querystr(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return (r[2]);
    return null;
}

function getUserInfo(id) {
    if (id == undefined) {
        return;
    }
    let users = id.split(":");
    let token = $.cookie('token');
    let res = {};
    if (users[0] == 'userId') {
        $.ajax({
            url: base_url + '/html5/v1/user/findPrjvUserInfo',
            type: "post",
            dataType: "json",
            headers: {'token': token},
            data: JSON.stringify({"userId": users[1]}),
            async: false,
            contentType: "application/json",
            success: function (resp) {
                if (resp.code == 0) {
                    itemAdd(id);
                    let imgHead = resp.data.userHeadImg;
                    if (imgHead == '') {
                        imgHead = "images/gysh.png";
                    }
                    res["headerUrl"] = imgHead;
                    res["nickName"] = resp.data.userCertUserName;
                } else {
                    alert("未知错误！");
                }
            }
        });
    } else if (users[0] == 'prjvOrgId') {
        $.ajax({
            url: base_url + '/html5/v1/orgPlace/queryOrgByPrjvOrgId',
            type: "post",
            dataType: "json",
            headers: {'token': token},
            data: JSON.stringify({"prjvOrgId": users[1]}),
            async: false,
            contentType: "application/json",
            success: function (resp) {
                if (resp.code == 0) {
                    itemAdd(id);
                    let imgHead = resp.data.logo;
                    if (imgHead == '') {
                        imgHead = "images/gysh.png";
                    }
                    res["headerUrl"] = imgHead;
                    res["nickName"] = resp.data.name;
                } else {
                    alert("未知错误！");
                }
            }
        });
    } else {
        return;
    }
    return res;
}
