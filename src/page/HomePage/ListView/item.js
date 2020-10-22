import * as React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, TouchableOpacity } from 'react-native';

import { Colors } from '../../../resource';
import { parseStyle } from '../../../utils/ScreenUtil';
import { navigate } from '../../../utils/NavigationService';

import HiButton from '../../../components/HiButton';

import { TopInfo, PostitionInfo, Remark } from './ItemCom';

const TOP_COLOR = {
  newTask: { topColor: '#fff', btnBac: Colors.themeBacColor },
  waitFetching: {
    topColor: Colors.themeBacColor,
    btnBac: Colors.themeBacColor,
  },
  distributionTask: { topColor: '#FFA328', btnBac: '#FFA328' },
};

function Item({ type }) {
  const handleJumpDetail = () => navigate('DetailPage');

  /**
   *  按钮事件， 判断不同类型做不同操作
   */
  const handleOrderBtn = async () => {
    navigate('DetailPage');
  };

  // 中间信息(地理位置，备注)
  const renderMiddleInfo = () => {
    const status = type === 'newTask' ? 0 : type === 'waitFetching' ? 0 : 1;
    return (
      <View style={parseStyle(styles.middleContent)}>
        <PostitionInfo
          isFirst
          status={status}
          showDash={type === 'newTask'}
        />
        {type === 'newTask' && (
          <PostitionInfo isFirst={false} status={1} />
        )}
        <Remark />
      </View>
    );
  };

  /**
   *  订单操作按钮
   */
  const renderButton = () => {
    const btnText =
      type === 'newTask' ? '抢单' : type === 'waitFetching' ? '开始' : '完成';
    return (
      <HiButton
        text={btnText}
        buttonStyle={{
          borderRadius: 0,
          backgroundColor: TOP_COLOR[type].btnBac,
        }}
        onPress={handleOrderBtn}
      />
    );
  };

  return (
    <TouchableOpacity onPress={handleJumpDetail}>
      <View
        style={[
          parseStyle(styles.container),
          { borderTopColor: TOP_COLOR[type].topColor },
        ]}>
        <View style={[parseStyle(styles.content)]}>
          <TopInfo type={type} />
          {renderMiddleInfo()}
        </View>
        {renderButton()}
      </View>
    </TouchableOpacity>
  );
}

/**
 * type
 *  newTask | waitFetching | distributionTask
 */
Item.propTypes = {
  type: PropTypes.string.isRequired,
  data: PropTypes.object.isRequired,
};
export default Item;

const styles = StyleSheet.create({
  container: {
    marginTop: 12,
    marginRight: 8,
    marginLeft: 8,
    borderTopWidth: 1,
  },
  content: {
    backgroundColor: '#fff',
    paddingTop: 12,
    paddingRight: 8,
    paddingBottom: 12,
    paddingLeft: 8,
  },

  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  middleContent: {
    position: 'relative',
  },
});
