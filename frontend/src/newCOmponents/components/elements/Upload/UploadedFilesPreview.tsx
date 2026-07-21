// components/UploadedFilesPreview.tsx
import React from "react";
import { Typography } from "antd";
import {
  EyeOutlined,
  DeleteOutlined,
  FilePdfFilled,
  FileImageFilled,
  DownloadOutlined,
} from "@ant-design/icons";

interface FileItem {
  name: string;
  url: string;
  object_key?: string;
}

interface Props {
  files: FileItem[];
  showType?: "horizontal" | "vertical";
  onView?: (file: FileItem) => void;
  onDelete?: (file: FileItem) => void;
  showDownload?: boolean;
  showDelete?: boolean;
  size?: "default" | "large";
  className?: string;
}

const UploadedFilesPreview: React.FC<Props> = ({
  files,
  showType = "vertical",
  onView,
  onDelete,
  showDownload = false,
  showDelete = true,
  size = "default",
  className = "",
}) => {
  if (!files.length) return null;

  const sizeClasses = {
    container: size === "large" ? "p-4" : "p-3",
    text: size === "large" ? "!text-[15px]" : "text-sm",
    icon: size === "large" ? "!text-[34px]" : "text-xl",
    actionGap: size === "large" ? "gap-5" : "gap-4",
  };

  const getFileIcon = (fileName: string) => {
    return fileName.endsWith(".pdf") ? (
      <FilePdfFilled className={`text-red-500 ${sizeClasses.icon}`} />
    ) : (
      <FileImageFilled className={`text-blue-500 ${sizeClasses.icon}`} />
    );
  };

  const handleDownload = (file: FileItem) => {
    if (!file.url) return;

    const link = document.createElement("a");
    link.href = file.url;
    link.download = file.name || "download";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 🔹 Horizontal Layout
  if (showType === "horizontal") {
    return (
      <div className={`mt-3 flex flex-wrap gap-2 ${className}`}>
        {files.map((file, index) => (
          <div
            key={index}
            className={`border rounded-md ${size === "large" ? "p-3" : "p-2"
              } flex items-center gap-2 bg-[#f5f5f5] shadow-sm min-w-[200px] max-w-[250px]`}
          >
            {getFileIcon(file.name)}

            <Typography.Text
              className={`${sizeClasses.text} font-medium flex-1 truncate`}
            >
              {file.name}
            </Typography.Text>

            <div className="flex items-center gap-2">
              <EyeOutlined
                onClick={() => onView?.(file)}
                className="text-teal-600 cursor-pointer hover:text-teal-800"
              />

              {showDownload && (
                <DownloadOutlined
                  onClick={() => handleDownload(file)}
                  className="text-teal-600 cursor-pointer hover:text-teal-800"
                />
              )}

              {showDelete && (
                <DeleteOutlined
                  onClick={() => onDelete?.(file)}
                  className="text-red-500 cursor-pointer hover:text-red-700"
                />
              )}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={`mt-3 space-y-2 ${className}`}>
      {files.map((file, index) => (
        <div
          key={index}
          className={`border rounded-md ${sizeClasses.container} flex items-center justify-between bg-[#f5f5f5] shadow-sm`}
        >
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {getFileIcon(file.name)}

            <Typography.Text
              className={`${sizeClasses.text} font-medium truncate max-w-[300px]`}
            >
              {file.name}
            </Typography.Text>
          </div>

          <div
            className={`flex items-center ${sizeClasses.actionGap} flex-shrink-0`}
          >
            <EyeOutlined
              onClick={() => onView?.(file)}
              className={`text-teal-600 cursor-pointer hover:text-teal-800 ${size == "large" && "!text-[20px]"}`}
            />

            {showDownload && (
              <DownloadOutlined
                onClick={() => handleDownload(file)}
                className={`text-teal-600 cursor-pointer hover:text-teal-800 ${size == "large" && "!text-[20px]"}`}
              />
            )}

            {showDelete && (
              <DeleteOutlined
                onClick={() => onDelete?.(file)}
                className={`text-red-500 cursor-pointer hover:text-red-700 ${size == "large" && "!text-[18px]"}`}
              />
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default UploadedFilesPreview;