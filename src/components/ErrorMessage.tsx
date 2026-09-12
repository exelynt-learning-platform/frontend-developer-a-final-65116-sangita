import { Alert, Button } from 'antd';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export default function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <Alert
      type="error"
      showIcon
      title="Something went wrong"
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
