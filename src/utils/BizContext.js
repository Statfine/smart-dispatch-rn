/**
 * BizContext  数据储存
 */

export const BizContext = (function() {
  let defaultValue = {};
  return {
    _value: defaultValue,
    setBizContext(key, value) {
      defaultValue[key] = value;
    },
  };
})();
