import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Colors } from '../../resource';
import DeviceStorage from '../../utils/Storage';
import { parseStyle } from '../../utils/ScreenUtil';
import { AppConfig } from '../../common/constants';

import Header from '../../components/Header';
import SvgIcon from '../../components/SvgIcon';
import { getAllStaff } from '../../services';
import { generateDefaultQueryParams } from '../../utils/CommonUtil';
import ActionTypes from '../../redux/ActionTypes';
import { useDispatch } from 'react-redux';
import { eventLocation } from '../../utils/Location';
import { get } from 'lodash';

function WelcomePage ({ navigation }) {
  const dispatch = useDispatch();
  const init = async () => {
    const userInfo = await DeviceStorage.get(DeviceStorage.keys.userInfo);
    if (userInfo) {
      const result = await getAllStaff(generateDefaultQueryParams().getCriteria());
      const staffs = get(result, 'data.data', []);
      dispatch({
        type: ActionTypes.SET_ACCOUNT_INFO,
        data: staffs.find(item => item.staffName === userInfo.staffName)
      });
      eventLocation();
      navigation.replace('Home');
    } else {

      navigation.replace('LoginPage');
    }
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <View style={styles.View}>
      <Header hiddenHeader/>
      <View style={parseStyle(styles.container)}>
        <SvgIcon size="72" icon="logo" color="#fff"/>
        <Text style={parseStyle(styles.appNameText)}>{AppConfig.appName}</Text>
      </View>
    </View>
  );
}

export default WelcomePage;
export const styles = StyleSheet.create({
  View: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.themeBacColor,
    paddingTop: 184,
    alignItems: 'center',
  },
  containerLogo: {
    height: 46,
    width: 46,
  },
  appNameText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 18,
  },
});
