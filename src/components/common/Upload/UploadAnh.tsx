import { DeleteOutlined, LoadingOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, Input, message, Modal, Upload } from 'antd';
import { useState } from 'react';

const UploadImage = (props: any) => {
  const [previewVisible, setPreviewVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [image, setImage] = useState(props?.value?.fileList?.[0]?.url ?? props?.value);
  const getBase64 = (img: Blob, callback: (arg0: string | ArrayBuffer | null) => any) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  };
  const triggerChange = (changedValue: any) => {
    const { onChange } = props;
    if (onChange) {
      onChange({ ...changedValue });
    }
  };
  const handleCancel = () => setPreviewVisible(false);
  const handleChange = (info: any) => {
    if (info.file.status === 'uploading') {
      setLoading(true);
      setImage(undefined);
      return;
    }

    if (info.file.status === 'done') {
      getBase64(info.file.originFileObj, (imageUrl) => {
        setLoading(false);
        setImage(imageUrl);
      });

      triggerChange({ fileList: [info.file] });
    }
  };

  const beforeUpload = (file: { type: string; size: number }) => {
    const isImg = file.type.split('/')[0] === 'image';
    if (!isImg) {
      message.error('Bạn chỉ có thể  chọn ảnh!');
    }
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error('Dung lượng ảnh phải nhỏ hơn 5MB!');
    }
    return isImg && isLt5M;
  };

  const handleRemoveImage = (e: any) => {
    e.stopPropagation(); 
    setImage(null); 
  };
  return (
    <div className="clearfix" >
      <Input
        readOnly
        allowClear
        onClick={() => {
          if (props?.value?.[0]?.uri || image) {
            setPreviewVisible(true)
          }
        }}
        value={props?.value?.[0]?.uri ? ("File.pdf") : image?.[0]?.name ?? undefined}
        suffix={
          <Upload
            accept="image/*"
            showUploadList={false}
            customRequest={({ file, onSuccess }) => {
              setTimeout(() => {
                if (onSuccess) onSuccess(file, new XMLHttpRequest());
              }, 0);
            }}
            onChange={handleChange}
            beforeUpload={beforeUpload}
            disabled={props?.disabled}
          >
            {image  
              ?  <img
                  src={image}
                  alt="avatar"
                  style={{
                    width: '100%', 
                    height: 'auto', 
                    objectFit: 'contain', 
                    maxWidth: '100%', 
                    maxHeight: '40px', 
                  }}
                />
              : <Button
                  size="small"
                  icon={loading ? <LoadingOutlined /> : <UploadOutlined />}
                  disabled={props.view}
                >
                  Tải ảnh
                </Button>
            }
            <Button
              danger
              type="text"
              size="small"
              icon={<DeleteOutlined />}
              onClick={handleRemoveImage}
              style={{
                position: 'absolute',
                top: -8,
                right: -8,
                background: 'white',
                borderRadius: '50%',
                width: 16,
                height: 16,
              }}
            />
          </Upload> 
        }
      />
      {/* <Upload
        listType="picture-card"
        accept="image/*"
        showUploadList={false}
        customRequest={({ file, onSuccess }) => {
          setTimeout(() => {
            if (onSuccess) onSuccess(file, new XMLHttpRequest());
          }, 0);
        }}
        onChange={handleChange}
        beforeUpload={beforeUpload}
      >
        
        {image ? <img src={image} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
      </Upload>  */}
      <Modal 
        open={previewVisible} 
        footer={null} 
        onCancel={handleCancel}
        width="80%"         
        height="80vh"
        styles={{
          body: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '20px',
          },
        }}
      >
        <img 
          src={image} 
          alt='preview' 
          style={{ 
            maxWidth: '90%', 
            maxHeight: '90vh', 
            objectFit: 'contain' 
          }} 
        />
      </Modal>
    </div>
  );
};
export default UploadImage;
