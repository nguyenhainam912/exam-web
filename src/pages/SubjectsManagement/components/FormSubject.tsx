import { Form, Input, Button, Card, Row, Col } from 'antd';
import { useEffect, useMemo, useCallback } from 'react';
import useSubjectStore from '@/stores/subject';
import { usePostSubjectMutation, usePutSubjectMutation } from '@/hooks/react-query/useSubject/useSubjectMutation';
import rules from '@/utils/rules';

interface FormValues {
  name: string;
  code: string;
  description?: string;
}

const FormSubject = () => {
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
  } = useSubjectStore();

  const mutationCallbacks = useMemo(() => ({
    onSuccess: () => {
      setVisibleForm(false);
      form.resetFields();
    },
    onError: () => {},
    params: { page, limit, cond },
  }), [page, limit, cond, form, setVisibleForm]);

  const { mutate: postSubject, isPending: isCreating } = usePostSubjectMutation({ ...mutationCallbacks });
  const { mutate: putSubject, isPending: isUpdating } = usePutSubjectMutation({
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
      putSubject({ id: record._id, body: values });
    } else {
      postSubject(values);
    }
  }, [edit, record?._id, putSubject, postSubject]);

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
              label="Tên môn học" 
              name="name" 
              rules={rules.required}
            > 
              <Input placeholder="Nhập tên môn học" /> 
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item 
              label="Mã môn học" 
              name="code" 
              rules={rules.required}
            > 
              <Input placeholder="Nhập mã môn học" /> 
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

export default FormSubject; 