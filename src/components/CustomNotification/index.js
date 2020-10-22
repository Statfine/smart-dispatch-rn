/**
 * Component: 应用内通知组件
 * 已废弃
 */
import * as React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';

import { isiOS, isiPhoneX } from '../../utils/Device';

export default function CustomNotification() {

  const [isShow, setIsShow] = React.useState(false);

  React.useEffect(() => {
    setTimeout(() => {
      setIsShow(true);
    }, 5000);
  }, []);

  const STATUS_BAR_HEIGHT = isiOS()
    ? isiPhoneX()
      ? 34
      : 20
    : StatusBar.currentHeight;

  const handleClickNotic = () => setIsShow(false);

  const headerStyle = [
    { height: 0, backgroundColor: '#fff' },
    isiOS() && {
      height: STATUS_BAR_HEIGHT,
    },
  ];

  if (!isShow) return null;
  return (
    <View style={styles.notificationContainer}>
      <View style={headerStyle} />
      <TouchableOpacity style={styles.notificationContent} onPress={handleClickNotic}>
        <Text style={{ margin: 10, fontSize: 15, textAlign: 'left' }}>
          I'm in CustomNotification!
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  notificationContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    backgroundColor: '#fff',
    opacity: 0.9,
    zIndex: 999,
  },
  notificationContent: {
    height: 60,
    justifyContent: 'center',
  },
});
