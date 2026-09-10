import { fn } from 'storybook/test'
import { ref, useId, watch } from 'vue'
import { mdiCalendar } from '@mdi/js'
import { vMaska } from 'maska/vue'
import SyIcon from '@/components/Customs/SyIcon/SyIcon.vue'
import SyTextField from '@/components/Customs/SyTextField/SyTextField.vue'
import { formatDate, parseDate } from '@/composables/date/useDateFormatDayjs'
import DatePickerLite from './DatePickerLite.vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { VBtn } from 'vuetify/components'

const meta: Meta<typeof DatePickerLite> = {
	title: 'Composants/Formulaires/DatePickerLite/CustomInput',
	component: DatePickerLite,
	parameters: {
		docs: {
			description: {
				component: 'Replacement of the default input field via the `input` slot. The component provides the slot props (`modelValue`, `updateModelValue`, `inputProps`, `updateTextValue`, `setFocused`, `toggleBtnRef`): validation, opening the visual picker, and date synchronization remain handled by the component; parsing of the typed text remains the responsibility of the custom input.',
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
type Story = StoryObj<typeof DatePickerLite>

const pad = (value: number): string => String(value).padStart(2, '0')

const parseFrDate = (value: string): Date | undefined => {
	const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value)
	return match ? new Date(Number(match[3]), Number(match[2]) - 1, Number(match[1])) : undefined
}

const formatFrDate = (value: Date): string =>
	`${pad(value.getDate())}/${pad(value.getMonth() + 1)}/${value.getFullYear()}`

const parseIsoDate = (value: string): Date | undefined => {
	const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)
	return match ? new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3])) : undefined
}

const formatIsoDate = (value: Date): string =>
	`${value.getFullYear()}-${pad(value.getMonth() + 1)}-${pad(value.getDate())}`

const RANGE_SEPARATOR = ' - '

const parseIsoDateRange = (value: string): [Date, Date] | undefined => {
	const [start, end] = value.split(RANGE_SEPARATOR)
	const parsedStart = start ? parseIsoDate(start) : undefined
	const parsedEnd = end ? parseIsoDate(end) : undefined
	return parsedStart && parsedEnd ? [parsedStart, parsedEnd] : undefined
}

const formatIsoDateRange = (value: [Date, Date]): string =>
	`${formatIsoDate(value[0])}${RANGE_SEPARATOR}${formatIsoDate(value[1])}`

// Local state of the `input` slot field: the text is owned by the custom input,
// mirrored to validation via updateTextValue and parsed to a Date via
// updateModelValue (parsing remains the responsibility of the custom input).
function useCustomSlotInput(
	args: { modelValue?: Date | [Date, Date] },
	parse: (value: string) => Date | undefined,
	format: (value: Date) => string,
) {
	const text = ref(args.modelValue instanceof Date ? format(args.modelValue) : '')
	const updateTextValueCallback = ref<(value: string | undefined) => void>()
	const hasRegisteredUpdateTextValue = ref(false)
	watch(() => args.modelValue, (value) => {
		text.value = value instanceof Date ? format(value) : ''
		updateTextValueCallback.value?.(text.value || undefined)
	})
	const registerUpdateTextValue = (updateTextValue: (value: string | undefined) => void) => {
		updateTextValueCallback.value = updateTextValue
		if (!hasRegisteredUpdateTextValue.value) {
			hasRegisteredUpdateTextValue.value = true
			updateTextValue(text.value || undefined)
		}
	}
	const onInput = (
		event: Event,
		updateTextValue: (value: string | undefined) => void,
		updateModelValue: (value: Date | undefined) => void,
	) => {
		text.value = (event.target as HTMLInputElement).value
		updateTextValue(text.value)
		const parsed = parse(text.value)
		if (parsed) {
			updateModelValue(parsed)
		}
		else if (text.value === '') {
			updateModelValue(undefined)
		}
	}
	return { text, onInput, registerUpdateTextValue }
}

const SHORT_DATE_FORMAT = 'DD-MM-YY'

export const CustomInputSyTextField: Story = {
	args: {
		'modelValue': new Date(2025, 10, 11),
		'label': 'Début du projet',
		'hint': 'Format JJ-MM-AA',
		'placeholder': 'JJ-MM-AA',
		'onUpdate:modelValue': fn(),
		'onUpdate:open': fn(),
		'customRules': [{
			type: 'custom',
			options: {
				validate: (value: string | undefined) => parseDate(value, SHORT_DATE_FORMAT) !== null,
				message: 'Le format doit être JJ-MM-AA (ex: 25-12-26).',
			},
		}],
	},
	render: (args) => {
		return {
			components: { DatePickerLite, SyTextField, VBtn, SyIcon },
			directives: { maska: vMaska },
			setup() {
				const mask = '##-##-##'
				const text = ref(args.modelValue instanceof Date ? formatDate(args.modelValue, SHORT_DATE_FORMAT) : '')
				const updateTextValueCallback = ref<(value: string | undefined) => void>()
				const hasRegisteredUpdateTextValue = ref(false)
				watch(() => args.modelValue, (value) => {
					text.value = value instanceof Date ? formatDate(value, SHORT_DATE_FORMAT) : ''
					updateTextValueCallback.value?.(text.value || undefined)
				})
				// Same contract as the default input: the masked text feeds validation via
				// updateTextValue and only overrides modelValue when it parses to a different date.

				const onTextUpdate = (
					value: string | null,
					modelValue: Date | undefined,
					updateTextValue: (value: string | undefined) => void,
					updateModelValue: (value: Date | undefined) => void,
				) => {
					updateTextValue(value ?? undefined)
					if (!value) {
						updateModelValue(undefined)
						return
					}
					const parsed = parseDate(value, SHORT_DATE_FORMAT)
					if (parsed && parsed.getTime() !== modelValue?.getTime()) {
						updateModelValue(parsed)
					}
				}
				const registerUpdateTextValue = (updateTextValue: (value: string | undefined) => void) => {
					updateTextValueCallback.value = updateTextValue
					if (!hasRegisteredUpdateTextValue.value) {
						hasRegisteredUpdateTextValue.value = true
						updateTextValue(text.value || undefined)
					}
				}
				return {
					args,
					text,
					onTextUpdate,
					registerUpdateTextValue,
					mask,
					calendarIcon: mdiCalendar,
				}
			},
			template: `
				<DatePickerLite v-bind="args" v-model="args.modelValue">
					<template #input="{ modelValue, updateModelValue, inputProps, updateTextValue, setFocused, toggleBtnRef }">
						<SyTextField
							:ref="() => registerUpdateTextValue(updateTextValue)"
							v-model="text"
							v-maska="mask"
							v-bind="inputProps"
							variant-style="underlined"
							:error-messages="inputProps.errorMessages"
							:warning-messages="inputProps.warningMessages"
							:success-messages="inputProps.successes"
							:has-error="inputProps.hasError"
							:has-warning="inputProps.hasWarning"
							:has-success="inputProps.hasSuccess"
							:disable-error-handling="true"
							@update:model-value="onTextUpdate($event, modelValue, updateTextValue, updateModelValue)"
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
				</DatePickerLite>
			`,
		}
	},
	parameters: {
		docs: {
			description: {
				story: 'Input custom construit sur `SyTextField` et Maska, comme le champ par défaut, mais au format court JJ-MM-AA (variante `underlined` au lieu d’`outlined`). Le masque `##-##-##` formate la saisie, le parsing strict (dayjs) délègue à `updateModelValue` uniquement les dates valides, et `SyTextField` conserve labels, messages de validation et attributs ARIA natifs.',
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<DatePickerLite
						v-model="selectedDate"
						label="Début du projet"
						help-text="Format JJ-MM-AA"
						placeholder="JJ-MM-AA"
						:custom-rules="rules"
					>
						<template #input="{ modelValue, updateModelValue, inputProps, updateTextValue, setFocused, toggleBtnRef }">
							<SyTextField
								v-model="text"
								v-maska="mask"
								v-bind="inputProps"
								variant-style="underlined"
								:error-messages="inputProps.errorMessages"
								:has-error="inputProps.hasError"
								:disable-error-handling="true"
								@update:model-value="onTextUpdate($event, modelValue, updateTextValue, updateModelValue)"
								@focus="setFocused(true)"
								@blur="setFocused(false)"
							>
								<template #append>
									<button
										:ref="toggleBtnRef"
										type="button"
										title="Choisir une date"
										aria-label="Choisir une date"
										class="custom-input__toggle"
									>
										<SyIcon
											:icon="mdiCalendar"
											decorative
											color="primary"
										/>
									</button>
								</template>
							</SyTextField>
						</template>
					</DatePickerLite>
				</template>
				`,
			}, {
				name: 'Script',
				code: `
				<script setup lang="ts">
					import { DatePickerLite, SyIcon, SyTextField } from '@cnamts/synapse'
					import { mdiCalendar } from '@mdi/js'
					import { vMaska } from 'maska/vue'
					import { ref, watch } from 'vue'
					import { formatDate, parseDate } from '@cnamts/synapse'

					const SHORT_DATE_FORMAT = 'DD-MM-YY'

					const selectedDate = ref<Date | undefined>(new Date(2025, 10, 11))

					const rules = [{
						type: 'custom',
						options: {
							validate: (value) => parseDate(value, SHORT_DATE_FORMAT) !== null,
							message: 'Le format doit être JJ-MM-AA (ex: 25-12-26).',
						},
					}]

					const mask = '##-##-##'
					const text = ref(formatDate(selectedDate.value, SHORT_DATE_FORMAT))
					watch(selectedDate, (value) => {
						text.value = value ? formatDate(value, SHORT_DATE_FORMAT) : ''
					})

					// Same contract as the default input: the masked text feeds validation and only
					// overrides modelValue when it parses to a different date.
					const onTextUpdate = (value, modelValue, updateTextValue, updateModelValue) => {
						updateTextValue(value ?? undefined)
						if (!value) {
							updateModelValue(undefined)
							return
						}
						const parsed = parseDate(value, SHORT_DATE_FORMAT)
						if (parsed && parsed.getTime() !== modelValue?.getTime()) {
							updateModelValue(parsed)
						}
					}
				</script>
				`,
			},
		],
	},
}

export const CustomInputStyle: Story = {
	args: {
		'modelValue': new Date(2025, 10, 11),
		'label': 'Début du projet',
		'required': true,
		'onUpdate:modelValue': fn(),
		'onUpdate:open': fn(),
		'customRules': [{
			type: 'custom',
			options: {
				validate: (value: string | undefined) => /^(0[1-9]|[12]\d|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/.test(value ?? ''),
				message: 'Le format doit être JJ/MM/AAAA (ex: 25/12/2026).',
			},
		}],
	},
	render: (args) => {
		return {
			components: { DatePickerLite },
			setup() {
				const { text, onInput, registerUpdateTextValue } = useCustomSlotInput(args, parseFrDate, formatFrDate)
				// Accessibility associations: label → input, messages wired via aria-describedby
				const inputId = useId()
				const helpId = useId()
				const errorsId = useId()
				return {
					args,
					text,
					onInput,
					registerUpdateTextValue,
					inputId,
					helpId,
					errorsId,
					describedBy: `${helpId} ${errorsId}`,
				}
			},
			template: `
				<DatePickerLite v-bind="args" v-model="args.modelValue">
					<template #input="{ inputProps, updateModelValue, updateTextValue, setFocused, toggleBtnRef }">
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
								:ref="() => registerUpdateTextValue(updateTextValue)"
								type="text"
								:style="{
									flex: '1',
									border: 'none',
									padding: '8px 0',
									minWidth: '120px',
								}"
								placeholder="JJ/MM/AAAA"
								:value="text"
								:disabled="inputProps.disabled"
								:readonly="inputProps.readonly"
								:aria-required="inputProps.required"
								:aria-invalid="inputProps.hasError"
								:aria-describedby="describedBy"
								@input="onInput($event, updateTextValue, updateModelValue)"
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
				</DatePickerLite>
			`,
		}
	},
	parameters: {
		docs: {
			description: {
				story: 'Champ de saisie remplacé via le slot `input`, ici avec un style « pill ». La validation (règle custom de format + champ requis) fonctionne comme sur le champ par défaut : le texte est envoyé via `updateTextValue`, l’état focus via `setFocused`, et les messages d’erreur reviennent dans `inputProps.errorMessages`. L’accessibilité est maintenue : label associé via `for`/`id`, texte d’aide et erreurs rattachés au champ par `aria-describedby`, `aria-invalid`/`aria-required` reflétés, erreurs annoncées via `role="alert"`, et bouton d’ouverture enregistré via `toggleBtnRef` (le sélecteur visuel gère `aria-haspopup` et le retour de focus).',
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<DatePickerLite
						v-model="selectedDate"
						label="Début du projet"
						required
						:custom-rules="rules"
					>
						<template #input="{ inputProps, updateModelValue, updateTextValue, setFocused, toggleBtnRef }">
							<div class="custom-input">
								<label
									class="custom-input__label"
									:for="inputId"
								>
									{{ inputProps.label }}<span aria-hidden="true"> *</span>
								</label>
								<input
									:id="inputId"
									type="text"
									class="custom-input__field"
									placeholder="JJ/MM/AAAA"
									:value="text"
									:aria-required="inputProps.required"
									:aria-invalid="inputProps.hasError"
									:aria-describedby="helpId + ' ' + errorsId"
									@input="onInput($event, updateTextValue, updateModelValue)"
									@focus="setFocused(true)"
									@blur="setFocused(false)"
								>
								<button
									type="button"
									class="custom-input__toggle"
									:ref="toggleBtnRef"
								>
									Choisir
								</button>
							</div>
							<p :id="helpId">{{ inputProps.helpText }}</p>
							<div
								:id="errorsId"
								role="alert"
							>
								<p
									v-for="message in inputProps.errorMessages"
									:key="message"
									class="custom-input__error"
								>
									{{ message }}
								</p>
							</div>
						</template>
					</DatePickerLite>
				</template>
				`,
			}, {
				name: 'Script',
				code: `
				<script setup lang="ts">
					import { DatePickerLite } from '@cnamts/synapse'
					import { ref, useId, watch } from 'vue'

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

					// Text is owned by the custom input and parsed to a Date via
					// updateModelValue ; updateTextValue alimente la validation.
					const text = ref('11/11/2025')
					watch(selectedDate, (value) => {
						text.value = value ? formatDate(value) : ''
					})

					const onInput = (event, updateTextValue, updateModelValue) => {
						text.value = event.target.value
						updateTextValue(text.value)
						const parsed = parseDate(text.value)
						if (parsed) {
							updateModelValue(parsed)
						}
					}
				</script>
				`,
			},
		],
	},
}

export const CustomInputFormat: Story = {
	args: {
		'modelValue': new Date(2025, 10, 11),
		'label': 'Début du projet',
		'helpText': 'Format AAAA-MM-JJ',
		'onUpdate:modelValue': fn(),
		'onUpdate:open': fn(),
		'customRules': [{
			type: 'custom',
			options: {
				validate: (value: string | undefined) => /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/.test(value ?? ''),
				message: 'Le format doit être AAAA-MM-JJ (ex: 2026-12-25).',
			},
		}],
	},
	render: (args) => {
		return {
			components: { DatePickerLite, SyIcon },
			setup() {
				const { text, onInput, registerUpdateTextValue } = useCustomSlotInput(args, parseIsoDate, formatIsoDate)
				return {
					args,
					text,
					onInput,
					registerUpdateTextValue,
					calendarIcon: mdiCalendar,
				}
			},
			template: `
				<DatePickerLite v-bind="args" v-model="args.modelValue">
					<template #input="{ inputProps, updateModelValue, updateTextValue, setFocused, toggleBtnRef }">
						<label :style="{ display: 'block', fontWeight: 'bold', marginBottom: '4px' }">
							{{ inputProps.label }}
						</label>
						<div :style="{ display: 'flex', gap: '8px', alignItems: 'center' }">
							<input
								type="text"
								:ref="() => registerUpdateTextValue(updateTextValue)"
								:style="{
									border: '1px solid rgba(0, 0, 0, 0.38)',
									borderRadius: '4px',
									padding: '8px',
									minWidth: '140px',
								}"
								placeholder="AAAA-MM-JJ"
								:value="text"
								@input="onInput($event, updateTextValue, updateModelValue)"
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
				</DatePickerLite>
			`,
		}
	},
	parameters: {
		docs: {
			description: {
				story: 'Champ de saisie au format ISO (AAAA-MM-JJ) via le slot `input` : l’input custom affiche `modelValue` dans son propre format, parse la saisie avant de la transmettre via `updateModelValue`, et envoie le texte brut à la validation via `updateTextValue` (règle custom adaptée au format).',
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<DatePickerLite
						v-model="selectedDate"
						label="Début du projet"
						help-text="Format AAAA-MM-JJ"
						:custom-rules="rules"
					>
						<template #input="{ inputProps, updateModelValue, updateTextValue, setFocused, toggleBtnRef }">
							<label>{{ inputProps.label }}</label>
							<input
								type="text"
								placeholder="AAAA-MM-JJ"
								:value="text"
								@input="onInput($event, updateTextValue, updateModelValue)"
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
										:icon="mdiCalendar"
										decorative
										color="primary"
									/>
								</button>
						</template>
					</DatePickerLite>
				</template>
				`,
			}, {
				name: 'Script',
				code: `
				<script setup lang="ts">
					import { DatePickerLite } from '@cnamts/synapse'
					import { ref, watch } from 'vue'

					const selectedDate = ref<Date | undefined>(new Date(2025, 10, 11))

					const rules = [{
						type: 'custom',
						options: {
							validate: (value) => /^\\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01])$/.test(value ?? ''),
							message: 'Le format doit être AAAA-MM-JJ (ex: 2026-12-25).',
						},
					}]

					// Format owned by the custom input: ISO display of modelValue,
					// parsing ISO -> Date via updateModelValue.
					const text = ref('2025-11-11')
					watch(selectedDate, (value) => {
						text.value = value ? formatIso(value) : ''
					})

					const onInput = (event, updateTextValue, updateModelValue) => {
						text.value = event.target.value
						updateTextValue(text.value)
						const parsed = parseIso(text.value)
						if (parsed) {
							updateModelValue(parsed)
						}
					}
				</script>
				`,
			},
		],
	},
}

export const CustomInputRange: Story = {
	args: {
		'modelValue': [new Date(2025, 10, 11), new Date(2025, 10, 21)],
		'mode': 'range',
		'label': 'Période du projet',
		'helpText': 'Format AAAA-MM-JJ - AAAA-MM-JJ',
		'onUpdate:modelValue': fn(),
		'onUpdate:open': fn(),
		'customRules': [{
			type: 'custom',
			options: {
				validate: (value: string | undefined) => parseIsoDateRange(value ?? '') !== undefined,
				message: 'Le format doit être AAAA-MM-JJ - AAAA-MM-JJ.',
			},
		}],
	},
	render: (args) => {
		return {
			components: { DatePickerLite, SyIcon },
			setup() {
				const text = ref(Array.isArray(args.modelValue) ? formatIsoDateRange(args.modelValue) : '')
				const updateTextValueCallback = ref<(value: string | undefined) => void>()
				const hasRegisteredUpdateTextValue = ref(false)
				watch(() => args.modelValue, (value) => {
					text.value = Array.isArray(value) ? formatIsoDateRange(value) : ''
					updateTextValueCallback.value?.(text.value || undefined)
				})
				const registerUpdateTextValue = (updateTextValue: (value: string | undefined) => void) => {
					updateTextValueCallback.value = updateTextValue
					if (!hasRegisteredUpdateTextValue.value) {
						hasRegisteredUpdateTextValue.value = true
						updateTextValue(text.value || undefined)
					}
				}
				const onInput = (
					event: Event,
					updateTextValue: (value: string | undefined) => void,
					updateModelValue: (value: [Date, Date] | undefined) => void,
				) => {
					text.value = (event.target as HTMLInputElement).value
					updateTextValue(text.value || undefined)
					const parsed = parseIsoDateRange(text.value)
					if (parsed) {
						updateModelValue(parsed)
					}
					else if (text.value === '') {
						updateModelValue(undefined)
					}
				}
				return { args, text, onInput, registerUpdateTextValue, calendarIcon: mdiCalendar }
			},
			template: `
				<DatePickerLite v-bind="args" v-model="args.modelValue">
					<template #input="{ inputProps, updateModelValue, updateTextValue, setFocused, toggleBtnRef }">
						<label :style="{ display: 'block', fontWeight: 'bold', marginBottom: '4px' }">
							{{ inputProps.label }}
						</label>
						<div :style="{ display: 'flex', gap: '8px', alignItems: 'center' }">
							<input
								type="text"
								:ref="() => registerUpdateTextValue(updateTextValue)"
								:style="{ border: '1px solid rgba(0, 0, 0, 0.38)', borderRadius: '4px', padding: '8px', minWidth: '260px' }"
								placeholder="AAAA-MM-JJ - AAAA-MM-JJ"
								:value="text"
								@input="onInput($event, updateTextValue, updateModelValue)"
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
				</DatePickerLite>
			`,
		}
	},
	parameters: {
		docs: {
			description: {
				story: 'Champ de période personnalisé via le slot `input`, au format ISO `AAAA-MM-JJ - AAAA-MM-JJ`. Le champ détient le formatage et le parsing du tuple, et synchronise le texte de validation après chaque sélection visuelle.',
			},
		},
	},
}
