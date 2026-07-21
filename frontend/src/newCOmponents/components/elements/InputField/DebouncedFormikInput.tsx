import React, { useEffect, useState } from "react";
import NormalInputField from "../InputField/NormalInput";


type DebouncedFormikInputProps = {
    value: any;
    onDebounceChange: (val: any) => void;
    delay?: number;
    type?: string;
    onlyNumber?: boolean;
    maxQty?: number;
    maxValue?: number;
    status?: any;
    disabled?: boolean;
    maxLength?: number;
    name?: any;
    onBlur?:any;
    validation?: any;
    regx?: any;
    errors?: any;
    setErrors?: any;
    regexErrors?: string;
    api?:any;
    size?: "large" | "middle" | "small";
  };
  const DebouncedFormikInput = ({
  value,
  onDebounceChange,
  delay = 300,
  type = "text",
  onlyNumber = false,
  maxQty,
  maxValue,
  status,
  disabled,
  maxLength,
  name,
  onBlur,
  validation,
  regx,
  errors,
  setErrors,
  regexErrors,
  api,
  size
}: DebouncedFormikInputProps) => {
    const inputValidation = (evt: any) => {
        const regxs = new RegExp(regx)
        const { value } = evt.target || evt;
        if (!regxs.test(value)) {
          setErrors({...errors, [name]: regexErrors });
        } else {
          setErrors({...errors,[name]: ""});
        }
    };
  const [localValue, setLocalValue] = useState(value ?? "");

  useEffect(() => {
    setLocalValue(value ?? "");
  }, [value]);

  useEffect(() => {
    const timer = setTimeout(() => {
      onDebounceChange(localValue);
    }, delay);

    return () => clearTimeout(timer);
  }, [localValue]);

  return (
    <NormalInputField
    type={type}
    value={localValue}
    status={status}
    name={name}
    size={size}
    onBlur={(e:any) => validation ? inputValidation(e) : api === true ? onBlur(e) :"" }
      onChange={(e) => {
        const val = e.target.value;
        if (val === "") {
            setLocalValue("");
            return;
          }
        if (onlyNumber && !/^\d*$/.test(val)) return;
        if (typeof maxValue === "number" && Number(val) > maxValue) {
          return;
        }
        if (maxQty !== undefined && Number(val) > maxQty) return;
        setLocalValue(val);
      }}
    disabled={disabled}
    maxLength={maxLength}
  />
  );
};

export default React.memo(DebouncedFormikInput);
