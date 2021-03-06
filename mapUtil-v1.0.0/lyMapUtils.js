/**
 * 地图相关工具方法
 * @author lrt
 * @version 1.0
 * @date 2018/12/10 16:27
 */
(function () {
    "use strict";
    // 创建一个root对象,表示为window对象
    var root = this;

    //创建一个lyMapUtils 对象
    var lyMapUtils = function (obj) {
        //如果在"lyMapUtils "的原型链上(即lyMapUtils 的prototype所指向的对象是否跟obj是同一个对象，要满足"==="的关系)
        if (obj instanceof lyMapUtils) return obj;
        //如果不是，则构造一个
        if (!(this instanceof lyMapUtils)) return new lyMapUtils(obj);
        //将参数obj存放在lyMapUtils._wrapped属性中
        this._warpped = obj;
    }

    // 针对不同的宿主环境, 将lyMapUtils的命名变量存放到不同的对象中
    if (typeof exports !== 'undefined') {
        if (typeof module !== 'undefined' && module.exports) {
            exports = module.exports = lyMapUtils;
        }
        exports.lyMapUtils = lyMapUtils;
    } else {
        //浏览器
        root.lyMapUtils = lyMapUtils;
    }

    //版本号
    lyMapUtils.version = '1.0.0';

    //赤道半径，单位m
    lyMapUtils.EARTH_RADIUS = 6378137.0;

    lyMapUtils.DEFAULT_ZOOM=10;

    //计算中心点
    lyMapUtils.getCenter = function (points) {
        var centerPoint = {};
        var extremeLatLng = lyMapUtils.getExtremeLatLng(points);
        if (extremeLatLng) {
            centerPoint.lng = (parseFloat(extremeLatLng.maxLng) + parseFloat(extremeLatLng.minLng)) / 2;
            centerPoint.lat = (parseFloat(extremeLatLng.maxLat) + parseFloat(extremeLatLng.minLat)) / 2;
            return centerPoint;
        } else {
            return false;
        }
    }

    //计算地图缩放级别
    lyMapUtils.getZoom = function (points) {
        //级别18到3。
        var zoom = ["50", "100", "200", "500", "1000", "2000", "5000", "10000", "20000", "25000", "50000", "100000", "200000", "500000", "1000000", "2000000"]

        //极值对象
        var extremeLatLng = lyMapUtils.getExtremeLatLng(points);
        if (extremeLatLng) {
            var distance = lyMapUtils.getDistance(extremeLatLng.maxLng, extremeLatLng.maxLat, extremeLatLng.minLng, extremeLatLng.minLat);
            if (distance) {
                if(distance===0){
                    return lyMapUtils.DEFAULT_ZOOM;
                }
                for (var i = 0, zoomLen = zoom.length; i < zoomLen; i++) {
                    if (zoom[i] - distance > 0) {
                        //之所以会多3，是因为地图范围常常是比例尺距离的10倍以上。所以级别会增加3。
                        return 18 - i + 3;
                    }
                }
                ;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    //计算坐标极点
    lyMapUtils.getExtremeLatLng = function (points) {
        //定义返回极值对象
        var extremeLatLng = {},
            pointsLength = points.length;

        //如果数组为空返回false
        if (pointsLength <= 0) {
            console.log('points数组为空');
            return false;
        }
        //极值变量
        var maxLon = points[0].lng,
            minLon = points[0].lng,
            maxLat = points[0].lat,
            minLat = points[0].lat;
        //每个坐标点变量
        var point;
        for (var i = 0; i < pointsLength; i++) {
            point = points[i];
            if (point.lng > maxLon) maxLon = point.lng;
            if (point.lng < minLon) minLon = point.lng;
            if (point.lat > maxLat) maxLat = point.lat;
            if (point.lat < minLat) minLat = point.lat;
        }
        //给极值对象赋值
        extremeLatLng.maxLng = maxLon;
        extremeLatLng.minLng = minLon;
        extremeLatLng.maxLat = maxLat;
        extremeLatLng.minLat = minLat;
        //返回极值对象
        return extremeLatLng;
    }

    // 计算两点距离
    lyMapUtils.getDistance = function (lngA, latA, lngB, latB) {
        if (isNaN(lngA) || isNaN(latA) || isNaN(lngB) || isNaN(latB)) {
            console.log('两个点坐标不是数字');
            return false;
        }
        //两点经度-弧度值
        var radLngA = lyMapUtils.degree2radian(lngA);
        var radLngB = lyMapUtils.degree2radian(lngB);
        //两点纬度-弧度值
        var radLatA = lyMapUtils.degree2radian(latA);
        var radLatB = lyMapUtils.degree2radian(latB);
        //两点经度之差
        var lngDistanse = radLngA - radLngB;
        //两点纬度之差
        var latDistanse = radLatA - radLatB;
        //经度差的正弦值
        var sinLngDis = Math.sin(lngDistanse / 2.0);
        //纬度差的正弦值
        var sinLatDis = Math.sin(latDistanse / 2.0);
        //两点距离
        var distanse = 2 * lyMapUtils.EARTH_RADIUS
            * Math.asin(Math.sqrt(Math.pow(sinLatDis, 2) + Math.cos(radLatA) * Math.cos(radLatB) * Math.pow(sinLngDis, 2)));
        return distanse;
    }

    //角度转换为弧度
    lyMapUtils.degree2radian = function (degree) {
        return parseFloat(degree) * Math.PI / 180;
    }

    //弧度转换为角度
    lyMapUtils.radian2degree = function (radian) {
        return parseFloat(radian) * 180 / Math.PI;
    }

}.call(this))