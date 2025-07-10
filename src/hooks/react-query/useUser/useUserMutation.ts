import { useMutation, useQueryClient } from '@tanstack/react-query';
import { MutationOptions } from '@/utils/interfaces';

// export const usePostRoleToUserMutation = <T>({ onSuccess, onError }: MutationOptions<T>) => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: async (payload: any) => {
//       // return await postRoleToUser(payload);
//     },
//     onSuccess: (data: T) => {
//       queryClient.invalidateQueries({ queryKey: ['user'] });
//       onSuccess && onSuccess(data);
//     },
//     onError: (error) => {
//       onError && onError(error);
//     },
//   })
// }

// export const usePostUserMutation = <T>({ onSuccess, onError, params }: MutationOptions<T>) => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: async (payload: any) => {
//       return await postUser(payload);
//     },
//     onSuccess: (data: T) => {
//       queryClient.invalidateQueries({ queryKey: ['user', params] });
//       onSuccess && onSuccess(data);
//     },
//     onError: (error) => {
//       onError && onError(error);
//     },
//   })
// }

// export const useDeleteRoleToUserMutation = <T>({ onSuccess, onError }: MutationOptions<T>) => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: async (payload: any) => {
//       return await delRoleToUser(payload);
//     },
//     onSuccess: (data: T) => {
//       queryClient.invalidateQueries({ queryKey: ['user'] });
//       onSuccess && onSuccess(data);
//     },
//     onError: (error) => {
//       onError && onError(error);
//     },
//   });
// }

// export const usePutUserMutation = <T>({ onSuccess, onError, params }: MutationOptions<T>) => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: async (payload: { id: string; body: any }) => {
//       return await putUser(payload.id, payload.body);
//     },
//     onSuccess: (data: T) => {
//       queryClient.invalidateQueries({ queryKey: ['user', params] });
//       onSuccess && onSuccess(data);
//     },
//     onError: (error) => {
//       onError && onError(error);
//     },
//   });
// }

