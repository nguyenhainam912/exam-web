import { Pathname } from '@/utils/constants';
import { FileTextOutlined, AppstoreOutlined, SettingOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import { MenuProps } from 'antd/lib';
import React from 'react';
import { Link } from 'react-router-dom';
import './Sider.css';

const SiderMenu = ({ mode = 'horizontal', style }: { mode?: 'horizontal' | 'vertical'; style?: React.CSSProperties }) => {
  const items: MenuProps['items'] = [
    {
      key: '1',
      icon: <FileTextOutlined style={{ fontSize: 15 }} />,
      label: 'Quản lý đề thi',
      children: [
        { key: '1-1', label: <Link to={Pathname.SYSTEM_EXAMS_MANAGEMENT}>Quản lý đề thi</Link> },
        { key: '1-2', label: <Link to={Pathname.SYSTEM_EXAM_CHANGE_REQUEST_MANAGEMENT}>Quản lý yêu cầu thay đổi đề thi</Link> },
      ],
    },
    {
      key: '6',
      icon: <AppstoreOutlined style={{ fontSize: 15 }} />,
      label: 'Danh mục hệ thống',
      children: [
        { key: '6-1', label: <Link to={Pathname.SYSTEM_GRADE_LEVELS_MANAGEMENT}>Quản lý khối lớp</Link> },
        { key: '6-2', label: <Link to={Pathname.SYSTEM_EXAM_TYPES_MANAGEMENT}>Quản lý loại đề</Link> },
        { key: '6-3', label: <Link to={Pathname.SYSTEM_SUBJECTS_MANAGEMENT}>Quản lý môn học</Link> },
      ],
    },
    {
      key: '7',
      icon: <SettingOutlined style={{ fontSize: 15 }} />,
      label: 'Quản lý hệ thống',
      children: [
        { key: '7-2', label: <Link to={Pathname.SYSTEM_ROLE_MANAGEMENT}>Quản lý vai trò</Link> },
        { key: '7-3', label: <Link to={Pathname.SYSTEM_PERMISSION_MANAGEMENT}>Quản lý quyền hạn</Link> },
        { key: '7-4', label: <Link to={Pathname.SYSTEM_USER_MANAGEMENT}>Quản lý người dùng</Link> },
      ],
    },
  ];

  return (
    <Menu
      mode={mode}
      items={items}
      className="custom-sider-menu"
      style={{ ...(style || {}), fontSize: 15, fontWeight: 600 }}
    />
  );
};

export default SiderMenu;
