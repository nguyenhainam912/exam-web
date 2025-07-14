import { Form, Input, Button, Card, Row, Col, Select, Checkbox, Collapse, Spin, Tooltip, Switch } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import useRoleStore from '@/stores/role';
import { usePostRoleMutation, usePutRoleMutation } from '@/hooks/react-query/useRole/useRoleMutation';
import rules from '@/utils/rules';
import { usePermissionQuery } from '@/hooks/react-query/usePermission/usePermissionQuery';

interface FormValues {
  name: string;
  description: string;
  isActive: boolean;
  permissions: string[];
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

  // Group permissions by module
  const groupedPermissions = useMemo(() => {
    const groups: Record<string, any[]> = {};
    (permissionsData || []).forEach((p: any) => {
      const module = p.module || 'Khác';
      if (!groups[module]) groups[module] = [];
      groups[module].push(p);
    });
    return groups;
  }, [permissionsData]);

  // State để quản lý quyền đã chọn
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  // Đồng bộ với form khi record thay đổi
  useEffect(() => {
    if (record?.permissions) {
      setSelectedPermissions(record.permissions.map((p: any) => typeof p === 'string' ? p : p._id));
    } else {
      setSelectedPermissions([]);
    }
  }, [record]);

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
    if (record?._id && (edit || view)) {
      const formValues: FormValues = {
        name: record.name || '',
        description: record.description || '',
        isActive: record.isActive ?? true,
        permissions: record.permissions || [],
      };
      form.setFieldsValue(formValues);
    } else {
      form.resetFields();
    }
  }, [record, edit, view, form]);

  // Khi form submit, cập nhật lại selectedPermissions vào form
  const handleSubmit = (values: FormValues) => {
    values.permissions = selectedPermissions;
    if (edit && record?._id) {
      putRole({ id: record._id, body: values });
    } else {
      postRole(values);
    }
  };

  // Xử lý bật/tắt từng quyền
  const handleSwitch = (permId: string, checked: boolean) => {
    setSelectedPermissions((prev) => {
      if (checked) return [...prev, permId];
      return prev.filter((id) => id !== permId);
    });
  };

  // Xử lý bật/tắt tất cả quyền trong 1 nhóm
  const handleSwitchAll = (module: string, checked: boolean) => {
    const perms = groupedPermissions[module] || [];
    const permIds = perms.map((p: any) => p._id);
    setSelectedPermissions((prev) => {
      if (checked) {
        // Thêm các quyền chưa có
        return Array.from(new Set([...prev, ...permIds]));
      } else {
        // Bỏ các quyền thuộc nhóm này
        return prev.filter((id) => !permIds.includes(id));
      }
    });
  };

  // Kiểm tra trạng thái Switch tổng
  const isAllChecked = (module: string) => {
    const perms = groupedPermissions[module] || [];
    if (perms.length === 0) return false;
    return perms.every((p: any) => selectedPermissions.includes(p._id));
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
              <Switch checkedChildren="Bật" unCheckedChildren="Tắt" />
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
              name="permissions"
            >
              {isLoadingPermissions ? (
                <Spin />
              ) : (
                <Collapse>
                  {Object.entries(groupedPermissions).map(([module, perms]) => (
                    <Collapse.Panel
                      header={
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <Switch
                            checked={isAllChecked(module)}
                            onChange={(checked) => handleSwitchAll(module, checked)}
                            style={{ marginRight: 8 }}
                          />
                          <span style={{ fontWeight: 600 }}>{module}</span>
                        </div>
                      }
                      key={module}
                    >
                      <Row gutter={[16, 16]}>
                        {perms.map((perm: any) => {
                          return (
                            <Col span={12} key={perm._id}>
                              <Tooltip title={perm.name} placement="top">
                                <div
                                  style={{
                                    border: '1px solid #eee',
                                    borderRadius: 8,
                                    padding: 12,
                                    display: 'flex',
                                    alignItems: 'center',
                                    marginBottom: 0,
                                    background: '#fafbfc',
                                  }}
                                >
                                  <Switch
                                    checked={selectedPermissions.includes(perm._id)}
                                    onChange={(checked) => handleSwitch(perm._id, checked)}
                                    style={{ marginRight: 12 }}
                                  />
                                  <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: 500 }}>{perm.name}</div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                                      <span style={{
                                        fontWeight: 700,
                                        color:
                                          perm.method === 'GET'
                                            ? '#1890ff'
                                            : perm.method === 'POST'
                                            ? 'green'
                                            : perm.method === 'DELETE'
                                            ? 'red'
                                            : perm.method === 'PATCH'
                                            ? '#faad14'
                                            : '#555',
                                        marginRight: 8,
                                        minWidth: 40,
                                        display: 'inline-block',
                                        textAlign: 'center',
                                      }}>
                                        {perm.method}
                                      </span>
                                      <span style={{ color: '#888', fontSize: 13 }}>{perm.apiPath}</span>
                                    </div>
                                  </div>
                                </div>
                              </Tooltip>
                            </Col>
                          );
                        })}
                      </Row>
                    </Collapse.Panel>
                  ))}
                </Collapse>
              )}
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