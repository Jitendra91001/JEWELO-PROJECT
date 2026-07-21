import React, { useEffect, useRef, useState } from "react";
import { useControls } from "react-zoom-pan-pinch";

export const ZoomInOutControl = ({defaultScale,isRender,isZoomOut,setZoomLevel,nextbutton}) => {
    const [scale, setScale] = useState(defaultScale);
        const { zoomIn, zoomOut, resetTransform ,instance} = useControls();
        const initialRender=useRef(true);
        const renderForReset=useRef(true)

    const scaleUp = () => {
      const newScale = Math.ceil(instance.transformState.scale)
      if(scale == newScale){
        setScale((pre)=>pre+ 0.1);        
      }else{
        setScale(Math.ceil(instance.transformState.scale));
      }
    }
    
    useEffect(()=>{
        setZoomLevel(scale)
        if(scale < 5){
            if(!initialRender?.current){
                scaleUp()
                zoomIn();     
            }
            else{
                initialRender.current=false;
            }
        }
    },[isRender])
  

    useEffect(()=>{
        if(scale > 1){
        if(!initialRender?.current){
            zoomOut();
            scaleUp();  
        }
        else{
            initialRender.current=false;
        }
    }else{
        setZoomLevel(scale)
    }
    },[isZoomOut])

    useEffect(()=>{
        if(!renderForReset?.current){
            setScale(1)
            setZoomLevel(1)
          resetTransform() 
        }
        else{
            renderForReset.current=false;
        }
    },[nextbutton])


    return (
      <>
      </>
    );
  };