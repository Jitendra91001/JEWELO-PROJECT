import React,{ memo, useCallback, useEffect, useRef } from "react"
import { useTheme } from "../../../contexts/Theme/Theme.context"

interface AbsoluteCardProps {
    items: any[]
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    active: { lable: string };
    setActive: React.Dispatch<React.SetStateAction<{ lable: string }>>;
}

const AbsoluteCard: React.FC<AbsoluteCardProps> = ({ items,setOpen,active,setActive }) => {
    
    const { Color } = useTheme()
    const filterMenuRef = useRef<HTMLDivElement | null>(null);
    const handleActive = useCallback((lable: string) => {
        setActive({ "lable": lable })
        setOpen(false)
    }, [setActive,setOpen])

    useEffect(() => {
        const handleClickOutside = (evt: MouseEvent) => {
            if (filterMenuRef.current && !filterMenuRef.current.contains(evt.target as Node)) {
                setOpen(false);
            }
        }
        window.addEventListener("mouseup", handleClickOutside)
        return ()=> window.removeEventListener("mouseup", handleClickOutside)
    }, [])

    return (
        <>
            <div ref={filterMenuRef} className={`absolute  right-14 z-10 divide-y text-[--opdSwitchTab] divide-gray-100 rounded-lg shadow min-w-32 m-0`}>
                <ul className={`py-2 text-sm list-none list-outside px-2 bg-[--GrayWhite] m-0`}>
                    {
                        items?.map(item => {
                            return (
                                <li key={item.lable}>
                                    <a style={{color : item.lable === active.lable ? Color['--primary'] : "gray" }} className={`block p-2 hover:bg-gray-100 ${item.lable === active.lable ? 'font-semibold' : ''}`} onClick={() => handleActive(item.lable)}>{item.lable}</a>
                                </li>
                            )
                        })
                    }
                </ul>
            </div>
        </>
    )
}

export default memo(AbsoluteCard);