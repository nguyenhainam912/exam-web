import { useMutation, useQueryClient } from '@tanstack/react-query';
import { MutationOptions } from '@/utils/interfaces';
import { postExamType, putExamType, delExamType } from '@/services/examType/examType';

export const usePostExamTypeMutation = (options: MutationOptions<any>) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postExamType,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['exam-type'] });
      options.onSuccess?.(data);
    },
    onError: options.onError,
  });
};

export const usePutExamTypeMutation = (options: MutationOptions<any>) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: any }) => putExamType(id, body),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['exam-type'] });
      options.onSuccess?.(data);
    },
    onError: options.onError,
  });
};

export const useDeleteExamTypeMutation = (options: MutationOptions<any>) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: delExamType,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['exam-type'] });
      options.onSuccess?.(data);
    },
    onError: options.onError,
  });
}; 