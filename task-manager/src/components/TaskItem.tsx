import type { Task } from '../types/task'

// TaskItem 컴포넌트가 받는 Props의 타입
interface TaskItemProps {
  task: Task
  onToggle: (id: number) => void
  onDelete: (id: number) => void
}

function TaskItem({ task, onToggle, onDelete }: TaskItemProps) {
  return (
    <li className="task-item">
      <label className="task-label">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggle(task.id)}
        />
        <span className={task.completed ? 'task-title completed' : 'task-title'}>
          {task.title}
        </span>
      </label>
      <button type="button" className="delete-button" onClick={() => onDelete(task.id)}>
        삭제
      </button>
    </li>
  )
}

export default TaskItem
