import React, { useEffect, useMemo, useState } from "react";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  FilePdfOutlined,
  MinusCircleOutlined,
} from "@ant-design/icons";
import moment from "moment";
import "./medicineChart.css";
import { Avatar, Empty, Tooltip, Typography } from "antd";
import LatestModal from "../Modal/LatestModal";
import { t } from 'i18next'
import { dateFormat, getFormatedDate } from "../../../utils/formatedDate";
import { useAppSelector } from "../../../hooks/redux-hooks";

interface Props {
  taskList: any[];
  medicineList: any[];
  selectedDate: any;
}

const CheckIcon = ({ data, setReason }) => { 

  if (data?.status == 2) {
    return (
      <div className="mb-[3px] flex items-baseline justify-end">
        <Avatar size={"small"} style={{ backgroundColor: "#FFB6B6", border: "1.2px solid #DA1E28", width:'22px', height:"22px"}}></Avatar>
      </div>
    );
  } else if (data?.status == 1) {
    return (
      <div>
        <CheckCircleOutlined className="text-[22px] text-green-500 bg-green-300 rounded-full" />
      </div>
    );
  } else if (data?.status == 0) {
    return (
      <div className="mb-[3px] flex items-baseline justify-end">
        <Avatar size={"small"} style={{ backgroundColor: "#bfbfbf", border: "1.2px solid #bfbfbf", width:'22px', height:"22px" }}></Avatar>
      </div>
    );
  } else if (data?.status == 4) {
    return (
      <div >
        <MinusCircleOutlined className="text-[24px] text-red-400 bg-red-300 rounded-full" />
      </div>
    );
  } else if (data?.status == 5) {
    return (
      <div >
        <CheckCircleOutlined className="text-[24px] text-red-400 bg-red-300 rounded-full" />
      </div>
    );
  }
};


const MissedNotes = ({ reason, setReason }) => {
  return (
    <Tooltip color={'#000'} overlayInnerStyle={{borderRadius:"10px"}} title="Reason">
    <div onClick={() => setReason({ status: true, reason: reason?.reason })} className="block text-left">
      <FilePdfOutlined className="text-blue-500 text-[20px] cursor-pointer" />
    </div>
    </Tooltip>
  )
}


const MedicineChart = ({ taskList, medicineList, selectedDate }: Props) => {
  const [medicineListByDate, setMedicineListByDate] = useState({});
  const [reason, setReason] = useState({ status: false, reason: "" })
  const [medicineListToShow , setMedicineListToShow] = useState([])
  const { nurseTaskList } = useAppSelector((s) => s.ipdReducer)

  const generateTimeList = useMemo(() => {
    const startTime = moment("00:00 AM", "hh:mm A");
    const endTime = moment("24:00 AM", "hh:mm P");
    const interval = 1; // in hours

    const times: any[] = ["0"];
    const currentTime = startTime.clone();

    while (currentTime <= endTime) {
      times.push(currentTime.format("hh:mm A"));
      currentTime.add(interval, "hours");
    }
    return times;
  }, []);


  const createMedicineChart = () => {
    const arrayDta = [];
    if(medicineList?.length !== 0){
    medicineList?.map((item) => {
      const startDate = new Date(item?.created_on);
      for (let i = 0; i <= item?.duration; i++) {
        const increaseDate = moment(startDate).add(i, "days").format('YYYY-MM-DD');
        const data = arrayDta?.[increaseDate]?.length === undefined ? [item] : [...arrayDta?.[increaseDate] ?? [], item]
     
        const sortData = data.sort((a, b) => {
          if (!a?.product_name || !b?.product_name) {
            return 0; // Handle null or undefined gracefully
          }
          return a.product_name.localeCompare(b.product_name); // Safer comparison
        });
        arrayDta[increaseDate] = sortData
       }
    })
    setMedicineListByDate(arrayDta)
  }
}

  useEffect(() => {
    createMedicineChart()
  }, [medicineList]);


  // useEffect(() =>{
  //   setMedicineListToShow(medicineListByDate[selectedDate])
  // },[selectedDate , medicineListByDate])

  useEffect(() => {
    const validMedicineIds = medicineList?.map(m => m.product_id);
    setMedicineListToShow(
      nurseTaskList
        .filter((item) => validMedicineIds?.includes(item?.product_id))
        .filter((item, index, self) =>
          index === self.findIndex(t => t.product_id === item?.product_id)
        )
    );
  }, [nurseTaskList, medicineList]);


  return (
    <div className="px-4 py-3 w-full bg-white rounded-md border-2">
      {medicineListToShow?.length !== 0 ?
        <div className="">
          <div className="overflow-x-auto w-full medicineChartTable">
            <table className="w-full">
              <thead className="w-full">
                <tr className="h-[25px] w-full">
                  {generateTimeList?.map((item: any ,index : number) => {
                    return (<>
                    {index === 0 ? 
                    <th className="w-[300px] min-w-[250px] sticky left-0 z-[20] bg-white"></th>
                    :
                      <th
                        className="w-[90px] min-w-[90px] text-[--lightText] text-center"
                        colSpan={2}
                        key={item}
                      >
                        {item}
                      </th>}
                      </>);
                  })}
                </tr>
              </thead>
              <tbody className="[&>tr:nth-child(even)>td]:!bg-white [&>tr:nth-child(odd)>td]:!bg-gray-100">
                {medicineListToShow?.map((item: any, index: number) => {
                  // const tasks = taskList?.filter((itm) =>{
                  //   if(item?.product_id){
                  //     return item?.product_id === itm?.product_id;
                  //   }
                  // })
                  // const task = taskList?.find((itm) => {
                  //   if (itm?.product_id && item?.product_id) {
                  //     return itm?.product_id === item?.product_id
                  //   }
                  // })
                //  if(task){
                  return (
                    <tr
                      className={`${index % 2 !== 0 ? "bg-white" : "bg-gray-100"}`}
                      key={index}
                      style={{height : "96px"}}
                    >
                      {generateTimeList.map((itm, index) => {
                        const startDate = moment(itm, "hh:mm A");
                        const endDate = moment(generateTimeList[index + 1], "hh:mm A").subtract(1, 'minute');
                          const checkIndex : any = [];
                          const nurseTaskFilteredList = nurseTaskList?.filter((itm: any) => itm?.product_id === item?.product_id )

                          nurseTaskFilteredList.forEach((itt) =>{
                            const targetDate = moment(itt?.scheduled_time, "hh:mm:ss");
                            if (targetDate.isBetween(startDate, endDate) || targetDate.isSame(startDate) || targetDate.isSame(endDate)) {
                              checkIndex.push(itt)
                            }
                          })
                          const timeSection = taskList?.filter((ele:any) => ele?.product_id === item?.product_id);

                        return (
                          <>{index === 0 ? 
                            <td className="w-[300px] min-w-[250px] sticky left-0 z-[20] bg-white">
                            <div className="mx-3 my-4">
                              <h4 className="my-2 text-[--blackWhite] text-nowrap">
                                {item?.product_name } 
                              </h4>
                              {/* {!item?.product_name && (
                                  <h4 className="my-2 text-[--blackWhite] text-nowrap">
                                    {(() => {
                                      const relatedDescriptions = nurseTaskList
                                        ?.filter((itm: any) => !itm?.product_id)
                                        ?.map((itm: any) => itm?.description)
                                        ?.filter(Boolean);
                                      return [...new Set(relatedDescriptions)]?.join(", ");
                                    })()}
                                  </h4>
                                )} */}
                             <div className="flex">
                              <ClockCircleOutlined style={{marginRight : "4px",fontSize:"18px"}}/>
                                  {timeSection?.map((time: any, id: number) => {
                                      return (
                                         <h4 className="text-nowrap">{getFormatedDate(new Date("1975-01-01T" + time?.scheduled_time), dateFormat["hh mm"])}
                                        {id !== (timeSection?.length - 1) && " , "} </h4>
                                    )
                                  })}
                              </div> 
                            </div>
                          </td>
                          : <>
                              <td className="border-l-2 border-r-0 border-y-0 border-solid border-gray-300 h-[95px] w-[45px] text-right relative">
                                {checkIndex?.map((ittd: any) => {
                                  return (<div className="relative">
                                    <CheckIcon data={ittd} setReason={setReason} />
                                    {(ittd?.status == 2 || ittd?.status == 4 || ittd?.status == 5) && <div className="absolute left-[48px] top-[50%] transform translate-y-[-50%]"><MissedNotes reason={ittd} setReason={setReason} />
                                    </div>}
                                  </div>)
                                }
                                )}
                              </td>
                              <td className="border-l-2 border-r-0 border-y-0 border-dashed border-gray-300 h-[95px] w-[45px]">
                                {checkIndex?.map((itt: any) => {
                                  return (<>{
                                  }</>)
                                })}
                              </td>
                              </>}
                          </>
                        );
                      })}
                      <td
                        className="border-l-2 border-r-1 border-y-0  border-gray-300 h-[112px] w-[0px]"
                        style={{
                          borderRightStyle: "solid",
                        }}
                      ></td>
                    </tr>
                  );
                // }
                })}
              </tbody>
            </table>
          </div>
        </div>
        : 
        <Empty/>
      }
     
      <LatestModal
        title={t("reason")}
        showModal={[reason.status, setReason]}
        children={
          <>
            {reason?.reason ? (
              <li>
               <Typography.Text className='text-sm font-[400] !text-left block' style={{ color:'var(--fontColor)' }}>
                {reason?.reason}
               </Typography.Text>
              </li>
            ) : (
              <Typography.Text className='text-sm font-[400] !text-left block' style={{ color:'var(--fontColor)' }}>
                {t('noReason')}
              </Typography.Text>
            )}
          </>
        }
        okButtonProps={{ display: 'none' }}
        closable
        footer={false}
      />
    </div>
  );
};

export default MedicineChart;
