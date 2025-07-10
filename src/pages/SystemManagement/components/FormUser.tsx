import { useRoleQuery } from '@/hooks/react-query/useRole/useRoleQuery';
// import { usePostUserMutation, usePutUserMutation } from '@/hooks/react-query/useUser/useUserMutation';
import useUserStore from '@/stores/user';
import rules from '@/utils/rules';
import {
  Button,
  Card,
  Col,
  Divider,
  Form,
  Input,
  message,
  Row,
  Select,
  Spin
} from 'antd';
import { useState } from 'react';

const ACCOUNT_TYPE = [
  {
    label: 'Mobifone',
    value: 'MOBIFONE'
  },
  {
    label: 'Đối tác',
    value: 'PARTNER'
  }
]

const PARTNER_ROLES = [
  {
    label: 'Quản trị viên',
    value: 'admin'
  },
  {
    label: 'Nhân viên',
    value: 'employee'
  }
]
const FormUser = () => {
  const [form] = Form.useForm();
  const [formField] = Form.useForm();
  // const { data: roleList, isLoading: isloadingRole } = useRoleQuery({ page, limit, cond })

  // const { mutateAsync, isPending } = usePostUserMutation({
  //   onSuccess: () => {
  //     setVisibleForm(true),
  //     message.success("Tạo tài khoản thành công!")
  //   },
  //   onError: () => {},
  //   params: { page, limit, cond}
  // });
  // const {mutateAsync: putUserMutation, isPending: isPendingPut} = usePutUserMutation({
  //   onSuccess: () => {
  //     setRecord({} as any);
  //     setVisibleForm(false);
  //     message.success("Lưu thành công");
  //   },
  //   onError: () => {
  //   },
  //   params: {page, limit, cond}
  // })

  // const onFinish = async (formData: any) => {
  //   try {
  //     const body = {
  //       ...formData,
  //     }
  //     if (formData.type === 'PARTNER') {
  //       body.userPartner = {
  //         partnerIds: formData?.partnerIds,
  //         type: formData?.roleIds
  //       }
  //     } else {
  //       body.userInfo = {
  //         provinceIds: formData?.provinceIds,
  //         roleIds: formData?.roleIds,
  //         warehouseIds: formData?.warehouseId
  //       }
  //     }
  //     delete body.type
  //     delete body.partnerIds
  //     delete body.provinceIds
  //     delete body.roleIds
  //     delete body.warehouseId
  //     if (!edit) {
  //       await mutateAsync(body)
  //     } else{
  //       await putUserMutation({id: record?.id, body});
  //     }
  //   } catch (err) {
  //     message.error("Có lỗi xảy ra!");
  //   }
  // }
  return (
    <Card>
      {/* <Spin spinning={isPendingPut}>
        <Form
          onFinish={onFinish}
          labelCol={{ span: 24 }}
          form={form}
          initialValues={{
            ...record,
            roleIds: record?.userInfos?.map((userInfo: any) => userInfo?.role?.id),
            provinceIds: (record?.userInfos || []).reduce((acc: any, userInfo) => {
              const ids = (userInfo?.provinces || []).map(province => province?.id);
              return acc.concat(ids);
            }, []),
            type: record?.userPartners?.length > 0 ? 'PARTNER' : 'MOBIFONE',
            ...(record?.userPartners?.length > 0 && { roleIds: record?.userPartners?.[0]?.type }),
            ...(record?.userPartners?.length > 0 && { partnerIds: record?.userPartners?.map((item) => item?.partner?.id)}) ,
            warehouseId: record?.userInfos?.map((userInfo: any) => userInfo?.warehouseId).flat()
          }}
          disabled={view}
        >
          <Row gutter={[16, 0]}>
            <Col span={24}>
              <Form.Item 
                label={<h4 style={{fontWeight: 600}}>Loại tài khoản</h4>}
                rules={[...rules.required]}
                name="type"
                style={{ marginBottom: 5 }}
              >
                <Select
                  allowClear
                  placeholder='Loại tài khoản'
                  options={ACCOUNT_TYPE}
                  onChange={(value) => setAccountType(value)}
                  status="warning"
                  disabled={edit || view}
                />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                label='Họ tên'
                name="fullname"
                rules={[...rules.required]}
                style={{ marginBottom: 5 }}
              >
                <Input readOnly={view}/>
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                label='Tên đăng nhập'
                name="username"
                rules={[...rules.required]}
                style={{ marginBottom: 5 }}
              >
                <Input readOnly={edit || view}/>
              </Form.Item>
            </Col>
            {!edit && !view && (
              <Col span={24}>
                <Form.Item
                  label='Mật khẩu'
                  name="password"
                  rules={[...rules.required]}
                  style={{ marginBottom: 5 }}
                >
                  <Input type='password'/>
                </Form.Item>
              </Col>
            )}
            {accountType && (
              <>
                <Col span={24}>
                  <Form.Item 
                    label='Vai trò'
                    name="roleIds"
                    rules={[...rules.required]}
                    initialValue={record?.rolePermissionModules?.map((item: any) => 
                      item?.permissionModule?.id
                    )}
                    style={{ marginBottom: 5 }}
                  >
                    <Select
                      mode={accountType === 'MOBIFONE' ? 'multiple' : undefined}
                      allowClear
                      placeholder='Chọn vai trò'
                      options={accountType === 'MOBIFONE' ? roleList?.map((item: any) => ({
                        label: item?.name,
                        value: item?.id
                      })) : PARTNER_ROLES}
                    />
                  </Form.Item>
                </Col>
              </>
            )}
          </Row>
          <Divider />
          <Row gutter={[10, 0]} style={{marginBottom: '5px'}}>
            <Col flex="auto"></Col>
            <Col flex="none">
              <Form.Item 
                style={{textAlign: 'right'}}
              >
                <Button loading={isPendingPut || isPending} style={{ marginRight: 8 }} htmlType="submit" type="primary">
                  {edit ? "Cập nhật" : "Thêm mới"}
                </Button>
              </Form.Item>
            </Col>
            {!view &&
            <Col flex="none">
              <Form.Item 
                style={{textAlign: 'right'}}
              >
                <Button 
                  loading={isPendingPut} 
                  style={{ marginRight: 8 }}
                  onClick={() => {
                    setVisibleForm(false)
                    setRecord({} as any)
                    setEdit(false)
                    setView(false)
                  }} 
                >
                  Đóng
                </Button>
              </Form.Item>
            </Col>}
          </Row>
        </Form>
      </Spin> */}
    </Card>
  );
};
export default FormUser;
