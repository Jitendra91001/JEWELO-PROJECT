import { Pagination, PaginationProps, Select } from "antd";
import { useTheme } from "../../../contexts/Theme/Theme.context";
import "./pagination.css";
import React,{ useEffect, useState } from "react";
import type { SelectProps } from 'antd/lib/select'

type CompoundedComponent = React.FC<SelectProps> & {
  Option: typeof Select.Option
}

const SelectWithoutSearch: CompoundedComponent = (props) => <Select {...props} size="middle" className="min-w-[120px]" suffixIcon={<></>} />
SelectWithoutSearch.Option = Select.Option


type PaginationProp = {
  defaultCurrentValue?: number;
  totalItems: number;
  rowCount?: number;
  refreshPagination? : boolean ;
  setParams?: any;
  setinitalPage?:any;
  disabled? : boolean;
  scrollPos? :any;
  setScrollPos? :any;
};

const CustomPagination: any = ({ rowCount, setParams , refreshPagination,setinitalPage , disabled ,scrollPos,setScrollPos}: PaginationProp) => {

  const { Color } = useTheme();
  const [limit, setLimit] = useState<number>(10);
  const [offset, setOffset] = useState<number>(0);
  const [isInitial, setIsInitial] = useState(true);
  const [current,setcurrent]=useState(1);
  const [resetOffset, setResetOffset] = useState<boolean>(false);
  const onShowSizeChange: PaginationProps["onShowSizeChange"] = (_, limit) => {
    setLimit(limit);
    setOffset(0);
    setcurrent(1);
    setParams((pre: any) => ({ ...pre, limit: limit, offset: 0 }));
  };
   
  const onChange: PaginationProps["onChange"] = (pgNumber, pageSize) => {
    if (pageSize !== limit) return;
    setIsInitial(false);
    setinitalPage(false);
    setcurrent(pgNumber);  
    const createdOffset =  limit > 10 ? pgNumber > 1 ? (Number(pgNumber) - 1) * Number(limit) : 0 : Number(pgNumber) * 10 - 10  
    setOffset(createdOffset);
    setScrollPos(scrollPos + 1)
    setParams((pre: any) => ({ ...pre, limit: limit, offset: createdOffset }));
  };





























  useEffect(()=>{
    setParams((pre)=>{
      if(pre.offset==0){
        setcurrent(1);
        setOffset(0)
      }
      setLimit(pre.limit);
      return pre;
    });
  })


  return (
    <div className="pagination">
      <Pagination
        pageSize={limit}
        current={current}
        total={rowCount}
        style={{
          color: Color["--primary"],
          backgroundColor: "transparent",
          borderRadius: "2px",
        }}
        onShowSizeChange={onShowSizeChange}
        selectComponentClass={SelectWithoutSearch}
        onChange={onChange}
        disabled={disabled}
      />
    </div>
  );
};

export default CustomPagination;
