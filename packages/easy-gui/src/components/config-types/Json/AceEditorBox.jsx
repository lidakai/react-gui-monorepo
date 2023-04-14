import React, { useState } from 'react';
import styles from './index.less';
import { Modal } from '@easyv/antd';
import classnames from 'classnames';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/mode-sql';
import 'ace-builds/src-noconflict/theme-twilight';
import 'ace-builds/webpack-resolver';

export default function AceEditorBox({
  value,
  showGutter = false,
  onChange,
  onBlur,
  className,
  width,
  mode,
  height,
  name,
  theme,
  tabSize,
  readOnly,
  ...otherProps
}) {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <div className={styles.aceEditorBox}>
        <AceEditor
          {...otherProps}
          className={classnames(['dark', className])}
          mode={mode || 'json'}
          theme={theme || `twilight`}
          width={width || '100%'}
          height={height || `200px`}
          name={name || `static`}
          tabSize={tabSize || 2}
          value={value}
          readOnly={readOnly}
          showGutter={showGutter}
          editorProps={{ $blockScrolling: true }}
          setOptions={{ wrap: true }}
          onBlur={onBlur}
          onChange={onChange}
        />
        <span
          onClick={() => {
            setVisible(!visible);
          }}
          className={styles.fullScreen}>
          <i className="icon iconfont icon-quanping"></i>
        </span>
      </div>
      <Modal
        className={styles.modal}
        bodyStyle={{
          backgroundColor: '#2D2F38'
        }}
        visible={visible}
        title="全屏模式"
        footer={null}
        width={`80vw`}
        onCancel={() => setVisible(false)}>
        <div className={styles.aceContent}>
          <AceEditor
            {...otherProps}
            className={classnames(['dark', className])}
            mode={mode || 'json'}
            theme={theme || `twilight`}
            width={width || '100%'}
            height={`70vh`}
            name={name || `static`}
            tabSize={tabSize || 2}
            value={value}
            readOnly={readOnly}
            showGutter={true}
            editorProps={{ $blockScrolling: true }}
            setOptions={{ wrap: true }}
            onBlur={onBlur}
            onChange={onChange}
          />
        </div>
      </Modal>
    </>
  );
}
