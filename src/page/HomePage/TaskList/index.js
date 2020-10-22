import React, { useCallback, useEffect, useRef, useState } from 'react';
import { DeviceEventEmitter, StyleSheet, Text, View } from 'react-native';
import Item from './item';

import { parseStyle } from '../../../utils/ScreenUtil';
import { useDispatch, useSelector } from 'react-redux';
import DefaultPage from '../../../components/DefaultPage/DefaultPage';
import ActionTypes from '../../../redux/ActionTypes';
import { generateDefaultQueryParams, to } from '../../../utils/CommonUtil';
import HiVirtualizedList from '../../../components/FlatList/HiVirtualizedList';
import { useRefreshingControl } from '../../../hooks/ListHooks';
import { getPagedTaskItemList } from '../../../services';
import { get } from 'lodash';
import { EVENT_HOME_STATUS_CHANGE } from '../../../utils/EventBus';
import showToast from '../../../utils/Toast';

const INTERVAL_TIME = 2000;
function TaskList ({ type }) {
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const queryParams = useRef(generateDefaultQueryParams());
  const fetchingRef = useRef(false);
  const intervalRef = useRef();

  const taskItems = useSelector(state => state.getIn(['tasks', 'itemList']));
  const dispatch = useDispatch();

  const fetchData = useCallback(async () => {
    if (fetchingRef.current) {
      return;
    }

    setLoading(true);

    try {
      fetchingRef.current = true;
      const [err, resp] = await to(getPagedTaskItemList({
        ...queryParams.current.getCriteria(),
        'bundleCode': '',
        'businessIdentityCode': '',
      }));
      console.log('resp', resp);
      if (err) {
        setLoading(false);
        fetchingRef.current = false;
        return;
      }
      const data = get(resp, 'data.data') || [];
      dispatch({ type: ActionTypes.SET_ITEM_LIST, data });
    } catch (error) {
      console.log('error', error);
      showToast('数据异常');
    } finally {
      setLoading(false);
      fetchingRef.current = false;
    }
  }, []);

  const fetchMoreData = useCallback(async () => {
    setLoadingMore(true);
    await fetchData();
  }, [fetchData, setLoadingMore]);

  const refreshingData = useCallback(async () => {
    if (!loadingMore && !loading) {
      console.log('refreshingData');
      queryParams.current.setCurrent(0);
      await fetchData();
    }
  }, [loading, loadingMore]);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener(EVENT_HOME_STATUS_CHANGE, (flag) => {
      clearInterval(intervalRef.current);
      if (flag === 0) {
        fetchData();
        intervalRef.current = setInterval(() => {
          fetchData();
        }, INTERVAL_TIME);
      }
    });
    return () => {
      subscription.remove();
      clearInterval(intervalRef.current);
    };
  }, []);

  const { Comp } = useRefreshingControl(refreshingData);

  // if (loading) {
  //   return <DefaultPage/>;
  // }
  // if (taskItems.isEmpty()) {
  //   return <DefaultPage type="noData"/>;
  // }
  return (
    <View style={parseStyle(styles.container)}>
      <HiVirtualizedList
        refreshing={false}
        onRefresh={refreshingData}
        keyExtractor={(item) => item.get('taskId') + item.get('itemType')}
        // refreshControl={Comp}
        data={taskItems}
        renderItem={({ item }) => <Item data={item}/>}
        loadMore={fetchMoreData}
        hasMore={hasMore}
        ListFooterComponent={loadingMore ? (
          <View><Text style={parseStyle(styles.bottomText)}>正在努力加载</Text></View>
        ) : null}
        ListEmptyComponent={<DefaultPage bacStyle={{ marginTop: '40%' }} type={'noData'}/>}
      />
    </View>
  );
}

/**
 * type
 *  newTask | waitFetching | distributionTask
 */
TaskList.propTypes = {};
export default TaskList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 12,
    backgroundColor: '#ececec',
  },
  bottomText: {
    color: '#979797',
    fontSize: 14,
    lineHeight: 20,
    marginTop: 16,
    marginBottom: 13,
    textAlign: 'center',
  },
});
