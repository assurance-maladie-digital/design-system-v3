import { compileScript, compileTemplate, parse } from 'vue/compiler-sfc'

/** Onglet du paramètre `sourceCode` d'une story. */
export interface SourceCodeTab {
	name?: string
	code: string
}

/** Story composée (`composeStories`) ou objet de story exposant ses `parameters`. */
export interface StoryWithSourceCode {
	parameters: Record<string, unknown>
}

/** Résultat de l'analyse d'un extrait de story recopié comme SFC. */
export interface SnippetAnalysis {
	/** Erreurs de parsing ou de compilation du SFC. */
	parseErrors: string[]
	/** Le SFC déclare un bloc `<script setup>`. */
	hasScriptSetup: boolean
	/** Identifiants lus dans le template mais non déclarés dans le script. */
	undeclaredIdentifiers: string[]
	/** Composants utilisés dans le template mais non importés. */
	unresolvedComponents: string[]
	/**
	 * Variables déclarées par `ref(null)` sans paramètre de type : inférées en `Ref<null>`,
	 * l'extrait recopié ne compile plus dès qu'on leur affecte une valeur ou qu'on appelle une méthode dessus.
	 */
	untypedRefs: string[]
	/** Attributs statiques écrits en syntaxe JS dans le template (ex. `uniqueId: '…',`). */
	invalidAttributes: string[]
}

const SNIPPET_ID = 'story-snippet'
// `NodeTypes.ATTRIBUTE` de `@vue/compiler-core`, non exposé par `vue/compiler-sfc`.
const ATTRIBUTE_NODE = 6
// Commentaires JS, sans toucher aux URL (`https://…`).
const COMMENTS = /\/\*[\s\S]*?\*\/|(?<!:)\/\/.*$/gm

function isSourceCodeTab(tab: unknown): tab is SourceCodeTab {
	return typeof tab === 'object' && tab !== null && 'code' in tab && typeof tab.code === 'string'
}

/** Onglets de code de la story, dans l'ordre déclaré. */
export function getSourceCode(story: StoryWithSourceCode): SourceCodeTab[] {
	const { sourceCode } = story.parameters
	return Array.isArray(sourceCode) ? sourceCode.filter(isSourceCodeTab) : []
}

/** Code de l'onglet `name`, ou une chaîne vide s'il n'existe pas. */
export function getSource(story: StoryWithSourceCode, name: string): string {
	return getSourceCode(story).find(tab => tab.name === name)?.code ?? ''
}

function parseSnippet(story: StoryWithSourceCode) {
	return parse(getSourceCode(story).map(tab => tab.code).join('\n'))
}

/**
 * Appel `onMounted(...)` du script de l'extrait, sans les commentaires, quel que soit le nom de l'onglet.
 * Retourne une chaîne vide si l'extrait n'appelle pas `onMounted`.
 */
export function getMountedBody(story: StoryWithSourceCode): string {
	const script = parseSnippet(story).descriptor.scriptSetup?.content.replace(COMMENTS, '') ?? ''
	const start = script.indexOf('onMounted(')
	if (start === -1) {
		return ''
	}

	let depth = 0
	for (let index = start + 'onMounted'.length; index < script.length; index++) {
		if (script[index] === '(') {
			depth++
		}
		else if (script[index] === ')' && --depth === 0) {
			return script.slice(start, index + 1)
		}
	}
	return ''
}

function isStaticAttribute(prop: unknown): prop is { name: string } {
	return typeof prop === 'object' && prop !== null
		&& 'type' in prop && prop.type === ATTRIBUTE_NODE
		&& 'name' in prop && typeof prop.name === 'string'
}

function getStaticAttributeNames(node: unknown): string[] {
	if (typeof node !== 'object' || node === null) {
		return []
	}
	const props: unknown[] = 'props' in node && Array.isArray(node.props) ? node.props : []
	const children: unknown[] = 'children' in node && Array.isArray(node.children) ? node.children : []
	return [
		...props.filter(isStaticAttribute).map(prop => prop.name),
		...children.flatMap(getStaticAttributeNames),
	]
}

function compileSnippet(descriptor: ReturnType<typeof parse>['descriptor']): { code: string, errors: string[] } {
	try {
		if (descriptor.scriptSetup) {
			return { code: compileScript(descriptor, { id: SNIPPET_ID, inlineTemplate: true }).content, errors: [] }
		}
		const { code, errors } = compileTemplate({
			source: descriptor.template?.content ?? '',
			filename: `${SNIPPET_ID}.vue`,
			id: SNIPPET_ID,
		})
		return { code, errors: errors.map(error => (typeof error === 'string' ? error : error.message)) }
	}
	catch (error) {
		const message = error instanceof Error ? error.message : String(error)
		return { code: '', errors: [message.split('\n')[0]!] }
	}
}

function unique(source: string, pattern: RegExp): string[] {
	return [...new Set([...source.matchAll(pattern)].map(([, match]) => match!))]
}

/**
 * Analyse l'extrait de code d'une story comme un SFC recopié par un consommateur.
 * La compilation délègue la résolution des identifiants au compilateur Vue :
 * un identifiant non déclaré devient `_ctx.x`, un composant non importé `resolveComponent("X")`.
 * Sans `<script setup>`, le template est compilé seul : tous ses identifiants et composants sont signalés.
 */
export function analyzeSnippet(story: StoryWithSourceCode): SnippetAnalysis {
	const { descriptor, errors } = parseSnippet(story)
	const compiled = errors.length === 0 ? compileSnippet(descriptor) : { code: '', errors: [] }

	return {
		parseErrors: [...errors.map(error => error.message), ...compiled.errors],
		hasScriptSetup: descriptor.scriptSetup !== null,
		undeclaredIdentifiers: unique(compiled.code, /_ctx\.([\w$]+)/g),
		unresolvedComponents: unique(compiled.code, /resolveComponent\("([^"]+)"/g),
		untypedRefs: unique(descriptor.scriptSetup?.content ?? '', /\b(\w+)\s*=\s*ref\(null\)/g),
		invalidAttributes: getStaticAttributeNames(descriptor.template?.ast).filter(name => name.endsWith(':')),
	}
}
