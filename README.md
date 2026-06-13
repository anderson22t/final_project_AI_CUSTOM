# Proyecto Examen Final - Modulo 3 (CAG Lab)

Asistente tipo chatbot con recuperacion de conocimiento del curso y contexto persistente por usuario (CAG).

## Estado actual

El proyecto ya incluye:

- Backend HTTP en Python con endpoints de salud, preguntas y contexto.
- Recuperacion de snippets desde `data/knowledge_base.json`.
- CAG funcional con memoria por usuario en `ContextStore` (en memoria).
- Frontend web estatico que muestra:
  - respuesta principal en texto natural,
  - detalles tecnicos opcionales,
  - panel de "Contexto del usuario".

## Estructura

| Ruta | Contenido |
|---|---|
| `backend/` | Servidor, asistente, recuperacion de conocimiento y CAG. |
| `frontend/` | Interfaz web estatica (HTML/CSS/JS). |
| `data/` | Base de conocimiento del curso. |
| `tests/base/` | Pruebas base del API. |
| `tests/validation/` | Pruebas de contrato CAG. |
| `scripts/` | Scripts para ejecucion de pruebas. |
| `docs/` | Evidencias y documentacion del estudiante. |

## API disponible

### `GET /health`
Verifica que el backend este activo.

Respuesta esperada:

```json
{ "status": "ok" }
```

### `POST /api/ask`
Realiza una pregunta al asistente.

Body de ejemplo:

```json
{
  "user_id": "student-01",
  "question": "Que es CAG?"
}
```

Respuesta de ejemplo:

```json
{
  "user_id": "student-01",
  "answer": "Segun la base de conocimiento del curso: ...",
  "sources": ["cag"],
  "context_used": ["audience"]
}
```

### `POST /api/context`
Guarda contexto persistente para un usuario.

Body de ejemplo:

```json
{
  "user_id": "student-01",
  "key": "audience",
  "value": "explicar como principiante"
}
```

### `GET /api/context?user_id=student-01`
Obtiene el contexto guardado del usuario.

## Ejecucion local

### 1) Levantar backend

```bash
PYTHONPATH=. python -m backend.server
```

Backend disponible en `http://127.0.0.1:8000`.

### 2) Levantar frontend

```bash
python -m http.server 5501 --directory frontend
```

Frontend disponible en `http://127.0.0.1:5501/index.html`.

## Pruebas

### Pruebas base

```bash
python -m unittest discover -s tests/base -p "test_*.py"
```

### Pruebas de validacion CAG

```bash
python -m unittest discover -s tests/validation -p "test_*.py"
```

### Script de validacion global

```bash
./test.sh
```

## Flujo manual rapido

1. Abrir el frontend.
2. Mantener `user_id` (por ejemplo `student-01`) y hacer una pregunta.
3. Revisar la respuesta en texto natural.
4. Revisar el panel "Contexto del usuario":
   - contexto guardado,
   - claves usadas en la ultima respuesta.
5. Hacer una segunda pregunta para comprobar continuidad contextual.

## Nota sobre CAG en este proyecto

- El contexto se guarda por `user_id` y se reutiliza entre preguntas.
- La respuesta principal se mantiene limpia para usuario final.
- Los detalles tecnicos se muestran de forma opcional en el frontend.
