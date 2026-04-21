import React from "react";
import { Upload, Button } from "antd";
import { UploadOutlined, PlusOutlined } from "@ant-design/icons";
import type { UploadFile } from "antd/es/upload/interface";

interface UploadInputFieldProps {
  fileList: UploadFile[];
  setFileList: (files: UploadFile[]) => void;
  multiple?: boolean; // ✅ control single/multiple
  showUploadList?: boolean; // Control whether to show upload list
  listType?: 'text' | 'picture' | 'picture-card'; // Upload list type
}

const UploadInputField: React.FC<UploadInputFieldProps> = ({
  fileList,
  setFileList,
  multiple = false,
  showUploadList = true,
  listType = 'text',
}) => {
  const handleChange = ({ fileList }: { fileList: UploadFile[] }) => {
    if (multiple) {
      // ✅ allow multiple files
      setFileList(fileList);
    } else {
      // ✅ allow only one file
      setFileList(fileList.slice(-1));
    }
  };

  const handleRemove = (file: UploadFile) => {
    setFileList(fileList.filter(f => f.uid !== file.uid));
  };

  if (listType === 'picture-card') {
    return (
      <Upload
        fileList={fileList}
        beforeUpload={() => false}
        onChange={handleChange}
        onRemove={handleRemove}
        multiple={multiple}
        maxCount={multiple ? undefined : 1}
        accept="image/*"
        listType="picture-card"
        showUploadList={showUploadList}
      >
        {fileList.length >= (multiple ? 8 : 1) ? null : (
          <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
          </div>
        )}
      </Upload>
    );
  }

  return (
    <Upload
      fileList={fileList}
      beforeUpload={() => false}
      onChange={handleChange}
      onRemove={handleRemove}
      multiple={multiple}
      maxCount={multiple ? undefined : 1}
      accept="image/*"
      showUploadList={showUploadList}
      listType={listType}
    >
      <Button icon={<UploadOutlined />}>
        {multiple ? "Upload Images" : "Upload Image"}
      </Button>
    </Upload>
  );
};

export default UploadInputField;