import Footer from '@/components/common/Footer/Footer';
import HeaderComponent from '@/components/common/Header/Header';
import { HEADER_HEIGHT } from '@/utils/spacing';
import { Card, Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import ChatFloating from '@/components/common/Chat/ChatFloating';
const { Content } = Layout;


const MainLayout = () => {

  return (
    <Layout style={{ minHeight: '100vh'}}>
      <HeaderComponent />
      <Layout >
        {/* <SiderComponent /> */}
        <Layout style={{margin: '0 10px', paddingTop: `calc(${HEADER_HEIGHT} + 5px)`}}>
            <Card className='card-main'>
              <Content >
                <Outlet />
              </Content>
            </Card>
          <Footer />
        </Layout>
      </Layout>

      {/* chat floating component */}
      <ChatFloating />
    </Layout>
  );
};

export default MainLayout;