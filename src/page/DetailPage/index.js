/**
 * page 任务详情
 */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import _ from 'lodash';

import Header from '../../components/Header';
import Amap from '../../components/Amap';
import SvgIcon from '../../components/SvgIcon';

import { parseStyle } from '../../utils/ScreenUtil';

import { DetailBottom } from './DetailCom';
import { pointTypes, TriangleHint } from '../PathPlanPage/mapComponent';

import walkMock from '../../mock/walkMock.json';
import { immuablize, plainlize } from '../../utils/ImmutableUtil';
import { useReduxByPath } from '../../hooks/ReduxHooks';
import { displayDistance, getDistanceBetweenTwoPoints } from '../../utils/Location';
import DefaultPage from '../../components/DefaultPage/DefaultPage';
import { getTaskDetail } from '../../services';
import { get } from 'lodash';
import showToast from '../../utils/Toast';

const INTERVAL_TIME = 2000;

const TITLE = {
  taskList: '任务详情',
  history: '历史任务详情',
};

function DetailPage ({ navigation, route: { params: { taskId, actions, fromPage = 'taskList' } } }) {
  const mapRef = useRef();
  const localPosition = plainlize(useReduxByPath(['points', 'myPosition']));
  const [pointMarkList, setPointList] = useState([]);
  const [roadPath, setRoadPath] = useState([]);
  const [loading, setLoading] = useState(false);
  const [detailData, setDetailData] = useState({});
  const [status, setStatus] = useState('end');
  const intervalRef = useRef();
  const timeoutRef = useRef();
  // 地图标注取送点渲染
  const pointMarkView = (info) => {
    return (
      <View>
        <SvgIcon
          size={20}
          icon={pointTypes.isTakePoint(info.type) ? 'location_fetch' : 'location_send'}
        />
      </View>
    );
  };

  // 地图标注当前位置渲染
  const pointMarkLocationView = () => {
    // const distance = getDistanceBetweenTwoPoints(localPosition, pointMarkList[0]);
    const text = '';
    // if (distance) {
    //   text = `距取货点: ${displayDistance(distance)}`;
    // }
    return <TriangleHint text={text}/>;
  };

  // 地图标注点击事件
  const handlePointMarkPress = (i) => {
    console.log(i);
    mapRef.current.moveToPostion({
      longitude: i.longitude,
      latitude: i.latitude,
    });
  };

  const fetchData = useCallback(async () => {
    try {
      const res = await getTaskDetail({ taskId });
      console.log('detail', res);
      setDetailData(immuablize(get(res, 'data.data')));
      setStatus(res.data.data.taskInfoRespDTO.status === 'cancel' || res.data.data.taskInfoRespDTO.status === 'completed' ? 'end' : 'ing');

      const points = get(res, 'data.data.geoFeatureCollectionDTO.features', []).filter(item => item.geometry.type === 'Point' && (pointTypes.isSendPoint(item.properties.bizType) || pointTypes.isTakePoint(item.properties.bizType))).map(item => [...item.geometry.coordinates, item.properties.bizType]);
      const linePoints = get(res, 'data.data.geoFeatureCollectionDTO.features', []).find(item => item.geometry.type === 'LineString');
      if (linePoints) {
        setRoadPath(linePoints.geometry.coordinates.map(item => ({
          longitude: item[0],
          latitude: item[1]
        })));
      }
      setPointList(points.map(point => ({
        longitude: point[0],
        latitude: point[1],
        type: point[2],
        name: point[2] === 'task/take' ? get(res, 'data.data.taskInfoRespDTO.merchantName') : get(res, 'data.data.taskInfoRespDTO.locationName')
      })));
    } catch (error) {
      showToast('数据异常');
    }
  }, []);

  useEffect(() => {
    // 取数据
    fetchData();
  }, []);

  useEffect(() => {
    // 如果未结束则轮训
    if (status !== 'end') {
      intervalRef.current = setInterval(() => {
        fetchData();
      }, INTERVAL_TIME);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      clearInterval(intervalRef.current);
      clearTimeout(timeoutRef.current);
    };
  }, [status]);

  const params = status === 'end' && pointMarkList.length === 2 ? { position: { latitude: pointMarkList[1].latitude, longitude: pointMarkList[1].longitude }} : {};
  return (
    <View style={styles.container}>
      <Header title={TITLE[fromPage]} leftType="back" hiddenRight/>
      {
        _.isEmpty(detailData) ? <DefaultPage/> : <View style={parseStyle(styles.container)}>
          <View style={{ flex: 1 }}>
            <Amap
              hRef={mapRef}
              pointMark={[
                {
                  pointMarkList,
                  pointMarkView,
                  pointMarkPress: handlePointMarkPress,
                },
                {
                  pointMarkList: status !== 'end' && !_.isEmpty(localPosition) ? [{...localPosition, ...{ name: '骑手' }}] : [],
                  pointMarkView: pointMarkLocationView,
                }
              ]}
              roadPath={roadPath}
              {...params}
            />
          </View>
          <DetailBottom data={detailData} actions={actions}/>
        </View>
      }
    </View>
  );
}

export default DetailPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  content: {
    flex: 1,
    position: 'relative',
    flexDirection: 'column-reverse',
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mapContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'blue',
  },
});
