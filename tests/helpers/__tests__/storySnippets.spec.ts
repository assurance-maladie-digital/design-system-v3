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

	it('ignore une source sans onglets exploitables', () => {
		expect(getSource({ parameters: { sourceCode: 'invalide' } }, 'Template')).toBe('')
		expect(getSource({ parameters: { sourceCode: [{ name: 'Template' }] } }, 'Template')).toBe('')
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

	it.each([
		{ name: 'sur une ligne', script: 'onMounted(() => fieldRef.value?.validateOnSubmit())' },
		{ name: 'indenté', script: '  onMounted(async () => {\n    await fieldRef.value?.validateOnSubmit()\n  })' },
	])('extrait le corps d\'un onMounted écrit $name', ({ script }) => {
		const snippet = story('<template><div /></template>', `<script setup lang="ts">\n${script}\n</script>`)

		expect(getMountedBody(snippet)).toContain('validateOnSubmit()')
	})

	it('extrait le onMounted quel que soit le nom de l\'onglet du script', () => {
		const snippet = { parameters: { sourceCode: [
			{ name: 'Template', code: '<template><div /></template>' },
			{ name: 'Scripts', code: '<script setup lang="ts">\nonMounted(() => init())\n</script>' },
		] } }

		expect(getMountedBody(snippet)).toContain('init()')
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
