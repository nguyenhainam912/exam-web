import { Space } from 'antd';
import React from 'react';
import Avatar from './AvatarDropdown';
import NoticeIconView from './NoticeIconView';

const GlobalHeaderRight: React.FC = () => {
  return (
    <Space >
      {/* <ActionRole /> */}
      <NoticeIconView />
      <Avatar menu />
    </Space>
  );
};

export default GlobalHeaderRight;
