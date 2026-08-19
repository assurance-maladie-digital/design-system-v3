import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import DatePicker from '../CalendarMode/DatePicker.vue'

export default {
	title: 'Composants/Formulaires/DatePicker/Validation/VuetifyValidation',
	component: DatePicker,
	parameters: {
		docs: {
			description: {
				component: 'Exemples d\'utilisation du mode `useVuetifyValidation` avec des `rules` au format Vuetify (fonctions retournant `true` ou un message d\'erreur).',
			},
		},
	},
} as Meta

const submitButtonStyle = 'margin-top: 16px; padding: 8px 16px; background-color:#0c419a; color: white; border: none; border-radius: 4px; cursor: pointer;'

/* ------------------------------------------------------------------ */
/* noCalendar                                                          */
/* ------------------------------------------------------------------ */

export const NoCalendarRequired: StoryObj = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
	<form @submit.prevent="handleSubmit">
		<DatePicker
			ref="datePicker"
			v-model="date"
			no-calendar
			format="DD/MM/YYYY"
			placeholder="Date requise"
			use-vuetify-validation
			:rules="rules"
		/>
		<button type="submit">Soumettre</button>
	</form>
</template>
`,
			},
			{
				name: 'Script',
				code: `
<script setup lang="ts">
import { ref } from 'vue'
import DatePicker from '@/components/DatePicker/CalendarMode/DatePicker.vue'

const datePicker = ref()
const date = ref('')

const rules = [
	(value: unknown) => (typeof value === 'string' && value.length > 0) || 'La date est requise',
]

const handleSubmit = async () => {
	const isValid = await datePicker.value?.validateOnSubmit()
	if (!isValid) {
		alert('Corrigez les erreurs avant de soumettre !')
	}
	else {
		alert('Formulaire soumis avec succès !')
	}
}
</script>
`,
			},
		],
	},
	render: () => ({
		components: { DatePicker },
		setup() {
			const datePicker = ref()
			const date = ref('')

			const rules = [
				(value: unknown) => (typeof value === 'string' && value.length > 0) || 'La date est requise',
			]

			const handleSubmit = async () => {
				const isValid = await datePicker.value?.validateOnSubmit()
				if (!isValid) {
					alert('Corrigez les erreurs avant de soumettre !')
				}
				else {
					alert('Formulaire soumis avec succès !')
				}
			}

			return { datePicker, date, rules, handleSubmit }
		},
		template: `
			<div class="d-flex flex-wrap align-center pa-4">
				<form @submit.prevent="handleSubmit" style="width: 100%;">
					<DatePicker
						ref="datePicker"
						v-model="date"
						no-calendar
						format="DD/MM/YYYY"
						placeholder="Date requise"
						use-vuetify-validation
						:rules="rules"
					/>
					<button type="submit" style="${submitButtonStyle}">
						Soumettre
					</button>
				</form>
			</div>
		`,
	}),
}

export const NoCalendarMultipleRules: StoryObj = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
	<form @submit.prevent="handleSubmit">
		<DatePicker
			ref="datePicker"
			v-model="date"
			no-calendar
			format="DD/MM/YYYY"
			placeholder="JJ/MM/AAAA"
			use-vuetify-validation
			:rules="rules"
		/>
		<button type="submit">Soumettre</button>
	</form>
</template>
`,
			},
			{
				name: 'Script',
				code: `
<script setup lang="ts">
import { ref } from 'vue'
import DatePicker from '@/components/DatePicker/CalendarMode/DatePicker.vue'

const datePicker = ref()
const date = ref('')

const rules = [
	(value: unknown) => (typeof value === 'string' && value.length > 0) || 'La date est requise',
	(value: string) => {
		if (!value) return true
		const parts = value.split('/')
		if (parts.length !== 3) return 'Format attendu : JJ/MM/AAAA'
		const day = Number(parts[0])
		const month = Number(parts[1])
		const year = Number(parts[2])
		if (day < 1 || day > 31) return 'Le jour doit être entre 1 et 31'
		if (month < 1 || month > 12) return 'Le mois doit être entre 1 et 12'
		if (year < 1900 || year > 2100) return 'L\\'année doit être entre 1900 et 2100'
		return true
	},
]

const handleSubmit = async () => {
	const isValid = await datePicker.value?.validateOnSubmit()
	if (!isValid) {
		alert('Corrigez les erreurs avant de soumettre !')
	}
	else {
		alert('Formulaire soumis avec succès !')
	}
}
</script>
`,
			},
		],
	},
	render: () => ({
		components: { DatePicker },
		setup() {
			const datePicker = ref()
			const date = ref('')

			const rules = [
				(value: unknown) => (typeof value === 'string' && value.length > 0) || 'La date est requise',
				(value: string) => {
					if (!value) return true
					const parts = value.split('/')
					if (parts.length !== 3) return 'Format attendu : JJ/MM/AAAA'
					const day = Number(parts[0])
					const month = Number(parts[1])
					const year = Number(parts[2])
					if (day < 1 || day > 31) return 'Le jour doit être entre 1 et 31'
					if (month < 1 || month > 12) return 'Le mois doit être entre 1 et 12'
					if (year < 1900 || year > 2100) return 'L\'année doit être entre 1900 et 2100'
					return true
				},
			]

			const handleSubmit = async () => {
				const isValid = await datePicker.value?.validateOnSubmit()
				if (!isValid) {
					alert('Corrigez les erreurs avant de soumettre !')
				}
				else {
					alert('Formulaire soumis avec succès !')
				}
			}

			return { datePicker, date, rules, handleSubmit }
		},
		template: `
			<div class="d-flex flex-wrap align-center pa-4">
				<form @submit.prevent="handleSubmit" style="width: 100%;">
					<DatePicker
						ref="datePicker"
						v-model="date"
						no-calendar
						format="DD/MM/YYYY"
						placeholder="JJ/MM/AAAA"
						use-vuetify-validation
						:rules="rules"
					/>
					<button type="submit" style="${submitButtonStyle}">
						Soumettre
					</button>
				</form>
			</div>
		`,
	}),
}

/* ------------------------------------------------------------------ */
/* CalendarMode                                                        */
/* ------------------------------------------------------------------ */

export const CalendarModeRequired: StoryObj = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
	<form @submit.prevent="handleSubmit">
		<DatePicker
			ref="datePicker"
			v-model="date"
			format="DD/MM/YYYY"
			placeholder="Date requise"
			use-vuetify-validation
			:rules="rules"
		/>
		<button type="submit">Soumettre</button>
	</form>
</template>
`,
			},
			{
				name: 'Script',
				code: `
<script setup lang="ts">
import { ref } from 'vue'
import DatePicker from '@/components/DatePicker/CalendarMode/DatePicker.vue'

const datePicker = ref()
const date = ref('')

const rules = [
	(value: unknown) => (typeof value === 'string' && value.length > 0) || 'La date est requise',
]

const handleSubmit = async () => {
	const isValid = await datePicker.value?.validateOnSubmit()
	if (!isValid) {
		alert('Corrigez les erreurs avant de soumettre !')
	}
	else {
		alert('Formulaire soumis avec succès !')
	}
}
</script>
`,
			},
		],
	},
	render: () => ({
		components: { DatePicker },
		setup() {
			const datePicker = ref()
			const date = ref('')

			const rules = [
				(value: unknown) => (typeof value === 'string' && value.length > 0) || 'La date est requise',
			]

			const handleSubmit = async () => {
				const isValid = await datePicker.value?.validateOnSubmit()
				if (!isValid) {
					alert('Corrigez les erreurs avant de soumettre !')
				}
				else {
					alert('Formulaire soumis avec succès !')
				}
			}

			return { datePicker, date, rules, handleSubmit }
		},
		template: `
			<div class="d-flex flex-wrap align-center pa-4">
				<form @submit.prevent="handleSubmit" style="width: 100%;">
					<DatePicker
						ref="datePicker"
						v-model="date"
						format="DD/MM/YYYY"
						placeholder="Date requise"
						use-vuetify-validation
						:rules="rules"
					/>
					<button type="submit" style="${submitButtonStyle}">
						Soumettre
					</button>
				</form>
			</div>
		`,
	}),
}

export const CalendarModeNotAfterToday: StoryObj = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
	<form @submit.prevent="handleSubmit">
		<DatePicker
			ref="datePicker"
			v-model="date"
			format="DD/MM/YYYY"
			placeholder="JJ/MM/AAAA"
			use-vuetify-validation
			:rules="rules"
		/>
		<button type="submit">Soumettre</button>
	</form>
</template>
`,
			},
			{
				name: 'Script',
				code: `
<script setup lang="ts">
import { ref } from 'vue'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import DatePicker from '@/components/DatePicker/CalendarMode/DatePicker.vue'

dayjs.extend(customParseFormat)

const datePicker = ref()
const date = ref('')

const rules = [
	(value: unknown) => (typeof value === 'string' && value.length > 0) || 'La date est requise',
	(value: string) => {
		if (!value) return true
		const parsed = dayjs(value, 'DD/MM/YYYY')
		if (!parsed.isValid()) return 'Date invalide'
		if (parsed.isAfter(dayjs(), 'day')) return 'La date ne peut pas être postérieure à aujourd\\'hui'
		return true
	},
]

const handleSubmit = async () => {
	const isValid = await datePicker.value?.validateOnSubmit()
	if (!isValid) {
		alert('Corrigez les erreurs avant de soumettre !')
	}
	else {
		alert('Formulaire soumis avec succès !')
	}
}
</script>
`,
			},
		],
	},
	render: () => ({
		components: { DatePicker },
		setup() {
			const datePicker = ref()
			const date = ref('')

			const rules = [
				(value: unknown) => (typeof value === 'string' && value.length > 0) || 'La date est requise',
				(value: string) => {
					if (!value) return true
					const parts = value.split('/')
					if (parts.length !== 3) return 'Date invalide'
					const day = Number(parts[0])
					const month = Number(parts[1]) - 1
					const year = Number(parts[2])
					const inputDate = new Date(year, month, day)
					const today = new Date()
					today.setHours(23, 59, 59, 999)
					if (inputDate > today) return 'La date ne peut pas être postérieure à aujourd\'hui'
					return true
				},
			]

			const handleSubmit = async () => {
				const isValid = await datePicker.value?.validateOnSubmit()
				if (!isValid) {
					alert('Corrigez les erreurs avant de soumettre !')
				}
				else {
					alert('Formulaire soumis avec succès !')
				}
			}

			return { datePicker, date, rules, handleSubmit }
		},
		template: `
			<div class="d-flex flex-wrap align-center pa-4">
				<form @submit.prevent="handleSubmit" style="width: 100%;">
					<DatePicker
						ref="datePicker"
						v-model="date"
						format="DD/MM/YYYY"
						placeholder="JJ/MM/AAAA"
						use-vuetify-validation
						:rules="rules"
					/>
					<button type="submit" style="${submitButtonStyle}">
						Soumettre
					</button>
				</form>
			</div>
		`,
	}),
}

/* ------------------------------------------------------------------ */
/* CombinedMode                                                        */
/* ------------------------------------------------------------------ */

export const CombinedModeRequired: StoryObj = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
	<form @submit.prevent="handleSubmit">
		<DatePicker
			ref="datePicker"
			v-model="date"
			format="DD/MM/YYYY"
			placeholder="Date requise"
			use-combined-mode
			use-vuetify-validation
			:rules="rules"
		/>
		<button type="submit">Soumettre</button>
	</form>
</template>
`,
			},
			{
				name: 'Script',
				code: `
<script setup lang="ts">
import { ref } from 'vue'
import DatePicker from '@/components/DatePicker/CalendarMode/DatePicker.vue'

const datePicker = ref()
const date = ref('')

const rules = [
	(value: unknown) => (typeof value === 'string' && value.length > 0) || 'La date est requise',
]

const handleSubmit = async () => {
	const isValid = await datePicker.value?.validateOnSubmit()
	if (!isValid) {
		alert('Corrigez les erreurs avant de soumettre !')
	}
	else {
		alert('Formulaire soumis avec succès !')
	}
}
</script>
`,
			},
		],
	},
	render: () => ({
		components: { DatePicker },
		setup() {
			const datePicker = ref()
			const date = ref('')

			const rules = [
				(value: unknown) => (typeof value === 'string' && value.length > 0) || 'La date est requise',
			]

			const handleSubmit = async () => {
				const isValid = await datePicker.value?.validateOnSubmit()
				if (!isValid) {
					alert('Corrigez les erreurs avant de soumettre !')
				}
				else {
					alert('Formulaire soumis avec succès !')
				}
			}

			return { datePicker, date, rules, handleSubmit }
		},
		template: `
			<div class="d-flex flex-wrap align-center pa-4">
				<form @submit.prevent="handleSubmit" style="width: 100%;">
					<DatePicker
						ref="datePicker"
						v-model="date"
						format="DD/MM/YYYY"
						placeholder="Date requise"
						use-combined-mode
						use-vuetify-validation
						:rules="rules"
					/>
					<button type="submit" style="${submitButtonStyle}">
						Soumettre
					</button>
				</form>
			</div>
		`,
	}),
}

export const CombinedModeMultipleRules: StoryObj = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
	<form @submit.prevent="handleSubmit">
		<DatePicker
			ref="datePicker"
			v-model="date"
			format="DD/MM/YYYY"
			placeholder="JJ/MM/AAAA"
			use-combined-mode
			use-vuetify-validation
			:rules="rules"
		/>
		<button type="submit">Soumettre</button>
	</form>
</template>
`,
			},
			{
				name: 'Script',
				code: `
<script setup lang="ts">
import { ref } from 'vue'
import DatePicker from '@/components/DatePicker/CalendarMode/DatePicker.vue'

const datePicker = ref()
const date = ref('')

const rules = [
	(value: unknown) => (typeof value === 'string' && value.length > 0) || 'La date est requise',
	(value: string) => {
		if (!value) return true
		const parts = value.split('/')
		if (parts.length !== 3) return 'Format attendu : JJ/MM/AAAA'
		const day = Number(parts[0])
		const month = Number(parts[1])
		const year = Number(parts[2])
		if (day < 1 || day > 31) return 'Le jour doit être entre 1 et 31'
		if (month < 1 || month > 12) return 'Le mois doit être entre 1 et 12'
		if (year < 1900 || year > 2100) return 'L\\'année doit être entre 1900 et 2100'
		return true
	},
]

const handleSubmit = async () => {
	const isValid = await datePicker.value?.validateOnSubmit()
	if (!isValid) {
		alert('Corrigez les erreurs avant de soumettre !')
	}
	else {
		alert('Formulaire soumis avec succès !')
	}
}
</script>
`,
			},
		],
	},
	render: () => ({
		components: { DatePicker },
		setup() {
			const datePicker = ref()
			const date = ref('')

			const rules = [
				(value: unknown) => (typeof value === 'string' && value.length > 0) || 'La date est requise',
				(value: string) => {
					if (!value) return true
					const parts = value.split('/')
					if (parts.length !== 3) return 'Format attendu : JJ/MM/AAAA'
					const day = Number(parts[0])
					const month = Number(parts[1])
					const year = Number(parts[2])
					if (day < 1 || day > 31) return 'Le jour doit être entre 1 et 31'
					if (month < 1 || month > 12) return 'Le mois doit être entre 1 et 12'
					if (year < 1900 || year > 2100) return 'L\'année doit être entre 1900 et 2100'
					return true
				},
			]

			const handleSubmit = async () => {
				const isValid = await datePicker.value?.validateOnSubmit()
				if (!isValid) {
					alert('Corrigez les erreurs avant de soumettre !')
				}
				else {
					alert('Formulaire soumis avec succès !')
				}
			}

			return { datePicker, date, rules, handleSubmit }
		},
		template: `
			<div class="d-flex flex-wrap align-center pa-4">
				<form @submit.prevent="handleSubmit" style="width: 100%;">
					<DatePicker
						ref="datePicker"
						v-model="date"
						format="DD/MM/YYYY"
						placeholder="JJ/MM/AAAA"
						use-combined-mode
						use-vuetify-validation
						:rules="rules"
					/>
					<button type="submit" style="${submitButtonStyle}">
						Soumettre
					</button>
				</form>
			</div>
		`,
	}),
}

/* ------------------------------------------------------------------ */
/* Side-by-side comparison                                             */
/* ------------------------------------------------------------------ */

export const ComparisonSynapseVsVuetify: StoryObj = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
	<div style="display: grid; gap: 16px;">
		<div>
			<h3>Validation Synapse (customRules)</h3>
			<DatePicker
				v-model="synapseValue"
				no-calendar
				format="DD/MM/YYYY"
				placeholder="JJ/MM/AAAA"
				:custom-rules="synapseRules"
			/>
		</div>
		<div>
			<h3>Validation Vuetify (useVuetifyValidation + rules)</h3>
			<DatePicker
				v-model="vuetifyValue"
				no-calendar
				format="DD/MM/YYYY"
				placeholder="JJ/MM/AAAA"
				use-vuetify-validation
				:rules="vuetifyRules"
			/>
		</div>
	</div>
</template>
`,
			},
			{
				name: 'Script',
				code: `
<script setup lang="ts">
import { ref } from 'vue'
import DatePicker from '@/components/DatePicker/CalendarMode/DatePicker.vue'

const synapseValue = ref('')
const vuetifyValue = ref('')

const synapseRules = [
	{ type: 'notBeforeToday', options: { message: 'La date ne peut pas être antérieure à aujourd\\'hui' } },
]

const vuetifyRules = [
	(value: string) => {
		if (!value) return true
		const parts = value.split('/')
		if (parts.length !== 3) return 'Date invalide'
		const inputDate = new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]))
		const today = new Date()
		today.setHours(0, 0, 0, 0)
		if (inputDate < today) return 'La date ne peut pas être antérieure à aujourd\\'hui'
		return true
	},
]
</script>
`,
			},
		],
	},
	render: () => ({
		components: { DatePicker },
		setup() {
			const synapseValue = ref('')
			const vuetifyValue = ref('')

			const synapseRules = [
				{
					type: 'notBeforeToday',
					options: {
						message: 'La date ne peut pas être antérieure à aujourd\'hui',
					},
				},
			]

			const vuetifyRules = [
				(value: string) => {
					if (!value) return true
					const parts = value.split('/')
					if (parts.length !== 3) return 'Date invalide'
					const inputDate = new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]))
					const today = new Date()
					today.setHours(0, 0, 0, 0)
					if (inputDate < today) return 'La date ne peut pas être antérieure à aujourd\'hui'
					return true
				},
			]

			return { synapseValue, vuetifyValue, synapseRules, vuetifyRules }
		},
		template: `
			<div class="pa-4" style="display: grid; gap: 24px; max-width: 600px;">
				<div>
					<h3 class="text-subtitle-1 mb-2">Validation Synapse (customRules)</h3>
					<DatePicker
						v-model="synapseValue"
						no-calendar
						format="DD/MM/YYYY"
						placeholder="JJ/MM/AAAA"
						:custom-rules="synapseRules"
					/>
				</div>
				<div>
					<h3 class="text-subtitle-1 mb-2">Validation Vuetify (useVuetifyValidation + rules)</h3>
					<DatePicker
						v-model="vuetifyValue"
						no-calendar
						format="DD/MM/YYYY"
						placeholder="JJ/MM/AAAA"
						use-vuetify-validation
						:rules="vuetifyRules"
					/>
				</div>
			</div>
		`,
	}),
}
