import { useAppStore } from '@/stores/appStore';
import {
  LogoutOutlined,
  ReloadOutlined, UserOutlined
} from '@ant-design/icons';
import { Avatar, Button, Card, Col, Dropdown, message, Modal, Row } from 'antd';
import { MenuProps } from 'rc-menu';
import type { MenuInfo } from 'rc-menu/lib/interface';
import React, { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export type Props = {
  menu?: boolean;
};

const AvatarDropdown = ({ menu }: Props) => {

  const navigate = useNavigate();
  const location = useLocation();

  const { currentUser , setCurrentUser } = useAppStore();
  const [visibleModal, setVisibleModal] = useState<boolean>(false);
  const [newDataRole, setNewDataRole] = useState<any[]>();
  const [role, setRole] = useState<any>()

  useEffect(() => {
    setNewDataRole(currentUser?.roles);
    setRole(currentUser?.role)
  }, [currentUser]);

  const logout = async () => {
    const query = new URLSearchParams(location.search); 
    const redirect = query.get('redirect'); 
    const pathname = location.pathname;

    if (pathname !== '/user/login' && !redirect) {
      navigate(
        {
          pathname: '/user/login',
          search: `?redirect=${encodeURIComponent(pathname)}`, 
        },
        { replace: true } 
      );
    }
  };
  const handleChangeVaiTro = (role: { accessToken: string; name: string }) => {
    localStorage.setItem('vaiTro', role?.name);
    localStorage.setItem('token', role?.accessToken);
    setRole(role)
    setVisibleModal(false)
    navigate('/', {replace: true});
    message.success('Đổi vai trò thành công', 0.3, () => {
      window.location.reload(); 
    });
  };
 

  const onMenuClick = useCallback(
    (event: MenuInfo) => {
      const { key } = event;
      if (key === 'logout' && currentUser) {
        setCurrentUser(undefined);
        localStorage.removeItem('token');
        logout();
        return;
      }
      if (key === 'changeRole' && currentUser) {
        setVisibleModal(true);
        return;
      }
      navigate(`/account`);
    },
    [currentUser],
  );
 
  
  const items: MenuProps["items"] = [
    ...(menu ? 
    [{
      key: "profile",
      label: <> <UserOutlined /> Tài khoản </>
    }] : []),
    ...(menu && currentUser?.roles?.length > 1 && newDataRole ? 
    [{
      key: "changeRole",
      label: <> <ReloadOutlined /> Chọn vai trò </>,
    },] : []),
    ...(menu ? [{ type: "divider" as const }] : []),
    {
      key: "logout",
      label: <> <LogoutOutlined /> Đăng xuất </>,
    },
  ];
  
  return (
    <div style={{ cursor: 'pointer'}}>
      <Dropdown menu={{items, onClick: onMenuClick}} placement="bottomLeft" arrow>
        <span  >
          {/* <Avatar size="small" className={styles.avatar} src={currentUser.AvatarSV} alt="avatar" /> */}
          <Avatar size="small" icon={<UserOutlined />} style={{ marginRight: '5px' }} />
          <span >
            {currentUser?.name
              ? currentUser?.name.charAt(0).toUpperCase() + currentUser?.name.slice(1)
              : currentUser?.name}
          </span>
        </span>
      </Dropdown>
      <Modal
        title="Chọn vai trò"
        open={visibleModal}
        onOk={() => {
          setVisibleModal(false);
        }}
        footer={
          <Button
            type="primary"
            onClick={() => {
              setVisibleModal(false);
            }}
          >
            Ok
          </Button>
        }
        onCancel={() => {
          setVisibleModal(false);
        }}
      >
        {newDataRole?.map(
          (
            item: {
              id: string;
              accessToken: string;
              name: string;
              organization: { tenDonVi: string };
              child: { hoTen: string };
              expireDate: string;
              description: string;
            },
            index: number,
          ) => {
            return (
              <Row justify="center" key={index}>
                <Col>
                  <Card
                    key={index}
                    style={
                      (item?.id === role?.id)
                        ? {
                            width: 300,
                            marginTop: 16,
                            opacity: 0.8,
                            backgroundColor: '#f5f5f5',
                            borderColor: '#d9d9d9',
                            cursor: 'not-allowed',
                          }
                        : { width: 300, marginTop: 16, cursor: 'pointer' }
                    }
                    onClick={() => {
                      if (item?.id !== role?.id) {
                        handleChangeVaiTro(item);
                      }
                    }}
                    hoverable={!(item?.id === role?.id)}
                  >
                    <Card.Meta
                      // avatar={<Avatar src="/logo3.png" />}
                      title={item?.name}
                      // description={val?.description}
                    />
                  </Card>
                </Col>
              </Row>
            );
          },
        )}
      </Modal>
    </div>
  );
};

export default AvatarDropdown;
