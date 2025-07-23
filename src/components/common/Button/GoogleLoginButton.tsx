import React, { useEffect, useCallback } from "react";
import { useAppStore } from "@/stores/appStore";
import { useNavigate } from "react-router-dom";

const GOOGLE_AUTH_URL = `${import.meta.env.VITE_API_BASE_URL}/auth/google`;

// Constants để dễ maintain
const POPUP_CONFIG = {
  width: 500,
  height: 600,
  features: "status=no,scrollbars=yes,resizable=no",
} as const;

const BUTTON_STYLES = {
  width: '100%',
  height: 40,
  borderRadius: 6,
  fontWeight: 500,
  fontSize: 16,
  background: '#fff',
  color: '#444',
  border: '1px solid #ddd',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 8,
  cursor: 'pointer',
  boxShadow: 'none',
  outline: 'none',
  margin: 0,
} as const;

interface GoogleLoginData {
  accessToken?: string;
  refreshToken?: string;
  redirectUrl?: string;
  googleLoginSuccess?: boolean;
}

export default function GoogleLoginButton() {
  const fetchUserInfo = useAppStore((state) => state.fetchUserInfo);
  const navigate = useNavigate();

  // Tách logic xử lý tokens thành function riêng
  const handleTokens = useCallback(async (data: GoogleLoginData) => {
    const { accessToken, refreshToken, redirectUrl } = data;
    
    if (accessToken) {
      localStorage.setItem("token", accessToken);
    }
    
    if (refreshToken) {
      localStorage.setItem("refreshToken", refreshToken);
    }
    
    if (accessToken) {
      try {
        await fetchUserInfo();
      } finally {
        navigate(redirectUrl || "/");
      }
    }
  }, [fetchUserInfo, navigate]);

  // Tối ưu message handler
  const handleMessage = useCallback((event: MessageEvent) => {
    // Security check
    if (event.origin !== window.location.origin) return;
    
    const data = event.data as GoogleLoginData;
    if (!data) return;

    // Xử lý trường hợp login success từ popup
    if (data.googleLoginSuccess) {
      window.location.href = "/";
      return;
    }

    // Xử lý tokens
    handleTokens(data);
  }, [handleTokens]);

  useEffect(() => {
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [handleMessage]);

  const handleGoogleLogin = useCallback(() => {
    const { width, height } = POPUP_CONFIG;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2.5;

    // Lưu URL hiện tại để redirect sau khi login
    sessionStorage.setItem(
      "google_redirect_url", 
      window.location.pathname + window.location.search
    );

    const popup = window.open(
      GOOGLE_AUTH_URL,
      "GoogleLoginPopup",
      `width=${width},height=${height},left=${left},top=${top},${POPUP_CONFIG.features}`
    );

    // Optional: Handle popup blocked case
    if (!popup) {
      console.warn("Popup was blocked by browser");
      // Có thể show notification cho user
    }
  }, []);

  return (
    <button
      type="button"
      onClick={handleGoogleLogin}
      style={BUTTON_STYLES}
      className="login-btn"
      aria-label="Đăng nhập với Google"
    >
      <img
        src="https://developers.google.com/identity/images/g-logo.png"
        alt="Google"
        style={{ width: 24, height: 24, marginRight: 8 }}
        loading="lazy"
      />
      Đăng nhập với Google
    </button>
  );
}