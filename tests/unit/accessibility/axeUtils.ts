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

	// Affichage lisible dans la sortie de tests pour aider au debug a11y
	console.table(
		violations.map(v => ({
			id: v.id,
			impact: v.impact,
			help: v.help,
			targets: v.nodes
				.slice(0, 3)
				.map(n => n.target.join(' '))
				.join(' | '),
		})),
	)

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
