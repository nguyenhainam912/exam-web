import { useState, useEffect, useCallback } from 'react';
import { Form } from 'antd';

interface UseGradeLevelFiltersProps {
  cond: any;
  setCondition: (cond: any) => void;
  page: number;
  limit: number;
}

export const useGradeLevelFilters = ({ cond, setCondition, page, limit }: UseGradeLevelFiltersProps) => {
  const [textSearch, setTextSearch] = useState<string>('');
  const [filterForm] = Form.useForm();
  const [filterKey, setFilterKey] = useState(0);

  useEffect(() => {
    if (!filterForm) return;

    // Nếu user đang chỉnh trường trên form thì không ghi đè
    try {
      const isTouched = filterForm.isFieldsTouched();
      if (isTouched) return;
    } catch (e) {
      // ignore if method not available
    }

    const newValues = {
      name: cond?.name ?? undefined,
      code: cond?.code ?? undefined,
    };

    // tránh gọi setFieldsValue nếu giống giá trị hiện tại
    try {
      const current = filterForm.getFieldsValue();
      const same = Object.keys(newValues).every((k) => {
        // @ts-ignore
        return current[k] === (newValues as any)[k];
      });
      if (!same) filterForm.setFieldsValue(newValues);
    } catch {
      filterForm.setFieldsValue(newValues);
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
    if (!filterValues.name) delete newCond.name;
    if (!filterValues.code) delete newCond.code;
    setCondition(newCond);
  }, [filterForm, cond, setCondition]);

  const handleClearFilter = useCallback(() => {
    const newCond = { page, limit };
    setCondition(newCond);
    setTextSearch('');
    filterForm.resetFields();
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