import React from 'react';
import { FormGroup } from 'layout';
import { EasyInput, EasyNumber } from 'config-types';
import Preview from './Preview';
import { resolveColor, transformColor } from 'easy-design/utils/color';

const { Col } = FormGroup;

export default function EasyColor({ value, simple, onChange }) {
  if (simple) {
    return <Preview value={value} onChange={onChange} />;
  }

  const handleOpacityChange = (opacity) => {
    let color = value;
    const { hex = '' } = resolveColor(color) || {};
    let newValue = transformColor(hex, opacity / 100);

    onChange(newValue);
  };

  const handleHexChange = (hex) => {
    hex = hex.startsWith('#') ? hex : '#' + hex;
    hex = hex.toUpperCase();
    const hexReg = /^#([0-9|A-F]{3}|[0-9|A-F]{6})$/;
    if (!hexReg.test(hex)) {
      hex = '#000000';
    }

    const { a } = resolveColor(value) || {};
    let newValue = transformColor(hex, a);
    onChange(newValue);
  };

  let color = value;
  const { hex = '', a = 0 } = resolveColor(color) || {};
  let hexValue = hex.replace('#', '').toUpperCase();
  let opacityValue = Math.floor(a * 100);

  return (
    <FormGroup style={{ marginBottom: -4 }}>
      <Col span={4}>
        <Preview value={value} onChange={onChange} />
      </Col>

      <Col span={12}>
        <EasyInput prefix="#" value={hexValue} onChange={handleHexChange} />
      </Col>
      <Col span={8}>
        <EasyNumber value={opacityValue} suffix="%" showStep={false} min={0} max={100} onChange={handleOpacityChange} />
      </Col>
    </FormGroup>
  );
}
