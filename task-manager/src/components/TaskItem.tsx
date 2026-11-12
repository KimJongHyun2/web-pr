import { useState } from 'react'
import type { ScheduledTask } from '../types/scheduledTask'
import Icon from './Icon'

// TaskItem 컴포넌트가 받는 Props의 타입
interface TaskItemProps {
  task: ScheduledTask
  onToggle: (id: number) => void
  onDelete: (id: number) => void
  // 수정에 실패하면 오류 메시지, 성공하면 null 반환
  onEdit: (id: number, title: string, date: string) => string | null
}

function TaskItem({ task, onToggle, onDelete, onEdit }: TaskItemProps) {
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [draftTitle, setDraftTitle] = useState<string>('')
  const [draftDate, setDraftDate] = useState<string>('')
  const [editError, setEditError] = useState<string>('')

  // 수정 시작: 현재 제목과 날짜를 입력창에 채움
  const startEdit = (): void => {
    setDraftTitle(task.title)
    setDraftDate(task.date)
    setEditError('')
    setIsEditing(true)
  }

  // 수정 취소
  const cancelEdit = (): void => {
    setIsEditing(false)
    setEditError('')
  }

  // 수정 저장: 검증에 실패하면 오류 메시지를 보여주고 수정 상태 유지
  const saveEdit = (): void => {
    const errorMessage: string | null = onEdit(task.id, draftTitle, draftDate)
    if (errorMessage !== null) {
      setEditError(errorMessage)
      return
    }
    setIsEditing(false)
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setDraftTitle(e.target.value)
    setEditError('')
  }

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setDraftDate(e.target.value)
    setEditError('')
  }

  // Enter로 저장, Escape로 취소 (한글 조합 중에는 무시)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.nativeEvent.isComposing) {
      return
    }
    if (e.key === 'Enter') {
      saveEdit()
    }
    if (e.key === 'Escape') {
      cancelEdit()
    }
  }

  if (isEditing) {
    return (
      <li className="task-item editing">
        <input
          type="text"
          className="task-edit-input"
          value={draftTitle}
          onChange={handleTitleChange}
          onKeyDown={handleKeyDown}
          aria-label="할 일 수정"
          autoFocus
        />
        <input
          type="date"
          className="task-edit-date"
          value={draftDate}
          onChange={handleDateChange}
          onKeyDown={handleKeyDown}
          aria-label="날짜 변경"
        />
        <button
          type="button"
          className="icon-button save-button"
          title="저장"
          aria-label="저장"
          onClick={saveEdit}
        >
          <Icon name="check" />
        </button>
        <button
          type="button"
          className="icon-button"
          title="취소"
          aria-label="취소"
          onClick={cancelEdit}
        >
          <Icon name="close" />
        </button>
        {editError !== '' && <p className="edit-error">{editError}</p>}
      </li>
    )
  }

  return (
    <li className={task.completed ? 'task-item completed' : 'task-item'}>
      <label className="task-label">
        <input
          type="checkbox"
          className="task-checkbox"
          checked={task.completed}
          onChange={() => onToggle(task.id)}
        />
        <span className={task.completed ? 'task-title completed' : 'task-title'}>
          {task.title}
        </span>
      </label>
      <button
        type="button"
        className="icon-button edit-button"
        title="수정"
        aria-label={`${task.title} 수정`}
        onClick={startEdit}
      >
        <Icon name="edit" />
      </button>
      <button
        type="button"
        className="icon-button delete-button"
        title="삭제"
        aria-label={`${task.title} 삭제`}
        onClick={() => onDelete(task.id)}
      >
        <Icon name="trash" />
      </button>
    </li>
  )
}

export default TaskItem
