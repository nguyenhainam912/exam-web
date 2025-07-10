import { useAppStore } from '@/stores/appStore';
import { Col, Descriptions, Row, Tag } from 'antd';

const Profile = () => {
  const { currentUser } = useAppStore();
  const role = localStorage.getItem('vaiTro')
  return (
    <>
      <Row>
        <Col span={24}>
          <Descriptions column={3}>
            <Descriptions.Item label="Tên người dùng" span={1}>
              {currentUser?.name}
            </Descriptions.Item>
            <Descriptions.Item label="Tên đăng nhập" span={1}>
              {currentUser?.loginName}
            </Descriptions.Item>
            <Descriptions.Item label="Email" span={1}>
              {currentUser?.email}
            </Descriptions.Item>
            <Descriptions.Item label='Trạng thái' span={1}>
              <Tag color={currentUser?.status === 'ACTIVE' ? 'green' : 'red'}>
                {currentUser?.status === 'ACTIVE' ? "Hoạt động" : "Dừng hoạt động"}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label='Vai trò' span={1}>
              {role}
            </Descriptions.Item>
          </Descriptions>
        </Col>
      </Row>
      {/* <div className={styles.right}>
        <AvatarView avatar={getAvatarURL()} />
      </div> */}
    </>
  );
};

export default Profile;