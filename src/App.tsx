import { useState } from "react";
import Button from "./components/Button";
import StatsCard from "./components/StatsCard";
import TaskCard, { type Task } from "./components/TaskCard";
import TaskForm from "./components/TaskForm";

const INITIAL_TASKS: Task[] = [
  {
    id: 1,
    text: "Design the landing page mockup",
    completed: true,
    priority: "high",
    createdAt: "Today",
  },
  {
    id: 2,
    text: "Set up project repository on GitHub",
    completed: false,
    priority: "medium",
    createdAt: "Today",
  },
  {
    id: 3,
    text: "Write unit tests for authentication",
    completed: false,
    priority: "high",
    createdAt: "Yesterday",
  },
  {
    id: 4,
    text: "Update README documentation",
    completed: false,
    priority: "low",
    createdAt: "Yesterday",
  },
];

type Filter = "all" | "active" | "completed";

export default function App() {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [filter, setFilter] = useState<Filter>("all");
  const [nextId, setNextId] = useState(5);

  // --- Handlers ---
  const addTask = (text: string, priority: "low" | "medium" | "high") => {
    const newTask: Task = {
      id: nextId,
      text,
      completed: false,
      priority,
      createdAt: "Just now",
    };
    setTasks((prev) => [newTask, ...prev]);
    setNextId((n) => n + 1);
  };

  const toggleTask = (id: number) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const deleteTask = (id: number) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const clearCompleted = () => {
    setTasks((prev) => prev.filter((t) => !t.completed));
  };

  // --- Derived data ---
  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const active = total - completed;
  const highPriority = tasks.filter((t) => t.priority === "high" && !t.completed).length;

  const filteredTasks = tasks.filter((t) => {
    if (filter === "active") return !t.completed;
    if (filter === "completed") return t.completed;
    return true;
  });

  const filters: { key: Filter; label: string }[] = [
    { key: "all", label: "All" },
    { key: "active", label: "Active" },
    { key: "completed", label: "Done" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-indigo-50">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-200">
              <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900 sm:text-xl">TaskFlow</h1>
              <p className="hidden text-xs text-slate-400 sm:block">Stay organized, stay productive</p>
            </div>
          </div>

          {completed > 0 && (
            <Button variant="ghost" size="sm" onClick={clearCompleted}>
              Clear done ({completed})
            </Button>
          )}
        </div>
      </header>

      {/* Main content */}
      <main className="mx-auto max-w-3xl px-4 py-6 sm:px-6 sm:py-8">
        {/* Stats row */}
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          <StatsCard label="Total Tasks" value={total} icon="📋" color="indigo" />
          <StatsCard label="Completed" value={completed} icon="✅" color="emerald" />
          <StatsCard label="In Progress" value={active} icon="⏳" color="amber" />
          <StatsCard label="High Priority" value={highPriority} icon="🔥" color="red" />
        </div>

        {/* Add task form */}
        <div className="mb-6">
          <TaskForm onAdd={addTask} />
        </div>

        {/* Filter bar */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex gap-1 rounded-xl bg-slate-100 p-1">
            {filters.map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all duration-200 cursor-pointer sm:px-4 sm:text-sm ${
                  filter === f.key
                    ? "bg-white text-indigo-600 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
          <p className="text-xs text-slate-400">
            {filteredTasks.length} task{filteredTasks.length !== 1 && "s"}
          </p>
        </div>

        {/* Task list */}
        <div className="space-y-3">
          {filteredTasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 py-16 text-center">
              <span className="mb-3 text-5xl">
                {filter === "completed" ? "🎯" : filter === "active" ? "🎉" : "📝"}
              </span>
              <p className="text-sm font-medium text-slate-500">
                {filter === "completed"
                  ? "No completed tasks yet"
                  : filter === "active"
                  ? "All tasks are done — great job!"
                  : "No tasks yet — add one above!"}
              </p>
            </div>
          ) : (
            filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onToggle={toggleTask}
                onDelete={deleteTask}
              />
            ))
          )}
        </div>

        {/* Progress bar */}
        {total > 0 && (
          <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Progress
              </span>
              <span className="text-sm font-bold text-indigo-600">
                {total > 0 ? Math.round((completed / total) * 100) : 0}%
              </span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500 ease-out"
                style={{ width: `${total > 0 ? (completed / total) * 100 : 0}%` }}
              />
            </div>
            <p className="mt-2 text-center text-xs text-slate-400">
              {completed} of {total} tasks completed
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-100 py-6 text-center">
        <p className="text-xs text-slate-400">
          Built with React + Tailwind CSS · TaskFlow
        </p>
      </footer>
    </div>
  );
}
