import React from 'react';
import { message } from 'easy-design';
import styles from './index.less';

export default function EasyCamera(props) {
  const { name, value, template, enableDelete = true, onChange } = props;

  const handleStore = () => {
    let camera = JSON.parse(sessionStorage.getItem('camera') || null);
    camera && onChange(camera);
    handleClickCamera();
    message.success('镜头保存成功');
  };

  const handleReset = () => {
    onChange(template);
    message.success('镜头重置成功');
    handleSelect(); // reset
  };

  const handleClickCamera = () => {
    const event = new Event('saveCamera');
    document.dispatchEvent(event);
  };

  const handleDelete = () => {
    onChange('');
  };

  const handleSelect = () => {
    let event = new Event('collectCameraState');
    event.data = {
      type: 'select',
      value: value
    };
    document.dispatchEvent(event);
    handleClickCamera();
  };

  return (
    <div className={styles.camera}>
      <span className={styles.name} onClick={handleSelect}>
        {name}
      </span>
      <span className={styles.operate}>
        <a style={{ marginRight: 8 }} onClick={handleStore}>
          保存
        </a>
        <a onClick={handleReset}>重置</a>
        {enableDelete && <a onClick={handleDelete}>删除</a>}
      </span>
    </div>
  );
}
