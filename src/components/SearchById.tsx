import { useState } from 'react';
import { Input, Button, Space } from 'antd';
import { SearchOutlined, CloseOutlined } from '@ant-design/icons';

interface SearchByIdProps {
  onSearch: (id: string) => void;
  onClear: () => void;
  loading: boolean;
}

export default function SearchById({ onSearch, onClear, loading }: SearchByIdProps) {
  const [value, setValue] = useState('');

  const handleSearch = () => {
    if (value.trim()) {
      onSearch(value.trim());
    }
  };

  const handleClear = () => {
    setValue('');
    onClear();
  };

  return (
    <Space>
      <Input
        placeholder="Search employee by ID"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onPressEnter={handleSearch}
        aria-label="Search employee by ID"
        allowClear
        style={{ width: 220 }}
      />
      <Button
        type="primary"
        icon={<SearchOutlined />}
        onClick={handleSearch}
        loading={loading}
        disabled={!value.trim()}
      >
        Search
      </Button>
      <Button icon={<CloseOutlined />} onClick={handleClear}>
        Clear
      </Button>
    </Space>
  );
}
