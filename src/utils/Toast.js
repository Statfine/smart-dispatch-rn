/**
 * utils  提示
 */

import Toast from 'react-native-root-toast';

function showToast(title, params = {}) {
  const defaultParams = {
    duration: Toast.durations.LONG,
    position: Toast.positions.BOTTOM,
  };
  Toast.show(title, {...defaultParams, params});
}

export default showToast;
