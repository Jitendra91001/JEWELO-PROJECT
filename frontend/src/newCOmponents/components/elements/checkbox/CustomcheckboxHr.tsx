import { Checkbox } from 'antd';
import { useTheme } from '../../../contexts/Theme/Theme.context';
import React from 'react';
import CommonText from '../HeadingTitle/CommonText';
import './CustomcheckboxHr.css';

export type CheckboxProps = {
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
  name?: any;
  lableBefore?:boolean;
};

function CustomcheckboxHr({ size, name, title, tabIndex, label, style, onChange, defaultChecked = false, className, disabled = false, checked, onClick,lableBefore }: CheckboxProps) {
  const { Color } = useTheme();
  return (
    <>
      {label ? (
        <div className='flex items-center custom-checkbox-hr'>
             { lableBefore &&
          <label>
            <div className='pr-2'>
              <CommonText title={label} type='font2' />
            </div>
          </label>}
          {!(checked) ? (
            <Checkbox
              style={{ fontSize: size, color: Color['--blackWhite'], ...style }}
              className={className}
              name={name}
              tabIndex={tabIndex}
              onClick={onClick}
              defaultChecked={defaultChecked}
              onChange={onChange}
              disabled={disabled}
            >
               <span style={{ color:  Color['--blackWhite'] }}>{title}</span>
            </Checkbox>
          ) : (
            <Checkbox
              style={{ fontSize: size, color: Color['--blackWhite'], ...style }}
              disabled={disabled}
              name={name}
              onClick={onClick}
              tabIndex={tabIndex}
              onChange={onChange}
              checked={checked}
            >
               <span style={{ color:  Color['--blackWhite'] }}>{title}</span>
            </Checkbox>
          )}
          { !lableBefore &&
          <label>
            <div className='pl-2'>
              <CommonText title={label} type='font2' />
            </div>
          </label>}
        </div>
      ) : (
        <div className='custom-checkbox-hr'>
          {!(checked) ? (
            <Checkbox
              style={{ fontSize: size, color: Color['--blackWhite'], ...style }}
              className={className}
              name={name}
              tabIndex={tabIndex}
              onClick={onClick}
              defaultChecked={defaultChecked}
              onChange={onChange}
              disabled={disabled}
            >
                <span style={{ color: Color['--blackWhite']}}>{title}</span>
            </Checkbox>
          ) : (
            <Checkbox
              style={{ fontSize: size, color: Color['--blackWhite'], ...style }}
              disabled={disabled}
              name={name}
              onClick={onClick}
              tabIndex={tabIndex}
              onChange={onChange}
              checked={checked}
            >
                <span style={{ color: Color['--blackWhite'] }}>{title}</span>
            </Checkbox>
          )}
        </div>
      )}
    </>
  );
}

export default CustomcheckboxHr;
