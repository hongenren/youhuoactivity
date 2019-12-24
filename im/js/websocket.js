const options = {whiteList: optionlist()};
let ws = null, currentClientId = "", obj = {}, messageList = {}, isLoadHistory = false;
let trTemplate = '<div class="useList" id="#id"><i style="background-image:url(\'#imgUrl\')"></i><b>#clientId</b></div>';

/**
 * 连接时发送
 * @param e
 */
let openConnection = function (e) {
    setInterval(reconnect, 30 * 1000);
    sendLoginMessage();
};

function reconnect() {
    let obj = {
        message: "心跳",
        type: "heartbeat"
    };
    ws.send(JSON.stringify(obj));
}

/**
 * 接收处理
 * 可在
 * @param e
 */
let receiveMessage = function (e) {
    printInfo(JSON.parse(e.data));
    distribute(JSON.parse(e.data));
};

/**
 * 分发信息
 * @param datas
 */
let distribute = function (datas) {
    let code = datas["code"];
    let data = datas["data"];
    let message = datas["message"];

    switch (code) {
        case ReturnCode.CONNECT_SUCCESS://连接成功
            // displayOtherClient(data["clientId"], data["otherClients"]);
            break;
        case ReturnCode.NOTICE_MESSAGE://连接成功
            noticeMessage(data);
            break;
        case ReturnCode.SUCCESS://发送成功返回
            dialog(datas);
            break;
        case ReturnCode.UNKNOWN_ERROR:
            break;
        case ReturnCode.MESSAGE_IS_NONE:
            break;
        case ReturnCode.TARGET_CLIENT_IS_NONE:
            break;
        case ReturnCode.INCOMPLETE_PARAMETERS:
            break;
        // case ReturnCode.ADD_CLIENT://新增用户
        //     addClient(data["clientId"]);
        //     break;
        // case ReturnCode.DELETE_CLIENT://删除用户
        //     deleteClient(data["clientId"]);
        //     break;
        case ReturnCode.RECEIVE_MESSAGE://接收消息
            receiveOtherMessage(data);
            break;
        case ReturnCode.SPECIAL_MESSAGE://特殊消息消息
            receiveOtherMessage(data);
            var obj = JSON.parse(data.message);
            console.log("转换:" + obj.content);
            break;
        case ReturnCode.NOT_READ_MESSAGE://接收消息
            // notReadList(data);
            outputMessageNotRead(data);
            // alert("未读");
            break;
    }
};
let outputMessageNotRead = function (data) {
    for (let i = 0; i < data["messages"].length; i++) {
        let source = data["messages"][i]["sourceClient"];
        if (source !== get_querystr("otherId")) {
            continue;
        }
        // if (messageList[source] == undefined) {
        //     messageList[source] = [];
        // }
        // messageList[source].push(data);
        let id = get_querystr("otherId");
        let obj = {
            time: new Date().getTime(),
            message: data["messages"][i]["messageContent"],
            target: id,
            source: data["messages"][i]["sourceClient"]
        }
        // setTimeout(storageReceiveMessage(id, [obj]), 1000);
        receiveMess(get_querystr("otherId"), data["messages"][i]["messageContent"]);
    }
    listScrollTo();
};

/**
 * 发送登录信息
 */
let sendLoginMessage = function () {
    $(".trl01").text('');//提示信息
    let loginInfo = {
        // clientId: uuid(32),
        clientId: USER_NAME,
        type: "connect"
    };
    ws.send(JSON.stringify(loginInfo));
};

/**
 * 显示所有用户，以列表形式
 * @param {*} clientId
 * @param {*} otherClient
 */
let displayOtherClient = function (clientId, otherClient) {
    currentClientId = clientId;
    let length = otherClient.length;
    let html = "";
    for (let i = 0; i < length; i++) {
        let item = otherClient[i];
        if (clientId == item) {
            continue;//下一步
        }
        let res = getUserInfo(item);
        if (res == undefined || res == '' || res == null) {
            continue;
        }
        html += trTemplate.replace("#id", item).replace("#imgUrl", res["headerUrl"]).replace("#clientId", res["nickName"]);
        // html += trTemplate.replace("#id", item).replace("#clientId", item);
    }
    $(".userWrap").html(html);
};

//未读列表

/**
 * 当有用户上线触发
 * @param {*} otherClient
 */
// let addClient = function (otherClient) {
//     let html ="";
//     let res = getUserInfo(otherClient);
//     if(res != undefined || res != '' || res != null){
//         // itemAdd(otherClient);
//         html += trTemplate.replace("#id", otherClient).replace("#imgUrl", res["headerUrl"]).replace("#clientId", res["nickName"]);;
//         // itemAdd(otherClient);//新增obj内容
//         if (currentClientId == otherClient) {
//             return;
//         }
//         $(".userWrap").append(html);
//     }
// };

/**
 * 当用户离线时触发
 * @param {} otherClient
 */
let deleteClient = function (otherClient) {
    $("#" + otherClient).remove();

    itemRemove(otherClient);//删除obj内容
};

/**
 * 接收其他客户端信息
 * @param {*} data
 */
let receiveOtherMessage = function (data) {
    let source = data["source"];
    if(data["source"].indexOf("#")!==-1){
        source=data["source"].substring(parseInt(data["source"].lastIndexOf("#"))+1,data["source"].length)
    }
    if (source !== get_querystr("otherId") ) {
        return;
    }
    // if (messageList[source] == undefined) {
    //     messageList[source] = [];
    // }
    // messageList[source].push(data);
    // let id = get_querystr("otherId");
    let id = get_querystr("otherId");
    let obj = {
        time: new Date().getTime(),
        message: data["message"],
        target: id,
        source: data["source"]
    }
    // setTimeout(storageReceiveMessage(id, [obj]), 1000);
    if(data['source'].indexOf('#')!==-1&&data['message'].length>0){
        receiveSpecialMess(data)
    }else{
        receiveMess(get_querystr("otherId"), data["message"]);
    }
    listScrollTo();
};

/**
 * 接收服务端通知类消息
 * @param data
 */
let noticeMessage = function (data) {
    printInfo(data);
}

/**
 * 发送成功显示
 */
let dialog = function (data) {
    let code = data['code'];
    let message = $("#editor").html();
    let html = filterXSS(message, options);

    if (message !== "") {
        let id = get_querystr("otherId");
        let obj = {
            time: new Date().getTime(),
            message: message,
            target: id
        }
        // setTimeout(storageSendMessage(id, [obj]), 1000);
    }

    callMess(html);//发送成功保存显示内容obj
    listScrollTo()
};

/**
 * 注册事件
 */
let registerEvent = function () {

    //用户列表点击事件
    // $(document).on('click', '.useList', function () {
    preseMessHtml();//切换列表时不为空则保存内容obj
    //<i style="background-image:url('images/gysh.png')"></i><b>测试742</b>
    var res = USER_INFO[get_querystr("otherId")];
    if (res == undefined || res == "" || res == null) {
        alert("用户id出错！");
        return
    }
    let html = "<i style=\"background-image:url('" + res["headerUrl"] + "')\"></i><b>" + res["nickName"] + "</b>";
    $('.useList').removeClass('active');
    $(this).addClass('active').removeClass('on');
    $(".togUse").html(html).attr("data-id", get_querystr("otherId"));
    //displayMessHtml(get_querystr("otherId"));//obj不为空则显示内容
    $(".userWrap").slideUp();
    if (!isLoadHistory) {
        isLoadHistory = !isLoadHistory;
        loadHistoryNotReadMessageList(1);
    }
    autoHeightEvent();
    // });

    // 打开页面时，填写用户名称弹出框


    //发送事件
    $(".btn").click(function () {
        socketSend();
    });

    $("#editor").keyup(function (e) {
        if (e.ctrlKey && e.which == 13) {
            socketSend()
        }
    });

    function socketSend() {
        let targetClient = $(".togUse").attr("data-id");
        let message = $("#editor").html();
        let html = filterXSS(message, options);
        if (message == '' || message == null || message == undefined) {
            return;
        }
        if (targetClient == '' || targetClient == null || targetClient == undefined) {
            $(".trl01").text('请选择发送对象');
            return;
        } else {
            $(".trl01").text('');
        }

        let obj = {
            targetClient: targetClient,
//            message: LZString.compress(html),
            message: html,
            type: "sendMessage"
        };
        ws.send(JSON.stringify(obj));
    }

};

/**
 * 信息输出至页面
 * @param data
 */
let outputMessage = function (data) {
    let source = data["source"];
//    let message =  LZString.decompress(data["message"]);
    let message = data["message"];
    let html = filterXSS(message, options);

    var user = $(".useList[id='" + source + "']");

    if (user == null) {
        return;
    }

    let togUseId = $(".togUse").attr('data-id');
    let dialogHtml = $(".dialogWrap").html();
    if (togUseId !== source && dialogHtml !== '') {
        user.addClass('on');
    }
    if (dialogHtml == '') {
        let removeList = user.remove();
        $(".userWrap").prepend(removeList);

        let html = user.find('i').prop("outerHTML") + user.attr('id');
        $('.useList').removeClass('active');
        user.addClass('active');
        $(".togUse").html(html).attr("data-id", user.attr('id'));
    }

    receiveMess(source, html);//接收信息保存显示内容obj
}

/**
 * 调用此方法后，将原有信息列表复制一份并清空以便于后一阶段信息存储；
 */
let storageMessage = function () {
    let tempObject = messageList;
    messageList = {};

    for (let key in tempObject) {
        let tempMessageList = tempObject[key].slice();

        let tempArr = [];
        let tempMap = new Map();
        let cookieList = [];

        tempMessageList.forEach(function (item) {
            tempArr.push(item["time"]);
            tempMap.set(item["time"], item);
        });

        tempArr.sort((num1, num2) => {
            let iNum1 = parseInt(num1);
        let iNum2 = parseInt(num2);
        if (iNum1 > iNum2) {
            return 1;
        } else if (iNum1 < iNum2) {
            return -1
        } else {
            return 0;
        }
    })
        ;

        tempArr.forEach(function (item) {
            let mapItem = tempMap.get(item);
            outputMessage(mapItem);
            cookieList.push(mapItem);
        });

        if (tempArr.length > 0) {
            setTimeout(storageReceiveMessage(key, cookieList), 1000); // TODO 缺少用户id
        }
    }

}

$(document).ready(function () {
    function login() {
        USER_NAME = get_querystr("userId");
        if (null == ws) {
            ws = new WebSocket(WEBSOCKET_SERVER_HOST);
            ws.onopen = openConnection;
            ws.onmessage = receiveMessage;
            ws.onclose = function (e) {
                console.log("我掉线了！");
                ws = new WebSocket(WEBSOCKET_SERVER_HOST);
                ws.onopen = openConnection;
                ws.onmessage = receiveMessage;
            };
            ws.onbeforeunload = function (e) {

            };

            ws.onerror = function (e) {
                window.location.reload();
            };
            setInterval(storageMessage, 3000);
        }
    }

    function clearNotReadNum() {
        var getCookieNotread = $.cookie('not_read_num');
        if (getCookieNotread == undefined || getCookieNotread == "" || getCookieNotread == null || $.isEmptyObject(getCookieNotread)) {
            return;
        } else {
            var json = JSON.parse(getCookieNotread);
            for (var i in json) {
                if (json[i] == get_querystr("otherId")) {
                    json.splice(i, 1);
                }
            }
            var expiresDate = new Date();
            expiresDate.setTime(expiresDate.getTime() + (60 * 60 * 8000));
            var userdata = JSON.stringify(json);
            $.cookie('not_read_num', userdata, {expires: expiresDate, path: '/', domain: domain_url});
        }
    }

    function saveUserInfo() {
        var userInfo = getUserInfo(get_querystr("userId"));
        var otherUserInfo = getUserInfo(get_querystr("otherId"));
        USER_INFO[get_querystr("userId")] = userInfo;
        USER_INFO[get_querystr("otherId")] = otherUserInfo;
        console.log(USER_INFO);
    }

    login();
    saveUserInfo();
    registerEvent();//注册事件
    clearNotReadNum();
    // geiChatHistory();
});