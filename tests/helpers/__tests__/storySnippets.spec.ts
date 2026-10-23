import { describe, expect, it } from 'vitest'
import { analyzeSnippet } from '../storySnippets'

function story(template: string, script?: string) {
	const sourceCode = [{ name: 'Template', code: template }]
	if (script !== undefined) {
		sourceCode.push({ name: 'Script', code: script })
	}
	return { parameters: { sourceCode } }
}

const validScript = `<script setup lang="ts">
import { ref } from 'vue'
import { SyTextArea } from '@cnamts/synapse'

const value = ref('')
const textAreaRef = ref<InstanceType<typeof SyTextArea> | null>(null)
const onInput = (text: string) => text
</script>`

describe('storySnippets', () => {
	it('ne signale rien pour un SFC autonome', () => {
		const analysis = analyzeSnippet(story(
			'<template><SyTextArea ref="textAreaRef" v-model="value" @update:model-value="(text) => onInput(text)" /></template>',
			validScript,
		))

		expect(analysis).toEqual({
			parseErrors: [],
			hasScriptSetup: true,
			undeclaredIdentifiers: [],
			unresolvedComponents: [],
			untypedRefs: [],
			invalidAttributes: [],
		})
	})

	it('signale les identifiants non déclarés et les composants non importés', () => {
		const analysis = analyzeSnippet(story(
			'<template><SyTextArea v-model="value" :label="label" /><VBtn @click="reset" /></template>',
			validScript,
		))

		expect(analysis.undeclaredIdentifiers).toEqual(['label', 'reset'])
		expect(analysis.unresolvedComponents).toEqual(['VBtn'])
	})

	it('signale les refs non typées', () => {
		const analysis = analyzeSnippet(story(
			'<template><SyTextArea ref="textAreaRef" /></template>',
			validScript.replace('ref<InstanceType<typeof SyTextArea> | null>(null)', 'ref(null)'),
		))

		expect(analysis.untypedRefs).toEqual(['textAreaRef'])
	})

	it('signale les attributs écrits en syntaxe JS', () => {
		const analysis = analyzeSnippet(story(
			`<template><SyTextArea v-model="value" uniqueId: 'text-area-unique-id', /></template>`,
			validScript,
		))

		expect(analysis.invalidAttributes).toEqual(['uniqueId:'])
	})

	it('ignore les clés d\'objet dans les valeurs d\'attributs', () => {
		const analysis = analyzeSnippet(story(
			`<template>
  <SyTextArea
    v-model="value"
    :custom-rules="[{
      type: 'required',
      options: { message: 'Requis' },
    }]"
  />
</template>`,
			validScript,
		))

		expect(analysis.invalidAttributes).toEqual([])
	})

	it('ignore le texte et les valeurs entre apostrophes qui contiennent `clé:`', () => {
		const analysis = analyzeSnippet(story(
			`<template>
  <SyTextArea v-model="value" :custom-rules='[{ type: "required" }]' />
  <p>Onglet actif: {{ value }}</p>
</template>`,
			validScript,
		))

		expect(analysis.invalidAttributes).toEqual([])
	})

	it.each([
		{ name: 'absente', parameters: {} },
		{ name: 'qui n\'est pas un tableau', parameters: { sourceCode: 'invalide' } },
		{ name: 'dont les onglets n\'ont pas de code', parameters: { sourceCode: [{ name: 'Template' }] } },
	])('signale une source $name comme un extrait manquant', ({ parameters }) => {
		const analysis = analyzeSnippet({ parameters })

		expect(analysis.parseErrors).toEqual([expect.stringContaining('At least one <template> or <script> is required')])
		expect(analysis.hasScriptSetup).toBe(false)
	})

	it('signale une erreur de syntaxe dans le script sans lever d\'exception', () => {
		const analysis = analyzeSnippet(story(
			'<template><SyTextArea v-model="value" /></template>',
			`<script setup lang="ts">
import { ref } from 'vue
const value = ref('')
</script>`,
		))

		expect(analysis.parseErrors).toEqual([expect.stringContaining('Unterminated string constant')])
	})

	it('analyse aussi un extrait sans script setup', () => {
		const analysis = analyzeSnippet(story('<template><SyTextArea v-model="value" /></template>'))

		expect(analysis.hasScriptSetup).toBe(false)
		expect(analysis.undeclaredIdentifiers).toEqual(['value'])
		expect(analysis.unresolvedComponents).toEqual(['SyTextArea'])
	})
})
