import { Typography } from "antd";
import React from "react";

interface HeadingProps {
    title: string;
  }

  
const {Title} = Typography;

const HeadingTitle: React.FC<HeadingProps> = (props) => {
    return(
        <>
        <Title level={1} style={{fontSize:'25px',fontWeight:500}}>{props.title}</Title>
        </>
    )
}

export default HeadingTitle


