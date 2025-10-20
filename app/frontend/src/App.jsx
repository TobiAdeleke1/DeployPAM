import React from 'react'
import {Route, Routes, BrowserRouter } from 'react-router'
import MapView from './pages/MapView'
import './App.css';
import { LocationProvider } from './contexts/LocationContext';

function App() {

  return (
   <LocationProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MapView />}/>
      </Routes>
    </BrowserRouter>
   </LocationProvider>
  )
}

export default App
