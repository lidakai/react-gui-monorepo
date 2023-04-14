import React, { useState, useEffect, useContext } from 'react';
import { EasyTreeSelect } from 'config-types';
import { ConfigContext } from 'config-provider';
import { resolve } from 'easy-utils';

export default function EasyArea({ value, onChange }) {
  const [options, setOptions] = useState([]);

  const { assetsUrl } = useContext(ConfigContext);

  useEffect(() => {
    if (assetsUrl) {
      fetch(resolve(assetsUrl, '/components/area/main.json'))
        .then((res) => res.json())
        .then((res) => {
          setOptions(res);
        });
    }
  }, [assetsUrl]);

  return <EasyTreeSelect value={value} options={options} onChange={onChange} />;
}
