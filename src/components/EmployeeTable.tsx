import { Table, Button, Space, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { Employee } from '../types';

interface EmployeeTableProps {
  employees: Employee[];
  onEdit: (employee: Employee) => void;
  onDeleteRequest: (employee: Employee) => void;
}

export default function EmployeeTable({ employees, onEdit, onDeleteRequest }: EmployeeTableProps) {
  const columns: ColumnsType<Employee> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 70,
      render: (id: string) => <span style={{ fontFamily: 'monospace' }}>{id}</span>,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Mobile',
      dataIndex: 'mobile',
      key: 'mobile',
    },
    {
      title: 'Country',
      dataIndex: 'country',
      key: 'country',
      render: (country: string) => <Tag>{country}</Tag>,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button size="small" onClick={() => onEdit(record)} aria-label={`Edit ${record.name}`}>
            Edit
          </Button>
          <Button
            size="small"
            danger
            onClick={() => onDeleteRequest(record)}
            aria-label={`Delete ${record.name}`}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Table
      rowKey="id"
      columns={columns}
      dataSource={employees}
      pagination={{ pageSize: 10, showSizeChanger: true }}
      scroll={{ x: 'max-content' }}
    />
  );
}
