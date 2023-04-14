import React, { useMemo } from 'react';
import { Checkbox } from 'easy-design';

export default function EasyCheckbox({ value, options, onChange }) {
  const tranformedOptions = useMemo(() => options.map((d) => ({ label: d.name, value: d.value })), [options]);
  return <Checkbox.Group options={tranformedOptions} value={Array.isArray(value) ? value : [value]} onChange={onChange} />;
}
