import React, { useContext } from 'react';
import { EasySelect } from 'config-types';
import { FontContext } from 'config-provider';

const defaultFonts = [
  {
    name: '微软雅黑',
    value: 'Microsoft Yahei'
  },
  {
    name: '宋体',
    value: 'SimSun'
  },
  {
    name: '黑体',
    value: 'SimHei'
  },
  {
    name: '楷体',
    value: 'KaiTi'
  },
  {
    name: '隶书',
    value: 'LiSu'
  },
  {
    name: '幼圆',
    value: 'YouYuan'
  },
  {
    name: 'Tahoma',
    value: 'Tahoma'
  },
  {
    name: 'Arial',
    value: 'Arial'
  },
  {
    name: 'sans-serif',
    value: 'sans-serif'
  },
  {
    name: 'Helvetica',
    value: 'Helvetica'
  }
];

export default function EasyFont(props) {
  const { value, onChange } = props;
  const fonts = useContext(FontContext);

  return (
    <EasySelect value={value} options={fonts ? defaultFonts.concat(fonts) : defaultFonts} placeholder="请选择字体" dropdownMatchSelectWidth={210} onChange={onChange} />
  );
}
