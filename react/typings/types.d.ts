type Totalizer = Array<{ id: string; name: string; value: number }>

type FreeShippingProps = {
  freeShippingAmount: number
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
