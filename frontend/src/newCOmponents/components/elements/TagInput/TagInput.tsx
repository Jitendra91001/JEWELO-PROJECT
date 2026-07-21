import React from 'react'
import { CloseOutlined } from '@ant-design/icons'
import { Input, Tag } from 'antd'


interface InputTagsDatatype {
    color?: string,
    onChange?: (e: any) => void,
    value?: string,
    rest?: any,
    icon?: React.ReactNode,
    checked?: boolean,
    className?: any,
    classNameTag?: any,
    classNameInput?: any,
    sx?: any,
    classNameCloseIcon?: any,
    size?: "large" | "middle" | "small";
    placeholder?: any,
    texts?: any,
    setTexts?: any,
    adding?: any,
    setAdding?: any,
    inputVal?: any,
    setInputVal?: any,
    handleSearch?: (e: any) => void,
}

const TagInput: React.FC<InputTagsDatatype> = ({ className,size, classNameInput, classNameTag, classNameCloseIcon, onChange, texts, setTexts, adding, setAdding, inputVal, setInputVal, handleSearch, ...props }) => {


    const addText = (newText: any) => {
        setTexts(newText);
    };
    const onPressEnter = () => {
        if (!inputVal) return;
        setAdding((prevTexts:any) => [...prevTexts, texts])
        setInputVal('')
    }

    const removeText = (index: number) => {
        setTexts(texts.filter((item:any, ind:any) => ind !== index))
    };


    return (
        <div className={className}>
            <div className='grid grid-cols-2 items-center'>
                <div >
                    <Input {...props} className={classNameInput} value={inputVal}
                        onChange={(e) => {
                            addText(e.target.value)
                            setInputVal(e.target.value)
                          
                        }}
                        size={size? size: 'middle'}
                        onPressEnter={onPressEnter} />
                </div>
                <div className='ml-1 max-h-32 overflow-y-scroll '>
                    {adding?.map((text:any, index:any) => {
                        return <Tag {...props} bordered className={classNameTag} closeIcon={<CloseOutlined className={classNameCloseIcon} onClick={() => removeText(index)} />} {...props}>{text}</Tag>
                    }
                    )}
                </div>
            </div>
        </div>
    )

}

export default TagInput