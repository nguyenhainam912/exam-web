import { useState, useEffect, useCallback } from 'react';
import type { Permission } from '@/services/permission';

interface UsePermissionActionsProps {
  setRecord: (record: any) => void;
  setView: (view: boolean) => void;
  setEdit: (edit: boolean) => void;
  setVisibleForm: (visible: boolean) => void;
}

export const usePermissionActions = ({
  setRecord,
  setView,
  setEdit,
  setVisibleForm,
}: UsePermissionActionsProps) => {
  const [selectedPermissionId, setSelectedPermissionId] = useState<string | undefined>(undefined);

  const handleView = useCallback((record: Permission.Record) => {
    setSelectedPermissionId(record._id);
    setView(true);
    setEdit(false);
    setVisibleForm(true);
  }, [setView, setEdit, setVisibleForm]);

  const handleEdit = useCallback((record: Permission.Record) => {
    setSelectedPermissionId(record._id);
    setEdit(true);
    setView(false);
    setVisibleForm(true);
  }, [setEdit, setView, setVisibleForm]);

  const handleAdd = useCallback(() => {
    setSelectedPermissionId(undefined);
    setRecord({} as any);
    setEdit(false);
    setView(false);
    setVisibleForm(true);
  }, [setRecord, setEdit, setView, setVisibleForm]);

  const resetFormStates = useCallback(() => {
    setSelectedPermissionId(undefined);
    setEdit(false);
    setView(false);
    setRecord({} as any);
    setVisibleForm(false);
  }, [setEdit, setView, setRecord, setVisibleForm]);

  return {
    selectedPermissionId,
    handleView,
    handleEdit,
    handleAdd,
    resetFormStates,
  };
};