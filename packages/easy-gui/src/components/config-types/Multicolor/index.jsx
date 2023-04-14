import React from 'react';
import { FormGroup } from 'layout';
import { EasyInput, EasyNumber } from 'config-types';
import Preview from '../Color/Preview';
import { resolveColor, transformColor } from 'easy-design/utils/color';

const { Col } = FormGroup;

export default function EasyMultiColor({ value, simple, onChange }) {
  const {
    type = 'pure',
    pure = '#000000',
    linear = {
      stops: [
        { offset: 0, color: '#000' },
        { offset: 100, color: '#fff' }
      ],
      angle: 0,
      opacity: 1
    }
  } = value;

  if (simple) {
    return <Preview mode="multi" value={value} onChange={onChange} />;
  }

  const handleOpacityChange = (opacity) => {
    if (value.type === 'pure') {
      const { hex = '' } = resolveColor(value.pure) || {};
      let newValue = transformColor(hex, opacity / 100);

      onChange({
        ...value,
        pure: newValue
      });
    } else {
      onChange({
        ...value,
        [value.type]: {
          ...value[value.type],
          opacity: opacity / 100
        }
      });
    }
  };

  const handleHexChange = (hex) => {
    hex = hex.startsWith('#') ? hex : '#' + hex;
    hex = hex.toUpperCase();
    const hexReg = /^#([0-9|A-F]{3}|[0-9|A-F]{6})$/;
    if (hexReg.test(hex)) {
      onChange({
        ...value,
        pure: hex
      });
    } else {
      onChange({
        ...value,
        pure: '#000000'
      });
    }
  };

  let inputValue;
  let opacityValue;
  if (type === 'pure') {
    const { hex = '', a = 0 } = resolveColor(pure) || {};
    inputValue = hex.replace('#', '').toUpperCase();
    opacityValue = Math.floor(a * 100);
  } else if (type === 'linear') {
    inputValue = '线性渐变';
    opacityValue = Math.floor(linear.opacity * 100);
  }

  return (
    <FormGroup style={{ marginBottom: -4 }}>
      <Col span={4}>
        <Preview mode="multi" value={value} onChange={onChange} />
      </Col>
      <Col span={12}>
        <EasyInput prefix="#" value={inputValue} onChange={handleHexChange} disabled={value.type !== 'pure'} />
      </Col>
      <Col span={8}>
        <EasyNumber value={opacityValue} suffix="%" min={0} max={100} onChange={handleOpacityChange} />
      </Col>
    </FormGroup>
  );
}
