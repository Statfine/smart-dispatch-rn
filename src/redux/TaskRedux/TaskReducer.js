import Immutable from 'immutable';
import ActionTypes from '../ActionTypes';
import { immuablize } from '../../utils/ImmutableUtil';

const initState = Immutable.fromJS({
  itemList: []
});

export default function (state = initState, { data, type }) {
  data = immuablize(data);
  if (type === ActionTypes.SET_ITEM_LIST) {
    return state.set('itemList', filterDuplicateTask(data));
  } else if (type === ActionTypes.APPEND_ITEM_LIST) {
    return state.set('itemList', filterDuplicateTask(state.get('itemList').push(...data)));
  } else if (type === ActionTypes.UPDATE_ITEM_BY_ID) {
    const index = state.get('itemList').findIndex(item => item.get('id') === data.get('id'));
    if (index > -1) {
      const path = ['itemList', index];
      return state.setIn(path, state.getIn(path).merge(data));
    }
  }
  return state;
}

function filterDuplicateTask (taskList) {
  const cache = {};
  return taskList.filter(task => {
    const key = task.get('taskId') + task.get('itemType');
    if (cache[key]) {
      return false;
    }
    cache[key] = true;
    return true;
  });
}
