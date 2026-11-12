import { useEffect, useState } from 'react'
import type { Task } from './types/task'
import type { Filter } from './types/filter'
import TaskItem from './components/TaskItem'
import FilterTabs from './components/FilterTabs'
import { loadTasks, saveTasks } from './utils/storage'
import './App.css'

// 샘플 Task 데이터 (저장된 데이터가 없을 때 처음 보여줌)
const sampleTasks: Task[] = [
  { id: 1, title: 'React 복습하기', completed: true },
  { id: 2, title: 'TypeScript 인터페이스 공부하기', completed: false },
  { id: 3, title: 'Task Manager 실습 완성하기', completed: false },
]

// Task 제목의 최대 글자 수
const MAX_TITLE_LENGTH: number = 50

// 필터별로 목록이 비었을 때 보여줄 문구
const EMPTY_MESSAGES: Record<Filter, string> = {
  all: '등록된 할 일이 없습니다. 새로운 할 일을 추가해보세요.',
  active: '진행 중인 할 일이 없습니다.',
  completed: '완료한 할 일이 없습니다.',
}

// 오늘 날짜 (예: 11월 12일 목요일)
const today: string = new Date().toLocaleDateString('ko-KR', {
  month: 'long',
  day: 'numeric',
  weekday: 'long',
})

function App() {
  const [tasks, setTasks] = useState<Task[]>(() => loadTasks(sampleTasks))
  const [input, setInput] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [filter, setFilter] = useState<Filter>('all')

  // tasks가 바뀔 때마다 브라우저에 저장
  useEffect(() => {
    saveTasks(tasks)
  }, [tasks])

  // 통계: 별도 state 없이 tasks 배열에서 계산
  const totalCount: number = tasks.length
  const completedCount: number = tasks.filter((task) => task.completed).length
  const remainingCount: number = totalCount - completedCount
  const progressPercent: number =
    totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100)

  // 현재 필터에 맞는 Task만 골라서 출력
  const visibleTasks: Task[] = tasks.filter((task) => {
    if (filter === 'active') {
      return !task.completed
    }
    if (filter === 'completed') {
      return task.completed
    }
    return true
  })

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
    // 완료 목록만 보고 있으면 새 Task가 안 보이므로 전체 보기로 전환
    if (filter === 'completed') {
      setFilter('all')
    }
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

  // 완료된 Task 모두 삭제
  const clearCompleted = (): void => {
    setTasks(tasks.filter((task) => !task.completed))
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
      <header>
        <p className="today">{today}</p>
        <h1>Task Manager</h1>
      </header>

      <div className="stats">
        <div className="stat">
          <span className="stat-label">전체</span>
          <strong className="stat-value">{totalCount}개</strong>
        </div>
        <div className="stat">
          <span className="stat-label">완료</span>
          <strong className="stat-value">{completedCount}개</strong>
        </div>
        <div className="stat">
          <span className="stat-label">남음</span>
          <strong className="stat-value">{remainingCount}개</strong>
        </div>
      </div>

      <div className="progress-header">
        <span>진행률</span>
        <span className="progress-percent">{progressPercent}%</span>
      </div>
      <div
        className="progress"
        role="progressbar"
        aria-label="진행률"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progressPercent}
      >
        <div className="progress-bar" style={{ width: `${progressPercent}%` }} />
      </div>

      <div className={error !== '' ? 'task-form has-error' : 'task-form'}>
        <input
          type="text"
          value={input}
          onChange={handleChange}
          placeholder="할 일을 입력하세요"
          aria-label="새 할 일"
        />
        <button type="button" onClick={handleAddClick}>
          추가
        </button>
      </div>
      {error !== '' && <p className="error">{error}</p>}

      <div className="toolbar">
        <FilterTabs current={filter} onChange={setFilter} />
        {completedCount > 0 && (
          <button type="button" className="clear-button" onClick={clearCompleted}>
            완료 항목 삭제
          </button>
        )}
      </div>

      <ul className="task-list">
        {visibleTasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onToggle={toggleTask}
            onDelete={deleteTask}
          />
        ))}
      </ul>
      {visibleTasks.length === 0 && <p className="empty">{EMPTY_MESSAGES[filter]}</p>}

      <p className="footnote">변경 내용은 이 브라우저에 자동으로 저장됩니다.</p>
    </div>
  )
}

export default App
