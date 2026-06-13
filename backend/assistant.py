from backend.knowledge import retrieve_snippets
from backend.cag import apply_context


def answer_question(user_id, question, context_store=None):
    snippets = retrieve_snippets(question)

    if not snippets:
        base_answer = "No encontre informacion suficiente en la base de conocimiento del curso."
        sources = []
    else:
        source_text = " ".join(item["content"] for item in snippets)
        base_answer = f"Segun la base de conocimiento del curso: {source_text}"
        sources = [item["id"] for item in snippets]

    context_items = []
    if context_store is not None:
        context_items = context_store.list_for_user(user_id)

    answer, context_used = apply_context(user_id, question, base_answer, context_items)

    if context_store is not None:
        context_store.save(user_id, "last_question", question)
        if sources:
            context_store.save(user_id, "last_topic", sources[0])

    return {
        "user_id": user_id,
        "answer": answer,
        "sources": sources,
        "context_used": context_used,
    }
