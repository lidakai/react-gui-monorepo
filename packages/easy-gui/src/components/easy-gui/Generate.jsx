import React from 'react';
import { isConfigShow } from 'easy-utils';
import isEmpty from 'lodash/isEmpty';
import { Collapse } from '../easy-design';
import ErrorBoundary from '../error-boundary';
import { FormItem, FormGroup } from '../layout';
import Field from './Field';
import Header from './Header';

const { Col } = FormGroup;

export default function Generate(props) {
  const { config = [], path = [], bordered, onChange, onCustomEvents } = props;
  let _depend = null;

  return (
    <ErrorBoundary message="组件配置项发生错误">
      {config.map(d => {
        const {
          type,
          name,
          displayName,
          value,
          dependencies,
          config: fieldConfig = {},
          rule,
          tip,
          ruleType,
        } = d;
        // 规则过滤
        if (rule && !isConfigShow(config, rule, ruleType)) {
          return null;
        }

        if (
          (type && type !== 'object' && type !== 'modal') ||
          !Array.isArray(value)
        ) {
          // show字段用于在父级header中显示icon
          if (name === 'show') {
            return null;
          }

          // 用于将子配置元素组成一组
          if (type === 'group') {
            return (
              <FormItem key={name} label={displayName} tip={tip}>
                <FormGroup>
                  {value.map(o => {
                    if (o.rule && !isConfigShow(value, o.rule, o.ruleType)) {
                      return null;
                    }

                    return (
                      <Col
                        key={o.name}
                        span={(o.config && o.config.span) || 24}
                      >
                        <Field
                          key={o.name}
                          mode="vertical"
                          type={o.type}
                          name={o.name}
                          onCustomEvents={onCustomEvents}
                          value={o.value}
                          displayName={o.displayName}
                          config={o.config}
                          path={path.concat(name).concat(o.name)}
                          tip={o.tip}
                          style={{ paddingLeft: 0 }}
                          onChange={onChange}
                        />
                      </Col>
                    );
                  })}
                </FormGroup>
              </FormItem>
            );
          }

          if (dependencies && Array.isArray(dependencies)) {
            // 存在依赖关系
            const filterConfig = {};
            _depend = [];
            config
              .filter(d => dependencies.includes(d.name))
              .map(d => {
                filterConfig[d.name] = d;
              });
            if (isEmpty(filterConfig)) {
              return null;
            }
            try {
              _depend = dependencies.map(d => {
                return [d, filterConfig[d].value];
              });
            } catch (e) {
              console.error(e);
            }
          }

          return (
            <Field
              key={name}
              dependencies={_depend}
              bordered={bordered}
              type={type}
              name={name}
              value={value}
              displayName={displayName}
              config={fieldConfig}
              onCustomEvents={onCustomEvents}
              path={path.concat(name)}
              tip={tip}
              onChange={onChange}
            />
          );
        } else {
          const showConfig = value.find(v => v.name === 'show');
          const show = showConfig && showConfig.value;
          const isEventMark =
            showConfig && showConfig.config && showConfig.config.isEventMark;

          return (
            <Collapse
              className="line"
              key={name}
              disabled={show === false}
              bordered={bordered}
              defaultCollapsed={!fieldConfig.defaultOpen}
              header={
                <Header
                  name={displayName}
                  isEventMark={isEventMark}
                  show={show}
                  tip={tip}
                  path={path.concat(name)}
                  onChange={onChange}
                />
              }
            >
              <Generate
                onCustomEvents={onCustomEvents}
                key={name}
                path={path.concat(name)}
                config={value}
                bordered={false}
                onChange={onChange}
              />
            </Collapse>
          );
        }
      })}
    </ErrorBoundary>
  );
}
