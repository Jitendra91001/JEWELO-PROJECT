import { Upload } from 'antd'
import React, { useState } from 'react'
import IconButton from '../Button/IconButton'
import { PlusOutlined } from '@ant-design/icons'
import { user } from '../../../constant'
import { t } from 'i18next'
import { toastError, toastSuccess } from '../Notification/Toastify'

const ImportFile = ({apiUrl, token , refreshlist}) => {

  const [importLoader, setImportLoader] = useState<boolean>(false)
  const handleUploadFile = ({ file, fileList }) => {

    setImportLoader(true)
    if (file?.response?.status == "success" || file?.response?.success == true) {
      toastSuccess(file?.response?.message)
      refreshlist()
      setImportLoader(false)
    }
    else if (file.status=="error") {
      toastError(t("unsupportedFileFormat"))
      setImportLoader(false)
      refreshlist()
    }
    else {
      toastError(file?.response?.message)
      setImportLoader(false)
      setTimeout(() => {
        refreshlist()
      }, 500);
    }
  }

  const beforeUpload = (file: any) => {
    return new Promise((resolve, reject) => {
      const fileExtension = file.name.split('.').pop().toLowerCase();
      const validExtensions = ["xls", "csv", "xlsx"];

      if (validExtensions.includes(fileExtension)) {
        resolve(file);     
      } else {
        reject(new toastError(t("unsupportedFileFormat")));  
      }
    });
  };


  return (
    <div>
      <Upload accept='.csv,.xls,.xlsx'
        action={apiUrl}
        headers={{
          'Accept': 'application/json, application/xml, text/plain, text/html, *.*',
          'Authorization': token || "",
          'User': user,
        }}
        beforeUpload={beforeUpload}
        maxCount={1}
        showUploadList={false}
        onChange={handleUploadFile}>
        <div className="flex gap-1 items-center [&>div>div>button]:!flex [&>div>div>button]:!items-center ">
          <IconButton type="default"
            loadings={importLoader}
            icon={<div > <PlusOutlined /></div>}
            name={t("import")}
            className=' text-[--primary] flex items-center'
          />
        </div>
      </Upload>
    </div>
  )
}

export default ImportFile