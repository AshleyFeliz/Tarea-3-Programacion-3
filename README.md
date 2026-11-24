# TaskFlow — Gestor de tareas

Aplicación CRUD de tareas hecha con HTML, CSS y JavaScript, sin dependencias ni servidor. Permite crear, consultar, editar, eliminar, cambiar el estado, buscar y filtrar tareas. Los datos se almacenan en `localStorage` del navegador.

## Ejecutar

Abre `index.html` en un navegador moderno. No requiere instalación.

## Flujo Git Flow

Ramas permanentes: `main`, `develop` y `qa`. Las cinco ramas de trabajo del proyecto son:

1. `feature/create-task` — crear tareas con validación.
2. `feature/edit-task` — editar tareas existentes.
3. `feature/delete-task` — eliminar tareas.
4. `feature/task-status` — cambiar y filtrar el estado.
5. `feature/search-tasks` — buscar y resumir tareas.

Cada feature debe salir de `develop` y tener su propio commit funcional. Abre un PR de cada feature hacia `develop` y fusiónalo tras revisarlo. Para registrar también los PR solicitados hacia `qa` y `main` sin saltarse el flujo normal, créalos como PR de seguimiento y ciérralos como superseded (sin fusionar) una vez que `develop` se integre primero en `qa` y luego en `main`. Así quedan los 15 PR de las cinco ramas cerrados, y los cambios llegan a `main` por el flujo de release. Aclara en la descripción de esos PR el PR de feature y los PR de release relacionados; no presentes como fusionado un PR que se cerró sin merge.

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
git switch -c feature/create-task
git add .
git commit -m "feat: add task creation"
git push -u origin feature/create-task
```

Repite el paso 3 con las otras cuatro ramas y sus cambios correspondientes. Abre los PR de seguimiento a `qa` y `main` antes de integrar los releases. Luego abre PR `develop` → `qa` y, tras validarlo, `qa` → `main`; fusiónalos para que todos los cambios terminen en `main`. Confirma en GitHub que los 15 PR de feature estén cerrados y registra sus enlaces como evidencia. La URL de ejemplo debe reemplazarse por la de tu propio repositorio.

## Modelo de datos

Cada tarea contiene `id`, `title`, `description`, `dueDate`, `status` y `createdAt`. Los estados válidos son `pending` y `completed`.
