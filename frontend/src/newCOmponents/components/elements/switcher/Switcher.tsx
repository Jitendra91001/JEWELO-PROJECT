import React, { useState } from 'react';
import { Switch } from 'antd';
import { useTheme } from '../../../contexts/Theme/Theme.context';




interface SwitcherProps {
    initialValue: boolean;
    onSwitchChange: (checked: boolean) => void;
    switchColor?: string;
    switchSize?: 'small' | 'default' | 'large';
    sizeType: any,
  }
  
  const Switcher: React.FC<SwitcherProps> = ({ initialValue, onSwitchChange}) => {
    const [switchValue, setSwitchValue] = useState<boolean>(initialValue);
    const{Color}=useTheme();

    const handleSwitchChange = (checked: boolean) => {
      setSwitchValue(checked);
      onSwitchChange(checked);
    };

  return (
    <div>
      <p>Switch Value: {switchValue.toString()}</p>
      <Switch
        checked={switchValue}
        onChange={handleSwitchChange}
        style={{ color: Color["--switcherColor"] }}
      />
    </div>
  );
};

export default Switcher;
