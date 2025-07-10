import { message } from 'antd';
import { useEffect, useMemo, useCallback } from 'react';
import TableBase from '@/components/common/Table';
import type { IColumn } from '@/utils/interfaces';
import { useGradeLevelQuery, useGradeLevelByIdQuery } from '@/hooks/react-query/useGradeLevel/useGradeLevelQuery';
import useGradeLevelStore from '@/stores/gradeLevel';
import { useDeleteGradeLevelMutation } from '@/hooks/react-query/useGradeLevel/useGradeLevelMutation';
import { ALL_PERMISSIONS } from '@/config/permissions';

// Import components
import TableHeader from './components/TableHeader';
import ActionButtons from './components/ActionButtons';
import FormGradeLevel from './components/FormGradeLevel';
import Access from '@/components/share/access';

// Import hooks
import { useGradeLevelFilters } from './hooks/useGradeLevelFilters';
import { useGradeLevelActions } from './hooks/useGradeLevelActions';
import { FilterField } from '@/components/common/Filter/filter';

const COLUMN_WIDTHS = {
  index: 80,
  name: 200,
  code: 120,
  description: 300,
  actions: 160,
} as const;

const GradeLevelsManagement = () => {
  const { page, limit, cond, setCondition, setRecord, setView, setEdit, setVisibleForm, edit, view } = useGradeLevelStore();

  // Custom hooks
  const {
    textSearch,
    setTextSearch,
    filterForm,
    filterKey,
    handleFilter,
    handleClearFilter,
  } = useGradeLevelFilters({ cond, setCondition, page, limit });

  const {
    selectedGradeLevelId,
    handleView,
    handleEdit,
    handleAdd,
    resetFormStates,
  } = useGradeLevelActions({ setRecord, setView, setEdit, setVisibleForm });

  // Queries
  const { data, isLoading } = useGradeLevelQuery({ page, limit, cond });
  const { data: gradeLevelDetail } = useGradeLevelByIdQuery(selectedGradeLevelId);

  // Mutations
  const { mutate: deleteGradeLevel } = useDeleteGradeLevelMutation({
    onSuccess: () => message.success('Xóa thành công!'),
    onError: () => message.error('Có lỗi xảy ra khi xóa!'),
    params: { page, limit, cond },
  });

  // Update record when grade-level detail is loaded
  useEffect(() => {
    if (gradeLevelDetail && selectedGradeLevelId) {
      setRecord({ ...gradeLevelDetail });
    }
  }, [gradeLevelDetail, selectedGradeLevelId, setRecord]);

  // Memoized delete handler
  const handleDelete = useCallback((id: string) => {
    deleteGradeLevel(id);
  }, [deleteGradeLevel]);

  // Filter fields configuration
  const filterFields: FilterField[] = useMemo(() => [
    {
      name: 'name',
      label: 'Tên khối lớp',
      placeholder: 'Nhập tên khối lớp',
      type: 'input',
      options: [],
    },
    {
      name: 'code',
      label: 'Mã khối lớp',
      placeholder: 'Nhập mã khối lớp',
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
      title: 'Tên khối lớp',
      dataIndex: 'name',
      align: 'center',
      width: COLUMN_WIDTHS.name,
    },
    {
      title: 'Mã khối lớp',
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
    if (edit) return "Chỉnh sửa khối lớp";
    if (view) return "Xem chi tiết khối lớp";
    return "Thêm khối lớp";
  }, [edit, view]);

  return (
    <Access permission={ALL_PERMISSIONS.GRADE_LEVELS.GET_PAGINATE} hideChildren={true}>
      <TableBase
        border
        columns={columns}
        dependencies={[page, limit, cond]}
        storeName="gradeLevel"
        loading={isLoading}
        Form={FormGradeLevel}
        formType="Drawer"
        widthDrawer="60%"
        dataSource={data || []}
        onCloseForm={resetFormStates}
        titleForm={titleForm}
        rowKey="_id"
      >
        <TableHeader
          title="Quản lý khối lớp"
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

export default GradeLevelsManagement; 