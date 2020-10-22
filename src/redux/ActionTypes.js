import keymirror from 'keymirror';
import TaskTypes from './TaskRedux/TaskTypes';
import PointType from './PointRedux/PointType';
import AccountType from './AccountRedux/AccountType';

const init = {
  INIT_REDUX: null
};
export default keymirror({
  ...init,
  ...TaskTypes,
  ...PointType,
  ...AccountType,
});
