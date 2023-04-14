import React from 'react';
import Preview from './Preview';
import Input from '../input';
import InputNumber from '../input-number';
import { resolveColor } from '../utils/color';
import styles from './index.less';

export default (props) => {
  const { value = {}, simple, onChange } = props;
  const { type, color, linear = {} } = value;

  if (simple) {
    return <Preview value={value} onChange={onChange} />;
  }

  const handleHexChange = () => {};

  const handleOpacityChange = () => {};

  return (
    <div className={styles.color}>
      <Preview value={value} onChange={onChange} />

      <Input
        prefix="#"
        value={type === 'pure' ? resolveColor(color).hex : '线性渐变'}
        style={{ flex: 1.2 }}
        disabled={type !== 'pure'}
        onChange={handleHexChange}
      />

      <InputNumber
        value={Math.floor(type === 'pure' ? resolveColor(color).a * 100 : linear.opacity * 100)}
        suffix="%"
        showStep={false}
        min={0}
        max={100}
        style={{ flex: 1, marginLeft: 8 }}
        onChange={handleOpacityChange}
      />
    </div>
  );
};
