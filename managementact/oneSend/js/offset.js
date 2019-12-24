/**
 * Created 2018/05/27.
 */
function offset(){
    var html = document.querySelector('html');
    var rem = html.offsetWidth / 6.4;
    if(html.offsetWidth>750){
        rem = html.offsetWidth / 12.8;
    }
    if(html.offsetWidth>1400){
        rem = html.offsetWidth / 20;
    }
    html.style.fontSize = rem + "px";
}
offset();
window.onresize=offset;

function mapLin(){
    var html = document.querySelector('html');
    var rem = html.offsetWidth / 6.4;
    if(html.offsetWidth>750){
        rem = html.offsetWidth / 12.8;
    }
    if(html.offsetWidth>1400){
        rem = html.offsetWidth / 20;
    }
    return rem
}

var autoHeight=function(elem){
    // elem.style.height = 'auto';
    elem.scrollTop = 0; //防抖动
    elem.style.height = elem.scrollHeight + 'px';
};