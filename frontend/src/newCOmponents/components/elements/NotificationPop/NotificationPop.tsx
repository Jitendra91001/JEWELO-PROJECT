import React, { useEffect, useState } from "react";
import { Card, Col, Empty, List, Row, Typography } from "antd";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux-hooks";
import {
  viweAction,
  updateNotificationStatus,
  getNotificationsList
} from "../../../redux/notification/thunk";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { pathConstants } from "../../../constant";
import { useTheme } from "../../../contexts/Theme/Theme.context";


const processNotificationData = (rows: any[]) => {
  return rows.map(row => {
    const notificationData = JSON.parse(row.notification_json);
    return {
      ...row,
      notification_data: notificationData,
    };
  });
};


const NotificationPop: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const { Color } = useTheme();

  const loggedUser = useAppSelector((state) => state?.authReducer)?.user?.users;
  const { status}: any = useAppSelector(state => state?.notificationReducer);
  const {notificationAlertList} = useAppSelector((s:any) => s.notificationReducer);

  const [data, setData] = useState<any[]>([]);

  function sortData(dataArr: any) {
    const arr2: any = dataArr.sort((a, b) => {
      const dateA: any = new Date(a.created_on);
      const dateB: any = new Date(b.created_on);
      return dateB - dateA;
    })
    return arr2
  }

  useEffect(() => {
    if (notificationAlertList?.rows?.length > 0) {
      const dataArr: any = [...(notificationAlertList?.rows || [])];

      const processedData = processNotificationData(dataArr);
  
      const view = sortData(processedData);
      setData(view);
    }
  }, [notificationAlertList]);
  
  const getDate = (item: any) => {
    if (!item) return "";  
    const now = moment(); 
    const notificationDate = moment(item); 
    const isToday = now.isSame(notificationDate, 'day'); 
  
    let showTime = "";
  
    if (isToday) {
      showTime = notificationDate.format("h:mm A");
    } else {
      showTime = notificationDate
      .format("h:mm A | DD-MMM-YY")
      .replace(/-[a-z]{3}-/i, (match) => match.toUpperCase());
  }
  
    return showTime;
  }; 

  const handleView=(data:any)=>{
    const type = data?.type
    if(type=="notes" || type=="comments" ||type=="change_request" ||type=="beds_available" || type=="ipd_transfer" || type=="investigation_by_doctor" || type=="discharge_by_doctor" || type=="report_data_status" || type=="medicine_request" || type=="sample_approve_status" ||
    type=="bed_status" ||  type=="transfer_status" || type=="tpa_response" || type=="housekeeping_task" || type=="ipd_admission" || type=="department_transfer" || type=="prescription_by_doctor" || type=="refer_for_ipd" || type=="return_request" || type=="lab_prescription_request" ||
    type=="opd_lab_request" || type == "sample_collected_status" || type == "doctor_appointments" || type == "doctor_pick"
  )
    {
      const payload = {
        notificationIds : [data?.id]
      }
      dispatch(updateNotificationStatus(payload)).unwrap().then(resp => {
        if (resp.status == "success") {
          dispatch(getNotificationsList({sort: { created_on: -1 }}))
        }
      });
    }
  }

  const handleNavigate = (e, item: any) => {
    const data = {
      id: item?.id,
      type: item?.notification_data?.type,
    };
    switch (loggedUser?.role_key) {
      case "front-desk":
        if (item?.notification_data.type == "opd_lab_request") {
          handleView(data)
          navigate(pathConstants.opdLabPatient)}
        if (item?.notification_data?.type == "refer_for_ipd") {
          handleView(data)
          navigate(pathConstants.ipdFrontdeskDashboard)}
        break;

      case "doctor":
        if (item?.notification_data?.type == "doctor_appointments" && item?.notification_data?.type == "doctor_pick") {
            if(!item?.notification_data?.uuid){
            handleView(data)
            navigate(pathConstants.opdDoctorPatientList)
          }
            else{
            handleView(data)
            navigate(`/ipd-doctor-patient/${item?.notification_data?.uuid}/overview`)
          }
        }

        else if (item?.notification_data?.type == "notes" && item?.notification_data?.uuid) {
          handleView(data)
          navigate(`/ipd-doctor-patient/${item?.notification_data?.uuid}/notes`)
        }
        else if (item?.notification_data?.type == "notes" && !item?.notification_data?.uuid) {
          handleView(data)
          navigate(pathConstants.opdDoctorPatientList)
        }
        else if (item?.notification_data?.type == "ipd_transfer") {
          handleView(data)
          navigate(pathConstants.ipdDoctorPatientList)
        }
          else{
          handleView(data)
          navigate(pathConstants.opdDoctorPatientList)
        }
        break;

      case "ipd-nurse":
        if (item?.notification_data.type == "investigation_by_doctor") {  handleView(data); navigate(`/ipd-nurse-patient/${item?.notification_data?.uuid}/lab`)}
        if (item?.notification_data.type == "discharge_by_doctor") {handleView(data); navigate(pathConstants.ipdNursePatientList)}
        if (item?.notification_data.type == "prescription_by_doctor") {handleView(data); navigate(`/ipd-nurse-patient/${item?.notification_data?.uuid}/medication`)}
        if (item?.notification_data.type == "comments") {handleView(data); navigate(`/ipd-nurse-patient/${item?.notification_data?.uuid}/notes`)}
        break;

      case "ward-incharge":
        if (item?.notification_data.type == "ipd_admission") {handleView(data); navigate(pathConstants.ipdWardDashboard)}
        if (item?.notification_data.type == "change_request") {handleView(data); navigate(pathConstants.ipdWardChangeRequest)}
        if (item?.notification_data.type == "department_transfer") {handleView(data); navigate(pathConstants.ipdWardInchargeIcuToIpd)}

        
        if (item?.notification_data.type == "housekeeping_task") {handleView(data); navigate(pathConstants.ipdWardHouseKeepingBeds)}
        if (item?.notification_data.type == "beds_available") {handleView(data); navigate(pathConstants.ipdWardtotalBeds)}
        break;

      case "houskeeping-incharge":
        if (item?.notification_data.type == "housekeeping_task") {handleView(data); navigate(pathConstants.houseKeepingTask)}
        break;

      case "pharma_admin":
        if (item?.notification_data.type == "return_request") {handleView(data); navigate(pathConstants.medicineReturnRequest)}
        break;

      case "lab-technician":
        if (item?.notification_data.type == "report_data_status") {handleView(data); navigate(pathConstants.labTechnicianLabReport)}
        break;

      case "labfo":
        if (item?.notification_data.type == "lab_prescription_request") {handleView(data); navigate(pathConstants.labFrontofficeIpdlabRequest)}
        break;

      case "nurse":
          if (item?.notification_data.type !== "") {handleView(data); navigate(pathConstants.opdNursePatientList)}
          break;

      case "pathalogist":
        if (item?.notification_data.type == "sample_approve_status") {handleView(data); navigate(pathConstants.labPathologistallreport)}
        break;
      case "phlebotomist":
        if (item?.notification_data.type == "sample_collected_status") {handleView(data); navigate(pathConstants.phlebotomistOpdPatient)}
        break;

        case "icu-attendant":
          if (item?.notification_data.type == "change_request") {handleView(data); navigate(pathConstants.ICUAttendencePatientListing)}
          if (item?.notification_data.type == "department_transfer") {handleView(data); navigate(pathConstants.ICUAttendenceIPDtoICUtransfer)}
          break;

      case "billing-account":
      case "billing-admin":
        if (item?.notification_data.type == "discharge_by_doctor") { handleView(data); navigate(pathConstants.IpdBillingPatientList) }
        if (item?.notification_data.type == "tpa_response") {
          const viewData = {
            id: item?.notification_data?.uuid,
            type: item?.notification_data.type
          }
          dispatch(viweAction(viewData))
          const handleViewData = { id: item?.notification_data?.id, type: item?.notification_data.type }
          handleView(handleViewData)
          navigate(pathConstants.TpaPatientListing)
        }
        break;

      case "pharmacist":
        if (item?.notification_data.type == "medicine_request") {
          if (item?.notification_data?.ipd_admission_id) {
            handleView(data); navigate(pathConstants.ipdPrescription)
          } else {
            handleView(data); navigate(pathConstants.opdPrescription)
          }
        }

        if (item?.notification_data.type == "return_request") { navigate(pathConstants.pharmacyReturnRequest) }
        break;

        case "icu-nurse":
          if (item?.notification_data.type == "investigation_by_doctor") {  handleView(data); navigate(`/ipd-nurse-patient/${item?.notification_data?.uuid}/lab`)}
          if (item?.notification_data.type == "discharge_by_doctor") {handleView(data); navigate(pathConstants.ipdNursePatientList)}
          if (item?.notification_data.type == "prescription_by_doctor") {handleView(data); navigate(`/ipd-nurse-patient/${item?.notification_data?.uuid}/medication`)}
          if (item?.notification_data.type == "comments") {handleView(data); navigate(`/ipd-nurse-patient/${item?.notification_data?.uuid}/notes`)}
          break;

      default:
        break;
    }
  };

  return (
    <Card className="rounded-md overflow-hidden" bodyStyle={{ padding: "2px" }} style={{ width: "480px", height: 400, overflowY: 'auto' }}>
      {data?.length>0&&<List
        loading={status=='loading'}
        dataSource={status=='loading'?[]:data}
        renderItem={(item) => (
          <List.Item key={item?.id} className="even:bg-white odd:bg-gray-50" style={{ padding: "0px" }}>
            <List.Item.Meta
              className="p-[8px]"
              description={
                <>
                  <Row>
                    {/* Front Office */}
                    <Col>
                      {loggedUser?.role_key == "front-desk" && (
                        <>
                            <Typography.Text className="text-sm font-medium">
                          {item?.key_type == "refer_for_ipd" ?
                              <span >{item?.notification_data?.patient_name && `Patient Refer To IPD`}</span> :
                              <span >{item?.notification_data?.patient_name && `Book Patient Test`}</span>}
                                <br />
                                </Typography.Text>
                                <Typography.Text className="text-sm font-[400]">
                          Patient :  {item?.notification_data?.patient_name} ({item?.notification_data?.patient_code})
                          
                           
                          </Typography.Text>
                        </>
                      )}
                    </Col>

                    {/* Doctor */}
                    <Col>
                      {loggedUser?.role_key == "doctor" && (
                        <>
                          {item?.key_type == "notes" &&
                            <Typography.Text className="text-sm font-medium">
                              Nurse Note   <br />
                              <span className="text-sm font-[400]"> {`Patient: ${item?.notification_data?.patient_name} (${item?.notification_data?.patient_code })`} </span> <br/>
                              <span className="text-sm font-[400]">{item?.notification_data?.nurse_notes &&
                                item?.notification_data?.nurse_notes.slice(0, 35) + "..."}</span>
                            </Typography.Text>
                          }

                          {item?.key_type == "doctor_appointments" && !item?.notification_data?.updated_by_name && (
                            <Typography.Text className="text-sm font-medium">
                              New Patient Appoinment<br />
                              <span className="text-sm font-[400]">{item?.notification_data?.patient_code &&
                                `Patient: ${item?.notification_data?.patient_name} (${item?.notification_data?.patient_code})`}</span>
                            </Typography.Text>
                          )}

                          {item?.key_type == "doctor_pick" && item?.notification_data?.updated_by_name && (
                                  <Typography.Text className="text-sm font-medium">
                                    Appointment Picked By JR <br />
                                    <span className="text-sm font-[400]">
                                      {`Patient: ${item?.notification_data?.patient_name} (${item?.notification_data?.patient_code})`}
                                    </span>
                                    <br />
                                    <span className="text-sm font-[400]">
                                      {`Doctor Name: ${item?.notification_data?.updated_by_name}`}
                                    </span>
                                  </Typography.Text>
                         )}


                          {item?.key_type == "ipd_transfer" &&
                            <Typography.Text className="text-sm font-medium">
                              Transfer<br />
                              <span className="text-sm font-[400]">{item?.notification_data?.ipd_admission_no &&
                                `Patient: ${item?.notification_data?.patient_name} (Admission No: ${item?.notification_data?.ipd_admission_no})` }</span>
                            </Typography.Text>
                          }
                        </>
                      )}
                    </Col>

                    {/* IPD NURSE */}
                    <Col>
                      {loggedUser?.role_key == "ipd-nurse" && (
                        <>
                          {item.key_type == "investigation_by_doctor" &&
                            <Typography.Text className="text-sm font-medium">
                              Tests recommended by Doctor  <br />
                              <span className="text-sm font-[400]">{item?.notification_data?.patient_code &&
                                `Patient: ${item?.notification_data?.patient_name} (Admission No: ${item?.notification_data?.ipd_admission_no})`}</span>
                            </Typography.Text>
                          }

                          {item.key_type == "discharge_by_doctor" &&
                            <Typography.Text className="text-sm font-medium">
                              Discharged by Doctor  <br />
                              <span className="text-sm font-[400]">{item?.notification_data?.patient_code && `Patient: ${item?.notification_data?.patient_name} (Admission No: ${item?.notification_data?.ipd_admission_no})`}</span>
                            </Typography.Text>
                          }

                          {item.key_type == "prescription_by_doctor" &&
                            <Typography.Text className="text-sm font-medium">
                              Medicine issued by Doctor  <br />
                              <span className="text-sm font-[400]">{item?.notification_data?.patient_code && `Patient ${item?.notification_data?.patient_name} (Admission No: ${item?.notification_data?.ipd_admission_no})`}</span></Typography.Text>
                          }

                          {item.key_type == "comments" &&                          
                            <Typography.Text className="text-sm font-medium">
                              Doctor Notes<br />
                              <span className="text-sm font-[400]"> {`Patient: ${item?.notification_data?.patient_name} (Admission No: ${item?.notification_data?.ipd_admission_no})`} </span> <br/>
                              <span className="text-sm font-[400]">
                                {item?.notification_data?.remarks &&
                                item?.notification_data?.remarks.slice(0, 35) + "..."}</span>
                            </Typography.Text>
                          }
                        </>
                      )}
                    </Col>

                    {/* ward incharge */}
                    <Col>
                      {loggedUser?.role_key == "ward-incharge" && (
                        <>
                          {item.key_type == "change_request" &&
                            <Typography.Text className="text-sm font-medium">
                              Change Request <br />
                              <span className="text-sm font-[400]">{item?.notification_data?.patient_code &&
                                `Patient: ${item?.notification_data?.patient_name} (${item?.notification_data?.patient_code})`}</span>
                            </Typography.Text>
                          }
                          {item.key_type == "department_transfer" &&
                            <Typography.Text className="text-sm font-medium">
                              ICU To IPD Transfer <br />
                              <span className="text-sm font-[400]">{item?.notification_data?.patient_code &&
                                `Patient: ${item?.notification_data?.patient_name} (${item?.notification_data?.patient_code})`}</span>
                            </Typography.Text>
                          }

                          {item.key_type == "housekeeping_task" &&
                            <Typography.Text className="text-sm font-medium">
                              Housekeeping Task <br />
                              <span className="text-sm font-[400]">{item?.notification_data?.room_type &&
                                `${item?.notification_data?.room_type} Room No ${item?.notification_data?.room_number} Bed No. ${item?.notification_data?.bed_no}`}</span>
                            </Typography.Text>
                          }

                          {item.key_type == "ipd_admission" &&
                            <Typography.Text className="text-sm font-medium">
                              Patient Admission  <br />
                              <span className="text-sm font-[400]">{item?.notification_data?.patient_code &&
                                `Patient: ${item?.notification_data?.patient_name} (Admission No: ${item?.notification_data?.ipd_admission_no}) in  ${item?.notification_data?.room_type}`}</span>
                            </Typography.Text>
                          }

                          {item.key_type == "beds_available" &&
                            <Typography.Text className="text-sm font-medium">
                              Bed's Available  <br />
                              <span className="text-sm font-[400]">{item?.notification_data?.room_type &&
                                `Room Type: ${item?.notification_data?.room_type} Room No ${item?.notification_data?.room_number} Bed No.  ${item?.notification_data?.bed_no}`}</span>
                            </Typography.Text>
                          }



                        </>
                      )}
                    </Col>

                    {/* houskeeping incharge */}
                    <Col>
                      {loggedUser?.role_key == "houskeeping-incharge" && (
                        <>

                          {item.key_type == "housekeeping_task" &&
                            <Typography.Text className="text-sm font-medium">
                              Housekeeping Task <br />
                              <span className="text-sm font-[400]">{item?.notification_data?.room_type &&
                                `${item?.notification_data?.room_type} Room No. ${item?.notification_data?.room_number} Bed No. ${item?.notification_data?.bed_no}`}</span>
                            </Typography.Text>
                          }
                        </>
                      )}
                    </Col>

                    {/* pharma_admin */}
                    <Col>
                      {loggedUser?.role_key == "pharma_admin" && (
                        <>
                          {item.key_type == "return_request" &&
                            <Typography.Text className="text-sm font-medium">
                              Return Request  <br />
                              <span className="text-sm font-[400]">{item?.notification_data?.patient_code && `Patient: ${item?.notification_data?.patient_name} (Admission No: ${item?.notification_data?.ipd_admission_no})`}</span>
                            </Typography.Text>
                          }

                        </>
                      )}
                    </Col>

                    {/* labfo */}
                    <Col>
                      {loggedUser?.role_key == "labfo" && (
                        <>
                          {item.key_type == "lab_prescription_request" &&
                            <Typography.Text className="text-sm font-medium">
                              Lab Request  <br />
                              <span className="text-sm font-[400]">{item?.notification_data?.patient_code && `Patient: ${item?.notification_data?.patient_name} (${item?.notification_data?.patient_code})`}</span>
                            </Typography.Text>
                          }

                        </>
                      )}
                   
                      {loggedUser?.role_key == "lab-attendant" && (
                        <>
                          { item?.key_type !== ""  &&
                            <Typography.Text className="text-sm font-medium">
                              Lab  <br />
                              <span className="text-sm font-[400]">{item?.notification_data?.patient_code && `Patient: ${item?.notification_data?.patient_name} (${item?.notification_data?.patient_code})`}</span>
                            </Typography.Text>
                          }

                        </>
                      )}
                    </Col>

                    {/* billing-account */}
                    <Col>
                      {(loggedUser?.role_key == "billing-account" || loggedUser?.role_key == "billing-admin") && (
                        <>
                          {item.key_type == "discharge_by_doctor" &&
                            <Typography.Text className="text-sm font-medium">
                              Discharge<br />
                              <span className="text-sm font-[400]">{item?.notification_data?.patient_code && `Patient: ${item?.notification_data?.patient_name} (${item?.notification_data?.patient_code})`}</span>
                            </Typography.Text>
                          }

                          {item.type == "tpa_response" &&
                            <Typography.Text className="text-sm font-medium">
                              Your Request ID : {item?.notification_data?.tpa_request_id} has been approved by {item?.notification_data?.tpa_name}
                              <br />
                              <span className="text-sm font-[400]">{item?.notification_data?.patient_code && `Patient: ${item?.notification_data?.patient_name} (${item?.notification_data?.patient_code})`}</span>
                            </Typography.Text>
                          }
                        </>
                      )}
                    </Col>

                    {/* pathalogist */}
                    <Col>
                      {loggedUser?.role_key == "pathalogist" && (
                        <>
                          {item.key_type == "sample_approve_status" &&
                            <Typography.Text className="text-sm font-medium">
                              Sample Approve <br />
                              <span className="text-sm font-[400]">{item?.notification_data?.patient_code &&
                                `Patient: ${item?.notification_data?.patient_name} (${item?.notification_data?.patient_code})`}</span>
                            </Typography.Text>
                          }
                        </>
                      )}
                    </Col>

                    {/* phlebotomist */}
                    <Col>
                      {loggedUser?.role_key == "phlebotomist" && (
                        <>
                          {item.key_type == "sample_collected_status" &&
                            <Typography.Text className="text-sm font-medium">
                              Sample collected status  <br />
                              <span className="text-sm font-[400]">{item?.notification_data?.patient_code &&
                                `Patient: ${item?.notification_data?.patient_name} (${item?.notification_data?.patient_code})`}</span>
                            </Typography.Text>
                          }
                        </>
                      )}
                    </Col>
                    {/* pharmacist */}
                    <Col>
                      {loggedUser?.role_key == "pharmacist" && (
                        <>
                          {item.key_type == "medicine_request" &&
                            <Typography.Text className="text-sm font-medium">
                              Request for Medicine <br />
                              <span className="text-sm font-[400]">{item?.notification_data?.patient_code &&
                                `Patient: ${item?.notification_data?.patient_name} (Admission No: ${item?.notification_data?.ipd_admission_no})`}</span>
                            </Typography.Text>
                          }

                          {item.key_type == "return_request" &&
                            <Typography.Text className="text-sm font-medium">
                              Return Request for Medicine <br />
                              <span className="text-sm font-[400]">{item?.notification_data?.patient_code &&
                                `Patient: ${item?.notification_data?.patient_name} (Admission No: ${item?.notification_data?.ipd_admission_no})`}</span>
                            </Typography.Text>
                          }
                        </>
                      )}
                    </Col>
                    {/*opd nurse */}
                    <Col>
                      {loggedUser?.role_key == "nurse" && (
                        <>
                          <Typography.Text className="text-sm font-medium">
                            Notes
                            <br />
                            <span className="text-sm font-[400]">{
                             `Patient: ${item?.notification_data?.patient_name} (${item?.notification_data?.patient_code})`}</span>                            
                          </Typography.Text>
                        </>
                      )}
                    </Col>
                    {/* lab technician */}
                    <Col>
                      {loggedUser?.role_key == "lab-technician" && (
                        <>
                          <Typography.Text className="text-sm font-medium">
                            Report Status
                            <br />
                            <span className="text-sm font-[400]">{item?.key_type == "report_data_status" &&
                             `Patient: ${item?.notification_data?.patient_name} (${item?.notification_data?.patient_code})`}</span>
                            
                          </Typography.Text>
                        </>
                      )}
                    </Col>
                          {/* ICU ATTENDANT */}
                    <Col>
                      {loggedUser?.role_key == "icu-attendant" && (
                        <>
                          <Typography.Text className="text-sm font-medium">
                          {item?.key_type && "IPD To ICU Transfer"}
                            <br />              
                            <span className="text-sm font-[400]">{(item?.key_type == "department_transfer" || item?.key_type == "change_request" )&&
                             `Patient: ${item?.notification_data?.patient_name} (${item?.notification_data?.patient_code})`}</span>
                            
                          </Typography.Text>
                        </>
                      )}
                    </Col>

                      {/* IPD NURSE */}
                    <Col>
                      {loggedUser?.role_key == "icu-nurse" && (
                        <>
                          {item.key_type == "investigation_by_doctor" &&
                            <Typography.Text className="text-sm font-medium">
                              Tests recommended by Doctor  <br />
                              <span className="text-sm font-[400]">{item?.notification_data?.patient_code &&
                                `Patient: ${item?.notification_data?.patient_name} (Admission No: ${item?.notification_data?.ipd_admission_no})`}</span>
                            </Typography.Text>
                          }

                          {item.key_type == "discharge_by_doctor" &&
                            <Typography.Text className="text-sm font-medium">
                              Discharged by Doctor  <br />
                              <span className="text-sm font-[400]">{item?.notification_data?.patient_code && `Patient: ${item?.notification_data?.patient_name} (Admission No: ${item?.notification_data?.ipd_admission_no})`}</span>
                            </Typography.Text>
                          }

                          {item.key_type == "prescription_by_doctor" &&
                            <Typography.Text className="text-sm font-medium">
                              Medicine issued by Doctor  <br />
                              <span className="text-sm font-[400]">{item?.notification_data?.patient_code && `Patient ${item?.notification_data?.patient_name} (Admission No: ${item?.notification_data?.ipd_admission_no})`}</span></Typography.Text>
                          }

                          {item.key_type == "comments" &&                          
                            <Typography.Text className="text-sm font-medium">
                              Doctor Notes<br />
                              <span className="text-sm font-[400]"> {`Patient: ${item?.notification_data?.patient_name} (Admission No: ${item?.notification_data?.ipd_admission_no})`} </span> <br/>
                              <span className="text-sm font-[400]">
                                {item?.notification_data?.remarks &&
                                item?.notification_data?.remarks.slice(0, 35) + "..."}</span>
                            </Typography.Text>
                          }
                        </>
                      )}
                    </Col> 
                  </Row>
                  <Row>
                    <Col>
                    <Typography.Text className="text-sm font-[400]">
                    { item.key_type == "sample_approve_status" || item.key_type == "sample_collected_status" ||  item.key_type == "report_data_status" ?
                    getDate(item?.created_on) :  getDate(item?.notification_data?.created_on) }
                    </Typography.Text>
                    </Col>
                  </Row>
                </>
              }
            />
            <Typography.Text
              strong
              className="cursor-pointer mr-3"
              style={{
                color: item?.is_read == 0 ? Color["--primary"] : "gray",
              }}
              onClick={(e) => handleNavigate(e, item)}
            >
              {item?.is_read == 0 ? "View" : "Viewed"}
            </Typography.Text>
          </List.Item>
        )}
      />}
      {data?.length === 0 && <Empty />}
    </Card>
  );
};

export default NotificationPop;