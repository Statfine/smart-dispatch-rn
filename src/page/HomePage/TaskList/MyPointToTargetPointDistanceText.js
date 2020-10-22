import React from 'react';
import { parseStyle } from '../../../utils/ScreenUtil';
import { Text } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { getDistanceBetweenTwoPoints, displayDistance } from '../../../utils/Location';
import { useSelector } from 'react-redux';
import { plainlize } from '../../../utils/ImmutableUtil';

export default function MyPointToTargetPointDistanceText ({ targetPoint }) {
  const myPoint = useSelector(state => state.getIn(['points', 'myPosition']));
  const distance = getDistanceBetweenTwoPoints(plainlize(myPoint), targetPoint);
  if (!distance) {
    return null;
  }
  return (
    <Text style={parseStyle(styles.topDis)}>{displayDistance(distance)}</Text>
  );
}

const styles = EStyleSheet.create({
  topDis: {
    fontSize: 10,
    lineHeight: 16,
    fontWeight: 'bold',
    color: '#505050',
    marginLeft: 6,
    width: 54,
  },
});
