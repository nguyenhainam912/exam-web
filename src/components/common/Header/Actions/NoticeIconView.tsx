import {
  BellOutlined,
  CheckOutlined,
  DeleteOutlined,
} from '@ant-design/icons';

import { Notification } from '@/services/Notification';
import { getNotification, putNotification, putNotifications } from '@/services/Notification/Notification';
import { useAppStore } from '@/stores/appStore';
import { Avatar, Badge, Button, List, Popover, Space, Tabs, TabsProps, message } from 'antd';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { io } from "socket.io-client";

const NoticeIconView = () => {
  const navigate = useNavigate();
  const { currentUser } = useAppStore()
 
  const [notiData, setNotiData] = useState<any[]>([])
  const [totalNoti, setTotalNoti] = useState<number>(0)
  const [page, setPage] = useState(1)
  const [popoverVisible, setPopoverVisible] = useState(false);

  // --- SOCKET.IO REALTIME ---
  useEffect(() => {
    if (!currentUser?.userId) return;
    const SOCKET_URL = import.meta.env.VITE_API_NOTIFY_URL || "http://localhost:3002";
    const socket = io(SOCKET_URL, {
      query: { userId: currentUser.userId }
    });
    socket.on("connect", () => {
      console.log("Socket connected!");
    });
    socket.on("notification", (data: any) => {
      // Tránh thêm trùng lặp nếu đã có id
      setNotiData(prev => {
        if (data && data._id && prev.some(n => n._id === data._id)) return prev;
        return [data, ...prev];
      });
      setTotalNoti(prev => prev + 1);
      if (data?.title) {
        message.info({ content: data.title, duration: 2 });
      }
      console.log("New notification:", data);
    });
    return () => {
      socket.disconnect();
    };
  }, [currentUser?.userId]);

  const fetchApi = async (page: number) => {
    if(currentUser && currentUser.userId) {
      const res = await getNotification({
        page: page,
        limit: 10,
        cond: { user: currentUser.userId }
      });
      const result = res?.data?.result || [];
      if(page === 1) {
        setNotiData(result);
      } else {
        setNotiData(prev => [
          ...prev,
          ...result
        ]);
      }
      setTotalNoti(res?.data?.total || 0);
    }
  }
  useEffect(() => {
    fetchApi(page)
  }, [page, currentUser])
  const loadmore = useCallback(() => {
    if( notiData?.length < totalNoti && !(totalNoti - notiData?.length < 10) ) {
      setPage(prev => prev + 1)
    }
  }, [notiData, totalNoti])

  const handlePutNoti = async (noti: Notification.NotiRecord) => {
    if (noti && noti.status === 0) {
      const res = await putNotification(noti?.notiId, {status: 1})
      if(res?.status === 200){
        setPage(1)
      }
    }
    const notiType: string = noti?.info?.type
    switch (notiType) {
      case "HOP_DONG":
        navigate('/kho/quanlykho')
        break;
      default:
    }
  }
  const handleCheckAllNoti = async () => {
    // const res = await putNotifications({status: 1})
    // if(res?.status === 200){
    //   setPage(1)
    // }
  }

  const renderNotiList = (filterUnRead?: boolean) => {
    const filterNoti = filterUnRead ? notiData?.filter(noti => noti?.status === 0) : notiData;
    return (
      <List
        itemLayout="horizontal"
        dataSource={filterNoti}
        renderItem={(item) => (
          <List.Item
            style={{
              padding: '12px 16px',
              background: item.status === 0 ? '#f0f5ff' : '#fff',
              borderBottom: '1px solid #f0f0f0',
              transition: 'background 0.3s',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = item.status === 0 ? '#d2e1ff' : '#e0e0e0')}
            onMouseLeave={(e) => (e.currentTarget.style.background = item.status === 0 ? '#f0f5ff' : '#fff')}
            actions={[
              item.status === 0 ? (
                <Button
                  type="link"
                  size="small"
                  icon={<CheckOutlined />}
                  // onClick={() => markAsRead(item.id)}
                  style={{ color: '#1890ff' }}
                />
              ) : null,
              <Button
                type="link"
                size="small"
                icon={<DeleteOutlined />}
                // onClick={() => deleteNotification(item.id)}
                style={{ color: '#ff4d4f' }}
              />,
            ]}
          >
            <List.Item.Meta
              avatar={
                <Badge dot={item.status === 0} color="#1890ff">
                  <Avatar
                    icon={<BellOutlined />}
                    style={{ backgroundColor: '#e6f7ff', color: '#1890ff' }}
                  />
                </Badge>
              }
              title={<span style={{ fontWeight: item.status === 0 ? 'bold' : 'normal' }}>{item.title}</span>}
              description={
                <Space direction="vertical" size={2}>
                  <span style={{ color: '#595959' }}>{item.content}</span>
                  <span style={{ color: '#8c8c8c', fontSize: 12 }}>{item.time}</span>
                </Space>
              }
            />
          </List.Item>
        )}
        locale={{ emptyText: 'Không có thông báo nào' }}
      />
      
    )
  }

  const notiItems: TabsProps['items'] = [
    {
      key: '1',
      label: 'Tất cả',
      children: renderNotiList(),
    },
    {
      key: '2',
      label: 'Chưa đọc',
      children: renderNotiList(true),

    },
    
  ];

  const rightNoti =  {
    ['right']: 
      <img 
        src='/double-check.svg' 
        title='Đánh dấu là đã đọc' 
        alt="Đánh dấu là đã đọc" 
        style={{ fontSize: '24px', cursor: 'pointer', display: 'block', lineHeight: '48px', padding: '10px' }}
        onClick={handleCheckAllNoti}
      /> ,
  }
  const menuHeaderDropdown = (
    <Tabs 
      defaultActiveKey="1" 
      items={notiItems} 
      style={{ minWidth: '400px' }}
      tabBarStyle={{ padding: '0 20px' }} 
      tabBarExtraContent={rightNoti}
    />
  );
  return (
    <div className='noti_bell' style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
      <Popover 
        content={menuHeaderDropdown} 
        placement="bottomRight" 
        trigger="hover"  
        open={popoverVisible}
        onOpenChange={(visible) => setPopoverVisible(visible)}
      >
        <BellOutlined style={{ fontSize: 22, cursor: 'pointer', padding: '0 16px', verticalAlign: 'middle' }} />
      </Popover>
      {totalNoti > 0 && (
        <div style={{
          position: 'absolute',
          top: -4,
          right: 2,
          background: '#ff4d4f',
          color: '#fff',
          borderRadius: '50%',
          width: 22,
          height: 22,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 13,
          fontWeight: 600,
          zIndex: 2,
          boxShadow: '0 0 2px #fff',
          border: '2px solid #fff'
        }}>
          {totalNoti > 99 ? '99+' : totalNoti}
        </div>
      )}
    </div>
  );
};

export default NoticeIconView;
