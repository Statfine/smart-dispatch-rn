/**
 * HoforceCom  组件实例对象
 */

export const HiforceCom = (function() {
  let defaultValue = {};
  return {
    _value: defaultValue,
    setHiforceCom(key, value) {
      defaultValue[key] = value;
    },
  };
})();
