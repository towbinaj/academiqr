import { test } from 'node:test'
import assert from 'node:assert/strict'
import { createAutoSaver } from '../src/shared/auto-save.js'

const sleep = (ms) => new Promise(r => setTimeout(r, ms))

test('debounces and saves the snapshot captured at trigger time, not at save time', async () => {
  const saved = []
  let form = 'a'
  const saver = createAutoSaver(async (snap) => { saved.push(snap); return true }, { delay: 30, capture: () => form })
  form = 'ab'; saver.trigger()
  form = 'abc'; saver.trigger()
  form = 'SOMETHING ELSE'  // form changes after the last edit (e.g. another link selected)
  await sleep(60)
  assert.deepEqual(saved, ['abc'])
})

test('a different key saves the pending snapshot first instead of dropping it', async () => {
  const saved = []
  const saver = createAutoSaver(async (s) => { saved.push(s); return true },
    { delay: 30, capture: () => current, keyOf: (s) => s.id })
  let current = { id: 'A', title: 'edited A' }; saver.trigger()
  current = { id: 'B', title: 'edited B' }; saver.trigger()
  await sleep(60)
  assert.deepEqual(saved, [{ id: 'A', title: 'edited A' }, { id: 'B', title: 'edited B' }])
})

test('capture returning null skips the trigger (form not on screen)', async () => {
  let calls = 0
  const saver = createAutoSaver(async () => { calls++; return true }, { delay: 10, capture: () => null })
  saver.trigger()
  await sleep(30)
  assert.equal(calls, 0)
})

test('saves never overlap and run in order', async () => {
  const log = []
  let inFlight = 0, maxInFlight = 0
  let v = 0
  const saver = createAutoSaver(async (snap) => {
    inFlight++; maxInFlight = Math.max(maxInFlight, inFlight)
    log.push('start ' + snap); await sleep(snap === 1 ? 40 : 5); log.push('end ' + snap)
    inFlight--; return true
  }, { delay: 5, capture: () => v })
  v = 1; saver.trigger()
  await sleep(15)          // save 1 is running (slow)
  v = 2; saver.trigger()
  await saver.flush()
  await sleep(10)
  assert.equal(maxInFlight, 1)
  assert.deepEqual(log, ['start 1', 'end 1', 'start 2', 'end 2'])
})

test('flush saves immediately and waits; cancel drops a pending save', async () => {
  const saved = []
  const saver = createAutoSaver(async (s) => { saved.push(s); return true }, { delay: 1000, capture: () => val })
  let val = 'x'; saver.trigger()
  await saver.flush()
  assert.deepEqual(saved, ['x'])
  val = 'y'; saver.trigger(); saver.cancel()
  await saver.flush()
  assert.deepEqual(saved, ['x'])
})

test('works without capture (legacy callers: saveFn reads state itself)', async () => {
  let calls = 0
  const saver = createAutoSaver(async (snap) => { assert.equal(snap, undefined); calls++; return true }, { delay: 10 })
  saver.trigger(); saver.trigger()
  await sleep(30)
  assert.equal(calls, 1)
})

test('a failing save does not block later saves', async () => {
  const saved = []
  const saver = createAutoSaver(async (s) => { if (s === 'bad') throw new Error('network'); saved.push(s); return true },
    { delay: 5, capture: () => v })
  const origError = console.error; console.error = () => {}
  let v = 'bad'; saver.trigger(); await saver.flush()
  v = 'good'; saver.trigger(); await saver.flush()
  console.error = origError
  assert.deepEqual(saved, ['good'])
})
