<script setup lang="ts">
	import { mdiCalendarMonthOutline } from '@mdi/js'
	import SyIcon from '@/components/Customs/SyIcon/SyIcon.vue'

	const emits = defineEmits<{
		(e: 'update:modelValue', value: string): void
	}>()

	function selectCurrentMonth() {
		const currentMonth = new Date().getMonth() + 1
		const currentYear = new Date().getFullYear()
		emits('update:modelValue', `${String(currentMonth).padStart(2, '0')}/${currentYear}`)
	}

	const btnText = 'Mois actuel'
	const btnLabel = `Sélectionner le mois en cours`
</script>

<template>
	<div class="month-picker-footer">
		<button
			class="month-picker-footer__current-month-btn"
			type="button"
			:aria-label="btnLabel"
			:title="btnLabel"
			@click="selectCurrentMonth"
		>
			<SyIcon
				:icon="mdiCalendarMonthOutline"
				decorative
			/>
			{{ btnText }}
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
	font-weight: bold;
	font-size: var(--v-typography-body2-font-size, 1rem);
	border-radius: 99px;
	color: rgb(var(--v-theme-primary, 12, 65, 154));
	margin-bottom: 2px;

	&:focus-visible {
		/* stylelint-disable-next-line custom-property-pattern */
		outline: 2px solid rgb(var(--v-theme-primary, 12, 65, 154));
	}
}
</style>
