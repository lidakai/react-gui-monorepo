import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  Fragment,
  cloneElement,
} from 'react';
import { InputNumber } from 'easy-design';
import { safeAdd, safeDiv, safeModulo, safeMul } from 'easy-utils';
import { debounce } from 'lodash';
import classNames from 'classnames';
import styles from './index.less';

export default function EasyNumber(props) {
  const { value, min, max, onChange } = props;
  const [state, setState] = useState(value);

  const onChangeRef = useMemo(() => debounce(onChange, 300), [onChange]);

  const debouncedChange = newValue => {
    if (newValue !== value) {
      if (newValue === '' || newValue == null) {
        if (min === undefined && max === undefined) {
          onChangeRef(null);
          setState(null);
        } else {
          setState(value);
        }
      } else {
        newValue = Number(newValue);
        if (!isNaN(newValue)) {
          newValue = newValue > max ? max : newValue < min ? min : newValue;
          if (newValue !== value) {
            onChangeRef(newValue);
          }
          setState(newValue);
        } else {
          setState(value);
        }
      }
    }
  };

  useEffect(() => setState(value), [value]);

  return (
    <NumberInput
      {...props}
      value={state}
      onChange={setState}
      onBlur={debouncedChange}
      onDragEnd={debouncedChange}
    />
  );
}

export function NumberInput(props) {
  const {
    value,
    label,
    onChange = () => {},
    onBlur = () => {},
    onDragEnd = () => {},
    isEventMark,
    min,
    max,
    suffix,
    disabled,
    step = 1,
    ...rest
  } = props;
  const dragRef = useRef(null);

  const [drag, setDrag] = useState({ oldValue: value, value, dragging: false });
  // 记录开始拖拽时的值 每次拖拽以此为基础做偏移
  const [oldValue, setOldValue] = useState(value);

  const handleBlur = e => {
    const newValue = typeof e === 'number' ? e : e.target.value;
    const nextValue = newValue === '' || newValue == null ? null : newValue;
    onBlur(nextValue);
  };

  const handlePressEnter = e => {
    e.target.blur();
  };

  const getNewValue = ({ movementX }) => {
    // movementX返回鼠标按下到抬起头间的拖动距离 在开始拖拽的基础上做偏移 在onEnd的时候通知外部
    // 保持1000/100的移动距离和100/10的移动距离一致
    let newValue = safeAdd(
      oldValue,
      safeMul(Math.round(safeDiv(movementX, 5)), step),
    );
    newValue = newValue > max ? max : newValue < min ? min : newValue;
    return newValue;
  };

  const handlePointerStart = () => {
    setOldValue(value);
  };
  const handlePointerMove = ({ movementX }) => {
    const newValue = getNewValue({ movementX });
    onChange(newValue);
    setDrag({ oldValue: value, value: newValue, dragging: true });
  };
  const handlePointerMoveEnd = ({ movementX }) => {
    const newValue = getNewValue({ movementX });
    onDragEnd(newValue);
    setDrag({ value: newValue, dragging: false });
  };

  return (
    <>
      <InputNumber
        value={drag.dragging ? drag.value : value}
        min={min}
        max={max}
        dragRef={suffix ? dragRef : undefined}
        suffix={suffix}
        disabled={disabled}
        onChange={onChange}
        onBlur={handleBlur}
        onPressEnter={handlePressEnter}
        step={step}
        {...rest}
      />
      <PointerDrag
        target={dragRef}
        onMoveStart={handlePointerStart}
        onMove={handlePointerMove}
        onMoveEnd={handlePointerMoveEnd}
      />
      {label && (
        <PointerDrag
          onMoveStart={handlePointerStart}
          onMove={handlePointerMove}
          onMoveEnd={handlePointerMoveEnd}
        >
          <div
            style={{
              textAlign: 'center',
              lineHeight: 1.1,
              marginTop: 4,
              color: '#999',
            }}
          >
            <span className={classNames({ [styles.eventMark]: isEventMark })}>
              {label}
            </span>
          </div>
        </PointerDrag>
      )}
    </>
  );
}

let moveDistance = 0;
export function PointerDrag({
  children,
  target,
  onMoveStart,
  onMove,
  onMoveEnd,
}) {
  const [dragging, setDrag] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const windowSize = useMemo(
    () => ({
      width: document.body.clientWidth,
      height: document.body.clientHeight,
    }),
    [],
  );

  const onMouseMove = e => {
    if (dragging) {
      setPosition(prev => {
        let nextX = safeAdd(prev.x, e.movementX);
        nextX = safeModulo(
          safeAdd(nextX, 10 * windowSize.width),
          windowSize.width,
        );
        return { x: nextX, y: prev.y };
      });
      // 记录移动距离
      moveDistance = safeAdd(moveDistance, e.movementX);
      onMove({ movementX: moveDistance });
    } else if (Math.abs(e.movementX) >= 1 && e.buttons) {
      onMouseDown(e);
    }
  };
  const onMouseUp = e => {
    if (dragging) {
      document.exitPointerLock();
      setDrag(false);
      onMoveEnd && onMoveEnd({ movementX: moveDistance });
    }
  };
  const onMouseDown = e => {
    e.target.requestPointerLock();
    setPosition({ x: e.clientX, y: e.clientY });
    setDrag(true);
    moveDistance = 0;
    onMoveStart && onMoveStart();
  };

  useEffect(() => {
    if (!target || !target.current) {
      return;
    }

    const el = target.current;
    el.addEventListener('mousemove', onMouseMove);
    el.addEventListener('mouseup', onMouseUp);
    return () => {
      el.removeEventListener('mousemove', onMouseMove);
      el.removeEventListener('mouseup', onMouseUp);
    };
  }, [target, onMove, dragging, windowSize]);

  const arrow = (
    <svg
      width={46}
      height={15}
      style={{
        position: 'fixed',
        left: position.x,
        top: position.y,
        width: 46,
        height: 15,
        zIndex: 1,
        transform: 'translate(-50%, -50%)',
      }}
    >
      <g transform="translate(2 3)">
        <path
          fillRule="evenodd"
          d="M 15 4.5L 15 2L 11.5 5.5L 15 9L 15 6.5L 31 6.5L 31 9L 34.5 5.5L 31 2L 31 4.5Z"
          stroke="#fafafa"
          style={{ strokeWidth: 2 }}
        />
        <path
          fillRule="evenodd"
          d="M 15 4.5L 15 2L 11.5 5.5L 15 9L 15 6.5L 31 6.5L 31 9L 34.5 5.5L 31 2L 31 4.5Z"
        />
      </g>
    </svg>
  );

  return (
    <Fragment>
      {children &&
        cloneElement(children, {
          onMouseMove: e => {
            e.persist();
            onMouseMove(e);
          },
          onMouseUp,
        })}
      {dragging && arrow}
    </Fragment>
  );
}
