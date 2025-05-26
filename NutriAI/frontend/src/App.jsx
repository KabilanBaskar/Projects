import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import RecommendationPage from './pages/RecommendationPage'
import TablePage from './pages/TablePage'
import TrackPage from './pages/TrackPage'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import './App.css'

function App() {

  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<RegisterPage/>}/> 
      <Route path='/login' element={<LoginPage/>}/>
      <Route path='/recommendFood' element={<RecommendationPage/>} />
      <Route path='/table' element={<TablePage/>} />
      <Route path='/track' element={<TrackPage/>} />
    </Routes>
    </BrowserRouter>
  )
}

export default App
