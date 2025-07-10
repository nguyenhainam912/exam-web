import { useMutation, useQueryClient } from '@tanstack/react-query';
import { MutationOptions } from '@/utils/interfaces';
import { postExam, putExam, delExam } from '@/services/exam/exam';

export const usePostExamMutation = (options: MutationOptions<any>) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postExam,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['exam'] });
      options.onSuccess?.(data);
    },
    onError: options.onError,
  });
};

export const usePutExamMutation = (options: MutationOptions<any>) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: any }) => putExam(id, body),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['exam'] });
      options.onSuccess?.(data);
    },
    onError: options.onError,
  });
};

export const useDeleteExamMutation = (options: MutationOptions<any>) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: delExam,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['exam'] });
      options.onSuccess?.(data);
    },
    onError: options.onError,
  });
}; 