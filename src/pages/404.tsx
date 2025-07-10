import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';

const NoFoundPage = () => {
  const navigate = useNavigate()
  return(
    <Result
      status="404"
      title="404"
      subTitle="Xin lỗi, trang truy cập hiện không tồn tại!"
      extra={
        <Button type="primary" onClick={() => navigate('/')}>
          Quay về trang chủ
        </Button>
      }
    />
  );
}

export default NoFoundPage;
