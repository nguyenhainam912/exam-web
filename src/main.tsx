import "@/config/i18n.ts";
import queryClient from '@/config/queryConfig';
import { QueryClientProvider } from '@tanstack/react-query';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from "./app";
dayjs.locale('vi');

createRoot(document.getElementById('root')!).render(
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
)




