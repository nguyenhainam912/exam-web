import {
  BellOutlined,
  CheckOutlined,
} from '@ant-design/icons';

import { getNotification, markSingleNotificationAsRead, markNotificationsAsRead } from '@/services/Notification/Notification';
import { useAppStore } from '@/stores/appStore';
import { useSocketNotification } from '@/hooks/useSocketNotification';
import { Avatar, Badge, Button, List, Popover, Space, Tabs, TabsProps } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const NoticeIconView = () => {
  const navigate = useNavigate();
  const { currentUser } = useAppStore()
 
  const [notiData, setNotiData] = useState<any[]>([])
  const [totalNoti, setTotalNoti] = useState<number>(0)
  const [page, setPage] = useState(1)
  const [popoverVisible, setPopoverVisible] = useState(false);

  useSocketNotification({
    userId: currentUser?.userId,
    onNotification: (data: any) => {
      console.log("Received notification in component:", data);
      // Refresh lại dữ liệu từ API khi có notification mới
      fetchApi(1);
    }
  });

  const fetchApi = async (page: number) => {
    if(currentUser && currentUser.userId) {
      try {
        const res = await getNotification({
          page: page,
          limit: 10,
          cond: { user: currentUser.userId }
        });
        const result = res?.data?.result || [];
        if(page === 1) {
          setNotiData(result);
          // Đếm số notification chưa đọc (isRead === false)
          const unreadCount = result.filter((noti: any) => !noti.isRead).length;
          setTotalNoti(unreadCount);
        } else {
          setNotiData(prev => {
            const updated = [...prev, ...result];
            const unreadCount = updated.filter((noti: any) => !noti.isRead).length;
            setTotalNoti(unreadCount);
            return updated;
          });
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    }
  }

  useEffect(() => {
    fetchApi(page)
  }, [page, currentUser])


  const handlePutNoti = async (noti: any) => {
    try {
      if (noti && !noti.isRead) {
        const res = await markSingleNotificationAsRead(noti?._id);
        if (res) {
          // Cập nhật UI ngay lập tức
          setNotiData(prev =>
            prev.map(item =>
              item._id === noti._id 
                ? { ...item, isRead: true }
                : item
            )
          );
          // Giảm số lượng notification chưa đọc
          setTotalNoti(prev => prev > 0 ? prev - 1 : 0);
          console.log('Đã đánh dấu thông báo là đã đọc');
        }
      }
    } catch (error) {
      console.error('Error updating notification:', error);
    }
  }

  const handleCheckAllNoti = async () => {
    try {
      // Lấy danh sách ID của tất cả notification chưa đọc
      const unreadIds = notiData
        .filter((noti: any) => !noti.isRead)
        .map((noti: any) => noti._id);

      if (unreadIds.length === 0) {
        console.log('Không có notification chưa đọc');
        return;
      }

      // Gọi API mark all as read
      const res = await markNotificationsAsRead(unreadIds);
      if (res) {
        // Cập nhật UI ngay lập tức
        setNotiData(prev =>
          prev.map(item =>
            !item.isRead ? { ...item, isRead: true } : item
          )
        );
        // Reset totalNoti về 0
        setTotalNoti(0);
        console.log('Đã đánh dấu tất cả thông báo là đã đọc');
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  }

  const renderNotiList = (filterUnRead?: boolean) => {
    const filterNoti = filterUnRead 
      ? notiData?.filter((noti: any) => !noti?.isRead) 
      : notiData;
    return (
      <List
        itemLayout="horizontal"
        dataSource={filterNoti}
        renderItem={(item: any) => (
          <List.Item
            style={{
              padding: '12px 16px',
              background: !item.isRead ? '#f0f5ff' : '#fff',
              borderBottom: '1px solid #f0f0f0',
              transition: 'background 0.3s',
              cursor: 'pointer',
            }}
            onMouseEnter={(e: React.MouseEvent<HTMLDivElement>) => (e.currentTarget.style.background = !item.isRead ? '#d2e1ff' : '#e0e0e0')}
            onMouseLeave={(e: React.MouseEvent<HTMLDivElement>) => (e.currentTarget.style.background = !item.isRead ? '#f0f5ff' : '#fff')}
            onClick={() => handlePutNoti(item)}
            actions={[
              !item.isRead ? (
                <Button
                  type="link"
                  size="small"
                  icon={<CheckOutlined />}
                  onClick={(e: React.MouseEvent<HTMLElement>) => {
                    e.stopPropagation();
                    handlePutNoti(item);
                  }}
                  style={{ color: '#8B5CF6' }}
                />
              ) : null,
            ]}
          >
            <List.Item.Meta
              avatar={
                <Badge dot={!item.isRead} color="#8B5CF6">
                  <Avatar
                    icon={<BellOutlined />}
                    style={{ backgroundColor: '#e6f7ff', color: '#8B5CF6' }}
                  />
                </Badge>
              }
              title={<span style={{ fontWeight: !item.isRead ? 'bold' : 'normal' }}>{item.subject}</span>}
              description={
                <Space direction="vertical" size={2}>
                  <span style={{ color: '#595959' }}>{item.content}</span>
                  <span style={{ color: '#8c8c8c', fontSize: 12 }}>
                    {new Date(item.createdAt).toLocaleString('vi-VN')}
                  </span>
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
      label: `Chưa đọc (${notiData.filter(n => !n.isRead).length})`,
      children: renderNotiList(true),
    },
  ];

  const rightNoti = {
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
          background: '#8B5CF6',
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