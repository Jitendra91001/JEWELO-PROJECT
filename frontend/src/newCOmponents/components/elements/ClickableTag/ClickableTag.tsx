import React from 'react';
import { Tag } from 'antd';
import CommonHeading from '../HeadingTitle/CommonHeading';
import { useTheme } from '../../../contexts/Theme/Theme.context';
import { CloseOutlined, PlusOutlined } from '@ant-design/icons';


  const ClickAbleTag: React.FC = ({label,showIconMark=false, icon,required, options}) => {
const {Color}=useTheme()

    const [selectedTags, setSelectedTags] = React.useState<string[]>([]);
    const handleChange = (tag: string, checked: boolean) => {
        const nextSelectedTags = checked
            ? [...selectedTags, tag]
            : selectedTags.filter((t) => t !== tag);
        setSelectedTags(nextSelectedTags);
    };

    return (

        <>
           {
        label && (<label>
          <div 
          className={`text-start flex items-center`}
          >
            <CommonHeading title={`${label}${showIconMark ? ` ${icon}` : ''}`} type="labelHeading" />
            <span
              style={{color:Color['--asterik'], paddingLeft: "2px", display: required ? "block" : "none" }}
            >
              * 
            </span>
          </div>
        </label>)
      }
            {options.map<React.ReactNode>((tag) => (
                <>
              
                <Tag.CheckableTag
                    key={tag}
                    checked={selectedTags.includes(tag)}
                    onChange={(checked) => handleChange(tag, checked)}
                >
                    <div className={selectedTags.includes(tag) ? 'p-2 rounded-md text-base' : "bg-[#F5F5F5] p-2 rounded-md text-base"}>
                    <span>{tag}</span>
                    <span className='p-4'>{selectedTags.includes(tag) ? <CloseOutlined /> : <PlusOutlined />}</span>

                        </div>
        
                </Tag.CheckableTag>
                </>
            ))}
        </>

    );
};

export default ClickAbleTag;