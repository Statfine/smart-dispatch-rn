import * as React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image } from 'react-native';
import _ from 'lodash';

import SvgIcon from '../../components/SvgIcon';
import { parseStyle } from '../../utils/ScreenUtil';
import { Images } from '../../resource';

export const pointTypes = {
  isTakePoint (type) {
    return type === 'task/take';
  },
  isSendPoint (type) {
    return type === 'task/send';
  }
};

/**
 *  顶部提示
 */
export const TopHintView = () => (
  <View style={parseStyle(styles.hintView)}>
    <View style={parseStyle(styles.hintContent)}>
      <View
        style={[
          parseStyle(styles.hintViewPoint),
          parseStyle({ backgroundColor: '#597EF7', marginLeft: 15.5 }),
        ]}
      />
      <Text style={parseStyle(styles.hintViewText)}>取餐</Text>
      <View
        style={[
          parseStyle(styles.hintViewPoint),
          parseStyle({ backgroundColor: '#FFA328', marginLeft: 12 }),
        ]}
      />
      <Text style={parseStyle(styles.hintViewText)}>送餐</Text>
    </View>
  </View>
);

/**
 *  地图坐标点
 *  type类型 shop-取餐  client-送餐
 *  index
 */
export const PointMarkView = ({ info }) => {
  if (_.isEmpty(info)) return (
    <View style={parseStyle(styles.marker)}>
      <SvgIcon
        size={24}
        icon={'map_type_fetch'}
      />
    </View>
  );
  return (
    (
      <View style={parseStyle(styles.marker)}>
        <SvgIcon
          size={24}
          icon={pointTypes.isTakePoint(info.type) ? 'map_type_fetch' : 'map_type_send'}
        />
        <Text style={parseStyle(styles.markerText)}>{info.index + 1}</Text>
      </View>
    )
  );
};

export const BottomPositionInfo = ({
  buttomInfo,
  distance,
  handleNavigation,
}) => (
  <View style={parseStyle(styles.positionView)}>
    <View style={parseStyle(styles.positionViewLeft)}>
      <View style={parseStyle(styles.positionViewTop)}>
        <Text style={parseStyle(styles.positionViewText)}>
          目标位置:（点击地图位置切换）
        </Text>
        <Text style={parseStyle(styles.positionViewText)}>{buttomInfo && distance}</Text>
      </View>
      <View style={parseStyle(styles.positionViewBotton)}>
        <PointMarkView info={buttomInfo}/>
        <Text
          style={[
            parseStyle(styles.positionViewText),
            parseStyle({ fontSize: 14 }),
          ]}
          numberOfLines={1}
        >
          {!_.isEmpty(buttomInfo) ? buttomInfo.name : '当前没有目标位置'}
        </Text>
      </View>
    </View>
    {
      !_.isEmpty(buttomInfo) && <TouchableOpacity
        onPress={handleNavigation}
        style={parseStyle(styles.positionViewRight)}>
        <View style={styles.positionViewRightContent}>
          <SvgIcon size={32} icon="map_navigation"/>
          <Text style={parseStyle(styles.navigationViewText)}>高德导航</Text>
        </View>
      </TouchableOpacity>
    }
  </View>
);

export const TriangleHint = ({ text }) => (
  <View style={parseStyle({  height: 52, marginBottom: 20 })}>
    <View style={parseStyle(styles.triangleHintContent)}>
      {
        !!text && <View style={parseStyle(styles.triangleHintView)}>
          <Text style={parseStyle(styles.triangleHintText)}>{text}</Text>
        </View>
      }
      {
        !!text && <View style={parseStyle(styles.triangleHintIcon)}><View style={parseStyle(styles.triangle)}/></View>
      }
      <View style={{ alignItems: 'center' }}>
        <Image
          style={parseStyle({ width: 24, height: 24 })}
          source={Images.qishou}
        />
      </View>
    </View>
  </View>
);

const styles = StyleSheet.create({
  hintView: {
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    top: 4,
  },
  hintContent: {
    flexDirection: 'row',
    borderWidth: 0.5,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    width: 116,
    height: 28,
    borderRadius: 28,
    alignItems: 'center',
  },
  hintViewPoint: {
    width: 8,
    height: 8,
    borderRadius: 8,
  },
  hintViewText: {
    color: '#414141',
    marginLeft: 4,
    fontSize: 12,
    lineHeight: 16,
  },

  marker: {
    position: 'relative',
    width: 24,
    height: 24,
    backgroundColor: 'transparent',
  },
  markerText: {
    color: '#fff',
    zIndex: 99,
    fontSize: 10,
    position: 'absolute',
    width: 24,
    height: 24,
    lineHeight: 20,
    textAlign: 'center',
    top: 0,
    left: 0,
    // backgroundColor: 'red',
  },

  positionView: {
    position: 'absolute',
    left: 17.5,
    bottom: 17.5,
    width: 296,
    flexDirection: 'row',
    borderWidth: 0.5,
    borderColor: '#dbdbdb',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  positionViewLeft: {
    flex: 1
  },
  positionViewTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 4,
    paddingRight: 4,
    height: 25,
    borderBottomColor: '#c9c9c9',
    borderBottomWidth: 0.5,
  },
  positionViewText: {
    color: '#414141',
    fontSize: 12,
    lineHeight: 16,
    marginLeft: 5,
  },
  positionViewBotton: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 35.5,
    paddingLeft: 4,
    paddingRight: 4,
  },
  positionViewRight: {
    width: 60,
    alignItems: 'center',
    justifyContent: 'center',
    borderLeftColor: '#c9c9c9',
    borderLeftWidth: 1,
  },
  positionViewRightContent: {
    width: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navigationViewIcon: {
    width: 51,
    height: 51,
  },
  navigationViewText: {
    color: '#414141',
    fontSize: 12,
    lineHeight: 18,
    fontWeight: 'bold',
  },

  triangleHintContent: {
    position: 'relative',
    backgroundColor: 'transparent',
  },
  triangleHintView: {
    backgroundColor: '#fff',
    borderRadius: 4,
    paddingTop: 3.5,
    paddingBottom: 3.5,
    paddingRight: 8,
    paddingLeft: 8,
  },
  triangleHintText: {
    color: '#000',
    opacity: 0.65,
    fontSize: 10,
    lineHeight: 14,
    fontWeight: 'bold',
  },
  triangle: {
    width: 0,
    height: 0,
    borderTopWidth: 5,
    borderTopColor: '#fff',
    borderRightWidth: 5,
    borderRightColor: 'transparent',
    borderLeftWidth: 5,
    borderLeftColor: 'transparent',
    borderBottomWidth: 2.5,
    borderBottomColor: 'transparent',
    marginTop: -0.5,
  },
  triangleHintIcon: {
    alignItems: 'center',
  }
});
