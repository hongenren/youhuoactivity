$(document).ready(function () {
    let cpanel = Cpanel();
    init();
    cpanel.api_get_station_list(function (data) {
        if (data.errorcode === 0) {
            var station = data.data[0];
            if (station.auditFlag == 200) {
                document.location.href = "mobile_page.html?station_id="+ data.data[0].id;
            }
        } else {
            alert("请求失败");
        }
    }, get_station_id(), "",1,1);
});