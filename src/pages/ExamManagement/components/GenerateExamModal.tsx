import { Modal, Form, Select, InputNumber, Input, message, Progress } from 'antd';
import { useEffect, useState } from 'react';
import { generateExamWithAI } from '@/services/exam/exam';
import GeneratePreviewModal from './GeneratePreviewModal';

interface GenerateExamModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: (data: any) => void;
  subjectOptions: { label: string; value: string }[];
  gradeOptions: { label: string; value: string }[];
  examTypeOptions: { label: string; value: string }[];
}

interface GeneratedQuestion {
  content: string;  // Đổi từ question -> content
  options: string;  // Đổi từ answers -> options
}

const GenerateExamModal = ({
  visible,
  onClose,
  onSuccess,
  subjectOptions,
  gradeOptions,
  examTypeOptions,
}: GenerateExamModalProps) => {
  const [form] = Form.useForm();
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [generatedData, setGeneratedData] = useState<GeneratedQuestion[]>([]);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (!visible) {
      form.resetFields();
      setProgress(0);
      setGenerating(false);
    }
  }, [visible, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      setGenerating(true);
      setProgress(0);

      const progressTimer = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressTimer);
            return prev;
          }
          return prev + 10;
        });
      }, 300);

      try {
        // Call API to generate exam
        const response = await generateExamWithAI({
          subjectId: values.subjectId,
          gradeLevelId: values.gradeLevelId,
          examTypeId: values.examTypeId,
          numberOfQuestions: values.numberOfQuestions,
          topics: values.topics,
        });

        clearInterval(progressTimer);
        setProgress(100);

        console.log('Generate response:', response);

        // Handle response - UPDATED
        let generatedQuestions = [];
        
        // Xử lý response format mới
        if (response?.data?.success && response?.data?.data) {
          generatedQuestions = response.data.data;
        } else if (response?.success && response?.data) {
          generatedQuestions = response.data;
        } else if (response?.data) {
          generatedQuestions = response.data;
        } else if (Array.isArray(response)) {
          generatedQuestions = response;
        }

        console.log('Generated questions before transform:', generatedQuestions);

        // Transform data: content -> question, options -> answers
        generatedQuestions = generatedQuestions.map((item: any) => ({
          content: item.content || item.question || '',
          options: item.options || item.answers || ''
        }));

        console.log('Generated questions after transform:', generatedQuestions);

        if (!generatedQuestions || generatedQuestions.length === 0) {
          message.warning('Không tạo được câu hỏi. Vui lòng thử lại.');
          setGenerating(false);
          return;
        }

        message.success(`Đã tạo thành công ${generatedQuestions.length} câu hỏi!`);
        
        // Show preview modal
        setGeneratedData(generatedQuestions);
        setShowPreview(true);
        
      } catch (error: any) {
        clearInterval(progressTimer);
        setProgress(0);
        console.error('Generate error:', error);

        if (error.response) {
          const status = error.response.status;
          const errorMessage = error.response.data?.message || 'Có lỗi xảy ra khi tạo đề thi';
          
          switch (status) {
            case 400:
              message.error(`Dữ liệu không hợp lệ: ${errorMessage}`);
              break;
            case 500:
              message.error('Lỗi server, vui lòng thử lại sau');
              break;
            default:
              message.error(`Lỗi: ${errorMessage}`);
          }
        } else if (error.request) {
          message.error('Không thể kết nối đến server. Vui lòng thử lại sau.');
        } else {
          message.error('Có lỗi xảy ra khi tạo đề thi');
        }
        setGenerating(false);
      }
    } catch (error) {
      console.error('Validation failed:', error);
      setGenerating(false);
    } finally {
      setGenerating(false);
    }
  };

  const handleClose = () => {
    setGeneratedData([]);
    setShowPreview(false);
    setProgress(0);
    setGenerating(false);
    onClose();
  };

  const handleConfirmPreview = (formattedData: any[]) => {
    setShowPreview(false);
    onSuccess(formattedData);
    handleClose();
  };

  return (
    <>
      <Modal
        title="Tạo đề thi tự động"
        open={visible}
        onCancel={handleClose}
        onOk={handleSubmit}
        width={600}
        okText={generating ? "Đang tạo..." : "Tạo đề"}
        cancelText="Hủy"
        confirmLoading={generating}
        okButtonProps={{ disabled: generating }}
        cancelButtonProps={{ disabled: generating }}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            numberOfQuestions: 10,
          }}
        >
          <Form.Item
            name="subjectId"
            label="Môn học"
            rules={[{ required: true, message: 'Vui lòng chọn môn học!' }]}
          >
            <Select
              placeholder="Chọn môn học"
              options={subjectOptions}
              showSearch
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
              disabled={generating}
            />
          </Form.Item>

          <Form.Item
            name="gradeLevelId"
            label="Khối lớp"
            rules={[{ required: true, message: 'Vui lòng chọn khối lớp!' }]}
          >
            <Select
              placeholder="Chọn khối lớp"
              options={gradeOptions}
              showSearch
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
              disabled={generating}
            />
          </Form.Item>

          <Form.Item
            name="examTypeId"
            label="Loại đề thi"
            rules={[{ required: true, message: 'Vui lòng chọn loại đề!' }]}
          >
            <Select
              placeholder="Chọn loại đề"
              options={examTypeOptions}
              showSearch
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
              disabled={generating}
            />
          </Form.Item>

          <Form.Item
            name="numberOfQuestions"
            label="Số lượng câu hỏi"
            rules={[
              { required: true, message: 'Vui lòng nhập số lượng câu hỏi!' },
              { type: 'number', min: 1, max: 100, message: 'Số câu hỏi từ 1-100!' },
            ]}
          >
            <InputNumber
              placeholder="Nhập số lượng câu hỏi"
              style={{ width: '100%' }}
              min={1}
              max={100}
              disabled={generating}
            />
          </Form.Item>

          <Form.Item
            name="topics"
            label="Chủ đề"
            rules={[{ required: true, message: 'Vui lòng nhập chủ đề!' }]}
          >
            <Input.TextArea
              placeholder="Ví dụ: Đạo hàm, tích phân, phương trình vi phân"
              rows={4}
              disabled={generating}
            />
          </Form.Item>
        </Form>

        {generating && progress > 0 && (
          <div style={{ marginTop: 16 }}>
            <p>Đang tạo đề thi...</p>
            <Progress percent={progress} />
          </div>
        )}
      </Modal>

      <GeneratePreviewModal
        visible={showPreview}
        data={generatedData}
        onClose={() => {
          console.log('Closing preview modal');
          setShowPreview(false);
        }}
        onConfirm={handleConfirmPreview}
      />
    </>
  );
};

export default GenerateExamModal;