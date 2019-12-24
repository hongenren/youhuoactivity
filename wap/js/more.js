/**
 * Created by Administrator on 2018/5/27.
 */
$(function(){
    var cotrs = $(".elastislide-list li");
    cotrs.click(function(){
        $(this).addClass("thisclass").siblings().removeClass("thisclass");
    });
});
$(document).ready(function(){
    $('.elastislide-list li').click(function(){
        $('.warp_pws_n_so').hide();
        $('.warp_pws_n_so').eq($(this).index()).show()
    });
});
$(function(){
    var cotrs = $(".warp_pws_n_sy a");
    cotrs.click(function(){
        $(this).addClass("thisclass").siblings().removeClass("thisclass");
    });
});
$(document).ready(function(){
    $('.warp_pws_n_sy a').click(function(){
        $('.warp_pws_n_st li').hide();
        $('.warp_pws_n_st li').eq($(this).index()).show()
    });
});
//$(function(){
//    $(".warp_pws_n_st li .warp_pws_n_sj a").click(function(){
//        $(".warp_pws_n_sh").fadeIn();
//    })
//
//    $(".warp_pws_n_sh a").click(function(){
//        $(".warp_pws_n_sh").fadeOut();
//    })
//});
$(function(){
    $(".warp_pws_n_st li .warp_pws_n_sj a").click(function(){
        $(this).parent().siblings().last('div').addClass('cla');
    });
    $(".warp_pws_n_sh").click(function(){
        $(this).removeClass('cla');
    });
})
$(function(){
    var cotrs = $(".warp_pws_c_su li");
    cotrs.click(function(){
        $(this).addClass("thisclass").siblings().removeClass("thisclass");
    });
});
$(document).ready(function(){
    $('.warp_pws_c_su li').click(function(){
        $('.warp_pws_c_sr').hide();
        $('.warp_pws_c_sr').eq($(this).index()).show()
    });
});

$(function(){
    $(".warp_pws_z li .warp_pws_z_so").click(function(){
        $(this).addClass('cla');
        $(this).parent().find('div').addClass('cla');
    });
    $(".warp_pws_z_su").click(function(){
        $(this).removeClass('cla');
        $(".warp_pws_z li .warp_pws_z_so").removeClass('cla');
    });
})
$(function(){
    var cotrs = $(".warp_pws_z li .warp_pws_z_sp");
    cotrs.click(function(){
        $(this).addClass("thisclass").siblings().removeClass("thisclass");
    });
});