# Employee Management Application

React + Redux Toolkit + Ant Design app for managing employees via the provided mock API.

## Features

- List employees (Name, Email, Mobile, Country) with pagination and sorting
- Search by employee ID, with a clear not-found message
- Add, edit, and delete employees (delete requires confirmation)
- Form fields: Name, Email, Mobile, Country, State, District
- Validation for required fields, email format, and field lengths
- Loading, error, and empty states
- Redux Toolkit for employee and country state

## Tech stack

- React 19 + TypeScript (Vite)
- Redux Toolkit
- Ant Design
- Axios
- Vitest + React Testing Library

## Project structure

```
src/
  api/client.ts
  app/                  # store + typed hooks
  features/
    employees/          # API, slice, list page
    countries/          # API, slice
  components/           # presentational UI pieces
  utils/validation.ts
  types/
  tests/
```

`EmployeeListPage` handles Redux and business logic. Components under `components/` take props only (no store access).

## Getting started

```bash
npm install
npm run dev
npm run build
npm run test
npm run test:watch
npm run test:coverage
```

## API

Base URL is set in `src/api/client.ts`.

- `GET /country`
- `GET /employee`, `GET /employee/:id`
- `POST /employee`, `PUT /employee/:id`, `DELETE /employee/:id`

## Testing

Unit tests cover validation helpers, API calls (mocked), Redux slices, form validation, table interactions, and the list page flows (search, delete confirm, empty/error states).
