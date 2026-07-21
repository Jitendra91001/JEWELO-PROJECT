import "./CommonUploadFile.css"; 
import { UploadFile } from 'antd/es/upload/interface';
import React, { useCallback } from 'react';
import { toastError } from '../Notification/Toastify';
import { CloseCircleOutlined, PaperClipOutlined } from '@ant-design/icons';

interface CommonUploadFileProps {
  text?: string;
  value?: string,
  maxCount?:any,
  imageUploadIcon?: any;
  fileList: UploadFile[];
  handleChange?: (event: any) => void;
  onRemove?: (event: any) => void;
  setFileList: React.Dispatch<React.SetStateAction<UploadFile[]>>;
  sourceComponent?: string; 
}

const DocumentUploadFile: React.FC<CommonUploadFileProps> = ({ text, value,imageUploadIcon, fileList, setFileList, handleChange,maxCount,onRemove,sourceComponent }) => {
  const handleFileChange = useCallback((event) => {
    const selectedFiles = event.target.files;
    const validFiles = [];

    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      const fileType = file.type;
      const fileSize = file.size;

      if (fileType === 'application/pdf' || fileType === 'image/jpeg' || fileType === 'image/png') {
        if (fileSize <= 10 * 1024 * 1024) {
          const fileWithOrigin : UploadFile<any> = {
            uid: `rc-upload-${Date.now()}-${i}`, 
            name: file?.name,
            status: "uploading", 
            size: file?.size,
            type: file?.type,
            percent: 0, 
            lastModified: file?.lastModified,
            lastModifiedDate: file?.lastModifiedDate,
            originFileObj: file, 
        };
        if (sourceComponent === "hrDocumentUploade") {
          validFiles.push(fileWithOrigin);
        } else {
          validFiles.push(file);
        }
        } else {
          event.target.value = ''; // Reset the input field's value
          toastError("File size exceeds 10MB. Please choose a smaller file.");
        }
      } else {
        event.target.value = ''; // Reset the input field's value
        toastError(`File  is not a valid format. Only .pdf, .jpg, and .png files are allowed.`);
      }
    }

    setFileList(validFiles);
  }, []);

  const handleDeleteAll = () => {
    setFileList([]);
  };


  return (
    <div className='uploadFile relative flex justify-between w-[`00%]'>
      <div className=' m-auto items-center top-0 bottom-0'>
      <PaperClipOutlined className='pl-[10px]'/>
      {
        fileList.length<=0 &&
      <span className='pl-[10px] text-[#aaa3b1] m-auto'>.pdf,.jpg,.png</span>
      }
      </div>
      <input type="file" multiple onChange={handleFileChange} 
      className='opacity-0 z-[1] w-[100%]' 
      />
      <div className='absolute pointer-events-none flex overflow-hidden h-[25px] top-[5px] bottom-0 left-[30px] right-[25px]'>
        {fileList.map((file, index) => (
          <div key={index}> {index==0 ? file.name : `,${file.name}`}  </div>
        ))}
      </div>
        <div className='my-auto absolute right-2 top-1 z-20 cursor-pointer' onClick={handleDeleteAll}>
          <CloseCircleOutlined className='text-[red] text-[15px]' />
        </div>
    </div>
  );
};

export default DocumentUploadFile;

