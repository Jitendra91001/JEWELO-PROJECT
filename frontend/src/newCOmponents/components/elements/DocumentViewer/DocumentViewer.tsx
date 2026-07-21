import React, {useMemo, useState, useRef, useEffect} from 'react'
import LatestModal from '../Modal/LatestModal'
import { Carousel, Col, Empty, Row } from 'antd';
import { LeftOutlined, RightOutlined, ZoomInOutlined, ZoomOutOutlined } from '@ant-design/icons';
import { useAppSelector } from '../../../hooks/redux-hooks';
import CommonText from '../HeadingTitle/CommonText';
import Loader from '../Loader/Loader';
import "./documentViewer.css";
import PdfViewer from './PdfViewer';
import IconButton from '../Button/IconButton';
import { DownloadIcon2, PrintIcon2 } from "../Icons/icon"
import { TransformWrapper, TransformComponent, } from "react-zoom-pan-pinch";
import axios from 'axios';



const DocumentViewer = ({ documentList, setDocumentList, showModal, printAll=false ,copies=1}) => {

  const { loader } = useAppSelector((s: any) => s.hrReducer)
  const [printLoader, setPrintLoader] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0)
  const [nextbutton, setButton] = useState(false)
  const [zoomLevel, setZoomLevel] = useState(1);
  const resetTransformRef = useRef<(() => void) | null>(null);

  const modalContentRef: any = useRef();

  const handleClose = () => {
    setDocumentList([]);
    setActiveIndex(0);
  }
  
  const listingData = useMemo(() => documentList?.map((itm) => (
    Array.isArray(itm.url) ? itm.url.map((url) => ({ url:url?.split("&client")?.[0], name: itm?.document_name||itm?.name, type: itm?.document_type  })) : [{ url: itm.url?.split("&client")?.[0], name: itm?.document_name, type: itm?.document_type  }]
  )).flat(), [documentList]);



  const handleDocsDownload = () => {
    const dta = listingData[activeIndex];

    if (dta?.url) {
      const link = document.createElement('a');
      link.href = dta.url;
      link.setAttribute('download', dta.name || 'download'); 
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      console.error('Invalid document URL.');
    }
  };


  const handlePrint = async () => {
    setPrintLoader(true);
  
      try {
        if (printAll && listingData.length > 0 && copies > 1) {
        
          const printWindow = window.open('', '', 'width=800,height=600');
          if (!printWindow) {
            setPrintLoader(false);
            throw new Error("Unable to open print window. Please allow popups.");
          }
        
          let html = `<html><head><title>Print Documents</title>
          <style>
            @media print {
              body, html { margin: 0; padding: 0; }
              .print-image, .pdf-page {
                page-break-after: always;
                display: block;
                width: 100vw;
                height: auto;
                max-width: 100vw;
                max-height: 95vh;
                margin: 0 auto;
                background: none !important;
                box-shadow: none !important;
                border: none !important;
                padding: 0 !important;
              }
              .print-image:last-child, .pdf-page:last-child {
                page-break-after: auto;
              }
            }
            body { margin: 0; padding: 0; }
          </style>
          </head><body>`;
        
          const pdfs: string[] = [];
          const images: string[] = [];
        
          for (const doc of listingData) {
            if (doc.url.match(/\.pdf$/i)) {
              pdfs.push(doc.url);
            } else if (doc.url.match(/\.(jpg|jpeg|png)$/i)) {
              images.push(doc.url);
            }
          }
        
          let promises: Promise<void>[] = [];
        
          // Handle images
          for (let copy = 0; copy < copies; copy++) {
            for (const url of images) {
              const p = axios.get(url, { responseType: 'arraybuffer' }).then(res => {
                const mimeType = url.match(/\.png$/i) ? 'image/png' : 'image/jpeg';
                let binary = '';
                const bytes = new Uint8Array(res.data);
                for (let i = 0; i < bytes.byteLength; i++) {
                  binary += String.fromCharCode(bytes[i]);
                }
                const dataUrl = `data:${mimeType};base64,${window.btoa(binary)}`;
                html += `<img src="${dataUrl}" class="print-image" alt="print-img" />`;
              });
              promises.push(p);
            }
          }
        
          Promise.all(promises).then(() => {
            html += `</body></html>`;
            printWindow.document.open();
            printWindow.document.write(html);
            printWindow.document.close();
        
            if (pdfs.length === 0) {

              const waitForImages = () => {
                const imgs = printWindow.document.images;
                if (imgs.length === 0 || Array.from(imgs).every(img => img.complete)) {
                  printWindow.focus();
                  setTimeout(() => {
                    printWindow.print();
                    printWindow.close();
                    setPrintLoader(false);
                  }, 300);
                } else {
                  setTimeout(waitForImages, 200);
                }
              };
              waitForImages();
            } else {
              // PDF rendering
              const loadPdfjsAndRender = () => {
                const script = printWindow.document.createElement('script');
                script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.min.js';
                script.onload = () => {
                  const pdfjsLib = (printWindow as any).pdfjsLib;
                  pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';
        
                  const renderPdf = async (pdfUrl: string) => {
                    const loadingTask = pdfjsLib.getDocument(pdfUrl);
                    const pdf = await loadingTask.promise;
                    for (let i = 1; i <= pdf.numPages; i++) {
                      const page = await pdf.getPage(i);
                      const viewport = page.getViewport({ scale: 1.5 });
        
                      const canvas = printWindow.document.createElement('canvas');
                      canvas.className = 'pdf-page';
                      canvas.width = viewport.width;
                      canvas.height = viewport.height;
                      const context = canvas.getContext('2d');
        
                      await page.render({ canvasContext: context, viewport }).promise;
                      printWindow.document.body.appendChild(canvas);
                    }
                  };
        
                  (async () => {
                    for (let copy = 0; copy < copies; copy++) {
                      for (const pdfUrl of pdfs) {
                        await renderPdf(pdfUrl);
                      }
                    }
                    printWindow.focus();
                    setTimeout(() => {
                      printWindow.print();
                      printWindow.close();
                      setPrintLoader(false);
                    }, 500);
                  })();
                };
                printWindow.document.head.appendChild(script);
              };
        
              loadPdfjsAndRender();
            }
          });
        
          return;
        }
        
        
        
      
      
      
      
      
      const dta = listingData[activeIndex];
      const isPDF = dta?.url.includes(".pdf");
      const isImage = dta?.url.match(/\.(jpg|jpeg|png)$/i);
      if (isPDF || isImage) {
        const response = await axios.get(dta?.url, {
          responseType: 'arraybuffer',
        });

        const mimeType = isPDF ? 'application/pdf' : isImage ? 'image/jpeg' : '';
        const blob = new Blob([response.data], { type: mimeType });
        const blobUrl = URL.createObjectURL(blob);

        const iframe = document.createElement('iframe');
        iframe.style.position = 'absolute';
        iframe.style.width = '0px';
        iframe.style.height = '0px';
        iframe.style.border = 'none';
        iframe.src = blobUrl;

        document.body.appendChild(iframe);

        iframe.onload = () => {
          const iframeDocument = iframe.contentDocument || iframe.contentWindow?.document;

          if (iframeDocument) {
            const style = document.createElement('style');
            style.innerHTML = `
            @media print {
              @page {
                size: auto;  /* Use the size of the content */
                margin: 10px;   /* Remove default margins */
              }
              body, html {
                margin: 0;
                padding: 0;

                
                width: 100%;
                height: 100%;
              }
              iframe, img {
                display: block;
                max-width: 100%;
                max-height: 100%;
                margin: auto;
                position: absolute;
                top: 0;
                bottom: 0;
                left: 0;
                right: 0;
              }
            }
          `;
            iframeDocument.head.appendChild(style);
          }

          iframe.contentWindow?.focus();
          iframe.contentWindow?.print();
        };

        iframe.contentWindow?.addEventListener('afterprint', () => {
          document.body.removeChild(iframe);
          URL.revokeObjectURL(blobUrl);
          setPrintLoader(false)
        });
        setPrintLoader(false)
      } else {
        setPrintLoader(false)
        console.error('Unsupported file type. Only PDF and images (jpg, jpeg, png) are supported.');
      }
    } catch (error) {
      setPrintLoader(false)
      console.error('Error fetching and printing the file:', error);
    }
  };


const style1 ={
  fontSize:"30px",
  cursor:"not-allowed",
  color:"#ccc"
  }

const style2 ={
  fontSize:"30px",
  cursor:"pointer",
  }

  const disableAction = useRef(false);

  const handleZoomIn = async (zoomIn) => {
    if (disableAction.current || zoomLevel >= 6) return null;
    disableAction.current = true;
    await zoomIn();
    setZoomLevel((prev) => Math.min(prev + 1, 6));
    setTimeout(() => {
      disableAction.current = false;
    }, 400)
  };

  const handleZoomOut = async (zoomOut) => {
    if (disableAction.current || zoomLevel <= 1) return null;
    disableAction.current = true;
    await zoomOut();
    setZoomLevel((prev) => Math.max(prev - 1, 1));
    setTimeout(() => {
      disableAction.current = false;
    }, 400)
  };
  useEffect(() => {
    if (showModal) {
      setZoomLevel(1)
    }
  }, [showModal])

  useEffect(() => {
    if (resetTransformRef.current) {
      resetTransformRef.current();
      setZoomLevel(1);
    }
  }, [activeIndex, showModal]);
  
  useEffect(() => {
    if (zoomLevel === 1 && resetTransformRef.current) {
      resetTransformRef.current();
    }
  }, [zoomLevel]);


  return (
    <LatestModal
      width={1100}
      closable
      showModal={showModal}
      footer={""}
      onClose={handleClose}>
      <div>
        <div className="w-full">
          <Row className='absolute top-[10px] right-14 z-50' justify={"end"} align={"middle"}>
            <Col className="w-[39px] h-[38px]  flex justify-center items-center"><IconButton onClick={handleDocsDownload} icon={<DownloadIcon2 />} /></Col>
            <Col className="w-[39px] h-[38px]  flex justify-center items-center">{printLoader ? <div className="w-[39px] h-[38px]  flex justify-center items-center"> <Loader /></div> : <IconButton onClick={handlePrint} icon={<PrintIcon2 height={16} width={16} />} />}</Col>
          </Row>
          {listingData?.length > 0 &&
            <Carousel
              dots={false}
              arrows
              prevArrow={<div className="custom-prev-icon" ><LeftOutlined style={{ color: activeIndex == 0 ? "white" : "black", fontSize: "18px", marginTop: "10px", }} /></div>}
              nextArrow={<div className="custom-next-icon"  ><RightOutlined style={{ color: activeIndex == (listingData?.length - 1) ? "white" : "black", fontSize: "18px", marginTop: "10px" }} /></div>}
              beforeChange={(current, next) => {
                if (next) {
                  setActiveIndex(next)
                  setButton(!nextbutton)
                } else {
                  setActiveIndex(0)
                }
              }}
              infinite={false}
            >
              {listingData?.map((ele: any, index) => {
                const fileName = new URL(ele?.url)?.searchParams.get("file_name");
                const objectKey = new URL(ele?.url)?.searchParams.get("object_key");
                const isPDF = (fileName || objectKey)?.match(/\.pdf$/i) ? (fileName || objectKey)?.match(/\.pdf$/i) : ele?.type === "pdf";

                return (
                  <div key={index} ref={modalContentRef} className='flex justify-center items-center  w-full'>
                    <TransformWrapper
                      defaultScale={1}
                      defaultPositionX={200}
                      initialPositionX={1}
                      initialPositionY={1}
                      defaultPositionY={100}
                      wheel={{touchPadDisabled :true , wheelDisabled : true , disabled : true}}
                      doubleClick={{disabled : true}}                    >
                      {({ zoomIn, zoomOut, resetTransform, ...rest }) => {
                        resetTransformRef.current = resetTransform;
                        return (
                          <React.Fragment>
                            {isPDF ?
                              <div className="flex justify-center items-center mb-1 w-full rounded-md img">
                                <PdfViewer url={ele?.url} />
                              </div> :
                               <div className="px-10">
                              <div className="border m-auto !w-full mb-1 mt-12 rounded-md border-solid border-slate-400 flex justify-center items-center img overflow-hidden">
                                <TransformComponent contentStyle={{ margin: "auto", width: "100%", height: "100%" }}>
                                  <div className="flex justify-center items-center mb-1 !w-full h-full img">
                                  <div className='max-w-[1000px] h-[600px] flex object-contain'>
                                       <img src={ele?.url} alt="" className='m-auto w-full h-full'/> 
                                    </div>
                                   </div> 
                                </TransformComponent>
                                </div>
                              </div>}
                            <div className="mt-2 -mb-3 select-none">
                              <div className='flex gap-3 justify-center items-center my-2'>
                                <ZoomInOutlined disabled={disableAction.current} onClick={() => handleZoomIn(zoomIn)} style={zoomLevel < 6 ? style2 : style1} />
                                <ZoomOutOutlined onClick={() => handleZoomOut(zoomOut)} style={zoomLevel > 1 ? style2 : style1} />
                              </div>
                              <div className='min-h-[50px]'><CommonText title={`${ele?.name||""} ${fileName != null ? "(" + fileName + ")" : ""}`} type='font2' /></div>
                            </div>
                          </React.Fragment>
                        )
                      }}
                    </TransformWrapper>
                  </div>
                )
              })}

            </Carousel>}
          <div>
          </div>

          {loader === false && documentList?.length === 0 && <Empty />}
          {loader === true && <div className="flex justify-center"><Loader /></div>}
        </div>

      </div>
    </LatestModal>

  )
}

export default DocumentViewer