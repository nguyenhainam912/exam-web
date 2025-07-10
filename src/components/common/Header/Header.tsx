
import { Layout, theme } from 'antd';
import { Link } from 'react-router-dom';
import Actions from './Actions/Actions';

const { Header, } = Layout;



const HeaderComponent = ({children} : any) => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  return (
    <Header
      style={{
        zIndex: 999,
        top: 0,
        left: 0,
        right: 0,
        padding: '0 36px', 
        background: colorBgContainer,
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        height: 56, 
        position: "fixed",
        boxShadow: 'rgba(0, 21, 41, 0.08) 0px 1px 4px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', minWidth: '300px' }}>
        <Link to='/' style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        <img
          src="/_logo2.png"
          alt="Logo"
          style={{ width: 36, height: 36, marginRight: 16 }} 
        />
        </Link>
        <Link to='/' style={{color: '#1890ff', fontSize: 20, fontWeight: '600' }}>Hệ thống quản lý đề thi</Link>
      </div>
      <Actions />
    </Header>
  );
};

export default HeaderComponent;