/** Validate a prop against a set of values */
export function propValidator(
	propName: string,
	acceptedValues: string[],
	value: string,
): boolean {
	const stringValues = acceptedValues.join('|')
	const formattedValues = `(${stringValues})`
	const valuesRegexp = new RegExp(`^${formattedValues}$`)

	const isValid = value.match(valuesRegexp) !== null

	if (!isValid) {
		console.error(
			`Invalid value for the \`${propName}\` prop. Received: "${value}", expected one of: [${acceptedValues.join(', ')}].`,
		)
	}

	return true
}
