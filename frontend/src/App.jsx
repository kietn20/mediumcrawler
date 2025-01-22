import { useState } from 'react'
import { Hero } from './components/Hero'
import ImageStack from './components/ImageStack'
import { Collage } from './components/Collage'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Homepage } from './pages/Homepage'
import { Login } from './pages/Login'

function App() {

  return (
    <Router>
      <Routes>
        {/* <div className="snap-y snap-mandatory h-screen overflow-y-scroll bg-[#0A0B06] select-none">
          <div className="snap-center h-screen flex items-center justify-center">
            <Hero />
          </div>
          <div className="snap-center h-screen flex items-center justify-center">
            <ImageStack />
          </div>
          <div className="snap-center h-auto flex items-center justify-center">
            <Collage />
          </div>
      </div> */}
      <Route path="/" element={<Homepage />} />
      <Route path="login" element={<Login />} />
    </Routes>
    </Router >
  )
}

export default App
