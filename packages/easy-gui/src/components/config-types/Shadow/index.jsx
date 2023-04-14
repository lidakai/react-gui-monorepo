import React from 'react';
import { Row, Col } from '@easyv/antd';
import { EasyNumber, EasyColor } from 'config-types';

export default function EasyShadow({ value, onChange }) {
  const { color, hShadow = 0, vShadow = 0, blur = 0, spread } = value;

  const handleChange = (param) => {
    onChange({ ...value, ...param });
  };

  return (
    <Row gutter={[8, 8]} style={{ marginBottom: 0 }}>
      <Col span={4} style={{ paddingBottom: 0 }}>
        <EasyColor value={color} simple onChange={(color) => handleChange({ color: color })} />
      </Col>
      <Col span={5} style={{ paddingBottom: 0 }}>
        <EasyNumber label="X" value={hShadow} showStep={false} onChange={(hShadow) => handleChange({ hShadow: hShadow })} />
      </Col>
      <Col span={5} style={{ paddingBottom: 0 }}>
        <EasyNumber label="Y" value={vShadow} showStep={false} onChange={(vShadow) => handleChange({ vShadow: vShadow })} />
      </Col>
      <Col span={5} style={{ paddingBottom: 0 }}>
        <EasyNumber label="模糊" value={blur} showStep={false} onChange={(blur) => handleChange({ blur: blur })} />
      </Col>
      <Col span={5} style={{ paddingBottom: 0 }}>
        <EasyNumber
          label="扩展"
          disabled={spread == null}
          value={spread || 0}
          showStep={false}
          onChange={(spread) => handleChange({ spread: spread })}
        />
      </Col>
    </Row>
  );
}
