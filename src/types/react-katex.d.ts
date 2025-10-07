declare module 'react-katex' {
  import { ComponentType } from 'react';

  interface MathProps {
    math: string;
    errorColor?: string;
    renderError?: (error: any) => React.ReactNode;
    settings?: any;
    as?: string;
  }

  export const InlineMath: ComponentType<MathProps>;
  export const BlockMath: ComponentType<MathProps>;
  export const TeX: ComponentType<MathProps>;
}