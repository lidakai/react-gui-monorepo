import { EasyBoolean } from 'config-types';
import { Icon, Collapse } from 'easy-design';
import { FormGroup, FormItem } from 'layout';
import InputNumber from './InputNumber';

const { Col } = FormGroup;

export default function ComponentDimension(props) {
  const {
    width,
    height,
    top,
    left,
    lock,
    hideDefault,
    path,
    onHideDefaultChange,
    onChange,
  } = props;

  const handleChange = path => {
    return updateValue => {
      const key = path[path.length - 1];
      const updated = [{ path, value: Math.floor(updateValue) }];
      if (key === 'width' || key === 'height') {
        if (lock && width && height) {
          const ratio = width / height;
          const anotherUpdateKey = key === 'width' ? 'height' : 'width';

          const anotherUpdateValue =
            anotherUpdateKey === 'width'
              ? Math.floor(updateValue * ratio)
              : Math.floor(updateValue / ratio);

          updated.push({
            path: path.slice(0, path.length - 1).concat(anotherUpdateKey),
            value: anotherUpdateValue,
          });
        }
      }

      onChange(updated);
    };
  };

  return (
    <Collapse header="基本属性" showArrow={false} collapsed={false}>
      <FormItem label="位置尺寸">
        <FormGroup>
          <Col span={11}>
            <InputNumber
              value={left}
              suffix="X"
              onChange={handleChange(path.concat(['chartPosition', 'left']))}
            />
          </Col>
          <Col span={11} offset={2}>
            <InputNumber
              value={top}
              suffix="Y"
              onChange={handleChange(path.concat(['chartPosition', 'top']))}
            />
          </Col>
          <Col span={11}>
            <InputNumber
              min={1}
              value={width}
              suffix="W"
              onChange={handleChange(path.concat(['chartDimension', 'width']))}
            />
          </Col>
          <Col
            span={2}
            style={{
              paddingLeft: 0,
              paddingRight: 0,
              cursor: 'pointer',
              marginLeft: -1,
            }}
          >
            <Icon
              type={lock ? 'lock_on' : 'lock_off'}
              style={{ fontSize: 20 }}
              onClick={() =>
                onChange({
                  path: path.concat('chartDimension'),
                  value: !lock,
                  field: 'lock',
                })
              }
            />
          </Col>
          <Col span={11}>
            <InputNumber
              min={1}
              value={height}
              suffix="H"
              onChange={handleChange(path.concat(['chartDimension', 'height']))}
            />
          </Col>
        </FormGroup>
      </FormItem>

      {hideDefault != null && (
        <FormItem label="默认隐藏" style={{ marginBottom: -8 }}>
          <EasyBoolean value={hideDefault} onChange={onHideDefaultChange} />
        </FormItem>
      )}
    </Collapse>
  );
}
