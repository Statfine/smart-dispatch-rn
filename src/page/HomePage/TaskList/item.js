import React, { memo, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import { StyleSheet, Text, TouchableOpacity, View, Alert } from 'react-native';

import { parseStyle, scaleSize } from '../../../utils/ScreenUtil';
import { navigate } from '../../../utils/NavigationService';

import HiButton from '../../../components/HiButton';

import { TopInfo, PostitionInfo } from './itemCom';
import { getPagedTaskItemList, updateWorkStatus } from '../../../services';
import ActionTypes from '../../../redux/ActionTypes';
import { useDispatch } from 'react-redux';
import { immuablize } from '../../../utils/ImmutableUtil';
import { generateDefaultQueryParams } from '../../../utils/CommonUtil';
import { get } from 'lodash';
import showToast from '../../../utils/Toast';

const actionTypeStyleMap = {
  primary: { backgroundColor: '#1890FF', flex: 1, height: scaleSize(32.5) },
  danger: { backgroundColor: '#FF7373', flex: 1, height: scaleSize(32.5) },
  default: { backgroundColor: '#FFA328', flex: 1, height: scaleSize(32.5) },
  // primary: { backgroundColor: '#1890FF' },
};
const CANCEL = 'allocated_cancel';

function Item ({ data }) {
  const [requesting, setRequesting] = useState(false);
  const [actions, setAction] = useState(data.get('actions') || immuablize([]));
  const id = data.get('id');
  const taskId = data.get('taskId');
  const name = data.get('itemType') === '1' ? data.get('targetName') : data.get('customerName');
  const address = data.get('targetAddress');
  const dispatch = useDispatch();

  useEffect(() => {
    setAction(data.get('actions') || immuablize([]));
  }, [data]);

  const handleJumpDetail = () => {
    navigate('DetailPage', {
      taskId,
      actions: data.get('actions') || immuablize([])
    });
  };

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
        const res = await getPagedTaskItemList(generateDefaultQueryParams().getCriteria());
        dispatch({ type: ActionTypes.SET_ITEM_LIST, data: get(res, 'data.data') || [] });
      } else if (result.data.status === 400) {
        showToast(result.data.message);
      }
    } catch (error) {
      showToast('请求异常');
    } finally {
      setActions(action, false);
    }
  };

  const setActions = (action, flag) => {
    const list = actions.toJS().map((item) => {
      if (item.actionKey === action.get('actionKey')) {
        item.requesting = flag;
        setRequesting(flag);
      }
      return item;
    });
    setAction(Immutable.fromJS(list));
  };

  const BtnStyle = (i) => {
    if (actions.size === 1) return;
    return i % 2 ? { marginLeft: scaleSize(5) } : { marginRight: scaleSize(5) };
  };

  return (
    <TouchableOpacity onPress={handleJumpDetail}>
      <View style={[parseStyle(styles.container)]} key={id}>
        <View style={[parseStyle(styles.content)]}>
          <TopInfo item={data} bottomLine />
          {/* <Text style={parseStyle(styles.nameText)}>{name}</Text>
          <Text style={parseStyle(styles.addressText)}>{address}</Text> */}
          <PostitionInfo name={data.get('merchantName')} location={data.get('merchantLocationName')} locationType="take" opacityFlag={data.get('itemType') === '2'} showDash/>
          <PostitionInfo name={data.get('customerName')} location={data.get('locationName')} locationType="send" opacityFlag={data.get('itemType') === '1'} />
        </View>
        <View style={styles.actionView}>
          {
            actions.map((action, i) => (
              <HiButton
                buttonStyle={{...actionTypeStyleMap[action.get('actionType').toLowerCase()], ...BtnStyle(i)}}
                onPress={() => onPressBtn(action)}
                disabled={action.get('disable')}
                loading={action.get('requesting')}
                key={taskId + action.get('actionKey')} text={action.get('actionText')}/>
            ))}
        </View>
      </View>
    </TouchableOpacity>
  );
}

/**
 * data
 */
Item.propTypes = {
  data: PropTypes.object.isRequired,
};
export default memo(Item);

const styles = StyleSheet.create({
  container: {
    marginTop: 12,
    marginRight: 8,
    marginLeft: 8,
    paddingBottom: 12,
    borderWidth: 0.5,
    borderColor: '#e3e3e3',
    backgroundColor: '#fff',
  },
  nameText: {
    color: '#505050',
    fontSize: 14,
    lineHeight: 21,
    fontWeight: 'bold',
    paddingRight: 8,
    paddingLeft: 8,
  },
  addressText: {
    color: '#414141',
    fontSize: 12,
    lineHeight: 16,
    paddingRight: 8,
    paddingLeft: 8,
  },

  shopInfoName: {
    color: '#7A7A7A',
    fontSize: 14,
    lineHeight: 21,
  },
  shopInfoAddress: {
    color: '#7A7A7A',
    fontSize: 12,
    lineHeight: 16,
  },
  shopInfoStatus: {
    color: '#6a6a6a',
    fontSize: 12,
    fontWeight: 'bold',
    lineHeight: 16,
    marginTop: 8,
    textAlign: 'right',
  },
  actionView: {
    marginTop: scaleSize(12),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: 8,
    paddingLeft: 8,
  },
});
