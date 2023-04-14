export function generateId() {
  return Math.random().toString(36).substr(3, 20)
}

export function deepFind(data = [], predicate, deepKey = 'components') {
  return data.reduce(
    (all, item) =>
      predicate(item)
        ? all.concat(item)
        : Array.isArray(item[deepKey])
          ? all.concat(deepFind(item[deepKey], predicate, deepKey))
          : all,
    [],
  )
}

export function deepFindOne(data = [], predicate, deepKey = 'components') {
  for (let i = 0; i < data.length; i++) {
    const item = data[i]
    if (predicate(item)) {
      return item
    } else {
      if (Array.isArray(item[deepKey])) {
        const result = deepFindOne(item[deepKey], predicate, deepKey)
        if (result) {
          return result
        }
      }
    }
  }
}

export function deepMap(data = [], predicate, deepKey = 'components') {
  return data.reduce(
    (all, item) =>
      item.hasOwnProperty(deepKey)
        ? all.concat({
          ...predicate(item),
          [deepKey]: deepMap(item[deepKey], predicate, deepKey),
        })
        : all.concat(predicate(item)),
    [],
  )
}

export function isPanel(id) {
  return /^panel_/.test(id) || /^\$panel\(panel_([0-9]+)\)/.test(id)
}

export function isRef(id) {
  return /^ref_/.test(id) || /^\$panel\(ref_([0-9]+)\)/.test(id)
}

export function isGroup(id) {
  return /^group_/.test(id) || /^\$group\((group_\w+)\)/.test(id)
}

export function isState(id) {
  return /^state_/.test(id) || /^\$state\(([0-9]+)\)/.test(id)
}

export function isScreen(id) {
  return /^screen_/.test(id) || /^\$screen\(([0-9]+)\)/.test(id)
}

export function isComponent(id) {
  return typeof id === 'number' || /^\$component\(([0-9]+)\)/.test(id)
}

export function raf(cb) {
  let next = null
  let stop = true
  function run() {
    requestAnimationFrame(() => {
      if (!next) {
        stop = true
        return
      }
      stop = false
      const _next = next
      next = null
      try {
        _next()
      } catch (e) {
        console.error(e)
      } finally {
        run()
      }
    })
  }
  return function (...args) {
    next = () => cb.apply(null, args)
    stop && run()
  }
}

// 除法
export function safeDiv(a, b) {
  return parseInt(a * 1e6) / parseInt(b * 1e6)
}

// 模除
export function safeModulo(a, b) {
  return (parseInt(a * 1e6) % parseInt(b * 1e6)) / 1e6
}

// 加
export function safeAdd(a, b) {
  return (parseInt(a * 1e6) + parseInt(b * 1e6)) / 1e6
}

// 乘
export function safeMul(n1, n2) {
  const a = n1.toString()
  const al = a.length - a.indexOf('.') - 1
  const b = n2.toString()
  const bl = b.length - b.indexOf('.') - 1
  return (a * Math.pow(10, al) * b * Math.pow(10, bl)) / Math.pow(10, al + bl)
}

/**计算没有括号的表达式的值(操作符限定为'+'、'-'、'*'、'/') */
function calcExpressionWithoutQuote(expression) {
  if (expression.indexOf('(') > -1 || expression.indexOf(')') > -1) {
    return calcExpression(expression)
  }

  if (!isNaN(Number(expression))) {
    return Number(expression)
  }

  const operators = []
  const nums = []
  let lastOperatorIndex = -1
  for (let i = 0; i < expression.length; i++) {
    const charAtIndex = expression.charAt(i)
    if (isOperatorChar(charAtIndex)) {
      operators[operators.length] = charAtIndex
      nums[nums.length] = expression.substring(lastOperatorIndex + 1, i)
      lastOperatorIndex = i
    }
    if (i == expression.length - 1 && lastOperatorIndex < i) {
      nums[nums.length] = expression.substring(
        lastOperatorIndex + 1,
        expression.length,
      )
    }
  }
  if (operators.length <= 0 || nums.length <= 0) {
    return Number(expression)
  }
  while (operators.indexOf('*') > -1 || operators.indexOf('/') > -1) {
    operators.forEach(function (value, index) {
      if (value == '*' || value == '/') {
        // 拿到操作符位置。
        const tempResult = calcExpressionWithSingleOperator(
          nums[index],
          nums[index + 1],
          value,
        )
        operators.splice(index, 1)
        nums.splice(index, 2, [tempResult])
      }
    })
  }
  let calcResult = nums[0] * 1
  // 现在只剩下'+'、'-'了
  if (operators.indexOf('+') > -1 || operators.indexOf('-') > -1) {
    for (let index = 0; index < operators.length; index++) {
      const value = operators[index]
      if (value == '+' || value == '-') {
        calcResult = calcExpressionWithSingleOperator(
          calcResult,
          nums[index + 1],
          value,
        )
      }
    }
    return calcResult
  } else {
    return nums[0] * 1
  }
}

/**
 * 计算只有一个操作符的表达式的值(操作符限定为'+'、'-'、'*'、'/')
 */
function calcExpressionWithSingleOperator(num1, num2, operator) {
  if (operator == '+') return num1 * 1 + num2 * 1
  if (operator == '-') return num1 * 1 - num2 * 1
  if (operator == '*') return num1 * num2
  if (operator == '/') return num1 / num2
  return NaN
}

/** 计算算术表达式的值 */
export function calcExpression(expression) {
  if (!expression || typeof expression !== 'string') {
    return expression
  }

  expression = expression
    .replace(/\s/g, '')
    .replace(/÷/g, '/')
    .replace(/x/g, '*')
    .replace(/×/g, '*')
    .replace(/X/g, '*')

  if (isRepeatOperator(expression)) {
    return NaN
  }

  if (
    getCharCountInString(expression, '(') !=
    getCharCountInString(expression, ')')
  ) {
    return NaN
  }

  while (
    expression &&
    expression.indexOf('(') > -1 &&
    expression.indexOf(')') > -1
  ) {
    const firstRightQuoteIndex = expression.indexOf(')')
    let leftQuoteIndex = expression.indexOf('(')
    for (let i = leftQuoteIndex; i < firstRightQuoteIndex; i++) {
      if (expression.charAt(i) == '(') {
        leftQuoteIndex = i
      }
    }
    const tempExpression = expression.substring(
      leftQuoteIndex + 1,
      firstRightQuoteIndex,
    )
    const tempValue = calcExpressionWithoutQuote(tempExpression)
    expression =
      expression.substring(0, leftQuoteIndex) +
      tempValue +
      expression.substring(firstRightQuoteIndex + 1, expression.length)
  }
  return calcExpressionWithoutQuote(expression)
}

/**获取字符串中某子字符串出现次数 */
function getCharCountInString(strings, chars) {
  return strings.split(chars).length - 1
}

/**判断字符是否是运算符 */
function isOperatorChar(aimChar) {
  return '+-*/'.indexOf(aimChar) > -1
}

function isRepeatOperator(expression) {
  return /([\+\-\*\/]){2,}/.test(expression)
}
