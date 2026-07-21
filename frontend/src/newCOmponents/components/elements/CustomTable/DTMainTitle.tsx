import { Typography } from 'antd'
import React from 'react'

interface DtMianTitleProps {
    TitleValue: any;
    bold?: boolean;
    sx?: CSSPropertyRule | any;
    underline?: boolean;
    onClick? : any;
}

const DTMainTitle = ({ TitleValue, bold, sx ,underline , onClick}: DtMianTitleProps) => {
    return (
        <Typography.Text underline={underline} style={{ fontSize:"inherit",fontWeight: bold ? 600 : 400, ...sx  }} className={`block text-nowrap`} onClick={onClick}>
            {TitleValue ?? <Typography.Text style={{fontSize:"inherit"}}>N/A</Typography.Text>}
        </Typography.Text>
    )
}

export default DTMainTitle