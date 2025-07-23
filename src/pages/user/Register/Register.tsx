import Footer from '@/components/common/Footer/Footer';
import { register, sendVerifyEmail } from '@/services/user/user';
import rules from '@/utils/rules';
import { LockOutlined, UserOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import { Button, Card, Col, ConfigProvider, Form, Input, message, Row } from 'antd';
import viVN from 'antd/lib/locale/vi_VN';
import { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './index.css';

const Register = () => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const formRef = useRef<any>(null);

  const handleSubmit = async (values: any) => {
    setSubmitting(true);
    try {
      const response: any = await register({
        email: values?.email,
        password: values?.password,
      });
      
      if (response.statusCode === 201) {
        // Gọi API gửi email xác minh
        try {
          await sendVerifyEmail({
            email: values.email,
            verifyUrl: `${window.location.origin}/user/verify-email`,
          });
        } catch (e) {
          message.warning('Đăng ký thành công nhưng gửi email xác minh thất bại.');
        }
        message.success('Đăng ký thành công! Vui lòng kiểm tra email để xác minh tài khoản.');
        navigate('/user/login?fromRegister=true');
      }
    } catch (error: any) {
      if (error?.response?.data?.errorCode === 'BAD_REQUEST_DUPLICATE_EMAIL') {
        message.error('Email đã tồn tại trong hệ thống');
      } else {
        message.error('Đăng ký không thành công. Vui lòng thử lại!');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-content">
        <div className="register-box">
          <div className="register-top">
            <div className="register-header">
              <img alt="logo" className="register-logo" src="/_logo2.png" />
              <h1 className="register-title">Hệ thống quản lý đề thi</h1>
            </div>
            <div style={{paddingTop: '30px'}}>
              <span>Đăng ký tài khoản</span>
            </div>
          </div>

          <ConfigProvider locale={viVN}>
            <div className="register-main">
              <Form
                ref={formRef}
                onFinish={handleSubmit}
                layout="vertical"
              >
                <Form.Item 
                  name="email" 
                  label="Email"
                  rules={[...rules.required, ...rules.email]}
                  className="register-form-item"
                  labelCol={{ className: 'register-form-item-label' }}
                >
                  <Input
                    size="large"
                    prefix={<MailOutlined className="register-prefixIcon" />}
                    placeholder="Nhập email"
                    className="register-input"
                  />
                </Form.Item>

                <Form.Item 
                  name="password" 
                  label="Mật khẩu"
                  rules={[
                    ...rules.required,
                    {
                      min: 6,
                      message: 'Mật khẩu phải có ít nhất 6 ký tự',
                    }
                  ]}
                  className="register-form-item"
                  labelCol={{ className: 'register-form-item-label' }}
                >
                  <Input.Password
                    size="large"
                    prefix={<LockOutlined className="register-prefixIcon" />}
                    placeholder="Nhập mật khẩu"
                    className="register-input-password"
                  />
                </Form.Item>

                <Form.Item 
                  name="confirmPassword" 
                  label="Xác nhận mật khẩu"
                  dependencies={['password']}
                  rules={[
                    ...rules.required,
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue('password') === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                      },
                    }),
                  ]}
                  className="register-form-item"
                  labelCol={{ className: 'register-form-item-label' }}
                >
                  <Input.Password
                    size="large"
                    prefix={<LockOutlined className="register-prefixIcon" />}
                    placeholder="Nhập lại mật khẩu"
                    className="register-input-password"
                  />
                </Form.Item>

                <Form.Item className="register-form-item">
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={submitting}
                    size="large"
                    style={{ width: '100%' }}
                    className="register-btn"
                  >
                    Đăng ký
                  </Button>
                </Form.Item>

                <div style={{ textAlign: 'center', marginTop: 16 }}>
                  <span>Đã có tài khoản? </span>
                  <Link to="/user/login" style={{ color: '#1890ff' }}>
                    Đăng nhập ngay
                  </Link>
                </div>
              </Form>
            </div>
          </ConfigProvider>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Register; 