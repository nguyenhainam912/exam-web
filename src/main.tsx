import "@/config/i18n.ts";
import queryClient from '@/config/queryConfig';
import { QueryClientProvider } from '@tanstack/react-query';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from "./app";
import { ConfigProvider } from 'antd';
dayjs.locale('vi');

createRoot(document.getElementById('root')!).render(
    <QueryClientProvider client={queryClient}>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#8B5CF6', // tím nhạt hiện đại (Violet-500)
            // hoặc thử các màu này:
            // colorPrimary: '#A855F7', // Purple-500 
            // colorPrimary: '#9333EA', // Violet-600
            // colorPrimary: '#7C3AED', // Violet-700
          },
        }}
      >
        <App />
      </ConfigProvider>
    </QueryClientProvider>
)




