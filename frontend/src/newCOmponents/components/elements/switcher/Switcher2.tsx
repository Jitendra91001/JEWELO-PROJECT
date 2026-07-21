import React, { useState, useEffect } from "react";
import { Switch } from "antd";
import { useTheme } from "../../../contexts/Theme/Theme.context";

interface SwitcherProps {
  initialValue?: boolean;
  onSwitchChange?: (checked: boolean) => void;
  id?: string;
  value?: boolean; // for controlled mode
  disabled?: boolean;
  name?: string;
  size?: "small" | "default";
}

const Switcher2: React.FC<SwitcherProps> = ({
  initialValue = false,
  onSwitchChange,
  id,
  value,
  disabled = false,
  size = "default",
}) => {
  const { Color } = useTheme();

  // Controlled vs uncontrolled handling
  const isControlled = value !== undefined;

  const [switchValue, setSwitchValue] = useState<boolean>(initialValue);

  useEffect(() => {
    if (isControlled) {
      setSwitchValue(value as boolean);
    }
  }, [value, isControlled]);

  const handleSwitchChange = (checked: boolean) => {
    if (!isControlled) {
      setSwitchValue(checked);
    }
    onSwitchChange?.(checked);
  };

  return (
    <div className="flex items-center">
      <Switch
        checked={switchValue}
        onChange={handleSwitchChange}
        id={id}
        disabled={disabled}
        size={size}
        style={{
          backgroundColor: switchValue ? Color["--switcherColor"] : undefined,
        }}
      />
    </div>
  );
};

export default Switcher2;
