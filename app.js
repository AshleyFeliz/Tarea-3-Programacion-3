"use strict";

const STORAGE_KEY = "taskflow.tasks.v1";
const form = document.querySelector("#task-form");
const taskList = document.querySelector("#task-list");
const emptyState = document.querySelector("#empty-state");
const notice = document.querySelector("#notice");
const searchInput = document.querySelector("#search");
const statusFilter = document.querySelector("#filter-status");
const cancelEditButton = document.querySelector("#cancel-edit");
const submitButton = document.querySelector("#submit-button");
const formHeading = document.querySelector("#form-heading");

let tasks = loadTasks();
let editingId = null;

function loadTasks() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === null) return [];
    const parsed = JSON.parse(saved);
    if (!Array.isArray(parsed)) throw new Error("El formato almacenado no es una lista.");
    const validTasks = parsed.every((task) =>
      task &&
      typeof task.id === "string" &&
      typeof task.title === "string" &&
      typeof task.description === "string" &&
      typeof task.dueDate === "string" &&
      ["pending", "completed"].includes(task.status),
    );
    if (!validTasks) throw new Error("Una o más tareas tienen datos inválidos.");
    return parsed;
  } catch (error) {
    showNotice(`No se pudieron leer las tareas guardadas: ${error.message}`);
    return [];
  }
}

function showNotice(message) {
  notice.textContent = message;
  notice.hidden = false;
}

function clearNotice() {
  notice.textContent = "";
  notice.hidden = true;
}

function saveTasks(nextTasks) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextTasks));
    tasks = nextTasks;
    clearNotice();
    return true;
  } catch (error) {
    showNotice(`No se pudieron guardar los cambios: ${error.message}`);
    return false;
  }
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[character]);
}

function formatDate(value) {
  if (!value) return "";
  const [year, month, day] = value.split("-").map(Number);
  return new Intl.DateTimeFormat("es", { dateStyle: "long" }).format(
    new Date(year, month - 1, day),
  );
}

function isOverdue(task) {
  if (task.status !== "pending" || !task.dueDate) return false;

  const now = new Date();
  const today = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
  ].join("-");

  return task.dueDate < today;
}

function render() {
  const query = searchInput.value.trim().toLocaleLowerCase("es");
  const selectedStatus = statusFilter.value;
  const visibleTasks = tasks.filter((task) => {
    const matchesText = task.title.toLocaleLowerCase("es").includes(query);
    const matchesStatus = selectedStatus === "all" || task.status === selectedStatus;
    return matchesText && matchesStatus;
  })
  .sort((a, b) => {
    if (!a.dueDate && !b.dueDate) return 0;
    if (!a.dueDate) return 1;
    if (!b.dueDate) return -1;
    return a.dueDate.localeCompare(b.dueDate);
  });

  document.querySelector("#total-count").textContent = tasks.length;
  document.querySelector("#pending-count").textContent =
    tasks.filter((task) => task.status === "pending").length;
  document.querySelector("#completed-count").textContent =
    tasks.filter((task) => task.status === "completed").length;
  document.querySelector("#visible-count").textContent =
    `${visibleTasks.length} ${visibleTasks.length === 1 ? "tarea" : "tareas"}`;
  emptyState.hidden = visibleTasks.length > 0;
  emptyState.textContent = tasks.length === 0
    ? "Todavía no tienes tareas. ¡Agrega la primera!"
    : "No hay tareas que coincidan con la búsqueda.";

  taskList.innerHTML = visibleTasks.map((task) => {
    const completed = task.status === "completed";
    const overdue = isOverdue(task);
    const statusLabel = completed ? "Completada" : "Pendiente";
    const dueDate = task.dueDate
      ? `<p class="task-date">Fecha límite: ${escapeHtml(formatDate(task.dueDate))}</p>`
      : "";
    return `
      <article class="task-card">
        <div class="task-card-content">
          <div class="task-title-row">
            <h3 class="task-title">${escapeHtml(task.title)}</h3>
            <span class="status-badge status-${completed ? "completed" : "pending"}">${statusLabel}</span>
            ${overdue ? '<span class="status-badge status-overdue">Vencida</span>' : ""}
          </div>
          ${task.description ? `<p class="task-description">${escapeHtml(task.description)}</p>` : ""}
          ${dueDate}
        </div>
        <div class="task-actions" aria-label="Acciones para ${escapeHtml(task.title)}">
          <button class="icon-button" type="button" data-action="toggle" data-id="${escapeHtml(task.id)}"
            aria-label="${completed ? "Marcar pendiente" : "Marcar completada"}">${completed ? "↶" : "✓"}</button>
          <button class="icon-button" type="button" data-action="edit" data-id="${escapeHtml(task.id)}"
            aria-label="Editar tarea">Editar</button>
          <button class="icon-button delete" type="button" data-action="delete" data-id="${escapeHtml(task.id)}"
            aria-label="Eliminar tarea">Eliminar</button>
        </div>
      </article>`;
  }).join("");
}

function resetForm() {
  form.reset();
  editingId = null;
  formHeading.textContent = "Nueva tarea";
  submitButton.textContent = "Agregar tarea";
  cancelEditButton.hidden = true;
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(form);
  const title = formData.get("title").trim();
  if (!title) {
    form.elements.title.setCustomValidity("Escribe un título para la tarea.");
    form.elements.title.reportValidity();
    return;
  }
  form.elements.title.setCustomValidity("");

  const existing = tasks.find((task) => task.id === editingId);
  const task = {
    id: editingId || crypto.randomUUID(),
    title,
    description: formData.get("description").trim(),
    dueDate: formData.get("dueDate"),
    status: formData.get("status"),
    createdAt: existing ? existing.createdAt : new Date().toISOString(),
  };
  const nextTasks = existing
    ? tasks.map((item) => item.id === editingId ? task : item)
    : [task, ...tasks];

  if (saveTasks(nextTasks)) {
    resetForm();
    render();
  }
});

form.elements.title.addEventListener("input", () => {
  form.elements.title.setCustomValidity("");
});

cancelEditButton.addEventListener("click", resetForm);
searchInput.addEventListener("input", render);
statusFilter.addEventListener("change", render);

taskList.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;
  const { action, id } = button.dataset;
  const task = tasks.find((item) => item.id === id);
  if (!task) return;

  if (action === "delete") {
    if (!window.confirm(`¿Eliminar la tarea "${task.title}"?`)) return;
    if (saveTasks(tasks.filter((item) => item.id !== id))) {
      if (editingId === id) resetForm();
      render();
    }
  } else if (action === "toggle") {
    const status = task.status === "completed" ? "pending" : "completed";
    if (saveTasks(tasks.map((item) => item.id === id ? { ...item, status } : item))) render();
  } else if (action === "edit") {
    editingId = id;
    form.elements.title.value = task.title;
    form.elements.description.value = task.description;
    form.elements.dueDate.value = task.dueDate;
    form.elements.status.value = task.status;
    formHeading.textContent = "Editar tarea";
    submitButton.textContent = "Guardar cambios";
    cancelEditButton.hidden = false;
    form.elements.title.focus();
  }
});

render();
