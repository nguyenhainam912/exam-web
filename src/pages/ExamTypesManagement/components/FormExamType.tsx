import { Form, Input, Button, Card, Row, Col } from 'antd';
import { useEffect, useMemo, useCallback } from 'react';
import useExamTypeStore from '@/stores/examType';
import { usePostExamTypeMutation, usePutExamTypeMutation } from '@/hooks/react-query/useExamType/useExamTypeMutation';
import rules from '@/utils/rules';

interface FormValues {
  name: string;
  code: string;
  description?: string;
}

const FormExamType = () => {
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
  } = useExamTypeStore();

  const mutationCallbacks = useMemo(() => ({
    onSuccess: () => {
      setVisibleForm(false);
      form.resetFields();
    },
    onError: () => {},
    params: { page, limit, cond },
  }), [page, limit, cond, form, setVisibleForm]);

  const { mutate: postExamType, isPending: isCreating } = usePostExamTypeMutation({ ...mutationCallbacks });
  const { mutate: putExamType, isPending: isUpdating } = usePutExamTypeMutation({
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
      putExamType({ id: record._id, body: values });
    } else {
      postExamType(values);
    }
  }, [edit, record?._id, putExamType, postExamType]);

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
              label="Tên loại đề" 
              name="name" 
              rules={rules.required}
            > 
              <Input placeholder="Nhập tên loại đề" /> 
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item 
              label="Mã loại đề" 
              name="code" 
              rules={rules.required}
            > 
              <Input placeholder="Nhập mã loại đề" /> 
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

export default FormExamType; 