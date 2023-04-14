import React from 'react';
import classNames from 'classnames';
import styles from '../Position/index.less';

export default function EasyGrid({ value, options = [], onChange }) {
  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        {options.map((d, i) => {
          return (
            <span
              key={i}
              className={classNames(styles.item, { [styles.active]: value === d })}
              style={{ display: d != null && d !== '' ? 'block' : 'none' }}
              onClick={() => onChange(d)}
            />
          );
        })}
      </div>
    </div>
  );
}
