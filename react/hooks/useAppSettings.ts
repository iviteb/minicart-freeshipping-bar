import { useQuery } from 'react-apollo'
import type { WatchQueryFetchPolicy } from 'apollo-client'

import SettingsQuery from '../graphql/getAppSettings.gql'

const GetAppSettings = (fetchPolicy?: WatchQueryFetchPolicy) => {
  // Example of VTEX_APP_ID: iviteb.learning@0.0.1
  const { VTEX_APP_ID, VTEX_APP_VERSION: version } = process.env
  const appName = VTEX_APP_ID ? VTEX_APP_ID.split('@')[0] : ''

  const { data, loading, error } = useQuery(SettingsQuery, {
    variables: {
      version,
      appName,
    },
    ssr: false,
    skip: !appName,
    fetchPolicy,
  })

  const settings = JSON.parse(data?.publicSettingsForApp.message ?? '{}')

  return { loading, settings, error }
}

export default GetAppSettings
