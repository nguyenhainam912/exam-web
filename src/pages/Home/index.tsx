import { Card, Col, Row, Typography } from 'antd';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';

const Home = () => {
  const navigate = useNavigate()
  const vaiTro = localStorage.getItem('vaiTro');
  useEffect(() => {
    if (vaiTro){
      if (vaiTro === 'Admin' || vaiTro === 'SuperAdmin') {

      }else {
        navigate('/')
      }
    }

  },[vaiTro]);
  return (
    <Card style={{height: 'calc(100vh - 170px)'}}>
        <div style={{ height: 'calc(100vh - 170px)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <img alt="logo" style={{height: '44px',marginRight: '16px', verticalAlign: 'top'}} src="/_logo2.png" />
          <Typography.Title level={1} style={{ margin: 0 }}>
            Hệ thống quản lý đề thi
          </Typography.Title>
        </div>
    </Card>
  );
};

export default Home;
