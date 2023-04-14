import React, { useState, useEffect, useCallback, useContext } from 'react';
import { EasySelect, EasyTreeSelect } from 'config-types';
import FormItem from 'layout/FormItem';
import { ConfigContext } from 'config-provider';
import { getEvents, getId, filterLayersWithEvents } from 'easy-utils';

export default function EasyRemoteEvent(props) {
  const { value, onChange } = props;
  const [screen, setScreen] = useState('');
  const [component, setComponent] = useState('');
  const [type, setType] = useState('event');
  const [event, setEvent] = useState('');

  const [panels, setPanels] = useState([]);
  const [screens, setScreens] = useState([]);
  const [components, setComponents] = useState([]);
  const [layers, setLayers] = useState([]);
  const [events, setEvents] = useState([]);
  const [allComponents, setAllComponents] = useState([]);

  const { getRemoteScreens, getRemoteComponents, getRemoteComponentConfig } =
    useContext(ConfigContext);

  useEffect(() => {
    const valueObj =
      typeof value === 'string' ? JSON.parse(value) : value || {};
    const {
      screen = '',
      component = '',
      type = 'event',
      event = '',
    } = valueObj;
    setScreen(screen);
    setComponent(component);
    setType(type);
    setEvent(event);
  }, [value]);

  useEffect(() => {
    if (getRemoteScreens) {
      getRemoteScreens().then(data => {
        setScreens(
          data.map(o => ({
            name: `${o.name}_${o.id}`,
            value: `$screen(${o.id})`,
            id: o.id,
          })),
        );
      });
    }
  }, []);

  useEffect(() => {
    if (screen && getRemoteComponents) {
      const screenId = getId(screen);
      getRemoteComponents(screenId).then(data => {
        const newComponents = data.layers;
        // const componentParent = data.components.filter(d => d.parent); // 有父级的组件
        // const _layers = data.layers.map(d => {
        //   const components = componentParent.filter(x => x.parent === d.id);
        //   if (components.length) {
        //     d['children'] = components;
        //   }
        //   return d;
        // });
        const layers = filterLayersWithEvents(
          data.layers,
          data.components,
          newComponents,
          data.panels,
        );
        setComponents(newComponents);
        setAllComponents(
          data.components.map(d => ({
            ...d,
            config: JSON.parse(d.config),
            triggers: JSON.parse(d.triggers),
            actions: JSON.parse(d.actions),
          })),
        );
        setPanels(data.panels);
        setLayers(layers);
      });
    }
  }, [screen, screens]);

  useEffect(() => {
    if (screen && component && !component.includes('group_')) {
      const screenId = getId(screen);
      const componentId = getId(component);

      getRemoteComponentConfig({ screenId, componentId }).then(data => {
        const newEvents = getEvents(
          {
            id: componentId,
            config: data.config,
            events: data.events,
          },
          components,
          panels,
          allComponents,
        );

        const values = [];
        const _newEvents = newEvents
          .map(o => {
            const key = Object.keys(o)[0];
            return {
              name: key,
              value: JSON.stringify(o[key]),
            };
          })
          .filter(d => {
            // 移除重复的事件
            if (!values.includes(d.value)) {
              values.push(d.value);
              return true;
            }
            return false;
          });
        setEvents(_newEvents);
      });
    }
  }, [screen, component, components, allComponents]);

  useEffect(() => {
    if (
      screen &&
      ((type === 'event' && component && event) || type === 'callback')
    ) {
      const valueObj = typeof value === 'string' ? JSON.parse(value) : value;
      const {
        screen: prevScreen,
        component: prevComponent,
        type: prevType,
        event: prevEvent,
      } = valueObj;
      if (
        screen !== prevScreen ||
        component !== prevComponent ||
        type !== prevType ||
        event !== prevEvent
      ) {
        onChange(
          JSON.stringify({
            screen,
            component,
            type,
            event,
          }),
        );
      }
    }
  }, [screen, component, type, event]);

  const handleScreen = useCallback(
    screen => {
      setScreen(screen);
      setComponent('');
      setEvent('');
    },
    [setScreen, setComponent, setEvent],
  );

  const handleComponent = useCallback(
    component => {
      setComponent(component);
      setEvent('');
    },
    [setComponent, setEvent],
  );

  const handleEvent = useCallback(
    event => {
      setEvent(event);
    },
    [setEvent],
  );

  const handleType = useCallback(
    type => {
      setType(type);
    },
    [setType],
  );

  return (
    <>
      <FormItem label="类型">
        <EasySelect
          value={type}
          options={[
            { name: '事件', value: 'event' },
            { name: '回调', value: 'callback' },
          ]}
          onChange={handleType}
        />
      </FormItem>
      <FormItem label="大屏">
        <EasySelect value={screen} options={screens} onChange={handleScreen} />
      </FormItem>
      {type === 'event' && (
        <FormItem label="组件">
          <EasyTreeSelect
            options={layers}
            value={component}
            onChange={handleComponent}
          />
        </FormItem>
      )}

      {type === 'event' && (
        <FormItem label="事件">
          <EasySelect
            name="event"
            value={event}
            options={events}
            onChange={handleEvent}
          />
        </FormItem>
      )}
    </>
  );
}
