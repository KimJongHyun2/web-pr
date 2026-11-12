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

// Task 제목의 최대 글자 수
const MAX_TITLE_LENGTH: number = 50

function App() {
  const [tasks, setTasks] = useState<Task[]>(sampleTasks)
  const [input, setInput] = useState<string>('')
  const [error, setError] = useState<string>('')

  // 통계: 별도 state 없이 tasks 배열에서 계산
  const totalCount: number = tasks.length
  const completedCount: number = tasks.filter((task) => task.completed).length

  // 입력값 검증: 문제가 있으면 오류 메시지, 없으면 null 반환
  const validateTitle = (title: string): string | null => {
    const trimmed: string = title.trim()

    if (trimmed === '') {
      return '할 일을 입력해주세요.'
    }
    if (trimmed.length > MAX_TITLE_LENGTH) {
      return `할 일은 ${MAX_TITLE_LENGTH}자 이내로 입력해주세요.`
    }
    if (tasks.some((task) => task.title === trimmed)) {
      return '이미 같은 할 일이 있습니다.'
    }
    return null
  }

  // 새로운 Task 추가 (Create)
  const addTask = (title: string): void => {
    const errorMessage: string | null = validateTitle(title)
    if (errorMessage !== null) {
      setError(errorMessage)
      return
    }

    const newTask: Task = {
      id: Date.now(),
      title: title.trim(),
      completed: false,
    }
    setTasks([...tasks, newTask])
    setInput('')
    setError('')
  }

  // 완료 상태 변경 (Update)
  const toggleTask = (id: number): void => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task,
      ),
    )
  }

  // Task 삭제 (Delete)
  const deleteTask = (id: number): void => {
    setTasks(tasks.filter((task) => task.id !== id))
  }

  // 입력창 값이 바뀔 때
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setInput(e.target.value)
    setError('')
  }

  // 추가 버튼을 눌렀을 때
  const handleAddClick = (): void => {
    addTask(input)
  }

  return (
    <div className="app">
      <h1>Task Manager</h1>

      <p className="stats">
        전체 {totalCount}개 · 완료 {completedCount}개
      </p>

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
      {error !== '' && <p className="error">{error}</p>}

      <ul className="task-list">
        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onToggle={toggleTask}
            onDelete={deleteTask}
          />
        ))}
      </ul>
      {totalCount === 0 && <p className="empty">등록된 할 일이 없습니다.</p>}
    </div>
  )
}

export default App
