import React from "react";
import { Tooltip, Typography } from "antd";
import { useTheme } from "../../../contexts/Theme/Theme.context";
import DTMainTitle from "../CustomTable/DTMainTitle";
import { InfoCircleFilled } from "@ant-design/icons";
import DTSubTitle from "../CustomTable/DTSubTitle";

interface StringDottedProp {
  str: string;
  sx?: any;
  sliceLength?: any;
  copyable?: boolean;
  bold?: boolean;
  showToolTip?: boolean;
  subTitle?: boolean;
}

export const StringDotted = ({
  str,
  sliceLength,
  copyable = true,
  bold = false,
  sx,
  showToolTip = true,
  subTitle = false,
}: StringDottedProp) => {
  const { Color } = useTheme();
  if (str?.length > sliceLength) {
    return (
      <>
        <div className="text-nowrap">
          {subTitle ? (
            <DTSubTitle
              bold={bold}
              TitleValue={str.slice(0, sliceLength - 5) + ".."}
            />
          ) : (
            <DTMainTitle
              bold={bold}
              TitleValue={str.slice(0, sliceLength - 5) + ".."}
              sx={{ display: "inline",fontSize:"inherit", ...sx }}
            />
          )}
          {showToolTip ? (
            <Tooltip
              overlayInnerStyle={{ borderRadius: "7px" }}
              placement="top"
              title={
                <Typography.Text copyable={copyable} className="text-[--white]">
                  {str}
                </Typography.Text>
              }
              color={Color["--black"]}
              className=""
            >
              <InfoCircleFilled className="cursor-pointer text-[#000000e0]" />
            </Tooltip>
          ) : (
            <></>
          )}
        </div>
      </>
    );
  } else {
    return str;
  }
};
