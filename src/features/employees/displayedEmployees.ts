import type { Employee, SearchStatus } from '../../types';

export function computeDisplayedEmployees(
  searchStatus: SearchStatus,
  searchResult: Employee | null,
  list: Employee[]
): Employee[] {
  if (searchStatus === 'idle') {
    return list;
  }
  if (searchStatus === 'found' && searchResult) {
    return [searchResult];
  }
  return [];
}
