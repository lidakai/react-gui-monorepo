import React, { useRef, useEffect, useCallback } from 'react';
import {
  transformConfig,
  updateArrayConfig,
  getValueObjFromConfig,
  reduceConfig,
  getComponentDimension,
} from 'easy-utils';
import ComponentDimension from '../component-dimension';
import { EasyMenu } from '../config-types';
import { Tabs } from '../easy-design';
import Generate from './Generate';
import Header from './Header';

const basePath = ['chart', 'dimension'];

export default function EasyGUI(props) {
  const {
    config: originConfig = [],
    flat = true,
    onChange,
    onFieldsChange,
    hideDefault,
    onHideDefaultChange,
    onCustomEvents,
    bordered = true,
  } = props;

  const configRef = useRef(originConfig);

  useEffect(() => {
    configRef.current = originConfig;

    const handleCameraStateChange = ({ data }) => {
      const { type, status, value, path } = data;
      const event = new Event('updateState');
      if (type === 'animation') {
        const value = transformConfig([
          getValueObjFromConfig(originConfig, path.slice(0, path.length - 1)),
        ]);
        const animationValue = reduceConfig(value[0].value);

        event.data = {
          type: 'animation',
          value: {
            type: status,
            value: animationValue,
          },
        };
      } else if (type === 'select') {
        event.data = {
          type: 'camera',
          value,
        };
      }

      document.dispatchEvent(event);
    };

    document.addEventListener(
      'collectCameraState',
      handleCameraStateChange,
      false,
    );
    return () => {
      document.removeEventListener(
        'collectCameraState',
        handleCameraStateChange,
      );
    };
  }, [originConfig]);

  const handleChange = useCallback(
    async updates => {
      updates = Array.isArray(updates) ? updates : [updates];

      if (onChange) {
        const result = updateArrayConfig(configRef.current, updates);
        await onChange(result);
      }
      if (onFieldsChange) {
        await onFieldsChange(updates);
      }
    },
    [onChange, onFieldsChange, updateArrayConfig],
  );

  if (!Array.isArray(originConfig)) {
    console.error('config should be array');

    return <div>配置项格式错误</div>;
  }

  if (originConfig.length === 0) {
    return null;
  }

  // 转换配置，如果是旧配置项(以_开头)需要转化成新的(去掉_开头)
  let config = transformConfig(originConfig);

  let dimension;

  // 优先展示组件的基本属性，将位置信息过滤
  config = config.reduce((result, current) => {
    if (current.name === 'chart') {
      dimension = current.value.find(o => o.name === 'dimension');
      if (dimension) {
        const withoutDimensionConfig = current.value.filter(
          o => o.name !== 'dimension',
        );
        if (withoutDimensionConfig.length === 0) {
          return result;
        } else {
          return result.concat({
            ...current,
            value: withoutDimensionConfig,
          });
        }
      } else {
        return result.concat(current);
      }
    } else if (current.name === 'children') {
      // 过滤子组件配置
      return result;
    } else {
      return result.concat(current);
    }
  }, []);

  // 第一层级是都为横向的tab排列
  const isHorizontal =
    config.length <= 5 &&
    config.some(d => d.config && d.config.layout === 'horizontal');

  return (
    <>
      {dimension && (
        <ComponentDimension
          {...getComponentDimension(originConfig)}
          path={basePath}
          onChange={handleChange}
          hideDefault={hideDefault}
          onHideDefaultChange={onHideDefaultChange}
        />
      )}

      {isHorizontal ? (
        <Tabs type="card" size="small">
          {config.map(d => (
            <Tabs.TabPane key={d.name} tab={d.displayName}>
              {d.type === 'menu' ? (
                <EasyMenu
                  key={d.name}
                  config={d.value}
                  path={[d.name]}
                  onChange={handleChange}
                />
              ) : (
                <Generate
                  onCustomEvents={onCustomEvents}
                  key={d.name}
                  config={d.value}
                  path={[d.name]}
                  onChange={handleChange}
                  bordered={false}
                />
              )}
            </Tabs.TabPane>
          ))}
        </Tabs>
      ) : flat &&
        config.every(
          d => Array.isArray(d.value) && !(d.type && d.type !== 'modal'),
        ) ? (
        config.map(d => (
          <Generate
            key={d.name}
            bordered={bordered}
            path={[d.name]}
            onCustomEvents={onCustomEvents}
            config={d.value}
            onChange={handleChange}
          />
        ))
      ) : (
        <Generate
          bordered={bordered}
          config={config}
          onCustomEvents={onCustomEvents}
          onChange={handleChange}
        />
      )}
    </>
  );
}

export { Generate, Header };
