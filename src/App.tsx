import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import "./App.css"

import AppShell from './components/layout/AppShell'
import TodoView from './pages/TodoView'
import PlanView from './pages/PlanView'
import SettingsPage from './pages/SettingsPage'
import TaskView from './pages/TaskView'
import { LoginScreen } from './pages/auth/LoginScreen'
import RequireAuth from './components/wrappers/RequireAuth'
import RedirectOnAuth from './components/wrappers/RedirectOnAuth'
import Providers from './context/Providers'
import useCurrentDate from './hooks/useCurrentDate'

function App() {

  // get current date on load
  const today = useCurrentDate();

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

              <Route path="/plan" element={ <PlanView /> }>
                <Route path=":date" element={ <PlanView /> } />
              </Route>

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
