/**
 * Created 2018/05/27.
 */
// function offset(){
//     var html = document.querySelector('html');
//     var rem = html.offsetWidth / 6.4;
//     if(html.offsetWidth>750){
//         rem = html.offsetWidth / 12.8;
//     }
//     if(html.offsetWidth>1400){
//         rem = html.offsetWidth / 20;
//     }
//     html.style.fontSize = rem + "px";
// }
// offset();
// window.onresize=offset;
// window.onload=function(){
//     offset();
// };

//字体适配----start----
function offset(){
    var width=window.innerWidth;
    var html = document.querySelector('html');
    var rem = width / 6.4;
    // if(width>640){
    //     rem = width / 7.8;
    //     if(width>870){
    //         rem = width / 9.8;
    //     }
    //     if(width>900){
    //         rem = width / 10.8;
    //     }
    //     if(width>1100){
    //         rem = width / 12.8;
    //     }
    //     if(width>1400){
    //         rem = width / 17;
    //     }
    //     html.style.fontSize = rem + "px";
    // }
    if(width>640){
        rem = width / 10.5;
        if(width>750){
            rem = width / 12.5;
        }
        if(width>820){
            rem = width / 14.8;
        }
        if(width>900){
            rem = width / 16.8;
        }
        if(width>1020){
            rem = width / 18.8;
        }
        if(width>1160){
            rem = width / 20.8;
        }
        if(width>1320){
            rem = width / 22.8;
        }
        if(width>1400){
            rem = width / 23.8;
        }
        if(width>1580){
            rem = width / 24.8;
        }
        if(width>1700){
            rem = width / 25.8;
        }
        if(width>1880){
            rem = width / 27.8;
        }
        if(width>2060){
            rem = width / 28.8;
        }
        if(width>2140){
            rem = width / 29.8;
        }
        html.style.fontSize = rem + "px";
    }
    html.style.fontSize = rem + "px";
}
offset();
window.onresize=offset;
window.onload=function(){
    offset();
};
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
    console.log('123')
    // elem.style.height = 'auto';
    elem.scrollTop = 0; //防抖动
    elem.style.height = elem.scrollHeight + 'px';
};


