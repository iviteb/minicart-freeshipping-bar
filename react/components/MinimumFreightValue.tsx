import React from 'react'
import { useRuntime } from 'vtex.render-runtime'

import MinimumValue from './MinimumValue'
import useAppSettings from '../hooks/useAppSettings'

const MinimumFreightValue = () => {
  const { settings }: { settings: BindingBoundedSettings; loading: boolean } =
    useAppSettings('no-cache')

  const { binding } = useRuntime()

  if (!settings) {
    return null
  }

  if (
    (!settings.bindingBounded && !settings.freeShippingTradePolicies) ||
    !(settings.freeShippingTradePolicies[0]?.freeShippingAmount ?? undefined)
  ) {
    console.warn('No Free Shipping amount set')

    return null
  }

  const isAmountSetForBinding = settings.settings?.find(
    (item) => item.bindingId === binding?.id
  )?.freeShippingTradePolicies[0].freeShippingAmount

  if (settings.bindingBounded && !isAmountSetForBinding) {
    console.warn('No Free Shipping amounts for multi binding store set')

    return null
  }

  return (
    <MinimumValue
      settings={settings}
      valueKey="freeShippingAmount"
      messagePrefix="freeshipping"
    />
  )
}

export default MinimumFreightValue
