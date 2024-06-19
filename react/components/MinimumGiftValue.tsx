import React from 'react'
import { useRuntime } from 'vtex.render-runtime'

import MinimumValue from './MinimumValue'
import useAppSettings from '../hooks/useAppSettings'

const MinimumGiftValue = () => {
  const { settings }: { settings: BindingBoundedSettings; loading: boolean } =
    useAppSettings('no-cache')

  const { binding } = useRuntime()

  if (!settings) {
    return null
  }

  if (
    (!settings.bindingBounded && !settings.freeShippingTradePolicies) ||
    !(settings.freeShippingTradePolicies[0]?.receiveGiftAmount ?? undefined)
  ) {
    console.warn('No Receive Gift amount set')

    return null
  }

  const isAmountSetForBinding = settings.settings?.find(
    (item) => item.bindingId === binding?.id
  )?.freeShippingTradePolicies[0].receiveGiftAmount

  if (settings.bindingBounded && !isAmountSetForBinding) {
    console.warn('No Receive Gift amounts for multi binding store set')

    return null
  }

  return (
    <MinimumValue
      settings={settings}
      valueKey="receiveGiftAmount"
      messagePrefix="receiveGift"
    />
  )
}

export default MinimumGiftValue
