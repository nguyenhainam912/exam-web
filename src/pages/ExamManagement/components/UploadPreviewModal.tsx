import { Modal, Card, Button, Typography, Space } from 'antd';
import { useState, useCallback } from 'react';
import { EyeOutlined, EditOutlined, CheckCircleOutlined } from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

interface UploadedQuestion {
  question: string;
  answers: string;
}

interface UploadPreviewModalProps {
  visible: boolean;
  data: UploadedQuestion[];
  onClose: () => void;
  onConfirm: (data: any) => void;
}

const UploadPreviewModal = ({ visible, data, onClose, onConfirm }: UploadPreviewModalProps) => {
  const [selectedQuestions, setSelectedQuestions] = useState<number[]>([]);

  // Safeguard: Đảm bảo data là array hợp lệ
  const safeData = Array.isArray(data) ? data : [];

  // Parse answers from string to array
  const parseAnswers = useCallback((answersString: string): string[] => {
    if (!answersString || typeof answersString !== 'string') return ['', '', '', ''];
    
    // Với format mới, answers chỉ chứa 1 đáp án đúng
    // Ví dụ: "D. 6." hoặc "A. -5."
    // Tạo 4 đáp án trống, user sẽ cần nhập thủ công
    return ['', '', '', ''];
  }, []);

  // Extract question content (remove number prefix)
  const parseQuestion = useCallback((questionString: string): string => {
    if (!questionString || typeof questionString !== 'string') return '';
    
    // Remove number prefix like "1. " or "2. "
    return questionString.replace(/^\d+\.\s*/, '').trim();
  }, []);

  // Extract correct answer from answers string
  const parseCorrectAnswer = useCallback((answersString: string): string => {
    if (!answersString || typeof answersString !== 'string') return '';
    
    // Với format mới, answers chứa đáp án đúng
    // Ví dụ: "D. 6." -> trả về "D"
    const match = answersString.match(/^([A-D])\./);
    return match ? match[1] : '';
  }, []);

  // Convert uploaded data to form format
  const convertToFormData = useCallback(() => {
    const questionsToUse = selectedQuestions.length > 0 
      ? safeData.filter((_, index) => selectedQuestions.includes(index))
      : safeData;

    return questionsToUse.map(item => {
      const answers = parseAnswers(item.answers);
      const question = parseQuestion(item.question);
      const correctAnswer = parseCorrectAnswer(item.answers);
      
      return {
        content: question,
        options: answers, // 4 empty strings, user needs to fill
        correctAnswer: correctAnswer, // A, B, C, or D
        explanation: '',
        difficulty: 1,
        isActive: true
      };
    });
  }, [safeData, selectedQuestions, parseAnswers, parseQuestion, parseCorrectAnswer]);

  const handleConfirm = () => {
    const formattedData = convertToFormData();
    onConfirm(formattedData);
    onClose();
  };

  const handleSelectQuestion = (index: number) => {
    setSelectedQuestions(prev => {
      if (prev.includes(index)) {
        return prev.filter(i => i !== index);
      } else {
        return [...prev, index];
      }
    });
  };

  const selectAllQuestions = () => {
    if (selectedQuestions.length === safeData.length) {
      setSelectedQuestions([]);
    } else {
      setSelectedQuestions(safeData.map((_, index) => index));
    }
  };

  const renderQuestion = (item: UploadedQuestion, index: number) => {
    const question = parseQuestion(item.question);
    const isSelected = selectedQuestions.includes(index);

    return (
      <Card
        key={index}
        size="small"
        className={`question-card ${isSelected ? 'selected' : ''}`}
        style={{
          marginBottom: 12,
          border: isSelected ? '2px solid #1890ff' : '1px solid #d9d9d9',
          cursor: 'pointer'
        }}
        onClick={() => handleSelectQuestion(index)}
        hoverable
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ flex: 1 }}>
            <Title level={5} style={{ marginBottom: 8, color: '#1890ff' }}>
              Câu {index + 1}
              {isSelected && <CheckCircleOutlined style={{ color: '#52c41a', marginLeft: 8 }} />}
            </Title>
            <Paragraph style={{ marginBottom: 12 }}>
              <Text strong>Câu hỏi:</Text>
              <br />
              <span dangerouslySetInnerHTML={{ __html: question }} />
            </Paragraph>
            <div>
              <Text strong>Đáp án đúng:</Text>
              <div style={{ paddingLeft: 16, marginTop: 4 }}>
                <Text 
                  style={{ 
                    backgroundColor: '#f6ffed', 
                    color: '#389e0d', 
                    padding: '2px 8px', 
                    borderRadius: 4,
                    fontWeight: 'bold'
                  }}
                >
                  {item.answers}
                </Text>
              </div>
              <div style={{ marginTop: 8, fontSize: 12, color: '#666' }}>
                <Text italic>
                  Lưu ý: Các lựa chọn A, B, C, D sẽ cần được nhập thủ công trong form tạo đề thi.
                </Text>
              </div>
            </div>
          </div>
        </div>
      </Card>
    );
  };

  // Early return nếu không có dữ liệu
  if (!safeData.length) {
    return (
      <Modal
        title="Không có dữ liệu"
        open={visible}
        onCancel={onClose}
        footer={[
          <Button key="close" onClick={onClose}>
            Đóng
          </Button>
        ]}
      >
        <p>Không có câu hỏi nào để hiển thị.</p>
      </Modal>
    );
  }

  return (
    <Modal
      title={
        <Space>
          <EyeOutlined />
          <span>Xem trước dữ liệu Upload ({safeData.length} câu hỏi)</span>
        </Space>
      }
      open={visible}
      onCancel={onClose}
      width="80%"
      style={{ top: 20 }}
      bodyStyle={{ maxHeight: '70vh', overflow: 'auto' }}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Hủy
        </Button>,
        <Button 
          key="selectAll" 
          onClick={selectAllQuestions}
          type={selectedQuestions.length === safeData.length ? "default" : "dashed"}
        >
          {selectedQuestions.length === safeData.length ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
        </Button>,
        <Button 
          key="confirm" 
          type="primary" 
          icon={<EditOutlined />}
          onClick={handleConfirm}
          disabled={selectedQuestions.length === 0 && safeData.length > 0}
        >
          Tạo đề thi với {selectedQuestions.length || safeData.length} câu hỏi
        </Button>,
      ]}
    >
      <div style={{ marginBottom: 16 }}>
        <div style={{ 
          padding: '12px 16px', 
          backgroundColor: '#f6ffed', 
          border: '1px solid #b7eb8f',
          borderRadius: 6,
          marginBottom: 16 
        }}>
          <Title level={5} style={{ margin: 0, color: '#389e0d' }}>
            📋 Hướng dẫn
          </Title>
          <ul style={{ margin: '8px 0 0 0', paddingLeft: 20, color: '#666' }}>
            <li>Click vào câu hỏi để chọn/bỏ chọn</li>
            <li>Câu hỏi được chọn sẽ có viền xanh và biểu tượng ✓</li>
            <li>Bạn có thể chọn tất cả hoặc chỉ một số câu hỏi</li>
            <li>Đáp án đúng đã được tự động phát hiện</li>
            <li>Bạn sẽ cần nhập các lựa chọn A, B, C, D trong form tạo đề thi</li>
            <li>Sau khi xác nhận, form tạo đề thi sẽ được fill sẵn dữ liệu</li>
          </ul>
        </div>

        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: 16,
          padding: '8px 12px',
          backgroundColor: '#fafafa',
          borderRadius: 4
        }}>
          <Text strong>
            Đã chọn: {selectedQuestions.length}/{safeData.length} câu hỏi
          </Text>
          <Button size="small" type="link" onClick={selectAllQuestions}>
            {selectedQuestions.length === safeData.length ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
          </Button>
        </div>
      </div>

      <div>
        {safeData.map((item, index) => renderQuestion(item, index))}
      </div>
    </Modal>
  );
};

export default UploadPreviewModal;