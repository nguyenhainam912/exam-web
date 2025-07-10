import { useState, useEffect, useCallback } from 'react';
import { Form } from 'antd';

interface UseRoleFiltersProps {
  cond: any;
  setCondition: (cond: any) => void;
  page: number;
  limit: number;
}

export const useRoleFilters = ({ cond, setCondition, page, limit }: UseRoleFiltersProps) => {
  const [textSearch, setTextSearch] = useState<string>('');
  const [filterForm] = Form.useForm();
  const [filterKey, setFilterKey] = useState(0);

  useEffect(() => {
    if (filterForm) {
      filterForm.setFieldsValue({
        isActive: cond.isActive !== undefined ? cond.isActive : undefined,
      });
    }
  }, [cond, filterForm]);

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
    if (filterValues.isActive === undefined) delete newCond.isActive;
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