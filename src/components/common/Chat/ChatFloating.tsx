import React, { useEffect, useRef, useState } from 'react';
import { Button, Input, List, Avatar, message as antdMessage } from 'antd';
import { SendOutlined, CommentOutlined, CloseOutlined } from '@ant-design/icons';
import axiosInstance from '@/utils/axiosInstance';
import { useAppStore } from '@/stores/appStore';

type Msg = { from: 'user' | 'ai'; text: string };

export default function ChatFloating() {
  const { currentUser } = useAppStore(); // chỉ lấy id từ store (không dùng fallback)
  const [visible, setVisible] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const listRef = useRef<HTMLDivElement | null>(null);

  const N8N_WEBHOOK = (import.meta.env as any).VITE_N8N_WEBHOOK || '/api/n8n-chat-webhook';

  const BUTTON_SIZE = 64;
  const MARGIN = 24;
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const draggingRef = useRef<{ startX: number; startY: number; origX: number; origY: number } | null>(null);
  const BUTTON_BG = '#722ed1';

  useEffect(() => {
    const initX = window.innerWidth - MARGIN - BUTTON_SIZE;
    const initY = window.innerHeight - MARGIN - BUTTON_SIZE;
    setPos({ x: initX, y: initY });
    const onResize = () => {
      setPos(p => ({
        x: Math.min(p.x, Math.max(8, window.innerWidth - BUTTON_SIZE - 8)),
        y: Math.min(p.y, Math.max(8, window.innerHeight - BUTTON_SIZE - 8)),
      }));
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const getSessionId = (): string | null => {
    const id = currentUser?.id ?? currentUser?.userId ?? currentUser?._id ?? null;
    if (!id) console.warn('ChatFloating: currentUser id not found in store');
    return id ? String(id) : null;
  };

  const open = () => {
    setVisible(true);
    setTimeout(() => scrollToBottom(), 80);
  };
  const close = () => setVisible(false);

  const scrollToBottom = () => {
    setTimeout(() => {
      if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
    }, 50);
  };

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    const userMsg: Msg = { from: 'user', text: trimmed };
    setMessages(m => [...m, userMsg]);
    setInput('');
    setLoading(true);
    scrollToBottom();

    try {
      const sessionId = getSessionId();
      const payload = { sessionId, chatInput: trimmed };
      const res = await axiosInstance.post(N8N_WEBHOOK, payload, {
        headers: { 'Content-Type': 'application/json' },
      });

      const data = res?.data;
      // support n8n response shape: { output: "..." }
      const reply =
        data?.output ??
        data?.reply ??
        data?.message ??
        (typeof data === 'string' ? data : JSON.stringify(data ?? ''));
      setMessages(m => [...m, { from: 'ai', text: reply }]);
    } catch (err: any) {
      const status = err?.response?.status;
      const text = err?.response?.data ?? err?.message ?? 'Lỗi';
      antdMessage.error('Lỗi chat: ' + (status ?? '') );
      setMessages(m => [...m, { from: 'ai', text: 'Không thể kết nối tới n8n' }]);
    } finally {
      setLoading(false);
      scrollToBottom();
    }
  };

  // Drag handlers
  const onMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    draggingRef.current = { startX: e.clientX, startY: e.clientY, origX: pos.x, origY: pos.y };
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };
  const onMouseMove = (ev: MouseEvent) => {
    if (!draggingRef.current) return;
    const dx = ev.clientX - draggingRef.current.startX;
    const dy = ev.clientY - draggingRef.current.startY;
    const nextX = Math.min(Math.max(8, draggingRef.current.origX + dx), window.innerWidth - BUTTON_SIZE - 8);
    const nextY = Math.min(Math.max(8, draggingRef.current.origY + dy), window.innerHeight - BUTTON_SIZE - 8);
    setPos({ x: nextX, y: nextY });
  };
  const onMouseUp = () => {
    draggingRef.current = null;
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  };
  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    draggingRef.current = { startX: t.clientX, startY: t.clientY, origX: pos.x, origY: pos.y };
    document.addEventListener('touchmove', onTouchMove, { passive: false });
    document.addEventListener('touchend', onTouchEnd);
  };
  const onTouchMove = (ev: TouchEvent) => {
    ev.preventDefault();
    if (!draggingRef.current) return;
    const t = ev.touches[0];
    const dx = t.clientX - draggingRef.current.startX;
    const dy = t.clientY - draggingRef.current.startY;
    const nextX = Math.min(Math.max(8, draggingRef.current.origX + dx), window.innerWidth - BUTTON_SIZE - 8);
    const nextY = Math.min(Math.max(8, draggingRef.current.origY + dy), window.innerHeight - BUTTON_SIZE - 8);
    setPos({ x: nextX, y: nextY });
  };
  const onTouchEnd = () => {
    draggingRef.current = null;
    document.removeEventListener('touchmove', onTouchMove);
    document.removeEventListener('touchend', onTouchEnd);
  };

  return (
    <>
      {/* typing dots animation styles */}
      <style>{`
        .typing {
          display: inline-flex;
          align-items: center;
          padding: 6px 10px;
          border-radius: 12px;
          background: #f5f5f5;
        }
        .typing .dot {
          width: 6px;
          height: 6px;
          margin: 0 4px;
          border-radius: 50%;
          background: #a3a0ff;
          animation: jump 1s infinite;
        }
        .typing .dot:nth-child(2) { animation-delay: 0.16s; }
        .typing .dot:nth-child(3) { animation-delay: 0.32s; }
        @keyframes jump {
          0% { transform: translateY(0); opacity: 0.4; }
          30% { transform: translateY(-6px); opacity: 1; }
          60% { transform: translateY(0); opacity: 0.6; }
          100% { transform: translateY(0); opacity: 0.4; }
        }
      `}</style>

      <div
        style={{
          position: 'fixed',
          left: pos.x,
          top: pos.y,
          zIndex: 1100,
          width: BUTTON_SIZE,
          height: BUTTON_SIZE,
          borderRadius: BUTTON_SIZE / 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 8px 20px rgba(0,0,0,0.18)',
          background: BUTTON_BG,
          cursor: 'grab',
          userSelect: 'none'
        }}
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
        onDoubleClick={open}
        title="Kéo để di chuyển, nhấp đôi để mở"
      >
        <Button
          type="link"
          onClick={open}
          style={{
            width: BUTTON_SIZE,
            height: BUTTON_SIZE,
            borderRadius: '50%',
            color: '#fff',
            padding: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <CommentOutlined style={{ fontSize: 28, color: '#fff' }} />
        </Button>
      </div>

      {visible && (
        <div
          style={{
            position: 'fixed',
            right: 24,
            bottom: 24,
            zIndex: 1200,
            width: 400,
            height: '60vh',
            borderRadius: 8,
            boxShadow: '0 12px 36px rgba(0,0,0,0.18)',
            background: '#fff',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}
        >
          <div style={{ height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 12px', borderBottom: '1px solid #f0f0f0' }}>
            <div style={{ fontWeight: 600 }}>Chat AI</div>
            <div style={{ display: 'flex', gap: 8 }}>
              <Button type="text" icon={<CloseOutlined />} onClick={close} />
            </div>
          </div>

          <div ref={listRef} style={{ flex: 1, overflow: 'auto', padding: 12 }}>
            <List
              dataSource={messages}
              renderItem={(item) => (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-end',
                    justifyContent: item.from === 'user' ? 'flex-end' : 'flex-start',
                    marginBottom: 10
                  }}
                >
                  {item.from === 'ai' && (
                    <div style={{ marginRight: 8 }}>
                      <Avatar size="small" style={{ background: '#efe7ff', color: '#5b21b6' }}>AI</Avatar>
                    </div>
                  )}

                  <div
                    style={{
                      background: item.from === 'user' ? '#5b21b6' : '#f5f5f5',
                      color: item.from === 'user' ? '#fff' : '#000',
                      padding: '8px 12px',
                      borderRadius: 12,
                      maxWidth: '75%',
                      wordBreak: 'break-word',
                      textAlign: item.from === 'user' ? 'right' : 'left',
                      boxShadow: item.from === 'user' ? '0 2px 8px rgba(0,0,0,0.08)' : 'none'
                    }}
                  >
                    {item.text}
                  </div>

                  {item.from === 'user' && (
                    <div style={{ marginLeft: 8 }}>
                      <Avatar size="small" style={{ background: '#5b21b6', color: '#fff' }}>U</Avatar>
                    </div>
                  )}
                </div>
              )}
            />
            {/* typing indicator (AI, left) */}
            {loading && (
              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-start', marginBottom: 10 }}>
                <div style={{ marginRight: 8 }}>
                  <Avatar size="small" style={{ background: '#efe7ff', color: '#5b21b6' }}>AI</Avatar>
                </div>
                <div className="typing" aria-hidden>
                  <div className="dot" />
                  <div className="dot" />
                  <div className="dot" />
                </div>
              </div>
            )}
          </div>

          <div style={{ padding: 12, borderTop: '1px solid #f0f0f0', display: 'flex', gap: 8 }}>
            <Input.TextArea
              value={input}
              onChange={e => setInput(e.target.value)}
              rows={2}
              onPressEnter={(e) => {
                if (!e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              placeholder="Nhập câu hỏi..."
              style={{ flex: 1 }}
            />
            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
              <Button type="primary" icon={<SendOutlined />} onClick={sendMessage} loading={false} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}