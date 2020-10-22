/**
 * Component: 列表组件组件
 */
import * as React from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  FlatList,
  RefreshControl,
  View,
  Text,
  Image,
} from 'react-native';

import SvgIcon from '../SvgIcon';

import { parseStyle } from '../../utils/ScreenUtil';
import { Images } from '../../resource';

const BOTTOM_TEXT = ['', '正在努力加载', '没有更多内容'];
function HiFlatList({
  hRef,
  renderItem,
  ListHeaderComponent,
  ListEmptyComponent,
  emptyInfo,
  data,
  api,
  flatListStyle,
}) {
  const flatListRef = React.useRef();

  const [isRefresh, setIsRefresh] = React.useState(false);
  const [isLoadMore, setIsLoadMore] = React.useState(false);
  const [showFoot, setShowFoot] = React.useState(0); // 控制foot  1：正在加载   2 ：无更多数据
  const [pageIndex, setPageIndex] = React.useState(1);
  const [sourceData, setSourceData] = React.useState([]);

  /**
   * useImperativeHandle  中的方法供父组件使用 hRef.current.scrollToBottom()
   */
  React.useImperativeHandle(
    hRef,
    () => ({
      scrollToBottom() {
        // 跳转到底部
        flatListRef.current.scrollToEnd();
      },
      scrollToTop() {
        //跳转到顶部
        flatListRef.current.scrollToOffset({
          animated: true,
          viewPosition: 0,
          index: 0,
        });
      },
      scrollToIndex(index) {
        flatListRef.current.scrollToIndex({ animated: true, index: index });
      },
    }),
    [],
  );

  React.useEffect(() => {
    if (data.length > 0) {
      setSourceData(data);
    } else asyncFetcData(1);
  }, []);

  const asyncFetcData = async (page) => {
    console.log('start asyncFetcData');
    setFetchData(page);
  };

  const setFetchData = (page) => {
    setPageIndex(page);
  };

  const pullToRefresh = () => {
    if (!isRefresh && !isLoadMore) {
      console.log('refresh====================================');
      setIsRefresh(true);
      setShowFoot(0);
      console.log('refresh====================================');
      asyncFetcData(1);
    }
  };

  const pullUpLoading = ({ distanceFromEnd }) => {
    console.log('distanceFromEnd', distanceFromEnd);
    if (!isLoadMore && !isRefresh) {
      console.log('loadMore====================================');
      setIsLoadMore(true);
      setShowFoot(1);
      console.log('loadMore====================================');
      asyncFetcData(pageIndex + 1);
    }
  };

  const renderEmptyView = () => {
    if (ListEmptyComponent) return <ListEmptyComponent />;
    return (
      <View style={parseStyle(styles.emptyView)}>
        {!!emptyInfo.imgSrc && (
          <Image
            style={parseStyle(styles.emptyViewImg)}
            source={emptyInfo.imgSrc}
          />
        )}
        {!!emptyInfo.icon && <SvgIcon size={216} icon={emptyInfo.icon} />}
        <Text style={parseStyle(styles.emptyViewText)}>{emptyInfo.title}</Text>
      </View>
    );
  };

  const renderButtomView = () => (
    <View>
      {showFoot !== 0 && (
        <Text style={parseStyle(styles.bottomText)}>
          {BOTTOM_TEXT[showFoot]}
        </Text>
      )}
    </View>
  );

  return (
    <FlatList
      ref={flatListRef}
      style={[flatListStyle]}
      data={sourceData}
      renderItem={renderItem}
      keyExtractor={(item) => item.id || item.key} // 指定唯一id作为每一项的key,不要使用index，会在列表更改时都改变，消耗性能
      ListHeaderComponent={() => ListHeaderComponent}
      ListEmptyComponent={renderEmptyView()}
      ListFooterComponent={renderButtomView()}
      refreshControl={
        <RefreshControl refreshing={isRefresh} onRefresh={pullToRefresh} />
      }
      onEndReached={pullUpLoading}
      onEndReachedThreshold={0.1} //当前可视列表高度的十分之一,会触发onEndReached事件
      // getItemLayout={(data, index) => ({ length: Height, offset: (Height + 1) * index, index })} //用于避免动态测量内容尺寸的开销
      initialNumToRender={10}
    />
  );
}

HiFlatList.defaultProps = {
  ref: undefined,
  ListHeaderComponent: null,
  ListEmptyComponent: null,
  emptyInfo: {
    imgSrc: Images.common.ic_empty,
    icon: '',
    title: '当前页面没有内容',
  },
};
/**
 * hRef
 */
HiFlatList.propTypes = {
  hRef: PropTypes.object,
  data: PropTypes.array,
  renderItem: PropTypes.func,
  api: PropTypes.string,
  params: PropTypes.object,
  flatListStyle: PropTypes.object,

  ListHeaderComponent: PropTypes.oneOfType([PropTypes.node, PropTypes.element]),
  ListEmptyComponent: PropTypes.oneOfType([PropTypes.node, PropTypes.element]),
  ListFooterComponent: PropTypes.oneOfType([PropTypes.node, PropTypes.element]),
  emptyInfo: PropTypes.object,
};

export default HiFlatList;

const styles = StyleSheet.create({
  bottomText: {
    color: '#979797',
    fontSize: 14,
    lineHeight: 20,
    marginTop: 16,
    marginBottom: 13,
    textAlign: 'center',
  },
  emptyView: {
    marginTop: '30%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyViewText: {
    color: '#A5B2D0',
    fontSize: 14,
    lineHeight: 20,
    marginTop: 23,
  },
  emptyViewImg: {
    width: 212,
    height: 226,
  },
});
