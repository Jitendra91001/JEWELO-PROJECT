import React, { useEffect, useState } from 'react';
import type { UploadProps } from 'antd';
import { message, Upload, Tooltip } from 'antd';
import { useTheme } from '../../../contexts/Theme/Theme.context';
import { DeleteIcon, Eye, UploadIcon } from '../Icons/icon';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../../../hooks/redux-hooks';
import { deleteAppointmentAttachment } from '../../../redux';
import { toastError, toastSuccess, toastWarning } from '../Notification/Toastify';
import { API_URL } from '../../../constant';

interface MultipleUploadProps {
  fileFormat?: string;
  SelectafileDragandDropHere?: string;
  Uuid?: any;
  refreshAttachment?: boolean;
  refreshList?: any;
  handlePreviewHandler?: (e: any) => void;
  module: string;
}

const MultipleFileUpload: React.FC<MultipleUploadProps> = ({
  fileFormat,
  SelectafileDragandDropHere,
  refreshAttachment,
  handlePreviewHandler,
  Uuid,
  refreshList,
  module,
}) => {
  const { t } = useTranslation();
  const { Color } = useTheme();
  const { token } = useAppSelector((s) => s?.authReducer?.user);
  const [fileList, setFileList] = useState<any>([]);
  const [uploadData, setUploadData] = useState({ uuid: '', module: '' });
  const [uploadResponse, setUploadResponse] = useState<any>(null); // State for the upload response
  const [disableBtn, setDisableBtn] = useState(false)

  const dispatch = useAppDispatch();
 
  const handleChange = (info) => {
    if (info?.fileList.length <= 0) {
      setFileList([]);
    } else {
      const uploadedFile = info.fileList[info?.fileList?.length - 1];
      const status = uploadedFile?.status;

      if (uploadedFile?.size > 10 * 1024 * 1024) {
        toastError(t('fileSizeExceeds0MB.PleaseChooseaSmallerFile.'));
        return;
      } else if (
        uploadedFile?.name.includes('png') ||
        uploadedFile?.name.includes('jpg') ||
        uploadedFile?.name.includes('pdf') ||
        uploadedFile?.name.includes('jpeg') 
      ) {
        setFileList(info?.fileList);

        if(status==="uploading"){
            setDisableBtn(true)
        }
        else if (status === 'done') {
          setUploadResponse(uploadedFile.response); // Save the response in state
          setDisableBtn(false)
          refreshList();
           message.success(`${info.file.name} file uploaded successfully.`);
        } else if (status === 'error') {
            setDisableBtn(false)
            message.error(`${info.file.name} file upload failed.`);
        }
      } else {
         return toastError(t('invalidFileTypePleaseUploadJpgPngPDf'));
      }
    }
  };

  const props: UploadProps = {
    name: 'file',
    action: `${API_URL}hms-patients/upload-attachments`,
    data: uploadData,
    method: 'POST',
    headers: {
      Accept: 'image/jpeg, image/png, image/jpg, application/pdf',
      Authorization: token,
    },
    multiple: true,
    beforeUpload: (file) => {
      if (file.size > 10 * 1024 * 1024) {
        toastError(t('fileSizeExceeds10MB.PleaseChooseaSmallerFile.'));
        return Upload.LIST_IGNORE;
      }

      if (!/\.(png|jpg|jpeg|pdf)$/i.test(file.name)) {
        toastError(t('invalidFileTypePleaseUploadJpgPngPDf'));
        return Upload.LIST_IGNORE;
      }
      return true;
    },
    onChange(info) {
      handleChange(info);
    },
  };

  useEffect(() => {
    if (Uuid?.uuid && module) {
      setUploadData({ uuid: Uuid.uuid, module: module });
    }
  }, [Uuid, module]);

  useEffect(() => {
    if (Uuid?.attachments) {
      const fileListData = JSON.parse(Uuid?.attachments)?.map((ele, ind) => {
        return {
          name: new URL(ele)?.searchParams.get('file_name'),
          id: ind,
          url: ele,
        };
      });
      if (fileListData?.length > 0) {
        setFileList(fileListData);
      } else {
        setFileList([]);
      }
    } else {
      setFileList([]);
    }
  }, [Uuid?.refreshId]);

  return (
    <Upload
      {...props}
      fileList={fileList}
      multiple={false}
      onDrop={() => {}}
      itemRender={(originNode, file, fileList, actions) => {
        return (
          <div className="flex justify-between items-center my-2 custom-file-list-item">
                <div className='w-[85%]'>
                {originNode}
                </div>

            <div className="flex gap-2 items-center">
              <Tooltip color={'#000'} overlayInnerStyle={{ borderRadius: '10px' }} title="Preview">
                <span onClick={() => disableBtn ? null : handlePreviewHandler(file)} 
                className={disableBtn ? "cursor-not-allowed" : "cursor-pointer"}>
                  <Eye height={'24px'} width={'24px'} title="View" fill={'#3C999E'} />
                </span>
              </Tooltip>
              <Tooltip color={'#000'} overlayInnerStyle={{ borderRadius: '10px' }} title="Delete">
                <span
                  onClick={() => {
                    const payloadData = {
                      uuid: Uuid?.uuid,
                      data: { file: file?.url || uploadResponse?.data, module: module },
                    };

                    disableBtn ? null :                    
                    dispatch(deleteAppointmentAttachment(payloadData))
                      .unwrap()
                      .then((res) => {
                        if (res?.status === 'success') {
                          actions.remove();
                          toastSuccess(t('attachmentDeleted!'));
                          refreshList();
                        } else {
                          toastWarning('File deletion failed');
                        }
                      });
                  }}
                  className={disableBtn ? "cursor-not-allowed" : "cursor-pointer"}
                >
                  <DeleteIcon height={'20px'} width={'20px'} />
                </span>
              </Tooltip>
            </div>
          </div>
        );
      }}
    >
      <div className="" style={{ width: '450px' }}>
        <div className="ant-upload-drag-icon">
          <UploadIcon height={100} width={100} fill={Color['--primary']} />
        </div>
        <p className="ant-upload-text">{t('SelectafileDragandDropHere')}</p>
        <p className="ant-upload-hint font-normal">{t('fileFormat')}</p>
      </div>
    </Upload>
  );
};

export default MultipleFileUpload;