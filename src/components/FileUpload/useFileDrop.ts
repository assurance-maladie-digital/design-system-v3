import { onMounted, toValue, type MaybeRef } from 'vue'

export default function useFileDrop(
	dropZone: MaybeRef<HTMLElement | null>,
	callback: (files: File[]) => void,
) {
	onMounted(() => {
		const inputEl = toValue(dropZone)

		if (!inputEl) return

		inputEl.addEventListener('drop', (e) => {
			e.preventDefault()
			e.stopPropagation()

			const droppedFiles = e.dataTransfer?.files

			if (!droppedFiles?.length) return

			callback(Array.from(droppedFiles))
		})
	})
}
