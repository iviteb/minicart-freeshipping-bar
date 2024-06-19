import React, { useEffect, useCallback, useState } from 'react'
import { OrderForm } from 'vtex.order-manager'
import { useRuntime } from 'vtex.render-runtime'
import { useIntl } from 'react-intl'
import { FormattedCurrency } from 'vtex.format-currency'
import { useRenderSession } from 'vtex.session-client'
import { useCssHandles } from 'vtex.css-handles'
import { Progress } from 'vtex.styleguide'

import useAppSettings from '../hooks/useAppSettings'
import './style.css'
import { isSessionSuccess } from '../utils/utils'
import { messages } from '../utils/messages'

const CSS_HANDLES = [
  'freigthScaleContainer',
  'freeshippingCompleteOrder',
  'freeshippingText',
  'freeshippingLeft',
  'freeshippingWin',
  'giftCompleteOrder',
  'giftText',
  'giftLeft',
  'giftWin',
  'progressBarContainer',
] as const

const MinimumFreightValue = ({ settings }: SettingsProps) => {
  const { binding } = useRuntime()
  const { session } = useRenderSession()
  const [shippingFreePercentage, setShippingFreePercentage] = useState(0)
  const [differenceBetwenValues, setDifferenceBetwenValues] = useState(0)
  const [freeShippingAmount, setFreeShippingAmount] = useState(0)
  const [freeShippingIndex, setFreeShippingIndex] = useState(0)
  const { useOrderForm } = OrderForm
  const { orderForm } = useOrderForm()
  const { totalizers }: { totalizers: Totalizer } = orderForm
  const { handles } = useCssHandles(CSS_HANDLES)
  const { formatMessage } = useIntl()

  const getChannel = async (salesChannel: string) => {
    settings.freeShippingTradePolicies.forEach(
      ({ freeShippingAmount: freeShippingValue, tradePolicy }, index) => {
        if (salesChannel === tradePolicy) {
          setFreeShippingAmount(freeShippingValue)
          setFreeShippingIndex(index)
        }
      }
    )
  }

  useEffect(() => {
    if (settings.bindingBounded) {
      const findAmountForBinding = settings.settings?.find(
        (item) => item.bindingId === binding?.id
      )?.freeShippingTradePolicies[freeShippingIndex].freeShippingAmount

      if (findAmountForBinding) setFreeShippingAmount(findAmountForBinding)
    } else if (isSessionSuccess(session)) {
      getChannel(session?.namespaces?.store?.channel?.value)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [binding, session])

  const handleUpdateMinicartValue = useCallback(
    (val) => {
      setShippingFreePercentage(Math.round(val / freeShippingAmount))
      setDifferenceBetwenValues(freeShippingAmount - val / 100)
    },
    [freeShippingAmount]
  )

  const getValues = (idValue: ValueTypes): number =>
    totalizers?.find(({ id }) => id === idValue)?.value ?? 0

  const finalValue = getValues('Items') + getValues('Discounts')

  useEffect(() => {
    handleUpdateMinicartValue(finalValue)
  }, [handleUpdateMinicartValue, finalValue])

  const barFull = differenceBetwenValues <= 0
  const freeshippingText = (
    <span className={`${handles.freeshippingText} b`}>
      {formatMessage(messages.freeshippingText)}
    </span>
  )

  const freeshippingValue = (
    <FormattedCurrency value={Math.max(0, differenceBetwenValues)} />
  )

  return (
    <div
      className={`${handles.freigthScaleContainer} w-100 pv5 ph6 t-small lh-copy c-on-base`}
    >
      {!barFull && (
        <p className={`${handles.freeshippingCompleteOrder} mt0 mb4`}>
          {formatMessage(messages.freeshippingCompleteOrder, {
            freeshippingText,
          })}
        </p>
      )}
      <div className={`${handles.progressBarContainer}`}>
        <Progress type="line" percent={shippingFreePercentage} />
      </div>
      {!barFull && (
        <p
          className={`${handles.freeshippingLeft} w-100 inline-block mt4 mb0 tc`}
        >
          {formatMessage(messages.freeshippingLeft, { freeshippingValue })}
        </p>
      )}
      {barFull && (
        <p className={`${handles.freeshippingWin} w-100 mt4 mb0 tc b`}>
          {formatMessage(messages.freeshippingWin)}
        </p>
      )}
    </div>
  )
}

const MinicartFreeshipping = () => {
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

  return <MinimumFreightValue settings={settings} />
}

export default MinicartFreeshipping
