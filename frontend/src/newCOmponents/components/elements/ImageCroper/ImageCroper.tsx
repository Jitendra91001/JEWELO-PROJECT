import React from "react";
import ImgCrop from "antd-img-crop";
import { Row, Spin, Upload } from "antd";
import { t } from '../../../i18n/i18n'
import CommonText from "../HeadingTitle/CommonText";
import deleteIcon from "../../../assets/deleteIcon.svg";
import "./imageCroper.css"

const getSrcFromFile = (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file.originFileObj);
    reader.onload = () => resolve(reader.result);
  });
};

const ImageCroper = ({beforeUpload, checkSignature = "", progressBar="false",setCheckSignature, fileList, setFileList, maxCount, onChange, loader = false }) => {

  const onRemove = () => {
    setFileList([])
  }

  const onPreview = async (file) => {
    const src = file.url || (await getSrcFromFile(file));
    const imgWindow = window.open(src);

    if (imgWindow) {
      const image = new Image();
      image.src = src;
      imgWindow.document.write(image.outerHTML);
    } else {
      window.location.href = src;
    }
  };

  const handleSignatureRemoveImage = () => {
    setCheckSignature(null)
  };


  return (
    <>
      {
        loader ?
          <Row className="border-[1px] border-dashed border-[#8E8E8E]  rounded-md w-[50%] xl:w-full lg:w-full py-2  p-[5px] imagescroper-container flex items-center justify-center">
            <Spin />
          </Row>
          :
          <>
            {checkSignature == null ?
                <ImgCrop showGrid rotationSlider aspectSlider showReset modalTitle={t("uploadSignature")}>
                  <Upload

                    onChange={onChange}
                    onPreview={onPreview}
                    onRemove={onRemove}
                    maxCount={maxCount}
                    beforeUpload={beforeUpload}
                    progress={progressBar}

                  >
                    <div className="flex flex-col items-center cursor-pointer">
                      <div className="border-[1px] border-dashed border-[#8E8E8E]  rounded-md w-[50%] xl:w-full lg:w-full py-2  p-[5px] imagescroper-container">
                        <div className="relative flex justify-center items-center"
                        >

                          {/* when file is not uploades */}
                          <label
                            htmlFor="load-signature"
                            className="block  px-1 rounded-lg cursor-pointer"
                          >
                            <div className="relative flex justify-center items-center flex-col">
                              <CommonText type="font2" title="Image should be 250 x 90 px, JPG, PNG or Webp under 1 MB" color="gray" />
                              <label
                                htmlFor="upload-signature"
                                className="bg-[--primary] rounded-md text-white px-7 py-2 cursor-pointer mt-2 m-auto inline-block">
                                {t("Choose File")}
                              </label>
                            </div>
                          </label>
                        </div>
                      </div>
                    </div>
                  </Upload>
                  {/* </Dragger> */}
                </ImgCrop>
                :
                <Row className="border-[1px] border-dashed border-[#8E8E8E]  rounded-md w-[50%] xl:w-full lg:w-full py-2  p-[5px] imagescroper-container flex items-center justify-center">
                  <div className="image-container">
                    <img
                      src={checkSignature}
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
                </Row>
            }
          </>
      }
    </>
  );
};

export default ImageCroper;
