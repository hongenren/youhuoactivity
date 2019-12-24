/**
 * Created by podiannao on 2018/7/11.
 */
//常用事件
!(function($,window,document){
    console.log($);
    console.log(window);
    console.log(document);

    //跳转动态添加参数
    var TogHref=function(elem,options){
        this.$elem=elem;
        this.default={
            hre:'javascript:void(0)',
            dataHre:'data-href',
            spe:'?class=en&id=1&old=a'
        };
        this.opts = $.extend({},this.default, options);
    };
    TogHref.prototype={
        init:function(){
            var that=this;
            this.$elem.attr({
                'href':that.opts.hre
            });
            this.$elem.on("click",function(){
                var self=$(this);
                var speBool=that.opts.spe.substr(0, 1);
                var dataHreBool=that.opts.dataHre.substr(0, 5);
                if(speBool=='?'&&dataHreBool=='data-'){
                    var dataHref=$(this).attr(that.opts.dataHre);
                    window.location.href=dataHref+that.opts.spe;
                }else{
                    alert('参数格式不正确! 格式: \nhre:\'javascript:void(0)\'固定值\ndataHre:以data-开头\nspe:?str1=xx&str2=xx')
                }

            })
        }
    };
    $.fn.togHref=function(options){
        var togEven=new TogHref(this,options);
        togEven.init()
    };
})(window.jQuery,window,document);