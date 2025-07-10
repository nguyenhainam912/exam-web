import {
  EditFilled,
  PlusCircleOutlined,
  SearchOutlined
} from '@ant-design/icons';
import { Button, Input, Tag } from 'antd';
import { useEffect, useState } from 'react';

import type { IColumn } from '@/utils/interfaces';

import TableBase from '@/components/common/Table';
import { useUserQuery } from '@/hooks/react-query/useUser/useUserQuery';
import useUserStore from '@/stores/user';
import FormUser from './components/FormUser';
const AccountManagement = () => {
  const {
    edit,
    page,
    limit,
    cond,
    setRecord,
    setVisibleForm,
    setCondition,
    setEdit
  } = useUserStore();
  const { data, isLoading } = useUserQuery({ page, limit, cond })
  const [textSearch, setTextSearch] = useState<string>();

  useEffect(() => {
    let timeoutId: any;
    const handleInput = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        if (!textSearch || textSearch?.trim() === '') {
        delete cond?.q
        setCondition({...cond})
        } else {
        setCondition({...cond, q: textSearch})
        }
      }, 500);
    };
    handleInput();
    return () => {
      clearTimeout(timeoutId);
    };
  }, [textSearch]);

  const handleEdit = async (record: any) => {
    setRecord(record)
    setEdit(true);
    setVisibleForm(true);
  };

  const renderLast = (record: any) => {
    return (
      <>
        <Button
          title="Chỉnh sửa"
          icon={<EditFilled />}
          onClick={() =>  handleEdit(record)}
        />
      </>
    );
  };
  useEffect(() => {
    setCondition({})
  }, [])
  const columns: IColumn<any[]>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      align: 'center',
      width: 80,
      fixed: 'left'
    },
    {
      title: "Họ tên",
      dataIndex: 'fullName',
      align: 'center',
      width: 200,
      fixed: 'left'
    },
    {
      title: "Email",
      dataIndex: 'email',
      align: 'center',
      width: 200,
    },
    {
      title: 'Vai trò',
      dataIndex: 'userInfos',
      align: 'center',
      width: 200,
      render: (value, record: any) => {
        return value?.map((userInfo: any) => 
          <Tag> {userInfo?.roles?.map((item: any, index: string) => 
            userInfo?.roles?.length > index + 1 ? `${item?.name}, ` : item?.name)} 
           </Tag>
        )
      }
    },
    {
    title: "Thao tác",
    align: 'center',
    width: 100,
    render: (_, record) => renderLast(record)
    }
  ];
  return (
    <TableBase
      border
      columns={columns}
      dependencies={[page, limit, cond]}
      dataSource={data || []}
      loading={isLoading}
      storeName="user"
      Form={FormUser}
      formType="Drawer"
      widthDrawer="60%"
      onCloseForm={() => {
        setEdit(false)
        setRecord({} as any)
      }}
      titleForm={edit ? "Cập nhật tài khoản" : "Thêm mới tài khoản"}
    >
      <div className='table-header'>
        <h3>Quản lý tài khoản</h3>
        <div className='table-header-right'>
          <Input
            style={{ width: '20%', marginTop: 5}}
            value={textSearch}
            onChange={(value) => setTextSearch(value?.target?.value)}
            allowClear
            placeholder="Nhập từ khoá tìm kiếm"
            addonBefore={<SearchOutlined />}
          />
          <Button 
            type='primary' 
            style={{ marginLeft: 5, marginTop: 5}}
            onClick={() => setVisibleForm(true)}
            icon={<PlusCircleOutlined />}
          >
            Thêm mới
          </Button>
        </div>
      </div>
    </TableBase>
  );
}; 

export default AccountManagement;
