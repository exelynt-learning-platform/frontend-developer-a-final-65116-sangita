import { Alert, Button } from 'antd';
import { USER_MESSAGES } from '../constants/messages';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export default function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <Alert
      type="error"
      showIcon
      message={USER_MESSAGES.alertHeading}
      description={message}
      style={{ margin: '16px 0' }}
      action={
        onRetry ? (
          <Button size="small" danger onClick={onRetry}>
            Retry
          </Button>
        ) : undefined
      }
    />
  );
}
