import { afterEach, describe, expect, it, vi } from 'vitest'
import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils'
import { composeStories } from '@storybook/vue3-vite'
import { compileScript, parse } from 'vue/compiler-sfc'
import * as mainStories from '../SyTextArea.stories'
import * as validationStories from '../validation/Validation.stories'
import { locales } from '../locales'

const { Default, Required, Trim, ReplaceTabs, MaxLines, AutoWrap, Normalize } = composeStories(mainStories)
const {
	WithWarning,
	WithSuccess,
	NoValidateOnBlur,
	DisableErrorHandling,
	SyFormVuetifyValidation,
	VFormVuetifyValidation,
} = composeStories(validationStories)

type SourceCode = { name: string, code: string }[]

function getSourceCode(story: { parameters: Record<string, unknown> }): SourceCode {
	return (story.parameters.sourceCode as SourceCode | undefined) ?? []
}

function getSource(story: { parameters: Record<string, unknown> }, name: string): string {
	return getSourceCode(story).find(tab => tab.name === name)?.code ?? ''
}

const builtInTemplateIdentifiers = new Set(['$event', 'v'])

// Identifiants lus dans les expressions du template (bindings, événements, refs).
function getTemplateIdentifiers(template: string): string[] {
	const identifiers = new Set<string>()
	for (const [, expression] of template.matchAll(/\s(?:[:@][\w.-]+|v-model|ref)="([^"]*)"/g)) {
		const withoutStrings = expression!.replace(/'(?:\\.|[^'\\])*'/g, '')
		// Ignore les accès de propriété (`a.b`) et les clés d'objet littéral (`key:`).
		for (const [identifier] of withoutStrings.matchAll(/(?<![.\w$])[a-z_$][\w$]*(?![\w$]*\s*:)/gi)) {
			if (!['true', 'false', 'null', 'undefined'].includes(identifier)) identifiers.add(identifier)
		}
	}
	for (const [, component] of template.matchAll(/<([A-Z][\w]*)/g)) identifiers.add(component!)
	return [...identifiers]
}

function getArrowParams(template: string): Set<string> {
	return new Set([...template.matchAll(/\(?\s*(\w+)\s*\)?\s*=>/g)].map(([, param]) => param!))
}

interface TemplateNode { tag?: string, props?: { name: string, rawName?: string, loc: { source: string } }[], children?: TemplateNode[] }

// Noms d'attributs bruts tels qu'écrits dans le template (ex. `uniqueId:` pour une syntaxe JS égarée).
function getAttributeNames(node: TemplateNode): string[] {
	const own = (node.props ?? []).map(prop => prop.loc.source.split('=')[0]!)
	return [...own, ...(node.children ?? []).flatMap(getAttributeNames)]
}

const validAttributeName = /^(?:[:@#]|v-[\w-]+:?)?[\w-]+(?:\.[\w-]+)*$/

enableAutoUnmount(afterEach)

afterEach(() => {
	vi.unstubAllGlobals()
})

describe('SyTextArea stories', () => {
	it.each([
		{ name: 'Default', story: Default },
		{ name: 'Required', story: Required },
		{ name: 'Trim', story: Trim },
		{ name: 'ReplaceTabs', story: ReplaceTabs },
		{ name: 'MaxLines', story: MaxLines },
		{ name: 'AutoWrap', story: AutoWrap },
		{ name: 'Normalize', story: Normalize },
		{ name: 'WithWarning', story: WithWarning },
		{ name: 'WithSuccess', story: WithSuccess },
		{ name: 'NoValidateOnBlur', story: NoValidateOnBlur },
		{ name: 'DisableErrorHandling', story: DisableErrorHandling },
		{ name: 'SyFormVuetifyValidation', story: SyFormVuetifyValidation },
		{ name: 'VFormVuetifyValidation', story: VFormVuetifyValidation },
	])('le template de l\'extrait de $name ne contient que des attributs valides', ({ story }) => {
		const { descriptor, errors } = parse(getSourceCode(story).map(tab => tab.code).join('\n'))
		expect(errors).toEqual([])

		const invalidAttributes = getAttributeNames(descriptor.template!.ast as TemplateNode)
			.filter(name => !validAttributeName.test(name))
		expect(invalidAttributes).toEqual([])
	})

	it.each([
		{ name: 'MaxLines', story: MaxLines },
		{ name: 'WithWarning', story: WithWarning },
		{ name: 'WithSuccess', story: WithSuccess },
		{ name: 'NoValidateOnBlur', story: NoValidateOnBlur },
		{ name: 'DisableErrorHandling', story: DisableErrorHandling },
		{ name: 'SyFormVuetifyValidation', story: SyFormVuetifyValidation },
		{ name: 'VFormVuetifyValidation', story: VFormVuetifyValidation },
	])('l\'extrait de $name est un SFC autonome', ({ story }) => {
		const { descriptor, errors } = parse(getSourceCode(story).map(tab => tab.code).join('\n'))
		expect(errors).toEqual([])
		expect(descriptor.template).not.toBeNull()
		expect(descriptor.scriptSetup).not.toBeNull()

		const { bindings } = compileScript(descriptor, { id: 'story-snippet' })
		const template = descriptor.template!.content
		const localParams = getArrowParams(template)
		const undeclared = getTemplateIdentifiers(template)
			.filter(identifier => !builtInTemplateIdentifiers.has(identifier) && !localParams.has(identifier))
			.filter(identifier => !bindings?.[identifier])

		expect(undeclared).toEqual([])
	})

	it.each([
		{ name: 'MaxLines', story: MaxLines },
		{ name: 'WithWarning', story: WithWarning },
		{ name: 'WithSuccess', story: WithSuccess },
		{ name: 'DisableErrorHandling', story: DisableErrorHandling },
	])('l\'extrait de $name reproduit la validation déclenchée au montage', ({ story }) => {
		const script = getSource(story, 'Script')

		expect(script).toContain('onMounted')
		expect(script).toContain('validateOnSubmit()')
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
	])('$name ne présente pas de validateOn sans effet', ({ story }) => {
		expect(story.args).not.toHaveProperty('validateOn')
		expect(getSource(story, 'Template')).not.toContain('validate-on')
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
