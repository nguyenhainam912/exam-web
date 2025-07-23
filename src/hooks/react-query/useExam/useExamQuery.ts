import { useQuery } from '@tanstack/react-query';
import { GetParams } from '@/utils/interfaces';
import useExamStore from '@/stores/exam';
import { getExams, getExamById, getExamChangeRequests } from '@/services/exam/exam';

export const useExamQuery = (params: GetParams) => {
  const { setTotal } = useExamStore();
  return useQuery({
    queryKey: ['exam', params],
    queryFn: async () => {
      const response = await getExams(params);
      setTotal(response?.data?.total ?? 0);
      return response?.data?.result ?? [];
    },
  });
};

export const useExamByIdQuery = (id: string | undefined) => {
  return useQuery({
    queryKey: ['exam', 'detail', id],
    queryFn: async () => {
      const response = await getExamById(id!);
      return response?.data;
    },
    enabled: !!id,
  });
};

export const useExamChangeRequestQuery = (params: { page: number; limit: number; cond?: any }) => {
  return useQuery({
    queryKey: ['exam-change-request', params],
    queryFn: async () => {
      const response = await getExamChangeRequests(params);
      return response?.data?.result ?? [];
    },
  });
}; 