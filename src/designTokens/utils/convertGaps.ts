type Gaps = {
	[key: string]: string | number
}

export const convertGaps = (gaps: Gaps) => {
	let result = ''
	for (const key in gaps) {
		result += `--ga-${key}: ${gaps[key]} !important; `
	}
	return result
}
