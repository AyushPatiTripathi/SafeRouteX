import { useEffect, useState } from "react"
import { useRoute } from "../context/RouteContext"

const API = "http://localhost:8000"

export default function Sidebar() {
  const [districts, setDistricts] = useState([])
  const [start, setStart] = useState("")
  const [end, setEnd] = useState("")
  const [blocked, setBlocked] = useState([])

  const {
    setRouteData,
    setSafehouses,
    loading,
    setLoading,
    setError,
  } = useRoute()

  // -----------------------------
  // Fetch district list on load
  // -----------------------------
  useEffect(() => {
    fetch(`${API}/districts`)
      .then(res => res.json())
      .then(data => {
        setDistricts(data.districts || [])
        if (data.districts?.length > 1) {
          setStart(data.districts[0])
          setEnd(data.districts[1])
        }
      })
      .catch(() => setError("Failed to load districts"))
  }, [])

  // -----------------------------
  // Toggle disaster filter
  // -----------------------------
  function toggleBlocked(type) {
    setBlocked(prev =>
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    )
  }

  // -----------------------------
  // Compute evacuation route
  // -----------------------------
  async function computeRoute() {
    if (!start || !end) return

    setLoading(true)
    setError(null)
    setRouteData(null)
    setSafehouses([])

    try {
      const params = new URLSearchParams({
        start,
        end,
        k: 1,
      })

      blocked.forEach(b => params.append("blocked", b))

      const routeRes = await fetch(`${API}/route?${params}`)
      const routeData = await routeRes.json()

      if (routeData.error) {
        throw new Error(routeData.error)
      }

      setRouteData(routeData)

      // Fetch safehouses near destination
      const shRes = await fetch(
        `${API}/safehouses?district=${end}&k=3`
      )
      const shData = await shRes.json()

      setSafehouses(shData.safehouses || [])

    } catch (err) {
      setError(err.message || "Failed to compute route")
    } finally {
      setLoading(false)
    }
  }

  // -----------------------------
  // UI
  // -----------------------------
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">
        🚨 Evacuation Planner
      </h1>

      {/* Start District */}
      <div>
        <label className="block text-sm font-medium text-gray-600">
          Start District
        </label>
        <select
          className="w-full mt-1 border rounded-lg p-2 focus:ring-2 focus:ring-green-500"
          value={start}
          onChange={e => setStart(e.target.value)}
        >
          {districts.map(d => (
            <option key={d}>{d}</option>
          ))}
        </select>
      </div>

      {/* End District */}
      <div>
        <label className="block text-sm font-medium text-gray-600">
          Destination District
        </label>
        <select
          className="w-full mt-1 border rounded-lg p-2 focus:ring-2 focus:ring-green-500"
          value={end}
          onChange={e => setEnd(e.target.value)}
        >
          {districts.map(d => (
            <option key={d}>{d}</option>
          ))}
        </select>
      </div>

      {/* Disaster Filters */}
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-2">
          Block Disaster Types
        </label>

        {["flood", "landslide", "earthquake"].map(type => (
          <label
            key={type}
            className="flex items-center gap-2 text-sm text-gray-700 mb-1"
          >
            <input
              type="checkbox"
              checked={blocked.includes(type)}
              onChange={() => toggleBlocked(type)}
            />
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </label>
        ))}
      </div>

      {/* Compute Button */}
      <button
        onClick={computeRoute}
        disabled={loading}
        className={`w-full py-3 rounded-xl text-white font-semibold transition
          ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
          }`}
      >
        {loading ? "Computing Route..." : "🧭 Compute Evacuation Route"}
      </button>

      {/* Footer Hint */}
      <p className="text-xs text-gray-500 text-center">
        Routes are computed using real-time risk data
      </p>
    </div>
  )
}

