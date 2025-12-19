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

	const first = violations[0]
	throw new Error(
		`[a11y][${context}] ${violations.length} violation(s) axe. `
		+ `Ex: ${first.id} (${first.impact}) – ${first.help}`,
	)
}
