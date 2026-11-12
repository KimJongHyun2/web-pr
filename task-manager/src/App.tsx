import type { Task } from './types/task'
import TaskItem from './components/TaskItem'
import './App.css'

// 샘플 Task 데이터
const sampleTasks: Task[] = [
  { id: 1, title: 'React 복습하기', completed: true },
  { id: 2, title: 'TypeScript 인터페이스 공부하기', completed: false },
  { id: 3, title: 'Task Manager 실습 완성하기', completed: false },
]

function App() {
  return (
    <div className="app">
      <h1>Task Manager</h1>

      <ul className="task-list">
        {sampleTasks.map((task) => (
          <TaskItem key={task.id} task={task} />
        ))}
      </ul>
    </div>
  )
}

export default App
