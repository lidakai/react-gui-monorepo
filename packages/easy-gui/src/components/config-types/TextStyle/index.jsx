import React from 'react';
import { Row, Col } from '@easyv/antd';
import { EasyFont, EasyBoolean, EasyNumber, EasyColor } from 'config-types';

export default function EasyTextStyle({ value, onChange }) {
  const { fontFamily, fontSize, color, bold, italic, letterSpacing, lineHeight } = value;

  const handleChange = (param) => {
    onChange({
      ...value,
      ...param
    });
  };

  return (
    <Row gutter={[8, 8]} style={{ marginBottom: 0 }}>
      <Col span={16}>
        <EasyFont value={fontFamily} onChange={(fontFamily) => handleChange({ fontFamily: fontFamily })} />
      </Col>
      <Col span={8}>
        <EasyNumber value={fontSize} onChange={(fontSize) => handleChange({ fontSize: fontSize })} />
      </Col>
      <Col span={24}>
        <EasyColor value={color} onChange={(color) => handleChange({ color: color })} />
      </Col>
      <Col span={4} style={{ paddingBottom: 0 }}>
        <EasyBoolean mode="icon" icon="bold" value={bold} onChange={(bold) => handleChange({ bold: bold })} />
      </Col>
      <Col span={4} style={{ paddingBottom: 0 }}>
        <EasyBoolean mode="icon" icon="italic" value={italic} onChange={(italic) => handleChange({ italic: italic })} />
      </Col>
      <Col span={8} style={{ paddingBottom: 0 }}>
        <EasyNumber
          value={letterSpacing}
          suffix="px"
          label="字距"
          onChange={(letterSpacing) => handleChange({ letterSpacing: letterSpacing })}
        />
      </Col>
      <Col span={8} style={{ paddingBottom: 0 }}>
        <EasyNumber
          placeholder={fontSize ? fontSize : '自动'}
          suffix="px"
          label="行距"
          value={lineHeight}
          onChange={(lineHeight) => handleChange({ lineHeight: lineHeight })}
        />
      </Col>
    </Row>
  );
}
