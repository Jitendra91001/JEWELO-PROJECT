import { Button } from 'antd'
import React from 'react'

const LoginSaveButton = ({ htmlType, size, block, Children ,disabled=false}) => {
    return (
        <div>
            <Button
                disabled={disabled}
                style={{
                    color: "white",
                    height: "55px",
                    borderRadius: "9px",
                    borderBottom: "2px solid",
                    boxShadow: "0px 4px 6px #a5a5a5",
                    fontSize: "22px",
                    fontWeight: "bold",
                    backgroundColor: 'var(--primary)'
                }}
                htmlType={htmlType}
                size={size}
                block={block}
                className="flex justify-center items-center mt-2 hover:scale-105 duration-700"
            >
                {Children ?? "Save"}
            </Button>
        </div>
    )
}

export default LoginSaveButton