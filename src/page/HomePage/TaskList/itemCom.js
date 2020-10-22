import * as React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

import { parseStyle, scaleSize } from '../../../utils/ScreenUtil';
import MyPointToTargetPointDistanceText from './MyPointToTargetPointDistanceText';
import {
  transformToDisplayEta,
  transformToDisplayAta,
} from '../../../utils/DateUtil';
import CountDown from '../../../components/CountDown';
import moment from 'moment';
import SvgIcon from '../../../components/SvgIcon';
import RoutePlan from '../../../utils/RoutePlan';

/**
 * 顶部信息
 * hiddenDistance 地图页面隐藏距离
 * 此处作用两个页面，首页列表和详情，所以样式有部分区分
 */
const ITEM_TYPE = {
  '1': {
    action: '取餐',
    connectName: '联系商家',
    phone: 'merchantCorrespondence',
    phoneColor: '#597EF7',
  },
  '2': {
    action: '送达',
    connectName: '联系客户',
    phone: 'customerCorrespondence',
    phoneColor: '#FFA328',
  },
};
const STATUS = {
  cancel: {
    text: '已退单',
    color: '#FF5E37',
  },
  completed: {
    text: '已完成',
    color: '#858585',
  },
};
export const TopInfo = ({ item, bottomLine }) => {
  // 标识结束
  const end =
    item.get('status') === 'cancel' || item.get('status') === 'completed';
  const typeInfo = ITEM_TYPE[item.get('itemType') || '2'];

  const handleCallPhone = () => {
    RoutePlan.openPhone(item.get(typeInfo.phone));
  };

  const secondTransform = () => {
    const second = moment(item.get('ata')).diff(moment(item.get('atd')));
    const duration = moment.duration(second);
    // return `${duration.hours()}:${duration.minutes()}:${duration.seconds()}`;
    return `${duration.hours() > 9 ? duration.hours() : `0${duration.hours()}`}:${moment([2000, 1, 1]).add(duration).format('mm:ss')}`;
  };

  return (
    <View
      style={[
        parseStyle(styles.topContent),
        bottomLine && parseStyle(styles.bottomLine),
      ]}>
      <View style={parseStyle(styles.flexRow)}>
        {!end && (
          <Text style={[parseStyle(styles.topTimeText)]}>
            {transformToDisplayEta(item.get('eta'))}到达
          </Text>
        )}
        {end && (
          <View>
            <Text
              style={[
                parseStyle(styles.topTimeText),
                { width: '100%', color: '#6a6a6a' },
              ]}>
              {transformToDisplayAta(item.get('ata'))}&nbsp;&nbsp;&nbsp;&nbsp;
              <Text
                style={[parseStyle(styles.statusText), { color: STATUS[item.get('status')].color }]}>
                {STATUS[item.get('status')].text}
              </Text>
            </Text>
          </View>
        )}
        <MyPointToTargetPointDistanceText
          targetPoint={[item.get('targetLng'), item.get('targetLat')]}
        />
        {!end && (
          <CountDown targetTime={moment(item.get('eta')).toDate().getTime()} />
        )}
      </View>
      {item.get('itemType') && (
        <TouchableOpacity onPress={handleCallPhone}>
          <View
            style={[parseStyle(styles.flexRow), parseStyle(styles.phoneView)]}>
            <Text style={parseStyle(styles.connectName)}>
              {typeInfo.connectName}
            </Text>
            <SvgIcon size="20" icon="phone" color={typeInfo.phoneColor} />
          </View>
        </TouchableOpacity>
      )}
      {
        item.get('status') === 'completed' && <View style={styles.elapsedTimeView}>
          <Text style={styles.elapsedTimeText}>用时:  {secondTransform()}</Text>
        </View>
      }
    </View>
  );
};

/**
 * 位置信息
 * showDash 是否显示虚线
 * locationType take send
 * type '1' '2'
 * opacityFlag
 */
const POINT_COLOR = {
  take: '#597EF7',
  send: '#FFA328',
};
export function PostitionInfo({
  showDash,
  locationType,
  opacityFlag,
  name,
  location,
}) {
  const [dashedSum, setDashedSum] = React.useState([]);

  /**
   * 计算虚线个数
   *  虚线容器高度 = 实际高度 -  top  +  bottom
   *  虚线个数 = 虚线容器高度 / 单个虚线高度
   *  需用scaleSize转换样式中的高度值
   */
  const handleCalculateDashedSum = (e) => {
    if (!showDash) return;
    const height = e.nativeEvent.layout.height - scaleSize(12);
    const arr = parseInt(height / scaleSize(3));
    setDashedSum(new Array(arr).fill(0));
  };

  return (
    <View
      style={[
        parseStyle(styles.postionContent),
        parseStyle({ marginTop: locationType === 'send' ? 4 : 0 }),
      ]}
      onLayout={handleCalculateDashedSum}>
      <View style={parseStyle(styles.postionContentLeft)}>
        <View
          style={[
            parseStyle(styles.postionContentLeftPoint),
            { backgroundColor: POINT_COLOR[locationType] },
          ]}
        />
      </View>
      <View
        style={[
          parseStyle(styles.postionContentRight),
          { opacity: opacityFlag ? 0.35 : 1 },
        ]}>
        <Text style={parseStyle(styles.postionContentRightName)}>{name}</Text>
        <Text style={parseStyle(styles.postionContentRightDes)}>
          {location}
        </Text>
      </View>
      {showDash && (
        <View style={parseStyle(styles.dashedLine)}>
          {dashedSum.map((data, i) => (
            <View key={i} style={parseStyle(styles.dashedItem)} />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  topContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
    height: 23,
    paddingLeft: 8,
  },
  topTimeText: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: 'bold',
    color: '#FB980A',
    width: 64,
  },
  statusText: {
    color: '#414141',
    fontWeight: 'normal',
    marginLeft: 130,
  },
  topDis: {
    fontSize: 10,
    lineHeight: 16,
    fontWeight: 'bold',
    color: '#505050',
    marginLeft: 6,
  },
  elapsedTimeView: {
    paddingRight: scaleSize(8),
  },
  elapsedTimeText: {
    fontSize: scaleSize(12),
    color: '#414141',
    lineHeight: scaleSize(16),
  },
  countDown: {
    fontSize: 12,
    lineHeight: 16,
    color: '#414141',
  },
  bottomLine: {
    borderBottomColor: '#D8D8D8',
    borderBottomWidth: 1,
  },
  phoneView: {
    width: 85,
    borderLeftColor: '#D8D8D8',
    borderLeftWidth: 1,
    justifyContent: 'center',
    height: 23,
  },
  connectName: {
    fontSize: 12,
    color: '#414141',
  },

  postionContent: {
    position: 'relative',
    flexDirection: 'row',
    paddingRight: 8,
    paddingLeft: 8,
  },
  postionContentLeft: {
    width: 6,
    marginTop: 9,
    marginRight: 2,
  },
  postionContentLeftPoint: {
    width: 6,
    height: 6,
    backgroundColor: 'blue',
    borderRadius: 6,
  },
  postionContentRight: {
    flex: 1,
  },
  postionContentRightName: {
    color: 'rgba(80, 80, 80, 1)',
    fontSize: 14,
    lineHeight: 21,
    fontWeight: 'bold',
  },
  postionContentRightDes: {
    color: 'rgba(65, 65, 65, 1)',
    fontSize: 12,
    lineHeight: 16,
  },
  dashedLine: {
    top: 16,
    left: 10.5,
    height: '100%',
    position: 'absolute',
  },
  dashedItem: {
    marginTop: 2,
    width: 1,
    height: 2,
    backgroundColor: '#C9C9C9',
  },
});
