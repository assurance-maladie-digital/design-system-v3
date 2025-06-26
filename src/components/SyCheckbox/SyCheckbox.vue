<script setup lang="ts">
	import { computed } from 'vue'

	interface SyCheckboxProps {
		/**
		 * Whether the checkbox is checked
		 */
		modelValue?: boolean

		/**
		 * Whether the checkbox is in an indeterminate state
		 */
		indeterminate?: boolean

		/**
		 * Density of the checkbox (from Vuetify)
		 */
		density?: 'default' | 'comfortable' | 'compact'

		/**
		 * Color of the checkbox (from Vuetify)
		 */
		color?: string

		/**
		 * Whether to hide details/validation
		 */
		hideDetails?: boolean

		/**
		 * Whether this is a header checkbox
		 */
		isHeader?: boolean

		/**
		 * ARIA label for the checkbox
		 */
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

	const checkboxClass = computed(() => {
		return {
			'sy-checkbox--header': props.isHeader,
			'sy-checkbox--row': !props.isHeader,
			'v-data-table-header__checkbox': props.isHeader,
			'v-data-table-row__checkbox': !props.isHeader,
		}
	})

	const ariaLabelValue = computed(() => {
		if (props.ariaLabel) {
			return props.ariaLabel
		}
		return props.isHeader ? 'Sélectionner toutes les lignes' : 'Sélectionner cette ligne'
	})
</script>

<template>
	<div :class="['sy-checkbox', checkboxClass]">
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

	:deep(.v-selection-control) {
		color: rgb(var(--v-theme-primary)) !important;
	}

	:deep(.v-selection-control--dirty .v-selection-control__input::before) {
		background-color: rgb(var(--v-theme-primary)) !important;
		border-color: rgb(var(--v-theme-primary)) !important;
	}

	:deep(.v-selection-control__input::before) {
		border-color: rgb(var(--v-theme-primary)) !important;
	}
}
</style>
