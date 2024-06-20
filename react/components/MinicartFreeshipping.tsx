import React from 'react'
import { useCssHandles } from 'vtex.css-handles'
import { useRuntime } from 'vtex.render-runtime'
import { useRenderSession } from 'vtex.session-client'
import { useOrderForm } from 'vtex.order-manager/OrderForm'

import MinimumGiftValue from './MinimumGiftValue'
import MinimumFreightValue from './MinimumFreightValue'
import useAppSettings from '../hooks/useAppSettings'
import { getTotalizerValueById, isSessionSuccess } from '../utils/utils'

import './style.css'
import MinimumValue from './MinimumValue'

const CSS_HANDLES = ['freigthScaleContainer'] as const

const MinicartFreeshipping = () => {
  const { handles } = useCssHandles(CSS_HANDLES)
  const { binding } = useRuntime()
  const {
    orderForm: { totalizers },
  } = useOrderForm()

  const { session } = useRenderSession()
  const { settings: appSettings }: { settings: BindingBoundedSettings } =
    useAppSettings()

  console.log('🚀 ~ MinicartFreeshipping ~ settings:', appSettings, binding)

  const salesChannel = isSessionSuccess(session)
    ? session.namespaces?.store?.channel?.value
    : undefined

  console.log('🚀 ~ MinicartFreeshipping ~ salesChannel:', salesChannel)

  if (!appSettings || !salesChannel) {
    return null
  }

  const { bindingBounded, freeShippingTradePolicies, settings } = appSettings
  const currentBindingSettings = bindingBounded
    ? settings?.find((item) => item.bindingId === binding?.id)
      ?.freeShippingTradePolicies
    : freeShippingTradePolicies

  const currentTradePolicySettings: any = currentBindingSettings?.find(
    (item) => item.tradePolicy === salesChannel
  )

  if (!currentTradePolicySettings) {
    return null
  }

  const settingsItems: Array<{ [key: string]: number }> = Object.keys(
    currentTradePolicySettings
  ).reduce((acc: Array<{ [key: string]: number }>, key: string) => {
    if (key !== 'tradePolicy' && currentTradePolicySettings[key]) {
      return [...acc, { [key]: currentTradePolicySettings[key] }]
    }

    return acc
  }, [])

  const orderFormItemValue =
    getTotalizerValueById(totalizers, 'Items') +
    getTotalizerValueById(totalizers, 'Discounts')

  console.log('🚀 ~ MinicartFreeshipping ~ settingsItems:', settingsItems)

  return (
    <div
      className={`${handles.freigthScaleContainer} w-100 pv5 ph6 t-small lh-copy c-on-base`}
    >
      {settingsItems.map((item) => (
        <BarComponent
          currentValue={orderFormItemValue}
          key={Object.keys(item)[0]}
          targetValue={item[Object.keys(item)[0]]}
        />
      ))}
      <MinimumGiftValue />
      <MinimumFreightValue />
    </div>
  )
}

export default MinicartFreeshipping
