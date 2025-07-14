import SpinLoading from '@/components/common/SpinLoading/SpinLoading';
import { useAppStore } from '@/stores/appStore';
import { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  const loginPath = '/user/login';
  const autoLoginPath = '/user/autologin';
  const registerPath = '/user/register';
  const verifyEmailPath = '/user/verify-email';
  const pathname = window.location.pathname;

  const { currentUser, fetchUserInfo, loading} = useAppStore();
  useEffect(() => {
    const getCurrentUser = async () => {
      await fetchUserInfo();
    }
    if (!currentUser) {
      getCurrentUser()
    }
  }, []);
  if (loading) {
    return <SpinLoading />
  }
  if (!currentUser) {
    if (
      pathname !== loginPath &&
      pathname !== autoLoginPath &&
      pathname !== registerPath &&
      pathname !== verifyEmailPath
    ) {
      return <Navigate to={loginPath} replace />;
    }
  }
  return <Outlet />;
};
export default ProtectedRoute;