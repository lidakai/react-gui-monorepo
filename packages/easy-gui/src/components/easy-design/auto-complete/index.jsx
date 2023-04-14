import React, { useState, useEffect } from 'react';
import { AutoComplete } from '@easyv/antd';
import classNames from 'classnames';
import styles from './index.less';

const { Option } = AutoComplete;

export default (props) => {
  const { className, value, options, onChange, ...rest } = props;
  const [state, setState] = useState(value);

  useEffect(() => {
    setState(value);
  }, [value]);

  const handleBlur = () => {
    if (state !== value) {
      onChange(state);
    }
  };

  return (
    <AutoComplete
      className={classNames(styles.autocomplete, className)}
      value={state}
      onSearch={setState}
      onBlur={handleBlur}
      onSelect={onChange}
      {...rest}>
      {options.map((d) => {
        return (
          <Option key={d.value} value={d.value} disabled={d.disabled}>
            {d.name}
          </Option>
        );
      })}
    </AutoComplete>
  );
};
