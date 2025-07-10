import Footer from '@/components/common/Footer/Footer';
import { getInfoAdmin, login } from '@/services/admin/admin';
import { useAppStore } from '@/stores/appStore';
import rules from '@/utils/rules';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Card, Col, ConfigProvider, Form, Input, message, Modal, Row, } from 'antd';
import viVN from 'antd/lib/locale/vi_VN';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './index.css';
import SpinLoading from '@/components/common/SpinLoading/SpinLoading';


const Login = () => {
  const navigate = useNavigate()
  
  const [submitting, setSubmitting] = useState(false);
  const [type, setType] = useState<string>('account');
  const { currentUser, setCurrentUser } = useAppStore();
  const formRef = useRef<any>(null);
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/');
    }
  }, []);

  const handleSubmit = async (values: API.LoginParams) => {
    setSubmitting(true);
    try {
      const response: any = await login({ ...values });
      if (response.statusCode === 201 ) {
        
        if (response?.data?.accessToken === '') {
          message.error('Tài khoản của bạn đã hết hạn. Vui lòng gia hạn để sử dụng chức năng!');
          return;
        } else if (response?.data?.accessToken) {
          localStorage.setItem('token', response?.data?.accessToken);
          const info = await getInfoAdmin();
          setCurrentUser(info?.data)
          message.success('Đăng nhập thành công');
          navigate('/');
        }
      }
    } catch (error) {
      message.error('Đăng nhập không thành công');
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <div className='container'>
      <div className='content'>
        <div className='top'>
          <div className='header' style={{marginBottom: '30px'}}>
              <img alt="logo" className='logo' src="/_logo2.png" />
              <h1 style={{ color: '#000000a6' }}>Hệ thống quản lý đề thi</h1>
          </div>
          <div style={{marginBottom: '15px'}}>
            <span>Đăng nhập hệ thống</span>
          </div>
        </div>
        <ConfigProvider locale={viVN}>
          <div className='main'>
            <Form
              ref={formRef} 
              initialValues={{ autoLogin: true }}
              onFinish={handleSubmit}
              layout="vertical" 
            >
              {type === 'account' && (
                <div >
                  <Form.Item
                    name="email"
                    rules={[...rules.required]}
                  >
                    <Input
                      size="large"
                      prefix={<UserOutlined className='prefixIcon' />}
                      placeholder="Tên email"
                    />
                  </Form.Item>
                  <Form.Item
                    name="password"
                    rules={[...rules.required]}
                  >
                    <Input.Password
                      size="large"
                      prefix={<LockOutlined className='prefixIcon' />}
                      placeholder="Mật khẩu"
                    />
                  </Form.Item>
                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      loading={submitting}
                      size="large"
                      style={{ width: '100%' }}
                    >
                      Đăng nhập
                    </Button>
                  </Form.Item>
                </div>
              )}
            </Form>
          </div>
        </ConfigProvider>
      </div>
      <Footer />
    </div>
  );
};

export default Login;


