import React, { ReactNode, useEffect, useState } from "react";
import { Modal, Typography } from "antd";
import { useTheme } from "../../../contexts/Theme/Theme.context";
import { pathConstants } from "../../../constant";
import { CloseCircleOutlined } from "@ant-design/icons";

interface DynamicAlertProps {
  children?: ReactNode;
  onClose?: any;
  title?: ReactNode;
  showModal: any[]; // send your state getter and setter as [showModal , setShowModal]
  footer?: any;
  width?: number;
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
  cancelText?: string;
  closable?: boolean;
  onCancel?: any;
  className?: string;
  bodyStyle?:React.CSSProperties;
  keyboard?:boolean;
}

const CustomModal: React.FC<DynamicAlertProps> = ({
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
  module,
  onCancel,
  navigate,
  maskClose,
  cancelText,
  closable,
  className,
  bodyStyle,
  keyboard
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
    <div style={{ color: Color["--primary"], fontSize: "25px" }}>{title}</div>
  );

  const modalStyles = {
    header: {
      borderLeft: `5px solid ${Color["--primary"]}`,
      paddingInlineStart: 5,
    },
    mask: {
      backdropFilter: "blur(10px)",
    },
    content: {
      background: Color["--modalBackground"],
    },
  };

  return (
    <>
      <Modal
        title={<CustomTitle />}
        maskClosable={maskClose}
        open={isOpen}
        onOk={handleCancel}
        onCancel={onCancel ?? handleCancel}
        footer={footer}
        styles={ismodalStyle ?? modalStyles}
        width={width}
        centered={centered}
        okText={okText ?? "OK"}
        cancelText={cancelText ?? "Cancel"}
        closeIcon={closeIcon ? false : <CloseCircleOutlined />}
        style={style ? style : { height: "800px" }}
        okButtonProps={okButtonProps ? { style: okButtonProps } : {style:{fontWeight:'500',fontSize:'16px'}}}
        cancelButtonProps={
          cancelButtonProps ? { style: cancelButtonProps } : {style:{fontWeight:'500',color:"#3e3e3e",fontSize:'16px'}}
        }
        afterClose={onClose}
        closable={false}
        className={className}
        bodyStyle={bodyStyle}
        keyboard={keyboard}
      >
        <Typography.Text className="text-center block font-[600] text-[18px] text-[#3e3e3e]">
        {children}
        </Typography.Text>
      </Modal>
    </>
  );
};

export default CustomModal;
