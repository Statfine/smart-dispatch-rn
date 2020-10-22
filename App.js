/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useMemo } from 'react';
import { I18nManager } from 'react-native';
import { RootSiblingParent } from 'react-native-root-siblings';
import './src/helper/Reactotron';
import store from './src/redux/store';
import { Provider } from 'react-redux';

import InitRoot from './src/routes';
import EStyleSheet from 'react-native-extended-stylesheet';

const App: () => React$Node = () => {
  I18nManager.forceRTL(false); // is Right to Left （I18nManager.isRTL）
  useMemo(() => EStyleSheet.build(), []);
  return (
    <RootSiblingParent>
      <Provider store={store}>
        <InitRoot/>
      </Provider>
    </RootSiblingParent>
  );
};

export default App;
