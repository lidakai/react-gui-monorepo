import { produce } from 'immer'
import { isPlainObject } from 'lodash-es'

export function getComponentDimension(config) {
  if (config && Array.isArray(config)) {
    try {
      const chart = config.find((item) => item._name === 'chart')._value
      const dimension = chart.find((item) => item._name === 'dimension')._value
      const position = dimension.find(
        (item) => item._name === 'chartPosition',
      )._value
      const sizeObj = dimension.find((item) => item._name === 'chartDimension')
      const size = sizeObj._value

      const left = position.find((item) => item._name === 'left')._value
      const top = position.find((item) => item._name === 'top')._value
      const width = size.find((item) => item._name === 'width')._value
      const height = size.find((item) => item._name === 'height')._value
      const lock = sizeObj._lock

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
      result[item._name] =
        item._type && !notAtomConfigTypes.includes(item._type)
          ? item._value
          : reduceConfig(item._value)
      return result
    }, {})
}

// 更新config
export function updateArrayConfig(config, updates) {
  updates = Array.isArray(updates) ? updates : [updates]

  return produce(config, (newConfig) => {
    updates.map((update) => {
      let {
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
        field = field.startsWith('_') ? field : `_${field}`
        if (type === 'add') {
          // 如果存在值，以当前项为模板，否则以_template为模板
          const template = item._value.length
            ? item._value.find((d) => d._name === activeKey)
            : Array.isArray(item._template)
              ? item._template[0]
              : item._template
          item[field] = item._value.concat({ ...template, _name: newActiveKey })
        } else if (type === 'delete') {
          const newValue = item._value.filter((d) => d._name !== activeKey)
          item[field] = newValue
        } else if (type === 'sort') {
          const newValue = item._value.concat()
          const target = newValue.splice(oldIndex, 1)
          newValue.splice(newIndex, 0, target[0])
          item[field] = newValue
        } else {
          item[field] = value
        }
      }
    })
    return newConfig
  })
}

export function getValueObjFromConfig(config, path = []) {
  let nextValue = { _value: config }
  path.every((key) => {
    if (typeof key === 'number') {
      return (nextValue = nextValue._value[key])
    }
    return (nextValue = nextValue._value.find((item) => item._name === key))
  })
  return nextValue || null
}

// 根据路径在config中的值
export function getValueFromConfig(config, path, field = '_value') {
  const valueObj = getValueObjFromConfig(config, path)
  if (!field.startsWith('_')) {
    field = '_' + field
  }
  return valueObj && valueObj[field]
}

export function getConfig(config, type, device) {
  switch (type) {
    case 'style':
      return config.filter(
        (d) =>
          d._name !== 'interaction' &&
          d._type !== 'modal' &&
          d._name !== 'children',
      )
    case 'modal':
      return config.filter((d) => d._type === 'modal')
    case 'interaction':
      const interactionConfig = config.filter((d) => d._name === 'interaction')
      return device === 'screen'
        ? interactionConfig.map((d) => ({
          ...d,
          _value: d._value.filter((o) => o._name !== 'remoteControl'),
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
          default: childrenConfig._value.map((d) => ({
            name: d.label,
            moduleName: d.name,
          })),
          all: childrenConfig._children.map((d) => ({
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

const mergeConfigurationByConfig = (preEqual = {}, curEqual = {}) => {
  // 如果旧的组件配置项配置了是否隐藏，则新组建配置项合并时保留旧的show配置项
  const { _show } = preEqual
  const { _options } = curEqual
  if (_show === false) {
    // 如果是select控件，并且select控件新的配置项value值为空，旧的配置项value不为空
    if (
      curEqual._type === 'select' &&
      Array.isArray(_options) &&
      _options.length === 0
    ) {
      return { _show: false, _options }
    }
    return { _show: false }
  } else {
    if (
      curEqual._type === 'select' &&
      Array.isArray(_options) &&
      _options.length === 0
    ) {
      return { _options }
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
    const preEqual = prev.find((v) => v._name === d._name)

    if (
      preEqual != null &&
      (typeof d._value === typeof preEqual._value ||
        (!d._value && preEqual._value))
    ) {
      if (d._type === 'array') {
        const template = Array.isArray(d._template)
          ? d._template[0]
          : d._template
        const value = preEqual._value.map((v) => {
          return {
            ...v,
            _value: mergeConfig(template._value, v._value),
          }
        })

        return {
          ...d,
          ...(preEqual._show === false ? { _show: false } : {}),
          _value: value,
        }
      } else if (
        Array.isArray(d._value) &&
        ![
          'range',
          'cameras',
          'checkbox',
          'position',
          'select',
          'children',
          'rangeColor',
        ].includes(d._type)
      ) {
        return {
          ...d,
          ...(preEqual._show === false ? { _show: false } : {}),
          _value: mergeConfig(d._value, preEqual._value),
        }
      } else {
        return {
          ...d,
          // ...(preEqual._show === false ? { _show: false } : {}),
          ...mergeConfigurationByConfig(preEqual, d),
          _value: preEqual._value,
        }
      }
    } else {
      return d
    }
  })
}

export function mergeStyleConfig(current, theme) {
  return current.map((d) => {
    if (d._name === 'dimension' || d._name === 'interaction') {
      return d
    }

    const themeValue = theme.find((v) => v._name === d._name)
    if (
      themeValue != null &&
      (typeof d._value === typeof themeValue._value ||
        d._type === themeValue._type)
    ) {
      if (d._type === 'array') {
        const value = d._value.map((v, i) => {
          return themeValue._value[i]
            ? {
              ...v,
              _value: mergeStyleConfig(v._value, themeValue._value[i]._value),
            }
            : v
        })
        return {
          ...d,
          _value: value,
        }
      } else if (
        Array.isArray(d._value) &&
        ![
          'range',
          'checkbox',
          'position',
          'select',
          'children',
          'rangeColor',
        ].includes(d._type)
      ) {
        return {
          ...d,
          _value: mergeStyleConfig(d._value, themeValue._value),
        }
      } else {
        return {
          ...d,
          _value: themeValue._value,
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
    if (item._type === 'array') {
      const currentObj = obj[item._name]
      const keys = isPlainObject(currentObj) ? Object.keys(currentObj) : []
      let addedKeys = keys

      let newValue = item._value.reduce((all, current) => {
        if (keys.includes(current._name)) {
          addedKeys = addedKeys.filter((d) => d !== current._name)
          if (currentObj[current._name] === null) {
            // 删除的
            return all
          } else {
            // 修改的
            return all.concat({
              ...current,
              _value: updateArrayWithObject(
                current._value,
                currentObj[current._name],
              ),
            })
          }
        } else {
          // 未修改的
          return all.concat(current)
        }
      }, [])

      const template = Array.isArray(item._template)
        ? item._template[0]
        : item._template

      // 增加的
      newValue = newValue.concat(
        addedKeys
          .filter((d) => currentObj[d] !== null)
          .map((d) => ({
            ...template,
            _name: d,
            _value: updateArrayWithObject(template._value, currentObj[d]),
          })),
      )
      return all.concat({ ...item, _value: newValue })
    } else if (obj.hasOwnProperty(item._name)) {
      if (Array.isArray(item._value)) {
        return all.concat({
          ...item,
          _value: updateArrayWithObject(item._value, obj[item._name]),
        })
      } else {
        return all.concat({ ...item, _value: obj[item._name] })
      }
    } else {
      return all.concat(item)
    }
  }, [])
}
