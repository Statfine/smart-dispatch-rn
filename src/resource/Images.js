/**
 * Function:图片管理类
 */
export default {
  // 为了区分图片，此处按照不同的功能板块将图片分类
  // Common
  common: {
    ic_empty: require('./imgs/empty.png'),
    notice: {
      // ic_location_start: require('./imgs/location_start.png'),
      // ic_location_end: require('./imgs/location_end.png'),
      // ic_user_blue: require('./imgs/user_blue.png'),
      // ic_user_phone: require('./imgs/phone.png'),
    },
  },

  // header
  header: {
  },

  // 地图
  map: {
    ic_fetch_text: require('./imgs/map_fetch_text.png'),
    ic_send_text: require('./imgs/map_send_text.png'),
  },

  loading: require('./imgs/loading.png'),
  qishou: require('./imgs/qishou.png'),
};
