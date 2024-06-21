type FreeShippingProps = {
  freeShipping: number
  receiveGift: number
  tradePolicy: string
}

type Settings = {
  bindingId: string
  freeShippingTradePolicies: [FreeShippingProps]
}

type BindingBoundedSettings = Settings & {
  bindingBounded?: boolean
  settings?: [Settings]
}

type SettingsProps = {
  settings: BindingBoundedSettings
}

type ValueTypes = 'Discounts' | 'Items'

type Totalizer = {
  id: string
  name: string
  value: number
}

type TradePolicySettings = Omit<FreeShippingProps, 'tradePolicy'>

type TPK = keyof TradePolicySettings

type SettingsItem = {
  [key: string]: number
}
