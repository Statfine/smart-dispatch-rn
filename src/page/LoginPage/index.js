import React, { useEffect, useState } from 'react';
import {
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
  FlatList,
  TouchableOpacity
} from 'react-native';

import { AppConfig } from '../../common/constants';
import { Colors } from '../../resource';
import showToast from '../../utils/Toast';
import DeviceStorage from '../../utils/Storage';
import { parseStyle, scaleSize } from '../../utils/ScreenUtil';

import Header from '../../components/Header';
import SvgIcon from '../../components/SvgIcon';
import HiButton from '../../components/HiButton';
import { getAllStaff } from '../../services';
import { generateDefaultQueryParams } from '../../utils/CommonUtil';
import { useDispatch } from 'react-redux';
import ActionTypes from '../../redux/ActionTypes';
import { eventLocation } from '../../utils/Location';

function LoginPage ({ navigation }) {
  const [userName, setUserName] = useState('');
  // const [password, setPassword] = useState('');
  const [staffs, setStaffs] = useState([]);

  const dispatch = useDispatch();
  const handlePress = async () => {
    const staff = staffs.find(item => item.staffName === userName);
    if (userName === '' || !staff) {
      showToast('请输入正确的用户名或者密码');
    } else {
      dispatch({ type: ActionTypes.SET_ACCOUNT_INFO, data: staff });
      await DeviceStorage.set(DeviceStorage.keys.userInfo, staff);
      Keyboard.dismiss();
      eventLocation();
      navigation.replace('Home');
    }
  };

  useEffect(() => {

    async function init () {
      // 清楚redux
      dispatch({ type: ActionTypes.SET_ACCOUNT_INFO, data: null });
      dispatch({ type: ActionTypes.SET_ITEM_LIST, data: [] });
      await DeviceStorage.remove(DeviceStorage.keys.userInfo);
      // 获取员工列表
      const result = await getAllStaff(generateDefaultQueryParams().getCriteria());
      setStaffs(result.data.data || []);
    }

    init();

  }, []);

  const renderTop = () => (
    <View style={parseStyle(styles.loginTop)}>
      <SvgIcon size="46" icon="logo" color="#fff"/>
      <Text style={parseStyle(styles.appNameText)}>{AppConfig.appName}</Text>
    </View>
  );

  const renderLoginContent = () => (
    <View style={parseStyle(styles.loginContainer)}>
      <TextInput
        style={parseStyle(styles.editInput)}
        placeholder="邮箱|用户名"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
        clearButtonMode="while-editing"
        // autoFocus
        underlineColorAndroid="transparent"
      />
      <View style={styles.staffListView}>
        <FlatList
          alwaysBounceVertical={false}
          // style={[accountStyle.flatView, {height: getAdjustPx2x(3 * 54)}]}
          data={staffs}
          keyExtractor={(item) => item.name}
          renderItem={({ item, index }) => (
            <AccountItem item={item} onPress={setUserName}/>
          )}
        />
      </View>
      {/*<TextInput*/}
      {/*  style={parseStyle(styles.editInput)}*/}
      {/*  placeholder="密码"*/}
      {/*  value={password}*/}
      {/*  onChange={(e) => setPassword(e.target.value)}*/}
      {/*  clearButtonMode="while-editing"*/}
      {/*  underlineColorAndroid="transparent"*/}
      {/*  secureTextEntry*/}
      {/*/>*/}
      <HiButton
        text="登录"
        onPress={handlePress}
        buttonStyle={styles.button}
      />
      <Text style={parseStyle(styles.findPassword)}>忘记密码？</Text>
    </View>
  );

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={parseStyle(styles.container)}>
        <Header hiddenHeader/>
        {renderTop()}
        {renderLoginContent()}
      </View>
    </TouchableWithoutFeedback>
  );
}

function AccountItem ({ item, onPress }) {
  const onSelect = () => {
    onPress(item.staffName);
  };
  return (
    <TouchableOpacity style={styles.accountItem} onPress={onSelect}>
      <Text style={styles.accountText}>{item.staffName}</Text>
    </TouchableOpacity>
  );
}

export default LoginPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loginTop: {
    height: 201,
    backgroundColor: Colors.themeBacColor,
    alignItems: 'center',
    justifyContent: 'center',
  },
  containerLogo: {
    height: 46,
    width: 46,
  },
  appNameText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 18,
  },
  loginContainer: {
    paddingRight: 35,
    paddingLeft: 35,
    paddingTop: 86,
    backgroundColor: '#fff',
  },
  editInput: {
    fontSize: 18,
    marginBottom: 38,
    borderBottomColor: '#d8d8d8',
    borderBottomWidth: 1,
  },
  button: {
    height: 48,
    marginTop: 38,
  },
  findPassword: {
    fontSize: 16,
    lineHeight: 20,
    color: '#C9C9C9',
    marginTop: 40,
    textAlign: 'center',
  },
  staffListView: {
    zIndex: 10,
    backgroundColor: 'rgb(252, 252, 252)',
    height: scaleSize(45 * 5),
  },
  accountItem: {
    height: scaleSize(45),
    justifyContent: 'center',
  },
  accountText: {
    fontSize: scaleSize(13),
    color: '#d8d8d8'
  }
});
