import { Button, Popconfirm, message } from 'antd';
import { DeleteOutlined, EditOutlined, EyeOutlined, CheckOutlined, DownloadOutlined } from '@ant-design/icons';
import { memo, useState } from 'react';
import type { Exam } from '@/services/exam';
import { ALL_PERMISSIONS } from '@/config/permissions';
import Access from '@/components/share/access';
import { usePutExamMutation } from '@/hooks/react-query/useExam/useExamMutation';
import { generateExamPdf } from '@/services/exam/exam';
import FileDownload from 'js-file-download';

interface ActionButtonsProps {
  record: Exam.Record;
  onView: (record: Exam.Record) => void;
  onEdit: (record: Exam.Record) => void;
  onDelete: (id: string) => void;
}

const BUTTON_STYLES = {
  view: { 
    marginRight: 8, 
    color: '#1890ff', 
    borderColor: '#1890ff', 
    background: '#fff' 
  },
  edit: { 
    marginRight: 8, 
    background: '#fff', 
    color: '#faad14', 
    borderColor: '#ffe58f' 
  },
} as const;

const ActionButtons = memo(({ record, onView, onEdit, onDelete }: ActionButtonsProps) => {
  const [downloading, setDownloading] = useState(false);
  
  const { mutate: approveExam, isPending: isApproving } = usePutExamMutation({
    onSuccess: () => message.success('Phê duyệt thành công!'),
    onError: () => message.error('Có lỗi khi phê duyệt!'),
    params: {},
  });

  const handleDownloadPdf = async () => {
    if (!record._id) {
      message.error('Không tìm thấy ID đề thi!');
      return;
    }
    
    setDownloading(true);
    try {
      const response = await generateExamPdf(record._id);
      
      // Tạo tên file từ tiêu đề đề thi
      const fileName = `${record.title || 'Đề-thi'}.pdf`;
      
      // Download file
      FileDownload(response.data, fileName);
      message.success('Tải đề thi thành công!');
    } catch (error: any) {
      console.error('Download error:', error);
      if (error.response?.status === 404) {
        message.error('Đề thi không tồn tại!');
      } else if (error.response?.status === 500) {
        message.error('Lỗi server khi tạo PDF!');
      } else {
        message.error('Có lỗi xảy ra khi tải đề thi!');
      }
    } finally {
      setDownloading(false);
    }
  };

  const handleApprove = () => {
    // Chuẩn hóa dữ liệu gửi lên
    const {
      _id,
      createdAt,
      updatedAt,
      subjectId,
      gradeLevelId,
      examTypeId,
      ...rest
    } = record;
    approveExam({
      id: _id!,
      body: {
        subjectId: typeof subjectId === 'object' && subjectId?._id ? subjectId._id : subjectId,
        gradeLevelId: typeof gradeLevelId === 'object' && gradeLevelId?._id ? gradeLevelId._id : gradeLevelId,
        examTypeId: typeof examTypeId === 'object' && examTypeId?._id ? examTypeId._id : examTypeId,
        status: 'ACTIVE',
      },
    });
  };

  return (
    <>
      {/* Nút phê duyệt nếu trạng thái là DRAFT */}
      {(record.status === 'DRAFT' || record.status === 'ACTIVE') && (
        <Button
          type="primary"
          style={
            record.status === 'ACTIVE'
              ? { marginRight: 8, background: '#52c41a', borderColor: '#52c41a' }
              : { marginRight: 8, background: '#fff', borderColor: '#d9d9d9', color: '#52c41a' }
          }
          loading={isApproving}
          onClick={record.status === 'DRAFT' ? handleApprove : undefined}
          icon={<CheckOutlined style={{ color: record.status === 'ACTIVE' ? '#fff' : '#52c41a' }} />}
          disabled={record.status === 'ACTIVE'}
        />
      )}
      
      {/* Nút download PDF */}
      <Access permission={ALL_PERMISSIONS.EXAMS?.GENERATE_PDF} hideChildren={true}>
        <Button
          title="Tải đề thi PDF"
          icon={<DownloadOutlined />}
          style={{ 
            marginRight: 8, 
            background: '#fff', 
            color: '#722ed1', 
            borderColor: '#722ed1' 
          }}
          loading={downloading}
          onClick={handleDownloadPdf}
        />
      </Access>
      
      <Access permission={ALL_PERMISSIONS.EXAMS?.GET_BY_ID} hideChildren={true}>
        <Button
          title="Xem chi tiết"
          icon={<EyeOutlined />}
          style={BUTTON_STYLES.view}
          onClick={() => onView(record)}
        />
      </Access>
      <Access permission={ALL_PERMISSIONS.EXAMS?.UPDATE} hideChildren={true}>
        <Button
          title="Chỉnh sửa"
          icon={<EditOutlined />}
          type="primary"
          style={BUTTON_STYLES.edit}
          onClick={() => onEdit(record)}
        />
      </Access>
      <Access permission={ALL_PERMISSIONS.EXAMS?.DELETE} hideChildren={true}>
        <Popconfirm
          title="Bạn có chắc muốn xóa?"
          onConfirm={() => onDelete(record._id!)}
          okText="Xóa"
          cancelText="Hủy"
        >
          <Button danger title="Xóa" icon={<DeleteOutlined />} />
        </Popconfirm>
      </Access>
    </>
  );
});

ActionButtons.displayName = 'ActionButtons';

export default ActionButtons; 