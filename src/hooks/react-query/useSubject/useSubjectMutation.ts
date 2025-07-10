import { useMutation, useQueryClient } from '@tanstack/react-query';
import { MutationOptions } from '@/utils/interfaces';
import { postSubject, putSubject, delSubject } from '@/services/subject/subject';

export const usePostSubjectMutation = (options: MutationOptions<any>) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postSubject,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['subject'] });
      options.onSuccess?.(data);
    },
    onError: options.onError,
  });
};

export const usePutSubjectMutation = (options: MutationOptions<any>) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: any }) => putSubject(id, body),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['subject'] });
      options.onSuccess?.(data);
    },
    onError: options.onError,
  });
};

export const useDeleteSubjectMutation = (options: MutationOptions<any>) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: delSubject,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['subject'] });
      options.onSuccess?.(data);
    },
    onError: options.onError,
  });
}; 