import { afterEach, describe, expect, it, vi } from 'vitest'
import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils'
import { composeStories } from '@storybook/vue3-vite'
import { analyzeSnippet } from '@tests/helpers/storySnippets'
import { controlMatchers } from '../../../../.storybook/controlMatchers'
import SyTextArea from '../SyTextArea.vue'
import * as mainStories from '../SyTextArea.stories'
import * as validationStories from '../validation/Validation.stories'
import { locales } from '../locales'
const {
	MaxLines,
} = composeStories(mainStories)
const {
	WithWarning,
	WithSuccess,
	NoValidateOnBlur,
	DisableErrorHandling,
	SyFormVuetifyValidation,
	VFormVuetifyValidation,
} = composeStories(validationStories)
const allStories = [
	...Object.entries(composeStories(mainStories)),
	...Object.entries(composeStories(validationStories)),
].map(([name, story]) => ({ name, story }))

enableAutoUnmount(afterEach)

afterEach(() => {
	vi.unstubAllGlobals()
	vi.restoreAllMocks()
})

const metas = [
	{ name: 'principal', meta: mainStories.default },
	{ name: 'de validation', meta: validationStories.default },
]

describe('SyTextArea stories', () => {
	it.each(metas)('le meta $name type en string les props visées par le matcher color', ({ meta }) => {
		// vue-docgen-api type en « other » les props importées ; Storybook n'accepte le matcher color que sur un type string.
		const colorProps = Object.keys(SyTextArea.props ?? {}).filter(prop => controlMatchers.color.test(prop))

		expect(colorProps).toEqual(expect.arrayContaining(['color', 'bgColor']))
		for (const prop of colorProps) {
			expect(meta.argTypes?.[prop]?.type, prop).toMatchObject({ name: 'string' })
		}
	})

	it.each(allStories)('l\'extrait de $name est un SFC autonome et copiable', ({ story }) => {
		expect(analyzeSnippet(story)).toEqual({
			parseErrors: [],
			hasScriptSetup: true,
			undeclaredIdentifiers: [],
			unresolvedComponents: [],
			untypedRefs: [],
			invalidAttributes: [],
		})
	})

	it('MaxLines affiche l\'erreur de nombre de lignes au chargement', async () => {
		const wrapper = mount(MaxLines())
		await flushPromises()

		expect(wrapper.text()).toContain(locales.maxLines(5))
		expect(wrapper.find('.error-field').exists()).toBe(true)
	})

	it('WithWarning et WithSuccess affichent leur message au chargement', async () => {
		const warning = mount(WithWarning())
		const success = mount(WithSuccess())
		await flushPromises()

		expect(warning.text()).toContain('saisissez au moins 10 caractères')
		expect(success.text()).toContain('Description suffisamment détaillée.')
	})

	it('DisableErrorHandling n\'affiche l\'erreur que sur le premier champ', async () => {
		const wrapper = mount(DisableErrorHandling())
		await flushPromises()

		expect(wrapper.findAll('.error-field')).toHaveLength(1)
	})

	it.each([
		{ name: 'SyFormVuetifyValidation', story: SyFormVuetifyValidation },
		{ name: 'VFormVuetifyValidation', story: VFormVuetifyValidation },
	])('$name valide à la perte de focus et à la soumission', async ({ story }) => {
		const alert = vi.fn()
		vi.stubGlobal('alert', alert)
		const wrapper = mount(story(), { attachTo: document.body })
		await flushPromises()
		expect(wrapper.text()).not.toContain('Ce champ est requis')

		const textarea = wrapper.find('textarea')
		await textarea.trigger('focus')
		await textarea.trigger('blur')
		await flushPromises()
		expect(wrapper.text()).toContain('Ce champ est requis')

		await textarea.setValue('Texte')
		await flushPromises()
		await wrapper.find('form').trigger('submit')
		await flushPromises()
		expect(alert).toHaveBeenCalledWith('Formulaire valide : Texte')
	})

	it.each([
		{ name: 'SyFormVuetifyValidation', story: SyFormVuetifyValidation },
		{ name: 'VFormVuetifyValidation', story: VFormVuetifyValidation },
	])('$name bloque la soumission d\'un champ vide', async ({ story }) => {
		const alert = vi.fn()
		vi.stubGlobal('alert', alert)
		const wrapper = mount(story(), { attachTo: document.body })
		await flushPromises()

		await wrapper.find('form').trigger('submit')
		await flushPromises()

		expect(wrapper.text()).toContain('Ce champ est requis')
		expect(alert).toHaveBeenCalledWith('Formulaire invalide.')
	})

	it.each([
		{ name: 'SyFormVuetifyValidation', story: SyFormVuetifyValidation },
		{ name: 'VFormVuetifyValidation', story: VFormVuetifyValidation },
	])('$name ne présente pas de validateOn sans effet', ({ story }) => {
		expect(story.args).not.toHaveProperty('validateOn')
		expect(JSON.stringify(story.parameters.sourceCode)).not.toContain('validate-on')
	})

	it('NoValidateOnBlur conserve le résultat de validation après une saisie et une perte de focus', async () => {
		const wrapper = mount(NoValidateOnBlur(), { attachTo: document.body })
		const textarea = wrapper.find('textarea')

		await textarea.trigger('focus')
		await textarea.setValue('Contenu interdit')
		await flushPromises()
		expect(wrapper.text()).toContain('n\'est pas autorisé')

		await textarea.trigger('blur')
		await flushPromises()
		expect(wrapper.text()).toContain('n\'est pas autorisé')

		await textarea.trigger('focus')
		await textarea.setValue('Contenu correct')
		await textarea.trigger('blur')
		await flushPromises()
		expect(wrapper.text()).toContain('Le contenu est valide.')
	})

	it('NoValidateOnBlur vide le champ et efface la validation à la réinitialisation', async () => {
		const wrapper = mount(NoValidateOnBlur(), { attachTo: document.body })
		const textarea = wrapper.find('textarea')

		await textarea.setValue('Contenu correct')
		await flushPromises()
		expect(wrapper.text()).toContain('Le contenu est valide.')

		const resetBtn = wrapper.findAll('button').find(btn => btn.text() === 'Réinitialiser')
		await resetBtn!.trigger('click')
		await flushPromises()

		expect(wrapper.text()).not.toContain('Le contenu est valide.')
		expect(textarea.element.value).toBe('')
	})
})
