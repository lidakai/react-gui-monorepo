import React, { useState, useRef, useEffect } from 'react';
import ColorPicker from '../../easy-design/rangeColor-picker';
import { getBackgroundAccordingColor } from '../../easy-design/utils/color';
import styles from './index.less';

export default function RangeColor({ value, onChange }) {
  const [show, setShow] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const previewRef = useRef(null);
  const pickerRef = useRef(null);

  const handleClick = (e) => {
    setShow(true);
  };

  const handleHide = () => {
    setShow(false);
  };

  const handleColorChange = (value) => {
    onChange(value);
  };

  useEffect(() => {
    if (show) {
      let targetRect = previewRef.current.getBoundingClientRect();
      let pickerRect = pickerRef.current.getBoundingClientRect();
      let windowHeight = document.documentElement.clientHeight;
      let windowWidth = document.documentElement.clientWidth;

      let hexDOM = pickerRef.current.querySelector('.rc-color-picker-panel-params-hex');
      if (hexDOM) {
        hexDOM.focus();
        hexDOM.select();
      }

      let top =
        windowHeight - targetRect.bottom < pickerRect.height
          ? targetRect.top - pickerRect.height < 0
            ? 0
            : targetRect.top - pickerRect.height
          : targetRect.bottom;
      let left = windowWidth - targetRect.left < pickerRect.width ? windowWidth - pickerRect.width : targetRect.left;
      setPosition({ x: left, y: top });
    }
  }, [show]);

  return (
    <>
      <span className={styles.preview} onClick={handleClick} ref={previewRef}>
        <span className={styles.inner} style={getBackgroundAccordingColor(value, 90)} />
      </span>

      {show && <ColorPicker color={value} position={position} ref={pickerRef} onCancel={handleHide} onChange={handleColorChange} />}
    </>
  );
}
