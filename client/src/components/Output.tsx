import React from "react";
import { styled } from '@stitches/react'
import './Output.css';

type Props = {
  children : string
}

export const Output:React.FC<Props> = ({children}) =>{
  return(
    <div className="output-container">
      <p className="output-text-title">Output</p>
      <div className='output-text-subcontainer'>
        <Pre>{children}</Pre>
      </div>
    </div>
  )
}

export const Pre = styled('pre', {
  margin: '1px',
  fontSize: '1.2em',
  whiteSpace: 'pre-line'
})
