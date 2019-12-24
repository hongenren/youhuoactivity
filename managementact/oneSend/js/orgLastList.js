$(function () {
    getList()

    function getList() {
        var expiresDate = new Date();
        expiresDate.setTime(expiresDate.getTime() + (60 * 60 * 8000));
        var notRadList = getNotList();
        var readList = getLastList();
        // var getCookieNotread = JSON.parse($.cookie('not_read_num'));
        var getCookieNotread = $.cookie('not_read_num');
        var res = [];
        var setCookieNotRead = [];
        if (getCookieNotread == undefined || getCookieNotread == "" || getCookieNotread == null || $.isEmptyObject(getCookieNotread)) {
            for (var i in notRadList) {
                setCookieNotRead.push(notRadList[i].user);
                res.push(notRadList[i]);
            }
        } else {
            var json = JSON.parse(getCookieNotread);
            for (var i in notRadList) {
                setCookieNotRead.push(notRadList[i].user);
                res.push(notRadList[i]);
            }
            for (var j in json) {
                setCookieNotRead.push(json[j]);
            }
            setCookieNotRead = qc(setCookieNotRead);
            console.log("去重之后：" + setCookieNotRead);
        }
        var userdata = JSON.stringify(setCookieNotRead);
        $.cookie('not_read_num', userdata, {expires: expiresDate, path: '/', domain: domain_url});
        // $.cookie('not_read_num', userdata, {expires: expiresDate, path: '/', domain: "localhost"});
        for (var i in readList) {
            // console.log(readList[i]);
            res.push(readList[i]);
        }
        console.log(res);
        var html = "";
        var endRes = uniqueRes(res);
        var user_msg = JSON.parse($.cookie('user_msg'));
        var uid = "prjvOrgId:" + user_msg.prjvOrgId;
        var cookieNotread = JSON.parse($.cookie('not_read_num'));
        for (var i in endRes) {
            var u;
            if (endRes[i].user.indexOf(":") == -1) {
                return;
            }
            var users = endRes[i].user.split(":");
            if (users[0] == '#special#prjvOrgId') {
                u = "prjvOrgId:" + users[1];
            } else if (users[0] == '#special#userId') {
                u = "userId:" + users[1];
            } else {
                u = endRes[i].user;
            }
            if (cookieNotread.length != 0) {

                html += "<div class=\"shortInforList clearfix\">\n" +
                    "<a href='" + COMMON_ADDR + "im/index.html?userId=" + uid + "&otherId=" + u + "'>  \n" +
                    "                    <div class=\"shortInforLeft\">\n" +
                    "                        <div class=\"shortInforImg\" style=\"background-image:url('" + endRes[i].headerUrl + "')\">";
                for (var j in cookieNotread) {
                    if (endRes[i].user == cookieNotread[j]) {
                        html += "<i></i>\n";
                    }
                }
                html += "</div>\n" +
                    "                    </div>\n" +
                    "                    <div class=\"shortInforListTxt\">\n" +
                    "                        <h2>" + endRes[i].nickName + "</h2>\n" +
                    "                        <p>" + endRes[i].msg.substring(0, 5) + "</p>\n" +
                    "                    <div class=\"shortInforRight\">" + endRes[i].time + "</div>\n" +
                    "                    </div>\n" +

                    "</a>  \n" +
                    "                </div>";

                $(".shortInforListWrap").html(html);
            } else {
                html += "<div class=\"shortInforList clearfix\">\n" +
                    "<a href='" + COMMON_ADDR + "im/index.html?userId=" + uid + "&otherId=" + u + "'>  \n" +
                    "                    <div class=\"shortInforLeft\">\n" +
                    "                        <div class=\"shortInforImg\" style=\"background-image:url('" + endRes[i].headerUrl + "')\">";
                html += "</div>\n" +
                    "                    </div>\n" +
                    "                    <div class=\"shortInforListTxt\">\n" +
                    "                        <h2>" + endRes[i].nickName + "</h2>\n" +
                    "                        <p>" + endRes[i].msg.substring(0, 5) + "</p>\n" +
                    "                    <div class=\"shortInforRight\">" + endRes[i].time + "</div>\n" +
                    "                    </div>\n" +

                    "</a>  \n" +
                    "                </div>";
                $(".shortInforListWrap").html(html);
            }
        }
    }

    function getLastList() {
        var user_msg = JSON.parse($.cookie('user_msg'));
        var uid = "prjvOrgId:" + user_msg.prjvOrgId;
        var r = {};
        $.ajax({
            url: '//im.shcvs.cn/api/getRecentContacts',
            type: "post",
            dataType: "json",
            async: false,
            data: {
                "targetClient": uid
            },
            success: function (resp) {
                if (resp.success == true) {
                    var html = "";
                    var list = resp.data;
                    var res = unique(list);
                    // console.log(res);
                    var retList = {};
                    for (var i in res) {
                        var uInfo = getUserInfo(res[i]);
                        if (uInfo == undefined || uInfo == "" || uInfo == null || $.isEmptyObject(uInfo)) {
                            continue;
                        }
                        retList[i] = uInfo;
                        // console.log(uInfo);
                        // html += "<div class=\"shortInforList clearfix\">\n" +
                        //     "<a href='../../im/index.html?userId="+uid+"&otherId="+uInfo["user"]+"'>  \n"+
                        //     "                    <div class=\"shortInforLeft\">\n" +
                        //     "                        <div class=\"shortInforImg\" style=\"background-image:url('" + uInfo["headerUrl"] + "')\"></div>\n" +
                        //     "                    </div>\n" +
                        //     "                    <div class=\"shortInforLeft shortInforListTxt\">\n" +
                        //     "                        <h2>" + uInfo["nickName"] + "</h2>\n" +
                        //     "                        <p>" + uInfo["msg"] + "</p>\n" +
                        //     "                    </div>\n" +
                        //     "                    <div class=\"shortInforRight\">" + uInfo["time"] + "</div>\n" +
                        //     "</a>  \n"+
                        //     "                </div>";
                    }
                    console.log(retList);
                    r = retList;
                    // $("#lastRead").html(html);
                } else {
                    alert("数据加载失败！");
                }
            }
        });
        return r;
    }

    function getNotList() {
        var user_msg = JSON.parse($.cookie('user_msg'));
        var uid = "prjvOrgId:" + user_msg.prjvOrgId;
        var r = {};
        $.ajax({
            url: '//im.shcvs.cn/api/getNotReadByTargetClient',
            type: "post",
            dataType: "json",
            async: false,
            data: {
                "targetClient": uid
            },
            success: function (resp) {
                if (resp.success == true) {
                    var html = "";
                    var list = resp.data;
                    var res = unique(list);
                    // console.log(res);
                    var retList = {};
                    for (var i in res) {
                        var uInfo = getUserInfo(res[i]);
                        if (uInfo == undefined || uInfo == "" || uInfo == null || $.isEmptyObject(uInfo)) {
                            continue;
                        }
                        // console.log(uInfo);
                        retList[i] = uInfo;
                        // html += "<div class=\"shortInforList clearfix\">\n" +
                        //     "                    <div class=\"shortInforLeft\">\n" +
                        //     "                        <div class=\"shortInforImg\" style=\"background-image:url('" + uInfo["headerUrl"] + "')\"></div>\n" +
                        //     "                    </div>\n" +
                        //     "                    <div class=\"shortInforLeft shortInforListTxt\">\n" +
                        //     "                        <h2>" + uInfo["nickName"] + "</h2>\n" +
                        //     "                        <p>" + uInfo["msg"] + "</p>\n" +
                        //     "                    </div>\n" +
                        //     "                    <div class=\"shortInforRight\">" + uInfo["time"] + "</div>\n" +
                        //     "                </div>";
                    }
                    console.log(retList);
                    r = retList;
                    // $("#notRead").html(html);
                } else {
                    alert("数据加载失败！");
                }
            }
        });
        return r;
    }

    function qc(array) {
        var temp = []; //一个新的临时数组
        for (var i = 0; i < array.length; i++) {
            if (temp.indexOf(array[i]) == -1) {
                temp.push(array[i]);
            }
        }
        return temp;
    }

    function unique(array) {
        let temp = {};
        for (let i = 0; i < array.length; i++) {
            if (temp[array[i]["sourceClient"]] == undefined) {
                temp[array[i]["sourceClient"]] = array[i];
            }
        }
        return temp;
    }

    function uniqueRes(array) {
        let temp = {};
        for (let i = 0; i < array.length; i++) {
            if (temp[array[i]["user"]] == undefined) {
                temp[array[i]["user"]] = array[i];
            }
        }
        return temp;
    }

    function getUserInfo(obj) {
        let id = obj["sourceClient"];
        if (id.indexOf(":") == -1) {
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
                        let imgHead = resp.data.userHeadImg;
                        if (imgHead == '') {
                            imgHead = "images/gysh.png";
                        }
                        res["headerUrl"] = imgHead;
                        res["nickName"] = resp.data.userCertUserName;
                        res["user"] = id;
                        res["msg"] = obj["messageContent"];
                        res["time"] = obj["messageCreatedDate"];
                    } else {
                        // alert("未知错误！");
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
                        let imgHead = resp.data.imgs;
                        if (imgHead == '') {
                            imgHead = "images/gysh.png";
                        }
                        res["headerUrl"] = imgHead;
                        res["nickName"] = resp.data.name;
                        res["user"] = id;
                        res["msg"] = obj["messageContent"];
                        res["time"] = obj["messageCreatedDate"];
                    } else {
                        // alert("未知错误！");
                    }
                }
            });
        } else if (users[0] == '#special#userId') {
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
                        let imgHead = resp.data.userHeadImg;
                        if (imgHead == '') {
                            imgHead = "images/gysh.png";
                        }
                        res["headerUrl"] = imgHead;
                        res["nickName"] = resp.data.userCertUserName;
                        res["user"] = id;
                        res["msg"] = obj["messageContent"];
                        res["time"] = obj["messageCreatedDate"];
                    } else {
                        // alert("未知错误！");
                    }
                }
            });
        } else if (users[0] == '#special#prjvOrgId') {
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
                        let imgHead = resp.data.imgs;
                        if (imgHead == '') {
                            imgHead = "images/gysh.png";
                        }
                        res["headerUrl"] = imgHead;
                        res["nickName"] = resp.data.name;
                        res["user"] = id;
                        res["msg"] = obj["messageContent"];
                        res["time"] = obj["messageCreatedDate"];
                    } else {
                        // alert("未知错误！");
                    }
                }
            });
        } else {
            return;
        }
        return res;
    }
});