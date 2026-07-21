import {  Card, Checkbox, Dropdown, Input } from 'antd';
import { FilterOutlined, SearchOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import IconButton from '../Button/IconButton';
import CommonText from '../HeadingTitle/CommonText';
import ButtonFeild from '../Button/CustomButton';
import './FilterDropdown.css';

interface Department {
  id: string;
  name: string;
}

interface FilterDropdownProps {
  departments: Department[];
  onSelect: (selectedDepartments: string[], availability: string[]) => void;
  setParams:any;
}

const initialParams=({
  in:{"department":[],"availability":[]}
})

const FilterDropdown: React.FC<FilterDropdownProps> = ({ departments, onSelect,setParams }) => {
  const initialState = {
    selectedKeys: departments?.map(department => department?.id), 
    availabilityKeys: ['1', '0'], 
    searchText: '', 
    selectAll: true, 
  };
  const { t } = useTranslation();
  const [searchText, setSearchText] = useState<string>('');
  const [filteredDepartments, setFilteredDepartments] = useState<Department[]>(departments);
  const [selectedKeys, setSelectedKeys] = useState<string[]>(initialState?.selectedKeys);
  const [availabilityKeys, setAvailabilityKeys] = useState<string[]>(initialState?.availabilityKeys);
  const [visible,setVisible]=useState<boolean>(false)
  const [selectAll, setSelectAll] = useState<boolean>(initialState?.selectAll); 
  
  useEffect(() => {
    if (searchText) {
      const filtered = departments?.filter(dept =>
        dept?.name?.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredDepartments(filtered);
    } else {
      setFilteredDepartments(departments);
    }
  }, [searchText, departments]);

  useEffect(()=>{
    setSelectedKeys(departments?.map(department => department?.id));
  },[departments])

  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  const handleDepartmentChange = (checkedValues: string[]) => {
    if (checkedValues.includes("all")) {
      setSelectAll(true);
      setSelectedKeys(departments.map(department => department.id)); 
    } else {
      setSelectAll(false);
      setSelectedKeys(checkedValues); 
    }
  };
  
  const handleAvailabilityChange = (checkedValues: string[]) => {
      setAvailabilityKeys(checkedValues); 
  };
  
  const handleOk = () => {
    onSelect(selectedKeys, availabilityKeys);
    setVisible(false);
  };

  const handleClear = () => {
    setSelectedKeys(initialState?.selectedKeys);
    setAvailabilityKeys(initialState?.availabilityKeys);
    setSelectAll(initialState?.selectAll)
    setSearchText('');
    setVisible(false);
    setParams(initialParams)
  };


  const handleSelectAllChange = (e) => {
    const checked = e?.target?.checked;
    setSelectAll(checked);
    if (checked) {
        setSelectedKeys(departments?.map(department => department?.id));
    } else {
        setSelectedKeys([]);
    }
};
  const menu = (
    <Card style={{ width: '400px' ,}} className='admin-custom-filter-dropdown'>
      <Input
        placeholder={t('searchDepartment')}
        value={searchText}
        onChange={e => handleSearch(e.target.value)}
        style={{ marginBottom: 8 }}
        suffix={<SearchOutlined />}
      />
      <div style={{ maxHeight: '200px', overflowY: 'auto', marginBottom: '10px' }}>
        <Checkbox.Group
          onChange={handleAvailabilityChange}
          value={availabilityKeys}
          style={{ width: '100%' }}
          className='grid grid-cols-1 gap-1 overflow-y-auto '
        >
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
            <Checkbox id="available-checkbox" value="1" />
            <label htmlFor="available-checkbox" style={{ marginLeft: '8px', display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                  <CommonText color='black' type='font1' title={t('Available')} />
            </label>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2px' }}>
            <Checkbox id='unavailable-checkbox' value="0" />
            <label htmlFor="unavailable-checkbox" style={{ marginLeft: '8px', display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
               <CommonText color='black' type='font1' title={t("unavailable")} />
           </label>
          </div>    
          </Checkbox.Group>     
          <hr style={{ margin: '0 0 2px 0', border: 'none', borderTop: '1px solid #e8e8e8' }} />
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
            <Checkbox 
              value="all" 
              checked={selectAll}
              onChange={handleSelectAllChange}
              id='all-checkbox'
            />
           <label htmlFor="all-checkbox" style={{ marginLeft: '8px', display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                 <CommonText color='black' type='font2' title={t('allDepartment')} />
           </label>
          </div>
          <Checkbox.Group
            onChange={handleDepartmentChange} 
            value={selectedKeys}
            style={{ width: '100%' }}
            className='grid grid-cols-1 gap-1 overflow-y-auto '
          >
             {filteredDepartments?.map(department => (
               <div key={department.id} style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                  <Checkbox id={`department-${department.id}`} value={department.id} />
                  <label htmlFor={`department-${department.id}`} style={{ marginLeft: '8px', display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                    <CommonText color='black' type='font2' title={department?.name} />
                  </label>
            </div>
        ))} 
        </Checkbox.Group>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <ButtonFeild onClick={handleClear} style={{ marginRight: '8px' }} value={t("cancel")} type={"default"}/>     
        <ButtonFeild type="primary" onClick={handleOk} value={t('Ok')} />
      </div>
    </Card>
  );

  return (
    <Dropdown overlay={menu} trigger={['click']} placement="bottomRight"  onVisibleChange={setVisible}  visible={visible} arrow>
      <IconButton icon={<FilterOutlined />} type={"text"} />
    </Dropdown>
  );
};

export default FilterDropdown;
