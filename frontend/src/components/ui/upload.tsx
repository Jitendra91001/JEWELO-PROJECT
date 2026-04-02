import React from "react";
import { Upload, Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import type { UploadFile } from "antd/es/upload/interface";

interface UploadInputFieldProps {
  fileList: UploadFile[];
  setFileList: (files: UploadFile[]) => void;
  multiple?: boolean; // ✅ control single/multiple
}

const UploadInputField: React.FC<UploadInputFieldProps> = ({
  fileList,
  setFileList,
  multiple = false,
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

  return (
    <Upload
      fileList={fileList}
      beforeUpload={() => false}
      onChange={handleChange}
      multiple={multiple}
      maxCount={multiple ? undefined : 1}
      accept="image/*" // ✅ only images
    >
      <Button icon={<UploadOutlined />}>
        {multiple ? "Upload Images" : "Upload Thumbnail"}
      </Button>
    </Upload>
  );
};

export default UploadInputField;