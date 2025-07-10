import { useState, useCallback } from 'react';
import type { Role } from '@/services/role/index.d';

interface UseRoleActionsProps {
  setRecord: (record: any) => void;
  setView: (view: boolean) => void;
  setEdit: (edit: boolean) => void;
  setVisibleForm: (visible: boolean) => void;
}

export const useRoleActions = ({
  setRecord,
  setView,
  setEdit,
  setVisibleForm,
}: UseRoleActionsProps) => {
  const [selectedRoleId, setSelectedRoleId] = useState<string | undefined>(undefined);

  const handleView = useCallback((record: Role.Record) => {
    setSelectedRoleId(record.id);
    setView(true);
    setEdit(false);
    setVisibleForm(true);
  }, [setView, setEdit, setVisibleForm]);

  const handleEdit = useCallback((record: Role.Record) => {
    setSelectedRoleId(record.id);
    setEdit(true);
    setView(false);
    setVisibleForm(true);
  }, [setEdit, setView, setVisibleForm]);

  const handleAdd = useCallback(() => {
    setSelectedRoleId(undefined);
    setRecord({} as any);
    setEdit(false);
    setView(false);
    setVisibleForm(true);
  }, [setRecord, setEdit, setView, setVisibleForm]);

  const resetFormStates = useCallback(() => {
    setSelectedRoleId(undefined);
    setEdit(false);
    setView(false);
    setRecord({} as any);
    setVisibleForm(false);
  }, [setEdit, setView, setRecord, setVisibleForm]);

  return {
    selectedRoleId,
    handleView,
    handleEdit,
    handleAdd,
    resetFormStates,
  };
}; 