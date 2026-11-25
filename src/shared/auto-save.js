/**
 * Auto-Save Utility
 * Creates debounced auto-savers with inline status indicators
 */

/**
 * Create a debounced auto-saver
 *
 * Values should be captured when the user makes a change, not when the debounce
 * fires: by then the form may show a different link, a different tab, or be gone.
 * Pass `capture` to snapshot what needs saving at trigger() time; saveFn then
 * receives that snapshot instead of reading the DOM.
 *
 * @param {Function} saveFn - async (snapshot) => boolean. Return false (or throw) on failure.
 * @param {Object} options
 * @param {number} options.delay - debounce delay in ms (default 1000)
 * @param {string} options.statusSelector - CSS selector for the status indicator container
 * @param {Function} [options.capture] - () => snapshot, called synchronously in trigger().
 *   Return null to skip (e.g. the form isn't on screen).
 * @param {Function} [options.keyOf] - (snapshot) => key. When a trigger's key differs from the
 *   pending snapshot's key (e.g. a different link), the pending one is saved first instead of
 *   being replaced.
 * @returns {{ trigger: Function, flush: Function, cancel: Function }}
 */
export function createAutoSaver(saveFn, options = {}) {
  const delay = options.delay || 1000
  const statusSelector = options.statusSelector || null
  const capture = options.capture || null
  const keyOf = options.keyOf || null
  let timer = null
  let pending = false
  let snapshot = undefined
  let chain = Promise.resolve() // saves run one at a time, in order

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

  /** Queue a save of the current pending snapshot (serialized after any running save). */
  function doSave() {
    if (timer) { clearTimeout(timer); timer = null }
    if (!pending) return chain
    const snap = snapshot
    pending = false
    snapshot = undefined
    chain = chain.then(async () => {
      showStatus('saving')
      try {
        const ok = await saveFn(snap)
        showStatus(ok !== false ? 'saved' : 'error')
      } catch (err) {
        console.error('[AutoSave] Save failed:', err)
        showStatus('error')
      }
    })
    return chain
  }

  /** Trigger a debounced save */
  function trigger() {
    let snap
    if (capture) {
      snap = capture()
      if (snap == null) return
      // A change to a different item: save the pending one now rather than dropping it
      if (pending && keyOf && keyOf(snap) !== keyOf(snapshot)) doSave()
    }
    pending = true
    snapshot = snap
    if (timer) clearTimeout(timer)
    timer = setTimeout(doSave, delay)
  }

  /** Immediately save anything pending and wait for all queued saves to finish */
  function flush() {
    return doSave()
  }

  /** Cancel any pending (not yet started) save */
  function cancel() {
    pending = false
    snapshot = undefined
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

/** Flush all pending saves (call before tearing down forms or leaving the page) */
export async function flushAll() {
  await Promise.all(registry.map(s => s.flush()))
}

// Save pending edits when the tab is hidden or the page is being left. 'visibilitychange'
// fires reliably on mobile (beforeunload often doesn't), and it starts the request early.
if (typeof document !== 'undefined') {
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') flushAll()
  })
}
