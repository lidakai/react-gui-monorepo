import React, { useContext, useEffect } from 'react';
import { EasyTreeSelect, EasyRadio } from 'config-types';
import { ScreenContext } from 'config-provider';
import { getComponentOptions, deepFindOne } from 'easy-utils';
import styles from './index.less';

const scopeOptions = [
  { name: '当前', value: 'current' },
  { name: '全局', value: 'global' },
];

export default function EasyComponents(props) {
  const {
    value,
    scope = 'current',
    multiple = true,
    onChange,
    onScopeChange,
  } = props;
  const {
    componentsById = {},
    panelsById = {},
    screensById = {},
    screenId,
    stateId,
  } = useContext(ScreenContext);

  const componentOptions = getComponentOptions({
    componentsById,
    panelsById,
    screensById,
    screenId,
    stateId,
    mode: scope,
  });

  // 修复current模式组件未找到，切换至global模式
  useEffect(() => {
    let res;
    if (Array.isArray(value)) {
      res =
        value.length > 0 &&
        value.some(
          d =>
            !deepFindOne(
              componentOptions,
              item => item.value === d,
              'children',
            ),
        );
    } else {
      res =
        value &&
        !deepFindOne(
          componentOptions,
          item => item.value === value,
          'children',
        );
    }

    if (res && scope === 'current') {
      onScopeChange('global');
    }
  }, []);

  return (
    <div className={styles.line}>
      <EasyRadio
        value={scope}
        options={scopeOptions}
        onChange={onScopeChange}
      />
      <EasyTreeSelect
        value={value}
        multiple={multiple}
        options={componentOptions}
        onChange={onChange}
      />
    </div>
  );
}
