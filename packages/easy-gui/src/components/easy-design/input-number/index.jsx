import React, { useState } from 'react';
import classNames from 'classnames';
import { InputNumber } from '@easyv/antd';
import { UpOutlined, DownOutlined } from '@easyv/react-icons';

import { safeAdd } from 'easy-utils';
import styles from './index.less';

export default props => {
  const {
    className,
    value,
    step = 1,
    min = Number.MIN_SAFE_INTEGER,
    max = Number.MAX_SAFE_INTEGER,
    prefix,
    suffix,
    dragRef,
    showStep = !suffix,
    disabled,
    onChange,
    onFocus,
    onBlur,
    ...rest
  } = props;

  const [focus, setFocus] = useState(false);

  const handleStepUpClick = () => {
    const newValue = fixValue(value ? safeAdd(value, step) : safeAdd(0, step));
    onChange && onChange(newValue);
    onBlur && onBlur(newValue);
  };

  const handleStepDownClick = () => {
    const newValue = fixValue(
      value ? safeAdd(value, -step) : safeAdd(0, -step),
    );
    onChange && onChange(newValue);
    onBlur && onBlur(newValue);
  };

  const fixValue = value => {
    return value > max ? max : value < min ? min : value;
  };

  const onInputFocus = e => {
    setFocus(true);
    onFocus && onFocus(e);
  };

  const onInputBlur = e => {
    setFocus(false);
    onBlur && onBlur(e);
  };

  const upDisabled = disabled || (value != null && value >= max);
  const downDisabled = disabled || (value != null && value <= min);

  return (
    <div
      className={classNames(
        styles.inputNumber,
        { [styles.focus]: focus, [styles.disabled]: disabled },
        className,
      )}
    >
      {prefix && <span className={styles.prefix}>{prefix}</span>}

      <InputNumber
        style={{ flex: 1 }}
        value={value}
        step={step}
        min={min}
        max={max}
        disabled={disabled}
        onFocus={onInputFocus}
        onChange={onChange}
        onBlur={onInputBlur}
        {...rest}
      />

      {suffix && (
        <span
          className={classNames(styles.suffix, disabled ? styles.disabled : '')}
          ref={!disabled ? dragRef : null}
        >
          {suffix}
        </span>
      )}

      {showStep && (
        <span className={styles.step}>
          <span
            className={classNames(styles.up, {
              [styles.disabled]: upDisabled,
            })}
            onClick={!upDisabled ? handleStepUpClick : null}
          >
            <UpOutlined />
          </span>
          <span
            className={classNames(styles.down, {
              [styles.disabled]: downDisabled,
            })}
            onClick={!downDisabled ? handleStepDownClick : null}
          >
            <DownOutlined />
          </span>
        </span>
      )}
    </div>
  );
};
