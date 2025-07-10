import { Form, Input, Button, Card, Row, Col, Select, InputNumber } from 'antd';
import { useEffect, useMemo, useCallback } from 'react';
import useExamStore from '@/stores/exam';
import { usePostExamMutation, usePutExamMutation } from '@/hooks/react-query/useExam/useExamMutation';
import rules from '@/utils/rules';

// TODO: Replace with real options from API or constants
const statusOptions = [
  { label: 'Nháp', value: 'DRAFT' },
  { label: 'Công khai', value: 'PUBLISHED' },
  { label: 'Ẩn', value: 'HIDDEN' },
];

const subjectOptions: any[] = [];
const gradeLevelOptions: any[] = [];
const examTypeOptions: any[] = [];

interface FormValues {
  title: string;
  description?: string;
  subjectId: string;
  gradeLevelId: string;
  examTypeId: string;
  duration: number;
  status: string;
}

const FormExam = () => {
  const [form] = Form.useForm<FormValues>();
  const {
    view,
    edit,
    record,
    setVisibleForm,
    setEdit,
    setView,
    page,
    limit,
    cond,
  } = useExamStore();

  const mutationCallbacks = useMemo(() => ({
    onSuccess: () => {
      setVisibleForm(false);
      form.resetFields();
    },
    onError: () => {},
    params: { page, limit, cond },
  }), [page, limit, cond, form, setVisibleForm]);

  const { mutate: postExam, isPending: isCreating } = usePostExamMutation({ ...mutationCallbacks });
  const { mutate: putExam, isPending: isUpdating } = usePutExamMutation({
    ...mutationCallbacks,
    onSuccess: () => {
      mutationCallbacks.onSuccess();
      setEdit(false);
      setView(false);
    },
  });

  useEffect(() => {
    if (record?._id && (edit || view)) {
      const formValues: FormValues = {
        title: record.title || '',
        description: record.description || '',
        subjectId: record.subjectId || '',
        gradeLevelId: record.gradeLevelId || '',
        examTypeId: record.examTypeId || '',
        duration: record.duration || 0,
        status: record.status || 'DRAFT',
      };
      form.setFieldsValue(formValues);
    } else {
      form.resetFields();
    }
  }, [record, edit, view, form]);

  const handleSubmit = useCallback((values: FormValues) => {
    if (edit && record?._id) {
      putExam({ id: record._id, body: values });
    } else {
      postExam(values);
    }
  }, [edit, record?._id, putExam, postExam]);

  const isLoading = isCreating || isUpdating;
  const isFormDisabled = view;
  const buttonText = edit ? 'Cập nhật' : 'Tạo mới';

  return (
    <Card>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        disabled={isFormDisabled}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item 
              label="Tiêu đề đề thi" 
              name="title" 
              rules={rules.required}
            > 
              <Input placeholder="Nhập tiêu đề đề thi" /> 
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item 
              label="Trạng thái" 
              name="status"
              rules={rules.required}
            > 
              <Select placeholder="Chọn trạng thái" options={statusOptions} /> 
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item 
              label="Môn học" 
              name="subjectId"
              rules={rules.required}
            > 
              <Select placeholder="Chọn môn học" options={subjectOptions} /> 
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item 
              label="Khối lớp" 
              name="gradeLevelId"
              rules={rules.required}
            > 
              <Select placeholder="Chọn khối lớp" options={gradeLevelOptions} /> 
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item 
              label="Loại đề" 
              name="examTypeId"
              rules={rules.required}
            > 
              <Select placeholder="Chọn loại đề" options={examTypeOptions} /> 
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item 
              label="Thời lượng (phút)" 
              name="duration"
              rules={rules.required}
            > 
              <InputNumber min={1} style={{ width: '100%' }} placeholder="Nhập thời lượng" /> 
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item 
              label="Mô tả" 
              name="description"
            > 
              <Input.TextArea placeholder="Nhập mô tả" rows={3} /> 
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label="Số lượng câu hỏi">
              <Input value={record?.questions?.length || 0} disabled />
            </Form.Item>
          </Col>
        </Row>
        {!view && (
          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={isLoading}
              size="large"
            >
              {buttonText}
            </Button>
          </Form.Item>
        )}
      </Form>
    </Card>
  );
};

export default FormExam; 