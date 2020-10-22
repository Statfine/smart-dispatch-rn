import { Linking, Platform, Alert } from 'react-native';

export default class RoutePlan {
  static isInstallAmap = () => {
    return new Promise((resolve, reject) => {
      Linking.canOpenURL(
        Platform.OS === 'android' ? 'amapuri://route/plan/' : 'iosamap://path',
      )
        .then(supported => {
          console.log('--------------:isInstallAmap', supported);

          resolve(supported);
        })
        .catch(err => resolve(false));
    });
  };

  /**
   * 打开高德地图导航
   * @param {String} data.sname - 起点名字.
   * @param {String} data.sourceApplication - 应用名字.
   * @param {String|number} data.slon - 起点经度.
   * @param {String|number} data.slat - 起点纬度.
   * @param {String} data.dname - 终点名字.
   * @param {String|number} data.dlon - 终点经度.
   * @param {String|number} data.dlat - 终点纬度.
   * @param{Mode} data.mode 导航类型 = 0（驾车）= 1（公交）= 2（步行）= 3（骑行）= 4（火车）= 5（长途客车）
   * @param data
   */
  static openAmap = (data = {}) => {
    let base =
      Platform.OS === 'android' ? 'amapuri://route/plan/?' : 'iosamap://path?';
    return new Promise((resolve, reject) => {
      base += `sourceApplication=${data.sourceApplication || 'test'}`;
      //起点经纬度不传，则自动将用户当前位置设为起点
      if (!data.dlat || !data.dlon) {
        reject('需要终点经纬度');
      } else {
        if (data.slon && data.slat) {
          base += `&slat=${data.slat}&slon=${data.slon}`;
        }
        if (data.sname) {
          base += `&sname=${data.sname}`;
        }
        if (data.dname) {
          base += `&dname=${data.dname}`;
        }
        base += `&dlat=${data.dlat}&dlon=${data.dlon}&dev=0&t=${
          data.mode ? data.mode.amap || 0 : 3
        }`;
        Linking.openURL(base)
          .then(res => {
            resolve('打开成功');
          })
          .catch(err => Alert.alert('提示', '请先安装 高德 App'));
      }
    });
  };

  static openPhone = phoneNumber => {
    const url = `tel:${phoneNumber}`;
    Linking.canOpenURL(url)
      .then(supported => {
        if (!supported) {
          return Alert.alert(
            '提示',
            `您的设备不支持该功能，请手动拨打 ${phoneNumber}`,
            [{ text: '确定' }],
          );
        }
        return Linking.openURL(url);
      })
      .catch(err => console.info(`出错了：${err}`, 1.5));
  };
}
