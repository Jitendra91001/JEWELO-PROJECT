import React from 'react';
import { Button, Spin, Typography, Upload } from 'antd';
import "./CommonUploadFile.css"; 
import ButtonFeild from '../Button/CustomButton';
import { UploadFile } from 'antd/es/upload/interface';

interface CommonUploadFileProps {
  text?: string;
  value?: string,
  maxCount?:any,
  imageUploadIcon?: any;
  fileList: UploadFile[] | any[];
  handleChange?: (event: any) => void;
  onRemove?: (event: any) => void; 
  single ? : boolean;
  loader ?:boolean;
  setFileList?: React.Dispatch<React.SetStateAction<UploadFile[]>>;
  disabled?: boolean;
  isButtonDisable? :boolean;
  customPreview?: (file: UploadFile) => void;
}

const CommonUploadFile: React.FC<CommonUploadFileProps> = ({ text, loader=false,value,imageUploadIcon, fileList, setFileList, handleChange,maxCount,onRemove , single, disabled, isButtonDisable=false, customPreview }) => {
 


  const handlePreview = async (file: UploadFile) => {
    let src = file.url;
    if (!src && file.originFileObj) {
      src = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj as Blob);
        reader.onload = () => resolve(reader.result as string);
      });
    }
  
    if (src) {
      const newWindow = window.open();
      if (newWindow) {
        if (file.type === "application/pdf") {
          newWindow.document.write(
            `<iframe src="${src}" frameborder="0" style="border:0; width:100%; height:100%;" allowfullscreen></iframe>`
          );
        } else if (file.type?.includes("image")) {
          newWindow.document.write(
            `<img src="${src}" style="max-width:100%; height:auto;" />`
          );
        } else {
          newWindow.document.write(`<p>File type not supported for preview.</p>`);
        }
        newWindow.document.close();
      }
    }
  };

  return (
    <div className='uploadFile'>

      {
        loader ? <div className='flex justify-center p-1'><Spin/></div>
      :
          <Upload
            listType="picture"
            fileList={fileList}
            multiple={single ? false : true}
            onChange={!disabled ? handleChange : () =>{}}
            showUploadList={true}
            onRemove={onRemove}
            style={{
              pointerEvents: disabled ? "none" : "auto",
              opacity: disabled ? 0.5 : 1,
            }}
            onPreview={customPreview ? customPreview : handlePreview}
            maxCount={maxCount}
            disabled={disabled}
            beforeUpload={() => false} // Prevenuploadt auto upload/ Prevent auto 
          >
        <div className='flex items-center'>
          <Button icon={imageUploadIcon} disabled={isButtonDisable}></Button>
          <Typography.Text className='text-[13px] text-[--fontColor] font-normal'>{text || 'Upload'}</Typography.Text>
        </div>
        <ButtonFeild sizeType={"small"} type="primary" disabled={isButtonDisable} value={value ? value : "Upload"} />
      </Upload>
}
    </div>
  );
};

export default CommonUploadFile;

