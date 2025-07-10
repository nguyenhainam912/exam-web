
import { message, Select, Spin } from 'antd';

import useResizeMobile from '@/hooks/useResizeMobile';
import { useEffect, useState } from 'react';
import { useAppStore } from '@/stores/appStore';
import { useNavigate } from 'react-router-dom';

const ActionRole = () => {
  const navigate = useNavigate();
  const isTablet = useResizeMobile()
  const { currentUser, roles, setRoles } = useAppStore();
  const [role, setRole] = useState<any>()

  
  const handleChangeVaiTro = (warehouseId: string) => {
    if(role?.warehouseId !== warehouseId) {
      localStorage.setItem('warehouseId', warehouseId);
      setRole({warehouseId: warehouseId})
      navigate('/', {replace: true});
      message.success('Đổi vai trò thành công', 0.3, () => {
        window.location.reload(); 
      });
    }
  };
  
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{margin: '0 10px 0 0', fontSize: '16px', fontWeight: '600'}}>{isTablet ? '' : 'Vai trò:'}</p>
      <Select
        value={localStorage.getItem('warehouseId')}
        onChange={handleChangeVaiTro}
        style={{ width: 200 }}
        placeholder="Lựa chọn vai trò"
        optionFilterProp="label"
        options={roles?.map((item: any) => ({
          label: item?.name,
          value: item?.warehouseId
        }))}
      />
    </div>
  );
};

export default ActionRole;
