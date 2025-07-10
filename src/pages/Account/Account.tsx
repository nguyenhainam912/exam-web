import { Card, Row, Col } from 'antd'; 
import {  useState } from 'react';

import Profile from './Profile/Profile';

const operationTabList = [
  {
    key: 'profile',
    tab: 'Thông tin tài khoản',
  },
];

const Account = () => {
  const [tabKey, setTabKey] = useState('profile');
  
  const onTabChange = (key: string) => {
    setTabKey(key);
  };

  const renderChildrenByTabKey = (currentTabKey: string) => {
    if (currentTabKey === 'profile') {
      return <Profile />;
    }
    if (currentTabKey === 'changePassword') {
      return 'Đổi mật khẩu';
    }
    return null;
  };

  return (
    <Row justify="center">
      <Col span={24}> 
        <Card
          variant="outlined"
          tabList={operationTabList}
          activeTabKey={tabKey}
          onTabChange={onTabChange}
        >
          {renderChildrenByTabKey(tabKey)}
        </Card>
      </Col>
    </Row>
  );
};

export default Account;