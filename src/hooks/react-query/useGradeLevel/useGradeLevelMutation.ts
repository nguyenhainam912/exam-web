import { useMutation, useQueryClient } from '@tanstack/react-query';
import { MutationOptions } from '@/utils/interfaces';
import { postGradeLevel, putGradeLevel, delGradeLevel } from '@/services/gradeLevel/gradeLevel';

export const usePostGradeLevelMutation = (options: MutationOptions<any>) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postGradeLevel,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['grade-level'] });
      options.onSuccess?.(data);
    },
    onError: options.onError,
  });
};

export const usePutGradeLevelMutation = (options: MutationOptions<any>) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: any }) => putGradeLevel(id, body),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['grade-level'] });
      options.onSuccess?.(data);
    },
    onError: options.onError,
  });
};

export const useDeleteGradeLevelMutation = (options: MutationOptions<any>) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: delGradeLevel,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['grade-level'] });
      options.onSuccess?.(data);
    },
    onError: options.onError,
  });
}; 