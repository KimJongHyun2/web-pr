import { useState } from 'react'
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
  const [tasks, setTasks] = useState<Task[]>(sampleTasks)
  const [input, setInput] = useState<string>('')

  // 새로운 Task 추가
  const addTask = (title: string): void => {
    const newTask: Task = {
      id: Date.now(),
      title: title,
      completed: false,
    }
    setTasks([...tasks, newTask])
    setInput('')
  }

  // 입력창 값이 바뀔 때
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setInput(e.target.value)
  }

  // 추가 버튼을 눌렀을 때
  const handleAddClick = (): void => {
    addTask(input)
  }

  return (
    <div className="app">
      <h1>Task Manager</h1>

      <div className="task-form">
        <input
          type="text"
          value={input}
          onChange={handleChange}
          placeholder="할 일을 입력하세요"
        />
        <button type="button" onClick={handleAddClick}>
          추가
        </button>
      </div>

      <ul className="task-list">
        {tasks.map((task) => (
          <TaskItem key={task.id} task={task} />
        ))}
      </ul>
    </div>
  )
}

export default App
