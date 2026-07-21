import { Input, Popover, Typography } from "antd";
import React, { useState } from "react";
// import {InputDy} from '../../../../src/helpers/dimentions'


interface InputPopverProps {
  data: any;
  handleChange: (value: any, name: any) => void;
  disabled: any;
  fieldName: any;
  fieldvalue: any;
  popoverClick: (value: any, name: any) => void;
  conditionValues: any;
  fieldError?: any;
  size?: "large" | "middle" | "small";

}

const InputWithPopover: React.FC<InputPopverProps> = ({
  data,
  handleChange,
  disabled,
  fieldName,
  fieldvalue,
  popoverClick,
  fieldError,
  conditionValues,
  size
}) => {
  const [showList  ,setShowList ] = useState(false);

//   const InputSize ={
//     small: InputDy?.smallInput,
//     middle:InputDy?.middleInput,
//     large:InputDy?.largeInput
// }
  return (
    <Popover
      content={ 
        data?.map((item: any,index:any) => {
          return (
            <Typography.Text
              className={`hover:bg-[#3c9a9f] block`}
              onClick={() => {popoverClick(item, fieldName)
              setShowList(false)}}
              key={index}
            >
              {item.label}
            </Typography.Text>
          );
        })
      }

      visible={showList}
    >
      <Input
        onChange={(e) => {
          handleChange(e.target.value, fieldName);
          setShowList(true)
        }}
        // style={InputSize[size]}
        size={size?size:"middle"}
        value={fieldvalue}
        disabled={disabled}
        status={fieldError && fieldvalue == undefined && "error"}
      />
    </Popover>
  );
};
export default InputWithPopover;
