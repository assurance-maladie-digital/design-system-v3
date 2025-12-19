import type { AxeResults } from 'axe-core'

interface A11yAssertOptions {
	ignoreRules?: string[]
}

export function assertNoA11yViolations(
	results: AxeResults,
	context: string,
	options: A11yAssertOptions = {},
): void {
	const { ignoreRules = [] } = options

	const violations = results.violations.filter(v => !ignoreRules.includes(v.id))

	if (violations.length === 0)
		return

	// Affichage lisible et très visible pour aider au debug a11y
	const lines = violations.map((v, index) => {
		const shortHelp = v.help.split('.')[0]
		const firstTarget = v.nodes[0]?.target?.join(' ') ?? ''
		const targetsCount = v.nodes.length
		return `${index + 1}. [${v.id}] impact=${v.impact ?? 'unknown'} targets=${targetsCount}`
			+ (firstTarget ? ` firstTarget=${firstTarget}` : '')
			+ ` – ${shortHelp}`
	})

	const header = `===== A11Y VIOLATIONS – ${context} =====`
	const block = `${header}\n${lines.join('\n')}\n${'='.repeat(header.length)}`

	// Rouge (ANSI) pour rendre le bloc très visible dans la sortie de tests
	console.log(`\n\x1b[31m${block}\x1b[0m`)

	const summary = violations
		.map((v, index) => {
			const targets = v.nodes
				.slice(0, 3)
				.map(n => n.target.join(' '))
				.join(' | ')
			return `${index + 1}. ${v.id} (${v.impact ?? 'unknown'}) – ${v.help} [targets: ${targets}]`
		})
		.join('\n')

	throw new Error(
		`[a11y][${context}] ${violations.length} violation(s) axe:\n${summary}`,
	)
}
