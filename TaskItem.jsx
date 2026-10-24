import { Check, Pencil, Trash2 } from "lucide-react";

export default function TaskItem({ task, onToggle, onEdit, onDelete }) {
  return (
    <div className={`task-item ${task.completed ? "is-complete" : ""}`}>
      <button
        className={`task-check ${task.completed ? "checked" : ""}`}
        onClick={() => onToggle(task.id)}
        aria-label={task.completed ? "Mark as pending" : "Mark as completed"}
      >
        {task.completed && <Check size={13} strokeWidth={2.8} />}
      </button>
      <div className="task-copy">
        <span className="task-title">{task.title}</span>
        <span className="task-meta">
          {task.completed ? "Completed" : "Pending"}
          {task.dueDate && (
            <>
              {" "}
              <span className="meta-separator">·</span> Due {task.dueDate}
            </>
          )}
        </span>
      </div>
      <div className="task-actions">
        <button onClick={() => onEdit(task)} aria-label="Edit task">
          <Pencil size={14} />
        </button>
        <button onClick={() => onDelete(task.id)} aria-label="Delete task">
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}
