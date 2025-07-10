import { useState, useEffect, useCallback } from 'react';
import { Form } from 'antd';

interface UsePermissionFiltersProps {
  cond: any;
  setCondition: (cond: any) => void;
  page: number;
  limit: number;
}

export const usePermissionFilters = ({ cond, setCondition, page, limit }: UsePermissionFiltersProps) => {
  const [textSearch, setTextSearch] = useState<string>('');
  const [filterForm] = Form.useForm();
  const [filterKey, setFilterKey] = useState(0);

  // Sync form values with cond state
  useEffect(() => {
    if (filterForm) {
      filterForm.setFieldsValue({
        method: cond.method || undefined,
        module: cond.module || undefined,
      });
    }
  }, [cond, filterForm]);

  // Debounce search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (!textSearch || textSearch.trim() === '') {
        const newCond = { ...cond };
        delete newCond.q;
        setCondition({ ...newCond });
      } else {
        setCondition({ ...cond, q: textSearch });
      }
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [textSearch, cond, setCondition]);

  const handleFilter = useCallback(() => {
    const filterValues = filterForm.getFieldsValue();
    const newCond = { ...cond, ...filterValues };
    if (!filterValues.method) delete newCond.method;
    if (!filterValues.module) delete newCond.module;
    setCondition(newCond);
  }, [filterForm, cond, setCondition]);

  const handleClearFilter = useCallback(() => {
    const newCond = { page, limit };
    setCondition(newCond);
    setTextSearch('');
    filterForm.resetFields();
    setFilterKey(prev => prev + 1);
  }, [page, limit, setCondition, filterForm]);

  return {
    textSearch,
    setTextSearch,
    filterForm,
    filterKey,
    handleFilter,
    handleClearFilter,
  };
};
