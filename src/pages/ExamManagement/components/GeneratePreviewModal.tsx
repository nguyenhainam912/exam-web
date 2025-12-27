import { Modal, Card, Button, Typography, Space } from 'antd';
import { useState, useCallback, useEffect } from 'react';
import { EyeOutlined, EditOutlined, CheckCircleOutlined, ReloadOutlined } from '@ant-design/icons';
import RegenerateQuestionModal from './RegenerateQuestionModal';

const { Title, Paragraph, Text } = Typography;

interface GeneratedQuestion {
  content: string;
  options: string;
}

interface GeneratePreviewModalProps {
  visible: boolean;
  data: GeneratedQuestion[];
  onClose: () => void;
  onConfirm: (data: any) => void;
  examContext?: {
    subjectId: string;
    gradeLevelId: string;
    examTypeId: string;
    enhancedTopics: string;
  };
}

const GeneratePreviewModal = ({ visible, data, onClose, onConfirm, examContext }: GeneratePreviewModalProps) => {
  const [selectedQuestions, setSelectedQuestions] = useState<number[]>([]);
  const [questionsData, setQuestionsData] = useState<GeneratedQuestion[]>(data);
  const [regenerateModal, setRegenerateModal] = useState<{
    visible: boolean;
    questionIndex: number;
    question: GeneratedQuestion | null;
  }>({
    visible: false,
    questionIndex: -1,
    question: null
  });

  // Update questionsData when data prop changes
  useEffect(() => {
    console.log('=== GeneratePreviewModal - Data received ===');
    console.log('Raw data:', data);
    console.log('Data length:', data?.length);
    
    if (data && data.length > 0) {
      console.log('First item:', data[0]);
      data.forEach((item, idx) => {
        console.log(`Item ${idx}:`, {
          content: item.content,
          options: item.options,
          contentLength: item.content?.length,
          optionsLength: item.options?.length
        });
      });
    }
    
    setQuestionsData(data);
  }, [data]);

  const safeData = Array.isArray(questionsData) ? questionsData : [];

  // Escape HTML để hiển thị LaTeX an toàn
  const escapeHtml = useCallback((text: string): string => {
    if (!text) return '';
    
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }, []);

  // Parse answers from string to array of 4 options
  const parseAnswers = useCallback((answersString: string): string[] => {
    console.log('=== parseAnswers ===');
    console.log('Input:', answersString);
    console.log('Type:', typeof answersString);
    console.log('Length:', answersString?.length);
    
    if (!answersString || typeof answersString !== 'string') {
      console.log('Invalid input, returning empty array');
      return ['', '', '', ''];
    }
    
    // Tách các đáp án theo dòng
    const lines = answersString
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);
    
    console.log('Lines after split:', lines);
    console.log('Lines count:', lines.length);
    
    // Nếu có đúng 4 dòng, trả về trực tiếp
    if (lines.length === 4) {
      console.log('Returning 4 lines directly');
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
    
    console.log('Options with A.B.C.D format:', options);
    
    // Nếu không parse được, trả về lines gốc
    if (options.every(opt => !opt)) {
      console.log('No format matched, returning original lines padded to 4');
      return lines.concat(['', '', '', '']).slice(0, 4);
    }
    
    return options;
  }, []);

  // Extract question content (remove number prefix)
  const parseQuestion = useCallback((questionString: string): string => {
    console.log('=== parseQuestion ===');
    console.log('Input:', questionString);
    
    if (!questionString || typeof questionString !== 'string') {
      console.log('Invalid input');
      return '';
    }
    
    // Remove number prefix like "Câu 81: " or "1. "
    const result = questionString.replace(/^(\d+\.|Câu \d+:)\s*/, '').trim();
    console.log('Output:', result);
    return result;
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
    console.log('=== parseQuestionForDisplay ===');
    console.log('questionString:', questionString);
    console.log('answersString:', answersString);
    
    const questionContent = parseQuestion(questionString);
    const options = parseAnswers(answersString);
    const correctAnswer = parseCorrectAnswer(answersString);
    
    console.log('Result:', { questionContent, options, correctAnswer });
    
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

  const handleRegenerateQuestion = (index: number) => {
    console.log('Regenerating question at index:', index);
    console.log('Question data:', safeData[index]);
    
    setRegenerateModal({
      visible: true,
      questionIndex: index,
      question: safeData[index]
    });
  };

  const handleConfirmRegenerate = (newQuestion: GeneratedQuestion) => {
    console.log('Confirming regenerated question:', newQuestion);
    
    const updatedQuestions = [...questionsData];
    updatedQuestions[regenerateModal.questionIndex] = newQuestion;
    
    console.log('Updated questions:', updatedQuestions);
    
    setQuestionsData(updatedQuestions);
    setRegenerateModal({ visible: false, questionIndex: -1, question: null });
  };

  const renderQuestion = (item: GeneratedQuestion, index: number) => {
    console.log(`=== Rendering question ${index + 1} ===`);
    console.log('Item:', item);
    
    if (!item || !item.content) {
      console.error(`Invalid item at index ${index}:`, item);
      return null;
    }
    
    const { questionContent, options } = parseQuestionForDisplay(item.content, item.options);
    const isSelected = selectedQuestions.includes(index);

    console.log('Rendered data:', { questionContent, options });

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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Title level={5} style={{ marginBottom: 8, color: '#1890ff' }}>
                Câu {index + 1}
                {isSelected && <CheckCircleOutlined style={{ color: '#52c41a', marginLeft: 8 }} />}
              </Title>
              <Button
                type="text"
                icon={<ReloadOutlined />}
                onClick={(e) => {
                  e.stopPropagation();
                  handleRegenerateQuestion(index);
                }}
                title="Tạo lại câu hỏi"
                style={{ color: '#7c3aed' }}
              />
            </div>
            
            <Paragraph style={{ marginBottom: 12 }}>
              <Text strong>Câu hỏi:</Text>
              <br />
              <span>{questionContent}</span>
            </Paragraph>
            
            <div style={{ marginBottom: 12 }}>
              <Text strong>Các lựa chọn:</Text>
              {options.map((option, optIndex) => {
                if (!option || !option.trim()) {
                  console.log(`Empty option at index ${optIndex}`);
                  return null;
                }
                const letter = String.fromCharCode(65 + optIndex);
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
                      {letter}. {option}
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
    <>
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

      {examContext && (
        <RegenerateQuestionModal
          visible={regenerateModal.visible}
          onClose={() => setRegenerateModal({ visible: false, questionIndex: -1, question: null })}
          onConfirm={handleConfirmRegenerate}
          currentQuestion={regenerateModal.question!}
          examContext={examContext}
        />
      )}
    </>
  );
};

export default GeneratePreviewModal;