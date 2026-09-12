import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';
import EmptyState from './EmptyState';
import EmployeeTable from './EmployeeTable';
import type { Employee, SearchStatus } from '../types';

interface EmployeeListContentProps {
  loading: boolean;
  countriesLoading: boolean;
  error: string | null;
  countriesError: string | null;
  searchStatus: SearchStatus;
  searchError: string | null;
  displayedEmployees: Employee[];
  onRetryEmployees: () => void;
  onRetryCountries: () => void;
  onRetrySearch: () => void;
  onEdit: (employee: Employee) => void;
  onDeleteRequest: (employee: Employee) => void;
}

export default function EmployeeListContent({
  loading,
  countriesLoading,
  error,
  countriesError,
  searchStatus,
  searchError,
  displayedEmployees,
  onRetryEmployees,
  onRetryCountries,
  onRetrySearch,
  onEdit,
  onDeleteRequest,
}: EmployeeListContentProps) {
  if (loading || countriesLoading) {
    return <LoadingSpinner tip="Loading employees..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={onRetryEmployees} />;
  }

  if (countriesError) {
    return <ErrorMessage message={countriesError} onRetry={onRetryCountries} />;
  }

  if (searchStatus === 'loading') {
    return <LoadingSpinner tip="Searching..." />;
  }

  if (searchStatus === 'not_found') {
    return <EmptyState description={searchError ?? 'No employee found with that ID.'} />;
  }

  if (searchStatus === 'error') {
    return (
      <ErrorMessage
        message={searchError ?? 'Something went wrong while searching.'}
        onRetry={onRetrySearch}
      />
    );
  }

  if (displayedEmployees.length === 0) {
    if (searchStatus !== 'idle') {
      return <EmptyState description="No employee found with that ID." />;
    }
    return <EmptyState description="No employees yet. Add one to get started." />;
  }

  return (
    <EmployeeTable employees={displayedEmployees} onEdit={onEdit} onDeleteRequest={onDeleteRequest} />
  );
}
