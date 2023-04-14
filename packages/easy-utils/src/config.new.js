import { produce } from 'immer'
import { isPlainObject } from 'lodash-es'

export function getComponentDimension(config) {
  if (config && Array.isArray(config)) {
    try {
      const chart = config.find((item) => item.name === 'chart').value
      const dimension = chart.find((item) => item.name === 'dimension').value
      const position = dimension.find(
        (item) => item.name === 'chartPosition',
      ).value
      const sizeObj = dimension.find((item) => item.name === 'chartDimension')
      const size = sizeObj.value

      const left = position.find((item) => item.name === 'left').value
      const top = position.find((item) => item.name === 'top').value
      const width = size.find((item) => item.name === 'width').value
      const height = size.find((item) => item.name === 'height').value
      const lock = sizeObj.config && sizeObj.config.lock

      return { left, top, width, height, lock }
    } catch (error) {
      console.error(error)
      return { width: 0, height: 0, left: 0, top: 0 }
    }
  } else {
    return { width: 0, height: 0, left: 0, top: 0 }
  }
}

// 将数组config转化为对象config, 原子控件的值则不需要再对其value进行转化
const notAtomConfigTypes = [
  'array',
  'object',
  'group',
  'colors',
  'menu',
  'modal',
]

export function reduceConfig(config) {
  if (!Array.isArray(config)) {
    return config
  }

  return config
    .filter((d) => d)
    .reduce((result, item) => {
      result[item.name] =
        item.type && !notAtomConfigTypes.includes(item.type)
          ? item.value
          : reduceConfig(item.value)
      return result
    }, {})
}

export function updateArrayConfig(config, updates) {
  config =
    Array.isArray(config) && config.length
      ? config
      : [
        {
          config: {
            layout: 'horizontal',
            show: true,
          },
          displayName: '基础配置',
          name: 'basicConfig',
          value: [],
        },
      ]
  updates = Array.isArray(updates) ? updates : [updates]

  return produce(config, (newConfig) => {
    updates.map((update) => {
      const {
        value,
        path,
        field = 'value',
        type,
        activeKey,
        newActiveKey,
        oldIndex,
        newIndex,
      } = update

      const item = getValueObjFromConfig(newConfig, path)

      if (item) {
        if (type === 'add') {
          if (item.config && item.config.template) {
            const template = item.value.length
              ? item.value.find((d) => d.name === activeKey)
              : Array.isArray(item.config.template)
                ? item.config.template[0]
                : item.config.template
            item[field] = item.value.concat({ ...template, name: newActiveKey })
          } else {
            console.error('configuration should has config.template')
          }
        } else if (type === 'delete') {
          const newValue = item.value.filter((d) => d.name !== activeKey)
          item[field] = newValue
        } else if (type === 'sort') {
          const newValue = item.value.concat()
          const target = newValue.splice(oldIndex, 1)
          newValue.splice(newIndex, 0, target[0])
          item[field] = newValue
        } else {
          if (field === 'value') {
            item.value = value
          } else {
            if (item.config) {
              item.config[field] = value
            } else {
              item.config = {
                [field]: value,
              }
            }
          }
        }
      }
    })
    return newConfig
  })
}

// 根据路径在config中的对象值
export function getValueObjFromConfig(config, path = []) {
  let nextValue = { value: config }
  path.every((key) => {
    if (typeof key === 'number') {
      return (nextValue = nextValue.value[key])
    }
    return (nextValue = nextValue.value.find((item) => item.name === key))
  })
  return nextValue || null
}

// 根据路径在config中的值
export function getValueFromConfig(config, path, field = 'value') {
  const valueObj = getValueObjFromConfig(config, path)
  return (
    valueObj &&
    (field === 'value'
      ? valueObj.value
      : valueObj.config && valueObj.config[field])
  )
}

export function getConfig(config, type, device) {
  switch (type) {
    case 'style':
      return config.filter(
        (d) =>
          d.name !== 'interaction' &&
          d.type !== 'modal' &&
          d.name !== 'children',
      )
    case 'modal':
      return config.filter((d) => d.type === 'modal')
    case 'interaction':
      const interactionConfig = config.filter((d) => d.name === 'interaction')
      return device === 'screen'
        ? interactionConfig.map((d) => ({
          ...d,
          value: d.value.filter((o) => o.name !== 'remoteControl'),
        }))
        : interactionConfig
    case 'children':
      const childrenConfig = getValueObjFromConfig(config, [
        'children',
        'component',
        'list',
      ])
      if (childrenConfig) {
        return {
          default: childrenConfig.value.map((d) => ({
            name: d.label,
            moduleName: d.name,
          })),
          all: childrenConfig.children.map((d) => ({
            name: d.name,
            moduleName: d.value,
          })),
        }
      } else {
        return null
      }
    default:
      return config
  }
}

const mergeConfigurationByConfig = (preEqual, curEqual = {}) => {
  // 如果旧的组件配置项配置了是否隐藏，则新组建配置项合并时保留旧的show配置项
  const { config = {} } = curEqual
  if (preEqual.config && preEqual.config.show === false) {
    // 如果是select控件，并且select控件新的配置项value值为空，旧的配置项value不为空
    if (
      curEqual.type === 'select' &&
      config &&
      Array.isArray(config.options) &&
      config.options.length == 0
    ) {
      return {
        config: { ...config, options: preEqual.config.options, show: false },
      }
    }
    return { config: { ...(config ? config : {}), show: false } }
  } else {
    if (
      curEqual.type === 'select' &&
      config &&
      Array.isArray(config.options) &&
      config.options.length == 0
    ) {
      return { config: { ...config, options: preEqual.config.options } }
    }
    return {}
  }
}

export function mergeConfig(now = [], prev = []) {
  if (prev.length === 0 || now.length === 0) {
    return now
  }
  if (!Array.isArray(prev)) {
    return now
  }
  return now.map((d) => {
    const preEqual = prev.find((v) => v.name === d.name)
    if (
      preEqual != null &&
      (typeof d.value === typeof preEqual.value || (!d.value && preEqual.value))
    ) {
      if (d.type === 'array') {
        const { config = {} } = d
        const template = Array.isArray(config.template)
          ? config.template[0]
          : config.template
        const value = preEqual.value.map((v) => {
          return {
            ...v,
            value: mergeConfig(template.value, v.value),
          }
        })

        return {
          ...d,
          ...(preEqual.config && preEqual.config.show === false
            ? { config: { ...(d.config ? d.config : {}), show: false } }
            : {}),
          value: value,
        }
      } else if (
        Array.isArray(d.value) &&
        ![
          'range',
          'cameras',
          'checkbox',
          'position',
          'select',
          'children',
          'rangeColor',
        ].includes(d.type)
      ) {
        return {
          ...d,
          ...(preEqual.config && preEqual.config.show === false
            ? { config: { ...(d.config ? d.config : {}), show: false } }
            : {}),
          value: mergeConfig(d.value, preEqual.value),
        }
      } else {
        return {
          ...d,
          ...mergeConfigurationByConfig(preEqual, d),
          value: preEqual.value,
        }
      }
    } else {
      return d
    }
  })
}

export function mergeStyleConfig(current, theme) {
  return current.map((d) => {
    if (d.name === 'dimension' || d.name === 'interaction') {
      return d
    }

    const themeValue = theme.find((v) => v.name === d.name)
    // 存在且类型相同
    if (
      themeValue != null &&
      (typeof d.value === typeof themeValue.value || d.type === themeValue.type)
    ) {
      if (d.type === 'array') {
        const { config = {} } = d
        // let template = Array.isArray(config.template) ? config.template[0] : config.template;
        const value = d.value.map((v, i) => {
          return themeValue.value[i]
            ? {
              ...v,
              value: mergeStyleConfig(v.value, themeValue.value[i].value),
            }
            : v
        })
        return {
          ...d,
          value: value,
        }
      } else if (
        Array.isArray(d.value) &&
        ![
          'range',
          'checkbox',
          'position',
          'select',
          'children',
          'rangeColor',
        ].includes(d.type)
      ) {
        return {
          ...d,
          value: mergeStyleConfig(d.value, themeValue.value),
        }
      } else {
        return {
          ...d,
          value: themeValue.value,
        }
      }
    } else {
      return d
    }
  })
}

export function updateArrayWithObject(arr, obj) {
  if (obj == null) {
    return arr
  }

  return arr.reduce((all, item) => {
    if (item.type === 'array') {
      const currentObj = obj[item.name]
      const keys = isPlainObject(currentObj) ? Object.keys(currentObj) : []
      let addedKeys = keys

      let newValue = item.value.reduce((all, current) => {
        if (keys.includes(current.name)) {
          addedKeys = addedKeys.filter((d) => d !== current.name)
          if (currentObj[current.name] === null) {
            // 删除的
            return all
          } else {
            // 修改的
            return all.concat({
              ...current,
              value: updateArrayWithObject(
                current.value,
                currentObj[current.name],
              ),
            })
          }
        } else {
          // 未修改的
          return all.concat(current)
        }
      }, [])

      const template = Array.isArray(item.config.template)
        ? item.config.template[0]
        : item.config.template

      // 增加的
      newValue = newValue.concat(
        addedKeys
          .filter((d) => currentObj[d] !== null)
          .map((d) => ({
            ...template,
            name: d,
            value: updateArrayWithObject(template.value, currentObj[d]),
          })),
      )
      return all.concat({ ...item, value: newValue })
    } else if (obj.hasOwnProperty(item.name)) {
      if (Array.isArray(item.value)) {
        return all.concat({
          ...item,
          value: updateArrayWithObject(item.value, obj[item.name]),
        })
      } else {
        return all.concat({ ...item, value: obj[item.name] })
      }
    } else {
      return all.concat(item)
    }
  }, [])
}
