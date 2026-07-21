
import React, { useEffect, useRef, useState } from "react";
import { useSpeechRecognition } from "react-speech-kit";
import { AudioMutedOutlined, AudioOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { toastWarning } from "../Notification/Toastify";
import { useTranslation } from "react-i18next";

interface Props {
  updateValue?: any;
  children?: any;
  disabled ? : boolean ;
}

const CustomSpeechRecognizer = ({ children, updateValue , disabled = false }: Props) => {

  const [lang] = useState("en-US");
  const [blocked, setBlocked] = useState(false);
  const { t } = useTranslation();
  const inactivityTimeout = useRef<any>(null);

  const resetInactivityTimeout = () => {

    if (inactivityTimeout.current) {
      clearTimeout(inactivityTimeout.current);
    }
    inactivityTimeout.current = setTimeout(() => {
      stop();
    }, 10000);
  };

  useEffect(() => {
    return () => {
      if (inactivityTimeout.current) {
        clearTimeout(inactivityTimeout.current);
      }
    };
  }, []);

  const onEnd = () => {

  };
  function capitalizeFirstLetter(string: string) {
    return string.charAt(1).toUpperCase() + string.slice(2);
  }
  let newVal = "";

  const onResult = (result) => {
    newVal = newVal + " " + result;
    const res = capitalizeFirstLetter(newVal)
    updateValue(res);
    resetInactivityTimeout();
  };

  const onError = (event) => {
    if (event.error === "not-allowed") {
      setBlocked(true);
    }
  };

  const { listen, listening, stop, supported } = useSpeechRecognition({
    onResult,
    onEnd,
    onError,
  });

  const toggle = () => {
    if (supported) {
      if (blocked) {
        toastWarning(t("microphoneIsBlockedForThisSiteOnYourBrowser"));
      } else {
        if (listening) {
          stop();
        } else {
          setBlocked(false);
          listen({ interimResults: false, lang });
          resetInactivityTimeout(); 
        }
      }
    } else {
      toastWarning(t("YourBrowserIsNotSupportingMicrophone"));
    }
  };

  return (
    <div className="flex relative justify-center">
      <div className="w-full flex gap-[18px] items-center" onBlur={stop}>
        {children}
        <div className="relative min-w-[65px] flex justify-center">
          <Button
            shape="circle"
            disabled={disabled}
            onClick={toggle}
            className="flex justify-center items-center mx-2 rounded-full border-2 border-gray-200 border-solid outline-none"
            icon={!listening ? <AudioMutedOutlined /> : <AudioOutlined />}
          />
          {listening ? <div className="absolute text-[12px] font-medium !text-nowrap" style={{
            top: "32px",
            right: "-5px"
          }}>Listening...</div> : ""}
        </div>
      </div>
    </div>
  );
};

export default CustomSpeechRecognizer;
