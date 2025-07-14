import Footer from '@/components/common/Footer/Footer';
import { verifyEmail } from '@/services/user/user';
import { CheckCircleOutlined, CloseCircleOutlined, LoadingOutlined } from '@ant-design/icons';
import { Button, Result } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './index.css';

const VerifyEmail = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyToken = async () => {
      const token = searchParams.get('token');
      
      if (!token) {
        setStatus('error');
        setMessage('Token xác minh không hợp lệ');
        return;
      }

      try {
        const response: any = await verifyEmail({ token });
        
        if (response.statusCode === 201) {
          setStatus('success');
          setMessage('Xác minh email thành công!');
        } else {
          setStatus('error');
          setMessage('Xác minh email thất bại. Vui lòng thử lại!');
        }
      } catch (error: any) {
        setStatus('error');
        if (error?.response?.data?.errorCode === 'BAD_REQUEST_TOKEN_EXPIRED') {
          setMessage('Token đã hết hạn. Vui lòng yêu cầu gửi lại email xác minh!');
        } else if (error?.response?.data?.errorCode === 'BAD_REQUEST_TOKEN_INVALID') {
          setMessage('Token không hợp lệ. Vui lòng kiểm tra lại link!');
        } else {
          setMessage('Có lỗi xảy ra. Vui lòng thử lại sau!');
        }
      }
    };

    verifyToken();
  }, [searchParams]);

  const getResultProps = () => {
    switch (status) {
      case 'loading':
        return {
          icon: <LoadingOutlined style={{ color: '#1890ff' }} />,
          status: 'info' as const,
          title: 'Đang xác minh email...',
          subTitle: 'Vui lòng chờ trong giây lát',
        };
      case 'success':
        return {
          icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
          status: 'success' as const,
          title: 'Xác minh thành công!',
          subTitle: message,
        };
      case 'error':
        return {
          icon: <CloseCircleOutlined style={{ color: '#ff4d4f' }} />,
          status: 'error' as const,
          title: 'Xác minh thất bại',
          subTitle: message,
        };
      default:
        return {};
    }
  };

  return (
    <div className="verify-container">
      <div className="verify-content">
        <div className="verify-box">
          <div className="verify-top">
            <div className="verify-header">
              <img alt="logo" className="verify-logo" src="/_logo2.png" />
              <h1 className="verify-title">Hệ thống quản lý đề thi</h1>
            </div>
          </div>

          <div className="verify-main">
            <Result
              {...getResultProps()}
              className="verify-result"
              extra={[
                <Button 
                  type="primary" 
                  key="login"
                  onClick={() => navigate('/user/login')}
                  size="large"
                  className="verify-btn"
                >
                  Đăng nhập ngay
                </Button>,
                <Button 
                  key="home"
                  onClick={() => navigate('/')}
                  size="large"
                  className="verify-btn"
                >
                  Về trang chủ
                </Button>
              ]}
            />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default VerifyEmail; 