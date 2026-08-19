import { ref } from 'vue'
import type { StoryObj } from '@storybook/vue3-vite'
import DatePicker from './DatePicker.vue'

export default {
	title: 'datePickers',
}

export const Century: StoryObj = {
	render: () => {
		return {
			setup() {
				const theme = typeof window !== 'undefined' ? localStorage.getItem('storybook-theme') : 'cnam'
				return {
					theme,
				}
			},
			template: `
                <div>
                    <span v-if="theme === 'pa'"
                        style="display: inline-block; padding: 10px; margin: 10px 0; background-color: rgba(183,203,214, 0.3); border-radius: 4px; border-left: 4px solid #3f7b99; color: #333;"
                    >
                        Les composants DatePicker ne proposent pas la prop century.
                        </span>
                </div>
            `,
		}
	},
	tags: ['!dev'],
}

export const ValidationModes: StoryObj = {
	render: () => {
		return {
			components: { DatePicker },
			setup() {
				const synapseValue = ref('')
				const vuetifyValue = ref('')

				return {
					synapseValue,
					vuetifyValue,
					synapseRules: [
						{
							type: 'notBeforeToday',
							options: {
								message: 'La date ne peut pas être antérieure à aujourd\'hui',
							},
						},
					],
					vuetifyRules: [
						(value: unknown) => (typeof value === 'string' && value.length > 0) || 'La date est requise',
					],
				}
			},
			template: [
				'<div style="display: grid; gap: 16px; margin: 16px 0;">',
				'<div style="padding: 16px; border-radius: 8px; border: 1px solid #d7e3f4; background: #f7fbff;">',
				'<h3 style="margin: 0 0 8px; color: #0d47a1;">Validation Synapse unifiée</h3>',
				'<p style="margin: 0 0 8px;">Mode recommande quand il faut gerer les regles metier date, les plages et les flux calendrier.</p>',
				'<ul style="margin: 0; padding-left: 20px;">',
				'<li><code>customRules</code>, <code>customWarningRules</code>, <code>customSuccessRules</code></li>',
				'<li>messages error / warning / success</li>',
				'<li>required conditionnel, range, flow CalendarMode</li>',
				'</ul>',
				'<div style="margin-top: 16px; max-width: 320px;">',
				'<DatePicker v-model="synapseValue" label="Date Synapse" placeholder="JJ/MM/AAAA" no-calendar format="DD/MM/YYYY" :custom-rules="synapseRules" />',
				'</div>',
				'</div>',
				'<div style="padding: 16px; border-radius: 8px; border: 1px solid #e0e0e0; background: #fafafa;">',
				'<h3 style="margin: 0 0 8px; color: #424242;">Validation Vuetify native</h3>',
				'<p style="margin: 0 0 8px;">Disponible aussi sur DatePicker quand le besoin se limite a des regles de champ au format Vuetify.</p>',
				'<ul style="margin: 0; padding-left: 20px;">',
				'<li><code>useVuetifyValidation</code> + <code>rules</code></li>',
				'<li>fonctions retournant <code>true</code> ou un message</li>',
				'<li>utile pour un comportement aligne avec les autres champs migres</li>',
				'</ul>',
				'<div style="margin-top: 16px; max-width: 320px;">',
				'<DatePicker v-model="vuetifyValue" label="Date Vuetify" placeholder="JJ/MM/AAAA" no-calendar format="DD/MM/YYYY" use-vuetify-validation :rules="vuetifyRules" />',
				'</div>',
				'</div>',
				'</div>',
			].join(''),
		}
	},
	tags: ['!dev'],
}
