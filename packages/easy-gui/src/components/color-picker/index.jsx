import React, { memo, useMemo, useRef } from 'react';
import { Panel as ColorPickerPanel } from 'rc-color-picker';
import 'rc-color-picker/assets/index.css';
import Color from 'rc-color-picker/lib/helpers/color';
import { useDebounceFn } from 'ahooks';
import styles from './index.less';

export default memo(function ColorPicker({ record = null, color = 'rgba(255,0,255,0.5)', onChange, active }) {
  const isControlled = useRef(true);

  const colorObj = new Color(color);
  useMemo(() => {
    isControlled.current = true;
  }, [active,record]);

  const { run } = useDebounceFn(
    ({ color, alpha }) => {
      isControlled.current = false;
      let newColor;
      let rgbColor;
      if (alpha === 100) {
        newColor = color;
      } else {
        rgbColor = new Color(color).RGB;
        newColor = `RGBA(${rgbColor[0]},${rgbColor[1]},${rgbColor[2]},${alpha / 100})`;
      }
      onChange(newColor);
    },
    { wait: 100, leading: true, trailing: false }
  );
  return isControlled.current ? (
    <ColorPickerPanel className={styles.colorPicker} color={colorObj.toHexString()} alpha={colorObj.alpha} mode="RGB" onChange={run} />
  ) : (
    <ColorPickerPanel className={styles.colorPicker} mode="RGB" onChange={run} />
  );
});
