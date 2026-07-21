import React, { useEffect, useState } from 'react';
import { Tree } from 'antd';
import type { TreeProps } from 'antd';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';

interface DynamicTreeProps {
    showLine?: boolean;
    treeData: TreeProps['treeData'];
    switcherIcon?: React.ReactElement
    onCheckHandler: TreeProps['onCheck'];
    onSelectHandler: TreeProps['onSelect'];
    checkedKeys: TreeProps['checkedKeys'];
    selectedKeys: TreeProps['selectedKeys'];
    defaultExpandKeys : any []
}

const DynamicTree: React.FC<DynamicTreeProps> = ({ treeData, switcherIcon, checkedKeys, selectedKeys, defaultExpandKeys, onCheckHandler, onSelectHandler, showLine = false }) => {

    
    const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
    const [autoExpandParent, setAutoExpandParent] = useState<boolean>(false);

    const onExpand: TreeProps['onExpand'] = (expandedKeysValue) => {
        setExpandedKeys([...defaultExpandKeys , ...expandedKeysValue]);
        setAutoExpandParent(false);
    };

    const defaultSwitcherIcon = ({ expanded }: { expanded: boolean }) => {
        return expanded ? <MinusOutlined /> : <PlusOutlined />;
    };

    useEffect(() =>{
        if(defaultExpandKeys?.length > 0){
        setExpandedKeys([...defaultExpandKeys , ...expandedKeys])
        }
    },[defaultExpandKeys])

    return (
        <Tree
            checkable
            showLine={showLine ?? false}
            onExpand={onExpand}
            expandedKeys={expandedKeys}
            autoExpandParent={autoExpandParent}
            treeData={treeData}
            switcherIcon={switcherIcon ?? defaultSwitcherIcon}
            onCheck={onCheckHandler}
            onSelect={onSelectHandler}
            checkedKeys={checkedKeys}
            selectedKeys={selectedKeys}
        />
    );
};

export default DynamicTree;