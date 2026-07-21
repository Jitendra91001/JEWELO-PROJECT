import React from 'react';
import "./Customstep.css";
import { Steps } from 'antd';
interface SampleProps {
    type: string
    handleChange?:(value:number)=>void
    current:number
    description?:string
    items:Array<any>
    size:any
    progressDot:any
  }
  
  type Props =  SampleProps;
 

 
const Customstep: React.FC<Props> = props => {
   
    
    return (
        
        props.type === 'horizontal' ? (
          <Steps
          className='steps'
          current={props?.current}
          onChange={props?.handleChange}
         items={props.items}
         size={props.size}
         progressDot={props.progressDot}
        />
        ) : (
          <Steps
          
          direction="vertical"
          current={props?.current}
          onChange={props?.handleChange}
          items={props.items}
         size={props.size}
         progressDot={props.progressDot}
        />
        )
      );
}
export default Customstep;