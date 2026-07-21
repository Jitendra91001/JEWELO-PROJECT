import React, { useRef, useState } from "react";
import { Col, Upload } from "antd";
import "./UploadModalWithCrop.css"
import ButtonFeild from "../Button/CustomButton";
import { Row } from "antd/lib";
import { useTheme } from "../../../contexts/Theme/Theme.context";
import { CameraIcon, UploadIcon } from "../Icons/icon";
import { useAppDispatch } from "../../../hooks/redux-hooks"
import ReactCrop, { centerCrop, convertToPixelCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { profileImageUpdateById } from "../../../redux/profile/thunk";
import { t } from "i18next";
import Webcam from "react-webcam";
import { toastError } from "../Notification/Toastify";
import LatestModal from "../Modal/LatestModal";
import Loader from "../Loader/Loader";

interface UploadModalWithCropProp {
  showUploadModal: any[];
  AcceptedFileTypes?: any[];
  profileUuid?: string;
  success?: boolean;
  setSuccess?: any;
  save?: any
}

const ASPECT_RATIO = 1;
const MIN_DIMENSION = 100;

const UploadModalWithCrop: React.FC<UploadModalWithCropProp> = ({ showUploadModal, AcceptedFileTypes, profileUuid, success, setSuccess, save }) => {

  const dispatch = useAppDispatch()
  const { Color } = useTheme();
  const imgRef = useRef(null);
  const previewCanvasRef = useRef(null);
  const [imgSrc, setImgSrc] = useState("");
  const [crop, setCrop] = useState<any>();
  const [error, setError] = useState("");
  const [_, setFileCheck] = useState("")
  const [profile, updateAvatar] = useState(null)
  const [spin, setSpin] = useState<boolean>(false)
  const [onSaveDisabled, setonSaveDisabled] = useState<boolean>(true)
  const [takePicture, setTakePicture] = useState<boolean>(false)
  const [captured, setCaptured] = useState<boolean>(false)
  const webcamRef = useRef(null);

  const videoConstraints = {
    width: 470,
    facingMode: "user"
  };
  
  const capturePhoto = React.useCallback(async () => {
    setImgSrc(webcamRef?.current.getScreenshot());
    setCaptured(true)
    setTakePicture(false)
    setonSaveDisabled(true)
  }, [webcamRef]);

  const setCanvasPreview = (
    image: any,
    canvas: any,
    crop: any
  ) => {
    const ctx = canvas.getContext("2d");

    const pixelRatio = window.devicePixelRatio;
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    canvas.width = Math.floor(crop.width * scaleX * pixelRatio);
    canvas.height = Math.floor(crop.height * scaleY * pixelRatio);

    ctx.scale(pixelRatio, pixelRatio);
    ctx.imageSmoothingQuality = "high";
    ctx.save();

    const cropX = crop.x * scaleX;
    const cropY = crop.y * scaleY;

    ctx.translate(-cropX, -cropY);
    ctx.drawImage(
      image,
      0,
      0,
      image.naturalWidth,
      image.naturalHeight,
      0,
      0,
      image.naturalWidth,
      image.naturalHeight
    );

    ctx.restore();
  };

  const onSelectFile = (e: any) => {
    const file = e?.file?.originFileObj;
    if (!file) return;
    setFileCheck(file)
    setonSaveDisabled(true)
    setCaptured(false)
    updateAvatar(null)
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      const imageElement = new Image();
      const imageUrl = reader.result?.toString() || "";
      imageElement.src = imageUrl;

      imageElement.addEventListener("load", (e: any) => {
        if (error) setError("");
        const naturalHeight = e.currentTarget?.naturalHeight;
        const naturalWidth = e.currentTarget?.naturalWidth;

        if (naturalWidth < MIN_DIMENSION || naturalHeight < MIN_DIMENSION) {
          setError("Image must be at least 150 x 150 pixels.");
          return setImgSrc("");
        }
      });
      setImgSrc(imageUrl);
    });
    reader.readAsDataURL(file);
  };


  const onImageLoad = (e: any) => {
    const { width, height } = e.currentTarget;
    const cropWidthInPercent = (MIN_DIMENSION / width) * 100;

    const crop = makeAspectCrop(
      {
        unit: "%",
        width: cropWidthInPercent,
      },
      ASPECT_RATIO,
      width,
      height
    );
    const centeredCrop = centerCrop(crop, width, height);
    setCrop(centeredCrop);
  };


  const beforeUpload = (file: any) => {
    return new Promise((resolve, reject) => {
      const fileExtension = file.name.split('.').pop().toLowerCase();
      const maxSizeInMB = 1;
      const fileSizeInMB = file?.size / (1024 * 1024);
      if (AcceptedFileTypes?.length > 0 && !AcceptedFileTypes.includes(fileExtension)) {
        reject(new toastError(t("unsupportedFileFormat")));
      } else if (fileSizeInMB <= maxSizeInMB) {
        resolve(file);
      } else {
        reject(new toastError(t("fileSizeMustBelessThanOneMB")));
      }
    });
  };


  const onSave = (() => {
    if (profile && profileUuid) {
      setSpin(true)
      dispatch(profileImageUpdateById({ id: profileUuid, file: profile }))
        .unwrap()
        .then((res) => {
          setSpin(false)
          setSuccess(true)
          setTakePicture(false)
          setImgSrc("")
          setFileCheck("")
          updateAvatar(null)
          setonSaveDisabled(true)
          setCaptured(false)
          showUploadModal[1](false)
        })
    } else {
      setSuccess(true)
      showUploadModal[1](false)
      save(profile)
    }
  })

  const onClose = () => {
    setTakePicture(false)
    setImgSrc("")
    setFileCheck("")
    updateAvatar(null)
    setonSaveDisabled(true)
    setCaptured(false)
    showUploadModal[1](false)
  }

  const onUserMedia = (e) => {

  };

  return (
    <>
      <LatestModal
        showModal={[showUploadModal[0], showUploadModal[1]]} footer="" style={{ zIndex: 3, marginTop: 50 }} title={t("uploadImage")} maskClose={false} onCancel={onClose}
        closable
        children={!success && (
          <Loader tip="Uploading" loading={spin}>
            {((imgSrc == "" || profile != null) && !takePicture) && (
              <div className="uploadModalProfile">
                <Upload
                  name="avatar"
                  listType="picture-card"
                  className="avatar-uploader"
                  beforeUpload={beforeUpload}
                  onChange={onSelectFile}
                  showUploadList={false}
                >
                  {
                    profile ? <img src={`${profile}`} alt="" height="100%" width="100%" /> :
                      <div>
                        <UploadIcon height="150px" width="200px" /><br />
                        <span style={{ color: Color["--primary"] }}>Upload</span> or drop your files here
                      </div>
                  }
                </Upload>
              </div>
            )}
            {imgSrc && profile === null && !takePicture && (
              <div className="flex flex-col items-center">
                <ReactCrop
                  crop={crop}
                  onChange={(pixelCrop, percentCrop: any) => setCrop(percentCrop)}
                  circularCrop
                  keepSelection
                  aspect={ASPECT_RATIO}
                  minWidth={MIN_DIMENSION}
                >
                  <img
                    ref={imgRef}
                    src={imgSrc}
                    alt="Upload"
                    style={{ maxHeight: "70vh" }}
                    onLoad={onImageLoad}
                  />
                </ReactCrop>
                {crop && (
                  <canvas
                    ref={previewCanvasRef}
                    className="mt-4"
                    style={{
                      display: "none",
                      border: "1px solid black",
                      objectFit: "contain",
                      width: 150,
                      height: 150,
                    }}
                  />
                )}
              </div>
            )}
            {
              takePicture && (
                <div className="flex">
                  <Webcam
                    ref={webcamRef}
                    audio={false}
                    screenshotFormat="image/jpeg"
                    videoConstraints={videoConstraints}
                    mirrored={true}
                    imageSmoothing={true}
                    screenshotQuality={1}
                    onUserMedia={onUserMedia}
                  />
                </div>
              )
            }
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            <div style={{ display: (takePicture || captured) ? "none" : "block" }}>Accepted File Types: {AcceptedFileTypes?.join(", ")}</div>
            <Row wrap={false} style={{ marginTop: 15 }}>
              <Col flex="none">
                {
                  takePicture ? (
                    <Row wrap={false} className="gap-2">
                      <div className="flex rounded-md p-[5px] cursor-pointer pr-2 pl-2" style={{ background: Color["--primary"] }} onClick={capturePhoto}>
                        <CameraIcon fill={"white"} />
                        <span className="ml-2 text-white">Capture</span>
                      </div>
                      <div className="flex rounded-md p-1 cursor-pointer pr-2 pl-2" style={{ border: "1px solid black" }} onClick={() => { setTakePicture(false); setError(""); setCaptured(false); setImgSrc("") }}>
                        <span>{t("cancel")}</span>
                      </div>
                    </Row>
                  ) :
                    (
                      <div className="flex rounded-md p-1 cursor-pointer" style={{ border: "1px solid black" }} onClick={() => { setTakePicture(true); setImgSrc(""); updateAvatar(null); setonSaveDisabled(true) }}>
                        <CameraIcon />
                        <span className="ml-2">Take Picture</span>
                      </div>
                    )
                }
              </Col>
              <Col flex="auto"></Col>
              <Col flex="none">
                {onSaveDisabled && <ButtonFeild value={t("crop")} style={{ background: Color["--primary"], color: "white", borderRadius: "7px" }}
                  onClick={() => {
                    setCanvasPreview(

                      imgRef.current,
                      previewCanvasRef.current,
                      convertToPixelCrop(
                        crop,
                        imgRef.current?.width,
                        imgRef.current?.height
                      )
                    );
                    setonSaveDisabled(false);
                    const dataUrl = previewCanvasRef.current?.toDataURL();
                    updateAvatar(dataUrl);
                  }}
                  disabled={imgSrc == ""}
                />}
                {!onSaveDisabled && <ButtonFeild value={t("save")} style={{ background: Color["--primary"], color: "white", borderRadius: "7px" }} onClick={onSave} disabled={profile == ""} />}
              </Col>
            </Row>
          </Loader>
        )}
      />
    </>
  )
}

export default UploadModalWithCrop
