import { Button } from 'antd';
import { PlusCircleOutlined, UploadOutlined } from '@ant-design/icons';
import { memo } from 'react';
import { FilterField } from '@/components/common/Filter/filter';
import SearchInput from '@/components/common/Search/SearchInput';
import FilterPopover from '@/components/common/Filter/FilterPopover';
import { ALL_PERMISSIONS } from '@/config/permissions';
import Access from '@/components/share/access';

interface TableHeaderProps {
  title: string;
  textSearch: string;
  onSearchChange: (value: string) => void;
  filterForm: any;
  onFilter: () => void;
  onClearFilter: () => void;
  filterKey: number;
  filterFields: FilterField[];
  onAdd: () => void;
  onUpload?: () => void;
  showAddButton?: boolean;
  addButtonText?: string;
  showUploadButton?: boolean;
  uploadButtonText?: string;
  showFilter?: boolean;
  showSearch?: boolean;
}

const TableHeader = memo(({
  title,
  textSearch,
  onSearchChange,
  filterForm,
  onFilter,
  onClearFilter,
  filterKey,
  filterFields,
  onAdd,
  onUpload,
  showAddButton = true,
  addButtonText = "Thêm mới",
  showUploadButton = false,
  uploadButtonText = "Upload File",
  showFilter = true,
  showSearch = true
}: TableHeaderProps) => (
  <div className="table-header" style={{ marginBottom: 16 }}>
    <h3 style={{ marginBottom: 12 }}>{title}</h3>
    <div style={{ 
      display: 'flex', 
      justifyContent: 'flex-end', 
      alignItems: 'center', 
      gap: 8 
    }}>
      {showSearch && (
        <SearchInput
          value={textSearch}
          onChange={onSearchChange}
          placeholder="Nhập từ khoá tìm kiếm đề thi"
          style={{ width: 220, marginTop: 5 }}
        />
      )}
      {showFilter && (
        <FilterPopover
          form={filterForm}
          onFilter={onFilter}
          onClearFilter={onClearFilter}
          filterKey={filterKey}
          filterFields={filterFields}
        />
      )}
      {showUploadButton && onUpload && (
        <Button 
          icon={<UploadOutlined />}
          onClick={onUpload}
          style={{ marginLeft: 5, marginTop: 5 }}
        >
          {uploadButtonText}
        </Button>
      )}
      {showAddButton && (
        <Access permission={ALL_PERMISSIONS.EXAMS?.CREATE} hideChildren={true}>
            <Button 
              type="primary" 
              style={{ marginLeft: 5, marginTop: 5 }}
              icon={<PlusCircleOutlined />}
              onClick={onAdd}
            >
              {addButtonText}
            </Button>
        </Access>
      )}
    </div>
  </div>
));

TableHeader.displayName = 'TableHeader';

export default TableHeader; 