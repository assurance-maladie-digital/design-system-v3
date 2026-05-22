import { describe, it, expect, vi, afterEach } from 'vitest'
import { nextTick } from 'vue'
import { useMobileRightMenu } from '../useMobileRightMenu'

function makeContainerWithItems(count: number): { container: HTMLElement, items: HTMLElement[] } {
	const container = document.createElement('div')
	const items = Array.from({ length: count }, (_, i) => {
		const el = document.createElement('button')
		el.setAttribute('role', 'menuitem')
		el.id = `mobile-item-${i}`
		container.appendChild(el)
		return el
	})
	document.body.appendChild(container)
	return { container, items }
}

describe('useMobileRightMenu', () => {
	afterEach(() => {
		document.body.innerHTML = ''
		vi.useRealTimers()
	})

	describe('état initial', () => {
		it('mobileMenuOpen est false par défaut', () => {
			const { mobileMenuOpen } = useMobileRightMenu()
			expect(mobileMenuOpen.value).toBe(false)
		})

		it('mobileActiveIndex est null par défaut', () => {
			const { mobileActiveIndex } = useMobileRightMenu()
			expect(mobileActiveIndex.value).toBeNull()
		})

		it('mobileActiveDescendantId est null par défaut', () => {
			const { mobileActiveDescendantId } = useMobileRightMenu()
			expect(mobileActiveDescendantId.value).toBeNull()
		})

		it('mobileBurgerButtonRef est null par défaut', () => {
			const { mobileBurgerButtonRef } = useMobileRightMenu()
			expect(mobileBurgerButtonRef.value).toBeNull()
		})
	})

	describe('openMobileMenuAndFocus', () => {
		it('ouvre le menu', async () => {
			vi.useFakeTimers()
			const { mobileMenuOpen, openMobileMenuAndFocus } = useMobileRightMenu()
			openMobileMenuAndFocus()
			expect(mobileMenuOpen.value).toBe(true)
		})

		it('définit mobileActiveIndex à 0', () => {
			vi.useFakeTimers()
			const { mobileActiveIndex, openMobileMenuAndFocus } = useMobileRightMenu()
			openMobileMenuAndFocus()
			expect(mobileActiveIndex.value).toBe(0)
		})

		it('définit mobileActiveDescendantId à "mobile-item-0"', () => {
			vi.useFakeTimers()
			const { mobileActiveDescendantId, openMobileMenuAndFocus } = useMobileRightMenu()
			openMobileMenuAndFocus()
			expect(mobileActiveDescendantId.value).toBe('mobile-item-0')
		})
	})

	describe('onMobileMenuModel', () => {
		it('quand val=true, définit activeIndex=0 et activeDescendantId="mobile-item-0"', async () => {
			vi.useFakeTimers()
			const { mobileActiveIndex, mobileActiveDescendantId, onMobileMenuModel } = useMobileRightMenu()
			onMobileMenuModel(true)
			expect(mobileActiveIndex.value).toBe(0)
			expect(mobileActiveDescendantId.value).toBe('mobile-item-0')
		})

		it('quand val=false, tente de focus le burger button', async () => {
			const { mobileBurgerButtonRef, onMobileMenuModel } = useMobileRightMenu()
			const btn = document.createElement('button')
			btn.id = 'burger-btn'
			document.body.appendChild(btn)
			mobileBurgerButtonRef.value = btn
			const focusSpy = vi.spyOn(btn, 'focus')

			onMobileMenuModel(false)
			await nextTick()

			expect(focusSpy).toHaveBeenCalled()
		})
	})

	describe('handleMobileMenuKeydown', () => {
		it('ne fait rien si aucun item [role="menuitem"] dans le conteneur', () => {
			const { mobileRightMenuRef, handleMobileMenuKeydown, mobileActiveIndex } = useMobileRightMenu()
			const container = document.createElement('div')
			document.body.appendChild(container)
			;(mobileRightMenuRef as unknown as { value: unknown }).value = { $el: container }

			const event = new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true })
			vi.spyOn(event, 'preventDefault')
			handleMobileMenuKeydown(event)

			expect(mobileActiveIndex.value).toBeNull()
		})

		it('ArrowDown navigue vers l\'élément suivant', () => {
			const { mobileRightMenuRef, mobileActiveDescendantId, handleMobileMenuKeydown, mobileActiveIndex } = useMobileRightMenu()
			const { container, items } = makeContainerWithItems(3)
			;(mobileRightMenuRef as unknown as { value: unknown }).value = { $el: container }

			mobileActiveDescendantId.value = items[0]!.id

			const event = new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, cancelable: true })
			handleMobileMenuKeydown(event)

			expect(mobileActiveIndex.value).toBe(1)
			expect(mobileActiveDescendantId.value).toBe(items[1]!.id)
		})

		it('ArrowDown sur le dernier item revient au premier (wrap)', () => {
			const { mobileRightMenuRef, mobileActiveDescendantId, handleMobileMenuKeydown, mobileActiveIndex } = useMobileRightMenu()
			const { container, items } = makeContainerWithItems(3)
			;(mobileRightMenuRef as unknown as { value: unknown }).value = { $el: container }

			mobileActiveDescendantId.value = items[2]!.id

			const event = new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, cancelable: true })
			handleMobileMenuKeydown(event)

			expect(mobileActiveIndex.value).toBe(0)
		})

		it('ArrowUp navigue vers l\'élément précédent', () => {
			const { mobileRightMenuRef, mobileActiveDescendantId, handleMobileMenuKeydown, mobileActiveIndex } = useMobileRightMenu()
			const { container, items } = makeContainerWithItems(3)
			;(mobileRightMenuRef as unknown as { value: unknown }).value = { $el: container }

			mobileActiveDescendantId.value = items[2]!.id

			const event = new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true, cancelable: true })
			handleMobileMenuKeydown(event)

			expect(mobileActiveIndex.value).toBe(1)
		})

		it('ArrowUp sur le premier item revient au dernier (wrap)', () => {
			const { mobileRightMenuRef, mobileActiveDescendantId, handleMobileMenuKeydown, mobileActiveIndex } = useMobileRightMenu()
			const { container, items } = makeContainerWithItems(3)
			;(mobileRightMenuRef as unknown as { value: unknown }).value = { $el: container }

			mobileActiveDescendantId.value = items[0]!.id

			const event = new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true, cancelable: true })
			handleMobileMenuKeydown(event)

			expect(mobileActiveIndex.value).toBe(2)
		})

		it('Home navigue vers le premier item', () => {
			const { mobileRightMenuRef, mobileActiveDescendantId, handleMobileMenuKeydown, mobileActiveIndex } = useMobileRightMenu()
			const { container, items } = makeContainerWithItems(3)
			;(mobileRightMenuRef as unknown as { value: unknown }).value = { $el: container }

			mobileActiveDescendantId.value = items[2]!.id

			const event = new KeyboardEvent('keydown', { key: 'Home', bubbles: true, cancelable: true })
			handleMobileMenuKeydown(event)

			expect(mobileActiveIndex.value).toBe(0)
		})

		it('End navigue vers le dernier item', () => {
			const { mobileRightMenuRef, mobileActiveDescendantId, handleMobileMenuKeydown, mobileActiveIndex } = useMobileRightMenu()
			const { container, items } = makeContainerWithItems(3)
			;(mobileRightMenuRef as unknown as { value: unknown }).value = { $el: container }

			mobileActiveDescendantId.value = items[0]!.id

			const event = new KeyboardEvent('keydown', { key: 'End', bubbles: true, cancelable: true })
			handleMobileMenuKeydown(event)

			expect(mobileActiveIndex.value).toBe(2)
		})

		it('Escape ferme le menu', async () => {
			const { mobileRightMenuRef, mobileMenuOpen, handleMobileMenuKeydown } = useMobileRightMenu()
			const { container } = makeContainerWithItems(2)
			;(mobileRightMenuRef as unknown as { value: unknown }).value = { $el: container }

			mobileMenuOpen.value = true

			const event = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true })
			handleMobileMenuKeydown(event)

			expect(mobileMenuOpen.value).toBe(false)
		})

		it('Escape focus le burger button', async () => {
			const { mobileRightMenuRef, mobileBurgerButtonRef, handleMobileMenuKeydown } = useMobileRightMenu()
			const { container } = makeContainerWithItems(2)
			;(mobileRightMenuRef as unknown as { value: unknown }).value = { $el: container }

			const btn = document.createElement('button')
			document.body.appendChild(btn)
			mobileBurgerButtonRef.value = btn
			const focusSpy = vi.spyOn(btn, 'focus')

			const event = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true })
			handleMobileMenuKeydown(event)
			await nextTick()

			expect(focusSpy).toHaveBeenCalled()
		})

		it('Enter clique sur l\'item actif', () => {
			const { mobileRightMenuRef, mobileActiveDescendantId, handleMobileMenuKeydown } = useMobileRightMenu()
			const { container, items } = makeContainerWithItems(2)
			;(mobileRightMenuRef as unknown as { value: unknown }).value = { $el: container }

			mobileActiveDescendantId.value = items[0]!.id
			const clickSpy = vi.spyOn(items[0]!, 'click')

			const event = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true })
			handleMobileMenuKeydown(event)

			expect(clickSpy).toHaveBeenCalled()
		})

		it('Space clique sur l\'item actif', () => {
			const { mobileRightMenuRef, mobileActiveDescendantId, handleMobileMenuKeydown } = useMobileRightMenu()
			const { container, items } = makeContainerWithItems(2)
			;(mobileRightMenuRef as unknown as { value: unknown }).value = { $el: container }

			mobileActiveDescendantId.value = items[1]!.id
			const clickSpy = vi.spyOn(items[1]!, 'click')

			const event = new KeyboardEvent('keydown', { key: ' ', bubbles: true, cancelable: true })
			handleMobileMenuKeydown(event)

			expect(clickSpy).toHaveBeenCalled()
		})

		it('une touche non gérée ne modifie pas l\'état', () => {
			const { mobileRightMenuRef, mobileActiveDescendantId, handleMobileMenuKeydown, mobileActiveIndex } = useMobileRightMenu()
			const { container, items } = makeContainerWithItems(2)
			;(mobileRightMenuRef as unknown as { value: unknown }).value = { $el: container }

			mobileActiveDescendantId.value = items[0]!.id
			mobileActiveIndex.value = 0

			const event = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true })
			handleMobileMenuKeydown(event)

			expect(mobileActiveIndex.value).toBe(0)
		})
	})
})
