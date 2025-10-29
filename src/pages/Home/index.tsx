import { Card, Col, Row, Typography } from 'antd';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import Dashboard from '../Dashboard/Dashboard';

const Home = () => {
  const navigate = useNavigate()
  const vaiTro = localStorage.getItem('vaiTro');
  
  useEffect(() => {
    if (vaiTro){
      if (vaiTro !== 'Admin' && vaiTro !== 'SuperAdmin') {
        navigate('/')
      }
    }
  },[vaiTro, navigate]);

  return (
    <>
      <Card style={{height: 'auto', marginBottom: '24px'}}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px 0' }}>
          <img alt="logo" style={{height: '44px',marginRight: '16px', verticalAlign: 'top'}} src="/_logo2.png" />
          <Typography.Title level={1} style={{ margin: 0 }}>
            Hệ thống quản lý đề thi
          </Typography.Title>
        </div>
      </Card>
      
      {/* Dashboard */}
      <Dashboard />
    </>
  );
};

export default Home;
