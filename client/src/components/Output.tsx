import React from "react";
import { styled } from '@stitches/react'
import './Output.css';

type Props = {
  children : String
}

export const Output:React.FC<Props> = ({children}) =>{
  return(
    <div 
      className="output-container">
        <p>Output</p>
        <p>{children}</p>
    </div>
  )
}
