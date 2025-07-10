import { Button, Popconfirm } from 'antd';
import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { memo } from 'react';
import type { GradeLevelRecord } from '@/stores/gradeLevel';
import { ALL_PERMISSIONS } from '@/config/permissions';
import Access from '@/components/share/access';

interface ActionButtonsProps {
  record: GradeLevelRecord;
  onView: (record: GradeLevelRecord) => void;
  onEdit: (record: GradeLevelRecord) => void;
  onDelete: (id: string) => void;
}

const BUTTON_STYLES = {
  view: { 
    marginRight: 8, 
    color: '#1890ff', 
    borderColor: '#1890ff', 
    background: '#fff' 
  },
  edit: { 
    marginRight: 8, 
    background: '#fff', 
    color: '#faad14', 
    borderColor: '#ffe58f' 
  },
} as const;

const ActionButtons = memo(({ record, onView, onEdit, onDelete }: ActionButtonsProps) => (
  <>
    <Access permission={ALL_PERMISSIONS.GRADE_LEVELS.GET_BY_ID} hideChildren={true}>
      <Button
        title="Xem chi tiết"
        icon={<EyeOutlined />}
        style={BUTTON_STYLES.view}
        onClick={() => onView(record)}
      />
    </Access>
    <Access permission={ALL_PERMISSIONS.GRADE_LEVELS.UPDATE} hideChildren={true}>
      <Button
        title="Chỉnh sửa"
        icon={<EditOutlined />}
        type="primary"
        style={BUTTON_STYLES.edit}
        onClick={() => onEdit(record)}
      />
    </Access>
    <Access permission={ALL_PERMISSIONS.GRADE_LEVELS.DELETE} hideChildren={true}>
      <Popconfirm
        title="Bạn có chắc muốn xóa?"
        onConfirm={() => onDelete(record._id!)}
        okText="Xóa"
        cancelText="Hủy"
      >
        <Button danger title="Xóa" icon={<DeleteOutlined />} />
      </Popconfirm>
    </Access>
  </>
));

ActionButtons.displayName = 'ActionButtons';

export default ActionButtons; 