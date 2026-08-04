import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import "./App.css"

import AppShell from './components/layout/AppShell'
import TodoView from './pages/TodoView'
import DayView from './pages/DayView'
import WeekView from './pages/WeekView'
import SettingsPage from './pages/SettingsPage'
import TaskView from './pages/TaskView'
import { LoginScreen } from './pages/auth/LoginScreen'
import RequireAuth from './components/wrappers/RequireAuth'
import RedirectOnAuth from './components/wrappers/RedirectOnAuth'
import Providers from './context/Providers'

function App() {

  return (
    <Providers>
      <BrowserRouter>
        <Routes>
          <Route element={<RedirectOnAuth />}>
            <Route path="/login" element={<LoginScreen />} />
          </Route>
          <Route element={<RequireAuth />}>
            <Route element={<AppShell />}>
              <Route path="/" element={ <Navigate to="/plan" replace /> } />
              <Route path="/todo" element={ <TodoView /> } />
              <Route path="/plan" element={ <DayView /> } />
              <Route path="/week" element={ <WeekView /> } />
              <Route path="/settings" element={ <SettingsPage /> } />
              <Route path="/task" element={ <TaskView /> }>
                <Route path=":id" element={ <TaskView /> } />
              </Route>
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </Providers>
  )
}

export default App
