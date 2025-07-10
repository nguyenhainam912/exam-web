import { Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { memo } from 'react';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  style?: React.CSSProperties;
}

const SearchInput = memo(({ value, onChange, placeholder, style }: SearchInputProps) => (
  <Input
    style={style}
    value={value}
    onChange={(e) => onChange(e.target.value)}
    allowClear
    placeholder={placeholder}
    addonBefore={<SearchOutlined />}
  />
));

export default SearchInput;