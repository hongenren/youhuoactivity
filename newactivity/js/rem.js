(function (doc, win) {
    var docEl = doc.documentElement,
        resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
        recalc = function () {
            var clientWidth = docEl.clientWidth;
            if (!clientWidth) return;
            var fontSize = 17 * (clientWidth / 320);
            fontSize = Math.round((fontSize > 27) ? 27 : fontSize);
            docEl.style.fontSize = fontSize + 'px';
            var dpi = window.devicePixelRatio;
            docEl.setAttribute('data-dpi', dpi);
        };
    recalc();
    if (!doc.addEventListener) return;
    win.addEventListener(resizeEvt, recalc, false);
})(document, window);