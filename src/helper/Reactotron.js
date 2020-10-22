import Reactotron from 'reactotron-react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { reactotronRedux } from 'reactotron-redux';
import Immutable from 'immutable';
import { noop } from 'lodash';

export default Reactotron
  .setAsyncStorageHandler(AsyncStorage) // AsyncStorage would either come from `react-native` or `@react-native-community/async-storage` depending on where you get it from
  .configure({
    // host: '192.168.0.11'
    // port:'9090'
  }) // controls connection & communication settings
  .useReactNative() // add all built-in react native plugins
  .use(reactotronRedux({
    onRestore: Immutable
  }))
  .connect(); // let's connect!

if (__DEV__) {
  console.react = (...args) => {
    Reactotron.display({
      name: 'console.react',
      value: args,
      preview: args.length > 0 && typeof args[0] === 'string' ? args[0] : null
    });
  };
} else {
  console.react = noop;
}

Reactotron.clear();
