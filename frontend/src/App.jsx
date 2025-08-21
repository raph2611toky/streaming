import { Routes, Route } from 'react-router-dom'
import Home from './components/home/Home'
import Streaming from './components/streaming/streaming'
import User from './components/user/user'
import Login from './components/auth/login'
import Register from './components/auth/register'
import Sidebar from './components/sidebar/sidebar'
const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/stream" element={<Streaming />} />
      <Route path="/profile" element={<User />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/sidebar" element={<Sidebar />}/>
    </Routes>
  )
}

export default App
