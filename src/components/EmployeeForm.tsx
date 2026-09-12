import { useEffect } from 'react';
import { Form, Input, Select, Button, Space } from 'antd';
import type { Employee, EmployeeFormValues, Country } from '../types';
import {
  FIELD_LIMITS,
  isValidEmail,
  isValidLength,
  isValidMobile,
  VALIDATION_MESSAGES,
} from '../utils/validation';

const PLACEHOLDERS = {
  name: 'e.g. Sangita Zare',
  email: 'e.g. name@example.com',
  mobile: 'e.g. +919812345678',
  state: 'e.g. Maharashtra',
  district: 'e.g. Pune',
} as const;

function lengthRule(field: string, limits: { min: number; max: number }) {
  return {
    validator(_: unknown, value?: string) {
      if (!value || isValidLength(value, limits.min, limits.max)) {
        return Promise.resolve();
      }
      return Promise.reject(VALIDATION_MESSAGES.length(field, limits.min, limits.max));
    },
  };
}

interface EmployeeFormProps {
  initialValues?: Employee | null;
  countries: Country[];
  submitting: boolean;
  onSubmit: (values: EmployeeFormValues) => void;
  onCancel: () => void;
}

export default function EmployeeForm({
  initialValues,
  countries,
  submitting,
  onSubmit,
  onCancel,
}: EmployeeFormProps) {
  const [form] = Form.useForm<EmployeeFormValues>();

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        name: initialValues.name,
        email: initialValues.email,
        mobile: initialValues.mobile,
        country: initialValues.country,
        state: initialValues.state,
        district: initialValues.district,
      });
    } else {
      form.resetFields();
    }
  }, [initialValues, form]);

  const handleFinish = (values: EmployeeFormValues) => {
    onSubmit(values);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleFinish}
      data-testid="employee-form"
      requiredMark="optional"
    >
      <Form.Item
        label="Name"
        name="name"
        rules={[
          { required: true, message: VALIDATION_MESSAGES.required('Name') },
          lengthRule('Name', FIELD_LIMITS.name),
        ]}
      >
        <Input placeholder={PLACEHOLDERS.name} maxLength={FIELD_LIMITS.name.max} />
      </Form.Item>

      <Form.Item
        label="Email"
        name="email"
        rules={[
          { required: true, message: VALIDATION_MESSAGES.required('Email') },
          {
            validator: (_, value) =>
              !value || isValidEmail(value)
                ? Promise.resolve()
                : Promise.reject(VALIDATION_MESSAGES.email),
          },
        ]}
      >
        <Input placeholder={PLACEHOLDERS.email} type="email" />
      </Form.Item>

      <Form.Item
        label="Mobile"
        name="mobile"
        rules={[
          { required: true, message: VALIDATION_MESSAGES.required('Mobile') },
          {
            validator: (_, value) =>
              !value || isValidMobile(value)
                ? Promise.resolve()
                : Promise.reject(VALIDATION_MESSAGES.mobile),
          },
        ]}
      >
        <Input placeholder={PLACEHOLDERS.mobile} maxLength={FIELD_LIMITS.mobile.max} />
      </Form.Item>

      <Form.Item
        label="Country"
        name="country"
        rules={[{ required: true, message: VALIDATION_MESSAGES.required('Country') }]}
      >
        <Select
          placeholder="Select country"
          showSearch
          optionFilterProp="label"
          options={countries.map((c) => ({ value: c.country, label: c.country }))}
        />
      </Form.Item>

      <Form.Item
        label="State"
        name="state"
        rules={[
          { required: true, message: VALIDATION_MESSAGES.required('State') },
          lengthRule('State', FIELD_LIMITS.state),
        ]}
      >
        <Input placeholder={PLACEHOLDERS.state} maxLength={FIELD_LIMITS.state.max} />
      </Form.Item>

      <Form.Item
        label="District"
        name="district"
        rules={[
          { required: true, message: VALIDATION_MESSAGES.required('District') },
          lengthRule('District', FIELD_LIMITS.district),
        ]}
      >
        <Input placeholder={PLACEHOLDERS.district} maxLength={FIELD_LIMITS.district.max} />
      </Form.Item>

      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit" loading={submitting}>
            {initialValues ? 'Update Employee' : 'Add Employee'}
          </Button>
          <Button onClick={onCancel} disabled={submitting}>
            Cancel
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
}
