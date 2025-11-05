class StorageManager {
  static save(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  static load(key, defaultValue = null) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  }

  static remove(key) {
    localStorage.removeItem(key);
  }

  static clearAll() {
    localStorage.clear();
  }
}
