<script lang="ts" setup>
	import DatePicker from '@/components/DatePicker/CalendarMode/DatePicker.vue'
    import { format } from 'date-fns'
    import { computed, ref } from 'vue'

	const dateDebutActif = new Date()
	const stringDateDebutActif = format(dateDebutActif, 'dd/MM/yyyy')

	function hasDifferentValueAs(value: any, otherValue: any, errorMessage: string) {
		if (typeof otherValue !== 'boolean' && !value) {
			return true
		}
		if (value !== otherValue) {
			return true
		}
		return errorMessage
	}

	const date1 = ref<string | null>(null)

	const date1Rules = computed(() => [
		{ type: 'notBeforeToday' },
		{
			type: 'custom',
			options: {
				validate: (value: string) => {
					console.log('?. validate date1Rules - value:', value)
					return hasDifferentValueAs(
						format(value, 'dd/MM/yyyy'),
						stringDateDebutActif,
						'La date ne doit pas être inférieur ou égale à la date début active',
					)
				},
			},
		},
	])
</script>

<template>
	<div class="ma-5 w-25">
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
	</div>
</template>