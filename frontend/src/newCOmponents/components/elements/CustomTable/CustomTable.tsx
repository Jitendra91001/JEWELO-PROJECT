import { Col, Flex, Row, Table, Spin, Tag, Tooltip, Typography } from "antd";
import React, { useRef, useEffect, useState } from "react";
import "react-loading-skeleton/dist/skeleton.css";
import { AbhaRequestIcon, CancelBold, Completed, Pick, View } from "../Icons/icon";
import { useTheme } from "../../../contexts/Theme/Theme.context";
import { Status, pathConstants } from "../../../constant";
import { generatePath, useNavigate } from "react-router-dom";
import Customcheckbox from "../checkbox/Customcheckbox";
import moment from "moment";
import { toastWarning } from "../Notification/Toastify";
import DTMainTitle from "./DTMainTitle";
import "./table.css";
import CommonHeading from "../HeadingTitle/CommonHeading";
import CustomPagination from "../Pagination/CustomPagination";
import { t } from "i18next";
import StatusTag from "../StatusTag/StatusTag";
import { StatusDy } from "../../../helpers/dimentions";
import { StringDotted } from "../StringDotted/StringDotted";
import { useAppSelector } from "../../../hooks/redux-hooks";
import { AddendumIcon } from "../Icons/icons";


interface CustomTableProp {
  getColumns?: any;
  getData?: any;
  paginate?: any;
  scrollValue?: any; //like {y:240}
  isLoading?: boolean;
  module?: string;
  setParams?: any;
  tableName?: string;
  setSortMethod?: any;
  size?: string;
  sortMethod?: string;
  components?: any;
  summary?: any;
  onRow?: any;
  rowClassName?: any;
  handleClick?: (e: HTMLFormElement, type: string) => void;
  pickStatus?: boolean;
  rowSelection?: any;
  loading?: boolean;
  bordered?: boolean;
  showHeader?: boolean;
  title?: any;
  Tnode?: any;
  rowCount?: any;
  setSearchParam?: any;
  searchKeys?: any;
  CustomTableHead?: any;
  expandable?: any;
  rowHoverable?: boolean;
  customTableHeight?: number
  tableClassName?: any;
  tableID?: any;
  scrollValueforSmall?: any;
  locale?: any;
  sectionPadding?: any;
}

interface Coltype {
  key?: string;
  render: any;
}

interface AppointmentProps {
  appointmentStatus:
  | "Completed"
  | "In progress"
  | "Booked"
  | "Cancelled"
  | "Rescheduled"
  patientStatus:
  | "New"
  | "Follow-up"
  | "Revisit"
  | "Complete"
  | "In progress"
}


const CustomTable = ({
  getColumns,
  getData,
  rowCount,
  paginate = false,
  scrollValue = { y: 580 },
  isLoading,
  setSortMethod,
  sortMethod,
  module,
  size,
  setParams,
  tableName,
  components,
  summary,
  onRow,
  rowClassName,
  handleClick,
  pickStatus,
  rowSelection,
  loading = false,
  bordered = false,
  showHeader = true,
  rowHoverable = false,
  title,
  Tnode,
  CustomTableHead,
  expandable,
  tableClassName = "",
  tableID,
  customTableHeight = 0,
  locale,
  scrollValueforSmall = false,
  sectionPadding = false,
}: CustomTableProp) => {
  const { Color } = useTheme();
  const data = getData;
  const navigate = useNavigate();
  const nothing = () => { };
  const [initialpage, setinitalPage] = useState<boolean>(false)
  const tableRef = useRef(null);
  const [tableHeight, setTableHeight] = useState(0);
  const [scrollPos, setScrollPos] = useState(0);
  const rolekey = useAppSelector((s) => s.authReducer.user)?.users?.role_key;
  
  const generateOPDEmrPath = (data : any) => {
    const path = generatePath(pathConstants.opdEmr, {
      uuid: data?.uuid,
    });
    navigate(path);
  };
  
  const validatePick = (data) => {
    if (pickStatus || data.appointment_status == "10") {
      generateOPDEmrPath(data);
    } else if (data.appointment_status == "4") {
      return;
    } else {
      toastWarning("Another appointment is already In-progress");
    }
  };

  getColumns?.map((col: Coltype) => {
    if (col?.key === "status") {
      col.render = () => {
        return (
          <>
            {Array.isArray(data) && data?.map((status: string) => {
              let color = "";
              if (status == "loser") {
                color = "volcano";
              } else {
                color = "blue";
              }
              return (
                <Tag color={color} key={status}>
                  {status}
                </Tag>
              );
            })}
          </>
        );
      };
    }
    if (col.key === "patient_name") {
      col.render = (_: any, record: any) => {
        const disabledClick: boolean =
          module == "hms-appointment" ||
            (module == "ipd_ward_change_request" &&
              record?.appointment_date !==
              moment(new Date()).format("YYYY-MM-DD")) ||
            record?.appointment_status === "4" ||
            record?.appointment_status === "2" ||
            record?.appointment_status === "10"
            ? true
            : false;

        const disableDoctorClick = record?.appointment_status == "2" || record?.appointment_status == "4" || record?.appointment_status == "3";
        const disableDoctorClick2 = record?.appointment_date == moment(new Date()).format("YYYY-MM-DD");

        return (
          <>
            {tableName === "patient_opd_table" ? (
              
            <Tooltip
            title={
              <div className="toolDetails">
                <Typography.Text
                  copyable
                  className="text-[#fff] block font-bold"
                >
                  {record?.appointment_patient_name ?? record?.patient_name}
                </Typography.Text>
                
              </div>
            }
            color={"#000"}
            overlayInnerStyle={{ borderRadius: "10px" }}
          >
            <div className="cursor-auto">
              <DTMainTitle           
                bold
                sx={
                  {
                    color : disableDoctorClick ||  !disableDoctorClick2 ||  record.appointment_status == "4"  ? "gray"  : Color["--primary"],
                    fontWeight: 600,
                    margin: "0",
                    cursor: disableDoctorClick || record.appointment_status == "4" ? "not-allowed" : "pointer"
                  }
                }
                onClick={() => { !disableDoctorClick &&   disableDoctorClick2 &&   validatePick(record); }}
                TitleValue={
                  <StringDotted
                  sx={
                    {
                      color : disableDoctorClick ||   !disableDoctorClick2 ||   record.appointment_status == "4"   ? "gray"   : Color["--primary"],
                      fontWeight: 600,
                      margin: "0",
                      cursor: disableDoctorClick || record.appointment_status == "4" ? "not-allowed" : "pointer"
                    }
                  }
                  bold 
                  showToolTip={false} str={record?.appointment_patient_name ?? record?.patient_name}sliceLength={20} />
                }
              />
              
            </div>
          </Tooltip>
            ) : (
              <Typography.Text
                className={ disabledClick ? "cursor-not-allowed block"   : "cursor-pointer block"  }
                onClick={() => { disabledClick === true   ? nothing()   : generateOPDEmrPath(record);
                }}
                style={{
                  color: Color["--primary"],
                  fontWeight: 600,
                }}
              >
                {record?.appointment_patient_name ?? record?.patient_name}
              </Typography.Text>
            )}
          </>
        );
      };
    }
    if (col.key === "appointment_status" && tableName !== "sheduled_ot_patient_table") {
      col.render = (appointment_status: any) => {
        const name : AppointmentProps["appointmentStatus"] = Status["appointment_status"][appointment_status];
        return (
          <div className="flex justify-center items-center">
            <StatusTag style={{ width: '100%' }} children={name} color={name == "In progress" ? StatusDy.InProgress : name == 'Completed' ? StatusDy.Completed : name == "Booked" ? StatusDy.Booked : name == "Rescheduled" ? StatusDy.Rescheduled : name == "Cancelled" ? StatusDy.Cancelled : name == "Missed" ? StatusDy.Missed : ""} closeIcon={false} />
          </div>
        );
      };
    }
    if (col.key === "patient_status") {
      col.render = (patient_status: any) => {
        const name: AppointmentProps["patientStatus"] = Status["patient_status"][patient_status];
        return <div className="flex justify-center  items-center">
          <StatusTag style={{ width: '100%' }} children={name} color={name == "Follow-up" ? StatusDy.FollowUp : name == 'New' ? StatusDy.New : name == "Revisit" ? StatusDy.Revisit : name == "Complete" ? StatusDy.Completed : name == "In progress" ? StatusDy.InProgress : ""} closeIcon={false} />
        </div>
      };
    }
    if (col.key == "nurseAction") {
      col.render = (action: any, records) => {
        if (module === "ipd_ward_patients") {
          return (
            <>
              <div style={{ textAlign: "center" }} key={records?.id}>
                <span className="cursor-pointer">
                  <Customcheckbox size="30px" />
                </span>
              </div>
            </>
          );
        }
      };
    }
  });

  const columns = getColumns;

  const handleTableChange = (
    pagination: any,
    filters: any,
    sorter: any,
    extra: any
  ) => {
    let field: any;
    let filterData: any;


    switch (tableName) {
      case "appointment_table":
      case "lab_patient":
        field = sorter.columnKey;
        break;
      case "nurse_patient":
        field = sorter.columnKey === "patient_name_nurse" ? "patient_name" : sorter.columnKey === "appointment_status_nurse" ? "appointment_status" : sorter.columnKey;
        break;
      case "patient_opd_table":
        field = sorter.columnKey === "patient_name" ? "patient_name" : sorter.columnKey;
        break;
      case "ward_request_change":
        field = sorter.columnKey === "ward_patient_name" ? "patient_name" : sorter.columnKey;
        break;
      case "ipddoctor_patient_table":
        field = sorter.columnKey === "ipd_patient_doctor_name" ? "patient_name" : sorter.columnKey;
        break;
      case "ipdnurse_patient_table":
        field = sorter.columnKey === "ipd_patient_name" ? "patient_name" : sorter.columnKey;
        break;
      case "medicine_return_request":
        field = sorter.columnKey === "patient_details" ? "patient_name" : sorter.columnKey;
        break;
      case "pathlogist_table":
        field = sorter.columnKey === "patientData" ? "patient_name" : sorter.columnKey;
        break;
      default:
        field = sorter.columnKey;
    }

    if (extra.action === "sort") {
      if (sorter.hasOwnProperty("column")) {
        if (tableName === "pharma-admin") {
          if (sortMethod === "ascend") {
            filterData = sorter?.columnKey === "no_of_racks" ? "child_count asc" : "name";
            setSortMethod("descend");
          } else {
            filterData = sorter?.columnKey === "no_of_racks" ? "child_count desc" : "name desc";
            setSortMethod("ascend");
          }
        } else {
          filterData = sortMethod === "ascend" ? `{ "${sorter.field}": -1 }` : `{ "${sorter.field}": 1 }`;
          setSortMethod(sortMethod === "ascend" ? "descend" : "ascend");
        }
      } else if (tableName === "opd_appointment") {
        field = sorter.columnKey === "patient_name" ? "patient_name" : sorter.columnKey;
      }
    }

    if (tableName === "pharma-admin") {
        setParams((prev: any) => ({
          ...prev,
          order: filterData,
        }));
    } else {
      const allKey = Object.keys(filters);
      const filterDatas: any = {};
      allKey.forEach((itm) => {
        if (filters[itm] !== null) {
          filterDatas[itm] = filters[itm];
        }
      });

      setParams((prev: any) => ({
        ...prev,
        sort: extra.action === 'sort' ? (sorter.field != undefined ? { [sorter.field]: (prev.sort?.[sorter?.field] === "-1" ? "1" : "-1") } : { [Object.keys(prev.sort)?.[0]]: (Object.values(prev.sort)?.[0] === "-1" ? "1" : "-1") }) : prev.sort,
        in: filterDatas,
        offset: 0,
      }));
    }
  };


  const TableHeadNode = ({ title, Tnode }) => {
    return (
      <Row justify={"space-between"} align={"top"}>
        <Col>
          <CommonHeading title={title ? title : ""} type="MainHeadingLight"  />
        </Col>
        <Col>{Tnode ? Tnode : <></>}</Col>
      </Row>
    );
  };

  useEffect(() => {
    if (tableRef?.current) {
      if (customTableHeight) {
        setTableHeight(customTableHeight)
      } else {
        setTableHeight(tableRef?.current?.offsetHeight);
      }
      tableRef.current?.scrollTo({ top: true })
    }
  }, [tableRef, scrollPos]);


  return (
    <div className="flex flex-col customTable-outer">
      <div className={`mb-[2px] rounded-md`} style={{ height: rowCount > 10 ? "650px" : "100%" }}>
        <div className={`${sectionPadding ? sectionPadding :'p-3'}  bg-[--white] rounded-md`} >
          <div className={`${bordered?'borderCustomTableWrapper borderEnableTable':'customTable borderDisable'}  ${data?.length > 10 || scrollValueforSmall  ? 'tOverflowY' : data?.length <= 0 ? 'tOverflowY2' : 'tOverflowY3'}`}>
            {title || Tnode ? (
              <div style={{ paddingBottom: title || Tnode ? "10px" : "0px" }}>
                <TableHeadNode Tnode={Tnode} title={title} />
              </div>
            ) : CustomTableHead ? (

              CustomTableHead
            ) : (
              <></>
            )}
            <Table
              className={tableClassName}
              id={tableID || ""}
              getPopupContainer={() => {
                const element = tableID ? document.getElementById(tableID) : null;
                return element || document.body;
              }}
              onRow={onRow}
              rowClassName={rowClassName}
              showSorterTooltip={false}
              ref={tableRef}
              columns={columns}
              dataSource={data}
              pagination={paginate}
              scroll={scrollValue}
              onChange={handleTableChange}
              components={components}
              summary={summary}
              rowSelection={rowSelection}
              loading={{
                spinning: !!loading || !!isLoading,
                indicator: (
                  <Spin size="default" style={{
                    position: 'absolute',
                    top: `${tableHeight / 2}px`,
                    left: '50%',
                    transform: 'translateX(-50%)',
                  }} />
                ),
              }}
              bordered={bordered}
              showHeader={showHeader}
              expandable={expandable}
              rowHoverable={rowHoverable}
              locale={locale?locale:{ filterCheckall: "Select All" }}
            />
          </div>
        </div>
      </div>
      {/* <Row> */}
      <Col className="flex justify-end items-end w-full ">
      
        {rowCount > 10 && (
          <Row className="pt-2" justify={"end"} align={"bottom"} >
            <Col className="flex h-full  items-end mb-[5px]">
              <CustomPagination
                setParams={setParams}
                rowCount={rowCount}
                setinitalPage={setinitalPage}
                refreshPagination={initialpage}
                scrollPos={scrollPos}
                setScrollPos={setScrollPos}
                disabled={loading || isLoading}
              />
            </Col>
          </Row>
        )}
      </Col>
      {/* </Row> */}

    </div>

  );
};

export default CustomTable;