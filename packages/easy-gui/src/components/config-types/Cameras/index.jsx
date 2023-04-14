import { Button } from '@easyv/antd';
import { EasyNumber, EasyCamera } from 'config-types';
import { generateId } from 'easy-utils';
import styles from './index.less';

export default function EasyCameras(props) {
  const { value = [], template, min = 0, onChange } = props;

  const handleAdd = () => {
    onChange(
      value.concat({
        ...template,
        id: generateId(),
      }),
    );
  };

  const handleChange = (cameraId, cameraValue) => {
    if (cameraValue) {
      onChange(
        value.map(d => (d.id === cameraId ? { ...d, ...cameraValue } : d)),
      );
    } else {
      onChange(value.filter(d => d.id !== cameraId));
    }
  };

  const handleTimeChange = (cameraId, time) => {
    onChange(value.map(d => (d.id === cameraId ? { ...d, time } : d)));
  };

  const enableDelete = value.length > min;

  return (
    <div className={styles.cameras}>
      {value.map((d, i) => (
        <EasyCamera
          key={d.id}
          id={d.id}
          name={`镜头${i + 1}`}
          value={d}
          template={template}
          enableDelete={enableDelete}
          onChange={value => handleChange(d.id, value)}
        />
      ))}
      <Button
        type="primary"
        onClick={handleAdd}
        ghost
        block
        style={{ height: 28, marginBottom: 12 }}
      >
        + 添加镜头
      </Button>

      {value.map((d, i) => (
        <div key={d.id} className={styles.time}>
          <span style={{ flex: 1, textAlign: 'right' }}>
            {i === value.length - 1
              ? `镜头${i + 1} - 镜头${1}`
              : `镜头${i + 1} - 镜头${i + 2}`}
            时间：
          </span>
          <div style={{ width: 80 }}>
            <EasyNumber
              value={d.time}
              min={0}
              onChange={value => handleTimeChange(d.id, value)}
              placeholder="动画时间"
              suffix="s"
            />
          </div>
        </div>
      ))}
    </div>
  );
}
