import React, { useEffect, useState } from 'react';
import { SectionList, Text, TouchableOpacity, View } from 'react-native';
import StyleSheet from 'react-native-extended-stylesheet';
import { scaleSize } from '../../utils/ScreenUtil';
import Header from '../../components/Header';
import SvgIcon from '../../components/SvgIcon';
import { navigate } from '../../utils/NavigationService';
import { getHistoryWork } from '../../services';
import store from '../../redux/store';
import { get, groupBy, sortBy } from 'lodash';
import DefaultPage from '../../components/DefaultPage/DefaultPage';
import showToast from '../../utils/Toast';
import moment from 'moment';

const STATUS_INFO = {
  FINISHED: {
    color: 'rgba(133, 133, 133, 1)',
    text: '已送达',
  },
  CANCELED: {
    color: 'rgba(255, 94, 55, 1)',
    text: '已退单',
  },
};

function HistoryPage () {
  const [originalList, setOriginalList] = useState([]);
  const [list, setList] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getHistoryWork({
        'currentPage': page,
        'pageSize': 20,
        'staffId': store.getState().getIn(['accounts', 'account', 'id']),
        // 'status': 'FINISHED',
        'tenantId': store.getState().getIn(['accounts', 'account', 'tenantId'])
      });
      console.log('HistoryPage', page, res);

      const currentPage = get(res, 'data.currentPage', 1);
      const dataTotal = get(res, 'data.total', 1);
      const dataPageSize = get(res, 'data.pageSize', 1);
      setTotal(dataTotal);
      setHasMore(Math.ceil(dataTotal / dataPageSize) > currentPage);
      const dataList = get(res, 'data.data', []);
      if (page === 1) setOriginalList(dataList);
      else {
        setOriginalList(originalList.concat(dataList));
      };
    } catch (error) {
      showToast('数据异常');
    } finally {
      setLoadingMore(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(page);
  }, [page]);

  // 组装成list所需数据格式
  useEffect(() => {
    const data = groupBy((originalList || []).map(item => ({
      time: item.ata,
      locationName: item.locationName || '',
      status: item.status,
      taskId: item.taskId,
    })), (item) => {
      return moment(item.time).format('MM-DD');
    });
    // setList(Object.keys(data).reduce((result, nextItem) => {
    //   result.push({ title: nextItem, data: data[nextItem] });
    //   return result;
    // }, []));
    setList(Object.keys(data).reduce((result, nextItem) => {
      result.push({
        title: nextItem,
        data: sortBy(data[nextItem], (item) => {
          return -item.time;
        })
      });
      return result;
    }, []));
  }, [originalList]);

  const handleRefresh = () => {
    if (loading) return;
    if (page === 1) fetchData();
    else setPage(1);
  };

  const handleLoadMore = () => {
    if (loading) return;
    if (hasMore) {
      setPage(page + 1);
      setLoadingMore(true);
    }
  };

  return (
    <View style={styles.View}>
      <Header hiddenRight title={total !== 0 ? `历史任务(${total})` : '历史任务'}/>
      <SectionList
        refreshing={list.length === 0 && loading}
        onRefresh={handleRefresh}
        ListEmptyComponent={<DefaultPage bacStyle={{ backgroundColor: '#fff', marginTop: '40%' }} type={list.length === 0 && loading ? 'loading' : 'noData'}/>}
        sections={list}
        keyExtractor={(item, index) => item + index}
        renderItem={({ item }) => <Item data={item}/>}
        renderSectionHeader={SectionHeader}
        onEndReachedThreshold={0.1}
        onEndReached={handleLoadMore}
        ListFooterComponent={loadingMore ? (
          <View><Text style={styles.bottomText}>正在努力加载</Text></View>
        ) : null}
      />
    </View>

  );
}

function SectionHeader ({ section: { title } }) {
  return (
    <View style={styles.header}>
      <View style={{ flexDirection: 'row' }}>
        <Text style={[styles.headerText]}>{title}</Text>
      </View>
    </View>
  );
}

function Item ({ data }) {
  const gotoDetail = () => {
    navigate('DetailPage', {
      taskId: data.taskId,
      fromPage: 'history',
    });
  };

  const statusInfo = STATUS_INFO[data.status];

  return (
    <TouchableOpacity style={styles.itemView} onPress={gotoDetail} activeOpacity={0.7}>
      <View style={styles.leftContent}>
        <Text style={styles.timeText}>{moment(data.time).format('HH:mm')}</Text>
        <Text style={styles.addrText}>{data.locationName}</Text>
      </View>
      <View style={styles.rightContent}>
        <Text style={[styles.rightText, { color: statusInfo.color}]}>{statusInfo.text}</Text>
        <SvgIcon style={styles.icon} size={16} icon={'back'} color="#616161"/>
      </View>
    </TouchableOpacity>
  );
}

export default HistoryPage;

const styles = StyleSheet.create({
  View: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingLeft: scaleSize(12),
    height: scaleSize(32),
    justifyContent: 'center',
    borderTopColor: '#D8D8D8',
    borderTopWidth: 1,
  },
  itemView: {
    paddingHorizontal: scaleSize(12),
    // height: scaleSize(45),
    paddingTop: scaleSize(10),
    paddingBottom: scaleSize(10),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lineView: {
    width: '100%',
    height: scaleSize(1),
    backgroundColor: '#f7f8f9',
  },
  rightContent: {
    flexDirection: 'row',
    alignItems: 'center',
    width: scaleSize(65),
  },
  leftContent: {
    flexDirection: 'row',
    flex: 1,
    paddingRight: scaleSize(40),
  },
  addrText: {
    color: 'rgba(106, 106, 106, 1)',
    fontSize: scaleSize(14),
    marginLeft: scaleSize(7)
  },
  timeText: {
    color: 'rgba(65, 65, 65, 1)',
    fontSize: scaleSize(13)
  },
  icon: {
    transform: [{ rotate: '180deg' }]
  },
  rightText: {
    color: 'rgba(133, 133, 133, 1)',
    fontSize: scaleSize(13),
    marginRight: scaleSize(9)
  },
  headerTextWrapper: {
    width: scaleSize(68),
    height: scaleSize(20),
    backgroundColor: 'rgba(236, 236, 236, 1)'
  },
  headerText: {
    color: 'rgba(106, 106, 106, 1)',
    fontSize: scaleSize(12),
    backgroundColor: '#ECECEC',
    paddingLeft: scaleSize(11.5),
    paddingRight: scaleSize(11.5),
    height: scaleSize(20),
    lineHeight: scaleSize(20),
    borderRadius: scaleSize(3),
  },
  bottomText: {
    color: '#979797',
    fontSize: scaleSize(14),
    lineHeight: scaleSize(20),
    marginTop: scaleSize(16),
    marginBottom: scaleSize(13),
    textAlign: 'center',
  },
});

