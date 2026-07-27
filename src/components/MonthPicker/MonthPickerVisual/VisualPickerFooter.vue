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
		<VBtn
			color="primary"
			variant="text"
			:aria-label="btnLabel"
			:title="btnLabel"
			@click="selectCurrentMonth"
		>
			<SyIcon
				class="mr-2"
				:icon="mdiCalendarMonthOutline"
				decorative
			/>
			{{ btnText }}
		</VBtn>
	</div>
</template>

<style scoped lang="scss">
.month-picker-footer {
	display: flex;
	justify-content: center;
	padding: 12px;
}
</style>
