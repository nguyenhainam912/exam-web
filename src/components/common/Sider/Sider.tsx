
import { Pathname } from '@/utils/constants';
import { HEADER_HEIGHT } from '@/utils/spacing';
import { AppstoreOutlined, EnvironmentOutlined, FolderOpenOutlined, HomeOutlined, MenuFoldOutlined, MenuUnfoldOutlined, SnippetsOutlined, TeamOutlined } from '@ant-design/icons';
import { Layout, Menu, theme } from 'antd';
import { MenuProps } from 'antd/lib';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
const { Sider } = Layout;

const SiderComponent = ({children} : any) => {
  
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKey, setSelectedKey] = useState<any[]>(() => {
    const pathname = location.pathname
    if(pathname === '/') return []
    const savedKey = localStorage.getItem("currentKey")
    return savedKey? [savedKey] : []
  });
  const [openKeys, setOpenKeys] = useState<any[]>(() => {
    const savedOpenKeys = JSON.parse(localStorage.getItem("openKeys") || "[]")
    return savedOpenKeys 
  });

  const items: MenuProps['items'] = [
    {
      key: `1`,
      icon: <FolderOpenOutlined />,
      label: 'Quản lý đề thi',
      children: [
        {
          key: '1-1',
          label: <Link to={Pathname.SYSTEM_EXAMS_MANAGEMENT}>Quản lý đề thi</Link>
        },
      ] 
    },
    {
      key: `6`,
      icon: <FolderOpenOutlined />,
      label: 'Danh mục hệ thống',
      children: [
        {
          key: '6-1',
          label: <Link to={Pathname.SYSTEM_GRADE_LEVELS_MANAGEMENT}>Quản lý khối lớp</Link>
        },
        {
          key: '6-2',
          label: <Link to={Pathname.SYSTEM_EXAM_TYPES_MANAGEMENT}>Quản lý loại đề</Link>
        },
        {
          key: '6-3',
          label: <Link to={Pathname.SYSTEM_SUBJECTS_MANAGEMENT}>Quản lý môn học</Link>
        },
      ] 
    },
    {
      key: `7`,
      icon: <TeamOutlined />,
      label: 'Quản lý hệ thống',
      children: [
        {
          key: '7-1',
          label: <Link to={Pathname.SYSTEM_ACCOUNT_MANAGEMENT}>Quản lý tài khoản</Link>
        },
        {
          key: '7-2',
          label: <Link to={Pathname.SYSTEM_ROLE_MANAGEMENT}>Quản lý vai trò</Link>
        },
        {
          key: '7-3',
          label: <Link to={Pathname.SYSTEM_PERMISSION_MANAGEMENT}>Quản lý quyền hạn</Link>
        },
        
      ] 
    },
  ]
  
  const pathToKeyMap: {[key: string]: string} = {
    [Pathname.SYSTEM_EXAMS_MANAGEMENT]: '1-1',

    [Pathname.SYSTEM_GRADE_LEVELS_MANAGEMENT]: '6-1',
    [Pathname.SYSTEM_EXAM_TYPES_MANAGEMENT]: '6-2',
    [Pathname.SYSTEM_SUBJECTS_MANAGEMENT]: '6-3',

    [Pathname.SYSTEM_ACCOUNT_MANAGEMENT]: '7-1',
    [Pathname.SYSTEM_ROLE_MANAGEMENT]: '7-2',
    [Pathname.SYSTEM_PERMISSION_MANAGEMENT]: '7-3',
  };

  
  
  useEffect(() => {
    const pathname = location.pathname
    if (pathname === '/') { 
      setSelectedKey([])
      localStorage.removeItem("currentKey") 
    }
    const matchedKey =  pathToKeyMap[pathname]
    if (matchedKey) {
      setSelectedKey([matchedKey]);
      localStorage.setItem("currentKey", matchedKey);
      if (matchedKey?.includes('-')) {
        const parentKey = matchedKey?.split('-')?.[0]
        if (!openKeys?.includes(parentKey)) {
          const newOpenKeys = [...openKeys, parentKey]
          setOpenKeys(newOpenKeys)
        }
      } 
    }

  }, [location.pathname])
  const onOpenChange = (keys: string[]) => {
    setOpenKeys(keys);
    localStorage.setItem("openKeys", JSON.stringify(keys));
  };
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  return (
      <Sider
        breakpoint="lg"
        onBreakpoint={(broken) => {}}
        collapsedWidth="50"
        collapsible 
        collapsed={collapsed} 
        onCollapse={(value, type) => {
          setCollapsed(value)
        }}
        style={{ 
          position: "sticky",
          zIndex: 998,
          top: `${HEADER_HEIGHT}`,
          left: 0,
          bottom: 0,
          height: `calc(100vh - ${HEADER_HEIGHT})`,
          background: colorBgContainer,
          overflow: "auto",
          insetInlineStart: 0,
          scrollbarWidth: "thin",
          scrollbarGutter: "stable",
        }}
        trigger={
          <div className="sider-trigger-custom">
            {collapsed ? <MenuUnfoldOutlined style={{ color: '#333' }}/> : <MenuFoldOutlined style={{ color: '#333' }}/>}
          </div>
        }
        width={210}
      >
        <Menu 
          mode="inline" 
          items={items} 
          selectedKeys={selectedKey}
          onOpenChange={onOpenChange}
          openKeys={openKeys}
        />
      </Sider>
  );
};

export default SiderComponent;
