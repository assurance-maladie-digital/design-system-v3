import { afterEach, describe, expect, it, vi } from 'vitest'
import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils'
import { composeStories } from '@storybook/vue3-vite'
import ts from 'typescript'
import { analyzeSnippet, type StoryWithSourceCode } from '@tests/helpers/storySnippets'
import type { ValidationRule } from '@/composables/unifyValidation/useValidation'
import * as validationStories from '../validation/Validation.stories'

const {
	WithError,
	WithWarning,
	WithSuccess,
	DisableErrorHandling,
	CustomRules,
	NoValidateOnBlur,
	SyFormValidation,
	VFormValidation,
	SyFormVuetifyValidation,
	VFormAndVuetifyValidation,
} = composeStories(validationStories)

const argsDrivenStories = [
	{ name: 'WithError', story: WithError },
	{ name: 'WithWarning', story: WithWarning },
	{ name: 'WithSuccess', story: WithSuccess },
	{ name: 'CustomRules', story: CustomRules },
	{ name: 'NoValidateOnBlur', story: NoValidateOnBlur },
	{ name: 'SyFormValidation', story: SyFormValidation },
	{ name: 'VFormValidation', story: VFormValidation },
	{ name: 'SyFormVuetifyValidation', story: SyFormVuetifyValidation },
	{ name: 'VFormAndVuetifyValidation', story: VFormAndVuetifyValidation },
]

enableAutoUnmount(afterEach)

afterEach(() => {
	vi.restoreAllMocks()
})

function snippetCode(story: StoryWithSourceCode, tabName: string): string {
	const { sourceCode } = story.parameters
	const tabs = Array.isArray(sourceCode) ? sourceCode : []
	return tabs.find(tab => tab?.name === tabName)?.code ?? ''
}

/** Exécute le `<script setup>` de l'extrait, tel que recopié par un consommateur, et renvoie ses règles. */
function runSnippetRules(story: StoryWithSourceCode): ValidationRule[] {
	const script = snippetCode(story, 'Script')
		.replace(/<\/?script[^>]*>/g, '')
		.replace(/^import .*$/gm, '')
	const { outputText } = ts.transpileModule(`${script}\nreturn customNumberRules`, {
		compilerOptions: { target: ts.ScriptTarget.ES2022 },
	})
	const noop = () => undefined
	return new Function('ref', 'onMounted', 'NirField', outputText)(noop, noop, {})
}

function validateWith(rules: ValidationRule[] | undefined, value: string) {
	return rules?.[0]?.options.validate?.(value)
}

describe('NirField validation stories', () => {
	it.each(argsDrivenStories)('le control label de $name pilote la légende du champ', ({ story }) => {
		const wrapper = mount(story({ label: 'Libellé piloté' }))

		expect(wrapper.find('legend').text()).toBe('Libellé piloté')
	})

	it.each(argsDrivenStories)('le control required de $name pilote le champ', async ({ story }) => {
		const required = mount(story({ required: true }))
		const optional = mount(story({ required: false }))
		await flushPromises()

		expect(required.find('input').attributes('aria-required')).toBe('true')
		expect(optional.find('input').attributes('aria-required')).toBeUndefined()
	})

	it.each([
		{ name: 'WithWarning', prop: 'customNumberWarningRules' },
		{ name: 'SyFormVuetifyValidation', prop: 'numberRules' },
		{ name: 'SyFormVuetifyValidation', prop: 'keyRules' },
		{ name: 'VFormAndVuetifyValidation', prop: 'numberRules' },
		{ name: 'VFormAndVuetifyValidation', prop: 'keyRules' },
	] as const)('$name expose $prop dans ses args, sans surcharge dans le template', ({ name, prop }) => {
		const story = validationStories[name]
		expect(story.args?.[prop]).toEqual(expect.any(Array))

		const render = story.render?.(story.args ?? {}, {} as never) as { template?: string }
		const kebab = prop.replace(/[A-Z]/g, c => `-${c.toLowerCase()}`)
		expect(render.template).toContain('v-bind="args"')
		expect(render.template).not.toContain(`:${kebab}=`)
	})

	it('WithWarning n\'affiche plus l\'avertissement quand le control vide les règles', async () => {
		const withRules = mount(WithWarning())
		const withoutRules = mount(WithWarning({ customNumberWarningRules: [] }))
		await flushPromises()

		expect(withRules.text()).toContain('Attention : NIR masculin (commence par 1).')
		expect(withoutRules.text()).not.toContain('Attention : NIR masculin')
	})

	it('DisableErrorHandling fige ses deux configurations, désactive ses Controls et l\'explique', () => {
		expect(DisableErrorHandling.parameters.controls).toMatchObject({ disable: true })
		expect(DisableErrorHandling.parameters.docs?.description?.story).toContain('Controls sont désactivés')
	})

	it('DisableErrorHandling n\'affiche l\'erreur « requis » que sur le premier champ après la perte de focus', async () => {
		const wrapper = mount(DisableErrorHandling(), { attachTo: document.body })
		const inputs = wrapper.findAll('input')

		for (const input of [inputs[0]!, inputs[2]!]) {
			await input.trigger('focus')
			await input.trigger('blur')
		}
		await flushPromises()

		const fields = wrapper.findAll('.nir-field')
		expect(fields[0]!.find('.sy-number-errors').text()).not.toBe('')
		expect(fields[1]!.find('.sy-number-errors').text()).toBe('')
	})

	it('DisableErrorHandling alimente l\'action update:modelValue depuis les deux champs', async () => {
		const onUpdate = vi.fn()
		const wrapper = mount(DisableErrorHandling({ 'onUpdate:modelValue': onUpdate }))
		const inputs = wrapper.findAll('input')

		await inputs[0]!.setValue('1')
		await inputs[2]!.setValue('2')

		expect(onUpdate.mock.calls).toEqual([['1'], ['2']])
	})

	describe('CustomRules', () => {
		const distinguishingValues = [
			'',
			'1 84 02 75 123 456',
			'1 84 02 75 123',
			'3 84 02 75 123 456',
			'1 84 13 75 123 456',
			'1 84 02 00 123 456',
			'1 84 02 2A 123 456',
			'1 84 02 2B 123 456',
			'1 84 02 99 123 456',
			'1 84 02 3A 123 456',
			'1 8A 02 75 123 456',
			'1 84 02 75 12A 456',
			'1 84 02 75 123 45A',
		]

		it('l\'extrait est un SFC autonome et copiable', () => {
			expect(analyzeSnippet(CustomRules)).toEqual({
				parseErrors: [],
				hasScriptSetup: true,
				undeclaredIdentifiers: [],
				unresolvedComponents: [],
				untypedRefs: [],
				invalidAttributes: [],
			})
		})

		it.each(distinguishingValues)('la règle de l\'extrait donne le même résultat que celle de la story pour « %s »', (value) => {
			const snippetRules = runSnippetRules(CustomRules)

			expect(validateWith(snippetRules, value)).toEqual(validateWith(CustomRules.args.customNumberRules, value))
		})

		it('la règle de l\'extrait reprend les options de message de la story', () => {
			const [snippetRule] = runSnippetRules(CustomRules)
			const [storyRule] = CustomRules.args.customNumberRules!
			const withoutValidate = (options: ValidationRule['options']) =>
				Object.fromEntries(Object.entries(options).filter(([key]) => key !== 'validate'))

			expect(snippetRule!.type).toBe(storyRule!.type)
			expect(withoutValidate(snippetRule!.options)).toEqual(withoutValidate(storyRule!.options))
		})

		it('l\'extrait reproduit la configuration de la story', () => {
			const template = snippetCode(CustomRules, 'Template')

			expect(CustomRules.args).toMatchObject({ customRulesPrecedence: true, showSuccessMessages: true })
			expect(template).toContain('custom-rules-precedence')
			expect(template).toContain('show-success-messages')
			expect(template).toContain(`label="${CustomRules.args.label}"`)
			expect(snippetCode(CustomRules, 'Script')).toMatch(/onMounted\(\(\) => \{\s*nirRef\.value\?\.validateOnSubmit\(\)/)
		})

		it('affiche le message de succès de la règle au chargement', async () => {
			const wrapper = mount(CustomRules())
			await flushPromises()

			expect(wrapper.find('.sy-number-success').text()).toContain('Le numéro de sécurité sociale est valide.')
		})
	})
})
