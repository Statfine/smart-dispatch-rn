/**
 * util  事件发布订阅
 *
 *  EVENT_DRAWER 抽屉事件
 */
import { DeviceEventEmitter } from 'react-native';

export const USER_LOGIN = 'USER_LOGIN';

export const EVENT_DRAWER = 'EVENT_DRAWER'; // 开启抽屉事件
export const REFRESH_ROUTE_PLAN = 'REFRESH_ROUTE_PLAN';

export const EVENT_HOME_SWIPEENABLED = 'EVENT_HOME_SWIPEENABLED'; // 通知Tab手势是否禁用 (true-开启， false-禁用)

export const EVENT_HOME_STATUS_CHANGE = 'EVENT_HOME_STATUS_CHANGE'; // 首页状态调整 （flag： 0-tab1，1-tab2， -1-页面离开）

export function subOnClickEvent(func) {
  DeviceEventEmitter.addListener('onclick', func);
}

export function pubOnClickEvent(targetId, data) {
  DeviceEventEmitter.emit('onclick', {
    targetId,
    data,
  });
}
