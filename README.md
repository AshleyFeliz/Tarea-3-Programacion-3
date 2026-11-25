# TaskFlow — Gestor de tareas

Aplicación CRUD de tareas hecha con HTML, CSS y JavaScript, sin dependencias ni servidor. Permite crear, consultar, editar, eliminar, cambiar el estado, buscar y filtrar tareas. Los datos se almacenan en `localStorage` del navegador.

## Ejecutar

Abre `index.html` en un navegador moderno. No requiere instalación.

## Flujo Git Flow

Ramas permanentes: `main`, `develop` y `qa`. Las cinco ramas de trabajo del proyecto son:

1. `feature/due-date-sorting` — ordenar tareas por fecha límite.
2. `feature/overdue-indicator` — indicar tareas vencidas.
3. `feature/clear-completed` — eliminar tareas completadas en conjunto.
4. `feature/export-json` — exportar tareas a JSON.
5. `feature/task-priority` — asignar prioridad baja, media o alta.

Cada feature sale de `develop` y tiene un cambio independiente. Para cumplir la consigna, abre tres PR por feature con destinos `develop`, `qa` y `main`; revisa y fusiona cada uno. Al finalizar, verifica que los 15 PR estén cerrados y que los cambios estén integrados en `main`.

### Publicar y crear ramas

1. Crea un repositorio vacío en tu cuenta de GitHub y configura `origin` con su URL.
2. Desde esta carpeta, inicializa Git, confirma el proyecto y publica `main`. Crea y publica también `develop` y `qa`.
3. Por cada feature, cambia a `develop`, crea la rama, implementa y confirma un cambio independiente, y publícala:

```bash
git init
git branch -M main
git add .
git commit -m "chore: initialize TaskFlow CRUD"
git remote add origin https://github.com/TU_USUARIO/TU_REPOSITORIO.git
git push -u origin main
git switch -c develop
git push -u origin develop
git switch -c qa
git push -u origin qa
git switch develop
git switch -c feature/due-date-sorting
git add .
git commit -m "feat: sort tasks by due date"
git push -u origin feature/due-date-sorting
```

Repite el paso 3 con las otras cuatro ramas y sus cambios correspondientes. Abre los PR de seguimiento a `qa` y `main` antes de integrar los releases. Luego abre PR `develop` → `qa` y, tras validarlo, `qa` → `main`; fusiónalos para que todos los cambios terminen en `main`. Confirma en GitHub que los 15 PR de feature estén cerrados y registra sus enlaces como evidencia. La URL de ejemplo debe reemplazarse por la de tu propio repositorio.

## Modelo de datos

Cada tarea contiene `id`, `title`, `description`, `dueDate`, `status`, `priority` y `createdAt`. Los estados válidos son `pending` y `completed`; las prioridades son `low`, `medium` y `high`. Las tareas antiguas sin prioridad se muestran con prioridad media.
