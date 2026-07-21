import { Col, ConfigProvider, Menu, Row, Tooltip } from "antd";
import Sider from "antd/es/layout/Sider";
import React, { useEffect, useState } from "react";
import "./sidebar.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "../../contexts/Theme/Theme.context";
import Icon, {
  MenuOutlined
} from "@ant-design/icons";
import { useAppDispatch, useAppSelector } from "../../hooks/redux-hooks";
import { useTranslation } from "react-i18next";
import type { MenuProps } from "antd";
import {
  LabIcon,
  IPDADmisstionIcon,
  IPDPatientsIcon,
  SettingIcon,
  DashboardIcon,
  OPDPatientsIcon,
  HousekeepingBeds,
} from "../elements/Icons/index";
import { useSelector } from "react-redux";
import { openMenuKey, setSideBar, setSideMenuItems, setSidebarCollapsed } from "../../redux/menuItems/slice";
import { StoreSetting, DashboardSvgIcon, DotIcon, ECareCollapsedLogoV1, ECareLogoV1, InventoryPlusIcon, InventorySvgIcon, LabMenuIcon, OPDNursePateintIcon,  Reports, ReturnRequest, SupplierMasterIcon, TeamSvgIcon, TpaIcon, PurchaseOrder, ProductReturn, OverView, Inventory, Grn, Indent, CategoryMaster, BackOrder, Equpmentrequest } from "../elements/Icons/icon";
import { LabashboardIcon } from "../elements/Icons/LabdashboardIcon";
import { LabAdminIcon } from "../elements/Icons/Reporticon";
import { RequestedStocks } from "../elements/Icons/RequestedStocks";
import { AdmintMaster, AttenDanceIcon, BillingIcon, BloodBank, BmwIcon, BusIcon, CssdConfiguration, CssdIcon, CssdIndent, EmergencyIcon, EmergencyMasterIcon, EmpoyeesIcon, EmrIcon, FileIcons, HRIcon, HandoverIcon2, HospitalIcon, HouseKeepingIcon, IcuAttdentPatient, IcuAttdentPatientTransfer, IcuIcon, IcuIcon2, InstrumentRequestIcon, InstrumentSterilizationIcon, IpdIcon, IpdOpdEmrIcon, IpdPatientIcon, JobsIcon, LeavesIcon, LisIcon, NursingStationIcon, OT, OverViewIcons, OverviewIcon, PayRollIcon, PharmacyIcon, ReportsIcon, RetailIcon, ReturnRequestIcon, RisIcon, SettingIcons, ShiftRosterIcon, SterilizationMasterIcon, StoreIcon, TranferIcon, TransferToLabourRoom, WardMangementIcon, WasteTreatMentIon } from "../elements/Icons/icons";
import { LAYOUT } from "../../helpers/dimentions";
import { storePaymentDetails, updateSelectedModule } from "../../redux/payment/slice";
import toNavigateHome from "../../helpers/toNavigateHome";
import "./appSidebar.css";
import useWindowWidth from "../../hooks/useScreenWidth";
import { NurseNotesIcon } from "../elements/Icons/NurseNotesIcon";


type MenuItem = Required<MenuProps>["items"][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[]
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

// The sidebar order comes verbatim from the backend `menu` payload. Business
// wants the Immunization entry to sit right after the "IPD Patient" entry, so
// we relocate it client-side before building the antd menu. Matching is done on
// the icon slug (`description`) with a routerLink/name fallback, and it is a
// no-op when either entry is absent — so it never disturbs other roles' menus.
const IPD_PATIENT_ANCHORS = [
  "ipdDoctorPatients",
  "ipdPatients",
  "ipdNurseAdmission",
  "ipdNursePatients",
  "ipdPatient",
];

const isImmunizationItem = (it: any) =>
  it?.description === "immunization" ||
  (typeof it?.routerLink === "string" && it.routerLink.includes("immunization")) ||
  (typeof it?.name === "string" && /immuniz/i.test(it.name));

const isIpdPatientAnchorExact = (it: any) => IPD_PATIENT_ANCHORS.includes(it?.description);

const isIpdPatientAnchorFuzzy = (it: any) =>
  isIpdPatientAnchorExact(it) ||
  (typeof it?.routerLink === "string" && /ipd.*patient/i.test(it.routerLink)) ||
  (typeof it?.name === "string" && /ipd.*patient/i.test(it.name));

const relocateImmunizationAfterIpd = (rawMenu: any) => {
  if (!Array.isArray(rawMenu) || rawMenu.length === 0) return rawMenu;

  try {
  // Plain data from the API — safe to deep clone so we never mutate redux state.
  const menu = JSON.parse(JSON.stringify(rawMenu));

  // Collect every sibling `items` array in the tree (groups → items → sub-items).
  const arrays: any[][] = [];
  const collect = (arr: any) => {
    if (!Array.isArray(arr)) return;
    arrays.push(arr);
    arr.forEach((n: any) => collect(n?.items));
  };
  collect(menu);

  // Locate the immunization entry and pull it out of wherever it currently sits.
  let immNode: any = null;
  for (const arr of arrays) {
    const idx = arr.findIndex(isImmunizationItem);
    if (idx !== -1) {
      immNode = arr[idx];
      arr.splice(idx, 1);
      break;
    }
  }
  if (!immNode) return menu; // no immunization entry for this role → leave untouched

  // Prefer an exact icon-slug match for the IPD Patient anchor; fall back to fuzzy.
  const anchorArr =
    arrays.find((arr) => arr.some(isIpdPatientAnchorExact)) ??
    arrays.find((arr) => arr.some(isIpdPatientAnchorFuzzy));

  if (!anchorArr) {
    // No IPD Patient entry visible → put immunization back where it was is not
    // tracked, so append to the first array to avoid dropping the menu.
    arrays[0]?.push(immNode);
    return menu;
  }

  const anchorIdx = anchorArr.findIndex(
    (it) => isIpdPatientAnchorExact(it) || isIpdPatientAnchorFuzzy(it)
  );
  anchorArr.splice(anchorIdx + 1, 0, immNode);
  return menu;
  } catch {
    // Reordering is purely cosmetic — never let it blank out the sidebar.
    return rawMenu;
  }
};


const CollapableSidebar: React.FC = () => {
  const loggedUser = useAppSelector((state) => state?.authReducer?.user?.users);
  const { menuList } = useAppSelector((state) => state?.authReducer);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const state = useLocation();
  const sideMenuProperty = useSelector((state: any) => state?.menuItemsReducer)
  const [menuitems, setMenuitems] = useState<any>([]);
  const { Color } = useTheme();
  const { token } = useAppSelector((s) => s?.authReducer);
  const location = useLocation();
  const pathname = location.pathname;
  const screenWidth = useWindowWidth() 

  useEffect(() => {
    // CERT-In F-02 — token is no longer mirrored to localStorage, so the
    // old "compare in-memory token with persisted token" cross-tab
    // detection can't work. Each tab now owns its own session by design.
    // Falling back to the in-memory check: if Redux drops the token,
    // bounce to /login.
    if (!token) {
      navigate("/login", { replace: true })
    }
  }, [menuList, token])

  const menusIcons = {
    ipdPatients: <IPDPatientsIcon fill={"white"} height={20} width={20}/>,
    settings: <SettingIcon fill={"white"} height={20} width={20}/>,
    opdPatients: <OPDPatientsIcon fill={"white"} height={20} width={20}/>,
    dashboard: <DashboardIcon fill={"white"} height={20} width={20}/>,
    'lab-dashboard': <LabashboardIcon fill={"white"} height={20} width={20}/>,
    'opdLab':<LabIcon fill={"white"} height={20} width={20}/>,
    lab: <LabIcon fill={"white"} height={20} width={20}/>,
    ipdAdmission: <IPDADmisstionIcon fill={"white"} height={20} width={20}/>,
    housekeepingBeds:<HouseKeepingIcon fill={"white"} height={20} width={20}/>,
    wardManagement:<WardMangementIcon fill={"white"} height={20} width={20}/>,
    bedAvailability: <DotIcon fill={"white"} height={20} width={20}/>,
    ipdDoctorPatients: <IPDPatientsIcon fill={"white"} height={20} width={20}/>,
    wardRoomChangeReq: <DotIcon fill={"white"} height={20} width={20}/>,
    ipdWardPatients: <IpdIcon fill={"white"} height={20} width={20}/>,
    opdDoctorPatients: <OPDPatientsIcon fill={"white"} height={20} width={20}/>,
    opdNursePatients: <OPDNursePateintIcon fill={"white"} height={20} width={20}/>,
    ipdNurseAdmission: <IpdPatientIcon fill={"white"} height={20} width={20}/>,
    houseKeepingIncharge: <HousekeepingBeds fill={"white"} height={20} width={20}/>,
    ipdPrescription: <IPDPatientsIcon fill={"white"} height={20} width={20}/>,
    opdPrescription: <OPDNursePateintIcon fill={"white"} height={20} width={20}/>,
    laboratory: <LabMenuIcon fill={"white"} height={20} width={20}/>,
    reports: <LabAdminIcon fill={"white"} height={20} width={20}/>,
    'requested_stocks': <RequestedStocks height={20} width={20}/>,
    pharmaReturnRequest: <ReturnRequest height={20} width={20}/>,
    labFoIpdPatient: <IPDPatientsIcon fill={"white"} height={20} width={20}/>,
    labFoOpdPatient: <OPDPatientsIcon fill={"white"} height={20} width={20}/>,
    'team': <TeamSvgIcon fill={"white"} height={20} width={20}/>,
    'pharma-dashboard': <DashboardSvgIcon fill={"white"} height={20} width={20}/>,
    'Inventory': <InventorySvgIcon fill={"white"} height={20} width={20}/>,
    'returnRequest': <InventorySvgIcon fill={"white"} height={20} width={20}/>,
    'instrumentRequest': <InstrumentRequestIcon fill={"white"} height={20} width={20}/>,
    labReport: <LabMenuIcon fill={"white"} height={20} width={20}/>,
    billingIpd: <BillingIcon height={20} width={20}/>,
    'tpa': <TpaIcon  fill={"white"}height={20} width={20}/>,
    'configuration': <CssdConfiguration  fill={"white"}height={20} width={20}/>,
    'overview':<OverviewIcon fill={"white"} height={20} width={20}/>,
    'employees':<EmpoyeesIcon fill={"white"} height={20} width={20}/>,
    'attendance':<AttenDanceIcon fill={"white"} height={20} width={20}/>,
    'payroll':<PayRollIcon fill={"white"} height={20} width={20}/>,
    'leaves':<LeavesIcon fill={"white"} height={20} width={20} />,
    'jobs':<JobsIcon fill={"white"} height={20} width={20} />,
    'hr-reports': <ReportsIcon fill={"white"} height={20} width={20}/>,
    "patient opd report": <ReportsIcon fill={"white"} height={20} width={20}/>,
    adminMaster:<AdmintMaster fill={"white"} height={20} width={20} />,
    'admin-emergency':<EmergencyIcon fill={"white"} height={20} width={20} />,
    opdAdmin: <OPDPatientsIcon fill={"white"} height={20} width={20}/>,
    ipdAdmin:<IPDADmisstionIcon fill={"white"} height={20} width={20}/>,
    opdIpdEmr:<IpdOpdEmrIcon  fill={"white"} height={20} width={20} />,
    LIS:<LisIcon  fill={"white"} height={20} width={20} />,
    radiology:<RisIcon fill={"white"} height={20} width={20}  />,
    billingAndAccounts:<BillingIcon height={20} width={20}/>,
    report:<ReportsIcon fill={"white"} height={20} width={20}/>,
    humanResource:<HRIcon fill={"white"} height={20} width={20}/>,
    icu:<IcuIcon fill={"white"} height={20} width={20}/>,
    ot:<OT fill={"white"} height={20} width={20}/>,
    bloodBank : <BloodBank fill={"white"} height={20} width={20} />,
    nursingStation:<NursingStationIcon fill={"white"} height={20} width={20} />,
    Setting:<SettingIcon fill={"white"} height={20} width={20}/>,
    cssd:<CssdIcon fill={"white"}  height={20} width={20}/>,
    pharmacy:< PharmacyIcon fill={"white"}  height={20} width={20} />,
    store :<StoreIcon   fill={"white"}  height={20} width={20} />,
    opdLabTechnicianPatients:<OPDPatientsIcon fill={"white"} height={20} width={20}/>,
    ipdLabTechnicianPatients:<IPDPatientsIcon fill={"white"} height={20} width={20}/>,
    labTechnicianReports:<ReportsIcon fill={"white"} height={20} width={20}/>,
    opdPhlebotomistPatients:<OPDPatientsIcon fill={"white"} height={20} width={20}/>,
    ipdPhlebotomistPatients:<IPDPatientsIcon fill={"white"} height={20} width={20}/>,
    labAdminReport:<ReportsIcon fill={"white"} height={20} width={20}/>,
    labPathologistReport:<ReportsIcon fill={"white"} height={20} width={20}/>,
    icuDoctorPatients: <IcuIcon2 fill={"white"} height={20} width={20} />,
    icuNurseAdmission: <IcuIcon2 fill={"white"} height={20} width={20} />,
    ipdWardInchargeIcuToIpd:<TranferIcon fill={"white"} height={20} width={20} />,
    frontOffice:<OPDPatientsIcon fill={"white"} height={20} width={20} />,
    EMR:<EmrIcon fill={"white"} height={20} width={20} />,
    immunization:<EmrIcon fill={"white"} height={20} width={20} />,
    ipdicuPrescription: <IPDPatientsIcon fill={"white"} height={20} width={20}/>,
    labFoIpdIcuPatient:<IPDPatientsIcon fill={"white"} height={20} width={20}/>,
    scheduledOt:<FileIcons fill={"white"} height={20} width={20}/>,
    OTAdminOverview:<OverViewIcons fill={"white"} height={20} width={20}/>,
    OTAdminManagement:<SettingIcons fill={"white"} height={20} width={20}/>,
    OTAdminScheduledOT:<FileIcons fill={"white"} height={20} width={20}/>,
    EmergencyPatients:<EmergencyIcon fill={"white"} height={20} width={20}/>,
    MlcPatients:<EmergencyIcon fill={"white"} height={20} width={20}/>,
    EmergencyMaster:<EmergencyMasterIcon fill={"white"} height={20} width={20}/>,
    emergencyPrescription:<EmergencyIcon fill={"white"} height={20} width={20}/>,
    labFrontOfficeEmergencyRequest:<EmergencyIcon fill={"white"} height={20} width={20}/>,
    labPhlebotomistEmergencyPatient:<EmergencyIcon fill={"white"} height={20} width={20}/>,
    labTechnicianEmergencyPatient:<EmergencyIcon fill={"white"} height={20} width={20}/>,
    emergencyBilling: <EmergencyIcon height={20} width={20}/>,
    icuAttendantPatient:<IcuAttdentPatient height={20} width={20}/>,
    IpdToIcuTransfer:<IcuAttdentPatientTransfer height={20} width={20}/>,
    cssdTechnicianEquipmentRequest:<ReportsIcon fill={"white"} height={20} width={20}/>,
    cssdSupervisorIndent:<CssdIndent fill={"white"} height={20} width={20}/>,
    cssdTechnicianReturnRequest:<ReturnRequestIcon fill={"white"} height={20} width={20}/>,
    cssdTechnicainSterilizationProcess:<SterilizationMasterIcon fill={"white"} height={20} width={20}/>,
    cssdSupervisorconfiguration:<CssdConfiguration fill={"white"} height={20} width={20}/>,
    chargesConfiguration:<ShiftRosterIcon fill={"white"} height={20} width={20}/>,
    cssdInstrumentSterilization:<InstrumentSterilizationIcon fill={"white"} height={20} width={20}/>,
    departmentRequest:<InventoryPlusIcon fill={"white"} height={20} width={20}/>,
    'retail-medicine':<RetailIcon fill={"white"} height={20} width={20}/>,
    categoryMaster:<CategoryMaster fill={"white"} height={20} width={20}/>,
    supplierMaster:<SupplierMasterIcon fill={"white"} height={20} width={20}/>,
    storeSetting:<StoreSetting fill={"white"} height={20} width={20}/>,
    productMaster:<Inventory fill={"white"} height={20} width={20}/>,
    purchaseOrder:<PurchaseOrder fill={"white"} height={20} width={20}/>,
    Backorder:<BackOrder fill={"white"} height={20} width={20}/>,
    GRN:<Grn fill={"white"} height={20} width={20}/>,
    equipmentRequests:<Equpmentrequest fill={"white"} height={20} width={20}/>,
    productReturn:<ProductReturn fill={"white"} height={20} width={20}/>,
    indent:<Indent fill={"white"} height={20} width={20}/>,
    ReportList:<Reports fill={"white"} height={20} width={20}/>,
    purchaseOrderManager:<PurchaseOrder fill={"white"} height={20} width={20}/>,
    IpdWardInchargeIpdToLabourRoom:<TransferToLabourRoom fill={"white"} height={20} width={20} />,
    'handover-storage': <HandoverIcon2 fill={"white"} height={20} width={20} />,
    'waste-generation-register':<NurseNotesIcon fill={"white"} height={20} width={20}/>,
    'handover-to-third-party': <BusIcon height={20} width={20} fill={"white"}  />,
    'waste-treatment' : <WasteTreatMentIon height={20} width={20} fill={"white"} />,
    'external-collection': <HospitalIcon height={20} width={20} fill={"white"} />,
    'bmw-reports': <ReportsIcon height={20} width={20} fill={"white"} />,
    'bmw':<BmwIcon height={20} width={20} fill={"white"} />
    } 


  const handleHomeNavigate = () => {
    toNavigateHome(loggedUser?.role_key, navigate);
  }

  const { t } = useTranslation();

  const [collapsed, setCollapsed] = useState(sideMenuProperty.sideNavCollapsed);

  const activeMenu = state.pathname.slice(1);
  const { hospitalDetails } = useAppSelector(state => state?.hospitaldetialsReducer)

  useEffect(() => {
    dispatch(setSidebarCollapsed(collapsed));
  }, [collapsed]);

  useEffect(() => {
    if (menuList && menuList.length > 0) {
      setMenuitems(menuhandle(relocateImmunizationAfterIpd(menuList)).flat());
    }
  }, [menuList, t]);


  const menuHandleItems = (menuList) => {
    return menuList?.items?.map((res) => {
      let menuName = res?.name;
      if (loggedUser?.employee_details?.is_hod == 1 &&  ['staff-attendance', 'staff-leaves'].includes(res?.name)) {
        menuName = res.name.replace('staff-', 'team-');
      }
      return getItem((res?.items?.length>0?(
        t(menuName)?.length > 16 ? (
          <Tooltip title={t(menuName)} placement="topLeft" overlayInnerStyle={{ borderRadius: "7px", boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px" }}>
            {t(menuName)}
          </Tooltip>
        ) : (
          t(menuName)
        )
      ) : (
        t(menuName)?.length > 16 ?
          (
            <Tooltip title={t(menuName)} placement="topLeft" overlayInnerStyle={{ borderRadius: "7px", boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px" }}>
              <Link to={"/" + res?.routerLink}>{t(menuName)}</Link>
            </Tooltip>
          ) : (
            <Link to={"/" + res?.routerLink}>{t(menuName)}</Link>
          )

      )), `${res?.key}`, <Icon component={() => menusIcons[res?.description]} />, res.items && res.items.length > 0 && menuHandleItems(res))
    })
  }

  const menuhandle = (menuList) => {
    if (menuList && menuList.length > 0) {
      return menuList?.map((data) => {
        return data?.items?.map((res) => {
          if (res.items.length > 0) {
            return getItem(
              t(res?.name)?.length > 16 ?(
                <Tooltip title={t(res?.name)} placement="topLeft" overlayInnerStyle={{borderRadius:"7px",boxShadow:"rgba(0, 0, 0, 0.24) 0px 3px 8px"}}>
                  {t(res?.name)}
                </Tooltip>
              ):(
                <Tooltip title={t(res?.name)} placement="topLeft" overlayInnerStyle={{borderRadius:"7px",boxShadow:"rgba(0, 0, 0, 0.24) 0px 3px 8px"}}>
                {t(res?.name)}
                </Tooltip>
              )
              , `${res?.key}`, <Icon component={() => menusIcons[res?.description]} />, res.items && res.items.length > 0 && menuHandleItems(res))
          } else {
            return getItem(
              t(res?.name)?.length > 16 ?(
                <Tooltip title={t(res?.name)} placement="topLeft" overlayInnerStyle={{borderRadius:"7px",boxShadow:"rgba(0, 0, 0, 0.24) 0px 3px 8px"}}>
                   <Link to={"/" + res?.routerLink}>
                   {t(res?.name)}
                   </Link>
                </Tooltip>
              ):(
                <Link to={"/" + res?.routerLink}>
                {t(res?.name)}
                </Link>
              )
            , `${res?.key}`, <Icon component={() => menusIcons[res?.description]} />)
          }
        });
      });
    }
  };


  useEffect(() => {
    const keys = []
    menuitems.map((ele: any) => {
      if (ele?.children) {
        ele?.children?.map((e: any) => {
          if (e?.children?.length > 0) {
            e?.children?.map((itm: any) => keys.push(itm?.key))
          }
          else {
            keys.push(e?.key)
          }
        })
      }
      else {
        keys.push(ele?.key)
      }
    });
    dispatch(setSideMenuItems(keys))
    dispatch(setSideBar(activeMenu));
    if (!activeMenu.includes("payment")) {
      dispatch(storePaymentDetails({}));
      dispatch(updateSelectedModule('Cash'));
    }
  }, [pathname , menuitems])


  const handleSelect = (ele:any) =>{
   
  }


  return (
    <>
      <ConfigProvider
        theme={{
          token: {
          },
          components: {
            Menu: {
              itemHoverBg: Color["--primary"],
              itemSelectedBg: Color["--selectedMenuSideBarColor"],
              itemSelectedColor: "#fff",
              itemActiveBg: Color["--ActiveMenuSideBarColor"],
              popupBg: Color["--primary"],
              itemBg: Color["--primary"],
              itemHoverColor:"#fff",
              itemColor: "#fff",
            }
          },
        }}
      >
        <Sider
          trigger={null}
          style={{ backgroundColor: "var(--primary)" }}
          breakpoint="lg"
          collapsible
          collapsedWidth={collapsed ? (screenWidth <= 900 ? 50 : 85) : 85}
          collapsed={collapsed}
          onCollapse={() => setCollapsed(!collapsed)}
          width={LAYOUT.sidebar.siderWidth}
        >
          <Row wrap={false} className={`lg:pt-2 ${collapsed?'pb-3':'pb-0'} lg:mb-[1px] [&>div]:w-[100%]`} align={"middle"} justify={"center"}>
            <Col>
              <span className="cursor-pointer block w-[100%]" onClick={handleHomeNavigate}>
                {collapsed ?
                  (hospitalDetails?.official_logo_small?.url || hospitalDetails?.official_logo_large?.url ?
                    <div className="sidebar-logo-collapsed"><img src={hospitalDetails?.official_logo_small?.url || hospitalDetails?.official_logo_large?.url} width={65} height={70} className="collapsed-logo" /></div> :
                    <span className="sidebar-collapsed-logo">
                      <ECareCollapsedLogoV1 height={70} width={65} />
                    </span>
                  ) :
                  (hospitalDetails?.official_logo_large?.url || hospitalDetails?.official_logo_small?.url ?
                    <div className="sidebar-expand-logo"><img src={hospitalDetails?.official_logo_large?.url ?? hospitalDetails?.official_logo_small?.url} className="w-[100%] expand-logo" /></div> :
                    <span className="sidebar-expand-logo">
                      {/* <ECareLogoV1 height={70} width={260} /> */}
                    </span>
                  )}
              </span>
            </Col>
          </Row>
          <div className="2xl:h-[84%] xl:h-[75%] lg:h-[77%] md:h-[70%] sm:h-[60%] xs:h-[50%] h-[85%] overflow-y-auto no-scrollbar sidebar">
              <Menu rootClassName="sidebar" theme="light" openKeys={sideMenuProperty?.openMenuKey} onSelect={handleSelect} onOpenChange={(ele)=>{dispatch(openMenuKey(ele))}} selectedKeys={[`${sideMenuProperty.selectedItem}`]} style={{ fontWeight: "400", padding: "0", margin: "0", border: "none", fontSize: "large" }} mode="inline" items={menuitems} onClick={() => ("")} />
          </div>
          <div
            onClick={() => setCollapsed(!collapsed)}
            className="absolute md:-right-[19px] lg:-right-[24px] -right-[17px] top-[43px] md:top-[30px] hover:text-white  btnCollaps cursor-pointer text-white">
            <div className="md:h-[30px] md:w-[32px] lg:h-[40px] lg:w-[40px] h-[30px] w-[30px]  bg-[#fff] shadow-lg rounded-md flex justify-center">
              <MenuOutlined className="md:text-[13px] lg:text-[20px]" style={{ color: collapsed ? "#141414" : "var(--primary)" }} />
            </div>
          </div>
        </Sider>
      </ConfigProvider>
    </>
  );
};
export default CollapableSidebar;