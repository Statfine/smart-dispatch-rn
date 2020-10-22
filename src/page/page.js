import * as React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { i18n } from '../language/I18n';
import { BizContext } from '../utils/BizContext';
import { HiforceCom } from '../utils/HiforceCom';
import { parseStyle } from '../utils/ScreenUtil';
import { postRequest } from '../utils/RequestUtil';
import { pubOnClickEvent, subOnClickEvent } from '../utils/EventBus';

// import { useNavigation } from '@react-navigation/native'

export default class Page extends React.Component {
  state = {};

  UNSAFE_componentWillMount() {
    // const { navigation, route } = this.props;
    console.log('navigation', this.props.navigation);
    HiforceCom.setHiforceCom('qwe_123', this);
    BizContext.setBizContext('app', 'first App');
    subOnClickEvent(data => {
      console.log('subOnClickEvent', data);
    });
    this.handleFetchData();
  }

  // 获取筛选项
  handleFetchData = async () => {
    try {
      const data = await postRequest(
        'http://192.168.0.85:9080/public/mock/api/tag/list',
      );
      console.log('data', data);
    } catch (error) {
      console.error(error);
    }
  };

  componentWillUnmount() {
    const { route } = this.props;
    console.log(route.name, 'componentWillUnmount');
  }

  render() {
    const { navigation, route } = this.props;
    console.log(HiforceCom, BizContext);
    return (
      <SafeAreaView style={styles.View}>
        <View style={{ flexDirection: 'row' }}>
          <Text style={parseStyle({ width: 150, backgroundColor: 'green' })}>
            {route.name}
          </Text>
          <Text>{i18n.t('hello')}</Text>
        </View>
        <Button
          title={i18n.t('go_detail')}
          onPress={() =>
            navigation.push('Detail', {
              from: route.name,
            })
          }
        />
        <Button title="event" onPress={() => pubOnClickEvent('123')} />
        <Button
          title="toggleDrawer"
          onPress={() => navigation.toggleDrawer()}
        />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  View: {
    flex: 1,
    // alignItems: 'center',
    // justifyContent: 'center',
  },
});
