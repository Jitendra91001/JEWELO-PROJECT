import { Typography } from 'antd'
import React from 'react'

interface DTSubTitleProps {
    TitleValue: any;
    bold: boolean;
}
const DTSubTitle = ({ TitleValue, bold }: DTSubTitleProps) => {

    return (
        <Typography.Text style={{fontSize:"inherit", fontWeight: bold ? 500 : 400 }} className={'text-gray-400 subtitleTable inline text-nowrap'} >
            {TitleValue ?? <Typography.Text style={{fontSize:"inherit"}}>N/A</Typography.Text>}
        </Typography.Text>
    )
}

export default DTSubTitle