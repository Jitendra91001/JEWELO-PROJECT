import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction'
import "./calendar.css"
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import allLocales from '@fullcalendar/core/locales-all'
import { useAppSelector, useAppDispatch } from '../../../hooks/redux-hooks';
import { getPatientAppointmentByMonth } from "../../../redux";
import { toastError } from '../Notification/Toastify';
import {Typography } from 'antd';
import Loader from '../Loader/Loader';
import dayjs from 'dayjs';

type opdCalenderProps = {
  SetCalenderClick?: boolean,
  DateProp?: any;
  list?: any;
  height?: number;
  CalenderClick?:any;
  calenderParams?:any;
}

const CustomCalendar = (props: opdCalenderProps) => {
  const dispatch = useAppDispatch();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loader, setLoader] = useState<boolean>(false);

  const {sideNavCollapsed}=useAppSelector((s)=>s.menuItemsReducer);
  const [selectedDate,setSelectedDate]=useState<undefined|string>();
  const [initialrender,setInitialRender]=useState(true);


  useEffect(()=>{
    if(initialrender){
      setInitialRender(false);
      return;
    }
    if(selectedDate){
      fetchMonthlyAppointments(selectedDate);
    }
  }, [sideNavCollapsed]);

  const { t, i18n } = useTranslation();
  const language = i18n?.language;

  const fetchMonthlyAppointments = (date: string) => {    
    setLoader(true);
    let params={
      or: [],
      where: {
        appointment_date: { l: date },
      },
      tableKey: "hms-appointmen"
    };    
    params={...params,where:{...params?.where,...props.calenderParams?.where}};
    dispatch(
      getPatientAppointmentByMonth(params)).unwrap().then((res) => {
        setAppointments(res?.data);
        setLoader(false);
      }
      ).catch((err) => {
        toastError(err.message);
        setLoader(false);
      });
  };

  useEffect(() => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const date = `${year}-${month}`;
    fetchMonthlyAppointments(date);
  }, [language]);

  const handleDatesSet = (info: any) => {
    const dateString: string = info.view?.currentStart;
    const date=new Date(dateString)
    const year:number=date.getFullYear();
    const month:number=date.getMonth()+1;
    const formattedDate: string = `${year}-${String(month).padStart(2, "0")}`;
    setSelectedDate(formattedDate);
    fetchMonthlyAppointments(formattedDate);
  };

  const eventsData = appointments?.map((appointment) => ({
    title: t("viewAppointment"),
    date: appointment?.appointment_date,
    appointment_count: appointment?.appointment_count
  }));

  return (
    <Loader loading={loader}>
      <div className="w-full customCalendar">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          firstDay={1}
          fixedWeekCount={false}
          selectable={true}
          height={700}
          events={eventsData}
          headerToolbar={{
            left: "appointment",
            center: "",
            right: "prev,title,next",
          }}
          customButtons={{
            appointment: {
              text: t("appointment"),
              click: () => { },
            }
          }}
          datesSet={handleDatesSet}
          locale={language === "hn" ? "hi" : language}
          locales={allLocales}
          titleFormat={(date : any) => dayjs(date?.date?.marker).format("MMM-YY")}
          eventContent={(eventInfo) => {
            const app_count = eventInfo?.event?._def?.extendedProps?.appointment_count
            return (
              <>
                <Typography.Text className='hidden mb-[5px] text-[gray] cursor-text xl:block appointText'> {app_count} {t("appointment")}</Typography.Text>
                <Typography.Text className='hidden mb-[5px] cursor-text xl:hidden sm:block sm:my-[11px] xs:block appointText '> {app_count} A</Typography.Text>

                <span onClick={() => { props?.SetCalenderClick && props?.SetCalenderClick(true); props?.SetDateProp && props?.SetDateProp(eventInfo?.event?.startStr); }} className="p-2 customeCalendar hidden xl:block" style={{
                  backgroundColor: 'var(--primary)', border: 'none', borderRadius: "5px"
                }}> {app_count==1 ? t("viewAppointment"):t("PviewAppointments")} </span>
                <span onClick={() => { props?.SetCalenderClick && props?.SetCalenderClick(true); props?.SetDateProp && props?.SetDateProp(eventInfo?.event?.startStr); }} className="p-2 customeCalendar xl:hidden" style={{
                  backgroundColor: 'var(--primary)', border: 'none', borderRadius: "5px"
                }}>  {t("vA")}</span>
              </>
            );
          }}
        />
      </div>
    </Loader>
  );
};

export default CustomCalendar;
