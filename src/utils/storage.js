const PREFIX = 'olm_';

export function loadList(key, fallback = []) {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function saveList(key, value) {
  localStorage.setItem(PREFIX + key, JSON.stringify(value));
}

export function seedIfEmpty(key, seedValue) {
  const existing = localStorage.getItem(PREFIX + key);
  if (existing === null) {
    saveList(key, seedValue);
    return seedValue;
  }
  try {
    return JSON.parse(existing);
  } catch {
    saveList(key, seedValue);
    return seedValue;
  }
}

export function makeId(prefix = 'id') {
  return `${prefix}_${Date.now()}_${Math.floor(Math.random() * 100000)}`;
}
