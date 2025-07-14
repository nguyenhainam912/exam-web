import { message } from 'antd';
import { useEffect, useMemo, useCallback } from 'react';
import TableBase from '@/components/common/Table';
import { useUserQuery, useUserByIdQuery } from '@/hooks/react-query/useUser/useUserQuery';
import { useDeleteUserMutation } from '@/hooks/react-query/useUser/useUserMutation';
import useUserStore from '@/stores/user';
import { useUserActions } from './hooks/useUserActions';
import { useUserFilters } from './hooks/useUserFilters';
import ActionButtons from './components/ActionButtons';
import TableHeader from './components/TableHeader';
import FormUserProfile from './components/FormUserProfile';
import type { ColumnType } from 'antd/es/table';
import type { User } from '@/services/user/typing';

const COLUMN_WIDTHS = {
  index: 80,
  fullName: 200,
  email: 200,
  phoneNumber: 150,
  address: 250,
  actions: 160,
} as const;

const UserManagement = () => {
  const { page, limit, cond, setCondition, setRecord, setView, setEdit, setVisibleForm, edit, view } = useUserStore();
  const userFilters = useUserFilters({ cond, setCondition, page, limit });
  const userActions = useUserActions({ setRecord, setView, setEdit, setVisibleForm });
  const params = useMemo(() => ({ page, limit, cond }), [page, limit, cond]);
  const { data, isLoading } = useUserQuery(params);
  const { data: userDetail } = useUserByIdQuery(userActions.selectedUserId || '');

  const { mutate: deleteUser } = useDeleteUserMutation({
    onSuccess: () => message.success('Xóa thành công!'),
    onError: () => message.error('Có lỗi xảy ra khi xóa!'),
    params: { page, limit, cond },
  });
  const handleDelete = useCallback((id: string) => {
    deleteUser(id);
  }, [deleteUser]);
  const filterFields = useMemo(() => [
    {
      name: 'fullName',
      label: 'Họ tên',
      placeholder: 'Nhập họ tên',
      type: 'input',
    },
    {
      name: 'email',
      label: 'Email',
      placeholder: 'Nhập email',
      type: 'input',
    },
  ], []);
  const columns = useMemo(() => [
    {
      title: 'STT',
      dataIndex: 'index',
      align: 'center' as ColumnType<User.Profile>['align'],
      width: COLUMN_WIDTHS.index,
      render: (_: any, __: any, idx: number) => idx + 1,
    },
    {
      title: 'Họ tên',
      dataIndex: 'fullName',
      align: 'center' as ColumnType<User.Profile>['align'],
      width: COLUMN_WIDTHS.fullName,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      align: 'center' as ColumnType<User.Profile>['align'],
      width: COLUMN_WIDTHS.email,
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phoneNumber',
      align: 'center' as ColumnType<User.Profile>['align'],
      width: COLUMN_WIDTHS.phoneNumber,
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'address',
      align: 'center' as ColumnType<User.Profile>['align'],
      width: COLUMN_WIDTHS.address,
      render: (address: User.Profile['address']) =>
        address
          ? `${address.street || ''}, ${address.city || ''}, ${address.state || ''}, ${address.country || ''}, ${address.zipCode || ''}`
          : '',
    },
    {
      title: 'Thao tác',
      align: 'center' as ColumnType<User.Profile>['align'],
      width: COLUMN_WIDTHS.actions,
      render: (record: User.Profile) => (
        <ActionButtons
          record={record}
          onView={userActions.handleView}
          onEdit={userActions.handleEdit}
          onDelete={handleDelete}
        />
      ),
    },
  ], [userActions.handleView, userActions.handleEdit, handleDelete]);
  const titleForm = useMemo(() => {
    if (edit) return "Chỉnh sửa người dùng";
    if (view) return "Xem chi tiết người dùng";
    return "Thêm người dùng";
  }, [edit, view]);

  useEffect(() => {
    console.log("a",userDetail , userActions.selectedUserId)
    if (userDetail && userActions.selectedUserId) {
      setRecord({ ...userDetail });
    }
  }, [userDetail, userActions.selectedUserId, setRecord]);

  return (
    <TableBase
      border
      columns={columns}
      dependencies={[page, limit, cond]}
      storeName="user"
      loading={isLoading}
      Form={FormUserProfile}
      formType="Drawer"
      widthDrawer="60%"
      dataSource={data as User.Profile[] || []}
      onCloseForm={userActions.resetFormStates}
      titleForm={titleForm}
      rowKey="_id"
    >
      <TableHeader
        title="Quản lý người dùng"
        textSearch={userFilters.textSearch}
        onSearchChange={userFilters.setTextSearch}
        filterForm={userFilters.filterForm}
        onFilter={userFilters.handleFilter}
        onClearFilter={userFilters.handleClearFilter}
        filterKey={userFilters.filterKey}
        filterFields={filterFields}
        onAdd={userActions.handleAdd}
      />
    </TableBase>
  );
};

export default UserManagement; 