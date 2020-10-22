import { combineReducers } from 'redux-immutable';
import tasks from './TaskRedux/TaskReducer';
import points from './PointRedux/PointRedux';
import accounts from './AccountRedux/AccountRedux';

export default combineReducers({
  tasks,
  points,
  accounts
});
