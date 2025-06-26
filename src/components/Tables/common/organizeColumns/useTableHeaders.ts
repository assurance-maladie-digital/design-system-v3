import { computed, ref, watch, type Ref } from 'vue'
import type { SyHeaders } from '../types'

export default function (headers: Ref<SyHeaders | undefined>): {
	displayHeaders: Ref<SyHeaders>
	internalHeaders: Ref<SyHeaders>
} {
	const internalHeaders = ref<SyHeaders>([])
	watch(headers, (newHeaders) => {
		// Update internal headers when props.headers changes
		internalHeaders.value = newHeaders!
	}, { immediate: true, deep: true })

	const displayHeaders = computed(() => {
		return internalHeaders.value.filter((header) => {
			return header.hidden !== true
		}).sort((a, b) => {
			return (a.order || 0) - (b.order || 0)
		})
	})

	return {
		internalHeaders,
		displayHeaders,
	}
}
