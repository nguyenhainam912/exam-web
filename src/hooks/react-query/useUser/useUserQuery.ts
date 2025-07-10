import { useQuery } from '@tanstack/react-query';
import { getListUser, getUserById } from '@/services/user/user';
import { GetParams } from '@/utils/interfaces';
import useUserStore from '@/stores/user';

export const useUserQuery = (params: GetParams) => {
  const { setTotal } = useUserStore()
  return useQuery({
    queryKey: ['user', params],
    queryFn: async() =>  {
      const response = await getListUser(params)
      setTotal(response?.data?.total ?? 0)
      return response?.data?.result ?? []
    }
  });
};

export const useUserByIdQuery = (id: string) => {
  return useQuery({
    queryKey: ['userById'],
    queryFn: async() =>  await getUserById(id)
  });
};