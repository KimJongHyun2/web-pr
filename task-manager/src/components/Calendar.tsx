import { useState } from 'react'
import type { ScheduledTask } from '../types/scheduledTask'
import { formatDateLabel, fromDateKey, getCalendarDays, getTodayKey } from '../utils/date'
import Icon from './Icon'

interface CalendarProps {
  tasks: ScheduledTask[]
  selectedDate: string
  onSelectDate: (date: string) => void
}

// 하루치 할 일 요약
interface DaySummary {
  total: number
  completed: number
}

const WEEKDAYS: string[] = ['일', '월', '화', '수', '목', '금', '토']

// 날짜 칸에 표시할 점의 최대 개수
const MAX_DOTS: number = 3

// 날짜별 할 일 개수 계산
const summarizeByDate = (tasks: ScheduledTask[]): Map<string, DaySummary> => {
  const summary = new Map<string, DaySummary>()

  for (const task of tasks) {
    const current: DaySummary = summary.get(task.date) ?? { total: 0, completed: 0 }
    summary.set(task.date, {
      total: current.total + 1,
      completed: current.completed + (task.completed ? 1 : 0),
    })
  }
  return summary
}

// 날짜 키가 속한 달의 1일
const getMonthStart = (dateKey: string): Date => {
  const date: Date = fromDateKey(dateKey)
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

function Calendar({ tasks, selectedDate, onSelectDate }: CalendarProps) {
  // 지금 화면에 보여주는 달 (그 달의 1일)
  const [viewMonth, setViewMonth] = useState<Date>(() => getMonthStart(selectedDate))

  const year: number = viewMonth.getFullYear()
  const month: number = viewMonth.getMonth()
  const todayKey: string = getTodayKey()
  const days: string[] = getCalendarDays(year, month)
  const summaryByDate: Map<string, DaySummary> = summarizeByDate(tasks)

  // 이전 달(-1) / 다음 달(+1)로 이동
  const moveMonth = (offset: number): void => {
    setViewMonth(new Date(year, month + offset, 1))
  }

  // 날짜 선택: 다른 달의 날짜를 누르면 그 달로 이동
  const selectDate = (dateKey: string): void => {
    onSelectDate(dateKey)
    setViewMonth(getMonthStart(dateKey))
  }

  // 날짜 칸의 className 만들기
  const getDayClassName = (dateKey: string, index: number): string => {
    const names: string[] = [
      'calendar-day',
      fromDateKey(dateKey).getMonth() !== month ? 'outside' : '',
      index % 7 === 0 ? 'sunday' : '',
      index % 7 === 6 ? 'saturday' : '',
      dateKey === todayKey ? 'today' : '',
      dateKey === selectedDate ? 'selected' : '',
    ]
    return names.filter((name) => name !== '').join(' ')
  }

  return (
    <section className="calendar" aria-label="캘린더">
      <div className="calendar-header">
        <h2 className="calendar-title">
          {year}년 {month + 1}월
        </h2>
        <div className="calendar-nav">
          <button type="button" className="calendar-today" onClick={() => selectDate(todayKey)}>
            오늘
          </button>
          <button
            type="button"
            className="icon-button"
            title="이전 달"
            aria-label="이전 달"
            onClick={() => moveMonth(-1)}
          >
            <Icon name="prev" />
          </button>
          <button
            type="button"
            className="icon-button"
            title="다음 달"
            aria-label="다음 달"
            onClick={() => moveMonth(1)}
          >
            <Icon name="next" />
          </button>
        </div>
      </div>

      <div className="calendar-weekdays" aria-hidden="true">
        {WEEKDAYS.map((weekday) => (
          <span key={weekday}>{weekday}</span>
        ))}
      </div>

      <div className="calendar-grid">
        {days.map((dateKey, index) => {
          const summary: DaySummary = summaryByDate.get(dateKey) ?? { total: 0, completed: 0 }
          const remaining: number = summary.total - summary.completed
          const dotCount: number = Math.min(summary.total, MAX_DOTS)
          const label: string =
            summary.total === 0
              ? formatDateLabel(dateKey)
              : `${formatDateLabel(dateKey)}, 할 일 ${summary.total}개 중 ${summary.completed}개 완료`

          return (
            <button
              key={dateKey}
              type="button"
              className={getDayClassName(dateKey, index)}
              data-date={dateKey}
              aria-label={label}
              aria-pressed={dateKey === selectedDate}
              aria-current={dateKey === todayKey ? 'date' : undefined}
              onClick={() => selectDate(dateKey)}
            >
              <span className="day-number">{fromDateKey(dateKey).getDate()}</span>
              <span className="day-dots">
                {/* 남은 할 일을 먼저, 완료한 할 일을 흐리게 표시 */}
                {Array.from({ length: dotCount }, (_, dotIndex: number) => (
                  <span
                    key={dotIndex}
                    className={dotIndex < remaining ? 'day-dot' : 'day-dot done'}
                  />
                ))}
                {summary.total > MAX_DOTS && <span className="day-more">+</span>}
              </span>
            </button>
          )
        })}
      </div>
    </section>
  )
}

export default Calendar
