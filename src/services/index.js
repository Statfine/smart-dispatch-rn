import { getRequest, postRequest, putRequest } from '../utils/RequestUtil';
import store from '../redux/store';
import axios from 'axios';
import _ from 'lodash';

// const host = 'http://192.168.0.157:8081'; // 周磊

// const host = 'http://192.168.0.39:8081'; // 金力

// export const host = 'http://192.168.0.33:8081'; // 运路

// const host = 'http://192.168.0.62:8081'; // 占恒

// const host = 'http://192.168.0.146:8081'; // 唐杰

// const host = 'http://120.25.243.124:8888'; // qa

const host = 'http://120.25.243.124:9990'; // demo

export function getPagedTaskItemList (params) {

  return postRequest(host + '/rest/mobile/v1/dispatch/work-item/page', params);
}

export function getAllStaff (params) {
  return postRequest(host + '/rest/v1/dispatch/resource/staff/list', params);
}

export function updateWorkStatus (params) {
  const account = store.getState().getIn(['accounts', 'account']);
  return axios.post(host + `/rest/mobile/v1/dispatch/work-item/transit-status?staffId=${account.get('id')}&tenantId=${account.get('tenantId')}`, params);
}

export function getHistoryWork (params) {
  return postRequest(host + '/rest/mobile/v1/dispatch/scheduled-task/historical-records', params);
}

export function getTaskDetail (params) {
  return getRequest(host + '/rest/mobile/v1/dispatch/scheduled-task/info', params);
}

export function getPathPlans (params) {
  return getRequest(host + '/rest/mobile/v1/dispatch/scheduled-task/planned-path', params);
}

export function startAcceptOrder () {
  const account = store.getState().getIn(['accounts', 'account']);
  return axios.put(`${host}/rest/v1/dispatch/resource/staff/orders/start?id=${account.get('id')}&tenantId=${account.get('tenantId')}`, {});
}

export function stopAcceptOrder () {
  const account = store.getState().getIn(['accounts', 'account']);
  return axios.put(`${host}/rest/v1/dispatch/resource/staff/orders/stop?id=${account.get('id')}&tenantId=${account.get('tenantId')}`, {});

}

/**
 *  获取骑手地理位置
 *  staffId
 *  tenantId
*/
export function getUserLocation (params) {
  return getRequest(host + '/rest/v1/dispatch/resource/staff/location/query', params);
}

/**
 *  上报骑手位置
 * tenantId
 * staffId
 * longitude
 * latitude
*/
export function postLocation (params) {
  const account = store.getState().getIn(['accounts', 'account']);
  if (_.isEmpty(account)) return;
  params.tenantId = account.get('tenantId');
  params.staffId = account.get('id');
  return axios.post(host + `/rest/v1/dispatch/mobile/services/location?staffId=${account.get('id')}&tenantId=${account.get('tenantId')}`, params);
}



