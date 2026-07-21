import { Typography } from "antd";
import React from "react";

interface HeadingProps {
    title: string;
}
const { Title } = Typography;
const SectionTitle: React.FC<HeadingProps> = (props) => {
    return (
        <>
            <Title level={2} style={{ fontSize: '24px', fontWeight: 400 }}>{props.title}</Title>
        </>
    )
}

export default SectionTitle
