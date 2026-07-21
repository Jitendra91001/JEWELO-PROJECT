import React, { ReactNode } from "react";
import { Modal, Button, Space } from "antd";
import { useTheme } from "../../../contexts/Theme/Theme.context";
import { useTranslation } from "react-i18next";

interface DynamicAlertProps {
  visible: boolean;
  onClose: () => void;
  content: ReactNode;
  title?: ReactNode;
}

const DynamicAlert: React.FC<DynamicAlertProps> = ({ onClose, title }) => {
  const { Color } = useTheme();
  const { t } = useTranslation();
  const handleCancel = () => {
    onClose();
  };

  return (
    <>
      <Modal
        title={<div style={{ color: Color["--buttonTextColor"] }}>{title}</div>}
        onCancel={handleCancel}
        footer={
          <Space>
            <Button
              style={{
                backgroundColor: Color["--buttonBackgroundColor"],
                color: Color["--buttonTextColor"],
              }}
              key="cancel"
              onClick={handleCancel}
            >
              {t("cancel")}
            </Button>
          </Space>
        }
      ></Modal>
    </>
  );
};

export default DynamicAlert;
