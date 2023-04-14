import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import throttle from 'lodash/throttle';
import { calcExpression } from 'easy-utils';
import { PointerDrag } from '../config-types/Number';
import styles from './InputNumber.less';

const KEYCODE_ENTER = 13;

export default function InputNumber({
  value,
  min = Number.MIN_SAFE_INTEGER,
  max = Number.MAX_SAFE_INTEGER,
  suffix,
  onChange,
}) {
  const [_value, setValue] = useState(value);
  const [focus, setFocus] = useState(false);
  const record = useRef(value);

  useEffect(() => {
    setValue(value);
  }, [value]);

  const handleChange = e => {
    setValue(e.target.value);
  };

  const handleBlur = () => {
    setFocus(false);
    let calcValue = calcExpression(_value);
    if (isNaN(calcValue)) {
      setValue(value);
    } else {
      if (calcValue !== _value) {
        if (calcValue < min) {
          calcValue = min;
        }
        if (calcValue > max) {
          calcValue = max;
        }

        setValue(calcValue);
      }
      if (calcValue !== value) {
        onChange(calcValue);
      }
    }
  };

  const handleKeyDown = e => {
    if (e.which === KEYCODE_ENTER) {
      e.target?.blur();
    }
  };

  const handleMove = useRef(
    throttle(({ movementX }) => {
      setValue(value + movementX);
    }, 16),
  );

  const handleMoveEnd = () => {
    onChange(_value);
  };

  return (
    <div
      className={classNames(styles.container, { [styles.focus]: focus })}
      onFocus={() => setFocus(true)}
      onKeyDown={handleKeyDown}
    >
      <input
        className={styles.input}
        value={_value}
        onChange={handleChange}
        onBlur={handleBlur}
      />
      <PointerDrag onMove={handleMove.current} onMoveEnd={handleMoveEnd}>
        <span className={styles.label}>{suffix}</span>
      </PointerDrag>
    </div>
  );
}
