import React, { useEffect, useState } from 'react'
import { useOrderForm } from 'vtex.order-manager/OrderForm'
import { useRuntime } from 'vtex.render-runtime'
import { useIntl } from 'react-intl'
import { FormattedCurrency } from 'vtex.format-currency'
import { useRenderSession } from 'vtex.session-client'
import { useCssHandles } from 'vtex.css-handles'
import { Progress } from 'vtex.styleguide'

import { getTotalizerValueById, isSessionSuccess } from '../utils/utils'
import { messages } from '../utils/messages'

type MessageKey = keyof typeof messages

const CSS_HANDLES = [
  'valueScaleContainer',
  'completeOrder',
  'text',
  'left',
  'win',
  'progressBarContainer',
] as const

interface MinimumValueProps {
  settings: BindingBoundedSettings
  valueKey: 'freeShippingAmount' | 'receiveGiftAmount'
  messagePrefix: string
}

const MinimumValue: React.FC<MinimumValueProps> = ({
  settings,
  valueKey,
  messagePrefix,
}) => {
  // const { binding } = useRuntime()
  // const { session } = useRenderSession()
  // const [percentage, setPercentage] = useState(0)
  // const [difference, setDifference] = useState(0)
  // const [targetAmount, setTargetAmount] = useState(0)
  // const [index, setIndex] = useState(0)
  // const { orderForm } = useOrderForm()
  // const { totalizers } = orderForm
  const { handles, withModifiers } = useCssHandles(CSS_HANDLES)
  const { formatMessage } = useIntl()

  // const getChannel = async (salesChannel: string) => {
  //   settings.freeShippingTradePolicies.forEach(
  //     ({ [valueKey]: value, tradePolicy }, idx) => {
  //       if (salesChannel === tradePolicy) {
  //         setTargetAmount(value)
  //         setIndex(idx)
  //       }
  //     }
  //   )
  // }

  // useEffect(() => {
  //   if (settings.bindingBounded) {
  //     const findAmountForBinding = settings.settings?.find(
  //       (item) => item.bindingId === binding?.id
  //     )?.freeShippingTradePolicies[index][valueKey]

  //     if (findAmountForBinding) setTargetAmount(findAmountForBinding)
  //   } else if (isSessionSuccess(session)) {
  //     getChannel(session?.namespaces?.store?.channel?.value)
  //   }
  // }, [binding, session])

  // const handleUpdateMinicartValue = useCallback(
  //   (val) => {
  //     setPercentage(Math.round(val / targetAmount))
  //     setDifference(targetAmount - val / 100)
  //   },
  //   [targetAmount]
  // )

  const difference = targetAmount - finalValue / 100
  const percentage = Math.round(finalValue / targetAmount)

  // useEffect(() => {
  //   handleUpdateMinicartValue(finalValue)
  // }, [handleUpdateMinicartValue, finalValue])

  const barFull = difference <= 0
  const valueText = (
    <span className={`${handles.text} b`}>
      {formatMessage(messages[`${messagePrefix}Text` as MessageKey])}
    </span>
  )

  const valueAmount = <FormattedCurrency value={Math.max(0, difference)} />

  return (
    <div className={`${withModifiers('valueScaleContainer', messagePrefix)}`}>
      {!barFull && (
        <p className={`${handles.completeOrder} mt0 mb4`}>
          {formatMessage(
            messages[`${messagePrefix}CompleteOrder` as MessageKey],
            {
              value: valueText,
            }
          )}
        </p>
      )}
      <div className={`${handles.progressBarContainer}`}>
        <Progress type="line" percent={percentage} />
      </div>
      {!barFull && (
        <p className={`${handles.left} w-100 inline-block mt4 mb0 tc`}>
          {formatMessage(messages[`${messagePrefix}Left` as MessageKey], {
            value: valueAmount,
          })}
        </p>
      )}
      {barFull && (
        <p className={`${handles.win} w-100 mt4 mb0 tc b`}>
          {formatMessage(messages[`${messagePrefix}Win` as MessageKey])}
        </p>
      )}
    </div>
  )
}

export default MinimumValue
