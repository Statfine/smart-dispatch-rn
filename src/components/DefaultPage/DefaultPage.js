import React from 'react';
import { View, Image, Text } from 'react-native';
import EstyleSheet from 'react-native-extended-stylesheet';
import Images from '../../resource/Images';
import { getAdjustPx2x, scaleSize } from '../../utils/ScreenUtil';

const typeTextMap = {
  'loading': '数据加载中...',
  'noData': '暂无数据...'
};

export default function DefaultPage ({ type = 'loading', bacStyle }: any) {
  return (
    <View style={[styles.container, bacStyle]}>
      <Image style={styles.image} source={Images.common.ic_empty}/>
      <Text style={styles.loadingText}>{typeTextMap[type]}</Text>
    </View>
  );
}

const styles = EstyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgb(236, 236, 236)'
  },
  image: {
    width: scaleSize(212),
    height: scaleSize(226),
    marginBottom: scaleSize(23)
  },
  loadingText: {
    fontSize: scaleSize(14),
    color: 'rgb(165,178,208)'
  }
});
