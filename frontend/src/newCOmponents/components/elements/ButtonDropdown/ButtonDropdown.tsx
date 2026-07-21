
import React from "react";
import { DownOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Dropdown, Upload } from 'antd';
import { t } from "i18next";
import { useNavigate } from "react-router-dom";
import { BASE_URL, pathConstants, user } from "../../../constant";
import './buttonDropdown.css'
import { apiEndpoints } from "../../../utils/apiEndpoints";
import { toastError, toastSuccess } from "../Notification/Toastify";


interface DropdownButtonDatatype {
  value: string | React.ReactNode,
  rest?: any,
  sizeType?: any,
  className?: any,
  onClick?: () => void,
  disabled?: boolean;
  style?: any,
  type?: any,
  width?: any;
  token?:any;
  isLoading?: any;
  tabIndex?: any;
  loading?: boolean;
  setModalSI?: any
}

const ButtonDropdown: React.FC<DropdownButtonDatatype> = ({ value, onClick, setModalSI ,token}) => {
  const navigate = useNavigate()

  const handleMenuClick: MenuProps['onClick'] = (e) => {
    if (e?.key === "view") {
      navigate(pathConstants.TpaList)
    }
  };

  const handleUploadFile = ({ file, fileList }) => {

    if (file?.response?.status === "failed") {
      toastError(file?.response?.message)
      return;
    }
    if (file.status !== 'uploading') {
      toastSuccess(file?.response?.message)
    }
  }

  const items: MenuProps['items'] = [
    {
      label: t('view'),
      key: 'view',
    },
    {
      label: <div className="items-center import-csv">
        <Upload accept='.csv,.xlx,.xlsx'
          headers={{
            'Accept': 'application/json, application/xml, text/plain, text/html, *.*',
            'Authorization': token || "",
            'User': user,
          }}
          action={BASE_URL + apiEndpoints?.accountsConfig?.importTpa}
          maxCount={1} onChange={handleUploadFile}
          showUploadList={false}>
          {t('imports')}
        </Upload></div>,
      key: 'import'
    },
  ];

  const menuProps = {
    items,
    onClick: handleMenuClick,
  };
  return (
    <Dropdown.Button className="buttonDropdown rounded-md font-[600] text-[16px]" menu={menuProps} onClick={onClick} icon={<DownOutlined />}>
      {value}
    </Dropdown.Button>
  )
}
export default ButtonDropdown


