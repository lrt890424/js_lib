/**
 * h5自适应
 * @author lrt
 * @version 1.0
 * @date 2018/12/5 13:23
 */
var adaptive = {
    designWidth: 1920,
    bodyFontSize: 14
};
(function (window, adaptive) {
    'use strict';

    var document = window.document;
    var documentElement = document.documentElement;
    //html 字体大小
    var baseFontSize = 100;

    //设置rem
    function setRem() {
        // 布局视口
        var layoutView;
        layoutView = documentElement.getBoundingClientRect().width;
        baseFontSize = 100 * layoutView / adaptive.designWidth;
        //设置html根字体大小
        documentElement.style.fontSize = baseFontSize + 'px';
        //设置body字体大小
        document.body && (document.body.style.fontSize = adaptive.bodyFontSize / 100 + 'rem');
        // 重新设置rem后的回调方法
        adaptive.setRemCallback && adaptive.setRemCallback();
        adaptive.baseFontSize = baseFontSize;
    }

    //定时器
    var timerId;
    //出始化
    adaptive.init = function () {
        // resize的时候重新设置rem基准值
        window.addEventListener('resize', function () {
            clearTimeout(timerId);
            // debugger
            timerId = setTimeout(setRem, 300);
        }, false);

        // 设置body上的字体大小
        if (document.readyState === 'complete') {
            document.body.style.fontSize = adaptive.bodyFontSize / 100 + 'rem';
        } else {
            document.addEventListener('DOMContentLoaded', function (e) {
                document.body.style.fontSize = adaptive.bodyFontSize / 100 + 'rem';
            }, false);
        }
        // 设置rem值
        setRem();
    };

    // 有些html元素只能以px为单位，所以需要提供一个接口，把rem单位换算成px
    adaptive.rem2Px = function (remValue) {
        return remValue * baseFontSize;
    };
})(window, adaptive);
window.adaptive = adaptive;
window.adaptive.init();