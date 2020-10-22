import * as React from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Text,
} from 'react-native';
import { SceneMap, TabView, TabBar } from 'react-native-tab-view';
import { DeviceEventEmitter } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import PathPlanPage from '../PathPlanPage';
import Header, { styles as headerStyles } from '../../components/Header';
import TaskList from './TaskList';
import { getUserLocation } from '../../services';

import { scaleSize, parseStyle } from '../../utils/ScreenUtil';
import SvgIcon from '../../components/SvgIcon';
import ActionTypes from '../../redux/ActionTypes';

import { EVENT_HOME_STATUS_CHANGE, EVENT_HOME_SWIPEENABLED } from '../../utils/EventBus';

// const routes = [
//   { key: 'newTask', title: '新任务' },
//   { key: 'waitFetching', title: '待取货' },
//   { key: 'distributionTask', title: '配送中' },
// ];

// const renderScene = SceneMap({
//   newTask: () => <ListView type="newTask" />,
//   waitFetching: () => <ListView type="waitFetching" />,
//   distributionTask: () => <ListView type="distributionTask" />,
// });

const routes = [
  { key: 'taskList', title: '待办事项' },
  { key: 'routePlan', title: '路径规划' },
];

const renderScene = SceneMap({
  taskList: TaskList,
  routePlan: PathPlanPage,
});

const DimensionsWidth = Dimensions.get('window').width;
const initialLayout = { width: DimensionsWidth };
// const indicatorLeft = DimensionsWidth / 2 / 2 + scaleSize(15); // tabview选中Item下划线居中
// const indicatorLeftRightItem = DimensionsWidth / 2 / 2 - scaleSize(45); // tabview选中Item下划线居中

const INTERVAL_TIME = 2000;
function HomePage({ navigation }) {
  const [index, setIndex] = React.useState(0);
  const [swipeEnabled, setSwipeEnabled] = React.useState(true);
  const tabIndexRef = React.useRef();
  const intervalRef = React.useRef();

  const account = useSelector((state) => state.getIn(['accounts', 'account']));
  const dispatch = useDispatch();

  const fetchLocation = async () => {
    if (!account) return;
    try {
      const locationResult = await getUserLocation({
        staffId: account.toJS().id,
        tenantId: account.toJS().tenantId,
      });
      if (locationResult.data.latitude && locationResult.data.longitude) {
        console.log('fetchLocation', locationResult);
        const location = {
          longitude: Number(locationResult.data.longitude),
          latitude: Number(locationResult.data.latitude),
        };
        dispatch({ type: ActionTypes.SET_MY_CURRENT_POINT, data: location });
      }
    } catch (error) {
      console.error('地理位置获取失败');
    }
  }

  React.useEffect(() => {
    tabIndexRef.current = 0;
    const subscriptionRef = DeviceEventEmitter.addListener(
      EVENT_HOME_SWIPEENABLED,
      (flag) => {
        setSwipeEnabled(flag);
      },
    );
    const unblursubscribe = navigation.addListener('blur', (i) => {
      DeviceEventEmitter.emit(EVENT_HOME_STATUS_CHANGE, -1);
    });
    const unfocussubscribe = navigation.addListener('focus', () => {
      DeviceEventEmitter.emit(EVENT_HOME_STATUS_CHANGE, tabIndexRef.current);
    });
    intervalRef.current = setInterval(() => {
      fetchLocation();
    }, INTERVAL_TIME);

    return () => {
      subscriptionRef.remove();
      unblursubscribe;
      unfocussubscribe;
      clearInterval(intervalRef.current);
    };
  }, []);

  const onIndexChange = (i) => {
    setIndex(i);
    tabIndexRef.current = i;
    // TODO  事件通知对应组件做加载
    DeviceEventEmitter.emit(EVENT_HOME_STATUS_CHANGE, i);
  };

  const handlePressLeft = () => {
    navigation.openDrawer();
  };

  const renderHeader = () => (
    <View
      style={[
        parseStyle(headerStyles.container),
        { justifyContent: 'center' },
      ]}>
      <View
        style={[
          parseStyle(headerStyles.leftContainer),
          { position: 'absolute', left: 0, top: 1 },
        ]}>
        <TouchableOpacity
          style={parseStyle(headerStyles.itemContent)}
          onPress={handlePressLeft}>
          <SvgIcon size="22" icon="drawer" color="#ffffff" />
        </TouchableOpacity>
      </View>
      <View style={styles.flexRow}>
        {routes.map((item, i) => (
          <TouchableOpacity onPress={() => onIndexChange(i)} key={item.key}>
            <View style={styles.headerCenterItemView}>
              <Text
                style={[
                  styles.headerCenterTitle,
                  i === index && styles.headerCenterTitleChoosed,
                ]}>
                {item.title}
              </Text>
              <View
                style={[
                  styles.headerCenterBottomLine,
                  i === index && styles.headerCenterBottomLineChoosed,
                ]}
              />
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header hiddenHeader />
      {renderHeader()}
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={onIndexChange}
        initialLayout={initialLayout}
        lazy={true}
        swipeEnabled={swipeEnabled}
        renderTabBar={
          (props) => null
          // 样式调整导致动画有影响，所以不用自带TabBar
          // <TabBar
          //   {...props}
          //   style={{
          //     backgroundColor: Colors.themeBacColor,
          //     paddingLeft: 60,
          //     paddingRight: 60,
          //   }}
          //   getLabelText={({ route }) => route.title}
          //   labelStyle={parseStyle({ fontSize: 16 })}
          //   indicatorStyle={[
          //     parseStyle({ backgroundColor: '#fff', width: 30, height: 3 }),
          //     { marginLeft: index === 0 ? indicatorLeft : indicatorLeftRightItem },
          //   ]}
          //   activeColor={'#ffffff'}
          //   inactiveColor={'#D7E0FF'}
          // />
        }
      />
    </View>
  );
}

export default HomePage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerCenterItemView: {
    marginLeft: scaleSize(23),
    marginRight: scaleSize(23),
    position: 'relative',
    height: scaleSize(44),
    justifyContent: 'center',
  },
  headerCenterTitle: {
    fontSize: scaleSize(18),
    lineHeight: scaleSize(27),
    color: '#d7e0ff',
  },
  headerCenterTitleChoosed: {
    color: '#fff',
  },
  headerCenterBottomLine: {
    position: 'absolute',
    bottom: scaleSize(3),
    left: scaleSize(21),
    width: scaleSize(30),
    height: scaleSize(3),
    borderRadius: scaleSize(15),
  },
  headerCenterBottomLineChoosed: {
    backgroundColor: '#fff',
  },
});
