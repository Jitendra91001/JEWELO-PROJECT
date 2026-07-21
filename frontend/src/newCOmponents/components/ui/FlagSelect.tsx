import React from "react";
import { Col, Row, Select } from "antd";

interface FlagSelectProp {
    options?:any;
    handleChange?:any;
    value?:any;
    disabled?:boolean;
}

const filterOption = (input: string, option?: { label: any; value: string }) =>
  (option?.value ?? "").toLowerCase().includes(input.toLowerCase());

const FlagSelect: React.FC = ({options , handleChange , value , disabled}:FlagSelectProp) => {
    
    options = options && options.length > 0 && options.map((e)=>(

        {
            value : e.value,
            label : (

                <Row wrap={false} gutter={[8,8]}>
                    {e?.flag &&
                 
                    <Col flex={"none"}>
                        <img
                    src={e?.flag}
                    height="15px"
                    width="18px"
                    alt=""
                    />
                    </Col>
                    }
                    <Col flex={"auto"} className="mr-4">
                    {e.label}
                    </Col>
                </Row>
            )
        }
    ))

    return (
        <Select
            showSearch
            optionFilterProp="children"
            onChange={handleChange}
            filterOption={filterOption}
            options={options}
            style={{minWidth:'111px', height:"27px"}}
            value={value}
            disabled={disabled}
        />
    )
};

export default FlagSelect;
