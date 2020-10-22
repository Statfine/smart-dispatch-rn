module.exports = {
  root: true,
  extends: ['@react-native-community'],
  rules: {
    'prettier/prettier': 0,
    quotes: [2, 'single'],
    'no-dupe-args': 2, //禁止在 function 定义中出现重复的参数
    'no-dupe-keys': 2, //禁止在对象字面量中出现重复的键
    'react-native/no-inline-styles': 0,
    // 强制类型后面要有一个","
    'flowtype/delimiter-dangle': [2, 'only-multiline'],
    // 在 : 后强制加空格
    'flowtype/space-after-type-colon': [2, 'always'],
    // 在 | & 符号中,强制加空格
    'flowtype/union-intersection-spacing': [2, 'always'],
    //缩进用两个空格
    indent: ['error', 2],
    'comma-dangle': 0,
    'curly': 0,
    'react-hooks/exhaustive-deps': 0,
  },
};
