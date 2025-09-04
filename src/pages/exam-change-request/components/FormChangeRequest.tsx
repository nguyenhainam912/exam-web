import { Card, Row, Col, Descriptions, Typography, Button, Table, Tag, Tooltip } from 'antd';
import { useEffect, useState } from 'react';
import { getExamChangeRequestDetail } from '@/services/exam/exam';
import useExamChangeRequestStore from '@/stores/examChangeRequest';
import { getSubjectById } from '@/services/subject/subject';
import { getGradeLevelById } from '@/services/gradeLevel/gradeLevel';
import { getExamTypeById } from '@/services/examType/examType';

const { Text } = Typography;

const FIELD_LABELS: Record<string, string> = {
  title: 'Tiêu đề',
  description: 'Mô tả',
  subjectId: 'Môn học',
  gradeLevelId: 'Khối lớp',
  examTypeId: 'Loại đề',
  duration: 'Thời lượng (phút)',
};

// Thêm enum trạng thái
export enum ExamChangeRequestStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

const STATUS_TAG: Record<string, { color: string; label: string }> = {
  [ExamChangeRequestStatus.PENDING]: { color: 'default', label: 'Chờ duyệt' },
  [ExamChangeRequestStatus.APPROVED]: { color: 'success', label: 'Đã duyệt' },
  [ExamChangeRequestStatus.REJECTED]: { color: 'error', label: 'Từ chối' },
};

const renderValue = (value: any, mapping?: Record<string, string>, key?: string) => {
  if (!value) return '-';
  if (key === 'status') {
    const tag = STATUS_TAG[value] || { color: 'default', label: value };
    return <Tag color={tag.color}>{tag.label}</Tag>;
  }
  if (mapping && typeof value === 'string' && mapping[value]) return mapping[value];
  if (typeof value === 'object') {
    if (value.name) return value.name;
    if (value._id) return value._id;
    return JSON.stringify(value);
  }
  return String(value);
};

const compareQuestions = (oldQuestions: any[], newQuestions: any[]) => {
  return (
    <Table
      size="small"
      bordered
      pagination={false}
      scroll={{ x: true }}
      dataSource={newQuestions.map((q, idx) => ({ ...q, key: q._id || idx }))}
      columns={[
        {
          title: 'STT',
          dataIndex: 'index',
          render: (_: any, __: any, idx: number) => idx + 1,
          width: 50,
        },
        {
          title: 'Nội dung',
          dataIndex: 'content',
          ellipsis: { showTitle: false },
          width: 180,
          render: (text: string) =>
            text && text.length > 30 ? (
              <Tooltip placement="topLeft" title={text}>
                <span style={{ wordBreak: 'break-word', maxWidth: 180, display: 'inline-block' }}>{text}</span>
              </Tooltip>
            ) : (
              <span style={{ wordBreak: 'break-word', maxWidth: 180, display: 'inline-block' }}>{text}</span>
            ),
        },
        {
          title: 'Đáp án',
          dataIndex: 'options',
          ellipsis: { showTitle: false },
          width: 120,
          render: (opts: string[], row: any) => {
            if (!opts || !Array.isArray(opts)) return null;
            return opts.map((opt, idx) => {
              const isCorrect = Array.isArray(row.correctAnswers) && row.correctAnswers.includes(idx);
              return (
                <span
                  key={idx}
                  style={{
                    fontWeight: isCorrect ? 'bold' : undefined,
                    color: isCorrect ? '#52c41a' : undefined,
                    background: isCorrect ? 'rgba(82,196,26,0.08)' : undefined,
                    padding: '0 4px',
                    borderRadius: 3,
                    marginRight: 4,
                  }}
                >
                  {opt}
                </span>
              );
            });
          },
        },
        {
          title: 'Độ khó',
          dataIndex: 'difficulty',
          width: 60,
        },
        {
          title: 'Giải thích',
          dataIndex: 'explanation',
          ellipsis: { showTitle: false },
          width: 120,
          render: (text: string) =>
            text && text.length > 20 ? (
              <Tooltip placement="topLeft" title={text}>
                <span style={{ wordBreak: 'break-word', maxWidth: 120, display: 'inline-block' }}>{text}</span>
              </Tooltip>
            ) : (
              <span style={{ wordBreak: 'break-word', maxWidth: 120, display: 'inline-block' }}>{text}</span>
            ),
        },
      ]}
      summary={() => (
        <Table.Summary.Row>
          <Table.Summary.Cell index={0} colSpan={5}>
            <Text type={oldQuestions.length !== newQuestions.length ? 'danger' : undefined}>
              Số lượng câu hỏi: {oldQuestions.length} → {newQuestions.length}
            </Text>
          </Table.Summary.Cell>
        </Table.Summary.Row>
      )}
    />
  );
};

const FormChangeRequest = () => {
  const { record, view, edit, setVisibleForm } = useExamChangeRequestStore();
  const [detail, setDetail] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [subjectMap, setSubjectMap] = useState<Record<string, string>>({});
  const [gradeLevelMap, setGradeLevelMap] = useState<Record<string, string>>({});
  const [examTypeMap, setExamTypeMap] = useState<Record<string, string>>({});

  useEffect(() => {
    if (record?._id) {
      setLoading(true);
      getExamChangeRequestDetail(record._id)
        .then(async res => {
          setDetail(res?.data?.data);
          // Lấy các id cần thiết
          const prev = res?.data?.data?.previousExamSnapshot || {};
          const next = res?.data?.data?.proposedChange || {};
          const subjectIds = [prev.subjectId, next.subjectId].filter(Boolean);
          const gradeLevelIds = [prev.gradeLevelId, next.gradeLevelId].filter(Boolean);
          const examTypeIds = [prev.examTypeId, next.examTypeId].filter(Boolean);
          // Lấy tên môn học
          const subjectMap: Record<string, string> = {};
          for (const id of subjectIds) {
            if (typeof id === 'string') {
              const res = await getSubjectById(id);
              if (res?.data) subjectMap[id] = res.data.name;
            }
          }
          setSubjectMap(subjectMap);
          // Lấy tên khối lớp
          const gradeLevelMap: Record<string, string> = {};
          for (const id of gradeLevelIds) {
            if (typeof id === 'string') {
              const res = await getGradeLevelById(id);
              if (res?.data) gradeLevelMap[id] = res.data.name;
            }
          }
          setGradeLevelMap(gradeLevelMap);
          // Lấy tên loại đề
          const examTypeMap: Record<string, string> = {};
          for (const id of examTypeIds) {
            if (typeof id === 'string') {
              const res = await getExamTypeById(id);
              if (res?.data) examTypeMap[id] = res.data.name;
            }
          }
          setExamTypeMap(examTypeMap);
        })
        .finally(() => setLoading(false));
    } else {
      setDetail(null);
    }
  }, [record]);

  const handleClose = () => setVisibleForm(false);

  if (!detail) {
    return (
      <Card title="So sánh thay đổi đề thi" loading={loading} style={{ maxWidth: 950, margin: '0 auto' }}>
        <Text type="secondary">Không có dữ liệu</Text>
      </Card>
    );
  }

  const prev = detail.previousExamSnapshot || {};
  const next = detail.proposedChange || {};
  const fields = ['title', 'description', 'subjectId', 'gradeLevelId', 'examTypeId', 'duration'];

  return (
    <Card title="So sánh thay đổi đề thi" loading={loading} style={{ maxWidth: '100%', margin: '0 auto' }}>
      <Row gutter={24}>
        <Col span={12}>
          <Descriptions title="Dữ liệu cũ" bordered column={1} size="small">
            {fields.map((key) => (
              <Descriptions.Item label={FIELD_LABELS[key] || key} key={key}>
                {renderValue(prev[key], key === 'subjectId' ? subjectMap : key === 'gradeLevelId' ? gradeLevelMap : key === 'examTypeId' ? examTypeMap : undefined, key)}
              </Descriptions.Item>
            ))}
          </Descriptions>
        </Col>
        <Col span={12}>
          <Descriptions title="Dữ liệu mới đề xuất" bordered column={1} size="small">
            {fields.map((key) => {
              const oldValue = prev[key];
              const newValue = next[key];
              const oldCompare = typeof oldValue === 'object' && oldValue !== null && oldValue._id ? oldValue._id : oldValue;
              const isDiff = JSON.stringify(newValue) !== JSON.stringify(oldCompare);
              return (
                <Descriptions.Item label={FIELD_LABELS[key] || key} key={key}>
                  <Text type={isDiff && key !== 'status' ? 'danger' : undefined}>
                    {renderValue(newValue, key === 'subjectId' ? subjectMap : key === 'gradeLevelId' ? gradeLevelMap : key === 'examTypeId' ? examTypeMap : undefined, key)}
                  </Text>
                </Descriptions.Item>
              );
            })}
          </Descriptions>
        </Col>
      </Row>
      <Row gutter={24} style={{ marginTop: 24 }}>
        <Col span={12}>
          <Text strong>Câu hỏi cũ</Text>
          {compareQuestions(prev.questions || [], prev.questions || [])}
        </Col>
        <Col span={12}>
          <Text strong>Câu hỏi mới</Text>
          {compareQuestions(prev.questions || [], next.questions || [])}
        </Col>
      </Row>
    </Card>
  );
};

export default FormChangeRequest; 