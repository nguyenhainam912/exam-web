import { useQuery } from '@tanstack/react-query';
import { GetParams } from '@/utils/interfaces';
import usePermissionStore from '@/stores/permission';
import { getPermissions, getPermissionById } from '@/services/permission/permission';

export const usePermissionQuery = (params: GetParams) => {
  const { setTotal } = usePermissionStore()
  return useQuery({
    queryKey: ['permission', params],
    queryFn: async() =>  {
      const response =  await getPermissions(params)
      setTotal(response?.data?.total ?? 0)
      return response?.data?.result ?? []
    },
  });
};

export const usePermissionByIdQuery = (id: string | undefined) => {
  return useQuery({
    queryKey: ['permission', 'detail', id],
    queryFn: async() => {
      const response = await getPermissionById(id!);
      return response?.data;
    },
    enabled: !!id,
  });
};
