import React from 'react';
import { PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, Modal, Upload } from 'antd';
import type { GetProp, UploadFile, UploadProps } from 'antd';

interface UploadOptionProps {
  fileList: [];
  listType: any;
  setFileList: any;
  handleChange: (value: any) => void;
  handleCancel?: () => void;
  handlePreview?: (value: any) => void;
  previewOpen?: boolean;
  setPreviewOpen?: any;
  previewTitle?: any;
  setPreviewTitle?: any;
  previewImage?: string;
  setPreviewImage?: any;
  showUploadList?: any;
  multiple?: boolean;
}

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const getBase64 = (file: FileType): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });


const UploadComponent: React.FC<UploadOptionProps> = ({ listType, fileList, setFileList, handleChange, handlePreview, handleCancel,
  previewOpen, setPreviewOpen, previewImage, setPreviewImage, previewTitle, setPreviewTitle, showUploadList, multiple,
}) => {

  const onCancel = () => setPreviewOpen(false);

  const onPreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
    setPreviewTitle(file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1));
  };

  const onChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  }

  const uploadButton = (
    <button style={{ border: 0, background: 'none' }} type="button">
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );


  return (
    <>
      <Upload
        listType={listType}
        onPreview={handlePreview ?? onPreview}
        onChange={handleChange ?? onChange}
        fileList={fileList ?? []}
        multiple={multiple ?? false}
        showUploadList={showUploadList ?? {}}
      >
        {fileList?.length >= 5 ? null
          : listType === null ? <Button icon={<UploadOutlined />}>Upload</Button>
            : uploadButton}
      </Upload>

      <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel ?? onCancel}>
        <img alt="example" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </>
  );
};

export default UploadComponent;