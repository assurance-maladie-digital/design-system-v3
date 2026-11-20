import { describe, expect, it } from 'vitest'
import { analyzeSnippet, type SourceCodeTab } from '@tests/helpers/storySnippets'
import { knownBrokenSnippets } from './knownBrokenSnippets'

// SyAutocomplete.stories importe un fichier .mdx, non chargeable par Vitest :
// ses stories de validation restent couvertes par SyAutocomplete.snippets.spec.ts.
const storyModules = import.meta.glob<Record<string, unknown>>([
	'/src/**/*.stories.ts',
	'!/src/components/Customs/Selects/SyAutocomplete/SyAutocomplete.stories.ts',
], { eager: true })

interface Snippet {
	id: string
	tabs: SourceCodeTab[]
}

function getSourceCode(story: unknown): SourceCodeTab[] | undefined {
	if (typeof story !== 'object' || story === null || !('parameters' in story)) {
		return undefined
	}
	const { parameters } = story
	if (typeof parameters !== 'object' || parameters === null || !('sourceCode' in parameters) || !Array.isArray(parameters.sourceCode)) {
		return undefined
	}
	return parameters.sourceCode.filter((tab): tab is SourceCodeTab => typeof tab === 'object' && tab !== null && typeof tab.code === 'string')
}

const snippets: Snippet[] = Object.entries(storyModules).flatMap(([path, storyModule]) =>
	Object.entries(storyModule).flatMap(([name, story]) => {
		const tabs = name === 'default' ? undefined : getSourceCode(story)
		return tabs ? [{ id: `${path.replace('/src/', '')}:${name}`, tabs }] : []
	}),
)

const SFC_BLOCK = /^<(?:template|script|style)\b/

// Un onglet sans balise de bloc (`<template>`, `<script setup>`) est enveloppé comme le ferait le consommateur :
// l'absence de ces balises est une convention de présentation, pas une erreur dans le code copié.
function asSfcBlock(tab: SourceCodeTab): SourceCodeTab {
	const code = tab.code.trim()
	if (SFC_BLOCK.test(code)) {
		return tab
	}
	return {
		...tab,
		code: tab.name?.startsWith('Script') ? `<script setup lang="ts">\n${code}\n</script>` : `<template>\n${code}\n</template>`,
	}
}

// Défauts qui empêchent l'extrait copié de fonctionner : erreur de syntaxe,
// ou identifiant du template absent du script quand l'extrait en fournit un.
function findProblems(snippet: Snippet): string[] {
	const analysis = analyzeSnippet({ parameters: { sourceCode: snippet.tabs.map(asSfcBlock) } })
	const undeclared = analysis.hasScriptSetup ? analysis.undeclaredIdentifiers : []

	return [
		...analysis.parseErrors.map(error => `Syntaxe : ${error}`),
		...undeclared.map(name => `« ${name} » est utilisé dans le template sans être déclaré dans le script`),
	]
}

const knownBroken = new Set(knownBrokenSnippets)
const snippetsById = new Map(snippets.map(snippet => [snippet.id, snippet]))

describe('Story snippets', () => {
	it('trouve les extraits de code des stories', () => {
		expect(snippets.length).toBeGreaterThan(0)
	})

	// Identifiants passés en chaînes : `%s` ne les tronque pas dans le titre du test, contrairement à `$id`.
	it.each([...snippetsById.keys()].filter(id => !knownBroken.has(id)))('l\'extrait de %s peut être copié tel quel', (id) => {
		expect(findProblems(snippetsById.get(id)!)).toEqual([])
	})

	it.each([...knownBroken])('%s est toujours cassé (sinon, retirer la ligne de knownBrokenSnippets)', (id) => {
		const snippet = snippetsById.get(id)

		expect(snippet, `Story introuvable : ${id}`).toBeDefined()
		expect(findProblems(snippet!)).not.toEqual([])
	})
})
