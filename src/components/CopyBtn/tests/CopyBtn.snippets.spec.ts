import { describe, expect, it } from 'vitest'
import { composeStories } from '@storybook/vue3-vite'
import { camelize } from 'vue'
import { parse } from 'vue/compiler-sfc'
import { mdiContentDuplicate } from '@mdi/js'
import { analyzeSnippet, evaluateSnippetBinding } from '@tests/helpers/storySnippets'
import CopyBtn from '../CopyBtn.vue'
import * as stories from '../CopyBtn.stories'

const allStories = Object.entries(composeStories(stories)).map(([name, story]) => ({ name, story }))

const copyBtnProps = Object.keys(CopyBtn.props ?? {})

function getPropDefault(name: string): unknown {
	const definition: unknown = Object.entries(CopyBtn.props ?? {}).find(([key]) => key === name)?.[1]

	return typeof definition === 'object' && definition !== null && 'default' in definition ? definition.default : undefined
}

type SnippetStory = { parameters: Record<string, unknown> }

function getContent(node: unknown): string | undefined {
	return typeof node === 'object' && node !== null && 'content' in node && typeof node.content === 'string' ? node.content : undefined
}

// Valeur d'une expression liée (`:foo="…"`) : variable du `<script setup>` ou littéral.
function evaluateBoundExpression(story: SnippetStory, expression: string): unknown {
	return /^[A-Z_$][\w$]*$/i.test(expression)
		? evaluateSnippetBinding(story, expression)
		: new Function(`return (${expression})`)()
}

// Attributs posés sur `<CopyBtn>` dans l'extrait affiché (`foo`, `:foo` et `v-bind:foo`), en camelCase, avec leur valeur.
function getSnippetCopyBtnAttributes(story: SnippetStory): Map<string, unknown> {
	const tabs = Array.isArray(story.parameters.sourceCode) ? story.parameters.sourceCode : []
	const template = tabs.find(tab => tab.name === 'Template')?.code ?? ''
	const { descriptor } = parse(template)

	const collect = (node: unknown): [string, unknown][] => {
		if (typeof node !== 'object' || node === null) {
			return []
		}
		const children: unknown[] = 'children' in node && Array.isArray(node.children) ? node.children : []
		const props: unknown[] = 'tag' in node && node.tag === 'CopyBtn' && 'props' in node && Array.isArray(node.props) ? node.props : []
		const attributes = props.flatMap((prop): [string, unknown][] => {
			if (typeof prop !== 'object' || prop === null || !('name' in prop)) {
				return []
			}
			if (prop.name === 'bind' && 'arg' in prop && 'exp' in prop) {
				const name = getContent(prop.arg)
				const expression = getContent(prop.exp)
				return name !== undefined && expression !== undefined ? [[camelize(name), evaluateBoundExpression(story, expression)]] : []
			}
			if (!('value' in prop)) {
				return []
			}
			// Un attribut statique sans valeur (`hide-tooltip`) vaut `true` pour une prop booléenne.
			return [[camelize(String(prop.name)), getContent(prop.value) ?? true]]
		})
		return [...attributes, ...children.flatMap(collect)]
	}

	return new Map(collect(descriptor.template?.ast))
}

describe('CopyBtn snippets', () => {
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

	it.each(allStories)('l\'extrait de $name ne passe à CopyBtn que des props déclarées', ({ story }) => {
		const names = [...getSnippetCopyBtnAttributes(story).keys()]

		expect(names).toContain('ariaLabel')
		expect(names.filter(name => !copyBtnProps.includes(name))).toEqual([])
	})

	it.each(allStories)('l\'extrait de $name affiche les props de CopyBtn définies dans ses args, avec leur valeur', ({ story }) => {
		const attributes = getSnippetCopyBtnAttributes(story)
		const propsFromArgs = Object.fromEntries(Object.entries(story.args)
			.filter(([name, value]) => copyBtnProps.includes(name) && value !== undefined && value !== getPropDefault(name)))

		expect(Object.fromEntries([...attributes].filter(([name]) => name in propsFromArgs))).toEqual(propsFromArgs)
	})

	it.each([
		{ name: 'SlotIcon', arg: 'icon', binding: 'duplicateIcon' },
		{ name: 'SlotTooltip', arg: 'tooltip', binding: 'tooltip' },
	] as const)('l\'extrait de $name déclare $binding avec la valeur de l\'arg $arg', ({ name, arg, binding }) => {
		const story = allStories.find(entry => entry.name === name)!.story
		const args: Record<string, unknown> = story.args

		expect(evaluateSnippetBinding(story, binding, { mdiContentDuplicate })).toBe(args[arg])
	})
})
