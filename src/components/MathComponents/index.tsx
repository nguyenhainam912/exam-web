import React, { useState } from 'react';
import { Input, Button } from 'antd';
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';

// Component để render nội dung có công thức toán học
export const MathContent = ({ content, isBlock = false }: { content: string; isBlock?: boolean }) => {
  const renderMathContent = (text: string) => {
    if (!text) return text;
    
    // Nếu không có công thức $...$ thì trả về text thường
    if (!text.includes('$')) {
      return text;
    }
    
    // Tìm và thay thế công thức inline $...$
    const inlineRegex = /\$([^$]+)\$/g;
    // Tìm và thay thế công thức block $$...$$
    const blockRegex = /\$\$([^$]+)\$\$/g;
    
    let parts = [];
    let lastIndex = 0;
    let match;
    
    // Xử lý công thức block trước
    while ((match = blockRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.slice(lastIndex, match.index));
      }
      parts.push(<BlockMath key={match.index} math={match[1]} />);
      lastIndex = match.index + match[0].length;
    }
    
    if (lastIndex < text.length) {
      let remainingText = text.slice(lastIndex);
      let inlineParts = [];
      let inlineLastIndex = 0;
      
      // Xử lý công thức inline trong phần còn lại
      while ((match = inlineRegex.exec(remainingText)) !== null) {
        if (match.index > inlineLastIndex) {
          inlineParts.push(remainingText.slice(inlineLastIndex, match.index));
        }
        inlineParts.push(<InlineMath key={`inline-${match.index}`} math={match[1]} />);
        inlineLastIndex = match.index + match[0].length;
      }
      
      if (inlineLastIndex < remainingText.length) {
        inlineParts.push(remainingText.slice(inlineLastIndex));
      }
      
      parts.push(...inlineParts);
    }
    
    return parts.length > 0 ? parts : text;
  };
  
  return (
    <div style={{ 
      color: '#333', 
      fontSize: '14px', 
      lineHeight: '1.4',
      minHeight: '18px' 
    }}>
      {renderMathContent(content)}
    </div>
  );
};

// Component chỉ hiển thị preview cho textarea/input
export const MathPreviewInput = ({ value, onChange, placeholder, rows, disabled }: any) => {
  const [showInput, setShowInput] = useState(false);
  
  // Nếu đang ở chế độ edit hoặc chưa có giá trị thì hiển thị input
  if (showInput || !value) {
    return (
      <div>
        {rows > 1 ? (
          <Input.TextArea
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            rows={rows}
            disabled={disabled}
            onBlur={() => value && setShowInput(false)}
            autoFocus
          />
        ) : (
          <Input
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            disabled={disabled}
            onBlur={() => value && setShowInput(false)}
            onPressEnter={() => value && setShowInput(false)}
            autoFocus
          />
        )}
        {value && (
          <Button size="small" onClick={() => setShowInput(false)} style={{ marginTop: 4 }}>
            Xong
          </Button>
        )}
      </div>
    );
  }

  return (
    <div 
      style={{ 
        padding: rows > 1 ? 8 : 6, 
        border: '1px solid #d9d9d9', 
        borderRadius: 6, 
        backgroundColor: '#fafafa',
        minHeight: rows ? rows * 24 + 16 : 32,
        cursor: disabled ? 'default' : 'pointer'
      }}
      onClick={() => !disabled && setShowInput(true)}
    >
      <MathContent content={value} />
      {!disabled && (
        <div style={{ fontSize: 11, color: '#999', marginTop: 4 }}>
          Click để chỉnh sửa
        </div>
      )}
    </div>
  );
};