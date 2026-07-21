import React, { useState } from 'react';
import { Button } from 'antd';
import { CloseCircleOutlined } from '@ant-design/icons';
import { t } from 'i18next';
import { ImageUploadIcon } from '../Icons/icons';
import CommonText from '../HeadingTitle/CommonText';

interface CommonUploadFileProps {
    value?: any,
    multiple?: boolean,
    handleChange?: (files: FileList | File) => void;
}

const FileUpload: React.FC<CommonUploadFileProps> = ({ value, handleChange, multiple = false }) => {
    const [fileNames, setFileNames] = useState<string[]>([]);
    const [closeIcon, setCloseIcon] = useState(false);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files) {
            const newFileNames = Array.from(files).map(file => file.name);
            setFileNames(newFileNames);
            setCloseIcon(true);
            if (handleChange) {
                handleChange(multiple ? files : files[0]);
            }
        }
    };

    const handleRemoveFileNames = () => {
        setFileNames([]);
        setCloseIcon(false);
    };

    return (
        <>
            <div className='!h-[30px] flex relative items-center justify-between rounded-md border border-dashed upload-file [&>div]:!my-0 p-[3px] cursor-pointer'>
                <div className='flex items-center'>
                    <ImageUploadIcon height={18} width={18} />
                    <div className='flex  items-center absolute pointer-events-none overflow-hidden top-[0px] bottom-0 left-[30px] right-[20px] [&>span]:!ml-[5px] [&>span]:!whitespace-nowrap [&>span]:overflow-hidden [&>span]:text-ellipsis'>
                        <CommonText title={fileNames.length > 0 ? fileNames.join(', ') : t('.jpg, .png, .pdf')} type="font2" />
                    </div>
                </div>
                <input type="file" onChange={handleFileChange} value={value} name="filefield" multiple={multiple} className='absolute top-0 left-0 z-10 p-0 w-full h-full opacity-0 cursor-pointer' />
                {
                    closeIcon ?
                        <CloseCircleOutlined className='absolute right-[3px] top-[5px] text-rose-600 cursor-pointer z-40' onClick={handleRemoveFileNames} />
                        :
                        <Button type="primary" className='h-[25px]'>{t('browse')}</Button>
                }
            </div>
        </>
    );
}

export default FileUpload;