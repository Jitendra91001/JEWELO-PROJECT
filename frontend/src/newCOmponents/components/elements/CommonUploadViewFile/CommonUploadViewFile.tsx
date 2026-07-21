import React, { useEffect, useRef, useState } from "react";
import "./CommonUploadViewFile.css";
import "tailwindcss/tailwind.css";
import uploadImagebg from "../../../assets/uploadImagebg.svg";
import uploadImageIcon from "../../../assets/uploadImageIcon.svg";
import WebCampCapture from "./webCamCapture";
import cameraIcon from "../../../assets/cameraIcon.svg";
import deleteIcon from "../../../assets/deleteIcon.svg";
import LatestModal from "../Modal/LatestModal";
import { t } from "i18next";
import { useAppDispatch } from "../../../hooks/redux-hooks";
import { toastError, toastSuccess } from "../Notification/Toastify";

const CommonUploadViewFile = ({
  uuid,
  getEmployeeProfile,
  uploadEmployeeProfile,
  updateCurrentEmployeeUuid,
  updateCurrentFile,
  currentEmployeeUuid,
  selectedFile,
  removeProfileImage,
} : any) => {
  const [image, setImage] = useState({ preview: "", raw: "" });
  const [dragOver, setDragOver] = useState(false);
  const [openCamera, setOpenCamera] = useState(false);
  const [modalSI, setModalSI] = useState(false);
  const dispatch = useAppDispatch();

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileUpload(file, uuid);
    }
  };

  const handleChange = (e) => {
    if (e.target.files.length > 0) {
      const file = e.target.files[0];
      dispatch(updateCurrentFile(file));
      handleFileUpload(file, uuid);
      e.target.value = "";
    }
    e.target.value = "";
  };

  function base64ToImageFile(base64String : any) {
    const mimeType = base64String.match(/data:(.*?);base64/)[1];
    const byteCharacters = atob(base64String.split(",")[1]);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: mimeType });
    const file = new File([blob], "profile", { type: mimeType });
    return file;
  }

  const handleFileUpload = (file, uuid) => {
    if (file?.size) {
      if (file?.size > 10 * 1024 * 1024) {
        toastError("File size exceeds 10MB. Please choose a smaller file.");
        return;
      }
      if (!file.type?.match(/image\/(jpeg|png|webp)/)) {
        toastError(
          "Unsupported file type. Please upload JPEG, PNG, or WebP image."
        );
        return;
      }

      setImage({
        preview: URL.createObjectURL(file),
        raw: file,
      });

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        if (uuid) {
          const data = { uuid: uuid, data: { file: reader?.result } };
          dispatch(uploadEmployeeProfile(data))
            .unwrap()
            .then((res) => {
              getEmployeeProfileImage(uuid);
              dispatch(updateCurrentFile({}));
              toastSuccess(res?.message);
            })
            .catch((err) => {
              console.log(err, "my error");
              toastError(err?.message);
            });
        }
      };
      dispatch(updateCurrentEmployeeUuid(""));
    }
  };

  const getEmployeeProfileImage = (uuid) => {
    if (uuid) {
      dispatch(getEmployeeProfile(uuid))
        .unwrap()
        .then((res) => {
          setImage({ preview: res?.data, raw: "" });
        });
    }
  };

  useEffect(() => {
    if (uuid) {
      getEmployeeProfileImage(uuid);
    }
  }, [uuid]);

  const handleRemoveImage = async () => {
    const result = await removeProfileImage();
    if (result) {
      setImage({ preview: "", raw: "" });
    }
  };

  const openWebCamp = () => {
    setModalSI(true);
    setOpenCamera(true);
  };

  const webcamRef = useRef(null);

  const capture = React.useCallback(async () => {
    const imageSrc = webcamRef.current.getScreenshot();
    if (imageSrc) {
      setImage({
        preview: imageSrc,
        raw: imageSrc,
      });
      const file = await base64ToImageFile(imageSrc);
      dispatch(updateCurrentFile(file));
      if (uuid) {
        handleFileUpload(file, uuid);
      }
    }
    setOpenCamera(false);
    setModalSI(false);
  }, [webcamRef]);

  const closeModal = () => {
    setOpenCamera(false);
    setModalSI(false);
  };

  useEffect(() => {
    if (currentEmployeeUuid) {
      handleFileUpload(selectedFile, currentEmployeeUuid);
    }
  }, [currentEmployeeUuid]);

  return (
    <div className="flex flex-col items-center">
      <div className="border-[1px] border-dashed border-[#8E8E8E]  rounded-md w-[308px] xl:w-full lg:w-full h-[355px] overflow-hidden p-2">
        <div
          className={`relative flex justify-center items-center h-full overflow-hidden ${
            dragOver ? "bg-gray-300" : ""
          }`}
          onDragOver={handleDragOver}
          onDragEnter={handleDragOver}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
        >
          <label
            htmlFor="upload-button"
            className="block w-0  rounded-lg bg-[#F5F5F5] cursor-pointer"
          >
            {!image.preview && (
              <div className="flex absolute inset-0 justify-center">
                <div className="relative">
                  <img src={uploadImagebg} height={"300px"} className="mt-4" />
                  <div className="flex absolute inset-0 top-16 justify-center">
                    <div>
                      <div className="flex justify-center">
                        <img src={uploadImageIcon} alt="Upload Icon" />
                      </div>
                      <h5 className="mt-1 text-xs  text-center text-[#172B4D]">
                        {t("JPGPNG")}
                      </h5>
                      <h5 className="my-3 text-center text-base text-[#172B4D]">
                        {t("dragAnddrop")}
                      </h5>
                      <div className="flex gap-3 mt-5">
                        <label
                          htmlFor="upload-button"
                          className="bg-[--primary] border-none rounded-md text-white px-7 py-2 ml-3 cursor-pointer"
                        >
                          {t("browse")}
                        </label>
                        <button
                          type="button"
                          className="border-none cursor-pointer"
                          onClick={openWebCamp}
                        >
                          <img src={cameraIcon} alt="Camera Icon" />
                        </button>
                      </div>
                      <input
                        type="file"
                        id="upload-button"
                        className="hidden"
                        accept=".jpg, .jpeg, .png, .webp"
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </label>

          {image.preview && (
            <div className="image-container">
              <img
                src={image.preview}

                className="h-full w-auto max-w-[320px] object-contain"
                alt="Preview"
              />
              <button
                className="delete-button"
                onClick={handleRemoveImage}
                aria-label="Delete"
              >
                <img src={deleteIcon} alt="Delete Icon" />
              </button>
            </div>
          )}
        </div>
      </div>
      <LatestModal
        showModal={[modalSI, setModalSI]}
        width={600}
        onCancel={closeModal}
        footer={false}
      >
        {openCamera && (
          <WebCampCapture
            onClick={capture}
            webcamRef={webcamRef}
            cancel={closeModal}
          />
        )}
      </LatestModal>
    </div>
  );
};

export default CommonUploadViewFile;
