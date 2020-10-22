import React, { Component } from 'react';
import SvgUri from 'react-native-svg-uri';
import svgs from '../../resource/svgs';

import { scaleSize, parseStyle } from '../../utils/ScreenUtil';

export default class Svg extends Component {
  render () {
    const { icon, color, size, style } = this.props;
    let svgXmlData = svgs[icon];

    if (!svgXmlData) {
      let err_msg = `没有"${icon}"这个icon，请resource/svg文件 npm run svg`;
      // throw new Error(err_msg);
    }
    return (
      <SvgUri
        width={scaleSize(size)}
        height={scaleSize(size)}
        svgXmlData={svgXmlData}
        fill={color}
        style={style}
      />
    );
  }
}
