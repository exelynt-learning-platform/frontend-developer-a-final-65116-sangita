export interface Employee {
  id: string;
  name: string;
  email: string;
  mobile: string;
  country: string;
  state: string;
  district: string;
}

export type EmployeeFormValues = Omit<Employee, 'id'>;

export interface Country {
  id: string;
  // mockapi uses "country" as the display-name field
  country: string;
}

export interface AsyncState {
  loading: boolean;
  error: string | null;
}
