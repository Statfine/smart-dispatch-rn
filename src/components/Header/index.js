import * as React from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import SvgIcon from '../../components/SvgIcon';

import { parseStyle } from '../../utils/ScreenUtil';
import { isiOS, isiPhoneX } from '../../utils/Device';

import { Colors } from '../../resource';

function Header({
  hiddenHeader,
  hiddenLeft,
  hiddenRight,
  hiddenNotice,
  hiddenPath,
  title,
  leftType,
  leftContent,
  rightContent,
}) {
  const navigation = useNavigation();

  // ios判断顶部栏高度
  const STATUS_BAR_HEIGHT = isiOS()
    ? isiPhoneX()
      ? 34
      : 20
    : StatusBar.currentHeight;

  const handlePressLeft = () => {
    if (leftType === 'user') navigation.openDrawer();
    else navigation.goBack();
  };

  const handlePressNotice = () => navigation.push('MessagePage');
  const handlePressPathPlan = () => navigation.push('PathPlanPage');

  const renderLeft = () => {
    if (leftContent)
      return (
        <View style={[parseStyle(styles.leftContainer)]}>{leftContent}</View>
      );
    return (
      <View style={[parseStyle(styles.leftContainer)]}>
        {!hiddenLeft && (
          <TouchableOpacity
            style={parseStyle(styles.itemContent)}
            onPress={handlePressLeft}>
            <SvgIcon
              size="20"
              icon={leftType === 'user' ? 'drawer' : 'back'}
              color="#ffffff"
            />
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const renderCenter = () => (
    <View style={[styles.centerContainer]}>
      <Text style={parseStyle(styles.title)}>{title}</Text>
    </View>
  );

  const renderRight = () => {
    if (rightContent)
      return (
        <View style={[parseStyle(styles.rightContent)]}>{rightContent}</View>
      );
    return (
      <View style={[parseStyle(styles.rightContent)]}>
        {!hiddenPath && !hiddenRight && (
          <TouchableOpacity
            style={parseStyle(styles.itemContent)}
            onPress={handlePressPathPlan}>
            <View style={parseStyle(styles.notieContent)}>
              <SvgIcon size="20" icon="path" color="#ffffff" />
            </View>
          </TouchableOpacity>
        )}
        {!hiddenPath && !hiddenRight && (
          <TouchableOpacity
            style={parseStyle(styles.itemContent)}
            onPress={handlePressNotice}>
            <View style={parseStyle(styles.notieContent)}>
              <SvgIcon size="20" icon="notice" color="#ffffff" />
              <View style={parseStyle(styles.noticeDot)} />
            </View>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  // 兼容IOS顶部栏
  const headerStyle = [
    { height: 0, backgroundColor: Colors.themeBacColor },
    isiOS() && {
      height: STATUS_BAR_HEIGHT,
    },
  ];
  return (
    <>
      <View style={headerStyle}>
        <StatusBar
          backgroundColor={Colors.themeBacColor}
          barStyle={'light-content'}
        />
      </View>
      {!hiddenHeader && (
        <View style={parseStyle(styles.container)}>
          {renderLeft()}
          {renderCenter()}
          {renderRight()}
        </View>
      )}
    </>
  );
}

Header.defaultProps = {
  hiddenHeader: false,
  hiddenLeft: false,
  hiddenRight: false,
  hiddenNotice: false,
  hiddenPath: false,
  leftType: 'back', // user back
};
Header.propTypes = {
  hiddenLeft: PropTypes.bool,
  hiddenRight: PropTypes.bool,
  hiddenNotice: PropTypes.bool,
  hiddenPath: PropTypes.bool,
  leftType: PropTypes.string,
  title: PropTypes.string,
  leftContent: PropTypes.node,
  rightContent: PropTypes.node,
};
export default Header;

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 44,
    backgroundColor: Colors.themeBacColor,
  },
  centerContainer: {},
  title: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.fontColor,
  },
  leftContainer: {
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    width: 100,
  },
  itemContent: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 44,
    width: 50,
  },
  rightContent: {
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: 100,
  },
  iconRight: {
    width: 20,
    height: 20,
  },
  notieContent: {
    position: 'relative',
  },
  noticeDot: {
    width: 8,
    height: 8,
    borderRadius: 10,
    backgroundColor: 'red',
    position: 'absolute',
    top: 0,
    right: 0,
  },
});
