import { Empty } from 'antd';

interface EmptyStateProps {
  description?: string;
}

export default function EmptyState({ description = 'No employees found.' }: EmptyStateProps) {
  return <Empty description={description} style={{ padding: '48px 0' }} />;
}
