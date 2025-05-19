export function wrapText(maxLength: number) {
	return (value: string) => {
		const lines = value.split('\n')
		const newLines: string[] = []
		for (const line of lines) {
			if (line.length > maxLength) {
				const words = line.split(' ')
				let currentLine = ''
				for (const word of words) {
					if (currentLine.length + word.length + 1 > maxLength) {
						if (word.length > maxLength) {
							if (currentLine) {
								newLines.push(currentLine)
							}
							const wordRegex = new RegExp(`.{1,${maxLength - 1}}`, 'g')
							const wordLines = word.match(wordRegex)
							for (let i = 0; i < wordLines!.length - 1; i++) {
								wordLines![i] += '-'
								newLines.push(wordLines![i])
							}
							currentLine = wordLines![wordLines!.length - 1]
						}
						else {
							newLines.push(currentLine)
							currentLine = word
						}
					}
					else {
						currentLine += (currentLine.length ? ' ' : '') + word
					}
				}
				if (currentLine) {
					newLines.push(currentLine)
				}
			}
			else {
				newLines.push(line)
			}
		}
		return newLines.join('\n')
	}
}
