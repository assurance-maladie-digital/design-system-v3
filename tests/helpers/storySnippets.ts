import ts from 'typescript'
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

function isSourceCodeTab(tab: unknown): tab is SourceCodeTab {
	return typeof tab === 'object' && tab !== null && 'code' in tab && typeof tab.code === 'string'
}

function getSourceCodeTabs(story: StoryWithSourceCode): SourceCodeTab[] {
	const { sourceCode } = story.parameters
	return Array.isArray(sourceCode) ? sourceCode.filter(isSourceCodeTab) : []
}

/** Code de l'onglet `name` du paramètre `sourceCode` d'une story, chaîne vide s'il n'existe pas. */
export function getSnippetTab(story: StoryWithSourceCode, name: string): string {
	return getSourceCodeTabs(story).find(tab => tab.name === name)?.code ?? ''
}

function parseSnippet(story: StoryWithSourceCode) {
	return parse(getSourceCodeTabs(story).map(tab => tab.code).join('\n'))
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

function importedNames(declaration: ts.ImportDeclaration): string[] {
	const clause = declaration.importClause
	if (!clause || clause.isTypeOnly) {
		return []
	}
	const bindings = clause.namedBindings
	const named = bindings && ts.isNamedImports(bindings)
		? bindings.elements.filter(element => !element.isTypeOnly).map(element => element.name.text)
		: bindings ? [bindings.name.text] : []
	return clause.name ? [clause.name.text, ...named] : named
}

function declaresBinding(statement: ts.Statement, name: string): boolean {
	if (ts.isVariableStatement(statement)) {
		return statement.declarationList.declarations.some(declaration => ts.isIdentifier(declaration.name) && declaration.name.text === name)
	}
	return (ts.isFunctionDeclaration(statement) || ts.isClassDeclaration(statement)) && statement.name?.text === name
}

/**
 * Exécute le `<script setup>` de l'extrait d'une story, tel que recopié par un consommateur,
 * et renvoie la valeur de la variable `name` déclarée à sa racine.
 * Les imports sont retirés et remplacés par les valeurs de `imports` (fonction vide par défaut).
 * Lève une erreur si l'extrait n'a pas de `<script setup>` ou ne déclare pas `name`.
 */
export function evaluateSnippetBinding(
	story: StoryWithSourceCode,
	name: string,
	imports: Record<string, unknown> = {},
): unknown {
	const content = parseSnippet(story).descriptor.scriptSetup?.content
	if (content === undefined) {
		throw new Error('L\'extrait ne contient pas de <script setup>.')
	}

	const source = ts.createSourceFile(`${SNIPPET_ID}.ts`, content, ts.ScriptTarget.ES2022)
	const statements = source.statements.filter(statement => !ts.isImportDeclaration(statement))
	if (!statements.some(statement => declaresBinding(statement, name))) {
		throw new Error(`L'extrait ne déclare pas « ${name} ».`)
	}

	const names = source.statements.filter(ts.isImportDeclaration).flatMap(importedNames)
	const script = ts.factory.updateSourceFile(source, statements)
	const { outputText } = ts.transpileModule(`${ts.createPrinter().printFile(script)}\nreturn ${name}`, {
		compilerOptions: { target: ts.ScriptTarget.ES2022 },
	})
	const noop = () => undefined
	return new Function(...names, outputText)(...names.map(imported => (imported in imports ? imports[imported] : noop)))
}

/**
 * Valeur d'une expression littérale liée dans le template d'un extrait (`:foo="['+', '.']"`), sans l'exécuter.
 * Seuls les chaînes, nombres, booléens, `null`, tableaux et objets sont acceptés.
 * Lève une erreur pour toute autre expression (variable, appel, accès à une propriété…).
 */
export function evaluateSnippetLiteral(expression: string): unknown {
	const source = ts.createSourceFile(`${SNIPPET_ID}.ts`, `(${expression})`, ts.ScriptTarget.ES2022)
	const [statement] = source.statements
	if (source.statements.length !== 1 || statement === undefined || !ts.isExpressionStatement(statement)) {
		throw new Error(`Expression invalide dans l'extrait : ${expression}`)
	}

	return readLiteral(statement.expression)
}

function readLiteral(node: ts.Expression): unknown {
	if (ts.isParenthesizedExpression(node)) {
		return readLiteral(node.expression)
	}
	if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
		return node.text
	}
	if (ts.isNumericLiteral(node)) {
		return Number(node.text)
	}
	if (ts.isPrefixUnaryExpression(node) && node.operator === ts.SyntaxKind.MinusToken && ts.isNumericLiteral(node.operand)) {
		return -Number(node.operand.text)
	}
	if (node.kind === ts.SyntaxKind.TrueKeyword) {
		return true
	}
	if (node.kind === ts.SyntaxKind.FalseKeyword) {
		return false
	}
	if (node.kind === ts.SyntaxKind.NullKeyword) {
		return null
	}
	if (ts.isArrayLiteralExpression(node)) {
		return node.elements.map(readLiteral)
	}
	if (ts.isObjectLiteralExpression(node)) {
		return Object.fromEntries(node.properties.map((property) => {
			if (!ts.isPropertyAssignment(property) || !(ts.isIdentifier(property.name) || ts.isStringLiteral(property.name))) {
				throw new Error(`Propriété non littérale dans l'extrait : ${ts.SyntaxKind[property.kind]}`)
			}
			return [property.name.text, readLiteral(property.initializer)]
		}))
	}
	throw new Error(`Expression non littérale dans l'extrait : ${ts.SyntaxKind[node.kind]}`)
}

/**
 * Imports nommés du `<script setup>` de l'extrait d'une story absents de leur module,
 * au format `module:export`. `modules` associe chaque module importable à ses exports réels.
 * Un module absent de `modules` est signalé pour chacun de ses imports.
 * Les imports de type (`import type`, `import { type X }`) sont ignorés : ils n'existent pas à l'exécution.
 */
export function findUnknownSnippetImports(
	story: StoryWithSourceCode,
	modules: Record<string, Record<string, unknown>>,
): string[] {
	const content = parseSnippet(story).descriptor.scriptSetup?.content ?? ''
	const source = ts.createSourceFile(`${SNIPPET_ID}.ts`, content, ts.ScriptTarget.ES2022)

	return source.statements.filter(ts.isImportDeclaration).flatMap((declaration) => {
		const clause = declaration.importClause
		const bindings = clause?.namedBindings
		if (!clause || clause.isTypeOnly || !bindings || !ts.isNamedImports(bindings) || !ts.isStringLiteral(declaration.moduleSpecifier)) {
			return []
		}
		const moduleName = declaration.moduleSpecifier.text
		const exports = modules[moduleName]
		return bindings.elements
			.filter(element => !element.isTypeOnly)
			// `import { A as B }` : c'est `A` qui doit être exporté par le module
			.map(element => (element.propertyName ?? element.name).text)
			.filter(name => exports === undefined || !(name in exports))
			.map(name => `${moduleName}:${name}`)
	})
}
