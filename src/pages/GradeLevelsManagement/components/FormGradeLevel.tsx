import { Form, Input, Button, Card, Row, Col } from 'antd';
import { useEffect, useMemo, useCallback } from 'react';
import useGradeLevelStore from '@/stores/gradeLevel';
import { usePostGradeLevelMutation, usePutGradeLevelMutation } from '@/hooks/react-query/useGradeLevel/useGradeLevelMutation';
import rules from '@/utils/rules';

interface FormValues {
  name: string;
  code: string;
  description?: string;
}

const FormGradeLevel = () => {
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
  } = useGradeLevelStore();

  const mutationCallbacks = useMemo(() => ({
    onSuccess: () => {
      setVisibleForm(false);
      form.resetFields();
    },
    onError: () => {},
    params: { page, limit, cond },
  }), [page, limit, cond, form, setVisibleForm]);

  const { mutate: postGradeLevel, isPending: isCreating } = usePostGradeLevelMutation({ ...mutationCallbacks });
  const { mutate: putGradeLevel, isPending: isUpdating } = usePutGradeLevelMutation({
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
        name: record.name || '',
        code: record.code || '',
        description: record.description || '',
      };
      form.setFieldsValue(formValues);
    } else {
      form.resetFields();
    }
  }, [record, edit, view, form]);

  const handleSubmit = useCallback((values: FormValues) => {
    if (edit && record?._id) {
      putGradeLevel({ id: record._id, body: values });
    } else {
      postGradeLevel(values);
    }
  }, [edit, record?._id, putGradeLevel, postGradeLevel]);

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
              label="Tên khối lớp" 
              name="name" 
              rules={rules.required}
            > 
              <Input placeholder="Nhập tên khối lớp" /> 
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item 
              label="Mã khối lớp" 
              name="code" 
              rules={rules.required}
            > 
              <Input placeholder="Nhập mã khối lớp" /> 
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

export default FormGradeLevel; 