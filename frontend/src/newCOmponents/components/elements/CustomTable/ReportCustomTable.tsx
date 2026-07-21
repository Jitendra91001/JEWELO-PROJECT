import { Col, Row, Spin, Table } from "antd";
import React, { useEffect, useRef, useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useTheme } from "../../../contexts/Theme/Theme.context";
import { PrintIcon } from "../Icons/icon";
import { PatientReportDataType } from "../../../predefinedTypes/coloumDataType";
import { t } from "i18next";
import "./table.css"
import CustomPagination from "../Pagination/CustomPagination";


const TableSkeleton = () => {

  return (
    <div className="pb-4 w-full  rounded-md" style={{ boxShadow: "var(--boxShadow2)" }}>
      <table className="w-full">
        <thead>
          <tr>
            {[1, 2, 3, 4, 5].map((item, index) => {
              return (
                <th
                  className=" w-[20%] py-5 border-b-0 border-solid border-x-0 border-t-0  border-[var(--bgHeader)]"
                  style={{
                    fontSize: "14px",
                    fontWeight: "600",
                    boxShadow: "var(--boxShadow)",
                  }}
                  key={index}
                >
                  <Skeleton count={1} width={"80%"} height={"10px"} />{" "}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody className="w-full">
          {[1, 2, 3, 4, 5, 6, 7].map(() => {
            return (
              <tr>
                {[1, 2, 3, 4, 5].map((item, index) => {
                  return (
                    <td className="px-5 py-4 w-[20%] " key={index}>
                      <Skeleton count={1} width={"80%"} height={"25px"} className="text-center ml-[50%] translate-x-[-50%]" />
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

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
  sortMethod?: string;
  tableProps?: any;
  handleClick?: any;
  rowCount?: any;
  scrollValueforSmall?: any;
}
interface appointmentProps {
  appointmentStatus:
  | "Completed"
  | "In progress"
  | "Booked"
  | "Free"
  | "Cancelled/Close"
  | "Missed"
  | "Arrived"
  | "Referred"
  | "Waiting"
  | "Not paid"
  | "Ready for review"
  | "Done"
  | "Rescheduled"
  | "Unattended";
  patientStatus:
  | "New"
  | "Followup"
  | "Revisit"
  | "Complete"
  | "Closed"
  | "In progress"
  | "Refer in"
  | "Payment pending"
  | "Deceased";
}
interface Coltype {
  key?: string;
  render: any;
}

interface appointmentProps {
  appointmentStatus: "Completed" | "In progress" | "Booked" | "Free" | "Cancelled/Close" | "Missed" | "Arrived" | "Referred" | "Waiting" | "Not paid" | "Ready for review" | "Done" | "Rescheduled" | "Unattended";
  patientStatus: 'New' | "Followup" | "Revisit" | "Complete" | "Closed" | "In progress" | "Refer in" | "Payment pending" | "Deceased";
}

const ReportCustomTable = ({
  getColumns,
  getData,
  paginate = false,
  scrollValue = { y: 539 },
  isLoading,
  setSortMethod,
  sortMethod,
  module,
  setParams,
  tableName,
  tableProps,
  handleClick,
  rowCount,
  scrollValueforSmall,
}: CustomTableProp) => {


  const [initialpage, setinitalPage] = useState<boolean>(false)
  const tableRef = useRef(null);
  const [tableHeight, setTableHeight] = useState(0);
  const { Color, themeType } = useTheme();
  const [scrollPos, setScrollPos] = useState(0);

  const data = getData;

  getColumns.map((col: Coltype) => {

    if (col.key === "action") {
      col.render = (_: any, record: PatientReportDataType) => {
        return (
          <>
            {
              <p
                className="cursor-pointer"
                onClick={() => handleClick(record)}
                style={{ color: Color['--primary'], fontWeight: 700, fontSize: "14px" }}
              >
                <PrintIcon title={t("print")} width={'25px'} height={"25px"} className={`${themeType === 'light' ? 'none' : 'invert'} align-middle`} /></p>
            }
          </>
        )
      }
    }
  });

  const columns = getColumns;

  const handleTableChange = (pagination: any, filters: any, sorter: any, extra: any) => {
    let field: any;
    let filterData: any;
    
    switch (tableName) {
    case 'appointment_table':
    case 'lab_patient':
    field = sorter.columnKey;
    break;
    case 'nurse_patient':
    field = sorter.columnKey === 'patient_name_nurse' ? 'patient_name' : sorter.columnKey;
    break;
    case 'patient_opd_table':
    field = sorter.columnKey === 'patient_name' ? 'patient_name' : sorter.columnKey;
    break;
    default:
    field = sorter.columnKey;
    }

    if (extra.action === 'sort') {
      if (sorter.hasOwnProperty('column')) {
        if (sortMethod === 'ascend') {
          filterData = `{ "${field}": -1 }`;
          setSortMethod('descend');
        } else {
          filterData = `{ "${field}": 1 }`;
          setSortMethod('ascend');
        }
      } else if (tableName === 'opd_appointment') {
        field = sorter.columnKey === 'patient_name' ? 'patient_name' : sorter.columnKey;
      }
    }
    
    setParams((prev) => ({
    ...prev,
    sort: filterData,
    }));
    };

  useEffect(() => {
    if (tableRef?.current) {
      setTableHeight(tableRef?.current?.offsetHeight);
    }
  }, [tableRef]);

  return (
    
     <div className="flex flex-col "  >
      <div className={`mb-[2px] rounded-md `} style={{height : rowCount > 10 ?"650px" : "100%" }}>
       <div className="p-3 rounded-md" >
        <div className={`customTable  ${data?.length > 10 || scrollValueforSmall  ? 'tOverflowY' : data?.length <= 0 ? 'tOverflowY2' : 'tOverflowY3'}`}>
        <Table
          {...tableProps}
          columns={columns}
          dataSource={data}
          ref={tableRef}
          size="large"
          pagination={paginate}
          loading={{
            spinning: !!isLoading,
            indicator: (
              <div
                style={{
                  position: 'absolute',
                  top: `${tableHeight / 2}px`,
                  left: '50%',
                  transform: 'translateX(-50%)',
                }}
              >
                <Spin size="default" />
              </div>
            ),
          }}
          scroll={scrollValue}
          onChange={handleTableChange}
        />
      </div>
      </div>
    </div>
      <Row>
      <Col className="flex justify-end items-end w-full ">
          {rowCount > 10 &&
            <Row className="pt-2" justify={"end"} align={"bottom"} >
            <Col className="flex h-full  items-end mb-[5px]">
                <CustomPagination setParams={setParams} rowCount={rowCount}
                  setinitalPage={setinitalPage}
                  refreshPagination={initialpage}
                  disabled={isLoading}
                  scrollPos={scrollPos}
                  setScrollPos={setScrollPos}
                />
              </Col>
            </Row>
          }
        </Col>
      </Row>

    </div>
  );
};

export default ReportCustomTable;
