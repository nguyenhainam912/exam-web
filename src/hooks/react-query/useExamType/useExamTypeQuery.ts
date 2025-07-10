import { useQuery } from '@tanstack/react-query';
import { GetParams } from '@/utils/interfaces';
import useExamTypeStore from '@/stores/examType';
import { getExamTypes, getExamTypeById } from '@/services/examType/examType';

export const useExamTypeQuery = (params: GetParams) => {
  const { setTotal } = useExamTypeStore();
  return useQuery({
    queryKey: ['exam-type', params],
    queryFn: async () => {
      const response = await getExamTypes(params);
      setTotal(response?.data?.total ?? 0);
      return response?.data?.result ?? [];
    },
  });
};

export const useExamTypeByIdQuery = (id: string | undefined) => {
  return useQuery({
    queryKey: ['exam-type', 'detail', id],
    queryFn: async () => {
      const response = await getExamTypeById(id!);
      return response?.data;
    },
    enabled: !!id,
  });
}; 