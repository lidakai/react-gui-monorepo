import { Row, Col } from '@easyv/antd';

export default function FormGroup({ style, children }) {
  return (
    <Row gutter={[12, 12]} style={style ? style : { marginBottom: -6 }}>
      {children}
    </Row>
  );
}

FormGroup.Col = Col;
