import { Card, Row, Col, Descriptions, Typography, Button } from 'antd';
import { useEffect, useState } from 'react';
import { getExamChangeRequestDetail } from '@/services/exam/exam';
import useExamChangeRequestStore from '@/stores/examChangeRequest';

const { Text } = Typography;

const FormChangeRequest = () => {
  const { record, view, edit, setVisibleForm } = useExamChangeRequestStore();
  const [detail, setDetail] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (record?._id) {
      setLoading(true);
      getExamChangeRequestDetail(record._id)
        .then(res => setDetail(res?.data))
        .finally(() => setLoading(false));
    } else {
      setDetail(null);
    }
  }, [record]);

  const handleClose = () => setVisibleForm(false);

  return (
    <Card
      title="So sánh thay đổi đề thi"
      loading={loading}
      extra={<Button onClick={handleClose}>Đóng</Button>}
      style={{ maxWidth: 950, margin: '0 auto' }}
    >
      {detail ? (
        <Row gutter={24}>
          <Col span={12}>
            <Descriptions title="Dữ liệu cũ" bordered column={1} size="small">
              {Object.entries(detail.previousExamSnapshot || {}).map(([key, value]) => (
                <Descriptions.Item label={key} key={key}>
                  <Text>
                    {typeof value === 'object' && value !== null ? JSON.stringify(value) : String(value)}
                  </Text>
                </Descriptions.Item>
              ))}
            </Descriptions>
          </Col>
          <Col span={12}>
            <Descriptions title="Dữ liệu mới đề xuất" bordered column={1} size="small">
              {Object.entries(detail.proposedChange || {}).map(([key, value]) => {
                const oldValue = detail.previousExamSnapshot?.[key];
                const isDiff = JSON.stringify(value) !== JSON.stringify(oldValue);
                return (
                  <Descriptions.Item label={key} key={key}>
                    <Text type={isDiff ? 'danger' : undefined}>
                      {typeof value === 'object' && value !== null ? JSON.stringify(value) : String(value)}
                    </Text>
                  </Descriptions.Item>
                );
              })}
            </Descriptions>
          </Col>
        </Row>
      ) : (
        <Text type="secondary">Không có dữ liệu</Text>
      )}
    </Card>
  );
};

export default FormChangeRequest; 