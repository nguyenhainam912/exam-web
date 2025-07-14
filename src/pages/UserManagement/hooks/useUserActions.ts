import { User } from '@/services/user/typing';
import { useState, useCallback } from 'react';

interface UseUserActionsProps {
  setRecord: (record: any) => void;
  setView: (view: boolean) => void;
  setEdit: (edit: boolean) => void;
  setVisibleForm: (visible: boolean) => void;
}

export const useUserActions = ({
  setRecord,
  setView,
  setEdit,
  setVisibleForm,
}: UseUserActionsProps) => {
  const [selectedUserId, setSelectedUserId] = useState<string | undefined>(undefined);

  const handleView = useCallback((record: User.Profile) => {
    setSelectedUserId(record.userId);
    setView(true);
    setEdit(false);
    setVisibleForm(true);
  }, [setView, setEdit, setVisibleForm]);

  const handleEdit = useCallback((record: User.Profile) => {
    setSelectedUserId(record.userId);
    setEdit(true);
    setView(false);
    setVisibleForm(true);
  }, [setEdit, setView, setVisibleForm]);

  const handleAdd = useCallback(() => {
    setSelectedUserId(undefined);
    setRecord({} as any);
    setEdit(false);
    setView(false);
    setVisibleForm(true);
  }, [setRecord, setEdit, setView, setVisibleForm]);

  const resetFormStates = useCallback(() => {
    setSelectedUserId(undefined);
    setEdit(false);
    setView(false);
    setRecord({} as any);
    setVisibleForm(false);
  }, [setEdit, setView, setRecord, setVisibleForm]);

  return {
    selectedUserId,
    setSelectedUserId,
    handleView,
    handleEdit,
    handleAdd,
    resetFormStates,
  };
}; 