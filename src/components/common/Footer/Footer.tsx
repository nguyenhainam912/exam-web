import { Layout } from 'antd';

const Footer = () => {
  const { Footer } = Layout;
  return (
    <Footer style={{ textAlign: 'center' }}>
      ©{new Date().getFullYear()} Developed by Nguyễn Hải Nam - 2155010175 (Law)
    </Footer>
  );
};

export default Footer
