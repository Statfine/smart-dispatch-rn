import { Colors } from '../../../resource';

export const STATUS = {
  allocated: 'allocated',
  pickup: 'pickup',
  started: 'started',
  finished: 'finished',
};
STATUS.isGetFood = (status) => {
  return status === STATUS.allocated;
};

STATUS.uiHide = (status) => {
  return status === STATUS.pickup || status === STATUS.finished;
};

export const BTN_COLOR = {
  [STATUS.allocated]: Colors.themeBacColor,
  [STATUS.started]: '#FFA328',
  over: '#AFAFAF',
};
