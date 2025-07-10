import { Form, Input, Button, Card, Row, Col, Select, Checkbox } from 'antd';
import { useEffect, useMemo } from 'react';
import useRoleStore from '@/stores/role';
import { usePostRoleMutation, usePutRoleMutation } from '@/hooks/react-query/useRole/useRoleMutation';
import rules from '@/utils/rules';
import { usePermissionQuery } from '@/hooks/react-query/usePermission/usePermissionQuery';

interface FormValues {
  name: string;
  description: string;
  isActive: boolean;
  permissionModuleIds: string[];
}

const FormRole = () => {
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
  } = useRoleStore();

  // Lấy danh sách permission
  const { data: permissionsData, isLoading: isLoadingPermissions } = usePermissionQuery({ page: 1, limit: 1000 });
  const permissionOptions = useMemo(() =>
    (permissionsData || []).map((p: any) => ({ label: p.name, value: p._id })),
    [permissionsData]
  );

  const mutationCallbacks = useMemo(() => ({
    onSuccess: () => {
      setVisibleForm(false);
      form.resetFields();
    },
    onError: () => {},
    params: { page, limit, cond },
  }), [page, limit, cond, form, setVisibleForm]);

  const { mutate: postRole, isPending: isCreating } = usePostRoleMutation({ ...mutationCallbacks });
  const { mutate: putRole, isPending: isUpdating } = usePutRoleMutation({
    ...mutationCallbacks,
    onSuccess: () => {
      mutationCallbacks.onSuccess();
      setEdit(false);
      setView(false);
    },
  });

  useEffect(() => {
    if (record?.id && (edit || view)) {
      const formValues: FormValues = {
        name: record.name || '',
        description: record.description || '',
        isActive: record.isActive ?? true,
        permissionModuleIds: record.permissionModuleIds || [],
      };
      form.setFieldsValue(formValues);
    } else {
      form.resetFields();
    }
  }, [record, edit, view, form]);

  const handleSubmit = (values: FormValues) => {
    if (edit && record?.id) {
      putRole({ id: record.id, body: values });
    } else {
      postRole(values);
    }
  };

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
              label="Tên vai trò" 
              name="name" 
              rules={rules.required}
            > 
              <Input placeholder="Nhập tên vai trò" /> 
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item 
              label="Kích hoạt" 
              name="isActive" 
              valuePropName="checked"
            >
              <Checkbox>Đang kích hoạt</Checkbox>
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item 
              label="Mô tả" 
              name="description"
            > 
              <Input.TextArea placeholder="Nhập mô tả vai trò" rows={2} /> 
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item 
              label="Quyền hạn" 
              name="permissionModuleIds"
              rules={rules.required}
            > 
              <Select
                mode="multiple"
                placeholder="Chọn quyền hạn cho vai trò"
                options={permissionOptions}
                loading={isLoadingPermissions}
                allowClear
                showSearch
                optionFilterProp="label"
              /> 
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

export default FormRole; 