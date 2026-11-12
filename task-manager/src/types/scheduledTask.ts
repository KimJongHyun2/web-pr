import type { Task } from './task'

// 기존 Task 인터페이스는 그대로 두고, 날짜를 더한 타입으로 확장
export interface ScheduledTask extends Task {
  // 'YYYY-MM-DD' 형식의 날짜 (예: '2026-11-12')
  date: string
}
