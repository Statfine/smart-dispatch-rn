import React, { useCallback, useMemo } from 'react';
import { VirtualizedList } from 'react-native';
import { isFunction } from 'lodash';
import ListData from '../../mock/taskListMock.json';
import { immuablize } from '../../utils/ImmutableUtil';
import { useVirtualListFns } from '../../hooks/ListHooks';
import DefaultPage from '../DefaultPage/DefaultPage';

export default function HiVirtualizedList ({ data, renderItem, loadMore, hasMore, keyExtractor: propsKeyExtractor, ...rest }) {
  const { getItem, getItemCount, keyExtractor } = useVirtualListFns();
  const pageProps = useMemo(() => {
    if (hasMore && isFunction(loadMore)) {
      return {
        onEndReachedThreshold: 0.1,
        onEndReached: loadMore
      };
    }
    return {};
  }, [hasMore, loadMore]);

  return (
    <VirtualizedList
      // ref={r=>this.ref=r}
      // onScroll={this.onScroll}
      // showsVerticalScrollIndicator={false}
      // onScrollEndDrag={this.onScrollEnd}
      data={data}
      getItem={getItem}
      keyExtractor={propsKeyExtractor || keyExtractor}
      renderItem={renderItem}
      getItemCount={getItemCount}
      {...pageProps}
      {...rest}
    />
  );
}

