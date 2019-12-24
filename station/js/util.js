let $_GET =[];
let get_now = function(){
    let date = new Date();
    let seperator1 = "-";
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    return year + seperator1 + month + seperator1 + strDate;
};
let init = function(){
    $("[list='list'] ul li").each(function(){
        let that=$(this);
        that.click(function(){
            that.toggleClass('on');
        })
    });
    $("[data-date='date-time']").each(function(){
        laydate.render({
            elem: '#' + $(this).attr("id") //指定元素
            ,type: 'datetime'
        });
    });
    $("[data-date='date']").each(function() {
        laydate.render({
            elem: '#' + $(this).attr("id") //指定元素
        });
    });
    function urlGet(){
        let aQuery = window.location.href.split("?");  //取得Get参数
        let aGET = [];
        if(aQuery.length > 1){
            let aBuf = aQuery[1].split("&");
            for(let i=0, iLoop = aBuf.length; i<iLoop; i++){
                let aTmp = aBuf[i].split("=");  //分离key与Value
                aTmp[1] = aTmp[1].split("#")[0];
                aGET[aTmp[0]] = aTmp[1];
            }
        }
        return aGET;
    }

    $_GET = urlGet();
};
function set_option(id, value){
    let selector = $("#" + id);
    selector.next(".alertlist").find("ul li").each(function(){
        if($(this).attr("data-option-value") === value.toString()){
            selector.val($(this).html());
            selector.attr("data-value", value);
        }
    });
}
function get_token_msg(){
    var search = "user_msg="//查询检索的值
    var returnvalue = "";//返回值
    if (document.cookie.length > 0) {
        sd = document.cookie.indexOf(search);
        if (sd!= -1) {
            sd += search.length;
            end = document.cookie.indexOf(";", sd);
            if (end == -1){
                end = document.cookie.length;
            }
            //unescape() 函数可对通过 escape() 编码的字符串进行解码。
            returnvalue=unescape(document.cookie.substring(sd, end))
        }else{
            alert("请登录");
            // window.location.href='http://h5.shcvs.cn/login/login.html';
        }
    }else{
        alert("请登录");
        // window.location.href='http://h5.shcvs.cn/login/login.html';
    }
    return returnvalue;
}
function get_for_id(){
    if($_GET["for_id"]){
        return $_GET["for_id"];
    }else{
        return '';
    }
}
function get_for_sub_id(){
    if($_GET["for_sub_id"]){
        return $_GET["for_sub_id"];
    }else{
        return '';
    }
}
function get_operator_id(){
    if($_GET["operator_id"]) {
        return $_GET["operator_id"];
    }else{
        return '';
    }
}
function get_three_level_id(){
    if($_GET["three_level_id"]) {
        return $_GET["three_level_id"];
    }else{
        return '';
    }
}
function get_station_id(){
    if($_GET["station_id"]) {
        return $_GET["station_id"];
    }else{
        return '';
    }
}
function get_station_name(){
    if($_GET["station_name"]) {
        return $_GET["station_name"];
    }else{
        return '';
    }
}
function get_area(){
    if($_GET["area"]) {
        return $_GET["area"];
    }else{
        return '';
    }
}
function get_tags(id){
    let tags = $("#" + id + ">ul>li.on");
    let tag_text = [];
    tags.each(function(){
        tag_text.push($(this).text());
    });
    current_tag = tag_text.join(';');
    return current_tag;
}
function set_tags(id, tag_list){
    let tags = tag_list.split(";");
    $("#" + id).find("ul li").each(function(){
        for(let i in tags){
            if(tags[i] === $(this).html()){
                $(this).addClass("on");
                break;
            }
        }
    });
}
function get_pic_list(id){
    let pic_list = [];
    $("#" + id + " .imgList img[data-url]").each(function(){
        pic_list.push($(this).attr("data-url"));
    });
    return pic_list.join(';');
}
let get_data_type = function(o){
    if(typeof o === 'object'){
        if( typeof o.length === 'number' ){
            return 'Array';
        }else{
            return 'Object';
        }
    }else{
        return 'param is no object type';
    }
};
function to_camel(str){
    return str.replace(/_[a-z]{1}/g, function(word){
        return word.substr(1).toUpperCase();
    });
}
function from_camel(str){
    return str.replace(/[A-Z]{1}/g, function(word){
        return "_" + word.toLowerCase();
    });

}
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return decodeURI(r[2]);
    return null;
}
