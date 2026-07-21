import React from 'react';
import { Typography } from 'antd';
import { Heading } from '../../../helpers/dimentions';
import './heading.css';
import { useTheme } from '../../../contexts/Theme/Theme.context';

interface HeadingProps {
    title: any;
    style?: 'MainHeadingDark' | 'MainHeadingLight' | 'Heading0' | 'Heading1' | 'Heading2' | 'subHeading3' | 'subHeading4' | "labelHeading";
    type?: 'MainHeadingDark' | 'MainHeadingLight' | 'Heading0' | 'Heading1' | 'Heading2' | 'subHeading3' | 'subHeading4' | "labelHeading";
    color?: string;
    underline?: boolean;
    fontWeight?: string;
    clickHandler?: any;
    required?: boolean;
    preWrap?: boolean;   // ✅ added
}

const { Title } = Typography;

const CommonHeading: React.FC<HeadingProps> = (props) => {
    const {
        type,
        title,
        color,
        underline,
        fontWeight,
        clickHandler,
        required = false,
        preWrap
    } = props;

    const { Color } = useTheme();

    const headingStyles = {
        MainHeadingDark: Heading.MainHeadingDark,
        MainHeadingLight: Heading.MainHeadingLight,
        Heading0: Heading.Heading0,
        Heading1: Heading.Heading1,
        Heading2: Heading.Heading2,
        Heading3: Heading.Heading3,
        SubHeading4: Heading.subHeading4,
        labelHeading: Heading.labelHeading
    };

    const textStyle = {
        color: color || 'inherit',
        fontWeight: fontWeight || 'none',
        textDecoration: underline ? 'underline' : 'none',
        whiteSpace: preWrap ? 'pre-wrap' : 'normal', // ✅ added
    };

    return (
        <>
            {
                (type === 'Heading0') ? (
                    <Title level={2} style={{ ...headingStyles["Heading0"], ...textStyle }}>
                        {title}{required ? <span style={{ color: Color["--asterik"] }}>*</span> : ""}
                    </Title>
                ) : (type === 'MainHeadingDark') ? (
                    <Title level={2} style={{ ...headingStyles["MainHeadingDark"], ...textStyle }}>
                        {title}{required ? <span style={{ color: Color["--asterik"] }}>*</span> : ""}
                    </Title>
                ) : (type === 'MainHeadingLight') ? (
                    <Title level={2} style={{ ...headingStyles["MainHeadingLight"], ...textStyle, fontWeight: fontWeight || '500' }}>
                        {title}{required ? <span style={{ color: Color["--asterik"] }}>*</span> : ""}
                    </Title>
                ) : (type === 'Heading1') ? (
                    <Title level={3} style={{ ...headingStyles["Heading1"], ...textStyle }}>
                        {title}{required ? <span style={{ color: Color["--asterik"] }}>*</span> : ""}
                    </Title>
                ) : (type === 'Heading2') ? (
                    <Title level={3} style={{ ...headingStyles["Heading2"], ...textStyle }}>
                        {title}{required ? <span style={{ color: Color["--asterik"] }}>*</span> : ""}
                    </Title>
                ) : (type === 'subHeading3') ? (
                    <Title level={3} style={{ ...headingStyles["Heading3"], ...textStyle }}>
                        {title}{required ? <span style={{ color: Color["--asterik"] }}>*</span> : ""}
                    </Title>
                ) : (type === 'subHeading4') ? (
                    <Title level={3} style={{ ...headingStyles["SubHeading4"], ...textStyle }}>
                        {title}{required ? <span style={{ color: Color["--asterik"] }}>*</span> : ""}
                    </Title>
                ) : (type === 'labelHeading') ? (
                    <Title level={3} style={{ ...headingStyles["labelHeading"], ...textStyle, fontWeight: fontWeight || '500' }}>
                        {title}{required ? <span style={{ color: Color["--asterik"] }}>*</span> : ""}
                    </Title>
                ) : (
                    <></>
                )
            }
        </>
    );
};

export default CommonHeading;