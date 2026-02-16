<template>
	<div class="rnte-grid">
		<DatePicker
			v-model="dateNaissance"
			:custom-rules="dateNaissanceRules"
			is-birth-date
			label="Date de naissance"
			use-combined-mode
			display-append-icon
			outlined
			required
			:show-success-messages="false"
		/>
		<DatePicker
			v-model="dateDeces"
			:custom-rules="dateDecesRules"
			label="Date de décès (optionnel)"
			use-combined-mode
			display-append-icon
			outlined
			:show-success-messages="false"
		/>
	</div>
</template>
<script lang="ts" setup>
import DatePicker from '@/components/DatePicker/CalendarMode/DatePicker.vue'
import { computed, ref } from 'vue'

const dateNaissance = ref()
const dateNaissanceRules = computed(() => [
	{
		type: 'notAfterToday',
	},
])

const dateDeces = ref()
const DECES_NOT_BEFORE_NAISSANCE_MSG =
	'La date de décès est inférieure à la date de naissance'
const dateDecesRules = computed(() => [
	{ type: 'notAfterToday' },
	{
		type: 'notBeforeDate',
		options: {
			date: dateNaissance.value,
			message: DECES_NOT_BEFORE_NAISSANCE_MSG,
		},
	},
])
</script>