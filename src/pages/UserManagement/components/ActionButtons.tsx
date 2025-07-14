import { Button, Popconfirm } from 'antd';
import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { memo } from 'react';

interface ActionButtonsProps {
  record: any;
  onView: (record: any) => void;
  onEdit: (record: any) => void;
  onDelete: (id: string) => void;
}

const BUTTON_STYLES = {
  view: { marginRight: 8, color: '#1890ff', borderColor: '#1890ff', background: '#fff' },
  edit: { marginRight: 8, background: '#fff', color: '#faad14', borderColor: '#ffe58f' },
} as const;

const ActionButtons = memo(({ record, onView, onEdit, onDelete }: ActionButtonsProps) => (
  <>
    <Button
      title="Xem chi tiết"
      icon={<EyeOutlined />}
      style={BUTTON_STYLES.view}
      onClick={() => onView(record)}
    />
    <Button
      title="Chỉnh sửa"
      icon={<EditOutlined />}
      type="primary"
      style={BUTTON_STYLES.edit}
      onClick={() => onEdit(record)}
    />
    <Popconfirm
      title="Bạn có chắc muốn xóa?"
      onConfirm={() => onDelete(record._id)}
      okText="Xóa"
      cancelText="Hủy"
    >
      <Button danger title="Xóa" icon={<DeleteOutlined />} />
    </Popconfirm>
  </>
));

ActionButtons.displayName = 'ActionButtons';

export default ActionButtons; 