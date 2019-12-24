$(document).ready(function () {
    let cpanel = Cpanel();
    init();
    cpanel.api_get_station_by_id(function (data) {
        if (data.errorcode === 0) {
            $('#station_name').html(data.data.station_name);
            $('#three_level_id').html(data.data.three_level_id);
            $('#create_date').html(data.data.create_date.replace(/^(.*?)T(.*?)\..*?$/i, "$1 $2"));
            let groupId = data.data.groupId;
            let json = '{\n' +
                '  "prjvOrgId": ' + data.data.three_level_id + ',\n' +
                '  "pageNumber": 1,\n' +
                '  "pageSize": 5\n' +
                '}';

            $.ajax({
                "url": API_BASE_URL_XS + "html5/v1/orgPlace/queryMembersForVerify",
                "type": "post",
                // "dataType" : "json",
                "contentType": "application/json;charset=utf-8;",
                "data": json,
                success: function (res) {
                    if (res.code === 0) {
                        let data = res.data.records;
                        if (data.length <= 0) {
                            $(".pageListWrap").html("");
                            return;
                        }
                        let html = '';
                        for (let i = 0; i < data.length; i++) {

                            cpanel.get_reporter_by_ids(function (data1) {
                                if (data1.errorcode === 0) {
                                    let report = data1.data;
                                    if (report != null) {
                                        let auditflag = report.auditFlag;
                                        if (auditflag == 0) {
                                            html += '<div class="pageList">\n' +
                                                '                <div class="pageSpace"><div class="pageSpace" style="background-image:url(\'images/smile_64.png\');width:.3rem;height:.3rem;margin-right:.1rem;vertical-align:middle"></div><span style="display: inline-block;vertical-align:middle">' + data[i].realName + '</span></div>\n' +
                                                '                <div class="pageSpace">审核中...</div>\n' +
                                                '            </div>';
                                        } else {
                                            html += '<div class="pageList">\n' +
                                                '                <div class="pageSpace"><div class="pageSpace" style="background-image:url(\'images/smile_64.png\');width:.3rem;height:.3rem;margin-right:.1rem;vertical-align:middle"></div><span style="display: inline-block;vertical-align:middle">' + data[i].realName + '</span></div>\n' +
                                                '                <div class="pageSpace">已是小记者</div>\n' +
                                                '            </div>';
                                        }
                                    } else {
                                        html += '<div class="pageList">\n' +
                                            '                <div class="pageSpace"><div class="pageSpace" style="background-image:url(\'images/smile_64.png\');width:.3rem;height:.3rem;margin-right:.1rem;vertical-align:middle"></div><span style="display: inline-block;vertical-align:middle">' + data[i].realName + '</span></div>\n' +
                                            '                <div class="pageSpace" id="add_reporter" data-repid="' + data[i].prjvUserId + '" data-repname="' + data[i].realName + '" data-stationid="' + data[i].prjvOrgId + '"><button>申请记者</button></div>\n' +
                                            '            </div>';
                                    }
                                    $(".pageListWrap").html(html);

                                    // $("#add_reporter").click(function () {

                                } else {
                                    alert("失败");
                                }
                            }, data[i].prjvUserId);
                        }
                    } else {
                        alert(res.msg);
                    }
                },
            });
        } else {
            alert(data.data);
        }
    }, get_station_id());

    $('.pageListWrap').on("click", "#add_reporter", function () {
        cpanel.api_post_add_reporter(function (data) {
            if (data.errorcode === 0) {
                location.reload();
            } else {
                alert("申请失败");
            }
        }, $(this).attr("data-repid"), $(this).attr("data-repname"), "", $(this).attr("data-repname"), $(this).attr("data-repid"), get_station_id(), "2099-12-31", 0);
    });
});