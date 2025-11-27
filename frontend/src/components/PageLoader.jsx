import React from 'react'
import { useThemeStore } from '../store/useThemeStore'

const PageLoader = () => {
  const {theme} =useThemeStore()
  return (
    <div className='flex items-center justify-center h-screen' data-theme={theme}>
      <div className='loading loading-spinner loading-md'></div>
    </div>
  )
}

export default PageLoader