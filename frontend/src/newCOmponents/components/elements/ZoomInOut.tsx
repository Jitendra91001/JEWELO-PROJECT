import React from "react";

import {
  TransformWrapper,
  TransformComponent,
} from "react-zoom-pan-pinch";


const ZoomInOut = ({children , zoomControl}) => {
  return (
    <TransformWrapper
      initialScale={1}
      maxScale={6}
    >
      {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
        <>
        {zoomControl}
          <TransformComponent>
            {children}
          </TransformComponent>
        </>
      )}
    </TransformWrapper>
  );
};

export default ZoomInOut
