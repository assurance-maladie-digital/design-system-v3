import { describe, expect, it } from 'vitest'
import { cnamContextualTokens } from '../tokens/cnam/cnamContextual'
import { paContextualTokens } from '../tokens/pa/paContextual'
import { apContextualTokens } from '../tokens/amelipro/apContextual'

describe('contextual tokens alignment', () => {
	it('keeps canonical contextual gap values aligned across themes', () => {
		expect(cnamContextualTokens.gap[3]).toBe('12px')
		expect(paContextualTokens.gap[3]).toBe('12px')
		expect(apContextualTokens.gap[3]).toBe('12px')
	})
})
