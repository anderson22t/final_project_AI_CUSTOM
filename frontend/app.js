const askForm = document.querySelector("#ask-form");
const userIdInput = document.querySelector("#user-id");
const answerOutput = document.querySelector("#answer-output");
const answerDetails = document.querySelector("#answer-details");
const answerMetaOutput = document.querySelector("#answer-meta-output");
const contextUserIdOutput = document.querySelector("#context-user-id");
const contextListOutput = document.querySelector("#context-list");
const contextUsedOutput = document.querySelector("#context-used");

const API_BASE_URL = "http://127.0.0.1:8000";
let lastContextUsed = [];

askForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData(askForm);
  const payload = {
    user_id: formData.get("user_id"),
    question: formData.get("question"),
  };

  answerOutput.textContent = "Consultando...";
  answerMetaOutput.textContent = "";
  answerDetails.hidden = true;

  try {
    const response = await fetch(`${API_BASE_URL}/api/ask`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const result = await response.json();
    renderAnswer(result);
    renderAnswerDetails(result);
    lastContextUsed = Array.isArray(result.context_used) ? result.context_used : [];
    await loadContext(payload.user_id);
  } catch (error) {
    answerOutput.textContent = `No se pudo conectar con el backend: ${error.message}`;
    answerMetaOutput.textContent = "";
    answerDetails.hidden = true;
    renderContext(null, payload.user_id);
  }
});

userIdInput.addEventListener("change", async () => {
  lastContextUsed = [];
  await loadContext(userIdInput.value);
});

function renderAnswer(result) {
  const answer = result && typeof result.answer === "string"
    ? result.answer
    : "No se recibio una respuesta valida del backend.";
  answerOutput.textContent = answer;
}

function renderAnswerDetails(result) {
  if (!result || typeof result !== "object") {
    answerDetails.hidden = true;
    return;
  }

  const metadata = {
    user_id: result.user_id ?? null,
    sources: Array.isArray(result.sources) ? result.sources : [],
    context_used: Array.isArray(result.context_used) ? result.context_used : [],
  };

  answerMetaOutput.textContent = JSON.stringify(metadata, null, 2);
  answerDetails.hidden = false;
}

async function loadContext(userId) {
  const safeUserId = typeof userId === "string" ? userId.trim() : "";
  if (!safeUserId) {
    renderContext({ context: [] }, "");
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/context?user_id=${encodeURIComponent(safeUserId)}`);
    if (!response.ok) {
      throw new Error("No se pudo obtener el contexto del usuario");
    }
    const result = await response.json();
    renderContext(result, safeUserId);
  } catch (error) {
    renderContext(null, safeUserId);
  }
}

function renderContext(result, userId) {
  contextUserIdOutput.textContent = userId || "-";

  const contextItems = result && Array.isArray(result.context) ? result.context : [];
  contextListOutput.textContent = "";

  if (contextItems.length === 0) {
    const emptyItem = document.createElement("li");
    emptyItem.className = "empty-state";
    emptyItem.textContent = "Sin contexto guardado.";
    contextListOutput.appendChild(emptyItem);
  } else {
    contextItems.forEach((item) => {
      const row = document.createElement("li");
      const key = item && item.key ? item.key : "(sin clave)";
      const value = item && item.value != null ? item.value : "(sin valor)";
      row.textContent = `${key}: ${value}`;
      contextListOutput.appendChild(row);
    });
  }

  if (lastContextUsed.length === 0) {
    contextUsedOutput.textContent = "Usado en esta respuesta: ninguno.";
  } else {
    contextUsedOutput.textContent = `Usado en esta respuesta: ${lastContextUsed.join(", ")}.`;
  }
}

loadContext(userIdInput.value);
