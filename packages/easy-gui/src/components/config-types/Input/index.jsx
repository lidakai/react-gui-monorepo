import React, { useState, useEffect } from 'react';
import { Input } from 'easy-design';

function EasyInput(props) {
  const { className, onChange, value, ...rest } = props;
  const [state, setState] = useState(value);

  useEffect(() => {
    if (value !== state) {
      setState(value);
    }
  }, [value]);

  const handleChange = (e) => setState(e.target.value);
  const handleFocus = (e) => e.target.select();
  const handleEnter = (e) => e.target.blur();
  const handleBlur = () => {
    if (value !== state) {
      onChange(state);
    }
  };

  return <Input value={state} onChange={handleChange} onFocus={handleFocus} onBlur={handleBlur} onPressEnter={handleEnter} {...rest} />;
}

export default EasyInput;
