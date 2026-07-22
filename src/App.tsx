import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import "./App.css"

import AppShell from './components/layout/AppShell'
import TodoView from './pages/TodoView'
import DayView from './pages/DayView'
import WeekView from './pages/WeekView'
import TagsView from './pages/TagsView'
import TaskView from './pages/TaskView'
import { TaskProvider } from './components/features/tasks/context/TaskContext'

function App() {
  return (
    <TaskProvider>
      <BrowserRouter>
        <AppShell>
          <Routes>
            <Route path="/" element={ <Navigate to="/plan" replace /> } />
            <Route path="/todo" element={ <TodoView /> } />
            <Route path="/plan" element={ <DayView /> } />
            <Route path="/week" element={ <WeekView /> } />
            <Route path="/tags" element={ <TagsView /> } />
            <Route path="/task" element={ <TaskView /> }>
              <Route path=":id" element={ <TaskView /> } />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AppShell>
      </BrowserRouter>
    </TaskProvider>
  )
}

export default App
