/**
 * Component: 侧边栏组件
 */
import * as React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  DeviceEventEmitter,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import SvgIcon from '../SvgIcon';

import { ifIphoneX, iPhoneXBottomOffset, parseStyle } from '../../utils/ScreenUtil';
import { cleanEventLocation } from '../../utils/Location';
import {
  monitorNotification,
  closeNotification,
} from '../../utils/NotificationListener';
import { EVENT_DRAWER } from '../../utils/EventBus';
import { useDispatch, useSelector } from 'react-redux';
import { useReduxByPath } from '../../hooks/ReduxHooks';
import { immuablize } from '../../utils/ImmutableUtil';
import { startAcceptOrder, stopAcceptOrder } from '../../services';
import ActionTypes from '../../redux/ActionTypes';

const CONTENT1 = [
  { icon: 'credit', title: '积分', des: '247' },
  { icon: 'order_today', title: '今日接单', des: '17' },
  { icon: 'income', title: '今日收入', des: '277.00' },
];
const CONTENT2 = [
  { icon: 'completion_rate', title: '办结率', des: '90.9%' },
  { icon: 'response_time', title: '平均响应时长', des: '2min' },
  { icon: 'dispose_time', title: '平均处理时长', des: '40min' },
];
const CONTENT3 = [
  { icon: 'notice_outline', title: '消息列表', route: 'MessagePage' },
  { icon: 'history', title: '历史任务', route: 'HistoryPage' },
  { icon: 'set', title: '设置', route: 'HomePage' },
];

export default function SidebarDrawer ({ data }) {
  const { navigation } = data;

  const dispatch = useDispatch();
  React.useEffect(() => {
    initData();
    // 订阅打开抽屉事件，做信息请求
    const subscription = DeviceEventEmitter.addListener(EVENT_DRAWER, () => {
      initData();
    });
    return () => subscription.remove();
  }, []);

  const initData = async () => {
    console.log('fetch user info');
  };

  const handleJumpHome = (route = 'HomePage') => {
    closeDrawer();
    if (route === 'LoginPage') {
      cleanEventLocation();
      navigation.replace('LoginPage');
    } else navigation.navigate(route);
  };

  const closeDrawer = () => {
    navigation.closeDrawer();
  };

  // 执行推送轮训
  const changeStartTakeOrders = async (flag) => {
    // todo: 改变接口状态接口对接
    // if (flag) monitorNotification();
    // else closeNotification();
    let res;
    if (flag) {
      res = await startAcceptOrder();

    } else {
      res = await stopAcceptOrder();

    }
    if (res.data.status === 200) {
      // 更新redux
      dispatch({ type: ActionTypes.SWITCH_ACCEPT_ORDER });
    }

  };

  const renderRow = (item) => {
    return (
      <TouchableOpacity onPress={() => handleJumpHome(item.route)} key={item.title}>
        <View style={parseStyle(styles.contentItem)}>
          <View style={parseStyle(styles.flexRow)}>
            <SvgIcon size="20" icon={item.icon} color="#616161"/>
            <Text style={parseStyle(styles.contentTitle)}>
              {item.title}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  const userAccount = useReduxByPath(['accounts', 'account'], immuablize({}));
  const switchValue = userAccount.get('acceptOrders');
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.userContainer}>
        <TouchableOpacity onPress={() => handleJumpHome('HomePage')}>
          <View style={parseStyle(styles.userContent)}>
            <View style={parseStyle(styles.flexRow)}>
              <Image
                style={parseStyle(styles.userAvatar)}
                source={{ uri: 'http://avatar.csdn.net/2/1/1/1_shiquanqq.jpg' }}
              />
              <View>
                <Text style={parseStyle(styles.userName)}>{userAccount.get('staffName')}</Text>
                <Text style={parseStyle(styles.userNumber)}>编号：{userAccount.get('staffNumber')}</Text>
              </View>
            </View>
            <SvgIcon
              size="12"
              icon="back"
              color="#C7C7CC"
              style={{ transform: [{ rotateZ: '180deg' }] }}
            />
          </View>
        </TouchableOpacity>
        <View style={parseStyle(styles.contentItem)}>
          <View style={parseStyle(styles.flexRow)}>
            <SvgIcon
              size="20"
              icon="task"
              color={switchValue ? '#597EF7' : '#616161'}
            />
            <Text
              style={[
                parseStyle(styles.contentTitle),
                switchValue && parseStyle(styles.contentTitleChoosed),
              ]}>
              接单中
            </Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
            <Switch value={switchValue} onValueChange={changeStartTakeOrders}/>
          </View>
        </View>
      </View>

      {[CONTENT1, CONTENT2].map((content) => (
        <View style={parseStyle(styles.content)} key={content[0].title}>
          {content.map(renderRow)}
        </View>
      ))}

      <View style={parseStyle(styles.content)}>
        {CONTENT3.map((item) => (
          <TouchableOpacity onPress={() => handleJumpHome(item.route)} key={item.title}>
            <View style={parseStyle(styles.contentItem)}>
              <View style={parseStyle(styles.flexRow)}>
                <SvgIcon size="20" icon={item.icon} color="#616161"/>
                <Text style={parseStyle(styles.contentTitle)}>
                  {item.title}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.exitRow}>
        {renderRow({ title: '退出登录', icon: 'exit', route: 'LoginPage' })}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  textStyle: {
    margin: 10,
    fontSize: 15,
  },
  userContainer: {},
  userContent: {
    paddingTop: 20,
    paddingRight: 20,
    paddingBottom: 17,
    paddingLeft: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userAvatar: {
    width: 52,
    height: 52,
    borderRadius: 52,
    marginRight: 16.5,
  },
  userName: {
    color: '#000000',
    opacity: 0.65,
    fontSize: 18,
    fontWeight: 'bold',
  },
  userNumber: {
    color: '#000000',
    opacity: 0.65,
    fontSize: 14,
    fontWeight: 'bold',
  },

  content: {
    paddingTop: 4,
    paddingBottom: 4,
    borderTopColor: '#D8D8D8',
    borderTopWidth: 1,
  },
  contentItem: {
    height: 45,
    paddingLeft: 20,
    paddingRight: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  contentTitle: {
    color: '#000000',
    opacity: 0.65,
    fontSize: 16,
    marginLeft: 8,
  },
  contentTitleChoosed: {
    color: '#597EF7',
    opacity: 1,
  },
  exitRow: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: '#F3F3F3',
    width: '100%',
    // ...ifIphoneX({
    //   marginBottom: iPhoneXBottomOffset
    // })
  }
});
