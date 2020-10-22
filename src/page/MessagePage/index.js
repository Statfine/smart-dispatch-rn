import * as React from 'react';
import { View, StyleSheet } from 'react-native';

import Header from '../../components/Header';
import HiFlatList from '../../components/FlatList';

function MessagePage({ navigation }) {
  return (
    <View style={styles.View}>
      <Header hiddenRight title="消息通知" />
      <HiFlatList data={[]} renderItem={() => <View />} />
    </View>
  );
}

export default MessagePage;
const styles = StyleSheet.create({
  View: {
    flex: 1,
  },
});
