import { Menu, MenuProps } from 'antd'
import React, { Fragment, useState } from 'react'
import './appnavbar.css'
import { useTheme } from '../../contexts/Theme/Theme.context';
import { generatePath, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { t } from 'i18next';
import { DoctorVitalsIcon, LabMenuIcon, MonitoringIcon, NurseVitalIcon, OverviewMenuIcon, ServicesMenuIcon } from '../elements/Icons/icon';
import { MedicationIcon } from '../elements/Icons/MedicationIcon';
import { NurseNotesIcon } from '../elements/Icons/NurseNotesIcon';
import { useDispatch} from 'react-redux';
import { onNavBarChange } from '../../redux/menuItems/slice';
import { useAppSelector } from '../../hooks/redux-hooks';
import PatientDischargeIcon from '../elements/Icons/PatientDischargeIcon';
import ReturnMedicine from '../elements/Icons/ReturnMedicine';
import { pathConstants } from '../../constant';
import LabourAssessmentIcon from '../elements/Icons/LabourAssessmentIcon';
import { TransferToLabourRoom } from '../elements/Icons/icons';

interface NavbarProps {
  moduleName?:string
}

const AppNavbar = ({moduleName }:NavbarProps) => {

  const {Color} = useTheme();
  const navigate = useNavigate();
  const selectedItem = useAppSelector((state)=>state?.menuItemsReducer?.selectedNavBarItem);
  const patientDetails: any = useAppSelector((state:any) => state?.ipdAdmissionFormReducer?.ipdPatientDetailsOverview);
  const {showDischargeSheet , patientReadToDischargeByNurse} = useAppSelector((s) => s.dischargeReportReducer)
  const {showLabourAssessmentTab , showBirthCardTab} = useAppSelector((s) => s.LabourAssessmentReducer)

  const {uuid,type}=useParams();
  const state = useLocation();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const opinionType = searchParams.get("type");
  const pathnameArr = state.pathname.split("/");
  const initialPath = pathnameArr.filter((_ , index)=>index != 3 && index != 4  ).join("/");

  
const [current, setCurrent] = useState(moduleName === 'OTPatient' ? pathnameArr[4] : pathnameArr[3]);

  const IpdNurseitems: MenuProps['items'] = [
    {
      label: <span style={{color:selectedItem === "overview" ? Color["--primary"] : "" }}>{t("overview")}</span>,
      key: 'overview',
      icon: <OverviewMenuIcon className='absolute lg:mt-[15px]   md:mt-[15px] ' height={"20px"} width={"20px"} key="dash" fill={selectedItem === "overview" ? Color["--primary"] : ""} />,
    },
    {
      label: <span style={{color:selectedItem === "vitals" ? Color["--primary"] : "" }}>{t("vitals")}</span>,
      key: 'vitals',
      icon: <NurseVitalIcon className='absolute lg:mt-[15px]   md:mt-[15px] ' height={"20px"} width={"20px"} key="dash" fill={selectedItem === "vitals" ? Color["--primary"] : ""}/>,
    },
    {
      label: <span style={{color:selectedItem === "medication" ? Color["--primary"] : "" }}>{t("medication")}</span>,
      key: 'medication',
      icon: <MedicationIcon className='absolute lg:mt-[15px]   md:mt-[15px] ' height={"20px"} width={"20px"} key="dash" fill={selectedItem === "medication" ? Color["--primary"] : ""}/>,
    },
    {
      label: <span style={{color:selectedItem === "notes" ? Color["--primary"] : "" }}>{t("nurseNotes")}</span>,
      key: 'notes',
      icon: <NurseNotesIcon className='absolute lg:mt-[15px]  md:mt-[15px] ' height={"20px"} width={"20px"} key="dash" fill={selectedItem === "notes" ? Color["--primary"] : ""}/>,
    },
    {
      label: <span style={{color:selectedItem === "lab" ? Color["--primary"] : "" }}>{t("lab")}</span>,
      key: 'lab',
      icon: <LabMenuIcon className='absolute lg:mt-[15px]   md:mt-[15px] ' height={"20px"} width={"20px"} key="dash" fill={selectedItem === "lab" ? Color["--primary"] : ""} />,
    }  ,
    {
      label: <span style={{color:selectedItem === "immunization" ? Color["--primary"] : "" }}>{t("immunization")}</span>,
      key: 'immunization',
      icon: <MedicationIcon className='absolute lg:mt-[15px]   md:mt-[15px] ' height={"20px"} width={"20px"} key="dash" fill={selectedItem === "immunization" ? Color["--primary"] : ""}/>,
    },
    {
      label: <span style={{color:selectedItem === "service" ? Color["--primary"] : "" }}>{t("services")}</span>,
      key: 'service',
      icon: <ServicesMenuIcon className='absolute lg:mt-[15px]   md:mt-[15px]' height={"23px"} width={"21px"} key="dash" fill={selectedItem === "service" ? Color["--primary"] : ""} />,
    },
    {
      label: <span>{t("labourAssessment")}</span>,
      key: 'labourAssessment',
      icon: <LabourAssessmentIcon className='absolute lg:mt-[15px]   md:mt-[15px] ' height={"25px"} width={"25px"} key="dash"/>,
    },  
    {
      label: <span style={{color:selectedItem === "returnMedicine" ? Color["--primary"] : "" }}>{t("returnMedicine")}</span>,
      key: 'returnMedicine',
      icon: <ReturnMedicine className='absolute lg:mt-[15px]  md:mt-[15px] ' height={"20px"} width={"20px"} key="dash" fill={selectedItem === "returnMedicine" ? Color["--primary"] : ""} />,
    },
     
  ];


  const IpdDoctoritems: MenuProps['items'] = [
    {
      label: <span>{t("overview")}</span>,
      key: 'overview',
      icon: <OverviewMenuIcon className='absolute lg:mt-[15px]   md:mt-[15px] ' height={"20px"} width={"20px"} key="dash" />,
    },
    {
      label: <span>{t("monitoring")}</span>,
      key: 'monitoring',
      icon: <MonitoringIcon className='absolute lg:mt-[15px]   md:mt-[15px] ' height={"20px"} width={"20px"} key="dash"/>,
    },
    {
      label: <span>{t("treatment")}</span>,
      key: 'prescription',
      icon: <DoctorVitalsIcon className='absolute lg:mt-[15px]   md:mt-[15px] ' height={"18px"} width={"31px"} key="dash"/>,
    },
    {
      label: <span>{t("immunization")}</span>,
      key: 'immunization',
      icon: <MedicationIcon className='absolute lg:mt-[15px]   md:mt-[15px] ' height={"20px"} width={"20px"} key="dash"/>,
    },
    {
      label: <span>{t("nurseNotes")}</span>,
      key: 'notes',
      icon: <NurseNotesIcon className='absolute lg:mt-[15px]   md:mt-[15px] ' height={"20px"} width={"20px"} key="dash"/>,
    },
     {
      label: <span>{t("labourAssessment")}</span>,
      key: 'labour-assessment',
      icon: <LabourAssessmentIcon className='absolute lg:mt-[15px]   md:mt-[15px] ' height={"25px"} width={"25px"} key="dash"/>,
    },
    {
      label: <span>{t("dischargeReport")}</span>,
      key: 'discharge',
      icon: <PatientDischargeIcon className='absolute lg:mt-[15px]   md:mt-[15px] ' height={"20px"} width={"20px"} key="dash"/>,
    },
    {
      label: <span>{t("birthRecord")}</span>,
      key: 'ipdBirthRecord',
      icon: <TransferToLabourRoom className='absolute lg:mt-[15px]   md:mt-[15px] ' height={"20px"} width={"20px"} key="dash"/>,
    },
    
  ];


  const OTPatienIitems: MenuProps['items'] = [
    {
      label: <span>{t("overview")}</span>,
      key: 'overview',
      icon: <OverviewMenuIcon className='absolute lg:mt-[15px]   md:mt-[15px] ' height={"20px"} width={"20px"} key="dash" />,
    },
    {
      label: <span>{t("vitals")}</span>,
      key: 'vitals',
      icon: <MonitoringIcon className='absolute lg:mt-[15px]   md:mt-[15px] ' height={"20px"} width={"20px"} key="dash" />,
    },
    {
      label: <span>{t("surglCaseNotes")}</span>,
      key: 'surgl-case-notes',
      icon: <NurseNotesIcon className='absolute lg:mt-[15px]   md:mt-[15px] ' height={"18px"} width={"31px"} key="dash"/>,
    },
  ];

  const EmergencyItems: MenuProps['items'] = [
    {
      label: <span>{t("overview")}</span>,
      key: 'overview',
      icon: <OverviewMenuIcon className='absolute lg:mt-[15px]   md:mt-[15px] ' height={"20px"} width={"20px"} key="dash" />,
    },
    {
      label: <span>{t("treatment")}</span>,
      key: 'prescription',
      icon: <DoctorVitalsIcon className='absolute lg:mt-[15px]   md:mt-[15px] ' height={"18px"} width={"31px"} key="dash"/>,
    },
    {
      label: <span>{t("dischargeReport")}</span>,
      key: 'discharge-report',
      icon: <PatientDischargeIcon className='absolute lg:mt-[15px]   md:mt-[15px] ' height={"20px"} width={"20px"} key="dash"/>,
    },
  ];




  const onClick: MenuProps['onClick'] = (e: any) => {
    setCurrent(e);
    if (moduleName === "ipdNurse") {
      switch (e) {
        case "overview":
          if (current !== "overview") {
            navigate(initialPath + "/overview");
            dispatch(onNavBarChange(e));
          }
          break;
        case "vitals":
          if (current !== "vitals") {
            navigate(initialPath + "/vitals");
            dispatch(onNavBarChange(e));
          }
          break;
        case "medication":
          if (current !== "medication") {
            navigate(initialPath + "/medication");
            dispatch(onNavBarChange(e));
          }
          break;
        case "notes":
          if (current !== "notes") {
            navigate(initialPath + "/notes");
            dispatch(onNavBarChange(e));
          }
          break;
        case "lab":
          if (current !== "lab") {
            navigate(initialPath + "/lab");
            dispatch(onNavBarChange(e));
          }
          break;
        case "labourAssessment":
          if (current !== "labourAssessment") {
            navigate(initialPath + "/labourAssessment");
            dispatch(onNavBarChange(e));
          }
          break;
        default:
          navigate(initialPath + "/" + e);
          dispatch(onNavBarChange(e));
      }
    } 
    else if(moduleName === "OTPatient"){
        switch (e) {
        case "overview":
          if (current !== "overview") {
            const path:any=generatePath(pathConstants.OTPatientOverview,{uuid:uuid})
            navigate(path);
            dispatch(onNavBarChange(e));
          }
          break;
        case "vitals":
          if (current !== "vitals") {
            const path:any=generatePath(pathConstants.OTPatientVitals,{uuid:uuid})
            navigate(path);
            dispatch(onNavBarChange(e));
          }
          break;
          case "surgl-case-notes":
            if (current !== "surgl-case-notes") {
              const path:any=generatePath(pathConstants.OTPatientSurglCaseNotes,{uuid:uuid})
              navigate(path);
              dispatch(onNavBarChange(e));
            }
            break;
        default:
          navigate(initialPath + "/" + e);
          dispatch(onNavBarChange(e));
      }
    }
    else if (moduleName === "ipdDoctor") {
      if (type) {
        const pathName = `${initialPath}/${e}/${type}`;
        const payload = {
          pathname: pathName,
          search: "?type=secondOpinion",
        };
        navigate(opinionType === "secondOpinion" ? payload : pathName);
      } else {
        navigate(initialPath + "/" + e);
      }
      dispatch(onNavBarChange(e));
    }
    else if (moduleName === "EmergencyPatient") {
      navigate(initialPath + "/" + e);
      dispatch(onNavBarChange(e));
    }
  }


  return (
    <Menu mode="horizontal" className='custom-tabs' style={{ marginLeft: "35px", border: "transparent" , height:"55px" , backgroundColor:Color["--whiteBlack"]}} selectedKeys={[current]} >
      {
        moduleName==="ipdNurse" &&  IpdNurseitems?.map((item: any) => {
          return (
            <Fragment>
              {item?.key === "returnMedicine" ?
                (patientReadToDischargeByNurse === true &&
                  <Menu.Item key={item.key} onClick={() => onClick(item.key)}>
                    <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", alignItems: "center", fontWeight: 600, fontSize: "12px", color: `${Color["--grayWhite"]}` }} key={item.key}>
                      {item.icon}
                      <span style={{ marginTop: 12 }} key={item.key}>{item.label}</span>
                    </div>
                  </Menu.Item>) :
                item?.key === "labourAssessment" ?
                  (showLabourAssessmentTab === true &&
                    <Menu.Item key={item.key} onClick={() => onClick(item.key)}>
                      <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", alignItems: "center", fontWeight: 600, fontSize: "12px", color: `${Color["--grayWhite"]}` }} key={item.key}>
                        {item.icon}
                        <span style={{ marginTop: 12 }} key={item.key}>{item.label}</span>
                      </div>
                    </Menu.Item>) :
                  <Menu.Item key={item.key} onClick={() => onClick(item.key)}>
                    <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", alignItems: "center", fontWeight: 600, fontSize: "12px", color: `${Color["--grayWhite"]}` }} key={item.key}>
                      {item.icon}
                      <span style={{ marginTop: 12 }} key={item.key}>{item.label}</span>
                    </div>
                  </Menu.Item>
              }
        </Fragment>) }
        )}
        {
          moduleName==="ipdDoctor" &&  IpdDoctoritems?.map((item: any) => {
            return (
            <Fragment>
                {item?.key === "discharge" ?
                  (showDischargeSheet === true && 
                    <Menu.Item key={item.key} onClick={() => onClick(item.key)} style={{}}>
                      <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", alignItems: "center", fontWeight: 600, fontSize: "12px", color: `${Color["--grayWhite"]}` }} key={item.key}>
                        {item.icon}
                        <span style={{ marginTop: 12 }} key={item.key}>{item.label}</span>
                      </div>
                    </Menu.Item>) :
                  item?.key === "labour-assessment" ?
                  (showLabourAssessmentTab === true &&
                    <Menu.Item key={item.key} onClick={() => onClick(item.key)} style={{}}>
                      <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", alignItems: "center", fontWeight: 600, fontSize: "12px", color: `${Color["--grayWhite"]}` }} key={item.key}>
                        {item.icon}
                        <span style={{ marginTop: 12 }} key={item.key}>{item.label}</span>
                      </div>
                    </Menu.Item>) :
                    item?.key === "ipdBirthRecord" ?
                  (showBirthCardTab === true &&
                    <Menu.Item key={item.key} onClick={() => onClick(item.key)} style={{}}>
                      <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", alignItems: "center", fontWeight: 600, fontSize: "12px", color: `${Color["--grayWhite"]}` }} key={item.key}>
                        {item.icon}
                        <span style={{ marginTop: 12 }} key={item.key}>{item.label}</span>
                      </div>
                    </Menu.Item>) :
                   <Menu.Item key={item.key} onClick={() => onClick(item.key)} style={{}}>
                    <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", alignItems: "center", fontWeight: 600, fontSize: "12px", color: `${Color["--grayWhite"]}` }} key={item.key}>
                      {item.icon}
                      <span style={{ marginTop: 12 }} key={item.key}>{item.label}</span>
                    </div>

                  </Menu.Item>
                }
              </Fragment>)
          })}

        {
          moduleName==="OTPatient" &&  OTPatienIitems?.map((item: any) => {
            return (
            <Fragment>
            {item?.key === "discharge" ? 
            (showDischargeSheet === true && <Menu.Item key={item.key} onClick={() => onClick(item.key)} style={{}}>
            <div style={{display: "flex", flexDirection: "column", justifyContent: "space-between", alignItems: "center", fontWeight:600 , fontSize:"12px", color:`${Color["--grayWhite"]}`}}  key={item.key}>
            {item.icon}
            <span style={{marginTop:12}} key={item.key}>{item.label}</span>
            </div>   
            </Menu.Item>)
            :  <Menu.Item key={item.key} onClick={() => onClick(item.key)} style={{}}>
                <div style={{display: "flex", flexDirection: "column", justifyContent: "space-between", alignItems: "center", fontWeight:600 , fontSize:"12px", color:`${Color["--grayWhite"]}`}}  key={item.key}>
                {item.icon}
                <span style={{marginTop:12}} key={item.key}>{item.label}</span>
                </div>
                
              </Menu.Item>
          }
              </Fragment>)
          })}

        {
          moduleName==="EmergencyPatient" &&  EmergencyItems?.map((item: any) => {
            return (
            <Fragment>
            {item?.key === "discharge-report" ? 
            (patientDetails?.discharge_filing_status!="0"&& <Menu.Item key={item.key} onClick={() => onClick(item.key)} style={{}}>
            <div style={{display: "flex", flexDirection: "column", justifyContent: "space-between", alignItems: "center", fontWeight:600 , fontSize:"12px", color:`${Color["--grayWhite"]}`}}  key={item.key}>
            {item.icon}
            <span style={{marginTop:12}} key={item.key}>{item.label}</span>
            </div>   
            </Menu.Item>)
            :  <Menu.Item key={item.key} onClick={() => onClick(item.key)} style={{}}>
                <div style={{display: "flex", flexDirection: "column", justifyContent: "space-between", alignItems: "center", fontWeight:600 , fontSize:"12px", color:`${Color["--grayWhite"]}`}}  key={item.key}>
                {item.icon}
                <span style={{marginTop:12}} key={item.key}>{item.label}</span>
                </div>
                
              </Menu.Item>
          }
              </Fragment>)
          })}
    </Menu>
  );
}

export default AppNavbar