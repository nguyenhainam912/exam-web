import { Form, Input, Button, Card, Row, Col } from 'antd';
import { useEffect } from 'react';
import useUserStore from '@/stores/user';

interface Address {
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
}

interface FormValues {
  fullName: string;
  email: string;
  phoneNumber: string;
  avatar: string;
  address: Address;
}

const FormUserProfile = ({ onSubmit }: any) => {
  const [form] = Form.useForm<FormValues>();
  const { record, view, edit, setVisibleForm } = useUserStore();

  useEffect(() => {
    if ((record?.userId || record?._id) && (edit || view)) {
      const formValues: FormValues = {
        fullName: record.fullName || '',
        email: record.email || '',
        phoneNumber: record.phoneNumber || '',
        avatar: record.avatar || '',
        address: record.address || {
          street: '',
          city: '',
          state: '',
          country: '',
          zipCode: '',
        },
      };
      console.log("formValues",formValues)

      form.setFieldsValue(formValues);
    } else {
      form.resetFields();
    }
  }, [record, edit, view, form]);

  const handleSubmit = (values: FormValues) => {
    onSubmit(values);
    setVisibleForm(false);
    form.resetFields();
  };

  const isFormDisabled = view;
  const buttonText = edit ? 'Cập nhật' : 'Tạo mới';

  return (
    <Card>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        disabled={isFormDisabled}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Họ tên" name="fullName" rules={[{ required: true, message: 'Bắt buộc' }]}> 
              <Input placeholder="Nhập họ tên" /> 
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Bắt buộc' }, { type: 'email', message: 'Email không hợp lệ' }]}> 
              <Input placeholder="Nhập email" /> 
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Số điện thoại" name="phoneNumber"> 
              <Input placeholder="Nhập số điện thoại" /> 
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Avatar" name="avatar"> 
              <Input placeholder="Link avatar" /> 
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label="Địa chỉ">
              <Input.Group compact>
                <Form.Item name={['address', 'street']} noStyle>
                  <Input style={{ width: '20%' }} placeholder="Đường" />
                </Form.Item>
                <Form.Item name={['address', 'city']} noStyle>
                  <Input style={{ width: '20%' }} placeholder="Thành phố" />
                </Form.Item>
                <Form.Item name={['address', 'state']} noStyle>
                  <Input style={{ width: '20%' }} placeholder="Tỉnh/Bang" />
                </Form.Item>
                <Form.Item name={['address', 'country']} noStyle>
                  <Input style={{ width: '20%' }} placeholder="Quốc gia" />
                </Form.Item>
                <Form.Item name={['address', 'zipCode']} noStyle>
                  <Input style={{ width: '20%' }} placeholder="Mã bưu điện" />
                </Form.Item>
              </Input.Group>
            </Form.Item>
          </Col>
        </Row>
        {!view && (
          <Form.Item>
            <Button type="primary" htmlType="submit" size="large">
              {buttonText}
            </Button>
          </Form.Item>
        )}
      </Form>
    </Card>
  );
};

export default FormUserProfile; 