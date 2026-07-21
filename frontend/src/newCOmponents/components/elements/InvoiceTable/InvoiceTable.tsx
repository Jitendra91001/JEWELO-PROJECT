import React from 'react';
import { Table } from "antd"
import "./invoiceTable.css"
import { invoiceTableColumns } from './invoiceTableConstant';

interface InvoiceTableProps {
    module: string,
    rows?:any[]
    isIGst?:boolean
}


const InvoiceTable:React.FC<InvoiceTableProps> =({module,rows})=>{
    return (
            <div className="w-full invoice-table-lbr px-[5px]"> 
                <Table columns={invoiceTableColumns[module] || []} dataSource={rows || []} pagination={false}/>
            </div>
        )
}

export default InvoiceTable;
