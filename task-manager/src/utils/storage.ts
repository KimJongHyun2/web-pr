import type { Task } from '../types/task'

const STORAGE_KEY: string = 'task-manager:tasks'

// 타입 가드: 알 수 없는 값(unknown)이 Task 형태인지 검사
const isTask = (value: unknown): value is Task => {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    typeof value.id === 'number' &&
    'title' in value &&
    typeof value.title === 'string' &&
    'completed' in value &&
    typeof value.completed === 'boolean'
  )
}

// 브라우저에 저장된 Task 목록 불러오기 (없거나 형식이 틀리면 fallback 사용)
export const loadTasks = (fallback: Task[]): Task[] => {
  try {
    const saved: string | null = localStorage.getItem(STORAGE_KEY)
    if (saved === null) {
      return fallback
    }

    const parsed: unknown = JSON.parse(saved)
    if (Array.isArray(parsed) && parsed.every(isTask)) {
      return parsed
    }
    return fallback
  } catch {
    return fallback
  }
}

// Task 목록을 브라우저에 저장
export const saveTasks = (tasks: Task[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
  } catch {
    // 저장 공간이 막혀 있어도 앱은 계속 동작해야 하므로 무시
  }
}
