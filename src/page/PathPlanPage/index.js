import * as React from 'react';
import { useEffect, useState, useRef } from 'react';
import {
  DeviceEventEmitter,
  StyleSheet,
  View,
  PanResponder,
} from 'react-native';
import _ from 'lodash';

import Amap from '../../components/Amap';
import {
  BottomPositionInfo,
  PointMarkView,
  pointTypes,
  TopHintView,
  TriangleHint,
} from './mapComponent';

import {
  displayDistance,
  getDistanceBetweenTwoPoints,
} from '../../utils/Location';
import { parseStyle } from '../../utils/ScreenUtil';
import RoutePlan from '../../utils/RoutePlan';
import { plainlize } from '../../utils/ImmutableUtil';
import { useReduxByPath } from '../../hooks/ReduxHooks';
import { getPathPlans, getUserLocation } from '../../services';
import showToast from '../../utils/Toast';
import { get } from 'lodash';
import {
  EVENT_DRAWER,
  EVENT_HOME_STATUS_CHANGE,
  EVENT_HOME_SWIPEENABLED,
} from '../../utils/EventBus';

const INTERVAL_TIME = 2000;
function PathPlanPage() {
  const mapRef = React.useRef();
  const localPosition = plainlize(useReduxByPath(['points', 'myPosition']));
  const [bottomInfo, setBottomInfo] = useState({});
  const [distance, setDistance] = useState('');
  const intervalRef = useRef();
  const _panResponderRef = useRef();
  const oldBottomInfoRef = useRef(); // 用于定时获取数据后对比

  const [points, setPoints] = useState([]);
  const [lineCoordinates, setLineCoordinates] = useState([]);

  useEffect(() => {
    oldBottomInfoRef.current = bottomInfo;
    const result = getDistanceBetweenTwoPoints(localPosition, bottomInfo);
    if (!Number.isNaN(result)) {
      setDistance(displayDistance(result));
    }
  }, [bottomInfo, localPosition]);

  useEffect(() => {
    // 手势冲突，地图触摸时取消tab的手势
    _panResponderRef.current = PanResponder.create({
      //开启点击手势响应
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      //开启点击手势响应是否劫持 true：不传递给子view false：传递给子view
      onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      //开启移动手势响应
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      //开启移动手势响应是否劫持 true：不传递给子view false：传递给子view
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
      //手指触碰屏幕那一刻触发 成为激活状态。
      onPanResponderGrant: (evt, gestureState) => DeviceEventEmitter.emit(EVENT_HOME_SWIPEENABLED, false),
      //当有其他不同手势出现，响应是否中止当前的手势
      onPanResponderTerminationRequest: (evt, gestureState) => true,
      //手指离开屏幕触发
      onPanResponderRelease: (evt, gestureState) => {
        setTimeout(() => {
          DeviceEventEmitter.emit(EVENT_HOME_SWIPEENABLED, true);
        }, 500);
      },

      onShouldBlockNativeResponder: (evt, gestureState) => {
        // 返回一个布尔值，决定当前组件是否应该阻止原生组件成为JS响应者
        // 默认返回true。目前暂时只支持android。
        // 基于业务交互场景，如果这里使用js事件处理，会导致容器不能左右滑动。所以设置成false.
        return false;
      },
    });
    // 定时获取数据
    intervalRef.current = setInterval(() => {
      fetchPlanPaths();
    }, INTERVAL_TIME);
    const subscription = DeviceEventEmitter.addListener(EVENT_HOME_STATUS_CHANGE, (flag) => {
      clearInterval(intervalRef.current);
      if (flag === 1) {
        fetchPlanPaths();
        intervalRef.current = setInterval(() => {
          fetchPlanPaths();
        }, INTERVAL_TIME);
      }
    });
    return () => {
      subscription.remove();
      clearInterval(intervalRef.current);
    };
  }, []);

  // 地图标注点击事件
  const handlePointMarkPress = (i) => {
    console.log(i);
    mapRef.current.moveToPostion({
      longitude: i.longitude,
      latitude: i.latitude,
    });
    setBottomInfo(i);
  };

  // 跳转第三方
  const handleNavigation = () => {
    RoutePlan.openAmap({
      slat: localPosition.latitude,
      slon: localPosition.longitude,
      sname: '骑手位置',
      dlat: bottomInfo.latitude,
      dlon: bottomInfo.longitude,
      dname: bottomInfo.name,
      sourceApplication: '智能调度平台',
    });
  };

  // 地图标注取送点渲染
  const pointMarkView = (info) => {
    return <PointMarkView info={info} />;
  };

  // 地图标注当前位置渲染
  const pointMarkLocationView = () => {
    let text = '';
    if (!_.isEmpty(bottomInfo)) {
      text = `${
        pointTypes.isTakePoint(bottomInfo.type) ? '距取货点' : '距送货地点'
      }: ${distance}`;
    }
    return <TriangleHint text={text} />;
  };

  const fetchPlanPaths = async () => {
    try {

      // const oldPoints = points;
      const res = await getPathPlans({});
      console.log('fetchPlanPaths', res);
      const points = get(
        res,
        'data.data.geoFeatureCollectionDTO.features',
        [],
      ).filter(
        (item) =>
          item.geometry.type === 'Point' &&
          (pointTypes.isSendPoint(item.properties.bizType) ||
            pointTypes.isTakePoint(item.properties.bizType)),
      );
      const linePoints = get(
        res,
        'data.data.geoFeatureCollectionDTO.features',
        [],
      ).find((item) => item.geometry.type === 'LineString');
      const pointName = getRemarkPointName(
        get(res, 'data.data.pointNames', []),
      );

      // 路线
      if (linePoints) {
        setLineCoordinates(
          linePoints.geometry.coordinates.map((item) => ({
            longitude: item[0],
            latitude: item[1],
            type: item[2],
          })),
        );
        // const firstPoint = linePoints.geometry.coordinates[0];
      } else setLineCoordinates([]);

      // Mark点
      const normalizedPoints = points
        .map((item) => [...item.geometry.coordinates, item.properties])
        .map((point, i) => ({
          longitude: point[0],
          latitude: point[1],
          type: point[2].bizType,
          index: i,
          id: `${point[2].bizType.split('/')[1]}_${point[2].id}`,
          name: pointName[`${point[2].bizType.split('/')[1]}_${point[2].id}`],
        }));
      setPoints(normalizedPoints);

      // 底部信息
      let bottomIndex = -1;
      if (oldBottomInfoRef.current) {
        bottomIndex = _.findIndex(normalizedPoints.concat([]), (i) => {
          return i.id === oldBottomInfoRef.current.id;
        });
      }
      setBottomInfo(normalizedPoints[bottomIndex === -1 ? 0 : bottomIndex]);

      // if (oldPoints > 0) setPoints(oldPoints);
      // // ？？？？ 直接设置会导致页面奔溃
      // setTimeout(() => {
      //   setPoints(normalizedPoints);
      //   setBottomInfo(normalizedPoints[0]);
      // }, 600);
    } catch (error) {
      showToast('数据异常');
    }
  };

  const getRemarkPointName = (pointList) => {
    const obj = {};
    if (!_.isEmpty(pointList)) {
      pointList.map((i) => {
        for (let prop in i) {
          obj[prop] = i[prop];
        }
      });
    }
    return obj;
  };

  if (!_panResponderRef.current) return null;

  return (
    <View style={styles.container}>
      <View style={parseStyle(styles.container)}>
        <View style={parseStyle(styles.mapContainer)} {..._panResponderRef.current.panHandlers}>
          <Amap
            hRef={mapRef}
            pointMark={[
              {
                pointMarkList: points,
                pointMarkView,
                pointMarkPress: handlePointMarkPress,
              },
              {
                pointMarkList: [{ ...localPosition, ...{ name: '骑手' } }],
                pointMarkView: pointMarkLocationView,
              },
            ]}
            roadPath={lineCoordinates.map((item) => ({
              longitude: item.longitude,
              latitude: item.latitude,
            }))}
          />
        </View>
        <TopHintView />
        <BottomPositionInfo
          buttomInfo={bottomInfo}
          distance={distance}
          handleNavigation={handleNavigation}
        />
      </View>
    </View>
  );
}

export default PathPlanPage;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  mapContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
});
