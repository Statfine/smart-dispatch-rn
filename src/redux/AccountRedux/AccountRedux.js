import Immutable from 'immutable';
import ActionTypes from '../ActionTypes';
import { immuablize } from '../../utils/ImmutableUtil';

const initState = Immutable.fromJS({
  account: null
});

export default function (state = initState, action) {
  if (action.type === ActionTypes.SET_ACCOUNT_INFO) {
    return state.set('account', immuablize(action.data));
  } else if (action.type === ActionTypes.SWITCH_ACCEPT_ORDER) {
    return state.setIn(['account', 'acceptOrders'], !state.getIn(['account', 'acceptOrders']));
  }
  return state;
}
