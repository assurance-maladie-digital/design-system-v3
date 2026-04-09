export function buildSemantic(semanticValues: Record<string, string>): string[] {
	const lines: string[] = ['', '// Semantic Tokens']

	for (const [name, value] of Object.entries(semanticValues))
		lines.push(`$${name}: ${value};`)

	return lines
}
