const KVInMemory = {
  // Initialize an in-memory key-value store using a Map
  store: new Map(),

  // Retrieve a value by key. If the key exists, parse and return the JSON value; otherwise, return null
  get(key) {
    const value = this.store.has(key) ? this.store.get(key) : null
    return value ? JSON.parse(value) : null
  },

  // Retrieve all key-value pairs from the store
  // Parse each value from JSON before returning the array of entries
  getAll() {
    const entries = []
    for (const [key, value] of this.store.entries()) {
      entries.push({ key, value: JSON.parse(value) })
    }
    return entries
  },

  // Add a key-value pair to the store
  // The value is stringified to JSON before storing it
  add(key, value) {
    this.store.set(key, JSON.stringify(value))
  },

  // Delete a key-value pair from the store by key
  delete(key) {
    this.store.delete(key)
  },

  // Clear all entries in the store
  purge() {
    this.store.clear()
  },

  // Get the number of entries in the store
  size() {
    return this.store.size
  },
}

export default KVInMemory
