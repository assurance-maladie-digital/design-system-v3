import { describe, expect, it } from 'vitest'
import { ref } from 'vue'
import { limitMessages, mergeMessages, normalizeMessages, useDisplayMessages } from '../messageUtils'

describe('limitMessages', () => {
	it('keeps the first max messages', () => {
		expect(limitMessages(['a', 'b', 'c'], 2)).toEqual(['a', 'b'])
	})

	it.each([undefined, 0, -1])('returns the messages unchanged when max is %s', (max) => {
		expect(limitMessages(['a', 'b'], max)).toEqual(['a', 'b'])
	})
})

describe('normalizeMessages', () => {
	it('removes empty messages and duplicates, then limits', () => {
		expect(normalizeMessages(['a', '', 'a', 'b', 'c'], 2)).toEqual(['a', 'b'])
	})
})

describe('mergeMessages', () => {
	it('puts external messages first, then internal ones', () => {
		expect(mergeMessages(['externe'], ['interne'])).toEqual(['externe', 'interne'])
	})

	it('removes empty messages and duplicates', () => {
		expect(mergeMessages(['', 'a'], ['a', '', 'b'])).toEqual(['a', 'b'])
	})

	it('limits the merged messages', () => {
		expect(mergeMessages(['a'], ['b', 'c'], 2)).toEqual(['a', 'b'])
	})

	it('accepts missing external messages', () => {
		expect(mergeMessages(null, ['a'])).toEqual(['a'])
		expect(mergeMessages(undefined, ['a'])).toEqual(['a'])
	})
})

describe('useDisplayMessages', () => {
	const createState = () => ({
		errors: ref<string[]>([]),
		warnings: ref<string[]>([]),
		successes: ref<string[]>([]),
	})

	it('merges external and internal messages', () => {
		const state = createState()
		state.errors.value = ['Interne']
		const { displayErrors, displayHasError } = useDisplayMessages({ ...state, externalErrors: ['Externe'] })

		expect(displayErrors.value).toEqual(['Externe', 'Interne'])
		expect(displayHasError.value).toBe(true)
	})

	it('hides internal messages but keeps external ones when error handling is disabled', () => {
		const state = createState()
		state.errors.value = ['Interne']
		const { displayErrors } = useDisplayMessages({ ...state, externalErrors: ['Externe'], disableErrorHandling: true })

		expect(displayErrors.value).toEqual(['Externe'])
	})

	it('applies the forced states', () => {
		const { displayHasError, displayHasWarning } = useDisplayMessages({ ...createState(), hasErrorProp: true, hasWarningProp: true })

		expect(displayHasError.value).toBe(true)
		expect(displayHasWarning.value).toBe(true)
	})

	it('only reports a success without error nor warning', () => {
		const state = createState()
		const internalHasSuccess = ref(true)
		const { displayHasSuccess } = useDisplayMessages({ ...state, internalHasSuccess })

		expect(displayHasSuccess.value).toBe(true)

		state.warnings.value = ['Attention']
		expect(displayHasSuccess.value).toBe(false)
	})

	it('limits each list to maxErrors', () => {
		const state = createState()
		state.errors.value = ['a', 'b']
		state.warnings.value = ['c', 'd']
		const { displayErrors, displayWarnings } = useDisplayMessages({ ...state, maxErrors: 1 })

		expect(displayErrors.value).toEqual(['a'])
		expect(displayWarnings.value).toEqual(['c'])
	})
})
