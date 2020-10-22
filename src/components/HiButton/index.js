/**
 * Component: 按钮组件
 */
import * as React from 'react';
import PropTypes from 'prop-types';

import { TouchableOpacity, View, Text, Image, StyleSheet } from 'react-native';

import LoadingView from '../Loading';

import { parseStyle } from '../../utils/ScreenUtil';
import { Colors } from '../../resource';

function HiButton({
  onPress,
  disabled,
  loading,
  buttonStyle,
  iconSrc,
  iconStyle,
  text,
  textStyle,
  children,
}) {

  return (
    <View style={[parseStyle(styles.container), parseStyle(buttonStyle), disabled && parseStyle(styles.containerDisabeld)]}>
      <TouchableOpacity disabled={disabled} onPress={onPress} style={[parseStyle(styles.defaultStyle)]}>
        {children ? (
          <View>{ children }</View>
        ) : (
          <View style={parseStyle(styles.content)}>
            {iconSrc && (
              <Image style={[parseStyle(styles.icon), parseStyle(iconStyle)]} source={iconSrc} />
            )}
            {loading && <LoadingView />}
            <Text style={[parseStyle(styles.buttonText), parseStyle(textStyle)]}>{text}</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
}

HiButton.propTypes = {
  onPress: PropTypes.func,
  disabled: PropTypes.bool,
  buttonStyle: PropTypes.object,
  iconSrc: PropTypes.string,
  iconStyle: PropTypes.object,
  text: PropTypes.string,
  textStyle: PropTypes.object,
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.element]),
  loading: PropTypes.bool,
};

export default HiButton;

const styles = StyleSheet.create({
  defaultStyle: {
    flex: 1,
  },
  container: {
    backgroundColor: Colors.themeBacColor,
    height: 52,
    borderRadius: 5,
  },
  containerDisabeld: {
    backgroundColor: '#808182',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  icon: {
    marginLeft: 10,
    marginRight: 10,
  },
  buttonText: {
    color: Colors.fontColor,
    fontSize: 18,
    lineHeight: 25,
    fontWeight: 'bold',
  },
});
