import React from 'react'
import { useCssHandles } from 'vtex.css-handles'

import MinimumGiftValue from './MinimumGiftValue'
import MinimumFreightValue from './MinimumFreightValue'

import './style.css'

const CSS_HANDLES = ['freigthScaleContainer'] as const

const MinicartFreeshipping = () => {
  const { handles } = useCssHandles(CSS_HANDLES)

  return (
    <div
      className={`${handles.freigthScaleContainer} w-100 pv5 ph6 t-small lh-copy c-on-base`}
    >
      <MinimumGiftValue />
      <MinimumFreightValue />
    </div>
  )
}

export default MinicartFreeshipping
