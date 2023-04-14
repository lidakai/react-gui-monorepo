import { useEffect, useRef, useState } from 'react';
import { Upload, Spin } from '@easyv/antd';
import Radio from '../radio';
import { Button } from '..';
import Icon from '../icon';
import styles from './index.less';

export default function CustomUpload({
  onCustomEvents,
  loading,
  value,
  type,
  accept,
  showDownload = true,
  content,
  disabled,
  onChange,
  customRequest,
}) {
  const [_checked, setChecked] = useState(false);
  const r = useRef();
  const handleDownload = e => {
    e.stopPropagation();
    window.open(value);
  };

  const onRadioChange = e => {
    const { checked } = e.target;
    setChecked(checked);
    checked &&
      onCustomEvents &&
      onCustomEvents({
        data: {
          value,
          accept,
        },
        type: 'save',
      });
  };

  const handleClear = e => {
    e.stopPropagation();
    onChange('');
  };

  useEffect(() => {
    r.current.addEventListener('mouseenter', onMouseEnter);
    r.current.addEventListener('mouseleave', onMouseLeave);
    return () => {
      r.current.removeEventListener('mouseenter', onMouseEnter);
      r.current.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('paste', handPaste);
    };
  }, []);

  const onMouseLeave = e => {
    e.stopPropagation();
    document.removeEventListener('paste', handPaste);
  };
  const onMouseEnter = e => {
    e.stopPropagation();
    document.addEventListener('paste', handPaste);
  };

  const handPaste = e => {
    e.stopPropagation();
    if (!(e.clipboardData && e.clipboardData.items)) {
      return;
    }
    const item = e.clipboardData.items[e.clipboardData.items.length - 1];
    const pasteFile = item.getAsFile();
    pasteFile && customRequest({ file: pasteFile });
  };

  const dragEnter = event => {
    // 进入当前
    event.stopPropagation();
    r.current.style.cssText = 'border-color:var(--easyv-primary-color)';
  };

  const drop = event => {
    // 松手
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && (accept ? accept.includes(file.type.split('/')[0]) : true)) {
      customRequest({ file });
    }
    dragLeave();
  };

  const dragLeave = () => {
    r.current.style.cssText = 'border-color:#181b24';
  };
  const dragOver = event => {
    event.preventDefault();
    dragEnter(event);
  };

  const is_video_or_picture = ['image', 'uploadImage', 'video'].includes(type);

  const isShowChange =
    (is_video_or_picture || ['uploadModel'].includes(type)) && onCustomEvents;
  return (
    <div className={styles.upload}>
      <div
        className={styles.uploadBox}
        ref={r}
        onDragEnter={dragEnter}
        onDrop={drop}
        onDragLeave={dragLeave}
        onDragOver={dragOver}
      >
        {value && <div className={styles.center}>{content}</div>}
        {!loading && (
          <div className={styles.uploadFile}>
            <Upload
              accept={accept}
              showUploadList={false}
              withCredentials={true}
              customRequest={customRequest}
              disabled={disabled}
            >
              <Button type="primary">上传文件</Button>
            </Upload>
            {isShowChange && (
              <Button
                type="primary"
                onClick={() => {
                  onCustomEvents &&
                    onCustomEvents({
                      data: {
                        type,
                        accept,
                      },
                      type: 'change',
                    });
                }}
                ghost
                className={styles.uploadChange}
              >
                更改
              </Button>
            )}
          </div>
        )}
        {value && (
          <div>
            {showDownload && (
              <Icon
                title="下载"
                type="download"
                onClick={handleDownload}
                style={{ cursor: 'pointer' }}
              />
            )}
            <Icon
              title="删除"
              type="btn_delete"
              onClick={handleClear}
              style={{ cursor: 'pointer' }}
            />
          </div>
        )}
        {loading && (
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Spin />
          </div>
        )}
      </div>
      {is_video_or_picture && onCustomEvents && value && (
        <div className={styles.radio}>
          <Radio value={_checked} onChange={onRadioChange}>
            保存为素材
          </Radio>
        </div>
      )}
    </div>
  );
}
