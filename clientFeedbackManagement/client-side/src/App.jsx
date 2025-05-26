/* Routes */
import {BrowserRouter, Routes, Route} from "react-router-dom"
import Root from "./routes/Root"
import Login from "./routes/authentication/Login"
import Signup from "./routes/authentication/Signup"
import Client from "./routes/client/Client"

import './App.css'

function App() {

  return (
    <>
      <Root />
    </>
  )
}

export default App
