import type { Task } from '../types/task'

// TaskItem 컴포넌트가 받는 Props의 타입
interface TaskItemProps {
  task: Task
  onToggle: (id: number) => void
  onDelete: (id: number) => void
}

function TaskItem({ task, onToggle, onDelete }: TaskItemProps) {
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
        className="delete-button"
        title="삭제"
        aria-label={`${task.title} 삭제`}
        onClick={() => onDelete(task.id)}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M3 6h18" />
          <path d="M8 6V4h8v2" />
          <path d="M19 6l-1 14H6L5 6" />
          <path d="M10 11v5" />
          <path d="M14 11v5" />
        </svg>
      </button>
    </li>
  )
}

export default TaskItem
