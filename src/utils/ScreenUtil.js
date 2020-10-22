/**
 * 屏幕工具类 以及一些常用的工具类封装
 * ui设计基准,iphone 6 2倍图
 * width:750px
 * height:1334px
 * @2x
 * https://github.com/lizhuoyuan/ReactNativeScreenUtil
 */

import { PixelRatio, Dimensions } from 'react-native';
import DeviceInfo from 'react-native-device-info';

export let screenW = Dimensions.get('window').width;
export let screenH = Dimensions.get('window').height;
const fontScale = PixelRatio.getFontScale();
export let pixelRatio = PixelRatio.get();
//像素密度
export const DEFAULT_DENSITY = 2;
//px转换成dp
//以iphone6为基准,如果以其他尺寸为基准的话,请修改下面的defaultWidth和defaultHeight为对应尺寸即可. 以下为1倍图时
const defaultWidth = 375;
const defaultHeight = 667;
const w2 = defaultWidth / DEFAULT_DENSITY;
//px转换成dp
const h2 = defaultHeight / DEFAULT_DENSITY;

//缩放比例
const _scaleWidth = screenW / defaultWidth;
const _scaleHeight = screenH / defaultHeight;

/**
 * 屏幕适配,缩放size , 默认根据宽度适配，纵向也可以使用此方法
 * 横向的尺寸直接使用此方法
 * 如：width ,paddingHorizontal ,paddingLeft ,paddingRight ,marginHorizontal ,marginLeft ,marginRight
 * @param size 设计图的尺寸
 * @returns {number}
 */
export function scaleSize (size) {
  return size * _scaleWidth;
}

/**
 * 屏幕适配 , 纵向的尺寸使用此方法应该会更趋近于设计稿
 * 如：height ,paddingVertical ,paddingTop ,paddingBottom ,marginVertical ,marginTop ,marginBottom
 * @param size 设计图的尺寸
 * @returns {number}
 */
export function scaleHeight (size) {
  return size * _scaleHeight;
}

/**
 * 设置字体的size（单位px）
 * @param size 传入设计稿上的px , allowFontScaling 是否根据设备文字缩放比例调整，默认不会
 * @returns {Number} 返回实际sp
 */
function setSpText (size, allowFontScaling = false) {
  const scale = Math.min(_scaleWidth, _scaleHeight);
  const fontSize = allowFontScaling ? 1 : fontScale;
  return (size * scale) / fontSize;
}

const needScaleSize = [
  'width',
  'paddingLeft',
  'paddingRight',
  'paddingHorizontal',
  'padding-left',
  'padding-right',
  'padding-horizontal',
  'marginLeft',
  'marginRight',
  'marginHorizontal',
  'margin-left',
  'margin-right',
  'margin-horizontal',
  'top',
  'left',
  'bottom',
  'right',
];
const needScaleHeight = [
  'height',
  'paddingTop',
  'paddingBottom',
  'paddingVertical',
  'padding-top',
  'padding-bottom',
  'padding-vertical',
  'marginTop',
  'marginBottom',
  'marginVertical',
  'margin-top',
  'margin-bottom',
  'margin-vertical',
  'top',
  'left',
  'bottom',
  'right',
];
const needSetSpText = ['fontSize', 'font-size'];

export function parseStyle (styleStr) {
  if (styleStr) {
    try {
      const styleObj =
        typeof styleStr === 'string' ? JSON.parse(styleStr) : styleStr;
      let result = Object.keys(styleObj).reduce((prev, curr) => {
        const val = '' + styleObj[curr];
        if (val === 'undefined' || val === 'null') {
          return prev;
        }
        let result = styleObj[curr];
        if (needSetSpText.includes(curr)) {
          result = val.endsWith('%') ? val : setSpText(result);
        }
        if (needScaleSize.includes(curr) || needScaleHeight.includes(curr)) {
          result = val.endsWith('%') ? val : scaleSize(result);
        }
        // if (needScaleHeight.includes(curr)) {
        //   result = val.endsWith('%') ? val : scaleHeight(result);
        // }

        return { ...prev, [curr]: result };
      }, {});
      return result;
    } catch (e) {
      return undefined;
    }
  }
  return undefined;
}

export function isIphoneX () {
  const model = DeviceInfo.getModel().toUpperCase();
  const deviceId = DeviceInfo.getDeviceId();
  return model === 'IPHONE X'
    || model === 'IPHONE XS'
    || model === 'IPHONE XR'
    || model === 'IPHONE XS MAX'
    || deviceId === 'iPhone12,1'
    || deviceId === 'iPhone12,3'
    || deviceId === 'iPhone12,5';
}

export function ifIphoneX (iphoneXStyle, regularStyle) {

  if (isIphoneX()) {
    return iphoneXStyle;
  }
  return regularStyle;
}

export const iPhoneXTopOffset = scaleSize(44);
export const iPhoneXBottomOffset = scaleSize(34);
