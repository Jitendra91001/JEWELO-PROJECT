import React from 'react';
import { Typography } from 'antd';
import { Heading } from '../../../helpers/dimentions';
interface HeadingProps {
    title: string;
    style?: 'Heading3' | 'Heading4' | 'Heading5';
    type?: 'font1' | 'clickFont' | 'font2' | 'font3'| 'font4' | 'clickFont2';
    color?: string;
    underline?: boolean;
    clickHandler? :any;
    preWrap? : any;
}

const { Text } = Typography;

const CommonText: React.FC<HeadingProps> = (props) => {
    const { type, title, color, underline, clickHandler , preWrap } = props;

    const headingStyles = {
        Heading3: Heading.Heading3,
        Heading4: Heading.Heading4,
        Heading5: Heading.Heading5,
        Heading6:Heading.Heading6,
        Heading7:Heading.Heading7,
        Heading8:Heading.Heading8
    };

    const textStyle = {
        color: color || 'inherit',
        textDecoration: underline ? 'underline' : 'none',
        whiteSpace: preWrap ? 'pre-wrap' : 'normal'
    };

    return (
        <>
            {

                (type === 'font1') ? (
                    <Text style={{ ...headingStyles["Heading3"], ...textStyle }} className='block'>{title}</Text>
                ) : (type === 'clickFont') ? (
                    <Text style={{ ...headingStyles["Heading4"], ...textStyle }} className='block cursor-pointer' onClick={clickHandler}>{title}</Text>
                ) : (type === 'font2') ? (
                    <Text style={{ ...headingStyles["Heading5"], ...textStyle }} className='block'>{title}</Text>
                ) : (type ==='font3')?(
                    <Text style={{ ...headingStyles["Heading6"], ...textStyle }} className='block'>{title}</Text>
                ) : (type ==='font4')?(
                    <Text style={{ ...headingStyles["Heading8"], ...textStyle }} className='block'>{title}</Text>
                ) : (type === 'clickFont2') ? (
                    <Text style={{ ...headingStyles["Heading7"], ...textStyle }} className='block cursor-pointer' onClick={clickHandler}>{title}</Text>
                ):(<></>)
            }
        </>
    );
};

export default CommonText;
