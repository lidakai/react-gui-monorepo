import React, { useState, useRef, useEffect } from 'react';
import { Input } from '@easyv/antd';
import classNames from 'classnames';
import styles from './EditableText.less';
import { EditOutlined } from '@easyv/react-icons';

export default function EditableText({ name, id, show = true, className, onClick, onUpdate, maxLength }) {
  const [text, setText] = useState(name);
  const [editable, setEditable] = useState(false);
  const inputRef = useRef(null);
  const nameRef = useRef(null);

  useEffect(() => {
    function updateName(e) {
      const { id: activeId, editable = true } = e.detail;
      if (activeId === id) {
        setEditable(editable);
      }
    }
    document.addEventListener('update-name', updateName, false);

    return () => document.removeEventListener('update-name', updateName, false);
  }, [id]);

  useEffect(() => {
    nameRef.current._name = name;
  }, [name]);

  useEffect(() => {
    return () => {
      let name = nameRef.current._name;
      let text = nameRef.current._text;
      if (text != null && name !== text) {
        onUpdate(text);
      }
    };
  }, []);

  useEffect(() => {
    if (editable) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editable]);

  const handleBlur = () => {
    const event = new CustomEvent('update-name', {
      detail: {
        id,
        editable: false
      }
    });
    document.dispatchEvent(event);
    if (text !== name) {
      if (text) {
        onUpdate?.(text);
      } else {
        setText?.(name);
        nameRef.current._text = name;
      }
    }
  };

  const onInputEnter = (e) => e.target.blur();
  const onInputChange = (e) => {
    setText(e.target.value);
    nameRef.current._text = e.target.value;
  };

  return (
    <div className={styles.container} ref={nameRef}>
      {editable ? (
        <Input
          maxLength={maxLength || null}
          ref={inputRef}
          value={text}
          onChange={onInputChange}
          onBlur={handleBlur}
          onPressEnter={onInputEnter}
          style={{ background: 'transparent', color: '#fff' }}
          onClick={(e) => e.stopPropagation()}
        />
      ) : (
        <div className={classNames(styles.name, { [styles.hide]: !show }, className)} onClick={onClick}>
          <span className={styles.text} title={text}>
            {text}
          </span>
        </div>
      )}
      <span
        title="编辑"
        className={classNames(styles.edit, { [styles.hide]: !show }, 'children_edit_text')}
        onClick={(e) => {
          e.stopPropagation();
          const event = new CustomEvent('update-name', {
            detail: {
              id
            }
          });
          document.dispatchEvent(event);
        }}>
        <EditOutlined />
      </span>
    </div>
  );
}
