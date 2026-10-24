import { useEffect, useMemo, useState } from "react";
import {
  AlarmClock,
  ArrowDownRight,
  ArrowUpRight,
  Check,
  CheckCheck,
  ChevronRight,
  Circle,
  ClipboardList,
  FileText,
  LayoutDashboard,
  ListTodo,
  Plus,
  Search,
  Sparkles,
  StickyNote,
  SunMoon,
  Trash2,
  X,
} from "lucide-react";
import TaskItem from "./components/TaskItem.jsx";
import NoteCard from "./components/NoteCard.jsx";

const starterTasks = [
  {
    id: 1,
    title: "Map out the week ahead",
    completed: false,
    dueDate: "",
    createdAt: Date.now() - 50000,
  },
  {
    id: 2,
    title: "Review lecture notes",
    completed: true,
    dueDate: "",
    createdAt: Date.now() - 90000,
  },
  {
    id: 3,
    title: "Finish project wireframe",
    completed: false,
    dueDate: "",
    createdAt: Date.now() - 120000,
  },
];
const starterNotes = [
  {
    id: 11,
    title: "Ideas worth keeping",
    body: "A little progress every day adds up. Keep the interface quiet, useful, and easy to return to.",
    category: "Ideas",
    updatedAt: Date.now() - 100000,
  },
  {
    id: 12,
    title: "Study sprint",
    body: "25 minutes of focus\\n5 minutes to reset\\nRepeat four times, then take a longer break.",
    category: "Study",
    updatedAt: Date.now() - 300000,
  },
  {
    id: 13,
    title: "Small reminders",
    body: "• Ask questions early\\n• Save a clean version\\n• Leave time to review",
    category: "Personal",
    updatedAt: Date.now() - 600000,
  },
];
const readStore = (key, fallback) => {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};
const formatDate = (date) =>
  new Intl.DateTimeFormat("en", { month: "short", day: "numeric" }).format(
    date,
  );

export default function App() {
  const [page, setPage] = useState("overview");
  const [tasks, setTasks] = useState(() =>
    readStore("shadowdesk-tasks", starterTasks),
  );
  const [notes, setNotes] = useState(() =>
    readStore("shadowdesk-notes", starterNotes),
  );
  const [filter, setFilter] = useState("All");
  const [taskInput, setTaskInput] = useState("");
  const [taskDue, setTaskDue] = useState("");
  const [editingTask, setEditingTask] = useState(null);
  const [search, setSearch] = useState("");
  const [noteEditor, setNoteEditor] = useState(null);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    localStorage.setItem("shadowdesk-tasks", JSON.stringify(tasks));
  }, [tasks]);
  useEffect(() => {
    localStorage.setItem("shadowdesk-notes", JSON.stringify(notes));
  }, [notes]);
  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(""), 2400);
    return () => clearTimeout(timer);
  }, [notice]);

  const completedCount = tasks.filter((task) => task.completed).length;
  const pendingCount = tasks.length - completedCount;
  const progress = tasks.length
    ? Math.round((completedCount / tasks.length) * 100)
    : 0;
  const filteredTasks = tasks.filter((task) => {
    if (filter === "Completed") return task.completed;
    if (filter === "Pending") return !task.completed;
    return true;
  });
  const filteredNotes = useMemo(
    () =>
      notes.filter((note) =>
        `${note.title} ${note.body} ${note.category}`
          .toLowerCase()
          .includes(search.toLowerCase()),
      ),
    [notes, search],
  );

  function addTask(event) {
    event.preventDefault();
    const title = taskInput.trim();
    if (!title) return;
    if (editingTask) {
      setTasks((current) =>
        current.map((task) =>
          task.id === editingTask ? { ...task, title, dueDate: taskDue } : task,
        ),
      );
      setNotice("Task updated");
      setEditingTask(null);
    } else {
      setTasks((current) => [
        {
          id: Date.now(),
          title,
          completed: false,
          dueDate: taskDue,
          createdAt: Date.now(),
        },
        ...current,
      ]);
      setNotice("Added to your list");
    }
    setTaskInput("");
    setTaskDue("");
  }
  function beginEditTask(task) {
    setEditingTask(task.id);
    setTaskInput(task.title);
    setTaskDue(task.dueDate || "");
    setPage("tasks");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function toggleTask(id) {
    setTasks((current) =>
      current.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task,
      ),
    );
  }
  function deleteTask(id) {
    setTasks((current) => current.filter((task) => task.id !== id));
    setNotice("Task removed");
  }
  function saveNote(event) {
    event.preventDefault();
    const title = noteEditor.title.trim();
    const body = noteEditor.body.trim();
    if (!title && !body) return;
    const note = {
      ...noteEditor,
      title: title || "Untitled note",
      body,
      updatedAt: Date.now(),
    };
    setNotes((current) =>
      note.id
        ? current.map((item) => (item.id === note.id ? note : item))
        : [{ ...note, id: Date.now() }, ...current],
    );
    setNoteEditor(null);
    setNotice(note.id ? "Note saved" : "Note created");
  }
  function deleteNote(id) {
    setNotes((current) => current.filter((note) => note.id !== id));
    setNotice("Note deleted");
  }
  const navItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "tasks", label: "To-do list", icon: ListTodo, count: pendingCount },
    {
      id: "notes",
      label: "Notes library",
      icon: StickyNote,
      count: notes.length,
    },
  ];

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <button
          className="brand"
          onClick={() => setPage("overview")}
          aria-label="Go to overview"
        >
          <span className="brand-mark" aria-hidden="true">
            <svg viewBox="0 0 44 44" role="img">
              <circle
                cx="22"
                cy="22"
                r="16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeDasharray="2.5 3.5"
              />
              <path
                d="M27 7.5a15 15 0 1 0 9.5 24.8A13 13 0 0 1 27 7.5Z"
                fill="currentColor"
              />
              <path
                d="M30 8.5l1.5-4 1.5 4 4 1.5-4 1.5-1.5 4-1.5-4-4-1.5Z"
                fill="#f5a58e"
              />
              <circle cx="10" cy="12" r="1.3" fill="#f5a58e" />
            </svg>
          </span>
          <span className="brand-copy">
            <strong>ShadowDesk</strong>
            <small>YOUR PERSONAL WORKSPACE</small>
          </span>
        </button>
        <div className="side-label">WORKSPACE</div>
        <nav className="nav-list" aria-label="Main navigation">
          {navItems.map(({ id, label, icon: Icon, count }) => (
            <button
              key={id}
              className={`nav-item ${page === id ? "active" : ""}`}
              onClick={() => setPage(id)}
            >
              <Icon size={18} />
              <span>{label}</span>
              {count !== undefined && (
                <span className="nav-count">{count}</span>
              )}
              {page === id && <span className="active-rail" />}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="focus-card">
            <span className="focus-icon">
              <Sparkles size={16} />
            </span>
            <p>
              Keep your mind
              <br />
              <strong>out of the tabs.</strong>
            </p>
            <span className="focus-orbit orbit-one" />
            <span className="focus-orbit orbit-two" />
          </div>
          <div className="profile-row">
            <div className="avatar">A</div>
            <div className="profile-text">
              <strong>Your field desk</strong>
              <small>Offline by default</small>
            </div>
            <SunMoon size={16} className="profile-sun" />
          </div>
        </div>
      </aside>

      <main className="main-panel">
        <header className="topbar">
          <div className="breadcrumb">
            <span>Workspace</span>
            <ChevronRight size={14} />
            <strong>
              {navItems.find((item) => item.id === page)?.label || "Overview"}
            </strong>
          </div>
          <div className="topbar-right">
            <span className="date-chip">
              <span className="live-dot" /> YOUR SPACE, AT YOUR PACE
            </span>
            <div className="top-avatar">A</div>
          </div>
        </header>

        <div className="page-content">
          {page === "overview" && (
            <>
              <section className="welcome-row">
                <div>
                  <div className="eyebrow">
                    <span className="eyebrow-line" /> THE DAILY FIELD NOTE{" "}
                    <span className="eyebrow-index">NO. 001</span>
                  </div>
                  <h1>
                    Make space for
                    <br />
                    <em>your next thought.</em>
                  </h1>
                  <p className="intro">
                    A small, steady place for the things you want to finish —
                    and the ideas you want to keep.
                  </p>
                </div>
                <div className="date-display">
                  <span>
                    {new Date().toLocaleDateString("en", { weekday: "long" })}
                  </span>
                  <strong>{new Date().getDate()}</strong>
                  <small>
                    {new Date().toLocaleDateString("en", {
                      month: "long",
                      year: "numeric",
                    })}
                  </small>
                </div>
              </section>
              <section className="stats-grid">
                <article className="stat-card stat-featured">
                  <div className="stat-top">
                    <span>Tasks completed</span>
                    <span className="stat-icon">
                      <CheckCheck size={17} />
                    </span>
                  </div>
                  <div className="stat-value">
                    {completedCount}
                    <small> / {tasks.length}</small>
                  </div>
                  <div className="progress-track">
                    <span style={{ width: `${progress}%` }} />
                  </div>
                  <div className="stat-foot">
                    {progress}% of your list is complete{" "}
                    <ArrowUpRight size={14} />
                  </div>
                </article>
                <article className="stat-card">
                  <div className="stat-top">
                    <span>Still on your plate</span>
                    <span className="stat-icon muted">
                      <AlarmClock size={17} />
                    </span>
                  </div>
                  <div className="stat-value">
                    {pendingCount.toString().padStart(2, "0")}
                  </div>
                  <div className="stat-foot muted-foot">
                    One step at a time.
                  </div>
                  <div className="stat-watermark">
                    <ClipboardList size={58} />
                  </div>
                </article>
                <article className="stat-card">
                  <div className="stat-top">
                    <span>Notes collected</span>
                    <span className="stat-icon muted">
                      <FileText size={17} />
                    </span>
                  </div>
                  <div className="stat-value">
                    {notes.length.toString().padStart(2, "0")}
                  </div>
                  <div className="stat-foot muted-foot">
                    Thoughts, safely kept.
                  </div>
                  <div className="stat-watermark">
                    <StickyNote size={58} />
                  </div>
                </article>
              </section>
              <section className="overview-grid">
                <div className="panel task-panel">
                  <div className="panel-heading">
                    <div>
                      <div className="section-kicker">STAY IN MOTION</div>
                      <h2>
                        Today's tasks{" "}
                        <span className="heading-count">{pendingCount}</span>
                      </h2>
                    </div>
                    <button
                      className="text-link"
                      onClick={() => setPage("tasks")}
                    >
                      View all <ArrowUpRight size={14} />
                    </button>
                  </div>
                  <form className="quick-add" onSubmit={addTask}>
                    <Plus size={18} />
                    <input
                      value={taskInput}
                      onChange={(e) => setTaskInput(e.target.value)}
                      placeholder="Add something to your list..."
                      aria-label="New task"
                    />
                    <button type="submit" aria-label="Add task">
                      <ArrowDownRight size={17} />
                    </button>
                  </form>
                  <div className="task-list">
                    {tasks.slice(0, 4).map((task) => (
                      <TaskItem
                        key={task.id}
                        task={task}
                        onToggle={toggleTask}
                        onEdit={beginEditTask}
                        onDelete={deleteTask}
                      />
                    ))}
                    {tasks.length === 0 && (
                      <EmptyState
                        icon={ListTodo}
                        title="A fresh start"
                        text="Add a task above to get moving."
                      />
                    )}
                  </div>
                  {tasks.length > 4 && (
                    <button
                      className="subtle-button full-button"
                      onClick={() => setPage("tasks")}
                    >
                      See all {tasks.length} tasks <ChevronRight size={15} />
                    </button>
                  )}
                </div>
                <div className="panel notes-panel">
                  <div className="panel-heading">
                    <div>
                      <div className="section-kicker">THOUGHTS, GATHERED</div>
                      <h2>Recent notes</h2>
                    </div>
                    <button
                      className="icon-button"
                      onClick={() => {
                        setNoteEditor({
                          title: "",
                          body: "",
                          category: "Personal",
                        });
                        setPage("notes");
                      }}
                      aria-label="Create a note"
                    >
                      <Plus size={17} />
                    </button>
                  </div>
                  <div className="mini-notes">
                    {notes.slice(0, 3).map((note, index) => (
                      <button
                        key={note.id}
                        className={`mini-note mini-note-${index % 3}`}
                        onClick={() => {
                          setNoteEditor(note);
                          setPage("notes");
                        }}
                      >
                        <span className="mini-note-dot" />
                        <span className="mini-note-copy">
                          <strong>{note.title || "Untitled note"}</strong>
                          <small>{note.body || "No additional text"}</small>
                        </span>
                        <ChevronRight size={15} />
                      </button>
                    ))}
                    {notes.length === 0 && (
                      <EmptyState
                        icon={StickyNote}
                        title="Nothing pinned yet"
                        text="Start a note and keep a thought close."
                      />
                    )}
                  </div>
                  <button
                    className="subtle-button full-button"
                    onClick={() => setPage("notes")}
                  >
                    Open notes library <ChevronRight size={15} />
                  </button>
                </div>
              </section>
              <footer className="page-footer">
                <span>SHADOWDESK / MAKE ROOM FOR WHAT MATTERS</span>
                <span>
                  YOUR NOTES STAY ON THIS DEVICE{" "}
                  <span className="footer-dot">✳</span>
                </span>
              </footer>
            </>
          )}

          {page === "tasks" && (
            <>
              <section className="page-title-row">
                <div>
                  <div className="eyebrow">
                    <span className="eyebrow-line" /> YOUR PERSONAL CHECKLIST
                  </div>
                  <h1>
                    One thing at a <em>time.</em>
                  </h1>
                  <p className="intro">
                    Get it out of your head and into a list you can trust.
                  </p>
                </div>
                <div className="large-count">
                  <strong>{pendingCount.toString().padStart(2, "0")}</strong>
                  <span>TO DO</span>
                </div>
              </section>
              <section className="panel full-panel">
                <div className="panel-heading">
                  <div>
                    <div className="section-kicker">TASK MANAGER</div>
                    <h2>{editingTask ? "Edit task" : "Your task list"}</h2>
                  </div>
                  <span className="small-status">
                    <span className="live-dot" /> SAVED LOCALLY
                  </span>
                </div>
                <form className="task-form" onSubmit={addTask}>
                  <label className="sr-only" htmlFor="task-title">
                    Task title
                  </label>
                  <input
                    id="task-title"
                    value={taskInput}
                    onChange={(e) => setTaskInput(e.target.value)}
                    placeholder="What needs your attention?"
                    required
                  />
                  <label className="due-field">
                    <span>Due date</span>
                    <input
                      type="date"
                      value={taskDue}
                      onChange={(e) => setTaskDue(e.target.value)}
                    />
                  </label>
                  <button className="primary-button" type="submit">
                    {editingTask ? <Check size={16} /> : <Plus size={16} />}
                    {editingTask ? "Save changes" : "Add task"}
                  </button>
                  {editingTask && (
                    <button
                      className="icon-button"
                      type="button"
                      onClick={() => {
                        setEditingTask(null);
                        setTaskInput("");
                        setTaskDue("");
                      }}
                      aria-label="Cancel editing"
                    >
                      <X size={17} />
                    </button>
                  )}
                </form>
                <div className="filter-row">
                  {["All", "Pending", "Completed"].map((item) => (
                    <button
                      key={item}
                      className={`filter-pill ${filter === item ? "selected" : ""}`}
                      onClick={() => setFilter(item)}
                    >
                      {item}
                      <span>
                        {item === "All"
                          ? tasks.length
                          : item === "Pending"
                            ? pendingCount
                            : completedCount}
                      </span>
                    </button>
                  ))}
                </div>
                <div className="task-list spacious">
                  {filteredTasks.map((task) => (
                    <TaskItem
                      key={task.id}
                      task={task}
                      onToggle={toggleTask}
                      onEdit={beginEditTask}
                      onDelete={deleteTask}
                    />
                  ))}
                  {filteredTasks.length === 0 && (
                    <EmptyState
                      icon={Circle}
                      title="Nothing in this view"
                      text="Try another filter, or add a new task above."
                    />
                  )}
                </div>
              </section>
            </>
          )}

          {page === "notes" && (
            <>
              <section className="page-title-row">
                <div>
                  <div className="eyebrow">
                    <span className="eyebrow-line" /> YOUR SECOND BRAIN
                  </div>
                  <h1>
                    Keep the <em>good thoughts.</em>
                  </h1>
                  <p className="intro">
                    A little library for the things you don't want to lose.
                  </p>
                </div>
                <button
                  className="primary-button new-note-button"
                  onClick={() =>
                    setNoteEditor({ title: "", body: "", category: "Personal" })
                  }
                >
                  <Plus size={16} /> New note
                </button>
              </section>
              <div className="notes-toolbar">
                <div className="search-box">
                  <Search size={17} />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search notes, words, ideas..."
                    aria-label="Search notes"
                  />
                  {search && (
                    <button
                      onClick={() => setSearch("")}
                      aria-label="Clear search"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
                <span>
                  {filteredNotes.length}{" "}
                  {filteredNotes.length === 1 ? "NOTE" : "NOTES"} IN YOUR
                  LIBRARY
                </span>
              </div>
              <section className="notes-grid">
                {filteredNotes.map((note, index) => (
                  <NoteCard
                    key={note.id}
                    note={note}
                    index={index}
                    onEdit={() => setNoteEditor(note)}
                    onDelete={() => deleteNote(note.id)}
                  />
                ))}
                {filteredNotes.length === 0 && (
                  <div className="panel notes-empty">
                    <EmptyState
                      icon={Search}
                      title="No thoughts found"
                      text="Try a different search or create a new note."
                    />
                  </div>
                )}
              </section>
            </>
          )}
        </div>
      </main>

      {notice && (
        <div className="toast">
          <span className="toast-check">
            <Check size={14} />
          </span>
          {notice}
        </div>
      )}
      {noteEditor && (
        <div
          className="modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setNoteEditor(null);
          }}
        >
          <form className="note-modal" onSubmit={saveNote}>
            <div className="modal-top">
              <div>
                <div className="section-kicker">
                  {noteEditor.id ? "REFINE YOUR THOUGHT" : "CAPTURE A THOUGHT"}
                </div>
                <h2>{noteEditor.id ? "Edit note" : "A new note"}</h2>
              </div>
              <button
                type="button"
                className="icon-button"
                onClick={() => setNoteEditor(null)}
                aria-label="Close editor"
              >
                <X size={18} />
              </button>
            </div>
            <label className="field-label" htmlFor="note-title">
              TITLE
            </label>
            <input
              id="note-title"
              className="modal-input"
              autoFocus
              value={noteEditor.title}
              onChange={(e) =>
                setNoteEditor({ ...noteEditor, title: e.target.value })
              }
              placeholder="Give this thought a name..."
            />
            <label className="field-label" htmlFor="note-category">
              COLLECTION
            </label>
            <select
              id="note-category"
              className="modal-input"
              value={noteEditor.category}
              onChange={(e) =>
                setNoteEditor({ ...noteEditor, category: e.target.value })
              }
            >
              {["Personal", "Study", "Ideas", "Work", "Journal"].map(
                (category) => (
                  <option key={category}>{category}</option>
                ),
              )}
            </select>
            <label className="field-label" htmlFor="note-body">
              YOUR NOTE
            </label>
            <textarea
              id="note-body"
              className="modal-input note-body-input"
              value={noteEditor.body}
              onChange={(e) =>
                setNoteEditor({ ...noteEditor, body: e.target.value })
              }
              placeholder="Write it down before it drifts away..."
              rows={7}
            />
            <div className="modal-footer">
              <span>Saved on this device</span>
              <button type="submit" className="primary-button">
                <Check size={16} /> Save note
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

function EmptyState({ icon: Icon, title, text }) {
  return (
    <div className="empty-state">
      <span>
        <Icon size={19} />
      </span>
      <strong>{title}</strong>
      <p>{text}</p>
    </div>
  );
}
