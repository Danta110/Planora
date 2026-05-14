import { useEffect, useMemo, useState } from 'react';
import {
  CheckCircle2,
  Circle,
  ClipboardList,
  Loader2,
  Pencil,
  Plus,
  Search,
  Sparkles,
  Trash2,
  X
} from 'lucide-react';
import { taskApi } from './api.js';

const emptyForm = {
  title: '',
  description: '',
  status: 'pending'
};

function App() {
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');

  const completedCount = tasks.filter((task) => task.status === 'completed').length;
  const pendingCount = tasks.length - completedCount;

  const filteredTasks = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return tasks;

    return tasks.filter((task) => {
      return (
        task.title.toLowerCase().includes(term) ||
        task.description.toLowerCase().includes(term) ||
        task.status.toLowerCase().includes(term)
      );
    });
  }, [query, tasks]);

  async function loadTasks() {
    try {
      setLoading(true);
      setError('');
      const data = await taskApi.getTasks();
      setTasks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTasks();
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!form.title.trim()) {
      setError('Task title is required.');
      return;
    }

    try {
      setSaving(true);
      setError('');

      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        status: form.status
      };

      if (editingId) {
        const updated = await taskApi.updateTask(editingId, payload);
        setTasks((current) => current.map((task) => (task.id === editingId ? updated : task)));
      } else {
        const created = await taskApi.createTask(payload);
        setTasks((current) => [created, ...current]);
      }

      resetForm();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  function startEdit(task) {
    setEditingId(task.id);
    setForm({
      title: task.title,
      description: task.description,
      status: task.status
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function toggleComplete(task) {
    try {
      setError('');
      const updated = await taskApi.updateTask(task.id, {
        ...task,
        status: task.status === 'completed' ? 'pending' : 'completed'
      });
      setTasks((current) => current.map((item) => (item.id === task.id ? updated : item)));
    } catch (err) {
      setError(err.message);
    }
  }

  async function deleteTask(id) {
    const confirmed = window.confirm('Delete this task?');
    if (!confirmed) return;

    try {
      setError('');
      await taskApi.deleteTask(id);
      setTasks((current) => current.filter((task) => task.id !== id));
      if (editingId === id) resetForm();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,#d9ecff_0,#eef3f8_34%,#f8fafc_100%)] px-4 py-6 sm:px-6 lg:px-8">
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <header className="flex flex-col gap-5 rounded-[28px] bg-slate-950 px-6 py-7 text-white shadow-soft sm:px-8 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm font-medium text-sky-100">
              <Sparkles size={16} />
              College mini project
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Planora</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
              A clean task management dashboard with full CRUD operations, completion tracking,
              and a local SQLite database.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center sm:min-w-[340px]">
            <StatCard label="Total" value={tasks.length} tone="bg-white text-slate-950" />
            <StatCard label="Pending" value={pendingCount} tone="bg-amber-300 text-amber-950" />
            <StatCard label="Done" value={completedCount} tone="bg-emerald-300 text-emerald-950" />
          </div>
        </header>

        {error ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
            {error}
          </div>
        ) : null}

        <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
          <section className="h-fit rounded-[24px] bg-white p-5 shadow-soft">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-950">
                  {editingId ? 'Edit Task' : 'Create Task'}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  {editingId ? 'Update the selected task details.' : 'Add a new task to your board.'}
                </p>
              </div>
              {editingId ? (
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-full bg-slate-100 p-2 text-slate-600 transition hover:bg-slate-200"
                  aria-label="Cancel editing"
                >
                  <X size={18} />
                </button>
              ) : null}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <label className="block">
                <span className="text-sm font-semibold text-slate-700">Title</span>
                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Example: Submit database report"
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100"
                />
              </label>

              <label className="block">
                <span className="text-sm font-semibold text-slate-700">Description</span>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Write a short task description"
                  rows="5"
                  className="mt-2 w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100"
                />
              </label>

              <label className="block">
                <span className="text-sm font-semibold text-slate-700">Status</span>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100"
                >
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                </select>
              </label>

              <button
                type="submit"
                disabled={saving}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-600 px-5 py-3 font-bold text-white shadow-lg shadow-sky-500/25 transition hover:translate-y-[-1px] hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70"
              >
                {saving ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />}
                {saving ? 'Saving...' : editingId ? 'Save Changes' : 'Add Task'}
              </button>
            </form>
          </section>

          <section className="rounded-[24px] bg-white p-5 shadow-soft">
            <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-950">Tasks</h2>
                <p className="mt-1 text-sm text-slate-500">Manage your work from one simple board.</p>
              </div>

              <label className="relative block sm:w-72">
                <Search
                  size={18}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search tasks"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100"
                />
              </label>
            </div>

            {loading ? (
              <div className="flex min-h-[320px] items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-slate-50">
                <div className="flex items-center gap-3 text-slate-500">
                  <Loader2 size={22} className="animate-spin" />
                  Loading tasks...
                </div>
              </div>
            ) : filteredTasks.length === 0 ? (
              <div className="flex min-h-[320px] flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-slate-50 px-6 text-center">
                <div className="mb-4 rounded-3xl bg-white p-4 text-sky-600 shadow-sm">
                  <ClipboardList size={34} />
                </div>
                <h3 className="text-lg font-bold text-slate-950">No tasks found</h3>
                <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
                  Create your first task or adjust the search term to find an existing task.
                </p>
              </div>
            ) : (
              <div className="grid gap-4">
                {filteredTasks.map((task) => (
                  <article
                    key={task.id}
                    className="rounded-3xl border border-slate-100 bg-slate-50 p-4 transition hover:border-sky-200 hover:bg-white hover:shadow-md"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={() => toggleComplete(task)}
                          className="mt-1 rounded-full text-slate-400 transition hover:text-emerald-500"
                          aria-label="Toggle completion"
                        >
                          {task.status === 'completed' ? (
                            <CheckCircle2 size={24} className="text-emerald-500" />
                          ) : (
                            <Circle size={24} />
                          )}
                        </button>

                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h3
                              className={`text-lg font-bold ${
                                task.status === 'completed'
                                  ? 'text-slate-400 line-through'
                                  : 'text-slate-950'
                              }`}
                            >
                              {task.title}
                            </h3>
                            <span
                              className={`rounded-full px-3 py-1 text-xs font-bold capitalize ${
                                task.status === 'completed'
                                  ? 'bg-emerald-100 text-emerald-700'
                                  : 'bg-amber-100 text-amber-700'
                              }`}
                            >
                              {task.status}
                            </span>
                          </div>
                          <p className="mt-2 text-sm leading-6 text-slate-600">
                            {task.description || 'No description added.'}
                          </p>
                          <p className="mt-3 text-xs font-medium text-slate-400">
                            Created {new Date(task.created_at).toLocaleString()}
                          </p>
                        </div>
                      </div>

                      <div className="flex shrink-0 gap-2">
                        <button
                          type="button"
                          onClick={() => startEdit(task)}
                          className="rounded-2xl bg-white p-3 text-slate-600 shadow-sm transition hover:bg-sky-50 hover:text-sky-600"
                          aria-label="Edit task"
                        >
                          <Pencil size={18} />
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteTask(task.id)}
                          className="rounded-2xl bg-white p-3 text-slate-600 shadow-sm transition hover:bg-rose-50 hover:text-rose-600"
                          aria-label="Delete task"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      </section>
    </main>
  );
}

function StatCard({ label, value, tone }) {
  return (
    <div className={`rounded-2xl px-3 py-4 shadow-sm ${tone}`}>
      <p className="text-2xl font-extrabold">{value}</p>
      <p className="mt-1 text-xs font-bold uppercase tracking-wide opacity-70">{label}</p>
    </div>
  );
}

export default App;

