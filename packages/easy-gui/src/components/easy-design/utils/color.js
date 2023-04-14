export function resolveColor(color) {
  if (!color || typeof color !== 'string') {
    return {};
  }

  // 转为小写并去除空格
  color = color.toLowerCase().replace(/\s+/g, '');
  const hexReg = /^#([0-9|a-f]{3}|[0-9|a-f]{6})$/;
  const rgbReg = /^(rgb\(\d+,\d+,\d+\)|rgba\(\d+,\d+,\d+,(\d+)?(\.)?(\d+)?\))$/;
  // const rgbReg1 = /^(rgb\(\d+,\d+,\d+\)|rgba\((\d+)?(\.)?(\d+)?,(\d+)?(\.)?(\d+)?,(\d+)?(\.)?(\d+)?,(\d+)?(\.)?(\d+)?\))$/;

  let r, g, b, a;
  if (hexReg.test(color)) {
    if (color.length === 4) {
      r = parseInt(color.slice(1, 2) + color.slice(1, 2), 16);
      g = parseInt(color.slice(2, 3) + color.slice(2, 3), 16);
      b = parseInt(color.slice(3, 4) + color.slice(3, 4), 16);
    } else {
      r = parseInt(color.slice(1, 3), 16);
      g = parseInt(color.slice(3, 5), 16);
      b = parseInt(color.slice(5, 7), 16);
    }
    a = 1;
  } else if (rgbReg.test(color)) {
    const colors = color.replace(/rgba|rgb|\(|\)/g, '').split(',');
    r = Number(colors[0]);
    g = Number(colors[1]);
    b = Number(colors[2]);
    a = colors.length === 4 ? Number(colors[3]) : 1;
  } else {
    return {};
  }

  // return { r: Math.floor(r), g: Math.floor(g), b: Math.floor(b), a, hex: `#${toHex(r)}${toHex(g)}${toHex(b)}` };
  return { r, g, b, a, hex: `#${toHex(r)}${toHex(g)}${toHex(b)}` };
}

export function toHex(x) {
  return `0${parseInt(x).toString(16)}`.slice(-2);
}

export function transformColor(color, a) {
  const { r, g, b, hex } = resolveColor(color);
  return a === 1 ? hex : `RGBA(${r},${g},${b},${a})`;
}

export function getBackgroundAccordingColor(color, fixedAngle) {
  if (typeof color === 'string') {
    return { background: color };
  } else if (Array.isArray(color)) {
    const rebaseStops = color.concat();
    rebaseStops.sort((a, b) => a.offset - b.offset);

    const colors = rebaseStops.map((item, index) => {
      const { r, g, b, a } = resolveColor(item.color);
      if (a === 1 || index === rebaseStops.length - 1) {
        return `${item.color} ${item.offset}%`;
      } else {
        const {
          r: nextR,
          g: nextG,
          b: nextB,
          a: nextA,
        } = resolveColor(rebaseStops[index + 1].color);
        const stepOpacity = (nextA - a) / 5;
        const stepOffset = (rebaseStops[index + 1].offset - item.offset) / 5;
        const stepR = (nextR - r) / 5;
        const stepG = (nextG - g) / 5;
        const stepB = (nextB - b) / 5;
        return Array.from({ length: 5 })
          .map(
            (d, i) =>
              `${transformColor(
                `rgb(${Math.round(r + stepR * i)},${Math.round(
                  g + stepG * i,
                )},${Math.round(b + stepB * i)})`,
                a + stepOpacity * i,
              )} ${item.offset + stepOffset * i}%`,
          )
          .join(',');
      }
    });

    return {
      backgroundImage: `linear-gradient(${fixedAngle || 0}deg, ${colors.join(
        ',',
      )})`,
    };
  } else if (typeof color === 'object') {
    const {
      type = 'pure',
      linear: { stops, angle, opacity } = {
        // stops: [{ offset: 0, color: '#000', offset: 100, color: '#fff' }],
        stops: [{ offset: 100, color: '#fff' }],
        angle: 0,
        opacity: 1,
      },
      pure: pureColor = '#000',
    } = color;
    if (type === 'linear') {
      const rebaseStops = stops.concat();
      rebaseStops.sort((a, b) => a.offset - b.offset);

      const colors = rebaseStops.map((item, index) => {
        const { r, g, b, a } = resolveColor(item.color);
        if (a === 1 || index === rebaseStops.length - 1) {
          return `${transformColor(item.color, a * opacity)} ${item.offset}%`;
        } else {
          const {
            r: nextR,
            g: nextG,
            b: nextB,
            a: nextA,
          } = resolveColor(rebaseStops[index + 1].color);
          const stepOpacity = (nextA - a) / 5;
          const stepOffset = (rebaseStops[index + 1].offset - item.offset) / 5;
          const stepR = (nextR - r) / 5;
          const stepG = (nextG - g) / 5;
          const stepB = (nextB - b) / 5;
          return Array.from({ length: 5 })
            .map(
              (d, i) =>
                `${transformColor(
                  `rgb(${Math.round(r + stepR * i)},${Math.round(
                    g + stepG * i,
                  )},${Math.round(b + stepB * i)})`,
                  (a + stepOpacity * i) * opacity,
                )} ${item.offset + stepOffset * i}%`,
            )
            .join(',');
        }
      });

      return {
        backgroundImage: `linear-gradient(${
          fixedAngle != undefined ? fixedAngle : angle
        }deg, ${colors.join(',')})`,
      };
    } else {
      return { background: pureColor };
    }
  }
}

export function getMiddleColor(colors, offset) {
  let leftColor, rightColor;
  const leftColors = colors.filter(d => d.offset < offset);
  const rightColors = colors.filter(d => d.offset > offset);

  if (leftColors.length) {
    leftColors.sort((a, b) => b.offset - a.offset);
    leftColor = leftColors[0];
  }

  if (rightColors.length) {
    rightColors.sort((a, b) => a.offset - b.offset);
    rightColor = rightColors[0];
  }

  if (!leftColor) {
    return rightColor.color;
  }

  if (!rightColor) {
    return leftColor.color;
  }

  // console.log(leftColor, rightColor, leftColors, rightColors, '计算color');

  const {
    r: leftR,
    g: leftG,
    b: leftB,
    a: leftA,
  } = resolveColor(leftColor.color);
  const {
    r: rightR,
    g: rightG,
    b: rightB,
    a: rightA,
  } = resolveColor(rightColor.color);

  // console.log(resolveColor(leftColor.color), resolveColor(rightColor.color), '计算color');

  const newR = Math.round(
    ((rightR - leftR) / (rightColor.offset - leftColor.offset)) *
      (offset - leftColor.offset) +
      leftR,
  );
  const newG = Math.round(
    ((rightG - leftG) / (rightColor.offset - leftColor.offset)) *
      (offset - leftColor.offset) +
      leftG,
  );
  const newB = Math.round(
    ((rightB - leftB) / (rightColor.offset - leftColor.offset)) *
      (offset - leftColor.offset) +
      leftB,
  );
  const newA =
    ((rightA - leftA) / (rightColor.offset - leftColor.offset)) *
      (offset - leftColor.offset) +
    leftA;

  return newA === 1
    ? `#${toHex(newR)}${toHex(newG)}${toHex(newB)}`
    : `RGBA(${newR},${newG},${newB},${newA})`;
}
