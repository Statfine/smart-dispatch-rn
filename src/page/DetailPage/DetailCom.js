import * as React from 'react';
import { ScrollView, StyleSheet, Text, View, Alert, TouchableOpacity } from 'react-native';
import Immutable from 'immutable';
import HiButton from '../../components/HiButton';
import { MapPositionInfo } from '../HomePage/ListView/ItemCom';
import { updateWorkStatus } from '../../services';
import RoutePlan from '../../utils/RoutePlan';
import SvgIcon from '../../components/SvgIcon';

import { parseStyle, scaleSize } from '../../utils/ScreenUtil';
import { TopInfo } from '../HomePage/TaskList/itemCom';
import { getDistanceBetweenTwoPoints } from '../../utils/Location';
import { immuablize } from '../../utils/ImmutableUtil';
// import ActionRender from '../HomePage/TaskList/ActionRender';
import showToast from '../../utils/Toast';

const actionTypeStyleMap = {
  primary: { backgroundColor: '#1890FF', flex: 1, height: scaleSize(32.5) },
  danger: { backgroundColor: '#FF7373', flex: 1, height: scaleSize(32.5) },
  default: { backgroundColor: '#FFA328', flex: 1, height: scaleSize(32.5) },
  // primary: { backgroundColor: '#1890FF' },
};

export const DetailBottom = ({ taskId, data, actions }) => {
  const [requesting, setRequesting] = React.useState(false);
  const [actionList, setAction] = React.useState(actions);
  if (!data) {
    return null;
  }
  const shopName = data.getIn(['taskInfoRespDTO', 'merchantName']);
  const shopAddr = data.getIn(['taskInfoRespDTO', 'merchantLocationName']);
  const targetName = data.getIn(['taskInfoRespDTO', 'customerName']);
  const targetAddr = data.getIn(['taskInfoRespDTO', 'locationName']);
  const shopPosition = [
    data.getIn(['taskInfoRespDTO', 'merchantLocationLng']),
    data.getIn(['taskInfoRespDTO', 'merchantLocationLat']),
  ];
  const targetPosition = [
    data.getIn(['taskInfoRespDTO', 'locationLng']),
    data.getIn(['taskInfoRespDTO', 'locationLat']),
  ];
  const distance = getDistanceBetweenTwoPoints(shopPosition, targetPosition);

  const onPressBtn = (action) => {
    if (requesting || action.get('disable')) return;
    if (action.toJS().doubleConfirm) {
      Alert.alert('', '是否确认进行该操作',
        [
          {text:'取消'},
          {text:'确认', onPress: () => changeStatus(action)},
        ]
      );
    } else changeStatus(action);
  };

  const changeStatus = async (action) => {
    setActions(action, true);
    try {
      const result = await updateWorkStatus(action.toJS());
      if (result.data.status === 200) {
        setActionsDown(action);
      } else if (result.data.status === 400) {
        showToast(result.data.message);
        setActions(action, false);
      }
    } catch (error) {
      showToast('请求异常');
    }
  };

  const setActions = (action, flag) => {
    const list = actionList.toJS().map((item) => {
      if (item.actionKey === action.get('actionKey')) {
        item.requesting = flag;
        setRequesting(flag);
      }
      if (!flag) item.requesting = flag; // 异常情况都重置
      return item;
    });
    setAction(Immutable.fromJS(list));
  };

  const setActionsDown = (action) => {
    const list = actionList.toJS().map((item) => {
      if (item.actionKey === action.get('actionKey')) {
        item.requesting = false;
        item.actionText = `${item.actionText}（已完成）`;
      }
      item.disable = true;
      return item;
    });
    setAction(Immutable.fromJS(list));
  };

  const BtnStyle = (i) => {
    if (actions.size === 1) return;
    return i % 2 ? { marginLeft: scaleSize(5) } : { marginRight: scaleSize(5) };
  };

  const taskInfoRespDTO = data.get('taskInfoRespDTO');
  const end = taskInfoRespDTO.get('status') === 'cancel' || taskInfoRespDTO.get('status') === 'completed';

  const handleCallPhone = (phone) => RoutePlan.openPhone(phone);
  return (
    <View style={parseStyle(styles.bottomView)}>
      <ScrollView>
        <View
          style={[
            parseStyle(styles.bottomViewContent),
            // actions ? parseStyle({  paddingBottom: 52 * actions.size + (12 * (actions.size - 1)) + 14 + 7 }) : parseStyle({ paddingBottom: 14 }),
            !actions && parseStyle({ paddingBottom: 14 }),
          ]}>
          <TopInfo item={data.get('taskInfoRespDTO')} />
          <View style={styles.locationView} >
            <MapPositionInfo
              isFirst
              status={0}
              showDash
              distance={distance}
              name={shopName}
              address={shopAddr}
            />
            <MapPositionInfo
              isFirst={false}
              status={1}
              name={targetName}
              address={targetAddr}
            />
          </View>
          {
            !end ? <View style={parseStyle(styles.phoneView)}>
              <TouchableOpacity style={[parseStyle(styles.eachPhoneView), styles.flexRow]} onPress={() => handleCallPhone(taskInfoRespDTO.get('merchantCorrespondence'))}>
                <View style={[styles.flexRow]}>
                  <Text style={styles.phoneText}>联系商家</Text>
                  <SvgIcon size="23" icon="phone" color="#597EF7"/>
                </View>
              </TouchableOpacity>
              <View style={styles.phoneLine} />
              <TouchableOpacity style={[parseStyle(styles.eachPhoneView), styles.flexRow]} onPress={() => handleCallPhone(taskInfoRespDTO.get('customerCorrespondence'))}>
                <View style={[styles.flexRow]}>
                  <Text style={styles.phoneText}>联系客户</Text>
                  <SvgIcon size="23" icon="phone" color="#FFA328"/>
                </View>
              </TouchableOpacity>
            </View> : <View style={{ borderTopColor: '#D8D8D8', borderTopWidth: scaleSize(1), marginLeft: scaleSize(8), marginRight: scaleSize(8) }} />
          }
          <DetailedInfo
            list={data.getIn(['workOrderInfoRespDTO', 'extMap', 'productItems']) || []}
            description={data.getIn(['workOrderInfoRespDTO', 'description'])}
          />
        </View>
      </ScrollView>
      {actionList && (
        <View style={parseStyle(styles.buttonView)}>
          {/* <ActionRender actions={actions} taskId={taskId} onPress={() => {}}/> */}
          {actionList.map((action, i) => (
            <HiButton
              buttonStyle={
                {...actionTypeStyleMap[action.get('actionType').toLowerCase()], ...BtnStyle(i)}
              }
              onPress={() => onPressBtn(action)}
              disabled={action.get('disable')}
              loading={action.get('requesting')}
              key={taskId + action.get('actionKey')}
              text={action.get('actionText')}
            />
          ))}
        </View>
      )}
    </View>
  );
};

export const DetailedInfo = ({ list, description }: any) => {
  return (
    <View style={parseStyle(styles.detailedInfoView)}>
      <Text style={parseStyle(styles.detailedInfoViewTitle)}>商品清单</Text>
      {list.map((item) => (
        <View
          style={parseStyle(styles.detailedItemView)}
          key={item.get('productId')}>
          <Text style={[parseStyle(styles.detailedItemText)]}>
            {item.get('productName')}
          </Text>
          <View style={[parseStyle(styles.flexRow)]}>
            <Text style={[parseStyle(styles.detailedItemText)]}>
              x{item.get('number')}
            </Text>
            <Text
              style={[
                parseStyle(styles.detailedItemText),
                parseStyle({ width: 94, textAlign: 'right' }),
              ]}>
              ¥{item.get('price')}
            </Text>
          </View>
        </View>
      ))}
      <View style={parseStyle(styles.detailedItemView)}>
        <Text style={[parseStyle(styles.detailedItemText)]}>实付</Text>
        <View style={parseStyle(styles.flexRow)}>
          <Text
            style={[
              parseStyle(styles.detailedItemText),
              parseStyle({ width: 94, textAlign: 'right' }),
            ]}>
            ¥
            {list.reduce((result, current) => {
              return result + current.get('price') * current.get('number');
            }, 0)}
          </Text>
        </View>
      </View>
      {
        description && <View style={parseStyle(styles.remarkContent)}>
          <Text style={parseStyle(styles.remarkTitle)}>缺货时请与我联系</Text>
        </View>
      }
    </View>
  );
};

const styles = StyleSheet.create({
  bottomView: {
    // position: 'absolute',
    width: '100%',
    // bottom: 0,
    backgroundColor: '#fff',
    justifyContent: 'flex-end',
    maxHeight: 365,
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bottomViewContent: {
    paddingTop: 8,
    // paddingRight: 8,
    // paddingLeft: 8,
    paddingBottom: 52, // 按钮52
  },

  locationView: {
    marginBottom: scaleSize(16),
    paddingLeft: scaleSize(8),
    paddingRight: scaleSize(8)
  },

  detailedInfoView: {
    paddingLeft: 8,
    paddingRight: 8
  },
  detailedInfoViewTitle: {
    color: '#414141',
    fontSize: 16,
    fontWeight: 'bold',
    lineHeight: 20,
    marginBottom: 4,
    marginTop: 16,
  },
  detailedItemView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  detailedItemText: {
    color: '#414141',
    fontSize: 12,
    lineHeight: 16,
  },

  remarkContent: {
    backgroundColor: 'rgba(89,126,247,0.1)',
    paddingTop: 6,
    paddingRight: 16,
    paddingBottom: 6,
    paddingLeft: 16,
  },
  remarkTitle: {
    color: '#606C93',
    fontSize: 12,
    lineHeight: 16,
    flex: 1,
  },
  buttonView: {
    borderRadius: 0,
    position: 'absolute',
    bottom: 0,
    width: '100%',
    padding: 7,
    borderTopColor: '#d8d8d8',
    borderTopWidth: 0.5,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  phoneView: {
    backgroundColor: '#F4F4F4',
    height: 45,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  eachPhoneView: {
    flex: 1,
    justifyContent: 'center',
  },
  phoneLine: {
    width: scaleSize(1),
    height: scaleSize(34),
    backgroundColor: '#DDDDDD',
  },
  phoneText: {
    color: '#414141',
    fontSize: scaleSize(12),
  }
});
