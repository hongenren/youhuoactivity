$(document).ready(function () {
    let cpanel = Cpanel();
    init();
    cpanel.api_get_station_list_by_three_id(function (data) {
        if (data.errorcode === 0) {
            var station = data.data;
            if (station != '' && station != null && station != undefined) {
                document.location.href = "mobile_examine.html?station_id=" + station.id;
            }
        } else {
            alert("请求失败");
        }
    }, get_three_level_id());
    $(".columnBut").click(function () {
        cpanel.api_post_add_station(function (data) {
            if (data.errorcode === 0) {
                let userMsg = decodeURI(get_token_msg());
                let uid = userMsg.parseJSON()[0];
                cpanel.api_post_add_reporter(function (data) {
                    if (data.errorcode === 0) {
                        location.reload();
                    } else {
                        alert("申请失败");
                    }
                }, uid, userMsg[2], "", userMsg[2], uid, get_station_id(), "2099-12-31", 1);
                document.location.href = "mobile_examine.html?station_id=" + data.data.stationId;
            } else {
                document.location.href = "mobile_examine.html?station_id=" + data.data.id;
            }
        }, get_three_level_id(), getQueryString('station_name'), getQueryString('area'));
    });

});