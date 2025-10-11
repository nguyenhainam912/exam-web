import { Layout, theme } from 'antd';
import { Link } from 'react-router-dom';
import Actions from './Actions/Actions';
import SiderMenu from '@/components/common/Sider/Sider';
import styles from './Header.module.css';
import { useEffect, useState } from 'react';
import { ClockCircleOutlined } from '@ant-design/icons';

const { Header } = Layout;

const HeaderComponent = ({ children }: any) => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  // Clock component (local)
  const Clock = () => {
    const [now, setNow] = useState<Date>(new Date());
    useEffect(() => {
      const id = setInterval(() => setNow(new Date()), 1000);
      return () => clearInterval(id);
    }, []);
    return (
      <div className={styles.timer}>
        <ClockCircleOutlined style={{ marginRight: 8 }} />
        <span>{now.toLocaleTimeString()}</span>
      </div>
    );
  };

  return (
    <Header
      className={styles.header}
      style={{ /* fallback to theme token if needed */ background: colorBgContainer || 'transparent' }}
    >
      {/* left: logo + title */}
      <div className={styles.left}>
        <Link to="/" className={styles.logoLink}>
          <img src="/_logo2.png" alt="Logo" className={styles.logo} />
        </Link>
        <Link to="/" className={styles.titleLink}>Hệ thống quản lý đề thi</Link>
      </div>

      {/* center: menu */}
      <div className={styles.menuWrapper}>
        <div className={styles.menuInner}>
          <SiderMenu
            mode="horizontal"
            style={{
              borderBottom: 'none',
              whiteSpace: 'nowrap',
              width: '100%',
              minWidth: 'max-content',
            }}
          />
        </div>
      </div>

      {/* Actions: fixed to right */}
      <div className={styles.actions}>
        <Clock />
        <Actions />
      </div>
    </Header>
  );
};

export default HeaderComponent;