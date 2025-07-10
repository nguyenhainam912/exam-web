import { Form, Input, Button, Card, Row, Col, Select } from 'antd';
import { useEffect, useState, useMemo, useCallback } from 'react';
import usePermissionStore from '@/stores/permission';
import { usePostPermissionMutation, usePutPermissionMutation } from '@/hooks/react-query/usePermission/usePermissionMutation';
import rules from '@/utils/rules';
import { METHOD_OPTIONS, MODULE_OPTIONS, API_PATH_OPTIONS } from '@/utils/constants';
import { ALL_PERMISSIONS } from '@/config/permissions';

// Types
interface FormValues {
  name: string;
  module: string;
  method: string;
  apiPath: string;
}

const FormPermission = () => {
  const [form] = Form.useForm<FormValues>();
  const [selectedModule, setSelectedModule] = useState<string>('');
  
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
  } = usePermissionStore();

  // Memoize filtered API paths để tránh tính toán lại không cần thiết
  const filteredApiPaths = useMemo(() => {
    if (!selectedModule) return API_PATH_OPTIONS;

    const filteredPaths = new Set<string>();
    Object.values(ALL_PERMISSIONS).forEach(category => {
      Object.values(category).forEach(permission => {
        if (permission.module === selectedModule && permission.apiPath) {
          filteredPaths.add(permission.apiPath);
        }
      });
    });

    return Array.from(filteredPaths).map(apiPath => ({
      label: apiPath,
      value: apiPath
    }));
  }, [selectedModule]);

  // Callback để xử lý thay đổi module
  const handleModuleChange = useCallback((value: string) => {
    setSelectedModule(value || '');
    // Reset API path khi module thay đổi
    form.setFieldValue('apiPath', undefined);
  }, [form]);

  // Mutation hooks với callbacks được memoize
  const mutationCallbacks = useMemo(() => ({
    onSuccess: () => {
      setVisibleForm(false);
      form.resetFields();
      setSelectedModule('');
    },
    onError: () => {
      // TODO: Xử lý lỗi cụ thể
    },
    params: { page, limit, cond },
  }), [page, limit, cond, form, setVisibleForm]);

  const { mutate: postPermission, isPending: isCreating } = usePostPermissionMutation({
    ...mutationCallbacks,
  });

  const { mutate: putPermission, isPending: isUpdating } = usePutPermissionMutation({
    ...mutationCallbacks,
    onSuccess: () => {
      mutationCallbacks.onSuccess();
      setEdit(false);
      setView(false);
    },
  });

  // Xử lý form values khi record thay đổi
  useEffect(() => {
    if (record?._id && (edit || view)) {
      const formValues: FormValues = {
        name: record.name || '',
        module: record.module || '',
        method: record.method || '',
        apiPath: record.apiPath || '',
      };
      
      form.setFieldsValue(formValues);
      setSelectedModule(record.module || '');
    } else {
      form.resetFields();
      setSelectedModule('');
    }
  }, [record, edit, view, form]);

  // Submit handler
  const handleSubmit = useCallback((values: FormValues) => {
    if (edit && record?._id) {
      putPermission({ id: record._id, body: values });
    } else {
      postPermission(values);
    }
  }, [edit, record?._id, putPermission, postPermission]);

  // Tính toán các giá trị derived
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
              label="Tên permission" 
              name="name" 
              rules={rules.required}
            > 
              <Input placeholder="Nhập tên permission" /> 
            </Form.Item>
          </Col>
          
          <Col span={12}>
            <Form.Item 
              label="Method" 
              name="method"
            > 
              <Select
                placeholder="Chọn method"
                options={METHOD_OPTIONS}
                allowClear
              /> 
            </Form.Item>
          </Col>
          
          <Col span={12}>
            <Form.Item 
              label="Module" 
              name="module"
            > 
              <Select
                placeholder="Chọn module"
                options={MODULE_OPTIONS}
                allowClear
                onChange={handleModuleChange}
              /> 
            </Form.Item>
          </Col>
          
          <Col span={12}>
            <Form.Item 
              label="API Path" 
              name="apiPath"
            > 
              <Select
                placeholder="Chọn API path"
                options={filteredApiPaths}
                allowClear
                disabled={view || !selectedModule}
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

export default FormPermission;