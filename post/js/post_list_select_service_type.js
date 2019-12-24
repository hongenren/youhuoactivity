
function queryOrgServiceObjects(){
    $.ajax({
        url: base_url+'/html5/v1/orgPlace/queryOrgServiceObjects',//服务对象
        type: "post",
        dataType: "json",
        data: "{}",
        headers: {'Content-Type': 'application/json'},
        success: function (resp) {
            if (resp.code == 0) {
                var Objects = resp.data.data;
                var html = "";
                for(var z in Objects){
                    var class_ = "no_selectedSpen";
                    if(serverTargets.indexOf(Objects[z].code)>-1){
                        class_ = "selectedSpen";
                    }
                    html += '<li style="border-bottom: 0px;padding: 2% 3%;width: 33.3%;"><span onclick="selectedSpan(this,\''+Objects[z].code+'\')" class="'+class_+'">'+Objects[z].name+'</span></li>';
                }
                html += '<li id="button-div" style="margin-top: 3%">\n' +
        '                    <input type="button" value="取消" onclick="window.history.back(-1);" style="background-color: #72B81E;color: #ffffff;"/>\n' +
        '                    <input type="button" value="确定" onclick="selectService();" style="margin-left: 20%;"/>\n' +
    '                    </li>';
                $(".serverTarget_ul").html(html);
            }
        }
    });
}
var serverTargets = "", serverTargetNames = "", serverTargetum = 0;
function selectedSpan(obj, val){
    if($(obj).hasClass('selectedSpen')) {
        serverTargetum -= 1;
        $(obj).addClass('no_selectedSpen');
        $(obj).removeClass('selectedSpen');
        serverTargets = serverTargets.replace(val+",","");
        serverTargetNames = serverTargetNames.replace($(obj).html()+",","");
    }else{
        serverTargetum += 1;
        $(obj).addClass('selectedSpen');
        $(obj).removeClass('no_selectedSpen');
        serverTargets += val+","
        serverTargetNames += $(obj).html()+","
    }
}
function selectService(){
    $(".type").show();
    if(serverTargetum>3){
        layer.open({
            content: '最多可选择3条服务对象！'
            ,skin: 'msg'
            ,time: 1
        });
        return false;
    }
    if(serverTargetum==0){
        layer.open({
            content: '最少选择1条服务对象！'
            ,skin: 'msg'
            ,time: 1
        });
        return false;
    }
        if(select_type==0){
            queryPostByDay(0,20);
        }else if(select_type==1){
            queryPostByAdCode(0, 20);
        }else if(select_type==2){
            queryPostByTargetService(0,20);
        }
}
