import { useState, useEffect, forwardRef } from 'react';
import classNames from 'classnames';
import { Button } from '@easyv/antd';
import { SwapOutlined } from '@easyv/react-icons';
import SpaceModal from '../space-modal';
import { useLocalStorage, useClickOutside } from '../../easy-use';
import Icon from '../icon';
import ColorPicker from '../../color-picker';
import styles from './index.less';
import Points from './Points';

const defaultColorValue = [
  { offset: 0, color: '#fff' },
  { offset: 100, color: '#000' },
];

function CustomColorPicker({ color, position, onChange, onCancel }, ref) {
  const [usedPureColors] = useLocalStorage('usedColors');
  const [usedLinearColors] = useLocalStorage('usedLinearColors');
  const [recentCollapsed, setRecentCollapsed] =
    useLocalStorage('recentCollapsed');
  const [active, setActive] = useState(0);
  const [localColor, setLocalColor] = useState('');

  const currentColor = color[active] ? color[active].color : '#fff';

  useEffect(() => {
    setLocalColor(currentColor);
  }, [currentColor]);

  useClickOutside(ref, onCancel);

  useEffect(() => {
    return () => {
      const lastColor = ref.current._lastColor;
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
    const downHandler = e => {
      e.stopPropagation();

      if (e.key === 'Backspace') {
        if (color.length > 2) {
          color = color.filter((d, i) => i !== active);
          setActive(active > 0 ? active - 1 : 0);
          onChange(color);
        }
      }
    };

    document.body.addEventListener('keydown', downHandler);
    return () => {
      document.body.removeEventListener('keydown', downHandler);
    };
  }, [color, active]);

  const handleColorChange = (colorValue, used) => {
    // 判断颜色有没有更改，没有更改就不要执行。进来的第一次会把焦点定位到输入框中，点击其他地方时会失焦，会自动触发ColorPicker中的onchange事件，导致更新一次
    if (color[active].color.replace(/\s/g, '') === colorValue) {
      return;
    }
    // console.log(colorValue, 'colorValue');
    const newColors = color.map((d, i) =>
      i === active ? { ...d, color: colorValue } : d,
    );
    // ref.current._lastColor = used ? null : newColors;
    ref.current._lastColor = used ? null : colorValue;
    // 增加一个定时器，延迟更新。点击最近使用的颜色时也会触发ColorPicker中的onChange事件，由于ColorPicker中的onChange事件有个100毫秒的延迟，所以给这个设置为101毫秒的延迟，主要目的是在ColorPicker中的onChange事件之后触发
    setTimeout(() => {
      onChange(newColors);
    }, 101);
  };

  const handleCollapseRecent = () => {
    setRecentCollapsed(prev => !prev);
  };

  const handleColorsChange = (colors, used) => {
    onChange(colors);

    ref.current._lastColor = used ? null : colors;
  };

  // 切换dot的排列方向
  const handleReverseColor = () => {
    const copyStops = color.slice();
    const newStops = copyStops.reduce((all, item, index) => {
      const obj = {};
      obj.offset = 100 - item.offset;
      obj.color = item.color;
      all.push(obj);
      return all;
    }, []);

    onChange(newStops);
  };

  return (
    <SpaceModal>
      <div
        className={styles.colorPicker}
        style={{ left: position.x, top: position.y }}
        ref={ref}
      >
        <div className={styles.colors}>
          <Points
            dots={color}
            active={active}
            setActive={setActive}
            onChange={handleColorsChange}
          />

          <div style={{ flex: 1 }}>
            <Button onClick={handleReverseColor}>
              <SwapOutlined />
            </Button>
          </div>
        </div>
        <div className={styles.scrollContainer}>
          <ColorPicker
            color={localColor}
            onChange={handleColorChange}
            active={active}
          />
          <div className={styles.recent}>
            <div className={styles.title} onClick={handleCollapseRecent}>
              <div>最近使用</div>
              <Icon
                type="btn_unfold1"
                className={classNames(styles.icon, {
                  [styles.collapsed]: recentCollapsed,
                })}
              />
            </div>
            {!recentCollapsed && (
              <div className={styles.list}>
                {usedPureColors &&
                  usedPureColors.map(d => (
                    <div
                      key={d}
                      className={styles.item}
                      style={{ background: d }}
                      onClick={() => handleColorChange(d, true)}
                    />
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
