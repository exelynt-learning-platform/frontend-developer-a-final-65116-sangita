import { Spin } from 'antd';

interface LoadingSpinnerProps {
  tip?: string;
}

export default function LoadingSpinner({ tip = 'Loading...' }: LoadingSpinnerProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      style={{ display: 'flex', justifyContent: 'center', padding: '48px 0' }}
    >
      <Spin size="large" description={tip} />
    </div>
  );
}
