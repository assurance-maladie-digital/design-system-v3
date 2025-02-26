import { computed, ref, type Ref } from 'vue'
import type { UploadItem } from './types'

export default function useFileUploadJourney(
	fileListItems: Ref<UploadItem[]>,
) {
	const selectItems = computed(() => fileListItems.value.map(item => ({
		value: item.id,
		text: item.title,
	})))

	const selectedItem = ref<string>()

	return ({
		selectItems,
		selectedItem,
	})
}
