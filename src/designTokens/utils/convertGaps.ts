export const convertGaps = (gaps: any) => {
	let result = ''
	for (const key in gaps) {
		result += `--ga-${key}: ${gaps[key]} !important; `
	}
	console.log(result)
	return result
}
