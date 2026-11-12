import { useEffect, useState } from 'react'
import type { ScheduledTask } from './types/scheduledTask'
import type { Filter } from './types/filter'
import TaskItem from './components/TaskItem'
import FilterTabs from './components/FilterTabs'
import Calendar from './components/Calendar'
import { loadTasks, saveTasks } from './utils/storage'
import { formatDateLabel, getTodayKey, isValidDateKey } from './utils/date'
import './App.css'

// 샘플 Task 데이터 (저장된 데이터가 없을 때 오늘 날짜로 처음 보여줌)
const createSampleTasks = (): ScheduledTask[] => {
  const todayKey: string = getTodayKey()

  return [
    { id: 1, title: 'React 복습하기', completed: true, date: todayKey },
    { id: 2, title: 'TypeScript 인터페이스 공부하기', completed: false, date: todayKey },
    { id: 3, title: 'Task Manager 실습 완성하기', completed: false, date: todayKey },
  ]
}

// Task 제목의 최대 글자 수
const MAX_TITLE_LENGTH: number = 50

// 필터별로 목록이 비었을 때 보여줄 문구
const EMPTY_MESSAGES: Record<Filter, string> = {
  all: '이 날에는 등록된 할 일이 없습니다. 새로운 할 일을 추가해보세요.',
  active: '이 날에는 진행 중인 할 일이 없습니다.',
  completed: '이 날에는 완료한 할 일이 없습니다.',
}

function App() {
  const [tasks, setTasks] = useState<ScheduledTask[]>(() => loadTasks(createSampleTasks()))
  const [input, setInput] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [filter, setFilter] = useState<Filter>('all')
  // 캘린더에서 선택한 날짜
  const [selectedDate, setSelectedDate] = useState<string>(() => getTodayKey())

  // tasks가 바뀔 때마다 브라우저에 저장
  useEffect(() => {
    saveTasks(tasks)
  }, [tasks])

  const todayKey: string = getTodayKey()

  // 전체 통계: 별도 state 없이 tasks 배열에서 계산
  const totalCount: number = tasks.length
  const completedCount: number = tasks.filter((task) => task.completed).length
  const remainingCount: number = totalCount - completedCount
  const progressPercent: number =
    totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100)

  // 선택한 날짜의 Task와 통계
  const dayTasks: ScheduledTask[] = tasks.filter((task) => task.date === selectedDate)
  const dayCompletedCount: number = dayTasks.filter((task) => task.completed).length

  // 선택한 날짜의 Task 중 현재 필터에 맞는 것만 출력
  const visibleTasks: ScheduledTask[] = dayTasks.filter((task) => {
    if (filter === 'active') {
      return !task.completed
    }
    if (filter === 'completed') {
      return task.completed
    }
    return true
  })

  // 입력값 검증: 문제가 있으면 오류 메시지, 없으면 null 반환
  // ignoreId: 수정 중인 Task는 중복 검사에서 제외
  const validateTask = (
    title: string,
    date: string,
    ignoreId: number | null = null,
  ): string | null => {
    const trimmed: string = title.trim()

    if (trimmed === '') {
      return '할 일을 입력해주세요.'
    }
    if (trimmed.length > MAX_TITLE_LENGTH) {
      return `할 일은 ${MAX_TITLE_LENGTH}자 이내로 입력해주세요.`
    }
    if (!isValidDateKey(date)) {
      return '날짜를 선택해주세요.'
    }
    // 같은 날짜에 같은 제목이 있으면 중복
    const isDuplicate: boolean = tasks.some(
      (task) => task.title === trimmed && task.date === date && task.id !== ignoreId,
    )
    if (isDuplicate) {
      return '같은 날짜에 이미 같은 할 일이 있습니다.'
    }
    return null
  }

  // 선택한 날짜에 새로운 Task 추가 (Create)
  const addTask = (title: string): void => {
    const errorMessage: string | null = validateTask(title, selectedDate)
    if (errorMessage !== null) {
      setError(errorMessage)
      return
    }

    const newTask: ScheduledTask = {
      id: Date.now(),
      title: title.trim(),
      completed: false,
      date: selectedDate,
    }
    setTasks([...tasks, newTask])
    setInput('')
    setError('')
    // 완료 목록만 보고 있으면 새 Task가 안 보이므로 전체 보기로 전환
    if (filter === 'completed') {
      setFilter('all')
    }
  }

  // 제목과 날짜 수정 (Update): 실패하면 오류 메시지, 성공하면 null 반환
  const editTask = (id: number, title: string, date: string): string | null => {
    const errorMessage: string | null = validateTask(title, date, id)
    if (errorMessage !== null) {
      return errorMessage
    }

    setTasks(
      tasks.map((task) => (task.id === id ? { ...task, title: title.trim(), date } : task)),
    )
    return null
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

  // 선택한 날짜의 완료된 Task 모두 삭제
  const clearCompleted = (): void => {
    setTasks(tasks.filter((task) => !(task.completed && task.date === selectedDate)))
  }

  // 캘린더에서 날짜를 골랐을 때
  const handleSelectDate = (date: string): void => {
    setSelectedDate(date)
    setError('')
  }

  // 입력창 값이 바뀔 때
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setInput(e.target.value)
    setError('')
  }

  // 입력창에서 Enter를 눌렀을 때 (한글 조합 중에는 무시)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
      addTask(input)
    }
  }

  // 추가 버튼을 눌렀을 때
  const handleAddClick = (): void => {
    addTask(input)
  }

  return (
    <div className="app">
      <header className="app-header">
        <p className="today">오늘 · {formatDateLabel(todayKey)}</p>
        <h1>Task Manager</h1>
      </header>

      <div className="layout">
        <aside className="panel sidebar">
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
            <span>전체 진행률</span>
            <span className="progress-percent">{progressPercent}%</span>
          </div>
          <div
            className="progress"
            role="progressbar"
            aria-label="전체 진행률"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={progressPercent}
          >
            <div className="progress-bar" style={{ width: `${progressPercent}%` }} />
          </div>

          <Calendar tasks={tasks} selectedDate={selectedDate} onSelectDate={handleSelectDate} />
        </aside>

        <main className="panel">
          <div className="day-header">
            <h2 className="day-title">
              {formatDateLabel(selectedDate)}
              {selectedDate === todayKey && <span className="badge">오늘</span>}
            </h2>
            <p className="day-summary">
              할 일 {dayTasks.length}개 · 완료 {dayCompletedCount}개
            </p>
          </div>

          <div className={error !== '' ? 'task-form has-error' : 'task-form'}>
            <input
              type="text"
              value={input}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              placeholder="할 일을 입력하고 Enter"
              aria-label="새 할 일"
            />
            <button type="button" onClick={handleAddClick}>
              추가
            </button>
          </div>
          {error !== '' && <p className="error">{error}</p>}

          <div className="toolbar">
            <FilterTabs current={filter} onChange={setFilter} />
            {dayCompletedCount > 0 && (
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
                onEdit={editTask}
              />
            ))}
          </ul>
          {visibleTasks.length === 0 && <p className="empty">{EMPTY_MESSAGES[filter]}</p>}

          <p className="footnote">변경 내용은 이 브라우저에 자동으로 저장됩니다.</p>
        </main>
      </div>
    </div>
  )
}

export default App
