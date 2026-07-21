import React, { ReactNode, useEffect, useState } from "react";
import { Modal, Typography } from "antd";
import { useTheme } from "../../../contexts/Theme/Theme.context";
import { pathConstants } from "../../../constant";
import { t } from "../../../i18n/i18n";

interface DynamicAlertProps {
  children?: ReactNode;
  onClose?: any;
  onOk?: any;
  title?: ReactNode;
  showModal: any[]; // send your state getter and setter as [showModal , setShowModal]
  footer?: any;
  width?: number;
  style?: React.CSSProperties;
  ismodalStyle?: any;
  centered?: boolean;
  closeIcon?: boolean;
  okButtonProps?: React.CSSProperties;
  cancelButtonProps?: React.CSSProperties;
  module?: string;
  onCloseModal?: any;
  navigate?: any;
  maskClose?: boolean;
  closable?: boolean;
  onCancel?: any;
  okText?:any;
  cancelText?:any;
  className?: string;
  confirmLoading?:boolean;
  okDisabled?: boolean;
}

const ConfirmationModal: React.FC<DynamicAlertProps> = ({
  children,
  showModal,
  footer,
  width,
  title,
  ismodalStyle,
  onOk,
  module,
  onCancel,
  onClose,
  navigate,
  maskClose,
  okText,
  cancelText,
  confirmLoading,
  okDisabled = false,
}) => {
  const { Color } = useTheme();
  const handleCancel = () => {
    setIsOpen(false);
    showModal[1](false);
    if (module && module === "lab-test") {
      navigate(pathConstants.opdLabPatient);
    }
  };

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(showModal[0]);
  }, [showModal[0]]);


  const modalStyles = {
    header: {paddingLeft:"0px"},
    mask: {
      backdropFilter: "blur(10px)",
    },
    content: {
      background: Color["--modalBackground"],
      padding: "15px",
      borderRadius: "9px",
    },
    footer: { textAlign: "end",margin:"0px 0px 0px 0px" },
    body: {padding:"5px 0px",minHeight:"64px"}
  };

  return (
    <Modal    
      title={title ? title : t("confirmation")}
      maskClosable={maskClose}
      open={isOpen}
      onOk={onOk??handleCancel}
      onCancel={onCancel ?? handleCancel}
      footer={footer ?? footer}
      styles={modalStyles}
      width={width}
      centered
      okText={okText ?? t('yes')}
      confirmLoading={confirmLoading}
      cancelText={ cancelText ?? t("no")}
      closeIcon
      okButtonProps={{ disabled: okDisabled, style: { borderRadius: "6px", minWidth: "80px",fontWeight:'500',fontSize:'16px'  } }}
      cancelButtonProps={ { style: { borderRadius: "6px", minWidth: "80px", marginRight:"10px", color:"#3e3e3e", fontWeight:'500',fontSize:'16px' } }}
      afterClose={onClose}
      closable

    >
      <Typography.Text className="text-left block font-[400] text-[16px] text-[#3e3e3e]">  
        {children}  
      </Typography.Text>
    </Modal>
  );
};

export default ConfirmationModal;
