import { useQuery } from '@tanstack/react-query';
import { GetParams } from '@/utils/interfaces';
import useGradeLevelStore from '@/stores/gradeLevel';
import { getGradeLevels, getGradeLevelById } from '@/services/gradeLevel/gradeLevel';

export const useGradeLevelQuery = (params: GetParams) => {
  const { setTotal } = useGradeLevelStore();
  return useQuery({
    queryKey: ['grade-level', params],
    queryFn: async () => {
      const response = await getGradeLevels(params);
      setTotal(response?.data?.total ?? 0);
      return response?.data?.result ?? [];
    },
  });
};

export const useGradeLevelByIdQuery = (id: string | undefined) => {
  return useQuery({
    queryKey: ['grade-level', 'detail', id],
    queryFn: async () => {
      const response = await getGradeLevelById(id!);
      return response?.data;
    },
    enabled: !!id,
  });
}; 