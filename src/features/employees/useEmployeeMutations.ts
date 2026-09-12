import { message } from 'antd';
import { useAppDispatch } from '../../app/hooks';
import { USER_MESSAGES } from '../../constants/messages';
import { createEmployee, deleteEmployee, updateEmployee } from './employeesSlice';
import type { EmployeeFormValues, RejectedPayload } from '../../types';

export function getMutationErrorMessage(err: unknown, fallback: string): string {
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
      message.success(USER_MESSAGES.employeeAdded);
      return true;
    } catch (err) {
      message.error(getMutationErrorMessage(err, USER_MESSAGES.failedToCreate));
      return false;
    }
  };

  const saveEmployee = async (id: string, values: EmployeeFormValues): Promise<boolean> => {
    try {
      await dispatch(updateEmployee({ id, payload: values })).unwrap();
      message.success(USER_MESSAGES.employeeUpdated);
      return true;
    } catch (err) {
      message.error(getMutationErrorMessage(err, USER_MESSAGES.failedToUpdate));
      return false;
    }
  };

  const removeEmployee = async (id: string): Promise<boolean> => {
    try {
      await dispatch(deleteEmployee(id)).unwrap();
      message.success(USER_MESSAGES.employeeDeleted);
      return true;
    } catch (err) {
      message.error(getMutationErrorMessage(err, USER_MESSAGES.failedToDelete));
      return false;
    }
  };

  return { addEmployee, saveEmployee, removeEmployee };
}
