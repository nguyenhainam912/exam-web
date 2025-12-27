import { Modal, Button, Card, Radio, message, Spin, Space, Divider } from 'antd';
import { useState } from 'react';
import { ReloadOutlined, CheckOutlined } from '@ant-design/icons';
import { generateExamWithAI } from '@/services/exam/exam';

interface RegenerateQuestionModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (newQuestion: any) => void;
  currentQuestion: {
    content: string;
    options: string;
  };
  examContext: {
    subjectId: string;
    gradeLevelId: string;
    examTypeId: string;
    enhancedTopics: string;
  };
}

const RegenerateQuestionModal = ({
  visible,
  onClose,
  onConfirm,
  currentQuestion,
  examContext
}: RegenerateQuestionModalProps) => {
  const [loading, setLoading] = useState(false);
  const [newQuestion, setNewQuestion] = useState<any>(null);
  const [selectedVersion, setSelectedVersion] = useState<'old' | 'new'>('new');

  const parseOptions = (optionsString: string): string[] => {
    if (!optionsString) return ['', '', '', ''];
    const lines = optionsString.split('\n').map(line => line.trim()).filter(line => line);
    if (lines.length === 4) return lines;
    
    const options = ['', '', '', ''];
    lines.forEach(line => {
      const match = line.match(/^([A-D])\.\s*(.+)$/);
      if (match) {
        const index = match[1].charCodeAt(0) - 65;
        if (index >= 0 && index < 4) {
          options[index] = match[2].trim();
        }
      }
    });
    
    if (options.every(opt => !opt)) {
      return lines.concat(['', '', '', '']).slice(0, 4);
    }
    return options;
  };

  const handleRegenerate = async () => {
    try {
      setLoading(true);

      const response = await generateExamWithAI({
        subjectId: examContext.subjectId,
        gradeLevelId: examContext.gradeLevelId,
        examTypeId: examContext.examTypeId,
        numberOfQuestions: 1,
        topics: examContext.enhancedTopics,
      });

      // Parse response
      let generatedQuestions = [];
      if (response?.data?.success && response?.data?.data) {
        generatedQuestions = response.data.data;
      } else if (response?.success && response?.data) {
        generatedQuestions = response.data;
      } else if (response?.data) {
        generatedQuestions = response.data;
      } else if (Array.isArray(response)) {
        generatedQuestions = response;
      }

      if (generatedQuestions.length === 0) {
        message.error('Không thể tạo câu hỏi mới. Vui lòng thử lại!');
        return;
      }

      const generated = generatedQuestions[0];
      setNewQuestion({
        content: generated.content || generated.question || '',
        options: generated.options || generated.answers || ''
      });

      message.success('Đã tạo câu hỏi mới!');
    } catch (error: any) {
      console.error('Regenerate error:', error);
      message.error('Có lỗi xảy ra khi tạo câu hỏi mới!');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = () => {
    if (selectedVersion === 'new' && newQuestion) {
      onConfirm(newQuestion);
    } else {
      onConfirm(currentQuestion);
    }
    handleClose();
  };

  const handleClose = () => {
    setNewQuestion(null);
    setSelectedVersion('new');
    onClose();
  };

  const renderQuestionCard = (question: any, title: string, value: 'old' | 'new') => {
    const options = parseOptions(question.options);
    const isSelected = selectedVersion === value;
    
    return (
      <Card
        size="small"
        hoverable
        onClick={() => setSelectedVersion(value)}
        style={{
          marginBottom: 16,
          border: isSelected ? '2px solid #7c3aed' : '1px solid #d9d9d9',
          backgroundColor: isSelected ? '#f9f5ff' : '#fff',
          cursor: 'pointer',
          transition: 'all 0.3s ease'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
          <Radio
            value={value}
            checked={isSelected}
            style={{ marginRight: 8 }}
          />
          <strong style={{ fontSize: 16, color: isSelected ? '#7c3aed' : '#000' }}>
            {title}
          </strong>
          {isSelected && (
            <CheckOutlined style={{ marginLeft: 'auto', color: '#7c3aed', fontSize: 18 }} />
          )}
        </div>
        
        <Divider style={{ margin: '12px 0' }} />
        
        <div style={{ marginBottom: 12 }}>
          <div style={{ color: '#666', fontSize: 13, marginBottom: 6 }}>Câu hỏi:</div>
          <div 
            style={{ 
              padding: '8px 12px', 
              backgroundColor: '#fafafa', 
              borderRadius: 6,
              fontSize: 14
            }} 
            dangerouslySetInnerHTML={{ __html: question.content }} 
          />
        </div>
        
        <div>
          <div style={{ color: '#666', fontSize: 13, marginBottom: 6 }}>Các lựa chọn:</div>
          <div style={{ backgroundColor: '#fafafa', padding: '8px 12px', borderRadius: 6 }}>
            {options.map((option, idx) => {
              if (!option.trim()) return null;
              const letter = String.fromCharCode(65 + idx);
              return (
                <div 
                  key={idx} 
                  style={{ 
                    marginTop: idx > 0 ? 8 : 0,
                    fontSize: 14,
                    display: 'flex'
                  }}
                >
                  <strong style={{ marginRight: 6, minWidth: 20 }}>{letter}.</strong>
                  <span dangerouslySetInnerHTML={{ __html: option }} />
                </div>
              );
            })}
          </div>
        </div>
      </Card>
    );
  };

  return (
    <Modal
      title={
        <Space>
          <ReloadOutlined style={{ color: '#7c3aed' }} />
          <span>Tạo lại câu hỏi</span>
        </Space>
      }
      open={visible}
      onCancel={handleClose}
      width={900}
      footer={null}
      styles={{
        body: { padding: '24px' }
      }}
    >
      <div style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '16px 20px',
        borderRadius: 8,
        marginBottom: 24,
        color: '#fff'
      }}>
        <div style={{ fontSize: 14, marginBottom: 8, opacity: 0.9 }}>
          💡 Nhấn nút bên dưới để AI tạo một câu hỏi mới thay thế
        </div>
        <Button
          type="default"
          icon={<ReloadOutlined />}
          onClick={handleRegenerate}
          loading={loading}
          size="large"
          style={{ 
            width: '100%',
            height: 48,
            fontWeight: 600,
            fontSize: 16,
            background: 'rgba(255, 255, 255, 0.95)',
            borderColor: '#fff',
            border: '2px dashed rgba(124, 58, 237, 0.5)',
            color: '#7c3aed',
            boxShadow: '0 2px 8px rgba(124, 58, 237, 0.15)'
          }}
        >
          {loading ? 'Đang tạo câu hỏi mới...' : 'Tạo câu hỏi mới với AI'}
        </Button>
      </div>

      {loading && (
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <Spin size="large" />
          <p style={{ marginTop: 16, color: '#666', fontSize: 15 }}>
            AI đang tạo câu hỏi mới cho bạn...
          </p>
        </div>
      )}

      {newQuestion && !loading && (
        <>
          <div style={{ 
            marginBottom: 16, 
            padding: '12px 16px', 
            background: '#f0f9ff',
            border: '1px solid #bae6fd',
            borderRadius: 6,
            fontSize: 14,
            color: '#0369a1'
          }}>
            ✨ Chọn câu hỏi bạn muốn sử dụng (click vào card để chọn)
          </div>
          
          <Radio.Group
            value={selectedVersion}
            onChange={(e) => setSelectedVersion(e.target.value)}
            style={{ width: '100%' }}
          >
            {renderQuestionCard(currentQuestion, 'Câu hỏi gốc', 'old')}
            {renderQuestionCard(newQuestion, 'Câu hỏi mới (AI)', 'new')}
          </Radio.Group>

          <div style={{ 
            display: 'flex', 
            gap: 12, 
            marginTop: 24,
            padding: '16px 0 0',
            borderTop: '1px solid #f0f0f0'
          }}>
            <Button 
              size="large"
              onClick={handleClose}
              style={{ flex: 1, height: 44 }}
            >
              Hủy
            </Button>
            <Button
              type="primary"
              size="large"
              icon={<CheckOutlined />}
              onClick={handleConfirm}
              disabled={!newQuestion && selectedVersion === 'new'}
              style={{ 
                flex: 1, 
                height: 44,
                background: '#7c3aed',
                borderColor: '#7c3aed'
              }}
            >
              Xác nhận sử dụng câu hỏi {selectedVersion === 'new' ? 'mới' : 'gốc'}
            </Button>
          </div>
        </>
      )}
    </Modal>
  );
};

export default RegenerateQuestionModal;