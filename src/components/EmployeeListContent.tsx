import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';
import EmptyState from './EmptyState';
import EmployeeTable from './EmployeeTable';
import type { ListViewState } from '../features/employees/listViewState';
import type { Employee } from '../types';

interface EmployeeListContentProps {
  view: ListViewState;
  onEdit: (employee: Employee) => void;
  onDeleteRequest: (employee: Employee) => void;
}

export default function EmployeeListContent({
  view,
  onEdit,
  onDeleteRequest,
}: EmployeeListContentProps) {
  switch (view.type) {
    case 'loading':
      return <LoadingSpinner tip={view.tip} />;
    case 'error':
      return <ErrorMessage message={view.message} onRetry={view.retry} />;
    case 'empty':
      return <EmptyState description={view.description} />;
    case 'ready':
      return (
        <EmployeeTable employees={view.employees} onEdit={onEdit} onDeleteRequest={onDeleteRequest} />
      );
  }
}
