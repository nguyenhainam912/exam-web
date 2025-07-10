import { message } from 'antd';
import { useEffect, useMemo, useCallback } from 'react';
import TableBase from '@/components/common/Table';
import type { IColumn } from '@/utils/interfaces';
import { useSubjectQuery, useSubjectByIdQuery } from '@/hooks/react-query/useSubject/useSubjectQuery';
import useSubjectStore from '@/stores/subject';
import { useDeleteSubjectMutation } from '@/hooks/react-query/useSubject/useSubjectMutation';
import { ALL_PERMISSIONS } from '@/config/permissions';

// Import components
import TableHeader from './components/TableHeader';
import ActionButtons from './components/ActionButtons';
import FormSubject from './components/FormSubject';
import Access from '@/components/share/access';

// Import hooks
import { useSubjectFilters } from './hooks/useSubjectFilters';
import { useSubjectActions } from './hooks/useSubjectActions';
import { FilterField } from '@/components/common/Filter/filter';

const COLUMN_WIDTHS = {
  index: 80,
  name: 200,
  code: 120,
  description: 300,
  actions: 160,
} as const;

const SubjectsManagement = () => {
  const { page, limit, cond, setCondition, setRecord, setView, setEdit, setVisibleForm, edit, view } = useSubjectStore();

  // Custom hooks
  const {
    textSearch,
    setTextSearch,
    filterForm,
    filterKey,
    handleFilter,
    handleClearFilter,
  } = useSubjectFilters({ cond, setCondition, page, limit });

  const {
    selectedSubjectId,
    handleView,
    handleEdit,
    handleAdd,
    resetFormStates,
  } = useSubjectActions({ setRecord, setView, setEdit, setVisibleForm });

  // Queries
  const { data, isLoading } = useSubjectQuery({ page, limit, cond });
  const { data: subjectDetail } = useSubjectByIdQuery(selectedSubjectId);

  // Mutations
  const { mutate: deleteSubject } = useDeleteSubjectMutation({
    onSuccess: () => message.success('Xóa thành công!'),
    onError: () => message.error('Có lỗi xảy ra khi xóa!'),
    params: { page, limit, cond },
  });

  // Update record when subject detail is loaded
  useEffect(() => {
    if (subjectDetail && selectedSubjectId) {
      setRecord({ ...subjectDetail });
    }
  }, [subjectDetail, selectedSubjectId, setRecord]);

  // Memoized delete handler
  const handleDelete = useCallback((id: string) => {
    deleteSubject(id);
  }, [deleteSubject]);

  // Filter fields configuration
  const filterFields: FilterField[] = useMemo(() => [
    {
      name: 'name',
      label: 'Tên môn học',
      placeholder: 'Nhập tên môn học',
      type: 'input',
      options: [],
    },
    {
      name: 'code',
      label: 'Mã môn học',
      placeholder: 'Nhập mã môn học',
      type: 'input',
      options: [],
    },
  ], []);

  // Memoized columns
  const columns: IColumn<any>[] = useMemo(() => [
    {
      title: 'STT',
      dataIndex: 'index',
      align: 'center',
      width: COLUMN_WIDTHS.index,
      render: (_: any, __: any, idx: number) => idx + 1,
    },
    {
      title: 'Tên môn học',
      dataIndex: 'name',
      align: 'center',
      width: COLUMN_WIDTHS.name,
    },
    {
      title: 'Mã môn học',
      dataIndex: 'code',
      align: 'center',
      width: COLUMN_WIDTHS.code,
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      align: 'center',
      width: COLUMN_WIDTHS.description,
    },
    {
      title: 'Thao tác',
      align: 'center',
      width: COLUMN_WIDTHS.actions,
      render: (record: any) => (
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
    if (edit) return "Chỉnh sửa môn học";
    if (view) return "Xem chi tiết môn học";
    return "Thêm môn học";
  }, [edit, view]);

  return (
    <Access permission={ALL_PERMISSIONS.SUBJECTS?.GET_PAGINATE} hideChildren={true}>
      <TableBase
        border
        columns={columns}
        dependencies={[page, limit, cond]}
        storeName="subject"
        loading={isLoading}
        Form={FormSubject}
        formType="Drawer"
        widthDrawer="60%"
        dataSource={data || []}
        onCloseForm={resetFormStates}
        titleForm={titleForm}
        rowKey="_id"
      >
        <TableHeader
          title="Quản lý môn học"
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

export default SubjectsManagement; 