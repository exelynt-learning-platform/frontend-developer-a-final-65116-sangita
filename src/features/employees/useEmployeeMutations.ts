import { message } from 'antd';
import { useAppDispatch } from '../../app/hooks';
import { createEmployee, deleteEmployee, updateEmployee } from './employeesSlice';
import type { EmployeeFormValues, RejectedPayload } from '../../types';

function mutationErrorMessage(err: unknown, fallback: string): string {
  if (err && typeof err === 'object' && 'message' in err) {
    const payload = err as RejectedPayload;
    if (typeof payload.message === 'string' && payload.message.length > 0) {
      return payload.message;
    }
  }
  return fallback;
}

export function useEmployeeMutations() {
  const dispatch = useAppDispatch();

  const addEmployee = async (values: EmployeeFormValues): Promise<boolean> => {
    try {
      await dispatch(createEmployee(values)).unwrap();
      message.success('Employee added successfully.');
      return true;
    } catch (err) {
      message.error(mutationErrorMessage(err, 'Failed to create employee.'));
      return false;
    }
  };

  const saveEmployee = async (id: string, values: EmployeeFormValues): Promise<boolean> => {
    try {
      await dispatch(updateEmployee({ id, payload: values })).unwrap();
      message.success('Employee updated successfully.');
      return true;
    } catch (err) {
      message.error(mutationErrorMessage(err, 'Failed to update employee.'));
      return false;
    }
  };

  const removeEmployee = async (id: string): Promise<boolean> => {
    try {
      await dispatch(deleteEmployee(id)).unwrap();
      message.success('Employee deleted successfully.');
      return true;
    } catch (err) {
      message.error(mutationErrorMessage(err, 'Failed to delete employee.'));
      return false;
    }
  };

  return { addEmployee, saveEmployee, removeEmployee };
}
