import React, { useState } from 'react';
import { Typography, Tooltip, message } from 'antd';
import {
  EyeOutlined,
  EyeInvisibleOutlined,
  CopyOutlined,
} from '@ant-design/icons';

interface PasswordType {
  password ?: any
}
const PasswordDisplay = ({password}:PasswordType) => {
  const [visible, setVisible] = useState(false);

  const toggleVisibility = () => {
    setVisible((prev) => !prev);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(password);
    message.success('Password copied!');
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <Typography.Text  style={{ fontSize: "15px", minWidth:"90px" }}>
        {visible ? password : '•••••••••'}
      </Typography.Text>

      <Tooltip title={visible ? 'Hide' : 'Show'}>
        {visible ? (
          <EyeOutlined
            onClick={toggleVisibility}
            style={{ cursor: 'pointer', fontSize: "23px" }}
          />
        ) : (
          <EyeInvisibleOutlined
            onClick={toggleVisibility}
            style={{ cursor: 'pointer', fontSize: "23px" }}
          />
        )}
      </Tooltip>

      <Tooltip title="Copy password">
        <CopyOutlined
          onClick={copyToClipboard}
          style={{ cursor: 'pointer', fontSize: "23px", color: 'var(--primary)' }}
        />
      </Tooltip>
    </div>
  );
};

export default PasswordDisplay;
