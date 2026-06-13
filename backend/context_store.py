"""Simple in-memory context storage for CAG."""

from threading import RLock


class ContextStore:
    def __init__(self):
        self._store = {}
        self._lock = RLock()

    def save(self, user_id, key, value):
        with self._lock:
            user_context = self._store.setdefault(user_id, {})
            user_context[key] = value
            return True

    def list_for_user(self, user_id):
        with self._lock:
            user_context = self._store.get(user_id, {})
            return [{"key": key, "value": value} for key, value in user_context.items()]
