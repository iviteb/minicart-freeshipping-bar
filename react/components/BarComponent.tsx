import React from 'react'
import { useIntl } from 'react-intl'
import { FormattedCurrency } from 'vtex.format-currency'
import { useCssHandles } from 'vtex.css-handles'
import { Progress } from 'vtex.styleguide'

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

interface BarComponentProps {
  currentValue: number
  targetValue: number
  messagePrefix: string
}

const BarComponent: React.FC<BarComponentProps> = ({
  currentValue,
  targetValue,
  messagePrefix,
}) => {
  const { handles, withModifiers } = useCssHandles(CSS_HANDLES)
  const { formatMessage } = useIntl()

  const difference = targetValue - currentValue / 100
  const percentage = Math.round(currentValue / targetValue)

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

export default BarComponent
