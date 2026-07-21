import React, { useEffect, useState } from "react";
import { Input, theme, Transfer, Tree, Typography } from "antd";
import type { GetProp, TransferProps, TreeDataNode } from "antd";
import IconButton from "../Button/IconButton";
import { LeftOutlined, RightOutlined, SearchOutlined } from "@ant-design/icons";
import "./commonTransfer.css";
import NormalInputField from "../InputField/NormalInput";
import { ValidateInteger } from "../../../helpers/ValidateNumber.ts";
import { t } from "../../../i18n/i18n";

type TransferItem = GetProp<TransferProps, "dataSource">[number];
interface TreeTransferProps {
  dataSource: TreeDataNode[];
  className?: any;
  showSearch?: boolean;
  showSelectAll?: boolean;
  disabled?: boolean;
  setSelectedDataSource?: any;
  setTargetCheckedKeys: any;
  leftTreeData?: any[];
  currentServiceKey?: any;
  setLeftTreeData?: any;
  rightTreeData?: any[];
  setRightTreeData?: any;
  leftSearchInput?: string;
  rightSearchInput?: string;
  setCheckedKeys: any;
  setLeftSearchInput?: any;
  setRightSearchInput?: any;
  checkedKeys: any;
  targetCheckedKeys: any;
  targetKeys: TransferProps["targetKeys"];
  onChange: TransferProps["onChange"];
  headerRenderHeader?: (direction: "left" | "right") => React.ReactNode;
  filterFunction?: (item: TreeDataNode) => boolean;
  renderSelectBox?: () => React.ReactNode;
  selectedDataSource?: any;
  serviceType: any;
}

const generateTree = (
  treeNodes: TreeDataNode[] = [],
  checkedKeys: TreeTransferProps["targetKeys"] = []
): TreeDataNode[] =>
  treeNodes
    .filter(({ key }) => !checkedKeys.includes(key as string))
    .map(({ children, ...props }) => ({
      ...props,
      disabled: checkedKeys.includes(props.key as string),
      children: generateTree(children, checkedKeys),
    }));

const CommonTreeTranfer: React.FC<TreeTransferProps> = ({
  dataSource,
  className,
  showSearch,
  showSelectAll,
  targetKeys = [],
  headerRenderHeader,
  checkedKeys,
  onChange,
  setCheckedKeys,
  targetCheckedKeys,
  setSelectedDataSource,
  setTargetCheckedKeys,
  currentServiceKey,
  leftSearchInput,
  setLeftSearchInput,
  leftTreeData,
  setLeftTreeData,
  rightTreeData,
  setRightTreeData,
  setRightSearchInput,
  rightSearchInput,
  filterFunction,
  selectedDataSource,
  renderSelectBox,
  serviceType,
  disabled,
  ...restProps
}) => {
  const { token } = theme.useToken();
  const transferDataSource: TransferItem[] = [];
  const [leftExpandKey, setLeftExpandKey] = useState<any[]>([1]);
  const [rightExpandKey, setRightExpandKey] = useState<any>([1]);

  function flatten(list: TreeDataNode[] = []) {
    list.forEach((item) => {
      if (!filterFunction || filterFunction(item)) {
        transferDataSource.push(item as TransferItem);
      }
      flatten(item.children);
    });
  }
  flatten(dataSource);

  const handleSearch = (val, direction) => {
    if (val) {
      if (direction === "left") {
        setLeftSearchInput(val);
        const filterData: any = dataSource?.[0]?.children?.filter((ele: any) =>
          ele?.title?.toLowerCase().includes(val?.toLowerCase())
        );
        if (filterData && filterData.length == 0) {
          setLeftTreeData([]);
        } else {
          setLeftTreeData([{ ...dataSource?.[0], children: filterData }]);
        }
      } else if (direction === "right") {
        setRightSearchInput(val);
        let filterData = selectedDataSource.map((parent) => {
          const filteredChildren = parent?.children.filter((child) =>
            child.title.toLowerCase().includes(val.toLowerCase())
          );
          if (filteredChildren?.length > 0) {
            setRightExpandKey((pre) => [...pre, parent?.key]);
            return { ...parent, children: filteredChildren };
          }
        });
        filterData = filterData.filter(
          (item) => item !== null && item !== undefined
        );
        if (filterData.length == 0) {
          setRightTreeData([]);
        } else {
          setRightTreeData(filterData);
        }
      }
    } else {
      if (direction === "left") {
        setLeftTreeData(dataSource);
        setLeftSearchInput("");
      } else if (direction === "right") {
        setRightSearchInput("");
        setRightTreeData(selectedDataSource);
        setRightExpandKey([currentServiceKey]);
      }
    }
  };

  useEffect(() => {
    if (rightSearchInput === "") {
      setRightExpandKey([currentServiceKey]);
    }
  }, [rightSearchInput]);

  useEffect(() => {
    if (leftSearchInput !== "") {
      handleSearch(leftSearchInput, "left");
    } else {
      setLeftTreeData(dataSource);
      setLeftExpandKey([dataSource?.[0]?.key]);
      setRightExpandKey([dataSource?.[0]?.key]);
    }
  }, [dataSource, leftSearchInput]);

  useEffect(() => {
    setRightTreeData(selectedDataSource);
  }, [selectedDataSource]);

  const allParentService = ["S1", "S2", "S3", "S4", "S5"];

  const handleLeftCheck = (key) => {
    if (checkedKeys.includes(key)) {
      if (allParentService.includes(key)) {
        setCheckedKeys(targetKeys);
      } else {
        let filterKey = checkedKeys.filter(
          (ele) => ![key, ...allParentService].includes(ele)
        );
        filterKey = filterKey?.filter((ele) => ele != currentServiceKey);
        setCheckedKeys(filterKey);
      }
    } else {
      if (allParentService.includes(key)) {
        if (
          leftTreeData?.[0]?.children?.every((item) =>
            checkedKeys.includes(item?.key)
          )
        ) {
          setCheckedKeys(targetKeys);
        } else {
          let keyList: any[] = [
            ...checkedKeys,
            ...(leftTreeData?.[0]?.children
              ? leftTreeData[0].children.map((ele) => ele?.key)
              : []),
            key,
          ];
          keyList = [...new Set(keyList)];
          setCheckedKeys(keyList);
        }
      } else {
        setCheckedKeys((pre: any) => [...pre, key]);
      }
    }
  };

  const handleRightCheck = (keys) => {
    setTargetCheckedKeys(keys);
  };

  function handleUpdateServiceUnit(unit: any, newData: any) {
    if (newData?.type === "child") {
      const updateData = selectedDataSource?.map((ele) => {
        if (ele?.key === newData?.parentId) {
          const child = ele?.children?.map((itt) => {
            if (itt?.key === newData?.key) {
              return Number(unit) === 0
                ? { ...itt, unit: "" }
                : {
                    ...itt,
                    unit: unit,
                    total_price:
                      unit > 0 ? itt?.price * unit : itt?.total_price,
                  };
            } else {
              return itt;
            }
          });
          return { ...ele, children: child };
        } else {
          return ele;
        }
      });
      setSelectedDataSource(updateData);
    }
  }

  function handleUpdateServicePrice(price: any, newData: any) {
    if (newData?.type === "child") {
      const ddd = selectedDataSource?.map((ele) => {
        if (ele?.key === newData?.parentId) {
          const child = ele?.children?.map((itt) => {
            if (itt?.key === newData?.key) {
              return { ...itt, total_price: price, price: price / itt?.unit };
            } else {
              return itt;
            }
          });
          return { ...ele, children: child };
        } else {
          return ele;
        }
      });
      setSelectedDataSource(ddd);
    }
  }

  return (
    <>
      <Transfer
        className={`${className} transferContainer`}
        {...restProps}
        disabled={disabled ?? false}
        targetKeys={targetKeys}
        dataSource={transferDataSource}
        operationStyle={{ visibility: "hidden" }}
        render={(item) => item.title!}
        showSelectAll={showSelectAll ?? false}
        titles={[
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            {headerRenderHeader?.("left") || "Source"}
            {renderSelectBox?.()}
          </div>,
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            {headerRenderHeader?.("right") || "Target"}
          </div>,
        ]}
      >
        {({ direction, onItemSelect, selectedKeys }) => {
          if (direction === "left") {
            return (
              <div style={{ padding: token.paddingXS }}>
                <div className="absolute left-[50%] top-[52%] -translate-x-[50%]">
                  <IconButton
                    size={"small"}
                    icon={<LeftOutlined />}
                    disabled={targetCheckedKeys.length !== 0 ? false : true}
                    onClick={() => onChange(targetCheckedKeys, "left")}
                  />
                </div>
                <div className="w-[100%]">
                  <NormalInputField
                    type="text"
                    size={"small"}
                    placeholder={t("search")}
                    value={leftSearchInput}
                    suffix={<SearchOutlined />}
                    onChange={(e) => handleSearch(e.target.value, "left")}
                  />
                </div>
                <Tree
                  blockNode
                  checkable
                  defaultExpandAll
                  checkedKeys={checkedKeys}
                  selectedKeys={checkedKeys}
                  onExpand={(key) => setLeftExpandKey(key)}
                  expandedKeys={leftExpandKey}
                  treeData={generateTree(leftTreeData, targetKeys)}
                  onCheck={(keys, { node: { key } }) => handleLeftCheck(key)}
                  onSelect={(keys, { node: { key } }) => handleLeftCheck(key)}
                  height={480}
                />
              </div>
            );
          } else if (direction === "right") {
            return (
              <div style={{ padding: token.paddingXS }}>
                <div className="absolute right-[50%] bottom-[50%] translate-x-[50%]">
                  <IconButton
                    size={"small"}
                    icon={<RightOutlined />}
                    disabled={
                      targetKeys?.length == checkedKeys?.length ? true : false
                    }
                    onClick={() => onChange(checkedKeys, "right")}
                  />
                </div>
                <div className="w-[100%]">
                  <NormalInputField
                    type="text"
                    size={"small"}
                    placeholder={t("search")}
                    value={rightSearchInput}
                    suffix={<SearchOutlined />}
                    onChange={(e) => handleSearch(e.target.value, "right")}
                  />
                </div>
                <Tree
                  blockNode
                  checkable
                  defaultExpandAll
                  checkedKeys={targetCheckedKeys}
                  onExpand={(key) => setRightExpandKey(key)}
                  expandedKeys={rightExpandKey}
                  height={480}
                  titleRender={(data: any) => {
                    return (
                      <div className="w-full flex justify-between items-center cursor-default">
                        <Typography.Text>{data?.title}</Typography.Text>
                        {data?.type === "parent" ? (
                          ""
                        ) : (
                          <div className="w-[220px] z-10 flex">
                            <Input
                              type="text"
                              size={"small"}
                              addonAfter={"Unit"}
                              disabled={["228", "229"].includes(
                                data?.catalogue_charges_id
                              )}
                              value={data?.unit}
                              onChange={(e: any) =>
                                ValidateInteger(e) &&
                                handleUpdateServiceUnit(e.target.value, data)
                              }
                            />
                            <Input
                              type="number"
                              size={"small"}
                              addonBefore={"₹"}
                              value={
                                Number.isInteger(Number(data?.total_price))
                                  ? data?.total_price
                                  : Number(data?.total_price)?.toFixed(2)
                              }
                              className="ml-2"
                              onChange={(e: any) =>
                                ValidateInteger(e) &&
                                handleUpdateServicePrice(e.target.value, data)
                              }
                            />
                          </div>
                        )}
                      </div>
                    );
                  }}
                  treeData={rightTreeData}
                  onCheck={(keys) => handleRightCheck(keys)}
                  onSelect={(selectedKeys, info: any) => {
                    if (info.node.children) {
                      info.event.preventDefault();
                    }
                  }}
                />
              </div>
            );
          }
        }}
      </Transfer>
    </>
  );
};

export default CommonTreeTranfer;
