import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import DndContext from './context/DndContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <DndContext>
      <App />
    </DndContext>
  </StrictMode>,
)
