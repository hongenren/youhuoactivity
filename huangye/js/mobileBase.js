
$(function(){
    //地区显示隐藏
    var areaClose=function(){
        $(".areaList").click(function(){
            $(".areaWrap").hide()
        })
    };
    $(".nearbyBut").each(function(){
        var cwcqc = $(this);
        cwcqc.click(function(){
            var parentId = $(this).attr("data");
            if(parentId!=null && parentId!=""){
                $.ajax({
                    url: base_url1+'/html5/v1/region/findByParent',
                    //url: '/cm/termapi/geArticletListByMy',
                    type: "post",
                    dataType: "json",
                    data: "{\"parent\": "+parentId+"}",
                    headers: {'Content-Type': 'application/json'},
                    success: function (resp) {
                        if (resp.code == 0) {
                            var region = resp.data;
                            var div = "";
                            for (var i in region) {
                                div += "<div class='areaList' onclick='regionClick(\""+cwcqc.attr("id")+"\", \""+region[i].id+"\",\""+region[i].name+"\")'>"+region[i].name+"</div>";
                            }
                            $(".areaListWrap").html(div);
                        }
                    }
                });
                $(".areaWrap").show();
                areaClose();
            }
        })
    });

    //筛选
    $(".memberFixedList ul li").each(function(){
        $(this).click(function(){
            $(this).toggleClass('on')
        })
    });
    $(".memberSearchRight").click(function(){
        $(".memberFixedWrap").slideDown()
    });
    $(".memberFixedClose,.memberFixedSubmit").click(function(){
        $(".memberFixedWrap").slideUp()
    })
});