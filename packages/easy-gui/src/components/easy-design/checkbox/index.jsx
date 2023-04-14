import React from 'react';
import { Checkbox } from '@easyv/antd';

function CustomCheckbox(props) {
  // const { value, options = [], onChange, ...rest } = props;

  // if (options.length) {
  //   return <Checkbox.Group options={options.map((d) => ({ label: d.name, value: d.value }))} value={value} onChange={onChange} {...rest} />;
  // } else {
  //   const handleChange = (e) => onChange && onChange(e.target.checked);

  //   return <Checkbox checked={value} onChange={handleChange} {...rest} />;
  // }

  return <Checkbox {...props} />;
}

CustomCheckbox.Group = Checkbox.Group;

export default CustomCheckbox;
