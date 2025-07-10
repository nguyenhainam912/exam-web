import { Tag } from 'antd';
import { memo } from 'react';

interface MethodTagProps {
  method: string;
}

const METHOD_COLORS = {
  GET: 'green',
  POST: 'blue',
  PUT: 'gold',
  DELETE: 'red',
} as const;

const MethodTag = memo(({ method }: MethodTagProps) => {
  const color = METHOD_COLORS[method as keyof typeof METHOD_COLORS] || 'default';
  
  return (
    <Tag color={color} style={{ fontWeight: 600 }}>
      {method}
    </Tag>
  );
});

MethodTag.displayName = 'MethodTag';

export default MethodTag;