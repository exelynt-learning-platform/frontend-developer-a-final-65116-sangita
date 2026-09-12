import { Spin } from 'antd';
import { USER_MESSAGES } from '../constants/messages';

interface LoadingSpinnerProps {
  tip?: string;
}

export default function LoadingSpinner({ tip = USER_MESSAGES.loading }: LoadingSpinnerProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={tip}
      style={{ display: 'flex', justifyContent: 'center', padding: '48px 0' }}
    >
      <Spin size="large" tip={tip}>
        <div style={{ minHeight: 48 }} />
      </Spin>
    </div>
  );
}
