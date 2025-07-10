import { useAppStore } from "@/stores/appStore";
import { Spin } from "antd";
import './index.css'
const SpinLoading = () => {
  const {loading} = useAppStore()
  return (
    <div 
      className={loading ? "fade-out" : ''}
      style={{
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        flexDirection: 'column', 
        gap: '110px', 
        width: '100vw', 
        height: '100vh'
      }}
    > 
      <img
        src="/_logo2.png"
        alt="Logo"
        style={{ width: 170, height: 170, }} 
      />
      <Spin size="large" style={{ marginLeft: 8, marginRight: 8}}/> 
      <div
        style={{
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          gap: '10px', 
        }}
      >
        <img
          src="/_logo2.png"
          alt="Logo"
          style={{ width: 28, height: 28 }} 
        />
        Hệ thống quản lý
      </div>
    </div>
  );
}

export default SpinLoading