import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App.jsx"
import { BrowserRouter } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter> {/* C’est ça qui manque sûrement chez toi */}
      <App />
    </BrowserRouter>
    
  </React.StrictMode>,
)