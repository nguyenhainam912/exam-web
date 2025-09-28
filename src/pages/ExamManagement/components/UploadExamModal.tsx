import { Modal, Upload, Button, message, Progress } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useState } from 'react';
import type { UploadProps } from 'antd';
import UploadPreviewModal from './UploadPreviewModal';
import { uploadExamFile } from '@/services/exam/exam';

interface UploadedQuestion {
  question: string;
  answers: string;
}

interface UploadExamModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess?: (data: any[]) => void;
}

const UploadExamModal = ({ visible, onClose, onSuccess }: UploadExamModalProps) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [fileList, setFileList] = useState<any[]>([]);
  const [uploadedData, setUploadedData] = useState<UploadedQuestion[]>([]);
  const [showPreview, setShowPreview] = useState(false);

  const handleUpload = async () => {
    if (fileList.length === 0) {
      message.warning('Vui lòng chọn file để upload');
      return;
    }

    const formData = new FormData();
    // Lấy file đầu tiên (chỉ cho phép upload 1 file)
    if (fileList.length > 0) {
      formData.append('file', fileList[0]);
    }

    setUploading(true);
    setProgress(0);

    try {
      // Simulate upload progress
      const progressTimer = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressTimer);
            return prev;
          }
          return prev + 10;
        });
      }, 200);

      try {
        // Gọi API thực tế
        const response = await uploadExamFile(formData);
        
        clearInterval(progressTimer);
        setProgress(100);
        
        console.log('Upload response:', response);
        
        // Xử lý response với format mới: response.data.data
        let uploadedData = [];
        if (response?.data?.success && response?.data?.data) {
          uploadedData = response.data.data;
        } else if (response?.data) {
          // Fallback cho format cũ
          uploadedData = response.data;
        }
        
        console.log('Uploaded data:', uploadedData);
        
        if (!uploadedData || uploadedData.length === 0) {
          message.warning('File không chứa dữ liệu hợp lệ');
          setUploading(false);
          return;
        }
        
        message.success(`Upload thành công! Đã tìm thấy ${uploadedData.length} câu hỏi.`);
        setFileList([]);
        setProgress(0);
        setUploading(false);
        
        console.log('About to show preview modal with data:', uploadedData);
        
        // Show preview modal with uploaded data
        setUploadedData(uploadedData);
        setShowPreview(true);
        
      } catch (error: any) {
        clearInterval(progressTimer);
        setProgress(0);
        console.error('Upload error:', error);
        
        // Xử lý các loại lỗi khác nhau
        if (error.response) {
          const status = error.response.status;
          const errorMessage = error.response.data?.message || 'Có lỗi xảy ra khi upload file';
          
          switch (status) {
            case 400:
              message.error(`Dữ liệu không hợp lệ: ${errorMessage}`);
              break;
            case 413:
              message.error('File quá lớn, vui lòng chọn file nhỏ hơn');
              break;
            case 415:
              message.error('Định dạng file không được hỗ trợ');
              break;
            default:
              message.error(`Lỗi server: ${errorMessage}`);
          }
        } else if (error.request) {
          message.error('Không thể kết nối đến server. Vui lòng thử lại sau.');
        } else {
          message.error('Có lỗi xảy ra khi upload file');
        }
        setUploading(false);
      }
    } catch (error) {
      message.error('Upload thất bại!');
      setUploading(false);
    } finally {
      setUploading(false);
    }
  };

  const uploadProps: UploadProps = {
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: (file) => {
      // Check file type - chỉ chấp nhận PDF
      const isValidType = file.name.toLowerCase().endsWith('.pdf');
      
      if (!isValidType) {
        message.error('Chỉ chấp nhận file PDF!');
        return false;
      }

      // Check file size (10MB limit)
      const isLt10M = file.size / 1024 / 1024 < 10;
      if (!isLt10M) {
        message.error('File phải nhỏ hơn 10MB!');
        return false;
      }

      setFileList([...fileList, file]);
      return false; // Prevent auto upload
    },
    fileList,
    multiple: false,
  };

  const handleClose = () => {
    setFileList([]);
    setProgress(0);
    setUploading(false);
    setShowPreview(false);
    setUploadedData([]);
    onClose();
  };

  const handleConfirmPreview = (formattedData: any[]) => {
    setShowPreview(false);
    onSuccess?.(formattedData);
    handleClose();
  };

  return (
    <>
      <Modal
        title="Upload File Đề Thi"
        open={visible}
        onCancel={handleClose}
        width={600}
        footer={[
          <Button key="cancel" onClick={handleClose} disabled={uploading}>
            Hủy
          </Button>,
          <Button 
            key="upload" 
            type="primary" 
            onClick={handleUpload}
            loading={uploading}
            disabled={fileList.length === 0}
          >
            {uploading ? 'Đang Upload...' : 'Upload'}
          </Button>,
        ]}
      >
        <Upload.Dragger {...uploadProps} style={{ marginBottom: 16 }}>
          <p className="ant-upload-drag-icon">
            <UploadOutlined />
          </p>
          <p className="ant-upload-text">Kéo thả file PDF vào đây hoặc click để chọn file</p>
          <p className="ant-upload-hint">
            Chỉ hỗ trợ upload file PDF (.pdf)
          </p>
        </Upload.Dragger>

        {uploading && progress > 0 && (
          <div style={{ marginTop: 16 }}>
            <p>Đang upload...</p>
            <Progress percent={progress} />
          </div>
        )}
      </Modal>

      <UploadPreviewModal
        visible={showPreview}
        data={uploadedData}
        onClose={() => {
          console.log('Closing preview modal');
          setShowPreview(false);
        }}
        onConfirm={handleConfirmPreview}
      />
    </>
  );
};

export default UploadExamModal;