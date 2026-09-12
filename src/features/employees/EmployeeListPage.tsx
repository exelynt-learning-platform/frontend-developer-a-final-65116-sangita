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
import EmployeeForm from '../../components/EmployeeForm';
import SearchById from '../../components/SearchById';
import ConfirmDeleteModal from '../../components/ConfirmDeleteModal';
import EmployeeListContent from '../../components/EmployeeListContent';
import { computeDisplayedEmployees } from './displayedEmployees';
import type { Employee, EmployeeFormValues } from '../../types';
import styles from './EmployeeListPage.module.css';

const { Title } = Typography;

export default function EmployeeListPage() {
  const dispatch = useAppDispatch();

  const {
    list,
    loading,
    error,
    mutationLoading,
    mutationError,
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
    dispatch(searchEmployeeById(id));
  };

  const handleClearSearch = () => {
    dispatch(clearSearch());
  };

  const displayedEmployees = computeDisplayedEmployees(searchStatus, searchResult, list);

  return (
    <div className={styles.page}>
      <Space className={styles.header}>
        <Title level={3}>
          Employee Management
        </Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAddClick}>
          Add Employee
        </Button>
      </Space>

      <div className={styles.search}>
        <SearchById
          onSearch={handleSearch}
          onClear={handleClearSearch}
          loading={searchStatus === 'loading'}
        />
      </div>

      <EmployeeListContent
        loading={loading}
        countriesLoading={countriesLoading}
        error={error}
        countriesError={countriesError}
        searchStatus={searchStatus}
        searchError={searchError}
        displayedEmployees={displayedEmployees}
        onRetryEmployees={() => dispatch(fetchEmployees())}
        onRetryCountries={() => dispatch(fetchCountries())}
        onRetrySearch={() => dispatch(searchEmployeeById(searchQuery))}
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
