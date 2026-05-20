import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { ref, nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import { useTabTransition } from '../useTabTransition'

function makeTablistEl(activeLeft = 50, activeWidth = 120, containerLeft = 10): HTMLElement {
	const container = document.createElement('div')
	const activeBtn = document.createElement('button')
	activeBtn.classList.add('sy-tabs__button--active')

	vi.spyOn(activeBtn, 'getBoundingClientRect').mockReturnValue({
		left: activeLeft,
		width: activeWidth,
		top: 0,
		right: activeLeft + activeWidth,
		bottom: 0,
		height: 0,
		x: activeLeft,
		y: 0,
		toJSON: () => ({}),
	} as DOMRect)

	vi.spyOn(container, 'getBoundingClientRect').mockReturnValue({
		left: containerLeft,
		width: 500,
		top: 0,
		right: containerLeft + 500,
		bottom: 0,
		height: 0,
		x: containerLeft,
		y: 0,
		toJSON: () => ({}),
	} as DOMRect)

	container.appendChild(activeBtn)
	return container
}

function makeComponent(tablistEl: HTMLElement | null, initialIndex = 0) {
	return defineComponent({
		setup() {
			const tablist = ref<HTMLElement | null>(tablistEl)
			const activeItemIndex = ref(initialIndex)
			const result = useTabTransition(tablist, activeItemIndex)
			return { ...result, activeItemIndex, tablist }
		},
		template: '<div />',
	})
}

describe('useTabTransition', () => {
	beforeEach(() => {
		vi.useFakeTimers()
	})

	afterEach(() => {
		vi.restoreAllMocks()
		vi.useRealTimers()
	})

	describe('positionIndicator — sans activeTab', () => {
		it('remet xPosition et width à 0 si tablist est null', async () => {
			const wrapper = mount(makeComponent(null))
			await nextTick()
			await nextTick()

			expect(wrapper.vm.xPosition).toBe(0)
			expect(wrapper.vm.width).toBe(0)
		})

		it('remet xPosition et width à 0 si aucun bouton actif n\'existe', async () => {
			const container = document.createElement('div')
			vi.spyOn(container, 'getBoundingClientRect').mockReturnValue({
				left: 0, width: 500, top: 0, right: 500, bottom: 0, height: 0, x: 0, y: 0, toJSON: () => ({}),
			} as DOMRect)

			const wrapper = mount(makeComponent(container))
			await nextTick()
			await nextTick()

			expect(wrapper.vm.xPosition).toBe(0)
			expect(wrapper.vm.width).toBe(0)
		})
	})

	describe('positionIndicator — avec activeTab', () => {
		it('calcule xPosition = activeLeft - containerLeft', async () => {
			const el = makeTablistEl(50, 120, 10)
			const wrapper = mount(makeComponent(el))
			await nextTick()
			await nextTick()

			expect(wrapper.vm.xPosition).toBe(40) // 50 - 10
		})

		it('calcule width = activeTab.width', async () => {
			const el = makeTablistEl(50, 120, 10)
			const wrapper = mount(makeComponent(el))
			await nextTick()
			await nextTick()

			expect(wrapper.vm.width).toBe(120)
		})

		it('met à jour la position quand activeItemIndex change', async () => {
			const container = document.createElement('div')
			const btn1 = document.createElement('button')
			const btn2 = document.createElement('button')
			btn1.classList.add('sy-tabs__button--active')

			vi.spyOn(btn1, 'getBoundingClientRect').mockReturnValue({
				left: 50, width: 100, top: 0, right: 150, bottom: 0, height: 0, x: 50, y: 0, toJSON: () => ({}),
			} as DOMRect)
			vi.spyOn(btn2, 'getBoundingClientRect').mockReturnValue({
				left: 200, width: 150, top: 0, right: 350, bottom: 0, height: 0, x: 200, y: 0, toJSON: () => ({}),
			} as DOMRect)
			vi.spyOn(container, 'getBoundingClientRect').mockReturnValue({
				left: 0, width: 500, top: 0, right: 500, bottom: 0, height: 0, x: 0, y: 0, toJSON: () => ({}),
			} as DOMRect)

			container.appendChild(btn1)
			container.appendChild(btn2)

			const Comp = defineComponent({
				setup() {
					const tablist = ref<HTMLElement | null>(container)
					const activeItemIndex = ref(0)
					const result = useTabTransition(tablist, activeItemIndex)
					return { ...result, activeItemIndex }
				},
				template: '<div />',
			})

			const wrapper = mount(Comp)
			await nextTick()
			await nextTick()

			expect(wrapper.vm.xPosition).toBe(50)

			btn1.classList.remove('sy-tabs__button--active')
			btn2.classList.add('sy-tabs__button--active')
			wrapper.vm.activeItemIndex = 1
			await nextTick()
			await nextTick()

			expect(wrapper.vm.xPosition).toBe(200)
			expect(wrapper.vm.width).toBe(150)
		})
	})

	describe('resize listener', () => {
		it('ajoute un écouteur resize au montage', () => {
			const addSpy = vi.spyOn(window, 'addEventListener')
			const el = makeTablistEl()
			mount(makeComponent(el))

			expect(addSpy).toHaveBeenCalledWith('resize', expect.any(Function))
		})

		it('retire l\'écouteur resize au démontage', () => {
			const removeSpy = vi.spyOn(window, 'removeEventListener')
			const el = makeTablistEl()
			const wrapper = mount(makeComponent(el))

			wrapper.unmount()

			expect(removeSpy).toHaveBeenCalledWith('resize', expect.any(Function))
		})

		it('recalcule la position lors d\'un événement resize', async () => {
			const el = makeTablistEl(50, 120, 10)
			const wrapper = mount(makeComponent(el))
			await nextTick()
			await nextTick()

			const btn = el.querySelector('.sy-tabs__button--active') as HTMLButtonElement
			vi.spyOn(btn, 'getBoundingClientRect').mockReturnValue({
				left: 100, width: 200, top: 0, right: 300, bottom: 0, height: 0, x: 100, y: 0, toJSON: () => ({}),
			} as DOMRect)

			window.dispatchEvent(new Event('resize'))
			await nextTick()
			await nextTick()

			expect(wrapper.vm.width).toBe(200)
		})
	})

	describe('valeurs retournées', () => {
		it('expose xPosition et width comme refs réactives', () => {
			const el = makeTablistEl()
			const wrapper = mount(makeComponent(el))

			expect(wrapper.vm.xPosition).toBeDefined()
			expect(wrapper.vm.width).toBeDefined()
		})
	})
})
