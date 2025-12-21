import { Modal, Card, Button, Typography, Space } from 'antd';
import { useState, useCallback, useEffect } from 'react';
import { EyeOutlined, EditOutlined, CheckCircleOutlined } from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

interface GeneratedQuestion {
  content: string;  // Đổi từ question -> content
  options: string;  // Đổi từ answers -> options
}

interface GeneratePreviewModalProps {
  visible: boolean;
  data: GeneratedQuestion[];
  onClose: () => void;
  onConfirm: (data: any) => void;
}

const GeneratePreviewModal = ({ visible, data, onClose, onConfirm }: GeneratePreviewModalProps) => {
  const [selectedQuestions, setSelectedQuestions] = useState<number[]>([]);

  // Safeguard: Đảm bảo data là array hợp lệ
  const safeData = Array.isArray(data) ? data : [];

  // Parse answers from string to array of 4 options
  const parseAnswers = useCallback((answersString: string): string[] => {
    if (!answersString || typeof answersString !== 'string') return ['', '', '', ''];
    
    // Tách các đáp án theo dòng (dạng mới không có A. B. C. D.)
    const lines = answersString.split('\n').map(line => line.trim()).filter(line => line);
    
    // Nếu có đúng 4 dòng, trả về trực tiếp
    if (lines.length === 4) {
      return lines;
    }
    
    // Nếu có format A. B. C. D. thì parse theo cách cũ
    const options = ['', '', '', ''];
    lines.forEach(line => {
      const match = line.match(/^([A-D])\.\s*(.+)$/);
      if (match) {
        const index = match[1].charCodeAt(0) - 65;
        if (index >= 0 && index < 4) {
          options[index] = match[2].trim().replace(/\.$/, '');
        }
      }
    });
    
    // Nếu không parse được theo format A. B. C. D., trả về lines gốc
    if (options.every(opt => !opt)) {
      return lines.concat(['', '', '', '']).slice(0, 4);
    }
    
    return options;
  }, []);

  // Extract question content (remove number prefix)
  const parseQuestion = useCallback((questionString: string): string => {
    if (!questionString || typeof questionString !== 'string') return '';
    
    // Remove number prefix like "Câu 81: " or "1. "
    return questionString.replace(/^(\d+\.|Câu \d+:)\s*/, '').trim();
  }, []);

  // Extract correct answer from answers string
  const parseCorrectAnswer = useCallback((answersString: string): string => {
    if (!answersString || typeof answersString !== 'string') return '';
    
    // KHÔNG tự động parse đáp án đúng từ chuỗi options
    // Chỉ trả về đáp án đúng nếu có thông tin rõ ràng từ API/data khác
    // Hiện tại trả về rỗng để không tự động chọn đáp án nào
    return '';
  }, []);

  // Parse full question to get both question and options for display
  const parseQuestionForDisplay = useCallback((questionString: string, answersString: string) => {
    const questionContent = parseQuestion(questionString);
    const options = parseAnswers(answersString);
    const correctAnswer = parseCorrectAnswer(answersString);
    
    return { questionContent, options, correctAnswer };
  }, [parseQuestion, parseAnswers, parseCorrectAnswer]);

  // Convert generated data to form format
  const convertToFormData = useCallback(() => {
    const questionsToUse = selectedQuestions.length > 0 
      ? safeData.filter((_, index) => selectedQuestions.includes(index))
      : safeData;

    return questionsToUse.map(item => {
      const answers = parseAnswers(item.options);  // Đổi từ item.answers -> item.options
      const question = parseQuestion(item.content); // Đổi từ item.question -> item.content
      
      return {
        content: question,
        options: answers,
        correctAnswer: undefined, // Để undefined vì không có thông tin đáp án đúng
        explanation: '',
        difficulty: 1,
        isActive: true
      };
    });
  }, [safeData, selectedQuestions, parseAnswers, parseQuestion]);

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

  const renderQuestion = (item: GeneratedQuestion, index: number) => {
    const { questionContent, options } = parseQuestionForDisplay(item.content, item.options); // Đổi item.question -> item.content, item.answers -> item.options
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
              <span dangerouslySetInnerHTML={{ __html: questionContent }} />
            </Paragraph>
            
            {/* Hiển thị các lựa chọn */}
            <div style={{ marginBottom: 12 }}>
              <Text strong>Các lựa chọn:</Text>
              {options.map((option, optIndex) => {
                if (!option.trim()) return null;
                const letter = String.fromCharCode(65 + optIndex); // A, B, C, D
                return (
                  <div 
                    key={optIndex} 
                    style={{ 
                      marginLeft: 16,
                      padding: '4px 8px',
                      borderRadius: 4,
                      marginTop: 4
                    }}
                  >
                    <Text>
                      {letter}. <span dangerouslySetInnerHTML={{ __html: option }} />
                    </Text>
                  </div>
                );
              })}
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
          <span>Xem trước câu hỏi đã tạo ({safeData.length} câu hỏi)</span>
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
            <li>Đáp án đúng đã được tự động phát hiện (nếu có)</li>
            <li>Bạn sẽ cần xác nhận các lựa chọn A, B, C, D trong form tạo đề thi</li>
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

export default GeneratePreviewModal;