import React from 'react';
import { message } from '@easyv/antd';
import { isEqual } from 'lodash';
import AceEditorBox from './AceEditorBox';

export default function EasyJson({ name, showGutter, value, onChange, ...otherProps }) {
  try {
    value = value ? value : '{}';
    value = JSON.stringify(JSON.parse(value), null, '\t');
  } catch (e) {
    console.error('json数据格式错误');
  }

  const handleBlur = (_event, editor) => {
    if (editor) {
      try {
        const data = JSON.stringify(JSON.parse(editor.getValue()));

        if (!isEqual(value, data)) {
          onChange(data);
        }
      } catch (error) {
        message.error('数据格式有误，请检查');
      }
    }
  };

  return <AceEditorBox {...otherProps} name={name} value={value} showGutter={showGutter} onBlur={handleBlur} />;
}
