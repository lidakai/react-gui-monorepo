import React, { useEffect, useState } from 'react';
import { TreeSelect } from 'easy-design';
import { getOptionsList, deepFindOne } from 'easy-utils';
const { SHOW_PARENT, SHOW_ALL, SHOW_CHILD } = TreeSelect;

export default function EasyTreeSelect({ multiple, options, value, onChange, api, localOptionsVar, ...rest }) {
  const [optionList, setOptionList] = useState(() => {
    if (localOptionsVar) {
      return JSON.parse(localStorage.getItem(localOptionsVar) || '[]');
    } else {
      return options;
    }
  });

  useEffect(() => {
    if (api) {
      getOptionsList(api).then((res) => {
        if (res && Array.isArray(res)) {
          setOptionList(res);
        }
      });
      return;
    }
  }, [api]);

  useEffect(() => {
    if (!localOptionsVar) {
      setOptionList(options);
    }
  }, [options]);

  const fixedValue = () => {
    if (value != null) {
      if (multiple) {
        let newValue = Array.isArray(value) ? value : [value];
        return newValue.map((d) => {
          let item = deepFindOne(options, (item) => item.value === d, 'children');

          return {
            label: item && item.title,
            value: d
          };
        });
      } else {
        return value;
      }
    }
  };

  const handleChange = (value) => {
    if (multiple) {
      onChange(value.map((d) => d.value));
    } else {
      onChange(value);
    }
  };
  return (
    <TreeSelect
      showSearch
      treeCheckable={multiple}
      treeCheckStrictly={multiple}
      treeNodeFilterProp="title"
      treeData={optionList} // options
      value={fixedValue()}
      onChange={handleChange}
      {...rest}
    />
  );
}
EasyTreeSelect.SHOW_PARENT = SHOW_PARENT;
EasyTreeSelect.SHOW_ALL = SHOW_ALL;
EasyTreeSelect.SHOW_CHILD = SHOW_CHILD;


