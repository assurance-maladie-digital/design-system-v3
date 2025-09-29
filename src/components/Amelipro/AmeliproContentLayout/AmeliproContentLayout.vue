<script setup lang="ts">
	import type { IndexedObject } from '../types'
	import { computed } from 'vue'
	import { convertToHex } from '@/utils/functions/convertToHex'
	import { useDisplay } from 'vuetify'

	const props = defineProps({
		bgColor: {
			type: String,
			default: 'ap-white',
		},
		uniqueId: {
			type: String,
			default: undefined,
		},
	})

	const { width } = useDisplay()

	const widthStyle = computed<IndexedObject>(() => {
		const styles: IndexedObject = {
			maxWidth: '100%',
			padding: '24px 10px',
		}

		if (width.value >= 1072) {
			styles.maxWidth = '980px'
			styles.padding = '24px 0'
		}

		if (width.value >= 1240) {
			styles.maxWidth = '1144px'
			styles.padding = '24px 0'
		}
		return styles
	})

	const bgStyle = computed<IndexedObject>(() => ({ backgroundColor: convertToHex(props.bgColor) }))
</script>

<template>
	<div
		:id="uniqueId ? `${uniqueId}-container` : undefined"
		class="w-100 amelipro-content-layout"
		:style="bgStyle"
	>
		<div
			:id="uniqueId ? `${uniqueId}-content` : undefined"
			class="mx-auto amelipro-content-layout__content"
			:style="widthStyle"
		>
			<slot />
		</div>
	</div>
</template>
