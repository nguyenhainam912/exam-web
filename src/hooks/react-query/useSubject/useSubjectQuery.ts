import { useQuery } from '@tanstack/react-query';
import { GetParams } from '@/utils/interfaces';
import useSubjectStore from '@/stores/subject';
import { getSubjects, getSubjectById } from '@/services/subject/subject';

export const useSubjectQuery = (params: GetParams) => {
  const { setTotal } = useSubjectStore();
  return useQuery({
    queryKey: ['subject', params],
    queryFn: async () => {
      const response = await getSubjects(params);
      setTotal(response?.data?.total ?? 0);
      return response?.data?.result ?? [];
    },
  });
};

export const useSubjectByIdQuery = (id: string | undefined) => {
  return useQuery({
    queryKey: ['subject', 'detail', id],
    queryFn: async () => {
      const response = await getSubjectById(id!);
      return response?.data;
    },
    enabled: !!id,
  });
}; 