import React, { useContext } from 'react';
import { EasySelect } from 'config-types';
import { ScreenContext } from 'config-provider';

export default function EasyPages(props) {
  const { value, onChange } = props;
  const { pages = [] } = useContext(ScreenContext);
  const pageOptions = pages.map((d) => ({ name: d.name, value: d.uniqueTag }));

  return <EasySelect value={value} options={pageOptions} onChange={onChange} />;
}
