import { createContext, useContext } from 'react'

const SessionContext = createContext(null)

export const SessionProvider = ({ user, children }) => (
  <SessionContext.Provider value={user}>{children}</SessionContext.Provider>
)

export const useSession = () => useContext(SessionContext)
