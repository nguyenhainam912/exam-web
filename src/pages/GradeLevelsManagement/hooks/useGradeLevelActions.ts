import { useState, useCallback } from 'react';
import type { GradeLevelRecord } from '@/stores/gradeLevel';

interface UseGradeLevelActionsProps {
  setRecord: (record: any) => void;
  setView: (view: boolean) => void;
  setEdit: (edit: boolean) => void;
  setVisibleForm: (visible: boolean) => void;
}

export const useGradeLevelActions = ({
  setRecord,
  setView,
  setEdit,
  setVisibleForm,
}: UseGradeLevelActionsProps) => {
  const [selectedGradeLevelId, setSelectedGradeLevelId] = useState<string | undefined>(undefined);

  const handleView = useCallback((record: GradeLevelRecord) => {
    setSelectedGradeLevelId(record._id);
    setView(true);
    setEdit(false);
    setVisibleForm(true);
  }, [setView, setEdit, setVisibleForm]);

  const handleEdit = useCallback((record: GradeLevelRecord) => {
    setSelectedGradeLevelId(record._id);
    setEdit(true);
    setView(false);
    setVisibleForm(true);
  }, [setEdit, setView, setVisibleForm]);

  const handleAdd = useCallback(() => {
    setSelectedGradeLevelId(undefined);
    setRecord({} as any);
    setEdit(false);
    setView(false);
    setVisibleForm(true);
  }, [setRecord, setEdit, setView, setVisibleForm]);

  const resetFormStates = useCallback(() => {
    setSelectedGradeLevelId(undefined);
    setEdit(false);
    setView(false);
    setRecord({} as any);
    setVisibleForm(false);
  }, [setEdit, setView, setRecord, setVisibleForm]);

  return {
    selectedGradeLevelId,
    handleView,
    handleEdit,
    handleAdd,
    resetFormStates,
  };
}; 