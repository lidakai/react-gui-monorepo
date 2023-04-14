import React, { useState, useRef, useEffect } from 'react';
import ColorPicker from '../../easy-design/color-picker';
import RangeColorPicker from '../../easy-design/rangeColor-picker';
export default function Preview({ show = false, mode, value, onChange, targetRect, onHide, isGradient }) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const pickerRef = useRef(null);

  const handleHide = () => {
    onHide();
  };

  const handleColorChange = (value) => {
    onChange(value);
  };

  useEffect(() => {
    if (show) {
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
  }, [show, targetRect, pickerRef]);

  return (
    <>
      {show &&
        (!isGradient ? (
          <ColorPicker mode={mode} color={value} position={position} ref={pickerRef} onCancel={handleHide} onChange={handleColorChange} />
        ) : (
          <RangeColorPicker color={value} position={position} ref={pickerRef} onCancel={handleHide} onChange={handleColorChange} />
        ))}
    </>
  );
}
