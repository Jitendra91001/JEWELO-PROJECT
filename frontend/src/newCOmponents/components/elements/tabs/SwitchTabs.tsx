import { ConfigProvider, Segmented } from "antd";
import { SegmentedLabeledOption, SegmentedValue } from "antd/es/segmented";
import React from "react";
import { dateView } from "../../../utils/formatedDate";
import { useTranslation } from "react-i18next";

interface SwitchTabsProps {
  defaultValue?: string;
  options?: (SegmentedValue | SegmentedLabeledOption)[];
  setCalendarClick?: any;
  refreshTodayData?: any;
  setValue?: any;
  onChange?: any;
  onClick?: any;
  block?: boolean;
  vertical?: boolean;
  size?: "large" | "middle" | "small";
}

const SwitchTabs: React.FC<SwitchTabsProps> = ({
  defaultValue,
  options,
  setCalendarClick,
  setValue,
  onChange,
  onClick,
  block,
  size,
}) => {
  const { t } = useTranslation();
  return (
    <>
      <ConfigProvider
        theme={{
          components: {
            Segmented: {
              trackBg: "var(--primary)",
              itemActiveBg: "var(--primary)",
              itemSelectedBg: "var(--white)",
              itemSelectedColor: "var(--primary)",
              itemHoverColor: "var(--white)",
              itemColor: "var(--white)",
            },
          },
        }}
      >
        <Segmented
          size={size ? size : "middle"}
          value={defaultValue || "Today"}
          style={{ marginBottom: 8, padding: "6px" }}
          onChange={onChange}
          onClick={
            onClick
              ? onClick
              : (e: any) => {
                  if (e.target.title == t("calendar")) {
                    setCalendarClick(false);
                    setValue(dateView(new Date()));
                  }
                }
          }
          block={block ? block : false}
          options={options || ["Today", "Calendar"]}
        />
      </ConfigProvider>
    </>
  );
};

export default SwitchTabs;
