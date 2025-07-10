import { message } from 'antd';
import { useEffect, useMemo, useCallback } from 'react';
import TableBase from '@/components/common/Table';
import type { IColumn } from '@/utils/interfaces';
import { useExamQuery, useExamByIdQuery } from '@/hooks/react-query/useExam/useExamQuery';
import useExamStore from '@/stores/exam';
import { useDeleteExamMutation } from '@/hooks/react-query/useExam/useExamMutation';
import { ALL_PERMISSIONS } from '@/config/permissions';

// Import components
import TableHeader from './components/TableHeader';
import ActionButtons from './components/ActionButtons';
import FormExam from './components/FormExam';
import Access from '@/components/share/access';

// Import hooks
import { useExamFilters } from './hooks/useExamFilters';
import { useExamActions } from './hooks/useExamActions';
import { FilterField } from '@/components/common/Filter/filter';

const COLUMN_WIDTHS = {
  index: 80,
  title: 250,
  status: 120,
  subjectId: 150,
  gradeLevelId: 150,
  examTypeId: 150,
  duration: 100,
  actions: 160,
} as const;

const ExamManagement = () => {
  const { page, limit, cond, setCondition, setRecord, setView, setEdit, setVisibleForm, edit, view } = useExamStore();

  // Custom hooks
  const {
    textSearch,
    setTextSearch,
    filterForm,
    filterKey,
    handleFilter,
    handleClearFilter,
  } = useExamFilters({ cond, setCondition, page, limit });

  const {
    selectedExamId,
    handleView,
    handleEdit,
    handleAdd,
    resetFormStates,
  } = useExamActions({ setRecord, setView, setEdit, setVisibleForm });

  // Queries
  const { data, isLoading } = useExamQuery({ page, limit, cond });
  const { data: examDetail } = useExamByIdQuery(selectedExamId);

  // Mutations
  const { mutate: deleteExam } = useDeleteExamMutation({
    onSuccess: () => message.success('Xóa thành công!'),
    onError: () => message.error('Có lỗi xảy ra khi xóa!'),
    params: { page, limit, cond },
  });

  // Update record when exam detail is loaded
  useEffect(() => {
    if (examDetail && selectedExamId) {
      setRecord({ ...examDetail });
    }
  }, [examDetail, selectedExamId, setRecord]);

  // Memoized delete handler
  const handleDelete = useCallback((id: string) => {
    deleteExam(id);
  }, [deleteExam]);

  // Filter fields configuration
  const filterFields: FilterField[] = useMemo(() => [
    {
      name: 'title',
      label: 'Tiêu đề đề thi',
      placeholder: 'Nhập tiêu đề đề thi',
      type: 'input',
      options: [],
    },
    {
      name: 'status',
      label: 'Trạng thái',
      placeholder: 'Chọn trạng thái',
      type: 'select',
      options: [
        { label: 'Nháp', value: 'DRAFT' },
        { label: 'Công khai', value: 'PUBLISHED' },
        { label: 'Ẩn', value: 'HIDDEN' },
      ],
    },
    {
      name: 'subjectId',
      label: 'Môn học',
      placeholder: 'Chọn môn học',
      type: 'select',
      options: [],
    },
    {
      name: 'gradeLevelId',
      label: 'Khối lớp',
      placeholder: 'Chọn khối lớp',
      type: 'select',
      options: [],
    },
    {
      name: 'examTypeId',
      label: 'Loại đề',
      placeholder: 'Chọn loại đề',
      type: 'select',
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
      title: 'Tiêu đề đề thi',
      dataIndex: 'title',
      align: 'center',
      width: COLUMN_WIDTHS.title,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      align: 'center',
      width: COLUMN_WIDTHS.status,
    },
    {
      title: 'Môn học',
      dataIndex: 'subjectId',
      align: 'center',
      width: COLUMN_WIDTHS.subjectId,
    },
    {
      title: 'Khối lớp',
      dataIndex: 'gradeLevelId',
      align: 'center',
      width: COLUMN_WIDTHS.gradeLevelId,
    },
    {
      title: 'Loại đề',
      dataIndex: 'examTypeId',
      align: 'center',
      width: COLUMN_WIDTHS.examTypeId,
    },
    {
      title: 'Thời lượng',
      dataIndex: 'duration',
      align: 'center',
      width: COLUMN_WIDTHS.duration,
      render: (duration: number) => `${duration} phút`,
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
    if (edit) return "Chỉnh sửa đề thi";
    if (view) return "Xem chi tiết đề thi";
    return "Thêm đề thi";
  }, [edit, view]);

  return (
    <Access permission={ALL_PERMISSIONS.EXAMS?.GET_PAGINATE} hideChildren={true}>
      <TableBase
        border
        columns={columns}
        dependencies={[page, limit, cond]}
        storeName="exam"
        loading={isLoading}
        Form={FormExam}
        formType="Drawer"
        widthDrawer="60%"
        dataSource={data || []}
        onCloseForm={resetFormStates}
        titleForm={titleForm}
        rowKey="_id"
      >
        <TableHeader
          title="Quản lý đề thi"
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

export default ExamManagement; 