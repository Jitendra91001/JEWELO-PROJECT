import React, { useRef, useEffect, useState } from 'react';
import { useTheme } from '../../../contexts/Theme/Theme.context';
import { Spin } from 'antd';

interface LoaderProps {
    children ? : any;
    loading: boolean|undefined;
    tip?: string;
    top?: any;
    left?: any;
    size?: "small" | "default" | "large"
}

const Loader: React.FC<LoaderProps> = ({children, loading ,size, tip,top,left}:LoaderProps) => {
    const { Color } = useTheme();
    const childrenRef = useRef<HTMLDivElement>(null);
    const [childrenHeight, setChildrenHeight] = useState(0);

    useEffect(() => {
        if (childrenRef.current) {
            setChildrenHeight(childrenRef.current.offsetHeight);
        }
    }, [children]);

    return (
        <Spin 
            spinning={loading} 
            size={size?size:"default"}
            style={{
                position: 'absolute',
                color: Color["--primary"], 
                top: top?top:`25%`,
                left: left?left:'50%',
                transform: `translate(-50%, -${childrenHeight / 2}px)`,
              }}
              tip={tip}
        >
            {children}
        </Spin>
    );
};

export default Loader;