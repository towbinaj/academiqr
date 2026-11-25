import { test } from 'node:test'
import assert from 'node:assert/strict'
import { slugify, sanitizeSlugInput, slugFromField } from '../src/shared/slug-utils.js'

test('slugify', () => {
  assert.equal(slugify('Pediatric Liver Tumors - CHOP Visiting Professor'), 'pediatric-liver-tumors-chop-visiting-professor')
  assert.equal(slugify('Evaluating & Selecting Technology  - University of Miami'), 'evaluating-selecting-technology-university-of-miami')
  assert.equal(slugify('  Café   Résumé__Talk!! '), 'cafe-resume-talk')
  assert.equal(slugify('RSNA 2025: AI'), 'rsna-2025-ai')
  assert.equal(slugify('---'), '')
  assert.equal(slugify('🎉'), '')
  assert.equal(slugify('a'.repeat(70)).length, 60)
  assert.equal(slugify('word '.repeat(20)).endsWith('-'), false)
})

test('sanitizeSlugInput keeps a trailing hyphen while typing', () => {
  assert.equal(sanitizeSlugInput('My '), 'my-')
  assert.equal(sanitizeSlugInput('my-talk'), 'my-talk')
  assert.equal(sanitizeSlugInput('My Talk!'), 'my-talk')
  assert.equal(sanitizeSlugInput('-lead'), 'lead')
})

test('slugFromField leaves an untouched legacy slug alone', () => {
  const legacy = 'Interruption Management - RSNA 2025'
  assert.equal(slugFromField(legacy, legacy), legacy)
  assert.equal(slugFromField('new name', legacy), 'new-name')
  assert.equal(slugFromField('', 'untitled-k6tq'), 'untitled-k6tq')
  assert.equal(slugFromField('!!!', 'untitled-k6tq'), 'untitled-k6tq')
})
