import { compileScript, parse } from 'vue/compiler-sfc'

export interface SourceCodeTab {
	name: string
	code: string
}

interface StoryWithSourceCode {
	parameters: Record<string, unknown>
}

export interface SnippetAnalysis {
	/** Erreurs de parsing du SFC. */
	parseErrors: string[]
	/** Le SFC déclare un bloc `<script setup>`. */
	hasScriptSetup: boolean
	/** Identifiants lus dans le template mais non déclarés dans le script. */
	undeclaredIdentifiers: string[]
	/** Composants utilisés dans le template mais non importés. */
	unresolvedComponents: string[]
	/** Refs déclarées par `ref(null)`, inférées en `never` une fois l'extrait recopié. */
	untypedRefs: string[]
	/** Attributs écrits en syntaxe JS dans le template (ex. `uniqueId: '…',`). */
	invalidAttributes: string[]
}

export function getSourceCode(story: StoryWithSourceCode): SourceCodeTab[] {
	return (story.parameters.sourceCode as SourceCodeTab[] | undefined) ?? []
}

export function getSource(story: StoryWithSourceCode, name: string): string {
	return getSourceCode(story).find(tab => tab.name === name)?.code ?? ''
}

/**
 * Corps du `onMounted` de l'onglet Script, sans les commentaires.
 * Le bloc se termine au premier `})` en début de ligne.
 */
export function getMountedBody(story: StoryWithSourceCode): string {
	const script = getSource(story, 'Script').replace(/\/\*[\s\S]*?\*\/|\/\/.*$/gm, '')
	return script.match(/^onMounted\([\s\S]*?^\}\)/m)?.[0] ?? ''
}

function matchAll(source: string, pattern: RegExp): string[] {
	return [...new Set([...source.matchAll(pattern)].map(([, match]) => match!))]
}

/**
 * Analyse l'extrait de code d'une story comme un SFC recopié par un consommateur.
 * La compilation avec `inlineTemplate` délègue la résolution des identifiants au compilateur Vue :
 * un identifiant non déclaré devient `_ctx.x`, un composant non importé `resolveComponent("X")`.
 */
export function analyzeSnippet(story: StoryWithSourceCode): SnippetAnalysis {
	const { descriptor, errors } = parse(getSourceCode(story).map(tab => tab.code).join('\n'))
	const template = descriptor.template?.content ?? ''
	const scriptSetup = descriptor.scriptSetup?.content ?? ''
	const compiled = descriptor.scriptSetup && errors.length === 0
		? compileScript(descriptor, { id: 'story-snippet', inlineTemplate: true }).content
		: ''

	return {
		parseErrors: errors.map(error => error.message),
		hasScriptSetup: descriptor.scriptSetup !== null,
		undeclaredIdentifiers: matchAll(compiled, /_ctx\.([\w$]+)/g),
		unresolvedComponents: matchAll(compiled, /resolveComponent\("([^"]+)"/g),
		untypedRefs: matchAll(scriptSetup, /\b(\w+)\s*=\s*ref\(null\)/g),
		// Les valeurs d'attributs sont retirées : elles peuvent contenir des objets littéraux (`{ type: … }`).
		invalidAttributes: matchAll(template.replace(/"[^"]*"/g, '""'), /\s([\w-]+:)(?=[\s'"])/g),
	}
}
