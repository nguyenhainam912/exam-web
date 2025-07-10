import { Button } from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons';
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
  showAddButton?: boolean;
  addButtonText?: string;
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
  showAddButton = true,
  addButtonText = "Thêm mới",
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
          placeholder="Nhập từ khoá tìm kiếm khối lớp"
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
      {showAddButton && (
        <Access permission={ALL_PERMISSIONS.GRADE_LEVELS.CREATE} hideChildren={true}>
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