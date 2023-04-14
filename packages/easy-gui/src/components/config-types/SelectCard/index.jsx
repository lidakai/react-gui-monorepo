import React, { useState, useMemo } from 'react';
import { SelectCard } from 'easy-design';

const tranformCover = (cover) => {
  const isRelativeUrl = !/http[s]{0,1}:\/\/([\w.]+\/?)\S*/.test(cover);
  return isRelativeUrl ? (window.appConfig?.ASSETS_URL || '') + cover : cover;
};

export default function EasySelectCard(props) {
  const { allowInput, value, options = [], onChange, ...rest } = props;
  const tranformOptions = useMemo(
    () => options.map((d) => ({ label: d.name, value: d.value, disabled: d.disabled, cover: d.cover && tranformCover(d.cover) })),
    [options]
  );

  const [search, setSearch] = useState('');

  const handleSearch = (value) => {
    setSearch(value);
  };

  const handleChange = (value) => {
    onChange(value);
    setSearch('');
  };

  const handleDropdownVisibleChange = (open) => {
    if (!open) {
      setSearch('');
    }
  };

  const showSearch = allowInput ? true : options.length > 10;

  return (
    <SelectCard
      showSearch={showSearch}
      value={value}
      filterOption={true}
      options={tranformOptions}
      optionFilterProp={'label'}
      virtual={false}
      onSearch={showSearch && handleSearch}
      onChange={handleChange}
      onDropdownVisibleChange={handleDropdownVisibleChange}
      {...rest}
    />
  );
}
