import { EyeOutlined, FileAddFilled, FileAddOutlined } from '@ant-design/icons';
import { Button, Col, Input, message, Modal, Row, Space, Typography, Upload } from 'antd';
import { useState } from 'react';
import ReadPDF from '@/components/features/ReadPDF';

const UploadDocs = (props: {
  edit?: boolean;
  view?: boolean;
  disabled?: boolean;
  fileList?: any[];
  value?: any
  otherProps?: any;
  onChange?: any;
  multiple?: boolean;
}) => {
  const [visible, setVisible] = useState<boolean>(false);
  const [fileList, setFileList] = useState(props?.fileList || props?.value?.fileList || []);
  const [fileName, setFileName] = useState()
  const handleBeforeUpload = (file: any) => {
    const isPdf = file.type === 'application/pdf';
    if (!isPdf) {
      message.error('Chỉ chấp nhận file PDF!');
      return Upload.LIST_IGNORE
    }
    return false;
  };
  const triggerChange = (changedValue: any) => {
    const { onChange } = props;
    if (onChange) {
      onChange({ ...changedValue });
    }
  };
  const handleChange = (files: any) => {
    setFileName(files?.fileList?.[0]?.name)
    setFileList(files?.fileList);
    triggerChange(files?.fileList);
  };
  return (
    <>
      <Input
        readOnly
        allowClear
        onClick={() => {
          if (props?.value?.[0]?.uri || fileList?.[0]?.originFileObj) {
            setVisible(true)
          }
        }}
        value={props?.value?.[0]?.uri ? ("File.pdf") : fileList?.[0]?.name ?? fileName ?? undefined}
        suffix={
          <Upload
            customRequest={({ file, onSuccess }) => {
              setTimeout(() => {
                if (onSuccess) onSuccess(file, new XMLHttpRequest());
              }, 0);
            }}
            beforeUpload={handleBeforeUpload}
            {...props}
            maxCount={1}
            onChange={handleChange}
            fileList={fileList}
            multiple={props.multiple ? true : false}
            showUploadList={false}
          >
            <Button
              size="small"
              icon={<FileAddFilled />}
              disabled={props.view == true ? true : false}
            >
              Chọn tập tin
            </Button>
          </Upload>
        }
      />
      <Modal
        open={visible}
        onCancel={() => setVisible(false)}
        footer={null}
        width="50%"
        style={{ top: 20 }}
      >
        <ReadPDF 
          fileUrl={
            props?.value?.[0]?.uri?.replace(
              'http://localhost:5001',
                typeof API_BASE_URL === 'string'
                ? API_BASE_URL
                : 'https://apidientram.atptechs.com',
            ) ?? (fileList?.[0]?.originFileObj ? URL.createObjectURL(fileList?.[0]?.originFileObj) : "")}
        />
      </Modal>
    </>
  );
};

export default UploadDocs;
