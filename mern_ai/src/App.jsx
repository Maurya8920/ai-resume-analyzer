import './App.css'
import SideBar from './component/SideBar/SideBar'
import { Routes, Route, useLocation } from 'react-router-dom';
import Dashboard from './component/Dashboard/Dashboard'
import History from './component/History/History'
import Admin from './component/Admin/Admin'
import Login from './component/Login/Login'

function App() {
  const location = useLocation();
  const isLoginPage = location.pathname === '/';

  return (
    <div className='App'>
      {!isLoginPage && <SideBar />}
      <div className={`appContent ${isLoginPage ? 'fullWidth' : ''}`}>
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/history' element={<History />} />
          <Route path='/admin' element={<Admin />} />
        </Routes>
      </div>
    </div>
  )
}

export default App
