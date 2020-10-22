/**
 * util  获取地理位置
 */
import { PermissionsAndroid, Platform } from 'react-native';
import {
  Geolocation,
  init,
  setLocatingWithReGeocode,
  setNeedAddress,
} from 'react-native-amap-geolocation';

import { getDistance } from 'geolib';
import { postLocation } from '../services';

const intervalRef = '';

//初始化sdk
export async function geolocationInit() {
  try {
    if (Platform.OS === 'android') {
      await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
      ]);
    }
    await init({
      ios: '807493ea8242babd6e29860292e6a499',
      android: 'b1e3e0b2f40b4d6fc5fecfb040cdb8e1',
    });
    if (Platform.OS === 'android') {
      setNeedAddress(true);
    } else {
      setLocatingWithReGeocode(true);
    }
  } catch (error) {
    console.error(error);
  }
}

//只获得一次当前地理位置
export function getCurrentPosition(callback) {
  Geolocation.getCurrentPosition((position) => {
    if (callback) callback(position);
  });
}

function normalizePointToObject(point) {
  if (Array.isArray(point)) {
    return { longitude: point[0], latitude: point[1] };
  }
  return point;
}

export function getDistanceBetweenTwoPoints(firstPoint, lastPoint) {
  try {
    if (firstPoint && lastPoint) {
      return getDistance(
        normalizePointToObject(firstPoint),
        normalizePointToObject(lastPoint),
      );
    }
  } catch (e) {
    //
  }
  return Number.NaN;
}

export function displayDistance(distance) {
  if (distance < 1000) {
    return `${parseInt(distance)}m`;
  }
  return `${(Math.round(distance / 100) / 10).toFixed(1)}Km`;
}

export function eventLocation() {
  if (!this.intervalRef) clearInterval(this.intervalRef);
  this.intervalRef = setInterval(() => {
    getCurrentPosition((data) => {
      try {
        console.log('上报地理位置', data);
        if (data.coords && data.coords.longitude) {
          postLocation({
            longitude: data.coords.longitude,
            latitude: data.coords.latitude,
          });
        }
      } catch (error) {
        console.error('eventLocation error', error);
      }
    });
  }, 11000);
}

export function cleanEventLocation() {
  if (!this.intervalRef) clearInterval(this.intervalRef);
}

//根据原始数据计算中心坐标和缩放级别，并为地图设置中心坐标和缩放级别。
export const zoomToDelta = {
  15: 0.03,
  16: 0.015,
  17: 0.01,
  18: 0.008,
  19: 0.003,
  20: 0.002,
  21: 0.1,
};
export function getMapZoom(points) {
  if (points.length > 0) {
    var maxLng = points[0].longitude;
    var minLng = points[0].longitude;
    var maxLat = points[0].latitude;
    var minLat = points[0].latitude;
    var res;
    for (var i = points.length - 1; i >= 0; i--) {
      res = points[i];
      if (res.longitude > maxLng) maxLng = res.longitude;
      if (res.longitude < minLng) minLng = res.longitude;
      if (res.latitude > maxLat) maxLat = res.latitude;
      if (res.latitude < minLat) minLat = res.latitude;
    }
    var cenLng = (parseFloat(maxLng) + parseFloat(minLng)) / 2;
    var cenLat = (parseFloat(maxLat) + parseFloat(minLat)) / 2;
    var zoom = getZoom(maxLng, minLng, maxLat, minLat);
    return {
      latitude: cenLat,
      longitude: cenLng,
      zoom,
    };
  } else {
    //没有坐标，显示全中国
    return {
      latitude: 35.563611,
      longitude: 103.388611,
      zoom: 14,
    };
  }
}

//根据经纬极值计算绽放级别。
function getZoom(maxLng, minLng, maxLat, minLat) {
  var zoom = [
    '50',
    '100',
    '200',
    '500',
    '1000',
    '2000',
    '5000',
    '10000',
    '20000',
    '25000',
    '50000',
    '100000',
    '200000',
    '500000',
    '1000000',
    '2000000',
  ]; //级别18到3。
  var pointA = normalizePointToObject([maxLng, maxLat]); // 创建点坐标A
  var pointB = normalizePointToObject([minLng, minLat]); // 创建点坐标B
  var distance = getDistance(pointA, pointB).toFixed(1); //获取两点距离,保留小数点后两位
  for (var i = 0, zoomLen = zoom.length; i < zoomLen; i++) {
    if (zoom[i] - distance > 0) {
      return 18 - i + 3; //之所以会多3，是因为地图范围常常是比例尺距离的10倍以上。所以级别会增加3。
    }
  }
}
