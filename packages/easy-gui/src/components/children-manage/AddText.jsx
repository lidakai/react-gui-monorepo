import React, { useState, useRef, useEffect } from 'react';
import { Input } from '@easyv/antd';
import styles from './EditableText.less';

export default function EditableText({ onUpdate }) {
  const [text, setText] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current.focus();
    inputRef.current.select();
  }, []);

  const handleBlur = () => {
    onUpdate(text);
  };

  const onInputEnter = (e) => e.target.blur();
  const onInputChange = (e) => {
    setText(e.target.value.trim());
  };

  return (
    <div className={styles.container} >
      <Input
        maxLength={20}
        value={text}
        ref={inputRef}
        placeholder='请输入编组名称'
        onChange={onInputChange}
        onBlur={handleBlur}
        onPressEnter={onInputEnter}
        style={{ background: 'transparent', color: '#fff' }}
      />
    </div>
  );
}
