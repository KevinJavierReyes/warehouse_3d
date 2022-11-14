import React from 'react'
import ReactDOM from 'react-dom/client'
import { warehouse } from './data'
import './index.css'
import WarehouseHeatmap from './WarehouseHeatmap'


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <WarehouseHeatmap data={warehouse}/>
  </React.StrictMode>
)
