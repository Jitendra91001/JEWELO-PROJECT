import React from 'react'
import { Footer } from 'antd/es/layout/layout'
import { Col, Row, Typography } from 'antd'
import { useTheme } from '../../contexts/Theme/Theme.context'
import { useTranslation } from 'react-i18next'


const AppFooter = () => {

  const { Color } = useTheme();
  const { t } = useTranslation()

  return (
    <>
      <Footer style={{ zIndex: 20, textAlign: 'right', bottom: 0, width: '100%', padding: '3px 10px', background: Color["--primary"], position: "sticky" }}>
        <Row wrap={false}>
          <Col span={24}>
            <Typography.Text style={{ fontSize: '16px', fontWeight: '400', color: "white" }}>
              {'Powered by'} <strong>{'Bharat'}</strong> {'HIMS'}
            </Typography.Text>
          </Col>
        </Row>
      </Footer>
    </>
  )
}

export default AppFooter;
