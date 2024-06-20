import type { Session, SessionSuccess } from 'vtex.session-client'

// Type guard function
export const isSessionSuccess = (
  session: Session | undefined
): session is SessionSuccess => {
  return (session as SessionSuccess)?.namespaces !== undefined
}

export const getTotalizerValueById = (
  totalizers: Totalizer[],
  totalizerId: ValueTypes
) => {
  return totalizers?.find(({ id }) => id === totalizerId)?.value ?? 0
}
