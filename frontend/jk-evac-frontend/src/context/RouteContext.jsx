import { createContext, useContext, useState } from "react"

const RouteContext = createContext()

export function RouteProvider({ children }) {
  const [routeData, setRouteData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [safehouses, setSafehouses] = useState([])


  return (
    <RouteContext.Provider
      value={{ routeData, setRouteData, safehouses, setSafehouses, loading, setLoading, error, setError }}
    >
      {children}
    </RouteContext.Provider>
  )
}

export function useRoute() {
  return useContext(RouteContext)
}
