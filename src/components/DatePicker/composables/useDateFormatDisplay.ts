export const useDateFormatDisplay = () => {
	const getDisplayFormat = (format: string): string => {
		if (!format) return ''

		return format.replace(/[DMY]+/gi, (token) => {
			const upper = token.toUpperCase()
			const firstChar = upper.charAt(0)

			switch (firstChar) {
				case 'D':
					return 'J'.repeat(token.length)
				case 'M':
					return 'M'.repeat(token.length)
				case 'Y':
					return 'A'.repeat(token.length)
				default:
					return token
			}
		})
	}

	return {
		getDisplayFormat,
	}
}
