import { toast  } from "react-toastify";
import StatusModal from "../StatusModal/StatusModal";
import 'react-toastify/dist/ReactToastify.css';
import React from "react";

export function toastSuccess(message : string){
  toast(message , {type : "success" , position : "bottom-center" })
}

export function toastWarning(message : string){
  toast(message , {type : "warning" , position : "bottom-center"})
}

export function toastInfo(message : string){
  toast(message , {type : "info" , position : "bottom-center"})
}

export function toastDone(message : string){
  toast(message , {type : "success" , position : "bottom-center"})
}

export function toastError(message : string){
  toast(message , {type : "error" , position : "bottom-center"})
}

export function toastRescheduleSuccess(message : string){
  toast(message , {type : "success" , position : "bottom-center"})
}

export function toastLargeSuccess(message : string){
  toast(<StatusModal status="success"  message={message}/> , {position : "bottom-left"})
}

export function toastLargeWarning(message : string){
  toast(<StatusModal status="warning"  message={message}/> , {position : "bottom-left"})
}

export function toastLargeInfo(message : string){
  toast(<StatusModal status="info"  message={message}/> , {position : "bottom-left"})
}

export function toastLargeDone(message : string){
  toast(<StatusModal status="done"  message={message}/> , {position : "bottom-left"})
}

export function toastLargeError(message : string){
  toast(<StatusModal status="error"  message={message}/> , {position : "bottom-left"})
}

export function toastLargeRescheduleSuccess(message : string){
  toast(<StatusModal status="rescheduleSuccess"  message={message}/> , {position : "bottom-left"})
}

