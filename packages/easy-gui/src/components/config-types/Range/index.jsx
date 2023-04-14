import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
} from 'react';
import classNames from 'classnames';
import { debounce } from 'lodash';
import { Slider } from 'easy-design';
import { safeModulo, safeDiv, safeAdd, safeMul } from 'easy-utils';
import { NumberInput } from '../Number';

import styles from './index.less';

// 约束数字展示范围
function subtrain(v, min = 0, max = 99999, step = 1) {
  const s = safeMul(parseInt(safeDiv(v, step)), step);
  // 取最近的步进值
  if (safeModulo(v, step) < safeDiv(step, 2)) {
    v = s;
  } else {
    v = safeAdd(s, step);
  }
  v = Math.max(v, min);
  v = Math.min(v, max);
  return v;
}

export default function EasyRange(props) {
  const { value, min, max, step = 1, suffix, onChange } = props;
  const range = Array.isArray(value);
  const [state, setState] = useState(
    range
      ? value.map(v => subtrain(v, min, max, step))
      : subtrain(value, min, max, step),
  );
  const [active, setActive] = useState(0);
  const sliderRef = useRef(null);

  const onChangeRef = useMemo(() => debounce(onChange, 300), [onChange]);

  useEffect(() => {
    // 处理点击slider handle，选中当前拖拽项
    const handle1 = sliderRef.current.querySelector(
      '.easyv-gui-slider-handle-1',
    );
    const handle2 = sliderRef.current.querySelector(
      '.easyv-gui-slider-handle-2',
    );

    const handle1MouseDown = () => {
      setActive(0);
    };

    const handle2MouseDown = () => {
      setActive(1);
    };

    handle1 && handle1.addEventListener('mousedown', handle1MouseDown, false);
    handle2 && handle2.addEventListener('mousedown', handle2MouseDown, false);

    return () => {
      handle1 && handle1.removeEventListener('mousedown', handle1MouseDown);
      handle2 && handle2.removeEventListener('mousedown', handle2MouseDown);
    };
  }, []);

  useEffect(() => {
    if (range) {
      if (value[0] !== state[0] || value[1] !== state[1]) {
        setState(value);
      }
    } else if (value !== state) {
      setState(value);
    }
  }, [value, range]);

  const handleNumberChange = changedValue => {
    if (parseFloat(changedValue) === parseFloat(state)) {
      return;
    }
    changedValue = subtrain(changedValue, min, max, step);
    changedValue = range
      ? state
          .map((d, i) => (i === active ? changedValue : d))
          .sort((a, b) => a - b)
      : changedValue;
    setState(changedValue);
    onChangeRef(changedValue);
  };

  const handleRangeChange = changedValue => {
    setState(changedValue);
    onChangeRef(changedValue);
  };

  return (
    <div className={styles.sliderContainer}>
      <div className={styles.sliderWrap} ref={sliderRef}>
        <Slider
          className={classNames({
            [styles.range]: range,
            [styles.handle1]: active === 0,
            [styles.handle2]: active === 1,
          })}
          min={min}
          max={max}
          step={step}
          value={state}
          range={range}
          onChange={handleRangeChange}
        />
        {range && <div className={styles.value}>[{state.toString()}]</div>}
      </div>
      <div className={styles.sliderNumber}>
        <NumberInput
          min={min}
          max={max}
          value={range ? state[active] : state}
          // onChange={handleNumberChange}
          onBlur={handleNumberChange}
          suffix={suffix}
          showStep={false}
          step={step}
        />
      </div>
    </div>
  );
}
