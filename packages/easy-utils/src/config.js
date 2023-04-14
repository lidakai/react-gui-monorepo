import { isComponent, isPanel, isGroup, isRef } from './utils.js'

import {
  getComponentDimension as getComponentDimensionNew,
  reduceConfig as reduceConfigNew,
  updateArrayConfig as updateArrayConfigNew,
  getConfig as getConfigNew,
  mergeConfig as mergeConfigNew,
  mergeStyleConfig as mergeStyleConfigNew,
  updateArrayWithObject as updateArrayWithObjectNew,
  getValueObjFromConfig as getValueObjFromConfigNew,
  getValueFromConfig as getValueFromConfigNew,
} from './config.new.js'
import {
  getComponentDimension as getComponentDimensionOld,
  reduceConfig as reduceConfigOld,
  updateArrayConfig as updateArrayConfigOld,
  getConfig as getConfigOld,
  mergeConfig as mergeConfigOld,
  mergeStyleConfig as mergeStyleConfigOld,
  updateArrayWithObject as updateArrayWithObjectOld,
  getValueObjFromConfig as getValueObjFromConfigOld,
  getValueFromConfig as getValueFromConfigOld,
} from './config.old.js'

const defaultActions = [
  { name: '显示', value: 'show' },
  { name: '隐藏', value: 'hide' },
  { name: '显隐切换', value: 'show/hide' },
  { name: '切换组件状态', value: 'switchState' },
  { name: '更新组件配置', value: 'updateConfig' },
  { name: '移动', value: 'translate' },
  { name: '缩放', value: 'scale' },
  { name: '旋转', value: 'rotate' },
]

const customActions = [{ name: '切换状态', value: 'setIndex' }]

export function reduceConfig(config) {
  return isOldConfig(config) ? reduceConfigOld(config) : reduceConfigNew(config)
}

const _reduceConfig = (config) => {
  if (!Array.isArray(config)) {
    return config
  } else {
    return config.reduce((result, current) => {
      result[current.name] =
        current.type !== 'componentOptions' &&
          current.config &&
          current.config.options &&
          Array.isArray(current.config.options)
          ? _reduceConfig(
            (
              current.config.options.find((o) => o.value === current.value) ||
              {}
            ).name,
          )
          : _reduceConfig(current.value)
      return result
    }, {})
  }
}

const _findComponentInLayers = (layers, fakeId) => {
  const id = getId(fakeId)

  return layers.reduce((result, current) => {
    if (result) return result

    if (current.components) {
      if (!result && current.id === id) {
        result = current
      } else {
        result = _findComponentInLayers(current.components, fakeId)
      }
    } else {
      if (!result && current.id === id) {
        result = current
      }
    }

    return result
  }, null)
}

export function getComponentDimension(config) {
  return isOldConfig(config)
    ? getComponentDimensionOld(config)
    : getComponentDimensionNew(config)
}

export function getComponentConfig(config) {
  return isOldConfig(config) ? config : reduceConfigNew(config)
}

export function updateArrayConfig(config, updates) {
  return isOldConfig(config)
    ? updateArrayConfigOld(config, updates)
    : updateArrayConfigNew(config, updates)
}

export function getConfig(config, type, device) {
  return isOldConfig(config)
    ? getConfigOld(config, type, device)
    : getConfigNew(config, type, device)
}

export function mergeConfig(now, prev) {
  const isNowOldConfig = isOldConfig(now)
  const isPrevOldConfig = isOldConfig(prev)
  if (isNowOldConfig && isPrevOldConfig) {
    return mergeConfigOld(now, prev)
  } else if (!isNowOldConfig && isPrevOldConfig) {
    return mergeConfigNew(now, transformConfig(prev))
  } else {
    return mergeConfigNew(now, prev)
  }
}

export function mergeStyleConfig(current, styleConfig) {
  const isCurrentOldConfig = isOldConfig(current)
  const isStyleOldConfig = isOldConfig(styleConfig)
  if (isCurrentOldConfig && isStyleOldConfig) {
    return mergeStyleConfigOld(current, styleConfig)
  } else if (!isCurrentOldConfig && isStyleOldConfig) {
    return mergeStyleConfigNew(current, transformConfig(styleConfig))
  } else if (isCurrentOldConfig && !isStyleOldConfig) {
    return mergeStyleConfigOld(current, transformToOldConfig(styleConfig))
  } else {
    return mergeStyleConfigNew(current, styleConfig)
  }
}

export function updateArrayWithObject(config, obj) {
  return isOldConfig(config)
    ? updateArrayWithObjectOld(config, obj)
    : updateArrayWithObjectNew(config, obj)
}

// 将带旧的config配置（下划线开头）转化为新的config配置（不带下划线的）
export function transformConfig(config) {
  if (!Array.isArray(config) || config.length === 0 || !isOldConfig(config)) {
    return config
  }

  return config.map((d) => {
    const { _name, _displayName, _value, _type, _rule, _tip, ...rest } = d

    const result = {
      name: _name,
      displayName: _displayName,
      value: transformConfig(_value),
      config: {},
    }

    if (_type !== undefined) {
      result.type = _type
    }

    if (_rule !== undefined) {
      result.rule = _rule
    }

    if (_tip !== undefined) {
      result.tip = _tip
    }

    for (const k in rest) {
      result.config[k.slice(1)] = rest[k]
    }

    return result
  })
}

// 将不带下划线的配置转化为带下划线的
export function transformToOldConfig(config) {
  if (!Array.isArray(config)) {
    return config
  }

  if (config.length === 0) {
    return config
  }

  // 以第一个组件配置的_name是否存在来判断是否是带下划线的配置，如果带则原样返回
  if (isOldConfig(config)) {
    return config
  }

  return config.map((d) => {
    const { name, displayName, value, type, rule, tip, config } = d
    const result = {
      _type: type,
      _name: name,
      _displayName: displayName,
      _value: transformToOldConfig(value),
      _rule: rule,
      _tip: tip,
    }

    for (const k in config) {
      result['_' + k] = config[k]
    }

    return result
  })
}

function isOnCondition(config, rule) {
  const compareConfig = config.find((d) => d.name === rule[0])
  if (!compareConfig) {
    return false
  }

  switch (rule[1]) {
    case '$eq': {
      return compareConfig.value === rule[2]
    }
    case '$neq': {
      return compareConfig.value !== rule[2]
    }
    case '$gt': {
      return compareConfig.value > rule[2]
    }
    case '$lt': {
      return compareConfig.value < rule[2]
    }
    case '$gte': {
      return compareConfig.value >= rule[2]
    }
    case '$lte': {
      return compareConfig.value <= rule[2]
    }
    case '$in': {
      return compareConfig.value && compareConfig.value.includes(rule[2])
    }
    case '$nin': {
      return compareConfig.value || !compareConfig.value.includes(rule[2])
    }
    default:
      return false
  }
}

// 根据规则过滤config
export function isConfigShow(config = [], rules = [], ruleType = '$and') {
  if (ruleType === '$or') {
    return rules.some((rule) => {
      return isOnCondition(config, rule)
    })
  } else {
    return rules.every((rule) => {
      return isOnCondition(config, rule)
    })
  }
}

// 判断config是不是为旧的config（以下划线开头）
export function isOldConfig(config = []) {
  return config[0] && config[0].hasOwnProperty('_name')
}

// 根据路径在config中的值
export function getValueObjFromConfig(config, path) {
  const isOld = isOldConfig(config)

  return isOld
    ? getValueObjFromConfigOld(config, path)
    : getValueObjFromConfigNew(config, path)
}

// 根据路径在config中的值
export function getValueFromConfig(config, path, field) {
  const isOld = isOldConfig(config)

  return isOld
    ? getValueFromConfigOld(config, path, field)
    : getValueFromConfigNew(config, path, field)
}

// 组件选择中绑定自定义的id
export function getLayersWithCustomId(layers = [], onlyComponent) {
  return layers.reduce((result, current) => {
    if (typeof current.id === 'number') {
      return result.concat([
        {
          title: current.name,
          value: `$component(${current.id})`,
          children:
            current.children &&
            getLayersWithCustomId(current.children, onlyComponent),
        },
      ])
    } else if (current.id.includes('group_')) {
      return result.concat([
        {
          disabled: onlyComponent,
          title: current.name,
          value: `$group(${current.id})`,
          children: getLayersWithCustomId(current.components, onlyComponent),
        },
      ])
    } else if (current.id.toString().startsWith('panel_')) {
      return result.concat([
        {
          disabled: onlyComponent,
          title: current.name,
          value: `$panel(${current.id})`,
          children: getLayersWithCustomId(current.components, onlyComponent),
        },
      ])
    } else if (current.id.toString().startsWith('screen_')) {
      return result.concat({
        disabled: true,
        title: current.name,
        value: `$screen(${current.id.replace('screen_', '')})`,
        children: getLayersWithCustomId(current.components, onlyComponent),
      })
    }
  }, [])
}

// remote control get all interactions in selected component
export const getEvents = (component, layers, panels = [], components) => {
  let { id, config = [], events = [] } = component
  config = transformConfig(config)

  const result = []
  const originConfigs = reduceConfig(config)
  const configs = _reduceConfig(config)

  const originInteraction = originConfigs.interaction
  const interaction = configs.interaction
  if (interaction) {
    const events = interaction.events
    const originEvents = originInteraction.events
    if (events) {
      Object.keys(events).map((eventKey) => {
        const event = events[eventKey]
        const value = originEvents[eventKey]
        let type = null
        let action = null
        let component = null
        let panel = null
        Object.keys(event).map((objKey) => {
          objKey === 'type' && (type = event.type)
          objKey === 'action' && (action = event.action)
          value.action === 'switchState'
            ? objKey === 'panel' && (panel = JSON.parse(value.panel || '{}'))
            : objKey === 'component' &&
            (component = _findComponentInLayers(layers, event.component))
        })

        if (type && value.action !== 'switchState') {
          result.push({
            [`${type} ${action} ${component && component.name ? component.name : '组件'
              }`]: value,
          })
        }

        if (
          type &&
          value.action === 'switchState' &&
          panel &&
          panel.panelId &&
          panel.stateId
        ) {
          const panelId = (getId(panel.panelId) || '').split('_')[1]
          const stateId = getId(panel.stateId)

          if (panelId && stateId) {
            const thePanel = panels.find((o) => +o.id === +panelId)
            if (thePanel && thePanel.states) {
              const theState = thePanel.states.find((o) => +o.id === +stateId)
              if (theState) {
                result.push({
                  [`${type} 切换 ${thePanel.name} ${theState.name}`]: value,
                })
              }
            }
          }
        }
      })
    }
  }

  const originComponent = components.find((d) => d.id == id) || {}
  const { triggers = [] } = originComponent
  const allTriggers = [
    { name: '当请求完成或数据变化时', value: 'dataChange' },
  ].concat(triggers)
  function getRemoteConfigValue(trigger, config) {
    const {
      component: componentIds,
      action,
      stateId,
      translate,
      rotate,
      scale,
      componentConfig,
      actionData,
      animation,
      actionDataFn,
    } = config
    const currentTrigger = allTriggers.find((d) => d.value === trigger) || {}
    const triggerName = currentTrigger.name

    const targetComponentsInfo = componentIds
      .map((d) => {
        if (isComponent(d)) {
          return components.find((o) => o.id === getId(d))
        } else if (isPanel(d)) {
          return panels.find((o) => o.id == getId(d).replace('panel_', ''))
        } else if (isGroup(d)) {
          return _findComponentInLayers(layers, d)
        }
      })
      .filter((d) => d)

    const componentInfo = targetComponentsInfo[0] || {}
    const { actions = [] } = componentInfo
    const allActions = defaultActions.concat(actions).concat(customActions)
    const currentAction = allActions.find((d) => d.value === action) || {}

    const actionName = currentAction.name
    const targetComponentName = targetComponentsInfo.map(
      (d) => d.name || '组件',
    )

    return {
      [`${triggerName} ${action === 'switchState' ? '切换' : actionName
        } ${targetComponentName.join('、')}`]: {
        type: trigger,
        action: action,
        component: action === 'switchState' ? '' : componentIds,
        panel:
          action === 'switchState'
            ? `{"panelId": "${componentIds[0]}","stateId": "${stateId}" }`
            : '{}',
        componentConfig:
          action === 'updateConfig' ? componentConfig : undefined,
        actionData: defaultActions.some((d) => d.value === action)
          ? undefined
          : actionData,
        translate: action === 'translate' ? translate : undefined,
        scale: action === 'scale' ? scale : undefined,
        rotate: action === 'rotate' ? rotate : undefined,
        animation,
        actionDataFn,
        triggerComponentId: actionDataFn ? `$component(${id})` : undefined,
      },
    }
  }

  const customEvents = Array.isArray(events)
    ? events.reduce((all, item) => {
      const { trigger, actions: eventActions } = item

      if (eventActions) {
        return all.concat(
          eventActions.map((d) => getRemoteConfigValue(trigger, d)),
        )
      } else {
        return all.concat(getRemoteConfigValue(trigger, item))
      }
    }, [])
    : []
  return result.concat(customEvents)
}

// filter layers with events
export const filterLayersWithEvents = (
  layers,
  components,
  componentsWithInfo,
  panels,
) => {
  return layers.reduce((result, current) => {
    if (isGroup(current.id)) {
      const componentsResult = filterLayersWithEvents(
        current.components,
        components,
        componentsWithInfo,
        panels,
      )
      if (componentsResult && componentsResult.length > 0) {
        return result.concat([
          {
            ...current,
            title: current.name,
            value: `$component(${current.id})`,
            children: componentsResult,
          },
        ])
      } else {
        return result
      }
    }
    if (isComponent(current.id)) {
      const component = components.find((o) => +o.id === +current.id)
      if (component) {
        const { events: customEvents, config } = component

        const events = getEvents(
          {
            id: current.id,
            config: JSON.parse(config),
            events: JSON.parse(customEvents),
          },
          componentsWithInfo,
          panels,
          components,
        )
        if (~components.findIndex((d) => d.parent === current.id)) {
          // 子组件是否存在事件
          const currentChildrens = components.filter(
            (d) => d.parent === current.id,
          )
          const componentsResult = filterLayersWithEvents(
            currentChildrens,
            components,
            componentsWithInfo,
            panels,
          )
          if (componentsResult.length > 0) {
            return result.concat([
              {
                ...current,
                title: current.name,
                disabled: !(events.length > 0),
                value: `$component(${current.id})`,
                children: componentsResult,
              },
            ])
          } else if (Array.isArray(events) && events.length) {
            return result.concat([
              {
                ...current,
                title: current.name,
                value: `$component(${current.id})`,
              },
            ])
          } else {
            return result
          }
        } else if (events.length > 0) {
          return result.concat([
            {
              ...current,
              title: current.name,
              value: `$component(${current.id})`,
            },
          ])
        } else {
          return result
        }
      } else {
        return result
      }
    } else {
      return result
    }
  }, [])
}

export function getStateOptions(states = []) {
  return state.map((d) => ({ name: d.name, value: `$state(${d.value})` }))
}

export function getComponentOptions({
  screensById,
  panelsById,
  componentsById,
  screenId,
  stateId,
  mode = 'current',
}) {
  const screen =
    mode === 'current' ? screensById[stateId] : screensById[screenId]

  if (screen) {
    const { layers = [] } = screen

    const deepMapLayers = (layers) => {
      return layers.map((item) => {
        if (isComponent(item.id)) {
          const componentWithChildren = getComponentLayerWithChildren({
            componentsById,
            id: item.id,
            name: item.name,
          })
          return componentWithChildren
        } else if (isPanel(item.id)) {
          if (mode === 'current') {
            return {
              title: item.name,
              value: `$panel(${item.id})`,
            }
          } else {
            const panelWithStates = getPanelWithStates({
              screensById,
              panelsById,
              id: item.id,
              name: item.name,
            })

            if (panelWithStates.children) {
              return {
                ...panelWithStates,
                children: panelWithStates.children.map((d) => {
                  const stateId = getId(d.value)
                  return {
                    ...d,
                    disabled: true,
                    children: getComponentOptions({
                      screensById,
                      componentsById,
                      panelsById,
                      screenId: stateId,
                      stateId: stateId,
                      mode: 'global',
                    }),
                  }
                }),
              }
            } else {
              return panelWithStates
            }
          }
        } else if (isRef(item.id)) {
          return {
            title: item.name,
            value: `$panel(${item.id})`,
          }
        } else if (isGroup(item.id)) {
          return {
            title: item.name,
            value: `$group(${item.id})`,
            children: deepMapLayers(item.components),
          }
        }
      })
    }

    return deepMapLayers(layers)
  } else {
    return []
  }
}

function getComponentLayerWithChildren({ componentsById, id, name }) {
  const component = componentsById[id] || {}
  let { children = [] } = component

  if (children.length > 0) {
    children = children.reduce((result, childId) => {
      const child = componentsById[childId]
      return child
        ? result.concat({
          value: `$component(${childId})`,
          title: child.name,
        })
        : result
    }, [])

    return {
      title: name,
      value: `$component(${id})`,
      children: children,
    }
  } else {
    return {
      title: name,
      value: `$component(${id})`,
    }
  }
}

export function getPanelOptions({
  screensById,
  panelsById,
  screenId,
  stateId,
  mode = 'current',
}) {
  const screen =
    mode === 'current' ? screensById[stateId] : screensById[screenId]

  if (screen) {
    const { layers = [] } = screen

    const deepMapLayers = (layers) => {
      return layers.reduce((all, item) => {
        if (isPanel(item.id)) {
          if (mode === 'current') {
            return all.concat({
              title: item.name,
              value: `$panel(${item.id})`,
            })
          } else {
            const panelWithStates = getPanelWithStates({
              screensById,
              panelsById,
              id: item.id,
              name: item.name,
            })

            if (panelWithStates.children) {
              return all.concat({
                ...panelWithStates,
                children: panelWithStates.children.map((d) => {
                  const stateId = getId(d.value)
                  return {
                    ...d,
                    disabled: true,
                    children: getPanelOptions({
                      screensById,
                      panelsById,
                      screenId: stateId,
                      stateId: stateId,
                      mode: 'global',
                    }),
                  }
                }),
              })
            } else {
              return all.concat(panelWithStates)
            }
          }
        } else if (isRef(item.id)) {
          return all.concat({
            title: item.name,
            value: `$panel(${item.id})`,
          })
        } else if (isGroup(item.id)) {
          return all.concat(deepMapLayers(item.components))
        } else {
          return all
        }
      }, [])
    }

    return deepMapLayers(layers)
  } else {
    return []
  }
}

export function getPanelWithStates({ panelsById, screensById, id, name }) {
  if (!id) {
    return {}
  }

  const panelId = +id.replace(/panel_|ref_/g, '')
  const panel = panelsById[panelId]

  if (panel) {
    const { states = [] } = panel
    return {
      title: name,
      value: `$panel(${id})`,
      children: states.reduce((result, stateId) => {
        const stateScreen = screensById[stateId]

        return stateScreen
          ? result.concat({
            title: stateScreen.name,
            value: `$state(${stateId})`,
          })
          : result
      }, []),
    }
  } else {
    return {
      title: name,
      value: `$panel(${id})`,
    }
  }
}

export const getId = (id) => {
  if (!id) {
    return
  }

  const regs = {
    component: /^\$component\(([0-9]+)\)/,
    group: /^\$group\((group_\w+)\)/,
    panel: /^\$panel\((panel_[0-9]+)\)/,
    panel2: /^panel_([0-9]+)/,
    state: /^\$state\(([0-9]+)\)/,
    state2: /^state_([0-9]+)/,
    screen: /^\$screen\(([0-9]+)\)/,
    screen2: /^screen_([0-9]+)/,
    ref: /^ref_([0-9]+)/,
    ref2: /^\$panel\((ref_[0-9]+)\)/,
  }

  const reg = Object.values(regs).find((d) => d.test(id))
  if (reg) {
    id = id.replace(reg, (match, p) => p)
  }

  return isNaN(+id) ? id : +id
}

// 模型库类型
export const getModelTypes = () => [
  'glb',
  'gltf',
  'fbx',
  'obj',
  'stl',
  'dae',
  '3dm',
  '3ds',
  '3mf',
  'amf',
  'pmd',
  'vmd',
  'vpd',
  'ply',
  'vrm',
  'wrl',
  'b3dm',
  'osgb',
]
