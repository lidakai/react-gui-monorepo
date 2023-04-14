import React, { useState } from 'react';
import { Icon } from 'easy-design';
import styles from './index.less';

export default function EasyPreviewAction({ path }) {
  const [isPlay, setIsPlay] = useState(false);

  const handlePlayOrPause = () => {
    setIsPlay((prev) => !prev);
    let type = isPlay ? 'pause' : 'play';

    let event = new Event('collectCameraState');
    event.data = {
      type: 'animation',
      status: type,
      path: path
    };
    document.dispatchEvent(event);
  };

  const handleReset = () => {
    setIsPlay(false);

    let event = new Event('collectCameraState');
    event.data = {
      type: 'animation',
      status: 'reset',
      path: path
    };
    document.dispatchEvent(event);
  };

  return (
    <div>
      <span className={styles.item} onClick={handlePlayOrPause}>
        <Icon type={`${isPlay ? 'btn_pause' : 'btn_start'}`} />
      </span>
      <span className={styles.item} onClick={handleReset}>
        <Icon type="btn_reset" />
      </span>
    </div>
  );
}
