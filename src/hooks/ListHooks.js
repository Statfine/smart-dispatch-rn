import React, { useCallback, useState } from 'react';
import { RefreshControl } from 'react-native';

export function useVirtualListFns () {
  const getItem = useCallback((item, index) => item.get(index), []);

  const keyExtractor = useCallback((item, index) => (item.get('id') + item.get('itemType')) || item.get('key') || index, []);

  const getItemCount = useCallback((item) => item ? item.size : 0, []);

  return { getItem, keyExtractor, getItemCount };
}

export function useRefreshingControl (onRefresh) {
  const [refreshing, setRefreshing] = useState(false);
  const onRefreshing = useCallback(async () => {
    setRefreshing(true);
    await onRefresh();
    setRefreshing(false);
  }, [onRefresh]);

  const Comp = <RefreshControl refreshing={refreshing} onRefresh={onRefreshing}/>;

  return { setRefreshing, Comp };
}
