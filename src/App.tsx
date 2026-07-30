import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import "./App.css"

import AppShell from './components/layout/AppShell'
import TodoView from './pages/TodoView'
import DayView from './pages/DayView'
import WeekView from './pages/WeekView'
import TagsView from './pages/TagsView'
import TaskView from './pages/TaskView'
import { ScheduleItemProvider } from './context/ScheduleItemContext'
import { useEffect, useState } from 'react'
import { getCurrentUserId, onAuthChange } from './utils/backend/auth'
import { LoginScreen } from './pages/auth/LoginScreen'
import { AuthProvider } from './context/AuthContext'
import RequireAuth from './components/wrappers/RequireAuth'

function App() {
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // authenticate -> sync
  /*useEffect(() => {
    getCurrentUserId().then((id) => {
      setUserId(id);
      setLoading(false);
    });

    const { data: subscription } = onAuthChange((id) => setUserId(id));
    return () => subscription.subscription.unsubscribe();
  }, []);

  if(loading) return <div>Loading...</div>
  if(!userId) return <LoginScreen />*/

  return (
    <AuthProvider>
      <ScheduleItemProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginScreen />} />
            <Route element={<RequireAuth />}>
              <Route element={<AppShell />}>
                <Route path="/" element={ <Navigate to="/plan" replace /> } />
                <Route path="/todo" element={ <TodoView /> } />
                <Route path="/plan" element={ <DayView /> } />
                <Route path="/week" element={ <WeekView /> } />
                <Route path="/tags" element={ <TagsView /> } />
                <Route path="/task" element={ <TaskView /> }>
                  <Route path=":id" element={ <TaskView /> } />
                </Route>
                <Route path="*" element={<Navigate to="/" replace />} />
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </ScheduleItemProvider>
    </AuthProvider>
  )
}

export default App
