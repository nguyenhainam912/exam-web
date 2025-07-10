import { getStore } from '@/stores';
import { EditFilled, EyeOutlined, LockFilled } from '@ant-design/icons';
import { Button, Popconfirm, Space } from 'antd';

type Props = {
  actions: any[];
  record: any;
  storeName: string;
}

const RenderLast = ({ actions, record, storeName}: Props) => {

  const store = getStore(storeName);
  const {
    setPage,
    setLimit,
    filterInfo,
    setFilterInfo,
    setCondition,
    setView,
    setEdit,
    setVisibleForm,
    setRecord,
  } = store();
  
  const handleActions = (record: any, type: string) => {
    if(type === 'view') {
      setRecord(record); 
      setView(true);
      setVisibleForm(true);
    } 
    if(type === 'edit') {
      setRecord(record); 
      setEdit(true);
      setVisibleForm(true);
    } 
  }
  return (
    <Space>
      {actions?.map((action: any) => {
        return (action?.status || action?.status === undefined) && ( 
          action?.type === 'delete' 
          ? ( <Popconfirm
                title='bạn có chắc muốn xóa'
                onConfirm={() => action?.deleteRecord()}
                // disabled={view}
              >
                <Button
                  danger
                  title={action?.title}
                  icon={action?.icon}
                />
              </Popconfirm> )
          : ( <Button
                title={action?.title}
                icon={action?.icon}
                onClick={() => handleActions(record, action?.type)}
              />)
        )
      })}
    </Space>
  );
};

  export default RenderLast;
