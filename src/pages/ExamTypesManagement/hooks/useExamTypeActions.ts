import { useState, useCallback } from 'react';
import type { ExamTypeRecord } from '@/stores/examType';

interface UseExamTypeActionsProps {
  setRecord: (record: any) => void;
  setView: (view: boolean) => void;
  setEdit: (edit: boolean) => void;
  setVisibleForm: (visible: boolean) => void;
}

export const useExamTypeActions = ({
  setRecord,
  setView,
  setEdit,
  setVisibleForm,
}: UseExamTypeActionsProps) => {
  const [selectedExamTypeId, setSelectedExamTypeId] = useState<string | undefined>(undefined);

  const handleView = useCallback((record: ExamTypeRecord) => {
    setSelectedExamTypeId(record._id);
    setView(true);
    setEdit(false);
    setVisibleForm(true);
  }, [setView, setEdit, setVisibleForm]);

  const handleEdit = useCallback((record: ExamTypeRecord) => {
    setSelectedExamTypeId(record._id);
    setEdit(true);
    setView(false);
    setVisibleForm(true);
  }, [setEdit, setView, setVisibleForm]);

  const handleAdd = useCallback(() => {
    setSelectedExamTypeId(undefined);
    setRecord({} as any);
    setEdit(false);
    setView(false);
    setVisibleForm(true);
  }, [setRecord, setEdit, setView, setVisibleForm]);

  const resetFormStates = useCallback(() => {
    setSelectedExamTypeId(undefined);
    setEdit(false);
    setView(false);
    setRecord({} as any);
    setVisibleForm(false);
  }, [setEdit, setView, setRecord, setVisibleForm]);

  return {
    selectedExamTypeId,
    handleView,
    handleEdit,
    handleAdd,
    resetFormStates,
  };
}; 