import React from "react";
import Webcam from "react-webcam";
import cameraIcon from '../../../assets/cameraIcon.svg'
import { t } from "i18next";
import ButtonFeild from "../Button/CustomButton";

const videoConstraints = {
    width: 500,
    height: 300,
    facingMode: "user"
};

    const WebCampCapture = ({onClick , cancel , webcamRef}) =>{

    return (
        <>
            <Webcam
                audio={false}
                height={300}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                width={500}
                videoConstraints={videoConstraints}
            />
            <div>
                <button className="border-none cursor-pointer bg-white" onClick={onClick}><img src={cameraIcon} /></button>
                <ButtonFeild onClick={cancel} type="default" value={t("cancel")} />
            </div>
        </>
    );
};

export default WebCampCapture