import { message } from 'antd';
import { useEffect, useMemo, useCallback } from 'react';
import TableBase from '@/components/common/Table';
import type { IColumn } from '@/utils/interfaces';
import { usePermissionQuery, usePermissionByIdQuery } from '@/hooks/react-query/usePermission/usePermissionQuery';
import usePermissionStore from '@/stores/permission';
import { useDeletePermissionMutation } from '@/hooks/react-query/usePermission/usePermissionMutation';
import { Permission } from '@/services/permission';
import { METHOD_OPTIONS, MODULE_OPTIONS } from '@/utils/constants';

// Import components
import TableHeader from './components/TableHeader';
import ActionButtons from './components/ActionButtons';
import MethodTag from './components/MethodTag';

// Import hooks
import { usePermissionFilters } from './hooks/usePermissionFilters';
import { usePermissionActions } from './hooks/usePermissionActions';
import { FilterField } from '@/components/common/Filter/filter';
import FormPermission from './components/FormPermission';
import Access from '@/components/share/access';
import { ALL_PERMISSIONS } from '@/config/permissions';

// Import types

const COLUMN_WIDTHS = {
  index: 80,
  name: 200,
  module: 120,
  method: 100,
  apiPath: 200,
  actions: 160,
} as const;

const PermissionManagement = () => {
  const { page, limit, cond, setCondition, setRecord, setView, setEdit, setVisibleForm, edit, view } = usePermissionStore();
  
  // Custom hooks
  const {
    textSearch,
    setTextSearch,
    filterForm,
    filterKey,
    handleFilter,
    handleClearFilter,
  } = usePermissionFilters({ cond, setCondition, page, limit });

  const {
    selectedPermissionId,
    handleView,
    handleEdit,
    handleAdd,
    resetFormStates,
  } = usePermissionActions({ setRecord, setView, setEdit, setVisibleForm });

  // Queries
  const { data, isLoading } = usePermissionQuery({ page, limit, cond });
  const { data: permissionDetail } = usePermissionByIdQuery(selectedPermissionId);

  // Mutations
  const { mutate: deletePermission } = useDeletePermissionMutation({
    onSuccess: () => message.success('Xóa thành công!'),
    onError: () => message.error('Có lỗi xảy ra khi xóa!'),
    params: { page, limit, cond },
  });

  // Update record when permission detail is loaded
  useEffect(() => {
    if (permissionDetail && selectedPermissionId) {
      setRecord({ ...permissionDetail });
    }
  }, [permissionDetail, selectedPermissionId, setRecord]);

  // Memoized delete handler
  const handleDelete = useCallback((id: string) => {
    deletePermission(id);
  }, [deletePermission]);

  // Filter fields configuration
  const filterFields: FilterField[] = useMemo(() => [
    {
      name: 'method',
      label: 'Method',
      placeholder: 'Chọn method',
      options: METHOD_OPTIONS,
      type: 'select'
    },
    {
      name: 'module',
      label: 'Module',
      placeholder: 'Chọn module',
      options: MODULE_OPTIONS,
      type: 'select'
    }
  ], []);

  // Memoized columns
  const columns: IColumn<Permission.Record[]>[] = useMemo(() => [
    {
      title: 'STT',
      dataIndex: 'index',
      align: 'center',
      width: COLUMN_WIDTHS.index,
      render: (_: any, __: any, idx: number) => idx + 1,
    },
    {
      title: 'Tên',
      dataIndex: 'name',
      align: 'center',
      width: COLUMN_WIDTHS.name,
    },
    {
      title: 'Module',
      dataIndex: 'module',
      align: 'center',
      width: COLUMN_WIDTHS.module,
    },
    {
      title: 'Method',
      dataIndex: 'method',
      align: 'center',
      width: COLUMN_WIDTHS.method,
      render: (method: string) => <MethodTag method={method} />,
    },
    {
      title: 'API Path',
      dataIndex: 'apiPath',
      align: 'center',
      width: COLUMN_WIDTHS.apiPath,
    },
    {
      title: 'Thao tác',
      align: 'center',
      width: COLUMN_WIDTHS.actions,
      render: (record: Permission.Record) => (
        <ActionButtons
          record={record}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      ),
    },
  ], [handleView, handleEdit, handleDelete]);

  // Memoized title
  const titleForm = useMemo(() => {
    if (edit) return "Chỉnh sửa quyền hạn";
    if (view) return "Xem chi tiết quyền hạn";
    return "Thêm quyền hạn";
  }, [edit, view]);

  return (
    <Access permission={ALL_PERMISSIONS.PERMISSIONS.GET_PAGINATE} hideChildren={true}>
      <TableBase
        border
        columns={columns}
        dependencies={[page, limit, cond]}
        storeName="permission"
        loading={isLoading}
        Form={FormPermission}
        formType="Drawer"
        widthDrawer="60%"
        dataSource={data || []}
        onCloseForm={resetFormStates}
        titleForm={titleForm}
        rowKey="_id"
      >
        <TableHeader
          title="Quản lý quyền hạn"
          textSearch={textSearch}
          onSearchChange={setTextSearch}
          filterForm={filterForm}
          onFilter={handleFilter}
          onClearFilter={handleClearFilter}
          filterKey={filterKey}
          filterFields={filterFields}
          onAdd={handleAdd}
        />
      </TableBase>
    </Access>
  );
};

export default PermissionManagement;