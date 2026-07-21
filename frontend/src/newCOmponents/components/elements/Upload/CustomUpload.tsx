import React, { useEffect, useState } from "react";
import { Upload, Typography } from "antd";
import { PaperClipOutlined, CloseCircleOutlined } from "@ant-design/icons";
import type { UploadFile } from "antd/es/upload/interface";
import ButtonFeild from "../Button/CustomButton";
import DocumentViewer from "../../../pages/HR/Leaves/DocumentViewer/DocumentViewer";
import UploadedFilesPreview from "./UploadedFilesPreview"; // Import the new component
import { API_URL } from "../../../constant";

interface Props {
  formValues: any;
  setFormValues: React.Dispatch<React.SetStateAction<any>>;
  dispatch: any;
  uploadDocument: any;
  toastSuccess: (msg: string) => void;
  toastError: (msg: string) => void;
  onDelete: (file: any) => void;
  clearSelectedFiles?: (file: any) => void;
  multiple?: boolean;
  showPreview?: boolean; // Whether to show preview inside component
  previewType?: "horizontal" | "vertical"; // Preview layout type
  customPreview?: React.ReactNode; // Custom preview component
}

const CustomUpload: React.FC<Props> = ({
  setFormValues,
  dispatch,
  uploadDocument,
  toastSuccess,
  clearSelectedFiles,
  toastError,
  onDelete,
  formValues,
  multiple = false,
  showPreview = true, // Default true for backward compatibility
  previewType = "vertical", // Default vertical
  customPreview, // Custom preview component
}) => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [uploadedFile, setUploadedFile] = useState<any>(null);
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [documentList, setDocumentList] = useState<any[]>([]);
  const [showDocumentModal, setShowDocumentModal] = useState(false);

  //File Select
  const handleSelect = ({ fileList }: { fileList: UploadFile[] }) => {
    const filesToProcess = multiple ? fileList : fileList.slice(-1);

    const validFiles: UploadFile[] = [];

    filesToProcess.forEach((file) => {
      const isValidSize = (file.size || 0) <= 10 * 1024 * 1024;
      const isValidType =
        file.name.endsWith(".png") ||
        file.name.endsWith(".jpg") ||
        file.name.endsWith(".jpeg") ||
        file.name.endsWith(".pdf");
      if (!isValidSize) {
        toastError(`File "${file.name}" size should be less than 10MB`);
        return;
      }

      if (!isValidType) {
        toastError(`File "${file.name}" - Only PNG, JPG, JPEG, PDF allowed`);
        return;
      }
      validFiles.push(file);
    });
    setFileList(multiple ? validFiles : validFiles.slice(-1));
  };

  //after upload view file
  useEffect(() => {
    if (!multiple) {
      if (formValues?.file_name && formValues?.url) {
        setUploadedFile({
          name: formValues.file_name,
          url: formValues.url,
        });
      }
    } else {
      if (formValues?.files && Array.isArray(formValues.files)) {
        setUploadedFiles(formValues.files);
      }
    }
  }, [formValues, multiple]);

  //Upload API
  const handleUpload = async () => {
    if (!fileList.length) return;

    const validFiles = fileList.filter((file) => file.originFileObj);

    if (validFiles.length === 0) {
      toastError("No valid files to upload");
      return;
    }
    setLoading(true);

    try {
      const formData = new FormData();

      validFiles.forEach((file) => {
        if (file.originFileObj) {
          formData.append("file[]", file.originFileObj, file.name);
        }
      });

      const response = await dispatch(uploadDocument(formData)).unwrap();
      const uploadedDataArray = response?.data || [];

      if (multiple) {
        const newUploadedFiles = validFiles.map((file, index) => {
          const uploadedData = uploadedDataArray[index];
          const fileName = file.name;
          const objectKey = uploadedData?.object_key;

          const generatedUrl = `${API_URL}download-files?is_aws=False&bucket=new-ecare-files&object_key=${encodeURIComponent(
            objectKey,
          )}&file_name=${encodeURIComponent(fileName)}`;

          return {
            name: fileName,
            object_key: objectKey,
            url: generatedUrl,
          };
        });

        const updatedFiles = [...(formValues.files || []), ...newUploadedFiles];

        setFormValues((prev: any) => ({
          ...prev,
          files: updatedFiles,
        }));
        console.log("you are here")
        setUploadedFiles(updatedFiles);
        toastSuccess(`${validFiles.length} file(s) uploaded successfully`);
      } else {
        const uploadedData = uploadedDataArray?.[0];
        const fileName = validFiles[0].name;
        const objectKey = uploadedData?.object_key;

        const generatedUrl = `${API_URL}download-files?is_aws=False&bucket=new-ecare-files&object_key=${encodeURIComponent(
          objectKey,
        )}&file_name=${encodeURIComponent(fileName)}`;

        setFormValues((prev: any) => ({
          ...prev,
          file_name: fileName,
          object_key: objectKey,
          url: generatedUrl,
        }));

        setUploadedFile({
          name: fileName,
          url: generatedUrl,
        });
        toastSuccess("File uploaded successfully");
      }

      setFileList([]);
    } catch (err: any) {
      console.error("UPLOAD ERROR:", err);
      toastError(err?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  // View file
  const handleInternalView = (file?: any) => {
    if (multiple && uploadedFiles.length > 0) {
      setDocumentList(
        uploadedFiles.map((f) => ({
          url: f.url,
          document_name: f.name,
        })),
      );
      setShowDocumentModal(true);
    } else if (!multiple && uploadedFile?.url) {
      setDocumentList([
        {
          url: uploadedFile.url,
          document_name: uploadedFile.name,
        },
      ]);
      setShowDocumentModal(true);
    }
  };

  // Delete file
  const handleInternalDelete = (fileToDelete?: any) => {
    if (multiple) {
      if (fileToDelete) {
        const updatedFiles = uploadedFiles.filter(
          (f) => f.name !== fileToDelete.name,
        );
        setUploadedFiles(updatedFiles);
        setFormValues((prev: any) => ({
          ...prev,
          files: updatedFiles,
        }));
      } else {
        setUploadedFiles([]);
        setFormValues((prev: any) => ({
          ...prev,
          files: [],
        }));
      }
    } else {
      setUploadedFile(null);
      setFormValues((prev: any) => ({
        ...prev,
        file_name: "",
        object_key: "",
        url: "",
      }));
    }
  };

  const handleDelete = (fileToDelete: any) => {
    if (multiple) {
      const updatedFiles = uploadedFiles.filter(
        (f) => f.name !== fileToDelete.name,
      );
      setUploadedFiles(updatedFiles);
    }
    else {
      setUploadedFile(null)
    }
    onDelete ? onDelete(fileToDelete) : handleInternalDelete(fileToDelete)
  }

  // Remove selected file
  const handleRemoveSelectedFile = (fileToRemove?: UploadFile) => {
    if (multiple && fileToRemove) {
      setFileList((prev) => prev.filter((f) => f.uid !== fileToRemove.uid));
    } else {
      setFileList([]);
    }
  };

  const getSelectedFilesText = () => {
    if (!fileList.length) return ".pdf, .jpg, .png";
    if (fileList.length === 1) return fileList[0].name;
    return `${fileList.length} files selected`;
  };

  // Get current files for preview
  const getCurrentFiles = () => {
    if (multiple) return uploadedFiles;
    return uploadedFile ? [uploadedFile] : [];
  };

  useEffect(() => {
    setFileList([])
  }, [clearSelectedFiles])

  return (
    <div className="w-full">
      {/* Upload Box - Exactly same as before */}
      <div className="border border-dashed border-gray-400 rounded-md py-[4px] pl-1 flex items-center justify-between bg-gray-50">
        <div className="flex items-center gap-2 overflow-hidden">
          <PaperClipOutlined className="text-gray-500" />
          <Typography.Text className="text-gray-500 text-sm truncate max-w-[250px]">
            {getSelectedFilesText()}
          </Typography.Text>
          {fileList.length > 0 && (
            <CloseCircleOutlined
              onClick={() => handleRemoveSelectedFile()}
              className="text-red-500 cursor-pointer text-sm"
            />
          )}
        </div>

        {fileList.length === 0 ? (
          <Upload
            beforeUpload={() => false}
            fileList={fileList}
            onChange={handleSelect}
            showUploadList={false}
            multiple={multiple}
            maxCount={multiple ? undefined : 1}
          >
            <ButtonFeild sizeType="small" value="Browse" />
          </Upload>
        ) : (
          <ButtonFeild
            sizeType="small"
            value={`Upload${fileList.length > 1 ? ` (${fileList.length})` : ""}`}
            loading={loading}
            onClick={handleUpload}
          />
        )}
      </div>

      {/* Preview Section - Now using the new component */}
      {showPreview && !customPreview && getCurrentFiles().length > 0 && (
        <UploadedFilesPreview
          files={getCurrentFiles()}
          showType={previewType}
          onView={handleInternalView}
          // onDelete={(file) =>
          //   onDelete ? onDelete(file) : handleInternalDelete(file)
          // }
          onDelete={(file) => handleDelete(file)}
        />
      )}

      {/* Custom Preview (if provided) */}
      {customPreview}

      {/* Document Viewer Modal */}
      <DocumentViewer
        showModal={[showDocumentModal, setShowDocumentModal]}
        documentList={documentList}
        setDocumentList={setDocumentList}
      />
    </div>
  );
};

export default CustomUpload;
