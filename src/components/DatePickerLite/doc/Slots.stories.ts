import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { mdiCalendar } from '@mdi/js'
import { ref, watch } from 'vue'
import SyIcon from '@/components/Customs/SyIcon/SyIcon.vue'
import DatePickerLite from '../DatePickerLite.vue'
import DatePickerLiteInput from '../DatePickerLiteText/DatePickerLiteInput.vue'

const meta: Meta<typeof DatePickerLite> = {
	title: 'Composants/Formulaires/DatePickerLite/Slots',
	component: DatePickerLite,
	parameters: {
		docs: {
			description: {
				component: 'Exemples de personnalisation des slots de DatePickerLite. Les slots permettent d’enrichir le champ de saisie, de modifier le menu de sélection et de surcharger le rendu visuel du calendrier sans remplacer tout le comportement du composant.',
			},
		},
	},
}

export default meta

type Story = StoryObj<typeof meta>

const useBoundValue = (initialValue?: Date) => {
	const value = ref<Date | undefined>(initialValue)
	return { value }
}

export const Field: Story = {
	args: {
		label: 'Date de rendez-vous',
		helpText: 'Choisissez une date de consultation',
		modelValue: new Date(2025, 9, 12),
		clearable: true,
	},
	render: args => ({
		components: { DatePickerLite },
		setup() {
			const { value } = useBoundValue(args.modelValue as Date | undefined)
			watch(
				() => args.modelValue,
				(nextValue) => {
					value.value = nextValue as Date | undefined
				},
				{ immediate: true },
			)
			return { args, value }
		},
		template: `
			<DatePickerLite
				v-bind="args"
				v-model="value"
			>
				<template #prepend>
					<span style="display:inline-flex; align-items:center; gap:6px; padding:0 10px; border-radius:999px; background:rgba(var(--v-theme-primary),0.08); color:rgb(var(--v-theme-primary)); font-size:0.75rem; font-weight:700; letter-spacing:0.04em; text-transform:uppercase;">
						RDV
					</span>
				</template>
				<template #append>
					<button
						type="button"
						style="border:1px solid rgba(var(--v-theme-primary),0.32); border-radius:999px; padding:4px 10px; background:transparent; color:rgb(var(--v-theme-primary)); cursor:pointer; font-weight:600;"
						@click="value = new Date(2025, 9, 15)"
					>
						Aujourd'hui
					</button>
				</template>
				<template #details>
					<div style="display:flex; justify-content:space-between; align-items:center; gap:12px; padding-top:4px; color:rgba(var(--v-theme-on-surface),0.72); font-size:0.75rem;">
						<span>Créneaux disponibles : lun–ven</span>
						<span style="display:inline-flex; align-items:center; padding:2px 8px; border-radius:999px; background:rgba(var(--v-theme-success),0.12); color:rgb(var(--v-theme-success)); font-weight:600;">
							2 créneaux
						</span>
					</div>
				</template>
			</DatePickerLite>
		`,
	}),
	parameters: {
		docs: {
			description: {
				story: 'Les slots `prepend`, `append` et `details` ajoutent un contexte métier utile au champ sans casser la logique de sélection et la validation du composant.',
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<DatePickerLite v-model="selectedDate" label="Date de rendez-vous" help-text="Choisissez une date de consultation" clearable>
						<template #prepend>
							<span class="slot-tag">RDV</span>
						</template>
						<template #append>
							<button type="button" @click="selectedDate = new Date(2025, 9, 15)">Aujourd'hui</button>
						</template>
						<template #details>
							<div class="slot-details">
								<span>Créneaux disponibles : lun–ven</span>
								<span class="slot-badge">2 créneaux</span>
							</div>
						</template>
					</DatePickerLite>
				</template>`,
			},
		],
	},
}

export const FieldActions: Story = {
	args: {
		label: 'Début de mission',
		modelValue: new Date(2025, 9, 12),
		helpText: 'Choisissez la date de début',
	},
	render: args => ({
		components: { DatePickerLite },
		setup() {
			const { value } = useBoundValue(args.modelValue as Date | undefined)
			watch(
				() => args.modelValue,
				(nextValue) => {
					value.value = nextValue as Date | undefined
				},
				{ immediate: true },
			)
			return { args, value }
		},
		template: `
			<DatePickerLite
				v-bind="args"
				v-model="value"
			>
				<template #prepend-inner>
					<span style="display:inline-flex; align-items:center; justify-content:center; width:28px; height:28px; border-radius:50%; background:rgba(var(--v-theme-primary),0.1); color:rgb(var(--v-theme-primary)); font-size:0.8rem; font-weight:700;">D</span>
				</template>
				<template #append-inner>
					<button
						type="button"
						style="border:0; background:transparent; color:rgb(var(--v-theme-primary)); font-weight:600; cursor:pointer;"
						@click="value = new Date(2025, 9, 20)"
					>
						20 oct
					</button>
				</template>
			</DatePickerLite>
		`,
	}),
	parameters: {
		docs: {
			description: {
				story: 'Les slots `prepend-inner` et `append-inner` sont utiles pour insérer des indicateurs, filtres, raccourcis ou libellés métier dans le champ sans créer de composants supplémentaires.',
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<DatePickerLite v-model="selectedDate" label="Début de mission" help-text="Choisissez la date de début">
						<template #prepend-inner>
							<span class="date-badge">D</span>
						</template>
						<template #append-inner>
							<button type="button" @click="selectedDate = new Date(2025, 9, 20)">20 oct</button>
						</template>
					</DatePickerLite>
				</template>`,
			},
		],
	},
}

export const TriggerOnLeft: Story = {
	args: {
		label: 'Date de rendez-vous',
		helpText: 'Choisissez une date de consultation',
		modelValue: new Date(2025, 9, 12),
		clearable: true,
	},
	render: args => ({
		components: { DatePickerLite, DatePickerLiteInput, SyIcon },
		setup() {
			const { value } = useBoundValue(args.modelValue as Date | undefined)
			watch(
				() => args.modelValue,
				(nextValue) => {
					value.value = nextValue as Date | undefined
				},
				{ immediate: true },
			)

			return {
				args,
				value,
				calendarIcon: mdiCalendar,
			}
		},
		template: `
			<DatePickerLite
				v-bind="args"
				v-model="value"
			>
				<template #input="{ modelValue, inputProps, updateModelValue, setFocused, toggleBtnRef }">
					<DatePickerLiteInput
						:mode="args.mode ?? 'single'"
						:model-value="modelValue"
						:hide-default-toggle="true"
						v-bind="inputProps"
						@update:model-value="updateModelValue"
						@focus="setFocused(true)"
						@blur="setFocused(false)"
					>
						<template #prepend>
							<button
								type="button"
								:ref="toggleBtnRef"
								title="Choisir une date"
								aria-label="Choisir une date"
								style="display:inline-flex; align-items:center; justify-content:center; width:42px; height:42px; border:1px solid rgba(var(--v-theme-primary),0.32); border-radius:12px; background:rgba(var(--v-theme-primary),0.08); color:rgb(var(--v-theme-primary)); cursor:pointer; flex-shrink:0;"
							>
								<SyIcon
									:icon="calendarIcon"
									decorative
								/>
							</button>
						</template>
					</DatePickerLiteInput>
				</template>
			</DatePickerLite>
		`,
	}),
	parameters: {
		docs: {
			description: {
				story: 'Le slot `input` reste un wrapper autour du champ par défaut. On réutilise `DatePickerLiteInput` et on branche un bouton personnalisé à gauche via `toggleBtnRef`, sans remplacer toute la logique de validation, de parse et d’ouverture du sélecteur.',
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<DatePickerLite v-model="selectedDate" label="Date de rendez-vous">
						<template #input="{ modelValue, inputProps, updateModelValue, setFocused, toggleBtnRef }">
							<DatePickerLiteInput
								:mode="mode"
								:model-value="modelValue"
								v-bind="inputProps"
								@update:model-value="updateModelValue"
								@focus="setFocused(true)"
								@blur="setFocused(false)"
							>
								<template #prepend>
									<button :ref="toggleBtnRef" class="calendar-trigger" type="button" aria-label="Choisir une date">
										<IconCalendar />
									</button>
								</template>
							</DatePickerLiteInput>
						</template>
					</DatePickerLite>
				</template>`,
			},
		],
	},
}

export const Calendar: Story = {
	args: {
		label: 'Date de rendez-vous',
		modelValue: new Date(2025, 9, 12),
		clearable: true,
	},
	render: args => ({
		components: { DatePickerLite },
		setup() {
			const { value } = useBoundValue(args.modelValue as Date | undefined)
			watch(
				() => args.modelValue,
				(nextValue) => {
					value.value = nextValue as Date | undefined
				},
				{ immediate: true },
			)
			return { args, value }
		},
		template: `
			<DatePickerLite
				v-bind="args"
				v-model="value"
			>
				<template #header="{ previousMonth, nextMonth, currentMonth }">
					<div style="display:flex; align-items:center; justify-content:space-between; gap:12px; padding:8px 12px; background:rgba(var(--v-theme-primary),0.05); border-bottom:1px solid rgba(var(--v-theme-on-surface),0.08);">
						<button type="button" style="border:0; background:transparent; cursor:pointer; color:rgb(var(--v-theme-primary));" @click="previousMonth">←</button>
						<strong style="font-size:0.875rem; text-transform:capitalize;">
							{{ new Intl.DateTimeFormat('fr-FR', { month: 'long', year: 'numeric' }).format(currentMonth) }}
						</strong>
						<button type="button" style="border:0; background:transparent; cursor:pointer; color:rgb(var(--v-theme-primary));" @click="nextMonth">→</button>
					</div>
				</template>
				<template #footer>
					<div style="padding:8px 12px; text-align:center; color:rgba(var(--v-theme-on-surface),0.72); font-size:0.75rem;">
						Sélectionnez une date pour valider
					</div>
				</template>
				<template #day="{ day, isSelected, isToday }">
					<div
						class="sy-calendar__day-content"
						style="display:flex; width:32px; height:32px; align-items:center; justify-content:center; border-radius:999px; margin:1px auto;"
						:style="{
							background: isSelected ? 'rgba(var(--v-theme-primary), 0.14)' : isToday ? 'rgba(var(--v-theme-secondary), 0.12)' : 'transparent',
							fontWeight: isSelected ? '700' : '500',
							color: isSelected ? 'rgb(var(--v-theme-primary))' : 'inherit',
							border: '1px solid transparent'
						}"
					>
						{{ day }}
					</div>
				</template>
				<template #day-2025-10-15="{ day }">
					<div
						class="sy-calendar__day-content"
						style="display:flex; width:32px; height:32px; align-items:center; justify-content:center; border-radius:999px; margin:1px auto; background:rgba(var(--v-theme-success),0.16); color:rgb(var(--v-theme-success)); font-weight:700; border:1px solid transparent;"
					>
						{{ day }}
					</div>
				</template>
			</DatePickerLite>
		`,
	}),
	parameters: {
		docs: {
			description: {
				story: 'Les slots `header`, `footer`, `day` et `day-YYYY-MM-DD` permettent d’adapter le calendrier à un contexte métier : navigation, footer d’action et mise en valeur de dates particulières.',
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<DatePickerLite v-model="selectedDate" label="Date de rendez-vous" clearable>
						<template #header="{ previousMonth, nextMonth, currentMonth }">
							<div class="slot-header">
								<button @click="previousMonth">←</button>
								{{ new Intl.DateTimeFormat('fr-FR', { month: 'long', year: 'numeric' }).format(currentMonth) }}
								<button @click="nextMonth">→</button>
							</div>
						</template>
						<template #footer>
							<div class="slot-footer">Sélectionnez une date pour valider</div>
						</template>
						<template #day="{ day, isSelected }">
							<span :class="{ 'is-selected': isSelected }">{{ day }}</span>
						</template>
					</DatePickerLite>
				</template>`,
			},
		],
	},
}

export const Menu: Story = {
	args: {
		label: 'Date de début',
		modelValue: new Date(2025, 9, 12),
		clearable: true,
	},
	render: args => ({
		components: { DatePickerLite },
		setup() {
			const { value } = useBoundValue(args.modelValue as Date | undefined)
			watch(
				() => args.modelValue,
				(nextValue) => {
					value.value = nextValue as Date | undefined
				},
				{ immediate: true },
			)
			return { args, value }
		},
		template: `
			<DatePickerLite
				v-bind="args"
				v-model="value"
			>
				<template #menu="{ view, modelValue, setOpen }">
					<div
						style="width:320px; display:flex; flex-direction:column; gap:12px; padding:16px; background:rgb(var(--v-theme-surface)); border-radius:16px; box-shadow:0 8px 24px rgba(0,0,0,0.14); box-sizing:border-box;"
					>
						<div style="display:flex; align-items:center; justify-content:space-between; gap:12px;">
							<strong>Calendrier personnalisé</strong>
						</div>
						<p
							role="status"
							aria-live="polite"
							style="margin:0; color:rgba(var(--v-theme-on-surface),0.72); font-size:0.85rem;"
						>
							{{ modelValue instanceof Date ? 'Date sélectionnée : ' + new Intl.DateTimeFormat('fr-FR').format(modelValue) : 'Aucune date sélectionnée' }}
						</p>
						<div style="display:flex; gap:8px; flex-wrap:wrap; margin-top:auto;">
							<button
								type="button"
								:aria-label="'Choisir le 03 octobre 2025'"
								:aria-pressed="modelValue instanceof Date && modelValue.toDateString() === new Date(2025, 9, 3).toDateString()"
								:style="{
									border: modelValue instanceof Date && modelValue.toDateString() === new Date(2025, 9, 3).toDateString() ? '1px solid rgba(var(--v-theme-primary), 0.9)' : '1px solid transparent',
									borderRadius: '999px',
									background: modelValue instanceof Date && modelValue.toDateString() === new Date(2025, 9, 3).toDateString() ? 'rgb(var(--v-theme-primary))' : 'rgba(var(--v-theme-primary),0.12)',
									color: modelValue instanceof Date && modelValue.toDateString() === new Date(2025, 9, 3).toDateString() ? 'rgb(var(--v-theme-on-primary))' : 'rgb(var(--v-theme-primary))',
									padding: '6px 10px',
									fontWeight: 700,
									cursor: 'pointer',
									boxShadow: modelValue instanceof Date && modelValue.toDateString() === new Date(2025, 9, 3).toDateString() ? '0 0 0 2px rgba(var(--v-theme-primary),0.18)' : 'none',
									transition: 'all 0.2s ease'
								}"
								@click="value = new Date(2025, 9, 3); setOpen(false)"
							>
								03 oct 2025
							</button>
							<button
								type="button"
								:aria-label="'Choisir le 20 octobre 2025'"
								:aria-pressed="modelValue instanceof Date && modelValue.toDateString() === new Date(2025, 9, 20).toDateString()"
								:style="{
									border: modelValue instanceof Date && modelValue.toDateString() === new Date(2025, 9, 20).toDateString() ? '1px solid rgba(var(--v-theme-primary), 0.9)' : '1px solid transparent',
									borderRadius: '999px',
									background: modelValue instanceof Date && modelValue.toDateString() === new Date(2025, 9, 20).toDateString() ? 'rgb(var(--v-theme-primary))' : 'rgba(var(--v-theme-primary),0.12)',
									color: modelValue instanceof Date && modelValue.toDateString() === new Date(2025, 9, 20).toDateString() ? 'rgb(var(--v-theme-on-primary))' : 'rgb(var(--v-theme-primary))',
									padding: '6px 10px',
									fontWeight: 700,
									cursor: 'pointer',
									boxShadow: modelValue instanceof Date && modelValue.toDateString() === new Date(2025, 9, 20).toDateString() ? '0 0 0 2px rgba(var(--v-theme-primary),0.18)' : 'none',
									transition: 'all 0.2s ease'
								}"
								@click="value = new Date(2025, 9, 20); setOpen(false)"
							>
								20 oct 2025
							</button>
						</div>
					</div>
				</template>
			</DatePickerLite>
		`,
	}),
	parameters: {
		docs: {
			description: {
				story: 'Le slot `menu` permet de remplacer complètement l’interface du sélecteur visuel avec un contenu de navigation ou d’actions spécifique au métier.',
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<DatePickerLite v-model="selectedDate" label="Date de début" clearable>
						<template #menu="{ view, modelValue, setOpen }">
							<div class="custom-menu">
								<strong>Calendrier personnalisé</strong>
								<p role="status" aria-live="polite">
									{{ modelValue instanceof Date ? 'Date sélectionnée : ' + formatDate(modelValue) : 'Aucune date sélectionnée' }}
								</p>
								<div class="quick-picks">
									<button
										type="button"
										:aria-pressed="modelValue instanceof Date && modelValue.toDateString() === new Date(2025, 9, 3).toDateString()"
										:style="{
											background: modelValue instanceof Date && modelValue.toDateString() === new Date(2025, 9, 3).toDateString() ? 'rgb(var(--v-theme-primary))' : 'rgba(var(--v-theme-primary),0.12)',
											color: modelValue instanceof Date && modelValue.toDateString() === new Date(2025, 9, 3).toDateString() ? 'rgb(var(--v-theme-on-primary))' : 'rgb(var(--v-theme-primary))'
										}"
										@click="selectedDate = new Date(2025, 9, 3); setOpen(false)"
									>
										03 oct 2025
									</button>
									<button
										type="button"
										:aria-pressed="modelValue instanceof Date && modelValue.toDateString() === new Date(2025, 9, 20).toDateString()"
										:style="{
											background: modelValue instanceof Date && modelValue.toDateString() === new Date(2025, 9, 20).toDateString() ? 'rgb(var(--v-theme-primary))' : 'rgba(var(--v-theme-primary),0.12)',
											color: modelValue instanceof Date && modelValue.toDateString() === new Date(2025, 9, 20).toDateString() ? 'rgb(var(--v-theme-on-primary))' : 'rgb(var(--v-theme-primary))'
										}"
										@click="selectedDate = new Date(2025, 9, 20); setOpen(false)"
									>
										20 oct 2025
									</button>
								</div>
							</div>
						</template>
					</DatePickerLite>
				</template>`,
			},
		],
	},
}
