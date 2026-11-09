import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import { mount, type VueWrapper } from '@vue/test-utils'
import { composeStories } from '@storybook/vue3-vite'
import { VBtn } from 'vuetify/components'
import { analyzeSnippet } from '@tests/helpers/storySnippets'
import { useNotificationService } from '@/services/NotificationService'
import * as stories from '../NotificationBar.stories'

const { CustomCloseBtnText } = composeStories(stories)

const sourceCodeStories = Object.entries(composeStories(stories))
	.map(([name, story]) => ({ name, story }))
	.filter(({ story }) => Array.isArray(story.parameters.sourceCode))

function getSnippet(parameters: Record<string, unknown>): string {
	const tabs: { code: string }[] = Array.isArray(parameters.sourceCode) ? parameters.sourceCode : []
	return tabs.map(tab => tab.code).join('\n')
}

describe('NotificationBar stories', () => {
	it.each(sourceCodeStories)('l\'extrait de $name est un SFC autonome et copiable', ({ story }) => {
		expect(analyzeSnippet(story)).toEqual({
			parseErrors: [],
			hasScriptSetup: true,
			undeclaredIdentifiers: [],
			unresolvedComponents: [],
			untypedRefs: [],
			invalidAttributes: [],
		})
	})

	it.each(sourceCodeStories)('l\'extrait de $name n\'importe ni ne déclare rien d\'inutilisé', ({ story }) => {
		const code = getSnippet(story.parameters)
		const imported = [...code.matchAll(/import\s+(?:type\s+)?\{([^}]+)\}/g)]
		const destructured = [...code.matchAll(/const\s+\{([^}]+)\}\s*=/g)]
		const names = [...imported, ...destructured]
			.flatMap(([, list]) => list!.split(',').map(name => name.replace(/^type\s+/, '').trim()))
		const declared = [...code.matchAll(/const\s+(\w+)\s*=/g)].map(([, name]) => name!)
		const unused = [...names, ...declared]
			.filter(name => (code.match(new RegExp(`\\b${name}\\b`, 'g')) ?? []).length < 2)

		expect(unused).toEqual([])
	})

	it.each(sourceCodeStories)('l\'extrait de $name affiche le close-btn-text de la story', ({ story }) => {
		const code = getSnippet(story.parameters)
		const closeBtnTexts = [...code.matchAll(/close-btn-text="([^"]*)"/g)].map(([, text]) => text)

		expect(closeBtnTexts.every(text => text === story.args.closeBtnText)).toBe(true)
	})

	// RGAA 11.9 : le nom accessible du bouton de fermeture contient son intitulé visible
	describe('CustomCloseBtnText', () => {
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
			await wrapper.findAllComponents(VBtn).at(-1)!.trigger('click')
			vi.runAllTimers()
			await nextTick()

			const closeBtn = wrapper.find('.notification__close')
			const visibleText = closeBtn.text()
			expect(visibleText).toBe('Masquer')
			expect(closeBtn.attributes('aria-label') ?? visibleText).toContain(visibleText)
		})
	})
})
