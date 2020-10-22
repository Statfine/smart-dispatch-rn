import * as React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet } from 'react-native';

import Item from './item';
import HiFlatList from '../../../components/FlatList';

import { parseStyle } from '../../../utils/ScreenUtil';

function ListView({ type }) {
  let flatListRef = React.useRef();

  return (
    <View style={parseStyle(styles.container)}>
      <HiFlatList
        hRef={flatListRef}
        data={[
          { key: 'Java' },
          { key: 'Android' },
          { key: 'iOS' },
          { key: 'Flutter' },
          { key: 'React Native' },
          { key: 'Kotlin' },
        ]}
        renderItem={({ item }) => <Item type={type} data={item} />}
      />
    </View>
  );
}

/**
 * type
 *  newTask | waitFetching | distributionTask
 */
ListView.propTypes = {
  type: PropTypes.string.isRequired,
};
export default ListView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 12,
    backgroundColor: '#ececec',
  },
});
