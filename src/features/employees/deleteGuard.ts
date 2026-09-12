import type { Employee } from '../../types';

export function ensureDeleteTarget(target: Employee | null): target is Employee {
  if (target) return true;
  console.warn('Delete confirmed with no employee selected.');
  return false;
}

export function isMissingFromList(target: Employee | null, list: Employee[]): boolean {
  return target !== null && !list.some((employee) => employee.id === target.id);
}
