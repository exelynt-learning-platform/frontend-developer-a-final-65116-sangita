import { Modal } from 'antd';

interface ConfirmDeleteModalProps {
  open: boolean;
  employeeName: string;
  confirmLoading: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDeleteModal({
  open,
  employeeName,
  confirmLoading,
  onConfirm,
  onCancel,
}: ConfirmDeleteModalProps) {
  return (
    <Modal
      title="Delete employee"
      open={open}
      onOk={onConfirm}
      onCancel={onCancel}
      confirmLoading={confirmLoading}
      okText="Delete"
      okButtonProps={{ danger: true }}
      cancelText="Cancel"
    >
      <p>
        Are you sure you want to delete <strong>{employeeName}</strong>? This action cannot be
        undone.
      </p>
    </Modal>
  );
}
