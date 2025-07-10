import {
  BellOutlined,
  CheckOutlined,
  DeleteOutlined,
} from '@ant-design/icons';

import { Notification } from '@/services/Notification';
import { getNotification, putNotification, putNotifications } from '@/services/Notification/Notification';
import { useAppStore } from '@/stores/appStore';
import { Avatar, Badge, Button, List, Popover, Space, Tabs, TabsProps } from 'antd';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const NoticeIconView = () => {
  const navigate = useNavigate();
  const { currentUser } = useAppStore()
 
  const [notiData, setNotiData] = useState<any[]>([])
  const [totalNoti, setTotalNoti] = useState<number>(0)
  const [page, setPage] = useState(1)
  const [popoverVisible, setPopoverVisible] = useState(false);
  const notiMenuRef = useRef(null)
  const debounceTimeoutRef = useRef<any>(null)

  const fetchApi = async (page: number) => {
    // if(currentUser) {
    //   const roleId = currentUser?.role?.id
    //   const res = await getNotification({
    //     page: page, 
    //     limit: 10,
    //     cond: roleId
    //   })
    //   const result = res?.data?.data?.items
    //   if(page === 1) {
    //     setNotiData(result)
    //   } else {
    //     setNotiData(prev => [
    //       ...prev, 
    //       ...result
    //     ])
    //   }
    //   setTotalNoti(res?.data?.data?.total)
    // }
  }
  useEffect(() => {
    fetchApi(page)
  }, [page, currentUser])
  const loadmore = useCallback(() => {
    if( notiData?.length < totalNoti && !(totalNoti - notiData?.length < 10) ) {
      setPage(prev => prev + 1)
    }
  }, [notiData, totalNoti])

  const handleScroll = (e: any) => {
    const notiMenu = e.target
    if (notiMenu.scrollTop + notiMenu.clientHeight> notiMenu.scrollHeight -10) {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
      debounceTimeoutRef.current = setTimeout(() => {
        loadmore();
      }, 500);

    }
  };
  useEffect(() => {
    const notiMenu: any = notiMenuRef?.current
    if (popoverVisible){
      notiMenu?.addEventListener("scroll", handleScroll);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      if (notiMenu) {
        notiMenu?.removeEventListener("scroll", handleScroll);
      }
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    }
  }, [notiData, totalNoti, popoverVisible]);
  
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
    const filterNoti = filterUnRead ? (notifications || notiData )?.filter(noti => noti?.status === 0) : (notifications || notiData)
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
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'Bạn có một bình luận mới',
      content: 'Nguyễn Văn A đã bình luận bài viết của bạn.',
      time: '5 phút trước',
      status: 0,
    },
    {
      id: 2,
      title: 'Bài viết của bạn được yêu thích',
      content: 'Trần Thị B đã thích bài viết của bạn.',
      time: '1 giờ trước',
      status: 1,
    },
    {
      id: 3,
      title: 'Cập nhật từ nhóm',
      content: 'Nhóm "React Vietnam" có bài viết mới.',
      time: '2 giờ trước',
      status: 0,
    },
  ]);
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
    <div className='noti_bell'>
      <Popover 
        content={menuHeaderDropdown} 
        placement="bottomRight" 
        trigger="hover"  
        open={popoverVisible}
        onOpenChange={(visible) => setPopoverVisible(visible)}
      >
        <BellOutlined style={{ fontSize: '22px', cursor: 'pointer', display: 'block', lineHeight: '56px', padding: '0 16px 0 16px' }} />
      </Popover>
      {totalNoti > 0 ? <div style={{fontSize: '14px'}} className='noti_count'>{totalNoti > 99 ? "99+" : totalNoti}</div> : ''}
    </div>      
  );
};

export default NoticeIconView;
