<script setup lang="ts">
	import { computed } from 'vue'

	interface SyCheckboxProps {
		modelValue?: boolean
		indeterminate?: boolean
		density?: 'default' | 'comfortable' | 'compact'
		color?: string
		hideDetails?: boolean
		isHeader?: boolean
		ariaLabel?: string
	}

	const props = withDefaults(defineProps<SyCheckboxProps>(), {
		modelValue: false,
		indeterminate: false,
		density: 'compact',
		color: 'primary',
		hideDetails: true,
		isHeader: false,
		ariaLabel: undefined,
	})

	const emit = defineEmits<{
		(e: 'update:modelValue', value: boolean): void
		(e: 'click', event: MouseEvent): void
	}>()

	const updateValue = (event: MouseEvent) => {
		emit('update:modelValue', !props.modelValue)
		emit('click', event)
	}

	const ariaLabelValue = computed(() => {
		if (props.ariaLabel) {
			return props.ariaLabel
		}
		return props.isHeader ? 'Sélectionner toutes les lignes' : 'Sélectionner cette ligne'
	})
</script>

<template>
	<div class="sy-checkbox">
		<v-checkbox
			:model-value="modelValue"
			:indeterminate="indeterminate"
			:color="color"
			:density="density"
			:hide-details="hideDetails"
			:aria-label="ariaLabelValue"
			@click.stop="updateValue"
		/>
	</div>
</template>

<style lang="scss" scoped>
.sy-checkbox {
	display: inline-flex;
	align-items: center;
	justify-content: center;
}
</style>
