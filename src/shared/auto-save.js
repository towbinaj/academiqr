/**
 * Auto-Save Utility
 * Creates debounced auto-savers with inline status indicators
 */

/**
 * Create a debounced auto-saver
 * @param {Function} saveFn - async function that performs the save. Should return true on success.
 * @param {Object} options
 * @param {number} options.delay - debounce delay in ms (default 1000)
 * @param {string} options.statusSelector - CSS selector for the status indicator container
 * @returns {{ trigger: Function, flush: Function, cancel: Function }}
 */
export function createAutoSaver(saveFn, options = {}) {
  const delay = options.delay || 1000
  const statusSelector = options.statusSelector || null
  let timer = null
  let pending = false

  function showStatus(state) {
    if (!statusSelector) return
    const el = document.querySelector(statusSelector)
    if (!el) return

    if (state === 'saving') {
      el.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i>'
      el.className = 'auto-save-status saving'
    } else if (state === 'saved') {
      el.innerHTML = '<i class="fas fa-check"></i> Saved'
      el.className = 'auto-save-status saved'
      setTimeout(() => {
        if (el.classList.contains('saved')) {
          el.className = 'auto-save-status fade-out'
          setTimeout(() => { el.className = 'auto-save-status'; el.innerHTML = '' }, 300)
        }
      }, 1500)
    } else if (state === 'error') {
      el.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Error'
      el.className = 'auto-save-status error'
      setTimeout(() => {
        el.className = 'auto-save-status fade-out'
        setTimeout(() => { el.className = 'auto-save-status'; el.innerHTML = '' }, 300)
      }, 3000)
    }
  }

  async function doSave() {
    pending = false
    showStatus('saving')
    try {
      const ok = await saveFn()
      showStatus(ok !== false ? 'saved' : 'error')
    } catch (err) {
      console.error('[AutoSave] Save failed:', err)
      showStatus('error')
    }
  }

  /** Trigger a debounced save */
  function trigger() {
    pending = true
    if (timer) clearTimeout(timer)
    timer = setTimeout(doSave, delay)
  }

  /** Immediately flush any pending save (for beforeunload) */
  async function flush() {
    if (timer) {
      clearTimeout(timer)
      timer = null
    }
    if (pending) {
      await doSave()
    }
  }

  /** Cancel any pending save */
  function cancel() {
    pending = false
    if (timer) {
      clearTimeout(timer)
      timer = null
    }
  }

  return { trigger, flush, cancel }
}

/** Registry of all active auto-savers for flush-on-unload */
const registry = []

export function registerAutoSaver(saver) {
  registry.push(saver)
}

/** Flush all pending saves (call on beforeunload) */
export async function flushAll() {
  await Promise.all(registry.map(s => s.flush()))
}
