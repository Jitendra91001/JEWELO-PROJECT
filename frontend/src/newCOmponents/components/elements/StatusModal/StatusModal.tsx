import {  Typography } from "antd";
import React, { useEffect,  useState } from "react";
import CustomModal from "../Modal/CustomModal";
import { useTheme } from "../../../contexts/Theme/Theme.context";
import { toastTimer } from "../../../helpers/commonExports";
import "./StatusModal.css";
import successImg from "../../../assets/success.png";
import warningImg from "../../../assets/alert.png"

interface StatusModel {
  status?: string;
  strongMessage?: string;
  message?: string;
}

const StatusModal: React.FC<StatusModel> = ({
  status,
  message,
  strongMessage,
}) => {
  const [percent, setPercent] = useState<number>(100);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(true);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setPercent((prevValue) => prevValue - 1);
    }, 40);

    setTimeout(() => {
      clearInterval(intervalId);
      setPercent(100);
      setIsModalOpen(false);
    }, toastTimer);

    return () => clearInterval(intervalId);
  }, []);

  setTimeout(() => {
    setIsModalOpen(false);
  }, toastTimer);

  const { Color } = useTheme();

  const content = (
    <>
      <div
        className={status === "rescheduleSuccess" ? "h-[200px] w-[200px] rounded-full m-auto mt-11 "  :"h-[100px] w-[100px] rounded-full m-auto mt-11"}
        style={{
          boxShadow: "rgb(146 146 146 / 50%) 0px 3px 11px 2px",
          backgroundColor: Color["--whiteBlack"],
        }} 
      >
        <img
          height={status === "rescheduleSuccess" ? 120 : 50}
          width={status === "rescheduleSuccess" ? 120 : 50}
          className="mt-6 ml-6"
          style={status === "rescheduleSuccess" ? { position: "absolute",top:"90px",right: "235px"} :{}}
          src={
            status === "success"
              ? successImg
              : status === "error"
              ? "../../../error.png"
              : status === "warning"
              ? warningImg
              : status === "done"
              ? "../../../done.png"
              : status === "info"
              ? "../../../info.png"
              : status === "rescheduleSuccess"
              ? "../../../resheduleStatus.png"
              : ""
          }

        />
      </div>
      <Typography.Text
        className={`flex justify-center mt-7 text-3xl pb-2 ${
          status === "success"
            ? "text-[green]"
            : status === "error"
            ? "text-[red]"
            : status === "warning"
            ? "text-[#FFCC00]"
            : status === "info"
            ? "text-blue-600"
            : status === "done"
            ? "text-[black]"
            : ""
        }`}
        strong
      >
        {strongMessage ??
          (status === "success"
            ? "Success!"
            : status === "error"
            ? "Error!"
            : status === "warning"
            ? "Warning!"
            : status === "done"
            ? "Done!"
            : status === "info"
            ? "Info!"
            : "")}
      </Typography.Text>
      <Typography.Text className="flex justify-center text-base mt-3 w-[60%] m-auto text-center leading-5"
        style={status === "rescheduleSuccess" ? { fontSize: "25px", lineHeight: 1.3, fontWeight: 500 } : {}}>
        {message ??
          (status === "success"
            ? "Successfull"
            : status === "error"
            ? "A Problem Occurred"
            : status === "warning"
            ? "Attention Please"
            : status === "done"
            ? "Successfull"
            : status === "info"
            ? "Information"
            : status === "rescheduleSuccess"
            ? "Rescheduled successfully"
            : "")}
      </Typography.Text>

      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-200 absolute bottom-0 left-0 customProgress">
        <div
          className={`${
            status === "success"
              ? "bg-green-600"
              : status === "error"
              ? "bg-red-500"
              : status === "warning"
              ? "bg-yellow-500"
              : "bg-blue-600"
          } h-2.5 rounded-full`}
          style={{ width: `${percent}%` }}
        ></div>
      </div>
    </>
  );


  return (
    <>
      <CustomModal
        width={600}
        style={{
          backgroundColor: "#f0fffc",
          borderRadius: "14px",
          height: "398px",
          width: "548px",
          border: `1px solid ${Color['--secondary']}`,
          position: "relative",
          overflow: "hidden",
        }}
        ismodalStyle={""}
        children={content}
        centered
        showModal={[isModalOpen, setIsModalOpen]}
        footer={null}
      />
    </>
  );
};

export default StatusModal;
