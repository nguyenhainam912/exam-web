import { resendVerificationEmail } from '@/services/user/user';
import { MailOutlined } from '@ant-design/icons';
import { Alert, Button, message } from 'antd';
import { useState } from 'react';

interface EmailVerificationNoticeProps {
  email: string;
  onVerified?: () => void;
}

const EmailVerificationNotice = ({ email, onVerified }: EmailVerificationNoticeProps) => {
  const [loading, setLoading] = useState(false);

  const handleResendEmail = async () => {
    setLoading(true);
    try {
      const response: any = await resendVerificationEmail({ email });
      if (response.statusCode === 200) {
        message.success('Email xác minh đã được gửi lại. Vui lòng kiểm tra hộp thư!');
      }
    } catch (error: any) {
      if (error?.response?.data?.errorCode === 'BAD_REQUEST_EMAIL_ALREADY_VERIFIED') {
        message.success('Email đã được xác minh!');
        onVerified?.();
      } else {
        message.error('Có lỗi xảy ra. Vui lòng thử lại sau!');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Alert
      message="Xác minh email"
      description={
        <div>
          <p>Vui lòng xác minh email <strong>{email}</strong> để kích hoạt tài khoản.</p>
          <p>Không nhận được email? Kiểm tra thư mục spam hoặc</p>
          <Button 
            type="link" 
            size="small" 
            loading={loading}
            onClick={handleResendEmail}
            style={{ padding: 0, height: 'auto' }}
          >
            gửi lại email xác minh
          </Button>
        </div>
      }
      type="warning"
      showIcon
      icon={<MailOutlined />}
      style={{ marginBottom: 16 }}
    />
  );
};

export default EmailVerificationNotice; 