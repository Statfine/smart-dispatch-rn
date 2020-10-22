import Immutable from 'immutable';
import ActionTypes from '../ActionTypes';
import { immuablize } from '../../utils/ImmutableUtil';

const initState = Immutable.fromJS({
  myPosition: null
});

export default function (state = initState, action) {
  if (action.type === ActionTypes.SET_MY_CURRENT_POINT) {
    return state.set('myPosition', immuablize(action.data));
  }
  return state;
}
