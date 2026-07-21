import { Checkbox} from 'antd';
import { useTheme } from '../../../contexts/Theme/Theme.context';
import React from 'react';

export type checkboxprops = {
  title?: string | undefined;
  size?: string | undefined;
  style?:object|undefined;
  onChange?:any|undefined;
  defaultChecked?:boolean|any;
  disabled?:boolean;
  checked?:boolean|undefined;
  onClick?:any|undefined;
  className?:any;

};

function Customcheckbox2({size ,title, style,onChange,defaultChecked=false,className, disabled=false,checked,onClick}: checkboxprops) {
  const {Color} = useTheme();
  return (
    <>
    <Checkbox style={{fontSize:size,color:Color['--blackWhite'],...style}} checked={checked} className={className} onClick={onClick} defaultChecked={defaultChecked} onChange={onChange} disabled={disabled}>{title}</Checkbox>
    </>
  )
}
export default Customcheckbox2;