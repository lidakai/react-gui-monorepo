import React from 'react';
// import { isEqual } from 'lodash';
import AceEditorBox from '../Json/AceEditorBox';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-min-noconflict/ext-language_tools';

export default function EasyJscode({ name, showGutter, value, onChange,...otherProps }) {
  const handleBlur = (_event, editor) => {
    if (editor) {
      
      const data = editor.getValue();

      // if (!isEqual(value, data)) {
      onChange(data);
      // }
    }
  };

  return <AceEditorBox {...otherProps}  name={name} mode="javascript" value={value} showGutter={showGutter} onBlur={handleBlur} />;
}
