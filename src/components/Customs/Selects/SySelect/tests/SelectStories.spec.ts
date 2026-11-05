import { describe, expect, it } from 'vitest'
import { transpileModule } from 'typescript'
import { compileScript, compileTemplate, parse } from 'vue/compiler-sfc'
import {
	ChipsDisplay,
	Default,
	HelpText,
	MultipleSelection,
	RequiredWithAsterisk,
	WithCustomKey,
} from '../SySelect.stories'
import {
	NoValidateOnBlur as SelectNoValidateOnBlur,
	VFormAndVuetifyValidation as SelectVFormAndVuetifyValidation,
	WithSuccess as SelectWithSuccess,
	WithWarning as SelectWithWarning,
} from '../validation/Validation.stories'
import {
	NoValidateOnBlur as AutocompleteNoValidateOnBlur,
	VFormAndVuetifyValidation as AutocompleteVFormAndVuetifyValidation,
} from '../../SyAutocomplete/validation/Validation.stories'

type StorySource = { name: string, code: string }

function compileVueExample(sources: StorySource[]): void {
	const script = sources.find(source => source.name === 'Script')?.code
	const template = sources.find(source => source.name === 'Template')?.code
	expect(script).toBeDefined()
	expect(template).toBeDefined()

	const { descriptor, errors } = parse(`${script}\n${template}`, {
		filename: 'StoryExample.vue',
	})
	expect(errors).toEqual([])
	expect(descriptor.scriptSetup).toBeDefined()
	expect(descriptor.template).toBeDefined()

	const compiledScript = compileScript(descriptor, { id: 'story-example' })
	const compiledTemplate = compileTemplate({
		source: descriptor.template?.content ?? '',
		filename: 'StoryExample.vue',
		id: 'story-example',
		compilerOptions: { bindingMetadata: compiledScript.bindings },
	})
	expect(compiledTemplate.errors).toEqual([])
}

describe('select story code examples', () => {
	it('declares the initial model value in the basic SySelect examples', () => {
		for (const story of [Default, HelpText, WithCustomKey]) {
			expect(JSON.stringify(story.parameters?.sourceCode)).toContain('const value = ref<string | null>(null)')
			expect(story.render?.toString()).toContain('ref)(null)')

			const sources: { name: string, code: string }[] = story.parameters?.sourceCode ?? []
			const script = sources.find(source => source.name === 'Script')?.code
			expect(script).toBeDefined()

			const scriptContent = script?.replace(/<\/?script[^>]*>/gu, '') ?? ''
			const { diagnostics = [] } = transpileModule(scriptContent, {
				reportDiagnostics: true,
			})
			expect(diagnostics.map(({ code }) => code)).toEqual([])
		}
	})

	it('compiles the affected examples as Vue single-file components', () => {
		for (const story of [
			Default,
			HelpText,
			WithCustomKey,
			SelectWithWarning,
			SelectWithSuccess,
			SelectNoValidateOnBlur,
			SelectVFormAndVuetifyValidation,
			AutocompleteNoValidateOnBlur,
			AutocompleteVFormAndVuetifyValidation,
		]) {
			const sources: StorySource[] = story.parameters?.sourceCode ?? []
			compileVueExample(sources)
		}
	})

	it('uses the named public import consistently in SySelect examples', () => {
		for (const story of [Default, HelpText, RequiredWithAsterisk, MultipleSelection, ChipsDisplay, WithCustomKey]) {
			const displayedCode = JSON.stringify(story.parameters?.sourceCode)

			expect(displayedCode).toContain('import { SySelect } from \'@cnamts/synapse\'')
			expect(displayedCode).not.toContain('import SySelect from \'@cnamts/synapse\'')
		}
	})

	it('documents the initial value and validation lifecycle for warning and success examples', () => {
		for (const story of [SelectWithWarning, SelectWithSuccess]) {
			const displayedCode = JSON.stringify(story.parameters?.sourceCode)
			const sources: { name: string, code: string }[] = story.parameters?.sourceCode ?? []
			const template = sources.find(source => source.name === 'Template')?.code

			expect(displayedCode).toContain('const value = ref<string | null>(\'1\')')
			expect(displayedCode).toContain('const selectRef = ref<')
			expect(template).toContain('ref="selectRef"')
			expect(displayedCode).toContain('onMounted(() =>')
			expect(displayedCode).toContain('selectRef.value?.validateOnSubmit()')
			expect(story.render?.toString()).toContain('ref="selectRef"')
			expect(story.render?.toString()).toContain('selectRef.value?.validateOnSubmit()')
			expect(story.render?.toString()).toContain('ref)("1")')
		}
	})

	it('provides syntactically valid scripts for affected validation examples', () => {
		for (const story of [
			SelectWithWarning,
			SelectWithSuccess,
			SelectNoValidateOnBlur,
			SelectVFormAndVuetifyValidation,
			AutocompleteNoValidateOnBlur,
			AutocompleteVFormAndVuetifyValidation,
		]) {
			const sources: { name: string, code: string }[] = story.parameters?.sourceCode ?? []
			const script = sources.find(source => source.name === 'Script')?.code
			expect(script).toBeDefined()

			const scriptContent = script?.replace(/<\/?script[^>]*>/gu, '') ?? ''
			const { diagnostics = [] } = transpileModule(scriptContent, {
				reportDiagnostics: true,
			})
			expect(diagnostics.map(({ code }) => code)).toEqual([])
		}
	})

	it('clears validation when NoValidateOnBlur is reset', () => {
		for (const story of [SelectNoValidateOnBlur, AutocompleteNoValidateOnBlur]) {
			expect(JSON.stringify(story.parameters?.sourceCode)).toContain('.clearValidation()')
			expect(story.render?.toString()).toContain('.clearValidation()')
		}
	})

	it('shows valid and invalid submission outcomes in both VForm examples', () => {
		for (const story of [SelectVFormAndVuetifyValidation, AutocompleteVFormAndVuetifyValidation]) {
			expect(JSON.stringify(story.parameters?.sourceCode)).toContain('Formulaire invalide')
			expect(story.render?.toString()).toContain('Formulaire invalide')
		}
	})
})
