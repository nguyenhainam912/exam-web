import { message } from 'antd';
import { useEffect, useMemo, useCallback } from 'react';
import TableBase from '@/components/common/Table';
import type { IColumn } from '@/utils/interfaces';
import { useExamTypeQuery, useExamTypeByIdQuery } from '@/hooks/react-query/useExamType/useExamTypeQuery';
import useExamTypeStore from '@/stores/examType';
import { useDeleteExamTypeMutation } from '@/hooks/react-query/useExamType/useExamTypeMutation';
import { ALL_PERMISSIONS } from '@/config/permissions';

// Import components
import TableHeader from './components/TableHeader';
import ActionButtons from './components/ActionButtons';
import FormExamType from './components/FormExamType';
import Access from '@/components/share/access';

// Import hooks
import { useExamTypeFilters } from './hooks/useExamTypeFilters';
import { useExamTypeActions } from './hooks/useExamTypeActions';
import { FilterField } from '@/components/common/Filter/filter';

const COLUMN_WIDTHS = {
  index: 80,
  name: 200,
  code: 120,
  description: 300,
  actions: 160,
} as const;

const ExamTypesManagement = () => {
  const { page, limit, cond, setCondition, setRecord, setView, setEdit, setVisibleForm, edit, view } = useExamTypeStore();

  // Custom hooks
  const {
    textSearch,
    setTextSearch,
    filterForm,
    filterKey,
    handleFilter,
    handleClearFilter,
  } = useExamTypeFilters({ cond, setCondition, page, limit });

  const {
    selectedExamTypeId,
    handleView,
    handleEdit,
    handleAdd,
    resetFormStates,
  } = useExamTypeActions({ setRecord, setView, setEdit, setVisibleForm });

  // Queries
  const { data, isLoading } = useExamTypeQuery({ page, limit, cond });
  const { data: examTypeDetail } = useExamTypeByIdQuery(selectedExamTypeId);

  // Mutations
  const { mutate: deleteExamType } = useDeleteExamTypeMutation({
    onSuccess: () => message.success('Xóa thành công!'),
    onError: () => message.error('Có lỗi xảy ra khi xóa!'),
    params: { page, limit, cond },
  });

  // Update record when exam-type detail is loaded
  useEffect(() => {
    if (examTypeDetail && selectedExamTypeId) {
      setRecord({ ...examTypeDetail });
    }
  }, [examTypeDetail, selectedExamTypeId, setRecord]);

  // Memoized delete handler
  const handleDelete = useCallback((id: string) => {
    deleteExamType(id);
  }, [deleteExamType]);

  // Filter fields configuration
  const filterFields: FilterField[] = useMemo(() => [
    {
      name: 'name',
      label: 'Tên loại đề',
      placeholder: 'Nhập tên loại đề',
      type: 'input',
      options: [],
    },
    {
      name: 'code',
      label: 'Mã loại đề',
      placeholder: 'Nhập mã loại đề',
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
      title: 'Tên loại đề',
      dataIndex: 'name',
      align: 'center',
      width: COLUMN_WIDTHS.name,
    },
    {
      title: 'Mã loại đề',
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
    if (edit) return "Chỉnh sửa loại đề";
    if (view) return "Xem chi tiết loại đề";
    return "Thêm loại đề";
  }, [edit, view]);

  return (
    <Access permission={ALL_PERMISSIONS.EXAM_TYPES?.GET_PAGINATE} hideChildren={true}>
      <TableBase
        border
        columns={columns}
        dependencies={[page, limit, cond]}
        storeName="examType"
        loading={isLoading}
        Form={FormExamType}
        formType="Drawer"
        widthDrawer="60%"
        dataSource={data || []}
        onCloseForm={resetFormStates}
        titleForm={titleForm}
        rowKey="_id"
      >
        <TableHeader
          title="Quản lý loại đề"
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

export default ExamTypesManagement; 