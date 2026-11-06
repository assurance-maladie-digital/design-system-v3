import { useId } from 'vue'
import { mdiCalendar } from '@mdi/js'
import { vMaska } from 'maska/vue'
import SyIcon from '@/components/Customs/SyIcon/SyIcon.vue'
import SyTextField from '@/components/Customs/SyTextField/SyTextField.vue'
import { parseDate } from '@/composables/date/useDateFormatDayjs'
import SyDatePicker from '../SyDatePicker.vue'
import type { SyDatePickerProps } from '../types'
import type { Meta, StoryObj } from '@storybook/vue3-vite'

const meta: Meta<SyDatePickerProps> = {
	title: 'Composants/Formulaires/SyDatePicker/CustomInput',
	component: SyDatePicker,
	parameters: {
		docs: {
			description: {
				component: 'Replacement of the default input field via the `input` slot. The slot is text-only: bind `textValue` on the custom field and report the typed text through `updateTextValue` — validation, parsing (per `inputFormat`/`separator`) and display sync (picker selections, external model updates) remain handled by the component. Declare a custom format through the root `inputFormat`/`separator` props. `inputProps` carries the field props, the validation state and the picker props (`mode`, `locale`, …) to `v-bind` on the custom field; `mode` tells the custom input whether `textValue` holds a single date or a range.',
			},
			controls: {
				exclude: ['onUpdate:modelValue', 'onUpdate:open'],
			},
		},
		controls: {
			exclude: ['width', 'undefined', 'onUpdate:modelValue', 'onUpdate:open'],
		},
	},
}

export default meta
type Story = StoryObj<typeof meta>

const SHORT_DATE_FORMAT = 'DD-MM-YY'

export const CustomInputSyTextField: Story = {
	args: {
		modelValue: new Date(2025, 10, 11),
		label: 'Début du projet',
		inputFormat: SHORT_DATE_FORMAT,
		hint: 'Format JJ-MM-AA',
		placeholder: 'JJ-MM-AA',
		customRules: [{
			type: 'custom',
			options: {
				validate: (value: string | undefined) => parseDate(value, SHORT_DATE_FORMAT) !== null,
				message: 'Le format doit être JJ-MM-AA (ex: 25-12-26).',
			},
		}],
	},
	render: (args) => {
		return {
			components: { SyDatePicker, SyTextField, SyIcon },
			directives: { maska: vMaska },
			setup() {
				const mask = '##-##-##'
				return {
					args,
					mask,
					calendarIcon: mdiCalendar,
				}
			},
			template: `
				<SyDatePicker v-bind="args" v-model="args.modelValue">
					<template #input="{ inputProps, textValue, updateTextValue, setFocused, toggleBtnRef }">
						<SyTextField
							:model-value="textValue"
							v-maska="mask"
							v-bind="inputProps"
							variant-style="underlined"
							:disable-error-handling="true"
							@update:model-value="value => updateTextValue(value ?? undefined)"
							@focus="setFocused(true)"
							@blur="setFocused(false)"
						>
							<template #prepend>
								<button
									type="button"
									:ref="toggleBtnRef"
									title="Choisir une date"
									aria-label="Choisir une date"
								>
									<SyIcon
										:icon="calendarIcon"
										color="primary"
										decorative
									/>
								</button>
							</template>
						</SyTextField>
					</template>
				</SyDatePicker>
			`,
		}
	},
	parameters: {
		docs: {
			description: {
				story: 'Input custom construit sur `SyTextField` et Maska, comme le champ par défaut, mais au format court JJ-MM-AA (variante `underlined` au lieu d’`outlined`). Le format est déclaré via `inputFormat` : le composant parse le texte rapporté et reflète les sélections du picker dans `textValue` — aucun état local ni parsing côté story. `SyTextField` conserve labels, messages de validation et attributs ARIA natifs.',
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<SyDatePicker
						v-model="selectedDate"
						label="Début du projet"
						input-format="DD-MM-YY"
						help-text="Format JJ-MM-AA"
						placeholder="JJ-MM-AA"
						:custom-rules="rules"
					>
						<template #input="{ inputProps, textValue, updateTextValue, setFocused, toggleBtnRef }">
							<SyTextField
								:model-value="textValue"
								v-maska="mask"
								v-bind="inputProps"
								variant-style="underlined"
								@update:model-value="value => updateTextValue(value ?? undefined)"
								@focus="setFocused(true)"
								@blur="setFocused(false)"
							>
								<template #prepend>
									<button :ref="toggleBtnRef" type="button" aria-label="Choisir une date">
										<SyIcon :icon="mdiCalendar" decorative color="primary" />
									</button>
								</template>
							</SyTextField>
						</template>
					</SyDatePicker>
				</template>
				`,
			}, {
				name: 'Script',
				code: `
				<script setup lang="ts">
					import { SyDatePicker, SyIcon, SyTextField } from '@cnamts/synapse'
					import { mdiCalendar } from '@mdi/js'
					import { vMaska } from 'maska/vue'
					import { ref } from 'vue'
					import { parseDate } from '@cnamts/synapse'

					const selectedDate = ref<Date | undefined>(new Date(2025, 10, 11))

					const rules = [{
						type: 'custom',
						options: {
							validate: (value) => parseDate(value, 'DD-MM-YY') !== null,
							message: 'Le format doit être JJ-MM-AA (ex: 25-12-26).',
						},
					}]

					const mask = '##-##-##'
				</script>
				`,
			},
		],
	},
}

export const CustomInputStyle: Story = {
	args: {
		modelValue: new Date(2025, 10, 11),
		label: 'Début du projet',
		required: true,
		customRules: [{
			type: 'custom',
			options: {
				validate: (value: string | undefined) => /^(0[1-9]|[12]\d|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/.test(value ?? ''),
				message: 'Le format doit être JJ/MM/AAAA (ex: 25/12/2026).',
			},
		}],
	},
	render: (args) => {
		return {
			components: { SyDatePicker },
			setup() {
				// Accessibility associations: label → input, messages wired via aria-describedby
				const inputId = useId()
				const helpId = useId()
				const errorsId = useId()
				return {
					args,
					inputId,
					helpId,
					errorsId,
					describedBy: `${helpId} ${errorsId}`,
				}
			},
			template: `
				<SyDatePicker v-bind="args" v-model="args.modelValue">
					<template #input="{ inputProps, textValue, updateTextValue, setFocused, toggleBtnRef }">
						<div :style="{
							display: 'flex',
							alignItems: 'center',
							gap: '8px',
							border: '2px solid rgb(var(--v-theme-primary))',
							borderRadius: '9999px',
							padding: '4px 8px 4px 16px',
						}">
							<label
								:for="inputId"
								:style="{ fontWeight: 'bold' }"
							>
								{{ inputProps.label }}<span
									v-if="inputProps.required"
									aria-hidden="true"
								> *</span>
							</label>
							<input
								:id="inputId"
								type="text"
								:style="{
									flex: '1',
									border: 'none',
									padding: '8px 0',
									minWidth: '120px',
								}"
								placeholder="JJ/MM/AAAA"
								:value="textValue"
								:disabled="inputProps.disabled"
								:readonly="inputProps.readonly"
								:aria-required="inputProps.required"
								:aria-invalid="inputProps.hasError"
								:aria-describedby="describedBy"
								@input="updateTextValue($event.target.value)"
								@focus="setFocused(true)"
								@blur="setFocused(false)"
							>
							<button
								type="button"
								:ref="toggleBtnRef"
								:style="{
									border: 'none',
									borderRadius: '9999px',
									background: 'rgb(var(--v-theme-primary))',
									color: 'rgb(var(--v-theme-on-primary))',
									padding: '8px 16px',
									cursor: 'pointer',
								}"
							>
								Choisir
							</button>
						</div>
						<p
							:id="helpId"
							:style="{ margin: '4px 16px' }"
						>
							{{ inputProps.helpText }}
						</p>
						<div
							:id="errorsId"
							role="alert"
						>
							<p
								v-for="message in inputProps.errorMessages"
								:key="message"
								:style="{ color: 'rgb(var(--v-theme-error))', margin: '4px 16px' }"
							>
								{{ message }}
							</p>
						</div>
					</template>
				</SyDatePicker>
			`,
		}
	},
	parameters: {
		docs: {
			description: {
				story: 'Champ de saisie remplacé via le slot `input`, ici avec un style « pill » et le format par défaut JJ/MM/AAAA : l’input natif se contente de lier `textValue` et de rapporter la saisie via `updateTextValue`. La validation (règle custom de format + champ requis) fonctionne comme sur le champ par défaut, et les sélections du picker sont reflétées dans `textValue`. L’accessibilité est maintenue : label associé via `for`/`id`, texte d’aide et erreurs rattachés au champ par `aria-describedby`, `aria-invalid`/`aria-required` reflétés, erreurs annoncées via `role="alert"`, et bouton d’ouverture enregistré via `toggleBtnRef` (le sélecteur visuel gère `aria-haspopup` et le retour de focus).',
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<SyDatePicker
						v-model="selectedDate"
						label="Début du projet"
						required
						:custom-rules="rules"
					>
						<template #input="{ inputProps, textValue, updateTextValue, setFocused, toggleBtnRef }">
							<div class="custom-input">
								<label class="custom-input__label" :for="inputId">
									{{ inputProps.label }}<span aria-hidden="true"> *</span>
								</label>
								<input
									:id="inputId"
									type="text"
									class="custom-input__field"
									placeholder="JJ/MM/AAAA"
									:value="textValue"
									:aria-required="inputProps.required"
									:aria-invalid="inputProps.hasError"
									:aria-describedby="helpId + ' ' + errorsId"
									@input="updateTextValue($event.target.value)"
									@focus="setFocused(true)"
									@blur="setFocused(false)"
								>
								<button type="button" class="custom-input__toggle" :ref="toggleBtnRef">
									Choisir
								</button>
							</div>
							<p :id="helpId">{{ inputProps.helpText }}</p>
							<div :id="errorsId" role="alert">
								<p v-for="message in inputProps.errorMessages" :key="message" class="custom-input__error">
									{{ message }}
								</p>
							</div>
						</template>
					</SyDatePicker>
				</template>
				`,
			}, {
				name: 'Script',
				code: `
				<script setup lang="ts">
					import { SyDatePicker } from '@cnamts/synapse'
					import { useId } from 'vue'

					const selectedDate = ref<Date | undefined>(new Date(2025, 10, 11))

					const rules = [{
						type: 'custom',
						options: {
							validate: (value) => /^(0[1-9]|[12]\\d|3[01])\\/(0[1-9]|1[0-2])\\/\\d{4}$/.test(value ?? ''),
							message: 'Le format doit être JJ/MM/AAAA (ex: 25/12/2026).',
						},
					}]

					// Identifiants pour les associations aria (label, aide, erreurs)
					const inputId = useId()
					const helpId = useId()
					const errorsId = useId()
				</script>
				`,
			},
		],
	},
}

export const CustomInputFormat: Story = {
	args: {
		modelValue: new Date(2025, 10, 11),
		label: 'Début du projet',
		inputFormat: 'YYYY-MM-DD',
		helpText: 'Format AAAA-MM-JJ',
		customRules: [{
			type: 'custom',
			options: {
				validate: (value: string | undefined) => /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/.test(value ?? ''),
				message: 'Le format doit être AAAA-MM-JJ (ex: 2026-12-25).',
			},
		}],
	},
	render: (args) => {
		return {
			components: { SyDatePicker, SyIcon },
			setup() {
				return {
					args,
					calendarIcon: mdiCalendar,
				}
			},
			template: `
				<SyDatePicker v-bind="args" v-model="args.modelValue">
					<template #input="{ inputProps, textValue, updateTextValue, setFocused, toggleBtnRef }">
						<label :style="{ display: 'block', fontWeight: 'bold', marginBottom: '4px' }">
							{{ inputProps.label }}
						</label>
						<div :style="{ display: 'flex', gap: '8px', alignItems: 'center' }">
							<input
								type="text"
								:style="{
									border: '1px solid rgba(0, 0, 0, 0.38)',
									borderRadius: '4px',
									padding: '8px',
									minWidth: '140px',
								}"
								placeholder="AAAA-MM-JJ"
								:value="textValue"
								@input="updateTextValue($event.target.value)"
								@focus="setFocused(true)"
								@blur="setFocused(false)"
							>
							<button
								:ref="toggleBtnRef"
								type="button"
								title="Choisir une date"
								aria-label="Choisir une date"
								class="custom-input__toggle"
							>
								<SyIcon
									:icon="calendarIcon"
									decorative
									color="primary"
								/>
							</button>
						</div>
						<p
							v-for="message in inputProps.errorMessages"
							:key="message"
							:style="{ color: 'rgb(var(--v-theme-error))' }"
						>
							{{ message }}
						</p>
					</template>
				</SyDatePicker>
			`,
		}
	},
	parameters: {
		docs: {
			description: {
				story: 'Champ de saisie au format ISO (AAAA-MM-JJ) via le slot `input` : le format est déclaré avec `input-format="YYYY-MM-DD"`, l’input custom se contente de lier `textValue` et de rapporter la saisie via `updateTextValue` — le composant parse le texte ISO et formate les sélections du picker dans le même format (règle custom adaptée au format).',
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<SyDatePicker
						v-model="selectedDate"
						label="Début du projet"
						input-format="YYYY-MM-DD"
						help-text="Format AAAA-MM-JJ"
						:custom-rules="rules"
					>
						<template #input="{ inputProps, textValue, updateTextValue, setFocused, toggleBtnRef }">
							<label>{{ inputProps.label }}</label>
							<input
								type="text"
								placeholder="AAAA-MM-JJ"
								:value="textValue"
								@input="updateTextValue($event.target.value)"
								@focus="setFocused(true)"
								@blur="setFocused(false)"
							>
							<button :ref="toggleBtnRef" type="button" aria-label="Choisir une date">
								<SyIcon :icon="mdiCalendar" decorative color="primary" />
							</button>
						</template>
					</SyDatePicker>
				</template>
				`,
			}, {
				name: 'Script',
				code: `
				<script setup lang="ts">
					import { SyDatePicker } from '@cnamts/synapse'
					import { ref } from 'vue'

					const selectedDate = ref<Date | undefined>(new Date(2025, 10, 11))

					const rules = [{
						type: 'custom',
						options: {
							validate: (value) => /^\\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01])$/.test(value ?? ''),
							message: 'Le format doit être AAAA-MM-JJ (ex: 2026-12-25).',
						},
					}]
				</script>
				`,
			},
		],
	},
}

export const CustomInputRange: Story = {
	args: {
		modelValue: [new Date(2025, 10, 11), new Date(2025, 10, 21)],
		mode: 'range',
		label: 'Période du projet',
		inputFormat: 'YYYY-MM-DD',
		separator: ' - ',
		helpText: 'Format AAAA-MM-JJ - AAAA-MM-JJ',
		customRules: [{
			type: 'custom',
			options: {
				validate: (value: string | undefined) => /^\d{4}-\d{2}-\d{2} - \d{4}-\d{2}-\d{2}$/.test(value ?? ''),
				message: 'Le format doit être AAAA-MM-JJ - AAAA-MM-JJ.',
			},
		}],
	},
	render: (args) => {
		return {
			components: { SyDatePicker, SyIcon },
			setup() {
				return {
					args,
					calendarIcon: mdiCalendar,
				}
			},
			template: `
				<SyDatePicker v-bind="args" v-model="args.modelValue">
					<template #input="{ inputProps, textValue, updateTextValue, setFocused, toggleBtnRef }">
						<label :style="{ display: 'block', fontWeight: 'bold', marginBottom: '4px' }">
							{{ inputProps.label }}
						</label>
						<div :style="{ display: 'flex', gap: '8px', alignItems: 'center' }">
							<input
								type="text"
								:style="{ border: '1px solid rgba(0, 0, 0, 0.38)', borderRadius: '4px', padding: '8px', minWidth: '260px' }"
								placeholder="AAAA-MM-JJ - AAAA-MM-JJ"
								:value="textValue"
								@input="updateTextValue($event.target.value)"
								@focus="setFocused(true)"
								@blur="setFocused(false)"
							>
							<button
								:ref="toggleBtnRef"
								type="button"
								title="Choisir une période"
								aria-label="Choisir une période"
								class="custom-input__toggle"
							>
								<SyIcon :icon="calendarIcon" decorative color="primary" />
							</button>
						</div>
						<p v-for="message in inputProps.errorMessages" :key="message" :style="{ color: 'rgb(var(--v-theme-error))' }">
							{{ message }}
						</p>
					</template>
				</SyDatePicker>
			`,
		}
	},
	parameters: {
		docs: {
			description: {
				story: 'Champ de période personnalisé via le slot `input`, au format ISO `AAAA-MM-JJ - AAAA-MM-JJ` : le format est déclaré via `input-format` et `separator`, l’input lie `textValue` et rapporte la saisie via `updateTextValue` — le composant parse la plage complète et formate les sélections visuelles dans le même format.',
			},
		},
	},
}
