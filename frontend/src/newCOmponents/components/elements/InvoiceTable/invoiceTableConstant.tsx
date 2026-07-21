import DTMainTitle from "../CustomTable/DTMainTitle";
import { t } from "i18next";
import { formatNumber } from "../../../helpers/ValidateNumber";
import React from "react";
import { dateMonthfullYear } from "../../../utils/formatedDate";

const pharmacyInvoiceTable = [
    {
        title: t("srNo"),
        dataIndex: 's_no',
        key: 's_no', 
        align:'center',
        width:100
    },
    {
        title: t('items'),
        dataIndex: 'items',
        key: 'items', 
        align:'start',
        width:150
    },{
        title: t('expiry_date'),
        dataIndex: 'expiry_date',
        key: 'expiry_date', 
        align:'start',
        width:220,

    },
    {
        title: t('hsn_code'),
        dataIndex: 'hsn_code',
        key: 'hsn_code', 
        align:'start',
        width:130
    },
    {
        title: <>{t('mrp')}(&#8377;)</>,
        dataIndex: 'mrp',
        key: 'mrp', 
        align:'right',
        width:120,
        render:(data)=>{
            return <DTMainTitle bold={false} TitleValue={isNaN(Number(data)) ? data : formatNumber(data)}/>
        },
    },{
        title: t('qty').toUpperCase(),
        dataIndex: 'qty',
        key: 'qty', 
        align:'center',
        width:100
    },
    {
        title: t('discountp'),
        dataIndex: 'discount',
        key: 'discount', 
        align:'center',
        width:160,
        render:(data)=>{
            return <DTMainTitle bold={false} TitleValue={  data ? data: 0}/>
        },
    },
    {
        title: t('cgstp'),
        dataIndex: 'cgst',
        key: 'cgst', 
        align:'center',
        width:130,
        render:(data)=>{
            return <DTMainTitle bold={false} TitleValue={  data ? data?.props?.children : 0}/>
        },
    },
    {
        title: t('sgstp'),
        dataIndex: 'sgst',
        key: 'sgst', 
        align:'center',
        width:130,
        render:(data)=>{
            return <DTMainTitle bold={false} TitleValue={  data ? data?.props?.children : 0}/>
        },
    },
    {
        title: t('igstp'),
        dataIndex: 'igst',
        key: 'igst', 
        align:'center',
        width:130,
        render:(data)=>{
            return <DTMainTitle bold={false} TitleValue={  data ? data?.props?.children : 0}/>
        },
    },







    {
        title: <>{t('amt')}(&#8377;)</>,
        dataIndex: 'amount',
        key: 'amount', 
        align:'end',
        width:150,
        render:(data)=>{
            return <DTMainTitle sx={{textAlign:"end",paddingRight:"14px"}} bold={false} TitleValue={isNaN(Number(data)) ? data : formatNumber(data)}/>
        },
    }
  ];

  const pharmacyRetailTable = [
    {
        title: t("srNo"),
        dataIndex: 's_no',
        key: 's_no', 
        align:'center',
        width:100,
        render:(data,record,index)=>{
            return <DTMainTitle bold={false} TitleValue={index+1}/>
        }
    },
    {
        title: t('items'),
        dataIndex: 'product_name',
        key: 'product_name', 
        align:'start',
        width:190
    },
     {
         title: t('batchNo'),
        dataIndex: 'batch_num',
        key: 'batch_num', 
        width:190,
        align:"start"
    },
    {
        title: t('expDate'),
        dataIndex: 'expiry_date',
        key: 'expiry_date', 
        align:'start',
        width:120,
        render:(data)=>{
            return <DTMainTitle bold={false} TitleValue={dateMonthfullYear(data)}/>
        },
    },
    {
        title: <>{t('mrp')}(&#8377;)</>,
        dataIndex: 'mrp',
        key: 'mrp', 
        align:'right',
        width:100,
        render:(data)=>{
            return <DTMainTitle bold={false} TitleValue={isNaN(Number(data)) ? data : formatNumber(data)}/>
        },
    },{
        title: t('qty').toUpperCase(),
        dataIndex: 'qty',
        key: 'qty', 
        align:'center',
        width:100
    },
    {
        title: t('discountp'),
        dataIndex: 'discount',
        key: 'discount', 
        align:'center',
        width:160,
        render:(data)=>{
            return <DTMainTitle bold={false} TitleValue={  data ? parseInt(data): 0}/>
        },
    },
    {
        title: t('cgstp'),
        dataIndex: 'cgst',
        key: 'cgst', 
        align:'center',
        width:145,
        render:(data)=>{
            return <DTMainTitle bold={false} TitleValue={  data ? parseInt(data) : 0}/>
        },
    },
    {
        title: t('sgstp'),
        dataIndex: 'sgst',
        key: 'sgst', 
        align:'center',
        width:145,
        render:(data)=>{
            return <DTMainTitle bold={false} TitleValue={  data ? parseInt(data) : 0}/>
        },
    },
    {
        title: t('igstp'),
        dataIndex: 'igst',
        key: 'igst', 
        align:'center',
        width:145,
        render:(data)=>{
            return <DTMainTitle bold={false} TitleValue={  data ? parseInt(data) : 0}/>
        },
    },
    {
        title: <>{t('amt')}(&#8377;)</>,
        dataIndex: 'amount',
        key: 'amount', 
        align:'end',
        width:135,
        render:(_,record)=>{
            const unitPrice = Number(record?.unit_price) || 0;
            const qty = Number(record?.qty) || 0;
            const amount = unitPrice * qty;
            return <DTMainTitle sx={{textAlign:"end",paddingRight:"14px"}} bold={false}  TitleValue={formatNumber(amount)}/>
        },
    }
  ];

  const billingColumns = [
    {
        title: t("srNo"),
        dataIndex: 'sr_no',
        key: 'sr_no', 
        align:'center'
    },
    {
        title:"Particulars",
        dataIndex:"particulars",
        key:"particulars", 
        align:'start'
    },
    {
        title:<>{t('amount')}(&#8377;)</>,
        dataIndex: 'amount',
        key: 'amount', 
        align:'end',
        render:(data)=>{
            return <DTMainTitle sx={{textAlign:"end",paddingRight:"14px"}}  bold={false} TitleValue={isNaN(Number(data)) ? data : formatNumber(data)}/>
        },
    }
  ]

const medicineReturnTable = [
    {
        title: t("srNo"),
        dataIndex: 'sr_no',
        key: 'sr_no', 
        align:"center",
        width:90
    },
    {
        title: t('items'),
        dataIndex: 'items',
        key: 'items', 
        width:140, 
        align:"start"
    },{
        title: t('expiry_date'),
        dataIndex: 'expiry_date',
        key: 'expiry_date', 
        width:290,
        align:"start"
    }







    ,{
        title: t('hsn_code'),
        dataIndex: 'hsn_code',
        key: 'hsn_code', 
        width:120,
        align:"start"
    },{
        title: <>{t('mrp')}(&#8377;)</>,
        dataIndex: 'mrp',
        key: 'mrp', 
        width:90,
        align:"right",
        render:(data)=>{
            return <DTMainTitle bold={false} TitleValue={isNaN(Number(data)) ? data : formatNumber(data)}/>
        },
    },{
        title: t('qty'),
        dataIndex: 'qty',
        key: 'qty', 
        width:70,
        align:"center"
    },{
        title: t('discountp'),
        dataIndex: 'discount',
        key: 'discount', 
        align:'center',
        width:130,
        render: (data) =>(<DTMainTitle bold={false} TitleValue={data ? Number(data) : 0}/>)
    },{
        title: t('cgstp'),
        dataIndex: 'cgst',
        key: 'cgst', 
        align:'center',
        width:110,
        render:(data)=>{
             return <DTMainTitle bold={false} TitleValue={  data ? data : 0}/>
        },
    },
    {
        title: t('sgstp'),
        dataIndex: 'sgst',
        key: 'sgst', 
        align:'center',
        width:110,
        render:(data)=>{
             return <DTMainTitle bold={false} TitleValue={  data ? data : 0}/>
        },
    },
    {
        title: t('igstp'),
        dataIndex: 'igst',
        key: 'igst', 
        align:'center',
        width:100,
        render:(data)=>{
             return <DTMainTitle bold={false} TitleValue={  data ? data : 0}/>
        },
    },
    {
        title: `${t('amt')} (₹)`,
        dataIndex: 'amount',
        key: 'amount', 
        width:120,
        align:"right",
        render:(data)=>{
            return <DTMainTitle  sx={{textAlign:"end",paddingRight:"14px"}} bold={false} TitleValue={isNaN(Number(data)) ? data : formatNumber(data)}/>
        },
    }
]

const ipdAdmissionColumns = [
    {
        title: t("srNo"),
        key:"sr_no",
        dataIndex:"sr_no",
        align:"center"
    },{
        title: t('service') ,
        key:"service",
        dataIndex:"service",
        align:"start"
    },
    {
        title: t('percentageDiscount'),
        dataIndex: 'discount',
        key: 'discount', 
        align:'center',
        width:110,
        render:(data)=>{
            return <DTMainTitle bold={false} TitleValue={  data ? data : 0}/>
        }, 
    },
    ,{
        title: t('cgstp'),
        dataIndex: 'cgst',
        key: 'cgst', 
        align:'center',
        width:110,
        render:(data)=>{
            return <DTMainTitle bold={false} TitleValue={  data ? data : 0}/>
        },
    },
    {
        title: t('sgstp'),
        dataIndex: 'sgst',
        key: 'sgst', 
        align:'center',
        width:110,
        render:(data)=>{
            return <DTMainTitle bold={false} TitleValue={  data ? data: 0}/>
        },
    },
    {
        title: t('igstp'),
        dataIndex: 'igst',
        key: 'igst', 
        align:'center',
        width:110,
        render:(data)=>{
            return <DTMainTitle bold={false} TitleValue={  data ? data: 0}/>
        },
    },
    {
        title: t('netAmount') ,
        key:"net_amount",
        dataIndex:"net_amount",
        align:"end",
        render:(data)=>{
            return <DTMainTitle sx={{textAlign:"end",paddingRight:"14px"}} bold={false} TitleValue={isNaN(Number(data)) ? data : formatNumber(data)}/>
        }
    }
]
const ipdLabColumn=[ 
    { 
        title: t("srNo"),
        key:"sr_no",
        dataIndex:"sr_no", 
        align:'center',
         width:90,
    },{
        title: t('testDescription') ,
        key:"test_description",
        dataIndex:"test_description", 
        align:'start',
         width:160,
    },
    {
        title: t('testCode') ,
        key:"index",
        width:120,
        dataIndex:"code", 
        align:'start'
    },
    {
        title: <>{t('amount')} (&#8377;)</>,
        key:"amount",
        dataIndex:"amount", 
        align:'right',
        width:120,
        render:(_,record)=>{
            return(
                <DTMainTitle sx={{textAlign:"end",paddingRight:"10px"}}  TitleValue={(isNaN(Number(record?.amount)) ? record?.amount : formatNumber(record?.amount))}/>
            )
        }
    },
    {
        title: t('percentageDiscount'),
        dataIndex: 'discount',
        key: 'discount', 
        align:'center',
        width:130,
        render:(data)=>{
            return <DTMainTitle bold={false} TitleValue={  data ? data : 0}/>
        }, 
    },
    {
        title: t('cgstp'),
        dataIndex: 'cgst',
        key: 'cgst', 
        align:'center',
        width:110,
        render:(data)=>{
            return <DTMainTitle bold={false} TitleValue={  data ? data : 0}/>
        },
    },
    {
        title: t('sgstp'),
        dataIndex: 'sgst',
        key: 'sgst', 
        align:'center',
        width:110,
        render:(data)=>{
            return <DTMainTitle bold={false} TitleValue={  data ? data : 0}/>
        },
    },
    {
        title: t('igstp'),
        dataIndex: 'igst',
        key: 'igst', 
        align:'center',
        width:110,
        render:(data)=>{
            return <DTMainTitle bold={false} TitleValue={  data ? data: 0}/>
        },
    },{
        title: t('netAmtrupee'),
        key:"amount",
        dataIndex:"amount", 
        align:'right',
        width:120,
        render:(_,record)=>{
            return(
                <DTMainTitle sx={{textAlign:"end",paddingRight:"10px"}}  TitleValue={(isNaN(Number(record?.net_amount)) ? record?.net_amount : formatNumber(record?.net_amount))}/>
            )
        }
    }
];
const ipdLabPayment=[
    { 
        title: t("srNo"),
        key:"sr_no",
        dataIndex:"sr_no", 
        width:90,
        align:'center'
    },{
        title: t('testDescription') ,
        key:"test_description",
        width:160,
        dataIndex:"test_description", 
        align:'start'
    },

    {
        title: t('testCode') ,
        key:"index",
        width:100,
        dataIndex:"code", 
        align:'start'
    },
    {
        title: t('amountrupee'),
        key:"amount",
        dataIndex:"amount", 
        align:'right',
        width:120,
        render:(_,record)=>{
            return(
              <DTMainTitle sx={{textAlign:"end",paddingRight:"10px"}} TitleValue={(isNaN(Number(record?.amount)) ? record?.amount : formatNumber(record?.amount))}/>
            )
        }
    },  
    {
        title: t('percentageDiscount'),
        dataIndex: 'discount',
        key: 'discount', 
        align:'center',
        width:130,
        render:(data)=>{
            return <DTMainTitle bold={false} TitleValue={  data ? data : 0}/>
        }, 
    }
    ,{
        title: t('cgstp'),
        dataIndex: 'cgst',
        key: 'cgst', 
        align:'center',
        width:110,
        render:(data)=>{
            return <DTMainTitle bold={false} TitleValue={  data ? data : 0}/>
        },
    },
    {
        title: t('sgstp'),
        dataIndex: 'sgst',
        key: 'sgst', 
        align:'center',
        width:110,
        render:(data)=>{
            return <DTMainTitle bold={false} TitleValue={  data ? data : 0}/>
        },
    },
    {
        title: t('igstp'),
        dataIndex: 'igst',
        key: 'igst', 
        align:'center',
        width:110,
        render:(data)=>{
            return <DTMainTitle bold={false} TitleValue={  data ? data: 0}/>
        },
    },
    {
        title: t('netAmtrupee'),
        key:"amount",
        dataIndex:"amount", 
        align:'end',
        width:140,
        render:(_,record)=>{
            return(
              <DTMainTitle sx={{textAlign:"end",paddingRight:"14px"}} TitleValue={(isNaN(Number(record?.net_amount)) ? record?.net_amount : formatNumber(record?.net_amount))}/>
            )
        }
    }
]

const RegColumns = [
    {
        title: t("srNo"),
        key:"sr_no",
        dataIndex:"sr_no",
        align:"center",
        width:70,
        render:(_,rcord,index)=>{
            return index+1
        }
    },
    {
        title: t('Particulars') ,
        key:"item_name",
        dataIndex:"item_name",
        align:"start",
        width:250,



    },
    {
        title: t('percentageDiscount'),
        dataIndex: 'discount_percent',
        key: 'discount_percent', 
        align:'center',
        width:110,
        render:(data)=>{
            return data ? Number(data) : 0
        }



    },
    ,{
        title: t('cgstp'),
        dataIndex: 'cgst',
        key: 'cgst', 
        align:'center',
        width:110,



    },
    {
        title: t('sgstp'),
        dataIndex: 'sgst',
        key: 'sgst', 
        align:'center',
        width:110,



    },
    {
        title: t('igstp'),
        dataIndex: 'igst',
        key: 'igst', 
        align:'center',
        width:110,



    },
    {
        title: t('netAmtrupee') ,
        key:"net_amount",
        dataIndex:"net_amount",
        align:"end",
        width:110,
        render:(data,record)=>{
            return <DTMainTitle sx={{textAlign:"end",paddingRight:"14px"}} bold={false} TitleValue={isNaN(Number(record?.net_amount || record?.total_amount)) ? (record?.net_amount || record?.total_amount) : formatNumber(record?.net_amount || record?.total_amount)}/>
        }
    }
]

const packageassignColumns = [
    {
        title: t("srNo"),
        key:"sr_no",
        dataIndex:"sr_no",
        align:"center",
        width : 100,
        render:(data,record,index)=>{
            return <DTMainTitle bold={false} TitleValue={index+1}/>
        }
    },{
        title: t('Particulars') ,
        key:"item_name",
        dataIndex:"item_name",
        align:"start",
        width : 330,
        render:(data)=>{
            return <DTMainTitle bold={false} TitleValue={  data ? data : 0}/>
        }, 
    },
    {
        title: t('percentageDiscount'),
        dataIndex: 'discount',
        key: 'discount', 
        align:'center',
        width:110,
        render:(data)=>{
            return <DTMainTitle bold={false} TitleValue={  data ? data : 0}/>
        }, 
    },
    ,{
        title: t('cgstp'),
        dataIndex: 'cgst',
        key: 'cgst', 
        align:'center',
        width:110,
        render:(data)=>{
            return <DTMainTitle bold={false} TitleValue={  data ? data : 0}/>
        },
    },
    {
        title: t('sgstp'),
        dataIndex: 'sgst',
        key: 'sgst', 
        align:'center',
        width:110,
        render:(data)=>{
            return <DTMainTitle bold={false} TitleValue={  data ? data: 0}/>
        },
    },
    {
        title: t('igstp'),
        dataIndex: 'igst',
        key: 'igst', 
        align:'center',
        width:110,
        render:(data)=>{
            return <DTMainTitle bold={false} TitleValue={  data ? data: 0}/>
        },
    },
    {
        title: t('netAmtrupee') ,
        key:"net_amount",
        dataIndex:"net_amount",
        width : 200,
        align:"end",
        render:(data,record)=>{
            return <DTMainTitle sx={{textAlign:"end",paddingRight:"14px"}} bold={false} TitleValue={isNaN(Number(record?.net_amount || record?.total_amount)) ? (record?.net_amount || record?.total_amount) : formatNumber(record?.net_amount || record?.total_amount)}/>
        }
    }
]

const emergencyBilling = [
    { 
        title: t('srNo'),
        key:"sr_no",
        dataIndex:"sr_no", 
        width:90,
        align:'center',
        render:(_,rcord,index)=>{
            return index+1
        }
    },
    {
        key: 'services',
        title: `${t("description")}`,
        dataIndex: 'services',
        align: "left",
        width: '450px',
        render: (_, record) => {
            return   <div><DTMainTitle TitleValue={record?.item_name}/></div>
        }
    },
    {
        key: 'amount',
        title: `${t('amount')} (₹)`,
        dataIndex: 'amount',
        align: "end",
        width: '100px',
        render: (_, record) => {
            return   <div className="pr-2"><DTMainTitle TitleValue={formatNumber(record?.selling_price ?? 0)}/></div>
        }
    },
    {
        key: 'discount',
        title: `${t('discount')} (₹)`,
        dataIndex: 'discount',
        align: "end",
        width: 160,
        render: (_, record) => {
            return    <div className="pr-2"><DTMainTitle TitleValue={formatNumber(record?.discount ?? 0)}/></div>
        }
    },
    {
        title: t('netAmtrupee'),
        key:"amount",
        dataIndex:"amount", 
        align:'end',
        width:140,
        render:(_,record)=>{
            return  <div className="pr-4"><DTMainTitle TitleValue={formatNumber(record?.net_amount ?? 0 )}/></div>
        }
    }
];

const opdRefund = [
    { 
        title: t('srNo'),
        key:"sr_no",
        dataIndex:"sr_no", 
        width:90,
        align:'center',
        render:(_,rcord,index)=>{
            return index+1
        }
    },
    {
        key: 'services',
        title: `${t("description")}`,
        dataIndex: 'services',
        align: "left",
        width: '450px',
        render: (_, record) => {
            return   <div><DTMainTitle TitleValue={record?.item_name}/></div>
        }
    },
    {
        key: 'amount',
        title: `${t('amount')} (₹)`,
        dataIndex: 'amount',
        align: "end",
        width: '100px',
        render: (_, record) => {
            return   <div className="pr-4"><DTMainTitle TitleValue={formatNumber(record?.refund_amount ?? 0)}/></div>
        }
    },
];

const emgRefund = [
    { 
        title: t('srNo'),
        key:"sr_no",
        dataIndex:"sr_no", 
        width:90,
        align:'center',
        render:(_,rcord,index)=>{
            return index+1
        }
    },
    {
        key: 'services',
        title: `${t("description")}`,
        dataIndex: 'services',
        align: "left",
        width: '450px',
        render: (_, record) => {
            return   <div><DTMainTitle TitleValue={record?.item_name}/></div>
        }
    },
    {
        key: 'amount',
        title: `${t('amount')} (₹)`,
        dataIndex: 'amount',
        align: "end",
        width: '100px',
        render: (_, record) => {
            return   <div className="pr-4"><DTMainTitle TitleValue={formatNumber(record?.refund_amount ?? 0)}/></div>
        }
    },
];







// Receipt template for IVF pharmacy bill payments — one row per medicine
// with name (under Particulars), quantity, unit price, GST, and line total.
const ivfPharmacyReceiptColumns = [
    {
        title: t("srNo"),
        dataIndex: "sr_no",
        key: "sr_no",
        width: 50,
        align: "center" as const,
    },
    {
        title: "Particulars",
        dataIndex: "particulars",
        key: "particulars",
        align: "start" as const,
        render: (data: unknown) => (
            <DTMainTitle sx={{ textAlign: "start" }} bold={false} TitleValue={String(data ?? "")} />
        ),
    },
    {
        title: t("qty"),
        dataIndex: "qty",
        key: "qty",
        width: 60,
        align: "center" as const,
    },
    {
        title: <>{t("rate")}(&#8377;)</>,
        dataIndex: "rate",
        key: "rate",
        width: 100,
        align: "right" as const,
        render: (data: unknown) => {
            const n = Number(data);
            const label = isNaN(n) ? String(data ?? "") : n.toFixed(2);
            return (
                <DTMainTitle sx={{ textAlign: "end", paddingRight: "10px" }} bold={false} TitleValue={label} />
            );
        },
    },
    {
        title: "GST",
        dataIndex: "gst_rate",
        key: "gst_rate",
        width: 60,
        align: "right" as const,
        render: (_: unknown, record: Record<string, unknown>) => {
            const taxRate = Number(record?.gst_rate ?? 0);
            return (
                <DTMainTitle sx={{ textAlign: "end", paddingRight: "10px" }} bold={false} TitleValue={`${taxRate}%`} />
            );
        },
    },
    {
        title: <>{t("amount")}(&#8377;)</>,
        dataIndex: "amount",
        key: "amount",
        width: 110,
        align: "right" as const,
        render: (data: unknown) => {
            const n = Number(data);
            const label = isNaN(n) ? String(data ?? "") : n.toFixed(2);
            return (
                <DTMainTitle sx={{ textAlign: "end", paddingRight: "10px" }} bold={false} TitleValue={label} />
            );
        },
    },
];

export const invoiceTableColumns = {

    "opd-prescription": pharmacyInvoiceTable,
    "ipd-prescription":pharmacyInvoiceTable,
    "emergency-prescription":pharmacyInvoiceTable,
    "ipd-lab": ipdLabColumn,
    "ipdLabview":ipdLabColumn,
    "ipd-lab-payment":ipdLabPayment,
    "lab-test": [
        {
            title: t("srNo"),
            key:"sr_no",
            width:90,
            dataIndex:"sr_no",
            align:"center"
        },{
            title: t('testDescription') ,
            width:180,
            key:"test_description",
            dataIndex:"test_description",
            align : "start"
        },
        {
            title: t('testCode') ,
            key:"index",
            width:110,
            dataIndex:"code", 
            align:'start'
        },
        {
            title: <>{t('amount')} (&#8377;)</>,
            key:"amount",
            dataIndex:"amount", 
            align:"right",
            width:120,
            render:(_,record)=>{
                return(
                    <DTMainTitle sx={{textAlign:"end",paddingRight:"10px"}}  TitleValue={(isNaN(Number(record?.amount)) ? record?.amount :formatNumber(record?.amount))} />
                )
            }
        },
        {
            title: t('percentageDiscount'),
            dataIndex: 'discount',
            key: 'discount', 
            align:'center',
            width:130,
            render:(data)=>{
                return <DTMainTitle bold={false} TitleValue={  data ? data : 0}/>
            }, 
        },{
            title: t('cgstp'),
            dataIndex: 'cgst',
            key: 'cgst', 
            align:'center',
            width:110,
            render:(data)=>{
                return <DTMainTitle bold={false} TitleValue={  data ? data : 0}/>
            },
        },
        {
            title: t('sgstp'),
            dataIndex: 'sgst',
            key: 'sgst', 
            align:'center',
            width:110,
            render:(data)=>{
                return <DTMainTitle bold={false} TitleValue={  data ? data : 0}/>
            },
        },
        {
            title: t('igstp'),
            dataIndex: 'igst',
            key: 'igst', 
            align:'center',
            width:110,
            render:(data)=>{
                return <DTMainTitle bold={false} TitleValue={  data ?  data : 0}/>
            },
        },
        {
            title: t('netAmtrupee'),
            key:"net_amount",
            dataIndex:"net_amount",
            width:140,
            align:"end",
            render:(_,record)=>{
                return(
                    <DTMainTitle sx={{textAlign:"end",paddingRight:"14px"}}  TitleValue={(isNaN(Number(record?.netamount)) ? record?.netamount : formatNumber(record?.netamount))}/>
                )
            }
        },
    ],
    
    "ipd-admission":ipdAdmissionColumns,
    "add-payment":billingColumns,
    "view-deposit":billingColumns,
    "generate-billing":billingColumns,
    "labfoInvoice":billingColumns,
    "ipd-lab-billing":billingColumns,
    "ivf-phase-payment":billingColumns,
    "ivf-addon-payment":billingColumns,
    "ivf-pharmacy-payment": ivfPharmacyReceiptColumns,
    "ipd-admission-billing":ipdAdmissionColumns,
    "medicine_return_req":medicineReturnTable,
    "pharmacy-billing":pharmacyInvoiceTable,
    "patient-registration":RegColumns,
    "opd-package-assign":packageassignColumns,
    "emergency-billing": emergencyBilling,
    "ipd-billing-refund-cancel":opdRefund,
    "emg-billing-refund-cancel":emgRefund,
    "pharmacy-retail":pharmacyRetailTable
}



