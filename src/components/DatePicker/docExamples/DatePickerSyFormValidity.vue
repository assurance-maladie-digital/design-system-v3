<script setup lang="ts">
	import { shallowRef } from 'vue'
	import { VBtn } from 'vuetify/components'
	import SyForm from '@/components/Customs/SyForm/SyForm.vue'
	import type { DateModelValue } from '@/composables/date/useDateInitializationDayjs'
	import DatePicker from '../CalendarMode/DatePicker.vue'

	defineProps<{
		mode: 'calendar' | 'text' | 'combined'
	}>()

	const date = shallowRef<DateModelValue>('')
	const valid = shallowRef<boolean | null>(null)
	const submitted = shallowRef<boolean | null>(null)

	function onSubmit({ isValid }: { isValid: boolean }) {
		submitted.value = isValid
	}
</script>

<template>
	<SyForm
		v-model="valid"
		class="pa-4"
		@submit="onSubmit"
	>
		<div class="d-flex flex-column align-start ga-4">
			<p v-if="mode === 'calendar'">
				Ouvrez le calendrier, sélectionnez une date, puis quittez le champ avec Tab ou le bouton « Sortir du champ ».
			</p>
			<p v-else>
				Saisissez 32/11/2026 et quittez le champ pour voir l’erreur. Corrigez en 30/11/2026, puis quittez à nouveau le champ.
			</p>
			<DatePicker
				v-model="date"
				label="Date (JJ/MM/AAAA)"
				placeholder="JJ/MM/AAAA"
				format="DD/MM/YYYY"
				required
				:is-validate-on-blur="true"
				:no-calendar="mode === 'text'"
				:use-combined-mode="mode === 'combined'"
			/>
			<p role="status">
				Validité du SyForm (<code>v-model</code>) <code>{{ String(valid) }}</code>
			</p>
			<div class="d-flex flex-wrap ga-3">
				<VBtn
					type="button"
					variant="outlined"
				>
					Sortir du champ
				</VBtn>
				<VBtn
					type="submit"
					color="primary"
					:disabled="valid !== true"
				>
					Soumettre
				</VBtn>
			</div>
			<p
				v-if="submitted !== null"
				role="status"
			>
				Dernière soumission <code>isValid = {{ submitted }}</code>
			</p>
		</div>
	</SyForm>
</template>
