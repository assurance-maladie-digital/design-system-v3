<script setup lang="ts">
	import { computed, ref } from 'vue'
	import {
		mdiAlertOutline,
		mdiCheck,
		mdiInformationOutline,
		mdiClose, mdiInformation,
	} from '@mdi/js'

	const props = defineProps<{
		prependIcon?: 'info' | 'success' | 'warning' | 'error' | 'close'
		appendIcon?: 'info' | 'success' | 'warning' | 'error' | 'close'
		preprendInnerIcon?: 'info' | 'success' | 'warning' | 'error' | 'close'
		appendInnerIcon?: 'info' | 'success' | 'warning' | 'error' | 'close'
		variantStyle?: 'outlined' | 'plain' | 'underlined' | 'filled' | 'solo' | 'solo-inverted' | 'solo-filled'
		color?: 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'error'
		isClearable?: boolean
		showDivider?: boolean
	}>()

	const iconMap = computed(() => {
		return {
			info: mdiInformationOutline,
			success: mdiCheck,
			warning: mdiAlertOutline,
			error: mdiInformation,
			close: mdiClose,
		}
	})

	const model = ref('')

	const appendInnerIconColor = computed(() => {
		switch (props.appendInnerIcon) {
		case 'error':
			return 'error'
		case 'success':
			return 'success'
		default:
			return 'black'
		}
	})
</script>

<template>
	<VTextField
		v-model="model"
		:variant="props.variantStyle"
		:color="props.color"
		:clearable="props.isClearable"
		:clear-icon="iconMap.close"
		:error="hasError"
	>
		<template #prepend>
			<slot name="prepend">
				<VIcon :icon="iconMap[props.prependIcon]" />
			</slot>
		</template>
		<template #append>
			<slot name="append">
				<VIcon :icon="iconMap[props.appendIcon]" />
			</slot>
		</template>
		<template #prepend-inner>
			<slot name="prepend-inner">
				<VIcon :icon="iconMap[props.preprendInnerIcon]" />
			</slot>
			<VDivider
				v-if="props.showDivider"
				class="mt-4 pa-1"
				vertical
				:thickness="2"
				length="25px"
				color="primary"
				opacity="1"
			/>
		</template>
		<template #append-inner>
			<slot name="append-inner">
				<VIcon
					:icon="iconMap[props.appendInnerIcon]"
					:class="{ 'error-icon': props.appendInnerIcon === 'error' }"
					:color="appendInnerIconColor"
					style="opacity:1;"
				/>
			</slot>
		</template>
	</VTextField>
</template>
