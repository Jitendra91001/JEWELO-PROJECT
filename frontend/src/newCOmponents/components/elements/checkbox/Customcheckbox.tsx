import { Checkbox } from 'antd';
import { useTheme } from '../../../contexts/Theme/Theme.context';
import React from 'react';
import CommonHeading from '../HeadingTitle/CommonHeading';

export type checkboxprops = {
  title?: string | undefined;
  size?: string | undefined;
  style?: object | undefined;
  onChange?: any | undefined;
  defaultChecked?: boolean | any;
  disabled?: boolean;
  checked?: boolean | undefined;
  onClick?: any | undefined;
  className?: any;
  tabIndex?: any;
  label?: any;
  name?:any;
};

function Customcheckbox({ size, name, title, tabIndex, label, style, onChange, defaultChecked = false, className, disabled = false, checked, onClick }: checkboxprops) {
  const { Color } = useTheme();
  return (
    <>
      {
        label
          ?
          <div className='flex items-baseline'>
            <label>
              <div className={`pr-2`}>
                <CommonHeading title={label} type="labelHeading" />
              </div>
            </label>
            {!(checked) ? 
            <Checkbox style={{ fontSize: size, color: Color['--blackWhite'], ...style }} className={className} name={name} tabIndex={tabIndex} onClick={onClick} defaultChecked={defaultChecked} onChange={onChange} disabled={disabled}>{title}</Checkbox> :
            <Checkbox style={{ fontSize: size, color: Color['--blackWhite'], ...style }} disabled={disabled} name={name} onClick={onClick} tabIndex={tabIndex}  onChange={onChange} checked={checked}>{title}</Checkbox>
            }
          </div>
          :
          <div className=''>
            {!(checked) ? <Checkbox style={{ fontSize: size, color: Color['--blackWhite'], ...style }} className={className} name={name} tabIndex={tabIndex} onClick={onClick} defaultChecked={defaultChecked} onChange={onChange} disabled={disabled}>{title}</Checkbox> :
              <Checkbox style={{ fontSize: size, color: Color['--blackWhite'], ...style }} disabled={disabled} name={name} onClick={onClick} tabIndex={tabIndex}  onChange={onChange} checked={checked}>{title}</Checkbox>
            }
          </div>
      }

    </>
  )
}
export default Customcheckbox;