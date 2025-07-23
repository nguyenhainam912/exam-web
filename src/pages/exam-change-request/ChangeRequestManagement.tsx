import { message } from 'antd';
import { useEffect, useMemo, useCallback } from 'react';
import TableBase from '@/components/common/Table';
import type { IColumn } from '@/utils/interfaces';
import { useExamChangeRequestQuery } from '@/hooks/react-query/useExam/useExamQuery';
import TableHeader from '../ExamManagement/components/TableHeader';
import Access from '@/components/share/access';
import { Modal, Button, Space, Descriptions, Row, Col, Typography } from 'antd';
import { EyeOutlined, CheckOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { getExamChangeRequestDetail, reviewExamChangeRequest } from '@/services/exam/exam';
import { useReviewExamChangeRequestMutation } from '@/hooks/react-query/useExam/useExamMutation';
import FormChangeRequest from './components/FormChangeRequest';
import useExamChangeRequestStore from '@/stores/examChangeRequest';

const COLUMN_WIDTHS = {
  index: 80,
  createdBy: 200,
  createdAt: 180,
  status: 120,
  content: 300,
  actions: 120,
} as const;

const { Text } = Typography;

const ChangeRequestManagement = () => {
  // State phân trang/filter nếu cần
  const page = 1;
  const limit = 10;
  const cond = {};

  // Query
  const { data, isLoading } = useExamChangeRequestQuery({ page, limit, cond });

  // Filter fields configuration
  const filterFields = useMemo(() => [
    // Thêm các trường filter nếu cần
  ], []);

  const [viewModal, setViewModal] = useState(false);
  const [detail, setDetail] = useState<any>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [reviewingId, setReviewingId] = useState<string | null>(null);

  // Mutation phê duyệt
  const { mutate: reviewChangeRequest, isPending: isReviewing } = useReviewExamChangeRequestMutation({
    onSuccess: () => {
      message.success('Phê duyệt thành công!');
      setReviewingId(null);
      // TODO: refetch lại bảng nếu cần
    },
    onError: () => {
      message.error('Có lỗi khi duyệt yêu cầu!');
      setReviewingId(null);
    },
    params: {},
  });

  // Xem chi tiết yêu cầu thay đổi
  const handleViewDetail = async (id: string) => {
    setLoadingDetail(true);
    try {
      const res = await getExamChangeRequestDetail(id);
      setDetail(res?.data);
      setViewModal(true);
    } catch (e) {
      message.error('Không lấy được chi tiết yêu cầu thay đổi!');
    } finally {
      setLoadingDetail(false);
    }
  };

  // Phê duyệt yêu cầu thay đổi
  const handleReview = (id: string, status: 'APPROVED' | 'REJECTED') => {
    setReviewingId(id);
    reviewChangeRequest({ id, body: { status } });
  };

  // Memoized columns
  const { setRecord, setView, setEdit, setVisibleForm } = useExamChangeRequestStore();
  const columns: IColumn<any>[] = useMemo(() => [
    {
      title: 'STT',
      dataIndex: 'index',
      align: 'center',
      width: COLUMN_WIDTHS.index,
      render: (_: any, __: any, idx: number) => idx + 1,
    },
    {
      title: 'Người yêu cầu',
      dataIndex: 'createdBy',
      align: 'center',
      width: COLUMN_WIDTHS.createdBy,
      render: (u: any) => u?.name || u?.email || '-',
    },
    {
      title: 'Thời gian',
      dataIndex: 'createdAt',
      align: 'center',
      width: COLUMN_WIDTHS.createdAt,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      align: 'center',
      width: COLUMN_WIDTHS.status,
    },
    {
      title: 'Nội dung',
      dataIndex: 'content',
      align: 'center',
      width: COLUMN_WIDTHS.content,
    },
    {
      title: 'Thao tác',
      align: 'center',
      width: COLUMN_WIDTHS.actions,
      render: (record: any) => (
        <Space>
          <Button icon={<EyeOutlined />} onClick={() => {
            setRecord(record);
            setView(true);
            setEdit(false);
            setVisibleForm(true);
          }} />
          <Button
            icon={<CheckOutlined />}
            type="primary"
            loading={isReviewing && reviewingId === record._id}
            onClick={() => handleReview(record._id, 'APPROVED')}
            disabled={record.status !== 'PENDING'}
          />
        </Space>
      ),
    },
  ], [reviewingId]);

  // Memoized title
  const titleForm = useMemo(() => {
    return 'Quản lý yêu cầu thay đổi đề thi';
  }, []);

  // Nếu có FormChangeRequest thì truyền vào TableBase, nếu không thì bỏ
  return (
    <>
      <TableBase
        border
        columns={columns}
        dependencies={[page, limit, cond]}
        storeName="exam-change-request"
        loading={isLoading}
        Form={FormChangeRequest}
        formType="Drawer"
        widthDrawer="80%"
        dataSource={data || []}
        titleForm={titleForm}
        rowKey="_id"
      >
        <TableHeader
          title="Quản lý yêu cầu thay đổi đề thi"
          textSearch={''}
          onSearchChange={() => {}}
          filterForm={null}
          onFilter={() => {}}
          onClearFilter={() => {}}
          filterKey={0}
          filterFields={filterFields}
          onAdd={() => {}}
          showAddButton={false}
        />
      </TableBase>
    </>
  );
};

export default ChangeRequestManagement; 