import { useAppStore } from '@/stores/appStore';
import { Col, Descriptions, Row, Tag } from 'antd';

const Profile = () => {
  const { currentUser } = useAppStore();
  
  return (
    <>
      <Row>
        <Col span={24}>
          <Descriptions column={3}>
            <Descriptions.Item label="Tên người dùng" span={1}>
              {currentUser?.fullName}
            </Descriptions.Item>
            <Descriptions.Item label="Email" span={1}>
              {currentUser?.email}
            </Descriptions.Item>
            <Descriptions.Item label="Số điện thoại" span={1}>
              {currentUser?.phoneNumber}
            </Descriptions.Item>
            <Descriptions.Item label="Địa chỉ" span={1}>
              {currentUser?.address?.street}, {currentUser?.address?.city}
            </Descriptions.Item>
          </Descriptions>
        </Col>
      </Row>
    </>
  );
};

export default Profile;