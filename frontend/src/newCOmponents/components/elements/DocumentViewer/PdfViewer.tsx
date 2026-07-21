

import { useState, useEffect, useRef } from 'react';
import { Document, Page } from 'react-pdf';
import React from 'react';
import { pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/TextLayer.css';
import { Col, Row } from 'antd';
import './documentViewer.css';
import Loader from '../Loader/Loader';
import { TransformComponent } from 'react-zoom-pan-pinch';
import { mainAxios } from '../../../helpers/runAxios';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();


const PdfViewer = ({ url}) => {

  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [loadingPdf , setLoadingPdf] = useState(true);
  const pdfContainerRef = useRef<HTMLDivElement>(null);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);

  useEffect(() => {
    const fetchData = async () => {
      setLoadingPdf(true)
      try {
        const response = await mainAxios.get(url, {
          responseType: 'blob',
        });
      
        const pdfData = new Blob([response.data], { type: 'application/pdf' });
        const pdfUrl = URL.createObjectURL(pdfData);
        setPdfUrl(pdfUrl); // Update state with the PDF URL
        setLoadingPdf(false)
      } catch (error) {
        setLoadingPdf(false)
        console.error(error);
      }
    };

    fetchData();
  }, [url]);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };
  const handlePageScroll = (event: React.UIEvent<HTMLDivElement, UIEvent>) => {
	const container = event.target as HTMLDivElement;
	const pages = Array.from(container.querySelectorAll('.react-pdf__Page'));
  
	let currentPage = 1;
    const containerTop = container.getBoundingClientRect().top;

    for (const page of pages) {
      const { top, height } = page.getBoundingClientRect();
      const offset = top - containerTop;

      if (offset + height / 2 >= 0) {
        break;
      }
      currentPage += 1;
    }
    if (currentPage <= numPages) {
      setPageNumber(currentPage);
    }
  };


  return (
    <div className='w-full pdfViewer'>
      <Row  justify={"center"} align={"middle"} >
        <Col span={24}>
          <div className="flex justify-center items-center">
            <div className="flex justify-center items-center m-1">
              <div className="w-12 h-8  rounded-md flex items-center justify-center border-[1px] border-solid border-gray-200">{pageNumber}</div>
              <div className="mx-2">/</div>
              <div className="w-12 h-8  rounded-md flex items-center justify-center border-[1px] border-solid border-gray-200">{numPages}</div>
            </div>
          </div>
        </Col>
      </Row>
      <TransformComponent contentStyle={{ margin: "auto", width: "100%" , height : "100%", overflow : "hidden" }}>
      <div
        className='overflow-y-auto m-auto my-2 h-[600px] pdf-container'
        ref={pdfContainerRef}
        onScroll={handlePageScroll}
      >
      {pdfUrl && ( 
          <Document
            file={pdfUrl}
            onLoadSuccess={onDocumentLoadSuccess}
          >
            {Array.from(new Array(numPages), (el, index) => (
              <div key={`page_${index + 1}`} className="page-wrapper" style={{ maxHeight: '100%', marginBottom : "9px" , margin : "2px 0 10px", overflow: 'hidden', display: 'flex', justifyContent: 'center' ,boxShadow: "rgba(0, 0, 0, 0.08) 0px 0px 0px 1px, rgb(209, 213, 219) 0px 0px 0px 1px inset" }}>
                <Page
                  pageNumber={index + 1}
                  renderMode="canvas"
                  loading={false}
                   width={950}
                />
              </div>
            ))}
          </Document>
        )}
        {loadingPdf && <div className="flex justify-center items-center w-full h-full"> <Loader size='large'/></div>}
      </div>
      </TransformComponent>
    </div>
  );
};

export default PdfViewer;
