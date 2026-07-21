import React, { ReactNode, useEffect, useState } from "react";
import { Modal, Typography } from "antd";
import { useTheme } from "../../../contexts/Theme/Theme.context";
import { pathConstants } from "../../../constant";
import { CloseCircleOutlined } from "@ant-design/icons";

interface DynamicAlertProps {
  children?: ReactNode;
  onClose?: any;
  onOk?: any;
  title?: ReactNode;
  showModal: any[]; // send your state getter and setter as [showModal , setShowModal]
  footer?: any;
  width?: any;
  style?: React.CSSProperties;
  ismodalStyle?: any;
  centered?: boolean;
  closeIcon?: boolean;
  okText?: string;
  okButtonProps?: React.CSSProperties;
  cancelButtonProps?: React.CSSProperties;
  module?: string;
  onCloseModal?: any;
  navigate?: any;
  maskClose?: boolean;
  okDisabled ? : boolean;
  cancelText?: string;
  closable?: boolean;
  onCancel?: any;
  className?: string;
  bodyStyle?: React.CSSProperties;
  footerStyle?: React.CSSProperties;
  headerStyle?: React.CSSProperties;
  tableChildren?:ReactNode;
  confirmLoading?:boolean;
  showHeaderBorder?:any;
}

const LatestModal: React.FC<DynamicAlertProps> = ({
  children,
  title,
  showModal,
  footer,
  width,
  style,
  ismodalStyle,
  centered,
  closeIcon,
  okText,
  okButtonProps,
  cancelButtonProps,
  onClose,
  onOk,
  module,
  onCancel,
  navigate,
  maskClose,
  cancelText,
  closable,
  className,
  bodyStyle,
  okDisabled = false ,
  footerStyle,
  headerStyle,
  tableChildren,
  confirmLoading,
  showHeaderBorder
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

  const CustomTitle: React.FC = () => (
    <Typography.Text>{title}</Typography.Text>
  );

  const modalStyles = {
    header: {margin:showHeaderBorder?"0px -14px 10px -14px":"0px", paddingLeft: showHeaderBorder ? "13px" : '0px' , paddingBottom:showHeaderBorder?'5px':'0px',borderBottom: showHeaderBorder ?'1px solid #C6C6C6':''},
    mask: {
      backdropFilter: "blur(10px)",
    },
    content: {
      background: Color["--modalBackground"],
      padding: "15px",
      borderRadius: "9px",
    },
    footer: footerStyle ? footerStyle : { textAlign: "end",margin:"0px 0px 0px 0px" },
    body: { padding: "5px", minHeight: "100px" }
  };


  return (
    <Modal
      title={title ?? <CustomTitle />}
      maskClosable={maskClose}
      open={isOpen}
      onOk={onOk ?? handleCancel}
      onCancel={onCancel ?? handleCancel}
      footer={footer ?? footer}
      styles={ismodalStyle ?? modalStyles}
      width={width}
      centered
      okText={okText ?? "Yes"}
      cancelText={cancelText ?? "No"}
      closeIcon={closeIcon ? true : <CloseCircleOutlined />}
      okButtonProps={
        okButtonProps
          ? { style: {...okButtonProps, borderRadius: "6px", minWidth: "80px",fontWeight:'500',fontSize:'16px' , } , disabled : okDisabled  }
          : { style: { borderRadius: "6px", minWidth: "80px",fontWeight:'500',fontSize:'16px'   } , disabled : okDisabled }
      }
      cancelButtonProps={
        cancelButtonProps
          ? { style: {...cancelButtonProps, borderRadius: "6px", minWidth: "80px", marginRight:"10px",fontWeight:'500',fontSize:'16px' }}
          : { style: { borderRadius: "6px", minWidth: "80px", marginRight:"10px", color:"#3e3e3e",fontWeight:'500',fontSize:'16px' } }
      }
      afterClose={onClose}
      closable={closable ? true : false}
      confirmLoading={confirmLoading}
    >
      <Typography.Text className="text-center block font-[600] text-[18px] text-[#3e3e3e]">  
        {children} 
      </Typography.Text>
      {tableChildren}
    </Modal>
  );
};

export default LatestModal;
