import { useState, useCallback } from 'react';
import type { SubjectRecord } from '@/stores/subject';

interface UseSubjectActionsProps {
  setRecord: (record: any) => void;
  setView: (view: boolean) => void;
  setEdit: (edit: boolean) => void;
  setVisibleForm: (visible: boolean) => void;
}

export const useSubjectActions = ({
  setRecord,
  setView,
  setEdit,
  setVisibleForm,
}: UseSubjectActionsProps) => {
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | undefined>(undefined);

  const handleView = useCallback((record: SubjectRecord) => {
    setSelectedSubjectId(record._id);
    setView(true);
    setEdit(false);
    setVisibleForm(true);
  }, [setView, setEdit, setVisibleForm]);

  const handleEdit = useCallback((record: SubjectRecord) => {
    setSelectedSubjectId(record._id);
    setEdit(true);
    setView(false);
    setVisibleForm(true);
  }, [setEdit, setView, setVisibleForm]);

  const handleAdd = useCallback(() => {
    setSelectedSubjectId(undefined);
    setRecord({} as any);
    setEdit(false);
    setView(false);
    setVisibleForm(true);
  }, [setRecord, setEdit, setView, setVisibleForm]);

  const resetFormStates = useCallback(() => {
    setSelectedSubjectId(undefined);
    setEdit(false);
    setView(false);
    setRecord({} as any);
    setVisibleForm(false);
  }, [setEdit, setView, setRecord, setVisibleForm]);

  return {
    selectedSubjectId,
    handleView,
    handleEdit,
    handleAdd,
    resetFormStates,
  };
}; 