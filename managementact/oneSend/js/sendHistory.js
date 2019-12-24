$(function () {
    getList();
    function getList() {
        var user_msg = JSON.parse($.cookie('user_msg'));
        var uid = "prjvOrgId:" + user_msg.prjvOrgId;
        $.ajax({
            url: '//im.shcvs.cn/api/getRecentContacts',
            type: "post",
            dataType: "json",
            data: {
                "targetClient":uid,
                "page": 1,
                "pageSize": 10
            },
            success: function (resp) {
                if (resp.success == true) {
                    var html  = "<div class=\"sendContTitle\"><i></i><span>发送历史</span></div>";
                    var list = resp.data;
                    for (var i in list) {
                        html += "<div class=\"sendContList\">\n" +
                            "            <div class=\"sendContListTop\">\n" +
                            "                <div class=\"sendContListInfo\"><span>发送至：</span><span></span><span>"+list[i].sourceClient+"</span></div>\n" +
                            "                <div class=\"sendContListTime\"><span>"+list[i].messageCreatedDate +"</span><i></i></div>\n" +
                            "            </div>\n" +
                            "            <div class=\"sendContListTxt\">\n"+
                            "                   "+list[i].messageContent+"\n"+
                            "            </div>\n" +
                            "        </div>";
                    }
                    $(".sendHistoryContent").html(html);
                } else {
                    alert("数据加载失败！");
                }
            }
        });
    }
});