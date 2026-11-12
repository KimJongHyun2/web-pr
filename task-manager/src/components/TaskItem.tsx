import type { Task } from '../types/task'

// TaskItem 컴포넌트가 받는 Props의 타입
interface TaskItemProps {
  task: Task
}

function TaskItem({ task }: TaskItemProps) {
  return (
    <li className="task-item">
      <span>{task.completed ? '✅' : '⬜'}</span>
      <span className="task-title">{task.title}</span>
    </li>
  )
}

export default TaskItem
