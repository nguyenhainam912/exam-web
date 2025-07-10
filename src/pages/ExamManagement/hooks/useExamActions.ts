import { useState, useCallback } from 'react';
import type { ExamRecord } from '@/stores/exam';

interface UseExamActionsProps {
  setRecord: (record: any) => void;
  setView: (view: boolean) => void;
  setEdit: (edit: boolean) => void;
  setVisibleForm: (visible: boolean) => void;
}

export const useExamActions = ({
  setRecord,
  setView,
  setEdit,
  setVisibleForm,
}: UseExamActionsProps) => {
  const [selectedExamId, setSelectedExamId] = useState<string | undefined>(undefined);

  const handleView = useCallback((record: ExamRecord) => {
    setSelectedExamId(record._id);
    setView(true);
    setEdit(false);
    setVisibleForm(true);
  }, [setView, setEdit, setVisibleForm]);

  const handleEdit = useCallback((record: ExamRecord) => {
    setSelectedExamId(record._id);
    setEdit(true);
    setView(false);
    setVisibleForm(true);
  }, [setEdit, setView, setVisibleForm]);

  const handleAdd = useCallback(() => {
    setSelectedExamId(undefined);
    setRecord({} as any);
    setEdit(false);
    setView(false);
    setVisibleForm(true);
  }, [setRecord, setEdit, setView, setVisibleForm]);

  const resetFormStates = useCallback(() => {
    setSelectedExamId(undefined);
    setEdit(false);
    setView(false);
    setRecord({} as any);
    setVisibleForm(false);
  }, [setEdit, setView, setRecord, setVisibleForm]);

  return {
    selectedExamId,
    handleView,
    handleEdit,
    handleAdd,
    resetFormStates,
  };
}; 