<script setup lang="ts">
	import { mdiCalendarMonthOutline } from '@mdi/js'
	import SyIcon from '@/components/Customs/SyIcon/SyIcon.vue'

	const props = withDefaults(defineProps<{
		/** Visible text of the button */
		label?: string
		/** aria-label and title of the button */
		ariaLabel?: string
		/** Serializes today's date into the host's model format */
		format?: (date: Date) => string | Date
	}>(), {
		label: 'Mois actuel',
		ariaLabel: 'Sélectionner le mois en cours',
		format: (date: Date) => `${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`,
	})

	const emits = defineEmits<{
		(e: 'update:modelValue', value: string | Date): void
	}>()

	function selectCurrent() {
		emits('update:modelValue', props.format(new Date()))
	}
</script>

<template>
	<div class="month-picker-footer">
		<button
			class="month-picker-footer__current-month-btn"
			type="button"
			:aria-label="props.ariaLabel"
			:title="props.ariaLabel"
			@click="selectCurrent"
		>
			<SyIcon
				:icon="mdiCalendarMonthOutline"
				size="x-small"
				decorative
			/>
			{{ props.label }}
		</button>
	</div>
</template>

<style scoped lang="scss">
.month-picker-footer {
	padding: 0 12px 12px;
}

.month-picker-footer__current-month-btn {
	display: flex;
	gap: 8px;
	margin: auto;
	margin-block: 8px;
	padding: 8px;
	text-align: center;
	align-items: center;
	font-weight: bold;
	font-size: var(--v-typography-body2-font-size, 1rem);
	border: 0;
	border-radius: 99px;
	background-color: transparent;
	color: rgb(var(--v-theme-primary, 12, 65, 154));
	cursor: pointer;
	transition: background-color 0.2s ease;
	margin-bottom: 2px;

	&:hover {
		background-color: rgba(var(--v-theme-primary, 12, 65, 154), 0.08);
	}

	&:focus-visible {
		/* stylelint-disable-next-line custom-property-pattern */
		outline: 2px solid rgb(var(--v-theme-primary, 12, 65, 154));
	}
}
</style>
