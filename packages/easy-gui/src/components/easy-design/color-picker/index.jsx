import React, { useState, useEffect, forwardRef, useCallback } from 'react';
import { SketchPicker } from 'react-color';
import classNames from 'classnames';
import SpaceModal from '../space-modal';
import InputNumber from '../input-number';
import { useLocalStorage, useClickOutside } from '../../easy-use';
import Icon from '../icon';
import styles from './index.less';
import Points from './Points';
import { getBackgroundAccordingColor } from '../utils/color';
import ColorPicker from '../../color-picker';

const defaultColorValue = {
  pure: '#000',
  linear: {
    stops: [
      { offset: 0, color: '#fff' },
      { offset: 100, color: '#000' }
    ],
    angle: 0,
    opacity: 1
  }
};
function CustomColorPicker({ mode, color, position, onChange, onCancel }, ref) {
  const [usedPureColors] = useLocalStorage('usedColors');
  const [usedLinearColors] = useLocalStorage('usedLinearColors');
  const [recentCollapsed, setRecentCollapsed] = useLocalStorage('recentCollapsed');
  const [active, setActive] = useState(0);
  const [localColor, setLocalColor] = useState('');

  const currentColor =
    mode === 'multi'
      ? color.type === 'pure'
        ? color.pure
        : color[color.type].stops[active]
        ? color[color.type].stops[active].color
        : '#fff'
      : color;

  useEffect(() => {
    setLocalColor(currentColor);
  }, [currentColor]);

  useClickOutside(ref, onCancel);

  useEffect(() => {
    return () => {
      let lastColor = ref.current._lastColor;
      if (lastColor != null) {
        if (typeof lastColor === 'string') {
          let newColors = [lastColor].concat(usedPureColors || []);
          newColors = Array.from(new Set(newColors)).slice(0, 16);
          localStorage.setItem('usedColors', JSON.stringify(newColors));
        } else {
          let newColors = [lastColor].concat(usedLinearColors || []);
          newColors = newColors.slice(0, 16);
          localStorage.setItem('usedLinearColors', JSON.stringify(newColors));
        }
      }
    };
  }, []);

  useEffect(() => {
    const downHandler = (e) => {
      e.stopPropagation();

      if (e.key === 'Backspace') {
        if (mode === 'multi' && color.type !== 'pure') {
          let stops = color[color.type].stops;
          if (stops.length > 2) {
            stops = stops.filter((d, i) => i !== active);
            setActive(active > 0 ? active - 1 : 0);
            onChange({
              ...color,
              [color.type]: {
                ...color[color.type],
                stops: stops
              }
            });
          }
        }
      }
    };

    document.body.addEventListener('keydown', downHandler);
    return () => {
      document.body.removeEventListener('keydown', downHandler);
    };
  }, [color, active]);

  const handleTypeChange = (type) => {
    let typeValue = color[type];
    if (typeValue) {
      onChange({
        ...color,
        type: type
      });
    } else {
      onChange({
        ...color,
        type: type,
        [type]: defaultColorValue[type]
      });
    }
    setActive(0);
  };

  const handleColorChange = (colorValue, used) => {
    if (mode === 'multi') {
      if (color.type === 'pure') {
        ref.current._lastColor = used ? null : colorValue;
        onChange({
          ...color,
          pure: colorValue
        });
      } else {
        let newColors = color[color.type].stops.map((d, i) => (i === active ? { ...d, color: colorValue } : d));
        ref.current._lastColor = used ? null : newColors;
        onChange({
          ...color,
          [color.type]: {
            ...color[color.type],
            stops: newColors
          }
        });
      }
    } else {
      if (ref.current) {
        ref.current._lastColor = used ? null : colorValue;
      }

      onChange(colorValue);
    }
  };

  // const handleChangeComplete = (value) => {
  //   if (value && value.hex) {
  //     const { rgb, hex } = value;
  //     const { r, g, b, a } = rgb;
  //     let newColor = rgb.a === 1 ? hex : `RGBA(${r},${g},${b},${a})`;

  //     handleColorChange(newColor);
  //   }
  // };

  const handleCollapseRecent = () => {
    setRecentCollapsed((prev) => !prev);
  };

  const handleColorsChange = (colors, used) => {
    onChange({
      ...color,
      [color.type]: {
        ...color[color.type],
        stops: colors
      }
    });

    ref.current._lastColor = used ? null : colors;
  };

  const handleAngleChange = (value) => {
    onChange({
      ...color,
      [color.type]: {
        ...color[color.type],
        angle: value
      }
    });
  };

  // const handleLocalColorChange = useCallback((color) => {
  //   setLocalColor(color);
  // }, []);

  return (
    <SpaceModal>
      <div className={styles.colorPicker} style={{ left: position.x, top: position.y }} ref={ref}>
        {mode === 'multi' && (
          <div>
            <div className={styles.type}>
              <span
                className={classNames(styles.circle, styles.pure, {
                  [styles.active]: color.type === 'pure'
                })}
                onClick={(e) => handleTypeChange('pure')}
              />
              <span
                className={classNames(styles.circle, styles.linear, {
                  [styles.active]: color.type === 'linear'
                })}
                onClick={(e) => handleTypeChange('linear')}
              />
            </div>
            {color.type === 'linear' && (
              <div className={styles.colors}>
                <Points dots={color.linear.stops} active={active} setActive={setActive} onChange={handleColorsChange} />

                <div style={{ flex: 1 }}>
                  <InputNumber
                    min={-360}
                    max={360}
                    suffix="°"
                    value={color.linear.angle}
                    showStep={false}
                    onChange={handleAngleChange}
                    style={{ width: 36 }}
                  />
                </div>
              </div>
            )}
          </div>
        )}
        <div className={styles.scrollContainer}>
          {/* <SketchPicker color={localColor} presetColors={[]} onChangeComplete={handleChangeComplete} onChange={handleLocalColorChange} /> */}
          <ColorPicker record={ref.current?._lastColor} color={localColor} onChange={handleColorChange} active={active} />
          <div className={styles.recent}>
            <div className={styles.title} onClick={handleCollapseRecent}>
              <div>最近使用</div>
              <Icon
                type="btn_unfold1"
                className={classNames(styles.icon, {
                  [styles.collapsed]: recentCollapsed
                })}
              />
            </div>
            {!recentCollapsed && mode === 'multi' && color.type === 'linear' && usedLinearColors && usedLinearColors.length && (
              <div className={styles.recentTitle}>渐变</div>
            )}
            {!recentCollapsed && mode === 'multi' && color.type === 'linear' && (
              <div className={styles.list}>
                {usedLinearColors &&
                  usedLinearColors.map((d, i) => (
                    <div
                      key={i}
                      className={styles.item}
                      style={getBackgroundAccordingColor(d)}
                      onClick={() => handleColorsChange(d, true)}
                    />
                  ))}
              </div>
            )}
            {!recentCollapsed && mode === 'multi' && color.type === 'linear' && <div className={styles.recentTitle}>纯色</div>}
            {!recentCollapsed && (
              <div className={styles.list}>
                {usedPureColors &&
                  usedPureColors.map((d) => (
                    <div key={d} className={styles.item} style={{ background: d }} onClick={() => handleColorChange(d, true)} />
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </SpaceModal>
  );
}

export default forwardRef(CustomColorPicker);
