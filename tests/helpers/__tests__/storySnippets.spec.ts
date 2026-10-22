import { describe, expect, it } from 'vitest'
import { analyzeSnippet, getMountedBody, getSource } from '../storySnippets'

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
	it('retourne le code d\'un onglet ou une chaîne vide', () => {
		const snippet = story('<template><div /></template>')

		expect(getSource(snippet, 'Template')).toBe('<template><div /></template>')
		expect(getSource(snippet, 'Script')).toBe('')
		expect(getSource({ parameters: {} }, 'Template')).toBe('')
	})

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

	it('signale l\'absence de script setup', () => {
		const analysis = analyzeSnippet(story('<template><SyTextArea /></template>'))

		expect(analysis.hasScriptSetup).toBe(false)
	})

	it('extrait le corps du onMounted sans les commentaires ni le code qui suit', () => {
		const snippet = story('<template><div /></template>', `<script setup lang="ts">
onMounted(() => {
  // textAreaRef.value?.validateOnSubmit()
  init()
})

async function onSubmit() {
  await textAreaRef.value?.validateOnSubmit()
}
</script>`)

		expect(getMountedBody(snippet)).toContain('init()')
		expect(getMountedBody(snippet)).not.toContain('validateOnSubmit')
		expect(getMountedBody(story('<template><div /></template>'))).toBe('')
	})
})
