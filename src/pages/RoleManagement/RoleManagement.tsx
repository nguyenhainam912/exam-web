import { message } from 'antd';
import { useEffect, useMemo, useCallback } from 'react';
import TableBase from '@/components/common/Table';
import type { IColumn } from '@/utils/interfaces';
import { useRoleQuery } from '@/hooks/react-query/useRole/useRoleQuery';
import useRoleStore from '@/stores/role';
import { useDeleteRoleMutation } from '@/hooks/react-query/useRole/useRoleMutation';
import { Role } from '@/services/role/index.d';
import Access from '@/components/share/access';
import { ALL_PERMISSIONS } from '@/config/permissions';
import { FilterField } from '@/components/common/Filter/filter';
import { useRoleActions } from './hooks/useRoleActions';
import { useRoleFilters } from './hooks/useRoleFilters';

import ActionButtons from './components/ActionButtons';
import TableHeader from './components/TableHeader';
import FormRole from './components/FormRole';

    
const COLUMN_WIDTHS = {
  index: 80,
  name: 200,
  description: 250,
  isActive: 100,
  permissions: 250,
  actions: 160,
} as const;

const RoleManagement = () => {
  const { page, limit, cond, setCondition, setRecord, setView, setEdit, setVisibleForm, edit, view } = useRoleStore();
  const {
    textSearch,
    setTextSearch,
    filterForm,
    filterKey,
    handleFilter,
    handleClearFilter,
  } = useRoleFilters({ cond, setCondition, page, limit });
  const {
    selectedRoleId,
    handleView,
    handleEdit,
    handleAdd,
    resetFormStates,
  } = useRoleActions({ setRecord, setView, setEdit, setVisibleForm });
  const { data, isLoading } = useRoleQuery({ page, limit, cond });
  const { mutate: deleteRole } = useDeleteRoleMutation({
    onSuccess: () => message.success('Xóa thành công!'),
    onError: () => message.error('Có lỗi xảy ra khi xóa!'),
    params: { page, limit, cond },
  });
  const handleDelete = useCallback((id: string) => {
    deleteRole(id);
  }, [deleteRole]);
  const filterFields: FilterField[] = useMemo(() => [
    {
      name: 'isActive',
      label: 'Trạng thái',
      placeholder: 'Chọn trạng thái',
      options: [
        { label: 'Kích hoạt', value: 'true' },
        { label: 'Không kích hoạt', value: 'false' },
      ],
      type: 'select',
    },
  ], []);
  const columns: IColumn<Role.Record[]>[] = useMemo(() => [
    {
      title: 'STT',
      dataIndex: 'index',
      align: 'center',
      width: COLUMN_WIDTHS.index,
      render: (_: any, __: any, idx: number) => idx + 1,
    },
    {
      title: 'Tên vai trò',
      dataIndex: 'name',
      align: 'center',
      width: COLUMN_WIDTHS.name,
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      align: 'center',
      width: COLUMN_WIDTHS.description,
    },
    {
      title: 'Kích hoạt',
      dataIndex: 'isActive',
      align: 'center',
      width: COLUMN_WIDTHS.isActive,
      render: (isActive: boolean) => isActive ? 'Có' : 'Không',
    },
    {
      title: 'Quyền hạn',
      dataIndex: 'permissionModuleIds',
      align: 'center',
      width: COLUMN_WIDTHS.permissions,
      render: (permissions: string[]) => permissions?.length || 0,
    },
    {
      title: 'Thao tác',
      align: 'center',
      width: COLUMN_WIDTHS.actions,
      render: (record: Role.Record) => (
        <ActionButtons
          record={record}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      ),
    },
  ], [handleView, handleEdit, handleDelete]);
  const titleForm = useMemo(() => {
    if (edit) return "Chỉnh sửa vai trò";
    if (view) return "Xem chi tiết vai trò";
    return "Thêm vai trò";
  }, [edit, view]);
  return (
    <Access permission={ALL_PERMISSIONS.ROLES.GET_PAGINATE} hideChildren={true}>
      <TableBase
        border
        columns={columns}
        dependencies={[page, limit, cond]}
        storeName="role"
        loading={isLoading}
        Form={FormRole}
        formType="Drawer"
        widthDrawer="60%"
        dataSource={data || []}
        onCloseForm={resetFormStates}
        titleForm={titleForm}
        rowKey="id"
      >
        <TableHeader
          title="Quản lý vai trò"
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

export default RoleManagement; 