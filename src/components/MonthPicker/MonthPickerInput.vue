<script setup lang="ts">
	import { vMaska } from 'maska/vue'
	import { ref, watch } from 'vue'
	import SyTextField from '../Customs/SyTextField/SyTextField.vue'
	import SyIcon from '../Customs/SyIcon/SyIcon.vue'
	import { mdiCalendar } from '@mdi/js'

	const props = defineProps<{
		modelValue: string | undefined
		btnLabel: string
	}>()

	const emits = defineEmits<{
		(e: 'update:modelValue', value: string | undefined): void
	}>()

	const mask = '##/####'

	const innerValue = ref<string | undefined>(undefined)
	watch(
		() => props.modelValue,
		(newValue) => {
			innerValue.value = newValue
		},
		{ immediate: true },
	)

	watch(innerValue, (newValue, oldValue) => {
		if (newValue !== oldValue) {
			emits('update:modelValue', newValue)
		}
	})

	const toggleBtn = ref<HTMLButtonElement | null>(null)
	defineExpose({
		toggleBtn,
	})
</script>

<template>
	<SyTextField
		v-model="innerValue"
		v-maska="mask"
		show-success-messages
		disable-error-handling
	>
		<template #append>
			<button
				ref="toggleBtn"
				type="button"
				class="month-picker-input__toggle-btn"
				:title="props.btnLabel"
				:aria-label="props.btnLabel"
			>
				<SyIcon
					:icon="mdiCalendar"
					decorative
				/>
			</button>
		</template>
	</SyTextField>
</template>

<style scoped lang="scss">
</style>
