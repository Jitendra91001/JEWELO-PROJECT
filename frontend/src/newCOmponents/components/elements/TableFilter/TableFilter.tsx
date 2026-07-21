import { Button, Checkbox, Divider, Input } from 'antd';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StringDotted } from '../StringDotted/StringDotted';

const TableFilter = ({
  setSelectedKeys,
  selectedKeys,
  confirm,
  clearFilters,
  filterList,
  close,
}) => {

  const { t } = useTranslation();
  const [searchText, setSearchText] = useState('');
  const [List , setList] = useState<any>(filterList ?? [])
  const [handlingModalClose , setHandlingModalClose] = useState(false);

  const handleSearch = (e) => {
    const value = e.target.value
    setSearchText(value);
    let preparedData = filterList?.filter((item : any) =>{
      return typeof item?.text === "string";
    })
    preparedData = preparedData?.map((item) =>{
      if(item?.text?.toLowerCase()?.includes(value?.toLowerCase())){
        return {...item , show : true}
      }
      else {
        return {...item , show : false}
      }
    })
    setList(preparedData);
  };

  const handleClose = () =>{
    setSearchText("");
  }

  window.addEventListener('click', function(e){   
    if (document.getElementById('customFilter')?.contains(e.target)){

    } else{
      if(searchText !== ""){
        setSearchText("")
        setHandlingModalClose(true)
      }
    }
  });

  useEffect(() =>{
    if(searchText === ""){
      setList(filterList)
    }
  },[selectedKeys])


  useEffect(()=>{
    if(handlingModalClose){
      setTimeout(() => {
        setList(filterList);
        setHandlingModalClose(false)
      }, 200);
    }
  },[searchText])


  const handleOk = () =>{
    confirm() ; 
    close();
    handleClose()
    setTimeout(() => {
      setList(filterList);
      setHandlingModalClose(false)
    }, 200);
  }


  const handleReset = () =>{
    const filterData = filterList?.map((ele) => ele?.value)
    setSelectedKeys([...filterData]);
  }
  
  return (
    <div className="custom-filter-dropdown flex flex-col" id='customFilter'>
      {filterList?.length > 5 &&(<Input
        value={searchText}
        onChange={handleSearch}
        placeholder={t("searchinfilters")}
        className="w-[95%] m-auto mt-2 mb-1 rounded-md"
      />
      )}

      <Checkbox
        value="all"
        indeterminate={selectedKeys?.length > 0 && selectedKeys?.length !== filterList?.length}
        onChange={(e) => {
          if (e.target.checked) {
            setSelectedKeys(filterList.map((item) => item.value));
          } else {
            setSelectedKeys([]);
          }
        }}
        checked={selectedKeys?.length == filterList?.length}
        className='ml-1  p-1'
      >
        {t("all")}
      </Checkbox>
      <div className="max-h-[150px] overflow-y-auto">
        <Checkbox.Group
          onChange={(checkedValues) => setSelectedKeys(checkedValues)}
          value={selectedKeys}
          className='ml-7 grid grid-cols-1 gap-1 overflow-y-auto '
        >
          {List?.map((item) => (
            item?.show == false ?
              <Checkbox value={item.value} key={item.value} className='my-[1px]  hidden' >
                <StringDotted str={item.text} sliceLength={30} />
              </Checkbox> :
              <Checkbox value={item.value} key={item.value} className='my-[1px]' >
                <StringDotted str={item.text} sliceLength={30} />
              </Checkbox>
          ))}
        </Checkbox.Group>
      </div>
      <Divider className='my-0' />
      <div className="filter-dropdown-footer mt-2 px-2 flex justify-end gap-2 mb-2">
        <Button size='small' style={{ height: "28px" }} onClick={handleReset}>{t("reset")}</Button>
        <Button
          type="primary"
          style={{ height: "28px", boxShadow: "none", marginLeft: "5px" }}
          size='small'
          onClick={handleOk}
          disabled={!selectedKeys.length}
        >
          {t("ok")}
        </Button>
      </div>
    </div>
  );
};

export default TableFilter;