import React, { useEffect, useState } from "react";
import {
  Dropdown,
  Input,
  MenuProps,
  Popover,
  Typography,
  Avatar,
  Col,
  Row,
  Badge,
  Spin,
} from "antd";
import { BackButton, NewBellIcon } from "../../components/elements/Icons/icon";
import { Header } from "antd/es/layout/layout";
import AppNavbar from "./AppNavbar";
import {
  PoweroffOutlined,
  SolutionOutlined,
  TranslationOutlined,
  SearchOutlined,
  LockOutlined,
} from "@ant-design/icons";
import { useTheme } from "../../contexts/Theme/Theme.context";
import { useAppDispatch, useAppSelector } from "../../hooks/redux-hooks";
import { logout } from "../../redux/auth/slice";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ProfileModal from "../../pages/Common/profile/profileModal";
import Profile from "../../pages/Common/profile/profile";
import {
  clearSidebar,
  onBackClick,
  onNavBarChange,
} from "../../redux/menuItems/slice";
import OtpModal from "../../pages/Common/otp/Otp.Modal";
import DoctorResetPassword from "../../pages/Auth/DoctorResetPassword/DoctorResetPassword";
import { forgotPassword, getUserLogout } from "../../redux/auth/thunk";
import NotificationPop from "../elements/NotificationPop/NotificationPop";
import { toastError, toastSuccess } from "../elements/Notification/Toastify";
import headerDropDown from "../../assets/headerdropdown.png";
import {
  getNotificationsList,
  notificationAction,
  updateNotificationStatus,
} from "../../redux/notification/thunk";
import { useSelector } from "react-redux";
import LatestModal from "../elements/Modal/LatestModal";
import { storePaymentDetails } from "../../redux/payment/slice";
import { clearProfileImage } from "../../redux/profile/slice";
import { downloadImageById } from "../../redux/profile/thunk";
import { punchOut } from "../../redux/hr/thunk";
import useWindowWidth from "../../hooks/useScreenWidth";
import { persistor } from "../../redux/store";

type HeaderProp = {
  placeHolder?: string;
  navHeader?: boolean;
  searchHeader?: boolean;
  value?: string;
  onChange?: any;
  inputErrorStatus?: string | undefined;
  searchComponent?: React.ReactNode;
  moduleName?: string;
  clearSearchInput?: boolean;
  liftState?: any;
};

const AppHeader: React.FC<HeaderProp> = ({
  placeHolder,
  searchHeader,
  inputErrorStatus,
  onChange,
  clearSearchInput,
  navHeader,
  moduleName,
  liftState,
}) => {
  const { Color } = useTheme();
  const navigate = useNavigate();
  const { i18n, t } = useTranslation();
  const dispatch = useAppDispatch();
  const loggedUser = useAppSelector((state) => state?.authReducer)?.user?.users;
 
  const { modelViewAction, loader, notificationAlertList } = useAppSelector(
    (s: any) => s.notificationReducer
  );
  const sideMenuProperty = useSelector((state: any) => state?.menuItemsReducer);
  const uuid = loggedUser?.employee_details?.uuid;
  const empId = loggedUser?.employee_details?.id;

  const [reset, setReset] = useState(false);
  const [showDot, setShowDot] = useState<boolean>(false);
  const [resetModal, setResetModal] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [isReadOnly, setIsReadOnly] = useState<boolean>(true);
  const [searchInput, setSearchInput] = useState<string>("");
  const [showLanguages, setShowLanguages] = useState<boolean>(false);
  const [showProfileDetails, setShowProfileDetails] = useState(false);
  const screenWidth = useWindowWidth();
  const [loading, setLoading] = useState(false);


  function hardRefresh() {
    window.location.reload(); 
    setTimeout(() => {
      window.location.replace(window.location.href); 
    }, 50);
  }
  
  const logoutUser = () => {
    setLoading(true); 
  
    const secretKey = sessionStorage?.getItem("secret_key");
  
    if (!secretKey) {
      dispatch(logout());
      // CERT-In F-11 — purge every persisted slice so leftover menu /
      // payment / discharge state doesn't survive logout in localStorage.
      persistor.purge();
      sessionStorage.clear();
      setTimeout(() => {
        dispatch(clearProfileImage());
        hardRefresh();
        navigate("/login");
        setLoading(false);
      }, 200);
      return;
    }

    dispatch(punchOut({ employee_id: empId }))
      .unwrap()
      .then(() => {
        dispatch(clearSidebar());
        sessionStorage.removeItem("secret_key");

        dispatch(getUserLogout())
          .unwrap()
          .then(() => {
            dispatch(logout());
            // CERT-In F-11 — see comment in the early-return branch above.
            persistor.purge();
            sessionStorage.clear();
            setTimeout(() => {
              dispatch(clearProfileImage());
              navigate("/login");
              setLoading(false);
            }, 200);
          })
          .catch((err) => {
            toastError(err);
            setLoading(false); 
          });
      })
      .catch((err) => {
        toastError(err);
        setLoading(false); 
      });
  };
  

  useEffect(() => {
    if (liftState) {
      liftState(setSearchInput);
    }
  }, []);

  useEffect(() => {
    setSearchInput("");
  }, [clearSearchInput]);

  const onclickReset = () => {
    setReset(true);
  };
  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
    setShowLanguages(false);
    window.location.reload();
  };
  
  const handleShowLanguages = (e: React.MouseEvent) => {
    e?.stopPropagation();
    setShowLanguages(!showLanguages);
  };
  const handleOnChange = (e: any) => {
    onChange(e);
    setSearchInput(e.target.value);
  };

  useEffect(() => {
    setIsReadOnly(true);
  }, [showProfile]);
  useEffect(() => {
    if (reset === true) {
      dispatch(forgotPassword({ username: loggedUser?.email, "is_change": true }));
    }
  }, [reset]);
  useEffect(() => {
    const rows = notificationAlertList?.rows || [];
    if (rows.length > 0) {
      const newArray: any[] = [...rows];
      const hasUnread = newArray.some((item) => item.is_read === "0");
      setShowDot(hasUnread);
    } else {
      setShowDot(false);
    }
  }, [notificationAlertList]);

  const items: MenuProps["items"] = [
    {
      key: "1",
      label: (
        <Typography.Text style={{ display: "block" }}>
          {t("profile")}
        </Typography.Text>
      ),
      icon: <SolutionOutlined />,
      onClick: () => setShowProfile(true),
    },
    {
      key: "2",
      label: (
        <div className="relative" onClick={() => setReset(true)}>
          <Typography.Text style={{ display: "block" }}>
            {t("changePassword")}
          </Typography.Text>
        </div>
      ),
      icon: <LockOutlined />,
      onClick: () => setReset(true),
    },
    {
      key: "3",
      label: (
        <div key="3" className="relative">
          <div
            onClick={handleShowLanguages}
            style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
          >
            <TranslationOutlined />
            <Typography.Text style={{ marginLeft: 8 }}>
              {t("changeLanguage")}
            </Typography.Text>
          </div>
        </div>
      ),
      children: [
        {
          key: "1-1",
          label: (
            <div
              onMouseOver={() => setShowLanguages(true)}
              onMouseLeave={() => setShowLanguages(false)}
            >
              <span
                className="my-1 w-full text-sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleLanguageChange("hn");
                }}
              >
                {t("hindi")}
              </span>
            </div>
          ),
        },
        {
          key: "1-2",
          label: (
            <div
              onMouseOver={() => setShowLanguages(true)}
              onMouseLeave={() => setShowLanguages(false)}
            >
              <span
                className="my-1 w-full text-sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleLanguageChange("en");
                }}
              >
                {t("english")}
              </span>
            </div>
          ),
        },
      ],
    },
    {
      key: "4",
      label: (
        <Typography.Text style={{ display: "block" }}>
          {loading ? "Signing out..." : t("signOut")}
        </Typography.Text>
      ),
      icon: loading ? (
        <Spin size="small" />
      ) : (
        <PoweroffOutlined />
      ),
      disabled: loading,
      onClick: () => !loading && logoutUser(),
    },
    
  ];

  const isAuthenticated = useAppSelector((s) => s.authReducer.isLogedIn);

  useEffect(() => {
    setOpen(false);
  }, [modelViewAction]);

  const [open, setOpen] = useState(false);

  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen && !loader) {
      dispatch(getNotificationsList({sort: { created_on: -1 }}));
      dispatch(notificationAction(null));
    }
    setOpen(newOpen);
  };

  const fetchHeaderData = () => {
    if (isAuthenticated) {
      dispatch(getNotificationsList({sort: { created_on: -1 }}));
      dispatch(notificationAction(null));
    }
  };

  useEffect(() => {
    fetchHeaderData();
  }, []);

  const backClick = (e) => {
    dispatch(onBackClick({ nav: navigate }));
    if (
      sideMenuProperty.previousMenuItem[
        sideMenuProperty.previousMenuItem.length - 1
      ].subkeys.length > 0
    ) {
      if (
        sideMenuProperty.previousMenuItem[
          sideMenuProperty.previousMenuItem.length - 1
        ].subkeys.length > 1
      ) {
        dispatch(
          onNavBarChange(
            sideMenuProperty.previousMenuItem[
              sideMenuProperty.previousMenuItem.length - 1
            ].subkeys[
              sideMenuProperty.previousMenuItem[
                sideMenuProperty.previousMenuItem.length - 1
              ].subkeys.length - 2
            ].split("/")[2]
          )
        );
      } else {
        dispatch(
          onNavBarChange(
            sideMenuProperty.previousMenuItem[
              sideMenuProperty.previousMenuItem.length - 1
            ].subkeys[
              sideMenuProperty.previousMenuItem[
                sideMenuProperty.previousMenuItem.length - 1
              ].subkeys.length - 1
            ].split("/")[2]
          )
        );
      }
    }
    dispatch(storePaymentDetails({}));
  };

  const handleMarkallRead = () => {
    if (notificationAlertList?.markAllRead?.length > 0) {
      const payload = {
        notificationIds: [...(notificationAlertList?.markAllRead || [])],
        readAll: true,
      };
      dispatch(updateNotificationStatus(payload))
        .unwrap()
        .then((res) => {
          if (res?.status == "success") {
            toastSuccess(res?.message);
            dispatch(getNotificationsList(null));
          }
        });
    }
  };

  const [downloadImage, setDownloadImage] = useState<string>("");

  useEffect(() => {
    if (uuid) {
      dispatch(downloadImageById(uuid))
        .unwrap()
        .then((resp) => {
          if (resp.status == "success") {
            setDownloadImage(resp?.data);
          }
        });
    }
  }, [uuid]);

  return (
    <>
      <Header
        style={{
          padding: 0,
          zIndex: 10,
          position: "sticky",
          top: 0,
          backgroundColor: "#fff",
          borderBottom: "0.1px solid #b8b8b8",
        }}
      >
        <Row wrap={false} align={"middle"} className="min-h-[60px]">
          <Col flex="auto">
            {searchHeader && (
              <div className="xl:w-[50%] lg:w-[95%] md:w-[95%] sm:w-[100%] xs:w-[100%] w-[100%] px-3 md:px-8 searchicon">
                <Input
                  onChange={handleOnChange}
                  className="md:h-[28px] lg:h-[32px]"
                  placeholder={placeHolder}
                  status={inputErrorStatus != "" ? inputErrorStatus : ""}
                  value={searchInput}
                  style={{
                    borderRadius: "70px",
                    boxShadow: Color["--boxShadow2"],
                    borderColor: !inputErrorStatus && "white",
                    width: "100%",
                  }}
                  prefix={
                    <SearchOutlined
                      style={{
                        color: Color["--primary"],
                        margin: "0 10px",
                      }}
                      className="md:text-[19px] lg:text-[22px]"
                    />
                  }
                  allowClear
                />
              </div>
            )}
            {navHeader && <AppNavbar moduleName={moduleName} />}
          </Col>
          <Col
            className="flex relative items-center cursor-pointer"
            onClick={backClick}
          >
            <div className="px-2">
              {(sideMenuProperty?.previousMenuItem?.length > 1 ||
                sideMenuProperty?.previousMenuItem[0]?.subkeys?.length > 0) && (
                <div>
                  <BackButton
                    fill={"var(--primary)"}
                    width={screenWidth < 900 ? "20px" : "30px"}
                    height={screenWidth < 900 ? "25px" : "30px"}
                  />
                </div>
              )}
              {(sideMenuProperty?.previousMenuItem?.length > 1 ||
                sideMenuProperty?.previousMenuItem[0]?.subkeys?.length > 0) && (
                <h6 className="absolute top-[12px]  text-[--primary]">BACK</h6>
              )}
            </div>
          </Col>
          <Col>
            <Popover
              trigger="click"
              placement="bottomLeft"
              overlayStyle={{ top: "65px" }}
              title={
                <>
                  <Row justify={"space-between"}>
                    <Col>
                      <Typography.Text strong className="ml-2 mt-2 text-[18px]">
                        {t("notification")}
                      </Typography.Text>
                      <Typography.Text
                        style={{ color: showDot ? Color["--primary"] : "grey" }}
                        className={`ml-4 mt-2 text-sm font-[400] ${
                          showDot
                            ? "underline cursor-pointer"
                            : "underline cursor-not-allowed"
                        }`}
                        onClick={showDot ? handleMarkallRead : undefined}
                      >
                        {t("Mark All Read")}
                      </Typography.Text>
                    </Col>
                  </Row>
                  <NotificationPop />
                </>
              }

              overlayInnerStyle={{ padding: "10px", borderRadius: "10px" }}
              open={open}
              onOpenChange={handleOpenChange}
              className="px-2"
            >
              <div className="flex item-start">
                <Badge dot={showDot}>
                  {/* <Avatar src={<img  src={<newBellIcon/>} alt="avatar" />} style={{ height: "30px", width: "30px" }} onClick={(e) => handlenotifcation(e)} className="cursor-pointer" /> */}
                  <div className="cursor-pointer">
                    <NewBellIcon
                      width={screenWidth < 900 ? "25px" : "30px"}
                      height={screenWidth < 900 ? "25px" : "30px"}
                      fill={"none"}
                    />
                  </div>
                </Badge>
              </div>
            </Popover>
          </Col>
          <Col>
            <div className="px-1 uppercase md:px-3">
              <Avatar
                style={{
                  backgroundColor: Color["--primary"],
                  color: Color["--white"],
                }}
                size={screenWidth < 900 ? "default" : "large"}
                src={downloadImage}
              >
                {downloadImage
                  ? downloadImage
                  : loggedUser?.employee_details?.first_nm?.[0]}
              </Avatar>
            </div>
          </Col>
          <Col className="AppheaderPopOver">
            <div className="px-[0px] md:px-1">
              <Popover
                content={
                  <ProfileModal
                    show={showProfileDetails}
                    setShow={setShowProfileDetails}
                  />
                }
                trigger="click"
                placement="bottomLeft"
                open={showProfileDetails}
                overlayInnerStyle={{ padding: "0px", borderRadius: "10px" }}
                overlayStyle={{ top: "65px" }}
              >
                <span
                  className="grid grid-rows-1 text-center text-[11px] md:text-[12px] lg:text-[14px] uppercase text-nowrap"
                  style={{ lineHeight: 1.2, color: "#7E7E7E" }}
                >
                  {loggedUser?.employee_details?.first_nm}
                  <span className="text-left capitalize upper">
                    {loggedUser?.role_key === "ipd-nurse"
                      ? `${loggedUser?.rolename}/${loggedUser?.employee_details?.dept_name}`
                      : loggedUser?.rolename}
                  </span>
                </span>
              </Popover>
            </div>
          </Col>
          <Col flex="none">
            <div className="md:px-[15px] px-1">
              <Dropdown
                trigger={"click"}
                overlayStyle={{ top: "65px" }}
                menu={{ items }}
              >
                <Avatar
                  src={<img src={headerDropDown} alt="avatar" />}
                  style={{ height: "18px", width: "18px" }}
                  className="cursor-pointer"
                />
              </Dropdown>
            </div>
          </Col>
        </Row>
      </Header>
      {showProfile && (
        <LatestModal
          showModal={[showProfile, setShowProfile]}
          closable
          footer=""
          width={1100}
          children={
            <Profile
              isReadOnly={isReadOnly}
              setIsReadOnly={setIsReadOnly}
              loggedUserData={loggedUser}
            />
          }
        />
      )}
      {reset && (
        <OtpModal
          open={reset}
          setOpen={setReset}
          email={loggedUser?.email}
          setResetModal={setResetModal}
          otpModalCall="profile"
          onFinish={onclickReset}
          setResetPage={false}
        />
      )}
      {resetModal && (
        <LatestModal
          showModal={[resetModal, setResetModal]}
          footer={""}
          width={410}
          centered
        >
          <DoctorResetPassword />
        </LatestModal>
      )}
    </>
  );
};
export default AppHeader;
