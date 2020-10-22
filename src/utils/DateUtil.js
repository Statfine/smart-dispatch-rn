import { curryRight } from 'lodash';
import moment from 'moment';

export const formatDate = (time, formatter) => {
  return moment(time).format(formatter);
};

const curryFormatDate = curryRight(formatDate);

export const transformToDisplayEta = curryFormatDate('HH:mm');

export const transformToDisplayAta = curryFormatDate('YYYY年MM月DD日 HH时mm分ss秒');
