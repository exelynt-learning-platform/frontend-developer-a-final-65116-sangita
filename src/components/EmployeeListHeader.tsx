import { Button, Space, Typography } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import SearchById from './SearchById';
import styles from './EmployeeListHeader.module.css';

const { Title } = Typography;

interface EmployeeListHeaderProps {
  searchLoading: boolean;
  onAdd: () => void;
  onSearch: (id: string) => void;
  onClearSearch: () => void;
}

export default function EmployeeListHeader({
  searchLoading,
  onAdd,
  onSearch,
  onClearSearch,
}: EmployeeListHeaderProps) {
  return (
    <>
      <Space className={styles.header}>
        <Title level={3}>Employee Management</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={onAdd} aria-label="Add Employee">
          Add Employee
        </Button>
      </Space>

      <div className={styles.search}>
        <SearchById onSearch={onSearch} onClear={onClearSearch} loading={searchLoading} />
      </div>
    </>
  );
}
