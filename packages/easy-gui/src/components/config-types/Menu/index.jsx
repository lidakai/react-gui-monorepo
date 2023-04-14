import React, { useState } from 'react';
import EasyRadio from '../Radio';
import { Generate } from 'easy-gui';

export default function EasyMenu({ path, config, onChange }) {
  const options = config.map((d) => ({ name: d.displayName, value: d.name }));
  const [state, setState] = useState(options[0] && options[0].value);

  return (
    <div>
      <div style={{ padding: '0 24px', marginBottom: 24 }}>
        <EasyRadio mode="button" size="small" background value={state} options={options} onChange={setState} />
      </div>

      {config.map((d) =>
        d.name === state ? <Generate key={d.name} config={d.value} path={path.concat(d.name)} bordered={false} onChange={onChange} /> : null
      )}
    </div>
  );
}
