import React, { useEffect, useState } from "react";
import "../../elements/CommonUploadViewFile/CommonUploadViewFile.css";
import "tailwindcss/tailwind.css";
import deleteIcon from "../../../assets/deleteIcon.svg";
import LatestModal from "../Modal/LatestModal";
import { t } from "i18next";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux-hooks";
import { downloadSignatureImage, uploadSignature } from "../../../redux/hr/thunk";
import { toastError, toastSuccess } from "../Notification/Toastify";
import {  updateCurrentSignatureFile } from "../../../redux/hr/slice";

import CommonText from "../HeadingTitle/CommonText";

  const SignatureUpload = ({ uuid , signatureImage,setCheckSignature}) => {

  const [signaturePreview, setSignaturePreview] = useState({preview: "", raw: ""})
  const [signature_base64Data, setSignature_base64Data] = useState({});

  const [dragOver, setDragOver] = useState(false);
  const [modalSI, setModalSI] = useState(false);
  const dispatch = useAppDispatch();
  const { currentEmployeeUuid, selectedSignatureFile,signatureUploadData, } = useAppSelector((s) => s.hrReducer)
  const hrReducer = useAppSelector((s) => s.hrReducer)


 

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleSignatureFileUpload(file, uuid);
    }
  };

  const handleChangeSignature = (e) => {
    if (e.target.files.length > 0) {
      const file = e.target.files[0];
      dispatch(updateCurrentSignatureFile(file))
      handleSignatureFileUpload(file, uuid);
    }
  };

  

  const handleSignatureFileUpload = async (file, uuid) => {
    if (file && file?.size) {
      if (file?.size > 10 * 1024 * 1024) {
        toastError("File size exceeds 10MB. Please choose a smaller file.");
        return;
      }
      if (!file.type?.match(/image\/(jpeg|png|webp)/)) {
        toastError("Unsupported file type. Please upload JPEG, PNG, or WebP image.");
        return;
      }

      setSignaturePreview({
        preview: URL.createObjectURL(file),
        raw: file,
      });


      const formData = new FormData();
      formData.append('file', file); // Append the file

      dispatch(uploadSignature(formData)).unwrap().then((res) => {
        setSignature_base64Data({
          file_name: res?.data.file_name,
          object_key: res?.data.object_key,
        })

        const uploadSignatureData = {
          "data": {
            "file_name": res?.data?.file_name,
            "object_key": res?.data?.object_key,
          }
        }
        getSignatureImageFu(uploadSignatureData);
        dispatch(updateCurrentSignatureFile({}));
        toastSuccess(res?.message)
      })
        .catch((err) => {
          console.log(err, 'my error')
          toastError(err?.message)
        })
    }
  };

  const getSignatureImageFu = (data: any) => {
    if (data?.data?.file_name) {

      dispatch(downloadSignatureImage(data)).unwrap().then((res) => {
        setSignaturePreview({
          preview: res?.data,
          raw: "",
        })
      })
    }
  }


  useEffect(() => {
    if( signatureImage ){
    setSignaturePreview({
      "preview": signatureImage,
      raw: "",
    })
  }
  }, [uuid,signatureImage])













  const handleSignatureRemoveImage = () => {
    setCheckSignature(null)

    setSignaturePreview({ preview: "", raw: "" });

  };



  const closeModal = () => {
     setModalSI(false);
  };

  useEffect(() => {
    if (currentEmployeeUuid) {
      handleSignatureFileUpload(selectedSignatureFile, currentEmployeeUuid)
    }
  }, [currentEmployeeUuid])

  return (
    <div className="flex flex-col items-center">
      <div className="border-[1px] border-dashed border-[#8E8E8E]  rounded-md w-[50%] xl:w-full lg:w-full py-2  p-[5px]">
        <div
          className={`relative flex justify-center items-center mt-2.5 ${dragOver ? "bg-gray-300" : ""
            }`}
          onDragOver={handleDragOver}
          onDragEnter={handleDragOver}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
        >
          <label
            htmlFor="load-signature"
            className="block w-0 -ml-2 px-1 h-[70px] rounded-lg cursor-pointer"
          >
            {!signaturePreview.preview && (
              <div className="absolute inset-0 flex justify-center">
                <div className="relative">
                  <CommonText type="font2" title={t("imageShouldBe250X90pxUnder200KB")} color="gray" />
                  <div className="absolute inset-0 flex top-9 justify-center">
                    <div>
                      <label
                        htmlFor="upload-signature"
                        className="bg-[--primary] border-none rounded-md text-white px-7 py-2 ml-3 cursor-pointer">
                        {t("Choose File")}
                      </label>
                      <input
                        type="file"
                        id="upload-signature"
                        className="hidden"
                        accept=".jpg, .jpeg, .png, .webp"
                        onChange={(e)=>handleChangeSignature(e)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </label>
          {signaturePreview.preview && (
              <div className="image-container">
                <img
                  src={signaturePreview.preview}
                  className="w-full !h-[90px] px-2 object-cover"
                  alt="Preview"
                />
                <button
                  className="delete-button"
                  onClick={handleSignatureRemoveImage}
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
        footer={false}>
      </LatestModal>
    </div>
  );
};


export default SignatureUpload;