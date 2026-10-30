import { afterEach, describe, expect, it } from 'vitest'
import { enableAutoUnmount, mount } from '@vue/test-utils'
import { composeStories } from '@storybook/vue3-vite'
import { camelize } from 'vue'
import { parse } from 'vue/compiler-sfc'
import { analyzeSnippet } from '@tests/helpers/storySnippets'
import CopyBtn from '../CopyBtn.vue'
import * as stories from '../CopyBtn.stories'

const allStories = Object.entries(composeStories(stories)).map(([name, story]) => ({ name, story }))

const copyBtnProps = Object.keys(CopyBtn.props ?? {})

// Noms des attributs posés sur `<CopyBtn>` dans l'extrait affiché (`foo`, `:foo` et `v-bind:foo`).
function getSnippetCopyBtnAttributes(story: { parameters: Record<string, unknown> }): string[] {
	const tabs = Array.isArray(story.parameters.sourceCode) ? story.parameters.sourceCode : []
	const template = tabs.find(tab => tab.name === 'Template')?.code ?? ''
	const { descriptor } = parse(template)

	const collect = (node: unknown): string[] => {
		if (typeof node !== 'object' || node === null) {
			return []
		}
		const children: unknown[] = 'children' in node && Array.isArray(node.children) ? node.children : []
		const props: unknown[] = 'tag' in node && node.tag === 'CopyBtn' && 'props' in node && Array.isArray(node.props) ? node.props : []
		const names = props.flatMap((prop) => {
			if (typeof prop !== 'object' || prop === null || !('name' in prop)) {
				return []
			}
			if (prop.name === 'bind' && 'arg' in prop && typeof prop.arg === 'object' && prop.arg !== null && 'content' in prop.arg) {
				return [String(prop.arg.content)]
			}
			return 'value' in prop ? [String(prop.name)] : []
		})
		return [...names, ...children.flatMap(collect)]
	}

	return collect(descriptor.template?.ast)
}

enableAutoUnmount(afterEach)

describe('CopyBtn stories', () => {
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
		const attributes = getSnippetCopyBtnAttributes(story)

		expect(attributes).toContain('aria-label')
		expect(attributes.filter(name => !copyBtnProps.includes(camelize(name)))).toEqual([])
	})

	it.each(allStories)('$name nomme le bouton avec son ariaLabel', ({ story }) => {
		const wrapper = mount(story())

		expect(wrapper.find('button').attributes('aria-label')).toBe(story.args.ariaLabel)
		expect(wrapper.find('.sy-copy-btn').attributes('label')).toBeUndefined()
	})
})
