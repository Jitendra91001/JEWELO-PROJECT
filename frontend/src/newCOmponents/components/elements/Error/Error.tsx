import React from 'react'

const Error = ({error} : any) => {
  return (
    <span className='text-red-600'>{error ? error : ""}</span>
  )
}

export default Error