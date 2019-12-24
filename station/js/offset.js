/**
 * Created 2018/05/27.
 */
function offset(){
    var html = document.querySelector('html');
    var rem = html.offsetWidth / 6.4;
    html.style.fontSize = rem + "px";
}
offset();
window.onresize=offset;