import * as React from 'react';

import notificationListenerInit from '../utils/NotificationListener'; // 通知服务
import { geolocationInit, getCurrentPosition } from '../utils/Location';
import RootNavigator from './rootNavigator';
import ActionTypes from '../redux/ActionTypes';
import { useDispatch } from 'react-redux';

export default function InitRoot () {
  React.useEffect(() => {
    initApp();
  }, []);

  const dispatch = useDispatch();

  const getPosition = () => {
    getCurrentPosition(updateLocationState);
  };

  const updateLocationState = (data) => {
    console.log('updateLocationState', data);
    // 模拟器上不准，模拟
    // const location = { longitude: 113.91638230712891, latitude: 22.482803981563375 };
    const location = { longitude: data.location.longitude, latitude: data.location.latitude };
    dispatch({ type: ActionTypes.SET_MY_CURRENT_POINT, data: location });
  };
  /**
   * notificationListenerInit 初始化推送
   * geolocationInit 初始化定位  getCurrentPosition获取位置
   */
  const initApp = async () => {
    notificationListenerInit(); // 初始化推送
    await geolocationInit(); // 初始化定位
    // getPosition();  使用当前骑手的位置
  };

  return (
    <React.Fragment>
      <RootNavigator/>
    </React.Fragment>
  );
}
