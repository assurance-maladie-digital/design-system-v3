// Inline Storybook `template` strings are plain JS template literals: ESLint's
// vue parser never sees them, so `vue/component-name-in-template-casing` can't
// check the components they render. This rule re-applies the same PascalCase
// convention by scanning those strings with a regex instead of a Vue AST.

const VUE_RESERVED_ELEMENTS = new Set([
	'template',
	'component',
	'slot',
	'transition',
	'transition-group',
	'keep-alive',
	'teleport',
])

const TAG_REGEX = /<\/?([a-zA-Z][\w-]*)/g

function toPascalCase(tag) {
	return tag
		.split('-')
		.map(part => part.charAt(0).toUpperCase() + part.slice(1))
		.join('')
}

export default {
	meta: {
		type: 'problem',
		docs: {
			description: 'Enforce PascalCase for component tags inside inline Storybook `template` strings',
		},
		fixable: 'code',
		schema: [],
		messages: {
			casing: 'Component "<{{tag}}>" should be written in PascalCase: "<{{expected}}>".',
		},
	},
	create(context) {
		const sourceCode = context.sourceCode ?? context.getSourceCode()

		return {
			'Property[key.name="template"] > TemplateLiteral'(node) {
				for (const quasi of node.quasis) {
					const raw = quasi.value.raw
					// `quasi.range[0]` points at the delimiter before the raw text (` or }), not at the raw text itself.
					const rawStart = quasi.range[0] + 1

					TAG_REGEX.lastIndex = 0
					let match
					while ((match = TAG_REGEX.exec(raw))) {
						const tag = match[1]
						if (!tag.includes('-') || VUE_RESERVED_ELEMENTS.has(tag.toLowerCase()))
							continue

						const groupOffset = match.index + (match[0].length - tag.length)
						const start = rawStart + groupOffset
						const end = start + tag.length
						const expected = toPascalCase(tag)

						context.report({
							loc: {
								start: sourceCode.getLocFromIndex(start),
								end: sourceCode.getLocFromIndex(end),
							},
							messageId: 'casing',
							data: { tag, expected },
							fix: fixer => fixer.replaceTextRange([start, end], expected),
						})
					}
				}
			},
		}
	},
}
