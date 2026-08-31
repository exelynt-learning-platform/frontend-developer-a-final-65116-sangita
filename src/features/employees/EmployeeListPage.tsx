import { useEffect, useState } from 'react';
import { Button, Modal, Typography, Space, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { fetchCountries } from '../countries/countriesSlice';
import {
  fetchEmployees,
  searchEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  clearSearch,
  clearMutationError,
} from './employeesSlice';
import EmployeeTable from '../../components/EmployeeTable';
import EmployeeForm from '../../components/EmployeeForm';
import SearchById from '../../components/SearchById';
import ConfirmDeleteModal from '../../components/ConfirmDeleteModal';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import EmptyState from '../../components/EmptyState';
import type { Employee, EmployeeFormValues } from '../../types';

const { Title } = Typography;

export default function EmployeeListPage() {
  const dispatch = useAppDispatch();

  const { list, loading, error, mutationLoading, mutationError, searchResult, searchStatus, searchError } =
    useAppSelector((s) => s.employees);
  const { list: countries, loading: countriesLoading, error: countriesError } = useAppSelector(
    (s) => s.countries
  );

  const [formOpen, setFormOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Employee | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [lastSearchedId, setLastSearchedId] = useState('');

  useEffect(() => {
    dispatch(fetchEmployees());
    dispatch(fetchCountries());
  }, [dispatch]);

  useEffect(() => {
    if (mutationError) {
      message.error(mutationError);
      dispatch(clearMutationError());
    }
  }, [mutationError, dispatch]);

  const handleAddClick = () => {
    setEditingEmployee(null);
    setFormOpen(true);
  };

  const handleEditClick = (employee: Employee) => {
    setEditingEmployee(employee);
    setFormOpen(true);
  };

  const handleFormSubmit = async (values: EmployeeFormValues) => {
    if (editingEmployee) {
      const result = await dispatch(updateEmployee({ id: editingEmployee.id, payload: values }));
      if (updateEmployee.fulfilled.match(result)) {
        message.success('Employee updated successfully.');
        setFormOpen(false);
      }
    } else {
      const result = await dispatch(createEmployee(values));
      if (createEmployee.fulfilled.match(result)) {
        message.success('Employee added successfully.');
        setFormOpen(false);
      }
    }
  };

  const handleDeleteRequest = (employee: Employee) => setDeleteTarget(employee);

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    const result = await dispatch(deleteEmployee(deleteTarget.id));
    if (deleteEmployee.fulfilled.match(result)) {
      message.success('Employee deleted successfully.');
    }
    setDeleteTarget(null);
  };

  const handleSearch = (id: string) => {
    setIsSearching(true);
    setLastSearchedId(id);
    dispatch(searchEmployeeById(id));
  };

  const handleClearSearch = () => {
    setIsSearching(false);
    setLastSearchedId('');
    dispatch(clearSearch());
  };

  const displayedEmployees = isSearching
    ? searchStatus === 'found' && searchResult
      ? [searchResult]
      : []
    : list;

  const renderContent = () => {
    if (loading || countriesLoading) return <LoadingSpinner tip="Loading employees..." />;
    if (error) return <ErrorMessage message={error} onRetry={() => dispatch(fetchEmployees())} />;
    if (countriesError)
      return <ErrorMessage message={countriesError} onRetry={() => dispatch(fetchCountries())} />;

    if (isSearching) {
      if (searchStatus === 'loading') return <LoadingSpinner tip="Searching..." />;
      if (searchStatus === 'not_found') {
        return <EmptyState description={searchError ?? 'No employee found with that ID.'} />;
      }
      if (searchStatus === 'error') {
        return (
          <ErrorMessage
            message={searchError ?? 'Something went wrong while searching.'}
            onRetry={() => dispatch(searchEmployeeById(lastSearchedId))}
          />
        );
      }
    }

    if (displayedEmployees.length === 0) {
      return (
        <EmptyState
          description={isSearching ? 'No employee found with that ID.' : 'No employees yet. Add one to get started.'}
        />
      );
    }

    return (
      <EmployeeTable
        employees={displayedEmployees}
        onEdit={handleEditClick}
        onDeleteRequest={handleDeleteRequest}
      />
    );
  };

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: 24 }}>
      <Space style={{ width: '100%', justifyContent: 'space-between', marginBottom: 16 }}>
        <Title level={3} style={{ margin: 0 }}>
          Employee Management
        </Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAddClick}>
          Add Employee
        </Button>
      </Space>

      <div style={{ marginBottom: 16 }}>
        <SearchById
          onSearch={handleSearch}
          onClear={handleClearSearch}
          loading={searchStatus === 'loading'}
        />
      </div>

      {renderContent()}

      <Modal
        title={editingEmployee ? 'Edit Employee' : 'Add Employee'}
        open={formOpen}
        onCancel={() => setFormOpen(false)}
        footer={null}
        destroyOnHidden
      >
        <EmployeeForm
          initialValues={editingEmployee}
          countries={countries}
          submitting={mutationLoading}
          onSubmit={handleFormSubmit}
          onCancel={() => setFormOpen(false)}
        />
      </Modal>

      <ConfirmDeleteModal
        open={!!deleteTarget}
        employeeName={deleteTarget?.name ?? ''}
        confirmLoading={mutationLoading}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
