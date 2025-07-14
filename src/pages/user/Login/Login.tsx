import Footer from '@/components/common/Footer/Footer';
import { getInfoAdmin, login } from '@/services/admin/admin';
import { useAppStore } from '@/stores/appStore';
import rules from '@/utils/rules';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Card, Col, ConfigProvider, Form, Input, message, Modal, Row, } from 'antd';
import viVN from 'antd/lib/locale/vi_VN';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import './index.css';
import SpinLoading from '@/components/common/SpinLoading/SpinLoading';
import EmailVerificationNotice from '@/components/common/EmailVerificationNotice/EmailVerificationNotice';


const Login = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams();
  
  const [submitting, setSubmitting] = useState(false);
  const [type, setType] = useState<string>('account');
  const [showVerificationNotice, setShowVerificationNotice] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const { currentUser, setCurrentUser } = useAppStore();
  const formRef = useRef<any>(null);
  
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/');
    }
    
    // Hiển thị thông báo nếu người dùng vừa đăng ký thành công
    const fromRegister = searchParams.get('fromRegister');
    if (fromRegister === 'true') {
      message.success('Đăng ký thành công! Vui lòng kiểm tra email để xác minh tài khoản.');
    }
  }, [searchParams]);

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
    } catch (error: any) {
      if (error?.response?.data?.errorCode === 'BAD_REQUEST_EMAIL_NOT_VERIFIED') {
        setUserEmail(values.email || '');
        setShowVerificationNotice(true);
        message.error('Vui lòng xác minh email trước khi đăng nhập');
      } else {
        message.error('Đăng nhập không thành công');
      }
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <div className="login-container">
      <div className="login-content">
        <div className="login-box">
          <div className="login-top">
            <div className="login-header">
              <img alt="logo" className="login-logo" src="/_logo2.png" />
              <h1 className="login-title">Hệ thống quản lý đề thi</h1>
            </div>
            <div style={{paddingTop: '30px'}}>
              <div>Đăng nhập hệ thống</div>
            </div>
          </div>

          <ConfigProvider locale={viVN}>
            <div className="login-main">
              <Form
                ref={formRef}
                initialValues={{ autoLogin: true }}
                onFinish={handleSubmit}
                layout="vertical"
              >
                {showVerificationNotice && (
                  <EmailVerificationNotice 
                    email={userEmail}
                    onVerified={() => setShowVerificationNotice(false)}
                  />
                )}
                {type === 'account' && (
                  <>
                    <Form.Item name="email" rules={[...rules.required]} className="login-form-item" labelCol={{ className: 'login-form-item-label' }}>
                      <Input
                        size="large"
                        prefix={<UserOutlined className="login-prefixIcon" />}
                        placeholder="Tên email"
                        className="login-input"
                      />
                    </Form.Item>
                    <Form.Item name="password" rules={[...rules.required]} className="login-form-item" labelCol={{ className: 'login-form-item-label' }}>
                      <Input.Password
                        size="large"
                        prefix={<LockOutlined className="login-prefixIcon" />}
                        placeholder="Mật khẩu"
                        className="login-input-password"
                      />
                    </Form.Item>
                    <Form.Item className="login-form-item">
                      <Button
                        type="primary"
                        htmlType="submit"
                        loading={submitting}
                        size="large"
                        style={{ width: '100%' }}
                        className="login-btn"
                      >
                        Đăng nhập
                      </Button>
                    </Form.Item>

                    <div style={{ textAlign: 'center', marginTop: 16 }}>
                      <span>Chưa có tài khoản? </span>
                      <Link to="/user/register" style={{ color: '#1890ff' }}>
                        Đăng ký ngay
                      </Link>
                    </div>
                  </>
                )}
              </Form>
            </div>
          </ConfigProvider>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;


