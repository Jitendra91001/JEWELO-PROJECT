import React from 'react';
import { Spin } from 'antd';
import { t } from '../../i18n/i18n';

const LoadingPage = () => {
  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f7f7f7',
        flexDirection: 'column',
        padding: 20,
      }}
    >
      <Spin size="default" style={{ marginBottom: 20 }} />
      <p style={{ fontSize: 18, color: "var(--primary)" }}>{t("pleaseWait")}</p>
    </div>
  );
};

export default LoadingPage;