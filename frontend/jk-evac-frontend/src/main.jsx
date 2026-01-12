import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import { RouteProvider } from "./context/RouteContext"
import "./index.css"

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouteProvider>
      <App />
    </RouteProvider>
  </React.StrictMode>
)

