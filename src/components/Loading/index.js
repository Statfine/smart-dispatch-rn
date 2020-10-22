import React, { PureComponent } from 'react';
import { StyleSheet, Animated, Easing } from 'react-native';

import { Images } from '../../resource';
import { parseStyle } from '../../utils/ScreenUtil';

class LoadingView extends PureComponent {
  constructor(props) {
    super(props);
    this.spinValue = new Animated.Value(0);
  }
  componentDidMount() {
    this.spin();
  }
  //旋转方法
  spin = () => {
    this.spinValue.setValue(0);
    Animated.timing(this.spinValue, {
      toValue: 1, // 最终值 为1，这里表示最大旋转 360度
      duration: 1000,
      useNativeDriver: true,
      easing: Easing.linear,
    }).start(() => this.spin());
  };
  render() {
    //映射 0-1的值 映射 成 0 - 360 度
    const spin = this.spinValue.interpolate({
      inputRange: [0, 1], //输入值
      outputRange: ['0deg', '360deg'], //输出值
    });
    return (
      <Animated.Image
        style={[styles.circle, { transform: [{ rotate: spin }] }]}
        source={Images.loading}
      />
    );
  }
}
const styles = StyleSheet.create({
  circle: parseStyle({
    width: 20,
    height: 20,
    marginLeft: 10,
    marginRight: 10,
  }),
});
export default LoadingView;
