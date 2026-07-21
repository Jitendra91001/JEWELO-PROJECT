import React, { ReactNode } from 'react';
import { Drawer } from 'antd';

interface Props {
  title?: any;
  children?: ReactNode;
  footer?: ReactNode;
  open?: boolean,
  onClose?: any,
  width?: any,
  closable?: boolean,
  className?: any,
  bodyStyle?: React.CSSProperties,
  headerStyle?: React.CSSProperties,
  footerStyle?: React.CSSProperties,
  maskClosable?: boolean;
}


const Drawers: React.FC<Props> = ({ title, children, footer, open, onClose, width, closable, className, bodyStyle,headerStyle,footerStyle,maskClosable }) => {
  return (
    <>
      <Drawer
        title={title ?? ""}
        onClose={onClose}
        bodyStyle={bodyStyle ?? ""}
        headerStyle={headerStyle ?? ""}
        footerStyle={footerStyle ?? ""}
        open={open}
        footer={footer ?? false}
        width={width ?? "500px"}
        closable={closable ?? true}
        className={className ?? ''}
        maskClosable={maskClosable ?? true}
      >
        {children}
      </Drawer>
    </>
  );
};

export default Drawers;
