import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { effectScope, nextTick, ref } from 'vue'
import { usePageScrollLock } from '../usePageScrollLock'

const overflow = () => ({
	html: document.documentElement.style.overflow,
	body: document.body.style.overflow,
})

describe('usePageScrollLock', () => {
	beforeEach(() => {
		document.documentElement.style.overflow = 'scroll'
		document.body.style.overflow = 'clip'
	})

	afterEach(() => {
		document.documentElement.style.overflow = ''
		document.body.style.overflow = ''
	})

	it('does not touch the overflow while unlocked', () => {
		const scope = effectScope()
		scope.run(() => usePageScrollLock(false))

		expect(overflow()).toEqual({ html: 'scroll', body: 'clip' })

		scope.stop()
		expect(overflow()).toEqual({ html: 'scroll', body: 'clip' })
	})

	it('locks and restores the initial overflow following a reactive source', async () => {
		const locked = ref(false)
		const scope = effectScope()
		scope.run(() => usePageScrollLock(locked))

		locked.value = true
		await nextTick()
		expect(overflow()).toEqual({ html: 'hidden', body: 'hidden' })

		locked.value = false
		await nextTick()
		expect(overflow()).toEqual({ html: 'scroll', body: 'clip' })

		scope.stop()
	})

	it('restores the overflow present when the lock happens, not when the composable is created', async () => {
		const locked = ref(false)
		const scope = effectScope()
		scope.run(() => usePageScrollLock(locked))
		document.body.style.overflow = 'auto'

		locked.value = true
		await nextTick()
		locked.value = false
		await nextTick()

		expect(overflow()).toEqual({ html: 'scroll', body: 'auto' })
		scope.stop()
	})

	it('restores the initial overflow when the scope is disposed while locked', () => {
		const scope = effectScope()
		scope.run(() => usePageScrollLock(() => true))
		expect(overflow()).toEqual({ html: 'hidden', body: 'hidden' })

		scope.stop()

		expect(overflow()).toEqual({ html: 'scroll', body: 'clip' })
	})
})
