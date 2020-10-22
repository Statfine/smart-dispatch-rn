/**
 * Component: 高德地图组件
 */
import * as React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import { MapType, MapView } from 'react-native-amap3d';

import { StyleSheet, View, Text } from 'react-native';
import { plainlize, immuablize } from '../../utils/ImmutableUtil';
import { useReduxByPath } from '../../hooks/ReduxHooks';
import Marker from 'react-native-amap3d/lib/js/map-view/marker';

import { getMapZoom, zoomToDelta } from '../../utils/Location';

function Amap ({ hRef, position, pointMark, roadPath, mapType }) {
  const mapRef = React.useRef();
  const [localPosition, setLocalPosition] = React.useState();

  const [resetZoomFlag, setResetZoomFlag] = React.useState(true);
  const [mapZoom, setMapZoom] = React.useState({});

  const points = useReduxByPath(['points', 'myPosition']);

  React.useEffect(() => {
    if (!_.isEmpty(position)) setLocalPosition(immuablize(position));
    else setLocalPosition(points);
  }, [position]);

  /**
   *  取多点的中心点以及对于缩放比例 进行设置
  */
  React.useEffect(() => {
    // console.log('useEffect', pointMark);
    const list = [];
    for (let i = 0; i < pointMark.length; i++) {
      list.push(...pointMark[i].pointMarkList);
    }
    if (list.length > 1 && resetZoomFlag) {
      // console.log('pointMark', pointMark, list);
      const zoom = getMapZoom(list);
      console.log('mapZoom', zoom, list);
      setResetZoomFlag(false);
      setMapZoom(zoom);
    }
  }, [pointMark]);

  /**
   * useImperativeHandle  中的方法供父组件使用 hRef.current.scrollToBottom()
   */
  React.useImperativeHandle(hRef,
    () => ({
      moveToPostion (center) {
        mapRef.current.setStatus({ center }, 1000);
      },
    }),
    [],
  );

  /**
   * center: { ongitude: i.longitude, latitude: i.latitude }
   */
  const handleMarkPress = (center) => {
    mapRef.current.setStatus({ center }, 1000);
  };

  const renderMarkPoint = (mark, i) => {
    if (!mark.pointMarkView) return null;
    return () => mark.pointMarkView(i);
  };

  const renderMark = (mark, markIndex) => {
    return mark.pointMarkList.map((i, index) => (
      <Marker
        key={i.id || i.name}
        // image={'flag'}
        zIndex={markIndex * 100 + mark.pointMarkList.length - index}
        icon={renderMarkPoint(mark, i)}
        title={i.name}
        onPress={() => {
          if (mark.pointMarkPress) mark.pointMarkPress(i);
        }}
        coordinate={{
          longitude: i.longitude,
          latitude: i.latitude,
        }}
      />
    ));
  };

  const renderRoad = () => {
    return (
      <MapView.Polyline
        width={4}
        color="#4885ed"
        coordinates={roadPath}
      />
    );
  };

  // android 模拟器定位会强退
  // if (Platform.OS === 'android') return null;
  // if (localPosition) {
  //   return null;
  // }
  if (!localPosition && !mapZoom.latitude) {
    return null;
  }
  // const list = [];
  // for (let i = 0; i < pointMark.length; i++) {
  //   list.push(...pointMark[i].pointMarkList);
  // }
  // // console.log('pointMark', pointMark, list);
  // const mapZoom = getMapZoom(list);
  // console.log('mapZoom', mapZoom, list);
  return (
    <MapView
      ref={mapRef}
      style={StyleSheet.absoluteFill}
      mapType={mapType || MapType.Standard}
      zoomLevel={12}
      tilt={45}
      locationInterval={10000} //定位间隔(ms)，默认 2000
      distanceFilter={10} //定位的最小更新距离
      // locationEnabled={true} //开启定位
      showslocationbutton={true}
      showsCompass={true}
      showsscale={true}
      showsTraffic={true}
      tiltEnabled={true}
      zoomEnabled={true}
      scrollEnabled={true}
      rotateEnabled={true}
      region={{
        // latitude: getMapZoom(list).latitude,
        // longitude: getMapZoom(list).longitude,
        // latitudeDelta: 0.02,
        // longitudeDelta: 0.02,
        latitude: mapZoom.latitude || Number(localPosition.get('latitude')),
        longitude: mapZoom.longitude || Number(localPosition.get('longitude')),
        latitudeDelta: zoomToDelta[mapZoom.zoom] || 0.1,
        longitudeDelta: zoomToDelta[mapZoom.zoom] || 0.1,
      }}
      //onlocation 启动定位显示  regison  中的显示区域
      // onlocation={({ nativeEvent }) => {
      //   console.log('nativeEvent', nativeEvent);
      // }}
    >
      {renderRoad()}
      {pointMark.map((i, index) => renderMark(i, index))}
    </MapView>
  );
}

export default React.memo(Amap);

/**
 *  hRef React.useRef();
 *  mapType (MapType.) 0-标准地图; 1-卫星地图; 2-夜间地图; 3-导航地图; 4-公交地图
 *  position { latitude, longitude } 中心点
 *  pointMark 标记 [{ pointMarkList, pointMarkView, pointMarkPress }]
 *      pointMarkList { latitude, longitude, name } 标记数组
 *      pointMarkView 标记视图
 *      pointMarkPress 标记事件
 *  roadPath { latitude, longitude } 路线
 *
 */
Amap.defaultProps = {
  mapType: MapType.Standard,
};
Amap.propTypes = {
  mapType: PropTypes.number,
  position: PropTypes.object,
  pointMark: PropTypes.array,
  roadPath: PropTypes.array,
};
