<script setup lang="ts">
	import { shallowRef } from 'vue'
	import { VBtn } from 'vuetify/components'
	import SyForm from '@/components/Customs/SyForm/SyForm.vue'
	import type { DateModelValue } from '@/composables/date/useDateInitializationDayjs'
	import DatePicker from '../CalendarMode/DatePicker.vue'

	const props = defineProps<{
		mode: 'calendar' | 'text' | 'combined'
	}>()

	// En mode calendrier seul, la sélection d'une date valide suffit à valider le champ :
	// une règle custom permet aussi de démontrer le passage valide → invalide → valide.
	const calendarCustomRules = [
		{
			type: 'custom',
			options: {
				validate: (value: unknown) => !(value instanceof Date && value.getDate() === 15),
				message: 'Le 15 du mois n\'est pas autorisé',
			},
		},
	]

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
			<p v-if="props.mode === 'calendar'">
				Ouvrez le calendrier et sélectionnez le 15 du mois : la custom rule affiche une erreur et le formulaire passe à
				<code>false</code>. Choisissez un autre jour puis quittez le champ : le formulaire redevient
				<code>true</code> avant la soumission.
			</p>
			<p v-else>
				Saisissez 32/11/2026 et quittez le champ pour voir l’erreur. Corrigez en 30/11/2026, puis quittez à nouveau le champ.
			</p>
			<DatePicker
				v-model="date"
				label="Date"
				hint="Format attendu : JJ/MM/AAAA"
				persistent-hint
				placeholder="JJ/MM/AAAA"
				format="DD/MM/YYYY"
				required
				:is-validate-on-blur="true"
				:custom-rules="props.mode === 'calendar' ? calendarCustomRules : []"
				:no-calendar="props.mode === 'text'"
				:use-combined-mode="props.mode === 'combined'"
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
