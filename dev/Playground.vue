<script lang="ts" setup>
	import { ref } from 'vue'
	import DatePicker from '@/components/DatePicker/CalendarMode/DatePicker.vue'

	const dateSaisine = ref('2023-01-11')
</script>

<template>
	<div style="padding: 20px; max-width: 400px;">
        {{  dateSaisine }}
		<DatePicker
			v-model="dateSaisine"
			placeholder="Sélectionner une période"
        format="DD/MM/YYYY"
        display-range
        use-combined-mode
		/>
		<div style="margin-top: 20px; font-family: monospace;">
			Valeur: {{ dateSaisine || 'Non définie' }}
		</div>
	</div>
</template>
