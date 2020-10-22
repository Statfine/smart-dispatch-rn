import axios from 'axios';
import store from '../redux/store';

export function postRequest (url, data, options = {}) {
  const staffId = store.getState().getIn(['accounts', 'account', 'id']);
  if (staffId) {
    url += `?staffId=${staffId}`;
  }
  return axios.post(url, data, options);
}

export function getRequest (url, params) {
  const staffId = store.getState().getIn(['accounts', 'account', 'id']);
  if (staffId) {
    params.staffId = staffId;
  }
  return axios.get(url, { params });
}

export function putRequest (url, params = {}) {
  return axios.put(url, params);
}
