import React from "react"
import { Auth } from "./Auth"
import { Intro } from "./Intro"
import { AuthProvider } from "./AuthContext"

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <Auth />
        <Intro />
      </AuthProvider>
    </div>
  )
}

export default App
