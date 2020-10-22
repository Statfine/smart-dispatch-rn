/**
 * Item 内组件
 *  TopInfo 顶部信息
 *  Remark 备注信息
 *  PostitionInfo 首页列表 单个位置信息
 *  MapPostitionInfo 地图详情 单个位置信息 (要是和PostitionInfo重复，调整的地方写在行内)
 */
import * as React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

import { Colors, Images } from '../../../resource';
import { parseStyle, scaleSize } from '../../../utils/ScreenUtil';
import SvgIcon from '../../../components/SvgIcon';

const STATE_COLOR = [
  { title: '取餐', color: Colors.themeBacColor },
  { title: '送餐', color: '#FFA328' },
];

/**
 * 顶部统一信息
 * type
 *  newTask | waitFetching | distributionTask
 */
export const TopInfo = ({ type }) => {
  let LeftInfo = { color: '#414141', text: '' };
  switch (type) {
  case 'waitFetching':
    LeftInfo = { color: '#414141', text: `剩余${40}min 预计需要${30}min` };
    break;
  case 'distributionTask':
    // LeftInfo = { color: '#FF5E37', text: `已超时${2}分钟` };
    LeftInfo = { color: '#6A6A6A', text: `剩余${2}分钟` };
    break;
  default:
    break;
  }

  return (
    <View style={parseStyle(styles.topContent)}>
      <View style={parseStyle(styles.flexRow)}>
        <SvgIcon size="20" icon="timer" color="#FFA328"/>
        <Text style={parseStyle(styles.topTimeText)}>15:00</Text>
        <Text style={parseStyle(styles.topStatus)}>送达</Text>
      </View>
      <Text style={[parseStyle(styles.topMoneyText)]}>
        <Text
          style={[
            parseStyle(styles.topMoneyNumber),
            { color: LeftInfo.color },
          ]}>
          {LeftInfo.text}
        </Text>
      </Text>
    </View>
  );
};

/**
 * 位置信息
 * isFirst 影响 marginTop
 * status 0-取餐 1-送餐
 * showDash 是否显示虚线
 */
export function PostitionInfo ({ isFirst = true, status = 0, showDash }) {
  const [dashedSum, setDashedSum] = React.useState([]);

  /**
   * 计算虚线个数
   *  虚线容器高度 = 实际高度 -  top  +  bottom
   *  虚线个数 = 虚线容器高度 / 单个虚线高度
   *  需用scaleSize转换样式中的高度值
   */
  const handleCalculateDashedSum = (e) => {
    if (!showDash) return;
    const height = e.nativeEvent.layout.height - scaleSize(32) + scaleSize(12);
    const arr = parseInt(height / scaleSize(4));
    setDashedSum(new Array(arr).fill(0));
  };

  return (
    <View
      style={[
        parseStyle(styles.postionContent),
        parseStyle({ marginTop: isFirst ? 0 : 12 }),
      ]}
      onLayout={handleCalculateDashedSum}>
      <View style={parseStyle(styles.postionContentLeft)}>
        <Text style={parseStyle(styles.postionContentLeftDis)}>645m</Text>
        <Text
          style={[
            parseStyle(styles.postionContentLeftStatus),
            { color: STATE_COLOR[status].color },
          ]}>
          {STATE_COLOR[status].title}
        </Text>
      </View>
      <View style={parseStyle(styles.postionContentRight)}>
        <Text style={parseStyle(styles.postionContentRightName)}>
          玉胜祥水煮鱼乡玉胜祥水煮鱼乡玉胜祥水煮鱼乡玉胜祥水煮鱼乡
        </Text>
        <Text style={parseStyle(styles.postionContentRightDes)}>
          广东省深圳市南山区蛇口工业三路1号汇港购物中心B1层ole（海上世界地铁站B出口）
        </Text>
      </View>
      {showDash && (
        <View style={parseStyle(styles.dashedLine)}>
          {dashedSum.map((data, i) => (
            <View key={i} style={parseStyle(styles.dashedItem)}/>
          ))}
        </View>
      )}
    </View>
  );
}

// 备注
export function Remark () {
  const [reamekIsFold, setReamekIsFold] = React.useState(false);
  const [reamekOpen, setReamekOpen] = React.useState(false);

  return (
    <TouchableOpacity
      onPress={() => {
        setReamekOpen(!reamekOpen);
      }}
    >
      <View style={parseStyle(styles.remarkContent)}>
        <Text
          style={parseStyle(styles.remarkTitle)}
          numberOfLines={reamekIsFold ? (reamekOpen ? null : 1) : null}
          onLayout={(e) => {
            if (e.nativeEvent.layout.height > 18) {
              // 多于一行时改为可折叠
              if (!reamekIsFold) setReamekIsFold(true);
            }
          }}>
          不要葱不要葱不要葱不要葱不要葱不要葱不要葱不要葱不要葱不要葱
        </Text>
        {reamekIsFold && (
          <View style={[parseStyle(styles.flexRow), parseStyle(styles.remarkRightView)]}>
            <Text style={parseStyle(styles.remarkOpenText)}>
              {reamekOpen ? '收起' : '展开'}
            </Text>
            <SvgIcon
              size="12"
              icon="back"
              color={Colors.themeBacColor}
              style={{ transform: [{ rotateZ: `${reamekOpen ? 90 : 270}deg` }] }}
            />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

/**
 * 地图页面位置信息
 * isFirst 影响 marginTop
 * status 0-取餐 1-送餐
 * showDash 是否显示虚线
 */
export function MapPositionInfo ({ isFirst = true, status = 0, showDash, distance, name, address }) {
  const [dashedSum, setDashedSum] = React.useState([]);
  const [height, setHeight] = React.useState(0);

  /**
   * 计算虚线个数
   *  虚线容器高度 = 实际高度 -  top  +  bottom
   *  虚线个数 = 虚线容器高度 / 单个虚线高度
   *  需用scaleSize转换样式中的高度值
   */
  const handleCalculateDashedSum = (e) => {
    if (!showDash) return;
    const height = e.nativeEvent.layout.height - scaleSize(26) + scaleSize(16);
    setHeight(height);
    const arr = parseInt(height / scaleSize(4), 10);
    setDashedSum(new Array(arr).fill(0));
  };

  return (
    <View
      style={[
        parseStyle(styles.postionContent),
        parseStyle({ marginTop: isFirst ? 0 : 16 }),
      ]}
      onLayout={handleCalculateDashedSum}>
      <View>
        <Image
          style={parseStyle(styles.postionContentLeftImg)}
          source={status === 0 ? Images.map.ic_fetch_text : Images.map.ic_send_text}
        />
      </View>
      <View style={[parseStyle(styles.postionContentRight), parseStyle({ marginLeft: 9.5 })]}>
        <Text style={[parseStyle(styles.postionContentRightName), parseStyle({ fontSize: 14, lineHeight: 18 })]}>
          {name}
        </Text>
        <Text style={[parseStyle(styles.postionContentRightDes), parseStyle({ fontSize: 12, lineHeight: 16 })]}>
          {address}
        </Text>
      </View>
      {showDash && (
        <View style={[parseStyle(styles.dashedLine), parseStyle({ top: 24, left: 11 })]}>
          {dashedSum.map((data, i) => (
            <View key={i} style={parseStyle(styles.dashedItem)}/>
          ))}
        </View>
      )}
      {
        showDash && <View style={[parseStyle(styles.distanceView), parseStyle({ top: 24 + (height - 16) / 2 })]}><Text style={styles.distanceText}>{distance}m</Text></View>
      }
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
    marginBottom: 12,
  },
  topTimeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FB980A',
  },
  topStatus: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FB980A',
  },
  topMoneyText: {
    fontSize: 12,
  },
  topMoneyNumber: {
    fontSize: 12,
    lineHeight: 16,
  },

  postionContent: {
    position: 'relative',
    flexDirection: 'row',
  },
  postionContentLeft: {
    width: 46,
  },
  postionContentLeftImg: {
    width: 24,
    height: 24,
  },
  postionContentLeftDis: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#505050',
    lineHeight: 16,
  },
  postionContentLeftStatus: {
    fontSize: 9,
    textAlign: 'center',
    width: 32,
    lineHeight: 14,
  },
  postionContentRight: {
    flex: 1,
  },
  postionContentRightName: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#505050',
    lineHeight: 21,
  },
  postionContentRightDes: {
    fontSize: 12,
    color: '#414141',
    marginTop: 4,
    lineHeight: 16,
  },

  dashedLine: {
    top: 32,
    left: 14.5,
    height: '100%',
    position: 'absolute',
  },
  dashedItem: {
    marginTop: 2,
    width: 1,
    height: 2,
    backgroundColor: '#888',
  },

  remarkContent: {
    marginTop: 8,
    marginLeft: 46,
    backgroundColor: 'rgba(89,126,247,0.1)',
    padding: 4,
    flexDirection: 'row',
    // alignItems: 'center',
    justifyContent: 'space-between',
  },
  remarkTitle: {
    color: '#606C93',
    fontSize: 12,
    lineHeight: 16,
    flex: 1,
  },
  remarkRightView: {
    height: 16,
  },
  remarkOpenText: {
    color: Colors.themeBacColor,
    fontSize: 11,
    fontWeight: 'bold',
    lineHeight: 16,
  },
  distanceView: {
    position: 'absolute',
    backgroundColor: '#fff',
    height: 16,
    textAlign: 'center',
  },
  distanceText: {
    fontSize: 10,
    color: 'rgba(80, 80, 80, 1)',
  },
});
