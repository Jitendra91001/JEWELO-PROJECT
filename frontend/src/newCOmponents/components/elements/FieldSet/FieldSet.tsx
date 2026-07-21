import { Typography } from 'antd';
import React from 'react';
import CommonHeading from '../HeadingTitle/CommonHeading';

interface FieldSetProps {
    children?: React.ReactNode;
    fieldSetTitle?: any;
    fieldClass?: string;
    fieldTitleClass?: string;
    required?: boolean;
}

export const FieldSet: React.FC<FieldSetProps> = ({ children, fieldSetTitle, fieldClass, fieldTitleClass, required }) => {

    return (
        <div className={`${fieldClass} h-auto w-auto relative mt-2 mb-1 rounded-md pt-3 pb-2`} style={{ border: "1px solid #C6C6C6" }}>
            <Typography.Text className={`${fieldTitleClass} absolute flex  -top-3 bg-white ps-1 pe-2 text-[#434343] text-base font-bold`}>
                {<CommonHeading title={fieldSetTitle || "FieldSetTitle"} type='labelHeading' />}
                <span style={{ color: 'var(--asterik")', display: required ? "contents" : "none" }} className='text-[--asterik]'>*</span>
            </Typography.Text>
            <div>
                {children}
            </div>
        </div>
    )
}