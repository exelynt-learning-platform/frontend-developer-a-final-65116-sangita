import { useCallback, useEffect, useState } from 'react';
import { Modal } from 'antd';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { fetchCountries } from '../countries/countriesSlice';
import { fetchEmployees, searchEmployeeById, clearSearch } from './employeesSlice';
import { useEmployeeMutations } from './useEmployeeMutations';
import { computeDisplayedEmployees } from './displayedEmployees';
import { resolveListState } from './listViewState';
import EmployeeForm from '../../components/EmployeeForm';
import ConfirmDeleteModal from '../../components/ConfirmDeleteModal';
import EmployeeListContent from '../../components/EmployeeListContent';
import EmployeeListHeader from '../../components/EmployeeListHeader';
import type { Employee, EmployeeFormValues } from '../../types';
import styles from './EmployeeListPage.module.css';

export default function EmployeeListPage() {
  const dispatch = useAppDispatch();
  const { addEmployee, saveEmployee, removeEmployee } = useEmployeeMutations();

  const {
    list,
    loading,
    error,
    mutationLoading,
    searchResult,
    searchStatus,
    searchError,
    searchQuery,
  } = useAppSelector((s) => s.employees);
  const {
    list: countries,
    loading: countriesLoading,
    error: countriesError,
  } = useAppSelector((s) => s.countries);

  const [formOpen, setFormOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Employee | null>(null);

  useEffect(() => {
    dispatch(fetchEmployees());
    dispatch(fetchCountries());
  }, [dispatch]);

  const handleAddClick = () => {
    setEditingEmployee(null);
    setFormOpen(true);
  };

  const handleEditClick = useCallback((employee: Employee) => {
    setEditingEmployee(employee);
    setFormOpen(true);
  }, []);

  const handleDeleteRequest = useCallback((employee: Employee) => {
    setDeleteTarget(employee);
  }, []);

  const handleFormSubmit = async (values: EmployeeFormValues) => {
    const succeeded = editingEmployee
      ? await saveEmployee(editingEmployee.id, values)
      : await addEmployee(values);
    if (succeeded) {
      setFormOpen(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) {
      console.warn('Delete confirmed with no employee selected.');
      return;
    }
    await removeEmployee(deleteTarget.id);
    setDeleteTarget(null);
  };

  const displayedEmployees = computeDisplayedEmployees(searchStatus, searchResult, list);
  const listView = resolveListState({
    loading,
    countriesLoading,
    error,
    countriesError,
    searchStatus,
    searchError,
    displayedEmployees,
    onRetryEmployees: () => dispatch(fetchEmployees()),
    onRetryCountries: () => dispatch(fetchCountries()),
    onRetrySearch: () => dispatch(searchEmployeeById(searchQuery)),
  });

  return (
    <div className={styles.page}>
      <EmployeeListHeader
        searchLoading={searchStatus === 'loading'}
        onAdd={handleAddClick}
        onSearch={(id) => dispatch(searchEmployeeById(id))}
        onClearSearch={() => dispatch(clearSearch())}
      />

      <EmployeeListContent
        view={listView}
        onEdit={handleEditClick}
        onDeleteRequest={handleDeleteRequest}
      />

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
