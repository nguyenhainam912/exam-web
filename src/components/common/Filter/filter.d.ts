export interface FilterOption {
  label: string;
  value: string;
}

export interface FilterField {
  name: string;
  label: string;
  placeholder: string;
  options: FilterOption[];
  type?: 'select' | 'input' | 'date' | 'dateRange';
}

export interface BaseFilterPopoverProps {
  form: any;
  onFilter: () => void;
  onClearFilter: () => void;
  filterKey?: number;
  title?: string;
  width?: number;
  placement?: 'bottomLeft' | 'bottomRight' | 'topLeft' | 'topRight';
  buttonText?: string;
  buttonIcon?: React.ReactNode;
  filterFields: FilterField[];
}