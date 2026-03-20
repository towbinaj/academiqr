/**
 * Simple Shared State Management
 * Lightweight reactive state for cross-component communication
 */

const state = {
  user: null,
  profile: null,
  currentCollection: null,
  collections: [],
  links: []
}

const listeners = new Map()

/**
 * Get a state value
 * @param {string} key
 * @returns {*}
 */
export function getState(key) {
  return state[key]
}

/**
 * Set a state value and notify listeners
 * @param {string} key
 * @param {*} value
 */
export function setState(key, value) {
  const oldValue = state[key]
  state[key] = value

  // Notify listeners for this key
  const keyListeners = listeners.get(key) || []
  keyListeners.forEach(callback => callback(value, oldValue))
}

/**
 * Subscribe to state changes for a key
 * @param {string} key
 * @param {function} callback - Called with (newValue, oldValue)
 * @returns {function} Unsubscribe function
 */
export function subscribe(key, callback) {
  if (!listeners.has(key)) {
    listeners.set(key, [])
  }
  listeners.get(key).push(callback)

  return () => {
    const keyListeners = listeners.get(key)
    const index = keyListeners.indexOf(callback)
    if (index > -1) keyListeners.splice(index, 1)
  }
}
