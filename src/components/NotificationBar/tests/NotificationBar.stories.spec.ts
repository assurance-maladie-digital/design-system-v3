import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import { mount, type VueWrapper } from '@vue/test-utils'
import { composeStories } from '@storybook/vue3-vite'
import { VBtn } from 'vuetify/components'
import { useNotificationService } from '@/services/NotificationService'
import * as stories from '../NotificationBar.stories'

const { CustomCloseBtnText } = composeStories(stories)

// RGAA 11.9 : le nom accessible du bouton de fermeture contient son intitulé visible
describe('NotificationBar stories - CustomCloseBtnText', () => {
	let wrapper: VueWrapper | undefined

	beforeEach(() => {
		vi.useFakeTimers()
	})

	afterEach(() => {
		useNotificationService().clearQueue()
		wrapper?.unmount()
		vi.useRealTimers()
	})

	it('le nom accessible du bouton « Masquer » reprend son intitulé visible', async () => {
		wrapper = mount(CustomCloseBtnText)
		const trigger = wrapper.findAllComponents(VBtn).find(btn => btn.text() === 'Afficher la notification')
		await trigger!.trigger('click')
		vi.runAllTimers()
		await nextTick()

		const closeBtn = wrapper.find('.notification__close')
		const visibleText = closeBtn.text()
		const ariaLabel = closeBtn.attributes('aria-label')
		expect(visibleText).toBe('Masquer')
		expect(ariaLabel).toBeDefined()
		expect(ariaLabel).toContain(visibleText)
	})
})
