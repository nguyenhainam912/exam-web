import { useMemo } from 'react';
import { Result } from "antd";
import { usePermission } from '@/hooks/usePermission';
import { Permission } from '@/utils/permissionManager';

interface IProps {
    hideChildren?: boolean;
    children: React.ReactNode;
    permission: Permission;
}

const Access = (props: IProps) => {
    const { permission, hideChildren = false } = props;
    const { hasPermission } = usePermission();
    
    const allow = useMemo(() => {
        return hasPermission(permission);
    }, [hasPermission, permission]);

    // Nếu không có quyền và hideChildren = true thì không render gì
    if (hideChildren && !allow) {
        return null;
    }

    // Nếu có quyền thì render children
    if (allow) {
        return <>{props.children}</>;
    }

    // Nếu không có quyền thì render 403 error
    return (
        <Result
            status="403"
            title="Truy cập bị từ chối"
            subTitle="Xin lỗi, bạn không có quyền hạn truy cập thông tin này"
        />
    );
};

export default Access;