import { useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAppStore } from '@/stores/appStore';

export default function LoginSuccess() {
  const navigate = useNavigate();
  const fetchUserInfo = useAppStore((state) => state.fetchUserInfo);

  // Tách logic xử lý tokens
  const handleTokenStorage = useCallback((accessToken: string, refreshToken: string) => {
    if (accessToken) {
      localStorage.setItem("token", accessToken);
    }
    if (refreshToken) {
      localStorage.setItem("refreshToken", refreshToken);
    }
  }, []);

  // Tách logic xử lý popup communication
  const handlePopupCommunication = useCallback(() => {
    if (window.opener) {
      try {
        window.opener.postMessage(
          { googleLoginSuccess: true }, 
          window.location.origin
        );
        window.close();
        return true;
      } catch (error) {
        console.error("Error communicating with parent window:", error);
        return false;
      }
    }
    return false;
  }, []);

  // Tách logic redirect
  const handleRedirect = useCallback(async () => {
    try {
      await fetchUserInfo();
    } finally {
      navigate("/");
    }
  }, [fetchUserInfo, navigate]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get("accessToken");
    const refreshToken = params.get("refreshToken");

    // Kiểm tra có tokens không
    if (!accessToken || !refreshToken) {
      console.error("Missing authentication tokens");
      navigate("/login");
      return;
    }

    // Lưu tokens
    handleTokenStorage(accessToken, refreshToken);

    // Xử lý popup communication hoặc redirect
    const isPopupHandled = handlePopupCommunication();
    if (!isPopupHandled) {
      handleRedirect();
    }
  }, [navigate, handleTokenStorage, handlePopupCommunication, handleRedirect]);

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center',
      minHeight: '100vh',
      fontSize: 16,
      color: '#666'
    }}>
      Đăng nhập thành công, đang chuyển hướng...
    </div>
  );
}