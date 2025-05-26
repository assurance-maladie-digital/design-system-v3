export default function trimStartOnUpdate(input: HTMLTextAreaElement) {
	return (value: string) => {
		const trimedValue = value.trimStart()
		if (trimedValue === value) {
			return value
		}
		// update the text area content as we type
		input.value = trimedValue
		input.setSelectionRange(0, 0)
		return trimedValue
	}
}
