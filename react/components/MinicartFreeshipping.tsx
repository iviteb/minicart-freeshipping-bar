import React from 'react'
import { useCssHandles } from 'vtex.css-handles'
import { useRuntime } from 'vtex.render-runtime'
import { useRenderSession } from 'vtex.session-client'
import { OrderForm } from 'vtex.order-manager'

import useAppSettings from '../hooks/useAppSettings'
import { getTotalizerValueById, isSessionSuccess } from '../utils/utils'
import './style.css'
import BarComponent from './BarComponent'

const CSS_HANDLES = ['freigthScaleContainer'] as const

const MinicartFreeshipping = () => {
  const { handles } = useCssHandles(CSS_HANDLES)
  const { binding } = useRuntime()
  const { useOrderForm } = OrderForm
  const {
    orderForm: { totalizers },
  } = useOrderForm()

  const { session } = useRenderSession()
  const { settings: appSettings }: { settings: BindingBoundedSettings } =
    useAppSettings()

  const salesChannel = isSessionSuccess(session)
    ? session.namespaces?.store?.channel?.value
    : undefined

  if (!appSettings || !salesChannel) {
    return null
  }

  const { bindingBounded, freeShippingTradePolicies, settings } = appSettings
  const currentBindingSettings = bindingBounded
    ? settings?.find((item) => item.bindingId === binding?.id)
        ?.freeShippingTradePolicies
    : freeShippingTradePolicies

  const currentTradePolicySettings: TradePolicySettings | undefined =
    currentBindingSettings?.find((item) => item.tradePolicy === salesChannel)

  if (!currentTradePolicySettings) {
    return null
  }

  const settingsItems: SettingsItem[] = Object.keys(
    currentTradePolicySettings
  ).reduce((acc: SettingsItem[], key: string) => {
    if (key !== 'tradePolicy' && currentTradePolicySettings[key as TPK]) {
      return [...acc, { [key as TPK]: currentTradePolicySettings[key as TPK] }]
    }

    return acc
  }, [] as SettingsItem[])

  const orderFormItemValue =
    getTotalizerValueById(totalizers, 'Items') +
    getTotalizerValueById(totalizers, 'Discounts')

  return (
    <div
      className={`${handles.freigthScaleContainer} w-100 pv5 ph6 t-small lh-copy c-on-base`}
    >
      {settingsItems.map((item) => (
        <BarComponent
          currentValue={orderFormItemValue}
          key={Object.keys(item)[0]}
          targetValue={item[Object.keys(item)[0]]}
          messagePrefix={Object.keys(item)[0]}
        />
      ))}
    </div>
  )
}

export default MinicartFreeshipping
