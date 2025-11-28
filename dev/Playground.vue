<template>
			<DatePicker
				v-model="date2"
				disabled
				label="Date 2"
				display-append-icon
				outlined
				required
				:show-success-messages="false"
			/>
			<DatePicker
				v-model="date1"
				:custom-rules="date1Rules"
				bg-color="white"
				label="Date 1 (optionnel)"
				use-combined-mode
				display-append-icon
				outlined
				:show-success-messages="false"
			/>
</template>

<script lang="ts" setup>
	import DatePicker from '@/components/DatePicker/CalendarMode/DatePicker.vue'
    import { computed, ref } from 'vue'

	const date1= ref(undefined)
    const date2 = ref(undefined)
	
    // const date2 = ref(null)

const date1Rules = computed(() => [
	{
		type: 'notBeforeDate',
		options: {
			date: date2.value,
			message: "Date 1 ne doit pas être avant date 2",
		},
	},
])
</script>