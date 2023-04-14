import React, { useContext } from 'react';
import { EasySelect, EasyTreeSelect, EasyRadio } from 'config-types';
import FormItem from 'layout/FormItem';
import { ScreenContext } from 'config-provider';
import { getId, getPanelOptions, getPanelWithStates } from 'easy-utils';
import styles from '../Components/index.less';

export default function EasyPanel({ value = '{}', onChange }) {
  value = typeof value === 'string' ? JSON.parse(value) : value;
  const { panelId, stateId, scope = 'current' } = value;
  const {
    panelsById = {},
    screensById = {},
    screenId,
    stateId: stateScreenId,
  } = useContext(ScreenContext);
  const panelOptions = getPanelOptions({
    panelsById,
    screensById,
    screenId,
    stateId: stateScreenId,
    mode: scope,
  });
  const panelWithStates = getPanelWithStates({
    panelsById,
    screensById,
    id: getId(panelId),
  });
  const { children = [] } = panelWithStates;
  const stateOptions = children.map(d => ({ name: d.title, value: d.value }));

  const handleStateChange = stateId => {
    onChange(
      JSON.stringify({
        panelId,
        stateId,
        scope,
      }),
    );
  };

  const handlePanelChange = panelId => {
    onChange(
      JSON.stringify({
        panelId,
        stateId: '',
        scope,
      }),
    );
  };

  const handleScopeChange = scope => {
    // 从全局切换到当前视图，将组件清空
    if (scope === 'current') {
      onChange(
        JSON.stringify({
          panelId: '',
          stateId: '',
          scope,
        }),
      );
    } else {
      onChange(
        JSON.stringify({
          panelId,
          stateId,
          scope,
        }),
      );
    }
  };

  return (
    <>
      <FormItem label="组件">
        <div className={styles.line}>
          <EasyRadio
            value={scope}
            options={[
              { name: '当前', value: 'current' },
              { name: '全局', value: 'global' },
            ]}
            onChange={handleScopeChange}
            style={{ marginBottom: 8, width: '100%' }}
          />
          <EasyTreeSelect
            value={panelId}
            options={panelOptions}
            onChange={handlePanelChange}
          />
        </div>
      </FormItem>

      <FormItem label="选择状态">
        <EasySelect
          value={stateId}
          options={stateOptions}
          onChange={handleStateChange}
        />
      </FormItem>
    </>
  );
}
