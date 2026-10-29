import { afterEach, describe, expect, it, vi } from 'vitest'
import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils'
import { composeStories } from '@storybook/vue3-vite'
import { analyzeSnippet, type StoryWithSourceCode } from '@tests/helpers/storySnippets'
import { controlMatchers } from '../../../../../.storybook/controlMatchers'
import SyTextField from '../SyTextField.vue'
import * as mainStories from '../SyTextField.stories'
import * as validationStories from '../Validation/Validation.stories'

const { PatternValidation } = composeStories(mainStories)
const {
	WithError,
	WithWarning,
	WithSuccess,
	WithCustomRules,
	DisableErrorHandling,
	ValidateOnInput,
	ExternalMessages,
	SyFormValidation,
	VFormValidation,
	EmailValidation,
} = composeStories(validationStories)

const allStories = [
	...Object.entries(composeStories(mainStories)),
	...Object.entries(composeStories(validationStories)),
].map(([name, story]) => ({ name, story }))

enableAutoUnmount(afterEach)

afterEach(() => {
	vi.restoreAllMocks()
})

function snippetCode(story: StoryWithSourceCode, tabName: string): string {
	const { sourceCode } = story.parameters
	const tabs = Array.isArray(sourceCode) ? sourceCode : []
	return tabs.find(tab => tab?.name === tabName)?.code ?? ''
}

describe('SyTextField stories', () => {
	it.each([
		{ name: 'principal', meta: mainStories.default },
		{ name: 'de validation', meta: validationStories.default },
	])('le meta $name type en string les props visées par le matcher color', ({ meta }) => {
		// vue-docgen-api ne type pas les props importées ; Storybook n'accepte le matcher color que sur un type string.
		const colorProps = Object.keys(SyTextField.props ?? {}).filter(prop => controlMatchers.color.test(prop))

		expect(colorProps).toEqual(expect.arrayContaining(['color', 'baseColor', 'bgColor']))
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

	it.each(allStories)('l\'extrait de $name reprend les paragraphes affichés par le rendu', ({ story }) => {
		const normalize = (text: string) => text.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim()
		const template = normalize(snippetCode(story, 'Template'))
		const paragraphs = mount(story()).findAll('p').map(p => normalize(p.text()))

		for (const paragraph of paragraphs) {
			expect(template, paragraph).toContain(paragraph)
		}
	})

	it.each([
		{ name: 'WithError', story: WithError, message: 'L\'adresse email est invalide.' },
		{ name: 'WithWarning', story: WithWarning, message: 'Le nom d\'utilisateur est très court (moins de 3 caractères).' },
		{ name: 'WithSuccess', story: WithSuccess, message: 'L\'adresse email est valide.' },
	])('$name affiche son message au chargement et l\'extrait reproduit ce cycle', async ({ story, message }) => {
		const wrapper = mount(story())
		await flushPromises()

		expect(wrapper.text()).toContain(message)
		expect(snippetCode(story, 'Template')).toContain('ref="fieldRef"')
		expect(snippetCode(story, 'Script')).toMatch(/onMounted\(\(\) => \{\s*fieldRef\.value\?\.validateOnSubmit\(\)/)
	})

	it.each([
		{ name: 'PatternValidation', story: PatternValidation },
		{ name: 'WithCustomRules', story: WithCustomRules },
		{ name: 'EmailValidation', story: EmailValidation },
		{ name: 'SyFormValidation', story: SyFormValidation },
		{ name: 'VFormValidation', story: VFormValidation },
		{ name: 'ValidateOnInput', story: ValidateOnInput },
	])('le control required de $name pilote le champ', async ({ story }) => {
		expect(story.args.required).toBe(true)

		const required = mount(story())
		const optional = mount(story({ required: false }))
		await flushPromises()

		expect(required.find('input').attributes('aria-required')).toBe('true')
		expect(optional.find('input').attributes('aria-required')).toBeUndefined()
	})

	it.each([
		{ name: 'ValidateOnInput', story: ValidateOnInput },
		{ name: 'ExternalMessages', story: ExternalMessages },
	])('$name transmet ses args au champ et alimente l\'action update:modelValue', async ({ story }) => {
		const onUpdate = vi.fn()
		const wrapper = mount(story({ 'label': 'Libellé piloté', 'onUpdate:modelValue': onUpdate }))

		expect(wrapper.find('.v-input label').text()).toContain('Libellé piloté')

		await wrapper.find('input').setValue('abc')
		expect(onUpdate).toHaveBeenCalledWith('abc')
	})

	it('ExternalMessages désactive les controls des messages pilotés par les boutons sans perdre leur documentation', () => {
		for (const prop of ['errorMessages', 'warningMessages', 'successMessages']) {
			expect(ExternalMessages.argTypes[prop]?.control, prop).toMatchObject({ disable: true })
			expect(ExternalMessages.argTypes[prop]?.description, prop).toContain('depuis le parent')
		}
	})

	it('ExternalMessages affiche le message injecté par un bouton', async () => {
		const wrapper = mount(ExternalMessages())
		const errorBtn = wrapper.findAll('button').find(btn => btn.text() === 'Simuler une erreur')
		await errorBtn!.trigger('click')
		await flushPromises()

		expect(wrapper.text()).toContain('Ce nom est déjà utilisé')
	})

	it('DisableErrorHandling affiche les mêmes libellés dans l\'extrait et le rendu', () => {
		const wrapper = mount(DisableErrorHandling())
		const renderedLabels = wrapper.findAll('.v-input').map(field => field.find('label').text())
		const snippetLabels = [...snippetCode(DisableErrorHandling, 'Template').matchAll(/\slabel="([^"]+)"/g)].map(([, label]) => label)

		expect(snippetLabels).toHaveLength(2)
		expect(renderedLabels).toEqual(snippetLabels)
	})

	it('DisableErrorHandling affiche le message de la règle « requis » uniquement sans disableErrorHandling', async () => {
		const wrapper = mount(DisableErrorHandling())
		await flushPromises()

		const fields = wrapper.findAll('.v-input')
		expect(fields).toHaveLength(2)
		expect(fields[0]!.text()).toContain('Ce champ est requis.')
		expect(fields[0]!.classes()).toContain('error-field')
		expect(fields[1]!.text()).not.toContain('Ce champ est requis.')
		expect(fields[1]!.text()).not.toContain('est requis')
		expect(fields[1]!.classes()).not.toContain('error-field')
	})

	it('DisableErrorHandling alimente l\'action update:modelValue depuis les deux champs', async () => {
		const onUpdate = vi.fn()
		const wrapper = mount(DisableErrorHandling({ 'onUpdate:modelValue': onUpdate }))
		const inputs = wrapper.findAll('input')

		await inputs[0]!.setValue('a')
		await inputs[1]!.setValue('b')

		expect(onUpdate.mock.calls).toEqual([['a'], ['b']])
	})

	it('ValidateOnInput fige isValidateOnBlur, sujet de la story, et désactive son control', () => {
		expect(ValidateOnInput.args.isValidateOnBlur).toBe(false)
		expect(ValidateOnInput.argTypes.isValidateOnBlur?.control).toMatchObject({ disable: true })
	})

	it('VFormValidation ne contient pas la coquille « bénéficier de intégration »', () => {
		const wrapper = mount(VFormValidation())

		expect(wrapper.text()).toContain('bénéficier de l\'intégration')
	})
})
