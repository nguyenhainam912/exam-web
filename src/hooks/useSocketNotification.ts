import { useEffect, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { message } from 'antd';

interface UseSocketNotificationProps {
  userId?: string;
  onNotification?: (data: any) => void;
}

export const useSocketNotification = ({ userId, onNotification }: UseSocketNotificationProps) => {
  const socketRef = useRef<Socket | null>(null);
  const currentUserIdRef = useRef<string | null>(null);
  const isConnectingRef = useRef(false);
  const connectionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const disconnect = useCallback(() => {
    console.log('Disconnecting socket...');
    if (connectionTimeoutRef.current) {
      clearTimeout(connectionTimeoutRef.current);
      connectionTimeoutRef.current = null;
    }
    
    if (socketRef.current) {
      socketRef.current.removeAllListeners();
      socketRef.current.disconnect();
      socketRef.current = null;
    }
    
    currentUserIdRef.current = null;
    isConnectingRef.current = false;
  }, []);

  const connect = useCallback(() => {
    if (!userId) {
      disconnect();
      return;
    }

    // Nếu đã có socket cho cùng userId và đang connected
    if (currentUserIdRef.current === userId && 
        socketRef.current && 
        socketRef.current.connected) {
      console.log('Socket already connected for userId:', userId);
      return;
    }

    // Nếu đang trong quá trình connect
    if (isConnectingRef.current) {
      console.log('Connection already in progress...');
      return;
    }

    // Disconnect socket cũ
    disconnect();

    isConnectingRef.current = true;
    currentUserIdRef.current = userId;

    const SOCKET_URL = import.meta.env.VITE_API_NOTIFY_URL || "http://localhost:3003";
    
    console.log('Creating new socket connection for userId:', userId);

    // Timeout để tự động hủy connection nếu quá lâu
    connectionTimeoutRef.current = setTimeout(() => {
      console.log('Connection timeout, cleaning up...');
      disconnect();
    }, 10000); // 10s timeout

    try {
      const socket = io(SOCKET_URL, {
        query: { userId },
        reconnection: false, // Tắt auto reconnect
        timeout: 5000,
        forceNew: true,
        autoConnect: true
      });

      socketRef.current = socket;

      socket.on('connect', () => {
        console.log('Socket connected successfully!', socket.id);
        isConnectingRef.current = false;
        if (connectionTimeoutRef.current) {
          clearTimeout(connectionTimeoutRef.current);
          connectionTimeoutRef.current = null;
        }
      });

      socket.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
        isConnectingRef.current = false;
        if (connectionTimeoutRef.current) {
          clearTimeout(connectionTimeoutRef.current);
          connectionTimeoutRef.current = null;
        }
        // Không retry tự động
      });

      socket.on('disconnect', (reason) => {
        console.log('Socket disconnected:', reason);
        isConnectingRef.current = false;
      });

      socket.on('notification', (data: any) => {
        console.log('New notification received:', data);
        if (onNotification) {
          onNotification(data);
        }
        if (data?.title) {
          message.info({ content: data.title, duration: 2 });
        }
      });

    } catch (error) {
      console.error('Error creating socket:', error);
      isConnectingRef.current = false;
      if (connectionTimeoutRef.current) {
        clearTimeout(connectionTimeoutRef.current);
        connectionTimeoutRef.current = null;
      }
    }
  }, [userId, onNotification, disconnect]);

  useEffect(() => {
    connect();
    
    // Cleanup khi component unmount hoặc userId thay đổi
    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  // Cleanup khi component unmount
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return {
    socket: socketRef.current,
    isConnecting: isConnectingRef.current,
    disconnect,
    reconnect: connect
  };
};