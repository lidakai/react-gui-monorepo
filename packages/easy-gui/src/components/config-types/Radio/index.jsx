import React from 'react';
import classNames from 'classnames';
import { Icon, Radio } from 'easy-design';
import styles from './index.less';

export default function EasyRadio({ options, value, mode = 'normal', size, background, onChange }) {
  const handleChange = (e) => {
    onChange && onChange(e.target.value);
  };

  const RadioItem = mode === 'normal' ? Radio : Radio.Button;

  return (
    <Radio.Group
      onChange={handleChange}
      value={value}
      className={classNames(styles.radio, { [styles.background]: background })}
      size={size}>
      {options.map((d) => (
        <RadioItem key={d.value} value={d.value}>
          {mode === 'icon' ? <Icon type={d.icon} title={d.name} /> : d.name}
        </RadioItem>
      ))}
    </Radio.Group>
  );
}
