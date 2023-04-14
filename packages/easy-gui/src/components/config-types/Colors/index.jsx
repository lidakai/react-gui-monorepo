import React from 'react';
import { EasyColor, EasyRange } from 'config-types';
import styles from './index.less';
import { getBackgroundAccordingColor } from 'easy-design/utils/color';

export default function EasyColors({ value, onChange }) {
  const [start, end, rotate] = value;
  const angle = rotate ? rotate.value : 0;

  return (
    <div className={styles.container}>
      <div className={styles.wrap}>
        <div
          className={styles.preview}
          style={getBackgroundAccordingColor(
            [
              { offset: 0, color: end.value },
              { offset: 100, color: start.value }
            ],
            angle
          )}
        />
        <div className={styles.colors}>
          <EasyColor value={start.value} onChange={(value) => onChange(value, start.name)} />
          <EasyColor value={end.value} onChange={(value) => onChange(value, end.name)} />
        </div>
      </div>

      {rotate && (
        <div className={styles.direction}>
          <span>方向</span>
          <EasyRange value={angle} suffix="°" onChange={(value) => onChange(value, rotate.name)} />
        </div>
      )}
    </div>
  );
}
