import Vault from "./pages/vault"
import Home from "./pages/landing"
import AuthPage from "./pages/auth"
import Dashboard from "./pages/dashboard"
import PasswordsPage from "./pages/passwords"
import PasswordGeneratorPage from "./pages/generator"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/vault" element={<Vault/>}/>
        <Route path="/auth" element={<AuthPage/>}/>
        <Route path="/dashboard" element={<Dashboard/>}/>
        <Route path="/passwords" element={<PasswordsPage/>}/>
        <Route path="/generator" element={<PasswordGeneratorPage/>}/>
      </Routes>
    </Router>
  )
}

export default App
