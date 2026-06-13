"""Context augmentation helpers for assistant responses."""


def apply_context(user_id, question, base_answer, context_items):
    del user_id
    del question

    if not context_items:
        return base_answer, []

    hints = []
    context_used = []

    for item in context_items:
        key = item.get("key")
        value = item.get("value")

        if not key or value is None:
            continue

        context_used.append(key)

        if key == "audience":
            hints.append(f"Explica para esta audiencia: {value}.")
        elif key == "preferred_style":
            hints.append(f"Usa este estilo de respuesta: {value}.")
        else:
            hints.append(f"Contexto adicional ({key}): {value}.")

    if not context_used:
        return base_answer, []

    enriched_answer = f"{base_answer} {' '.join(hints)}"
    return enriched_answer, context_used
