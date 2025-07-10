import { notification } from "antd";
import axios from "axios"
import data from "./data";

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
})

axiosInstance.interceptors.request.use(
    (config) => {
      // Kiểm tra nếu không có Authorization header
      if (!config.headers.Authorization) {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
      if (config.params) {
        const { cond, ...otherParams } = config.params;
        if (cond !== undefined && cond !== null) {
          config.params = {
            ...otherParams,
            cond: JSON.stringify(cond), 
          };
        }
      }
      return config;
    },
    (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
    (response) =>
    // Do something with response data
    response
    ,
    async (error) => {
    if (error.response && error.response.data instanceof Blob) {
        const text = await error.response.data.text();
        const errorData = JSON.parse(text);
        error.response.data = errorData; 
    }
    switch (error?.response?.status) {
        case 400: {
        notification.error({
            message: 'Có lỗi xảy ra',
            description:
            data.error[
            error?.response?.data?.detail?.errorCode || error?.response?.data?.errorCode
                ] ||
            error?.response?.data?.errorDescription ||
            error?.data?.detail?.message ||
            error?.message || error?.response?.data?.errorCode,
        });
        break;
        }

        case 401:
        notification.error({
            message: 'Vui lòng đăng nhập lại',
            description: '',
        });
        localStorage.removeItem('vaiTro');
        localStorage.removeItem('token');
        // history.replace({
        //   pathname: '/user/login',
        // });
        break;

        case 404:
        notification.error({
            message:
            'Lỗi không tìm thấy dữ liệu, bạn hãy thử f5 refresh lại trình duyệt để cập nhật phiên bản mới nhất.',
            description: error?.response?.data?.detail?.message || error?.message,
        });
        break;

        case 405:
        notification.error({
            message: 'Truy vấn không được phép',
            description: error?.response?.data?.detail?.message || error?.message,
        });
        break;

        case 409:
        notification.error({
            message: 'Dữ liệu đã bị trùng',
            description: error?.response?.data?.message || error?.message,
        });
        break;

        case 500:
        notification.error({
            message: 'Server gặp lỗi',
            description: error?.response?.data?.detail?.message || error.message,
        });
        break;

        default:
        break;
    }
    return Promise.reject(error);
    // throw error
    },
    // Do something with response error
);

export default axiosInstance