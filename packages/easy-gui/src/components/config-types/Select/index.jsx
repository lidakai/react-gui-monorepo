import React, { useState, useEffect } from 'react';
import { Select } from 'easy-design';
import { getOptionsList } from 'easy-utils';

export default function EasySelect(props) {
  const {
    allowInput,
    value,
    options = [],
    onChange,
    api,
    localOptionsVar,
    ...rest
  } = props;
  const [search, setSearch] = useState('');
  const [optionList, setOptionList] = useState(() => {
    if (localOptionsVar) {
      return JSON.parse(localStorage.getItem(localOptionsVar) || '[]');
    } else {
      return options;
    }
  });

  useEffect(() => {
    if (api) {
      getOptionsList(api).then(res => {
        if (res && Array.isArray(res)) {
          setOptionList(
            res.map(d => ({
              label: d.name,
              value: d.value,
              disabled: d.disabled,
            })),
          );
        }
      });
    }
  }, [api, options]);

  useEffect(() => {
    if (!localOptionsVar) {
      const res = options.map(d => ({
        label: d.name,
        value: d.value,
        disabled: d.disabled,
      }));
      setOptionList(res);
    }
  }, [options]);

  const handleSearch = value => {
    setSearch(value);
  };

  const handleChange = value => {
    onChange(value);
    setSearch('');
  };

  const handleDropdownVisibleChange = open => {
    if (!open) {
      setSearch('');
    }
  };

  // 注意：这里如果没有配置allowInput并且options长度大于10则自动开启搜索\如果配置了allowInput并且存在输入值则采用输入值
  const showSearch = allowInput ? true : optionList.length > 10;
  const resultOptions =
    allowInput && search ? [{ label: search, value: search }] : optionList;

  return (
    <Select
      showSearch={showSearch}
      value={value}
      filterOption={!allowInput}
      options={resultOptions}
      optionFilterProp={allowInput ? false : 'label'}
      virtual={false}
      onSearch={showSearch && handleSearch}
      onChange={handleChange}
      onDropdownVisibleChange={handleDropdownVisibleChange}
      {...rest}
    />
  );
}
