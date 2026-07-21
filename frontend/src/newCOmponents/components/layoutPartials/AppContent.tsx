import { theme } from 'antd';
import { Content } from 'antd/es/layout/layout'
import React from 'react';
import { LAYOUT } from '../../helpers/dimentions';


type Props = {
  children:  
  | JSX.Element
  | JSX.Element[]
  | string
  | string[]

  contentStyle?: React.CSSProperties
}

const AppContent  = ({children , contentStyle} : Props) => {

  const {
    token: {borderRadiusLG },
    } = theme.useToken();
    
  return (
    <>
    <Content style={{backgroundColor:"var(--ghostColor)" ,
      borderRadius: borderRadiusLG,
      height:LAYOUT.layoutContent.height,
      padding:LAYOUT.layoutContent.padding,
      overflow:"auto",
      overflowX:"hidden"
      }} className='outer'>

    {children}
    </Content>
    </>
  )
}

export default AppContent