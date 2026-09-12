<script setup lang="ts">
	import { ref } from 'vue'
	import Calendar from '@/components/Date/Calendar.vue'

	const displayedMonth = ref(new Date(new Date().setMonth(11)))

	function nextMonth() {
		displayedMonth.value = new Date(displayedMonth.value.setMonth(displayedMonth.value.getMonth() + 1))
	}

	function previousMonth() {
		displayedMonth.value = new Date(displayedMonth.value.setMonth(displayedMonth.value.getMonth() - 1))
	}

	const selectedDays = ref<Date[]>([
		new Date('2026-12-18'),
		new Date('2026-12-22'),
		new Date('2026-12-27'),
	])

	const range = ref<[Date, Date]>([new Date('2026-12-04'), new Date('2026-12-15')])

	const selectedRange = ref<[Date, Date]>()
</script>

<template>
	<div>
		<VBtn @click="previousMonth">
			Previous
		</VBtn>
		<VBtn @click="nextMonth">
			Next
		</VBtn>
		<Calendar
			:displayed-month="displayedMonth"
			:selected-days="selectedDays"
			:selected-range="range"
		>
			<template #day-2026-12-20>
				<div style="background: red; padding: 0.2rem 0.5rem;">
					20
				</div>
			</template>
		</Calendar>

		<Calendar
			v-model:selected-range="selectedRange"
			:displayed-month="displayedMonth"
			select-range
		/>
	</div>
</template>

<style lang="scss" scoped></style>
