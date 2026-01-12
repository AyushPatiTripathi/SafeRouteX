import { useRoute } from "../context/RouteContext"

export default function RouteInfo() {
  const { routeData, loading, error } = useRoute()

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        ⏳ Computing safest route…
      </div>
    )
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center text-red-600">
        ❌ {error}
      </div>
    )
  }

  if (!routeData) {
    return (
      <div className="h-full flex items-center justify-center text-gray-400">
        No route computed yet
      </div>
    )
  }

  return (
    <div className="h-full px-6 py-4 bg-white grid grid-cols-3 gap-6">
      {/* Cost */}
      <InfoCard
        label="Route Cost"
        value={routeData.cost}
        suffix="km"
      />

      {/* Risk */}
      <InfoCard
        label="Risky Districts"
        value={routeData.risk_nodes}
      />

      {/* Path */}
      <div className="col-span-3 bg-gray-50 rounded-xl p-4">
        <div className="text-sm text-gray-500 mb-1">
          Evacuation Path
        </div>
        <div className="text-sm font-medium text-gray-800">
          {routeData.route.join(" → ")}
        </div>
      </div>
    </div>
  )
}

/* ---------------------------------- */
/* Small reusable card component       */
/* ---------------------------------- */
function InfoCard({ label, value, suffix }) {
  return (
    <div className="bg-gray-50 rounded-xl p-4 text-center shadow-sm">
      <div className="text-sm text-gray-500">{label}</div>
      <div className="text-2xl font-bold text-gray-800 mt-1">
        {value}
        {suffix && (
          <span className="text-sm font-medium text-gray-500 ml-1">
            {suffix}
          </span>
        )}
      </div>
    </div>
  )
}

