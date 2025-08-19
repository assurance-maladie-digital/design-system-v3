import type { Meta, StoryObj } from '@storybook/vue3'
import { ref } from 'vue'
import DatePicker from '../../DatePicker/CalendarMode/DatePicker.vue'

export default {
	title: 'Composants/Formulaires/DatePicker/Validation/Submit/DateTextInput',
	component: DatePicker,
	parameters: {
		docs: {
			description: {
				component: 'Exemples de validation pour le composant DatePicker avec calendrier.',
			},
		},
	},
} as Meta

export const Required: StoryObj = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
                <template>
                    <v-form @submit.prevent="handleSubmit">
                        <div style="display: flex; flex-direction: column; gap: 16px;">
                            <div>
                                <h3 class="mb-4">Avec calendrier</h3>
                                <DatePicker
                                    ref="datePicker1"
                                    v-model="date1"
                                    required
                                    format="DD/MM/YYYY"
                                    placeholder="Date requise"
                                    noCalendar
                                    :is-validate-on-blur="false"
                                />
                            </div>
                        </div>
                        <button type="submit" style="margin-top: 16px; padding: 8px 16px; background-color:#0c419a; color: white; border: none; border-radius: 4px; cursor: pointer;">
                            Soumettre
                        </button>
                    </v-form>
                </template>
                `,
			},
			{
				name: 'Script',
				code: `
                <script setup lang="ts">
                    import { ref } from 'vue'
                    import { DatePicker } from '@cnamts/synapse'

                    const datePicker1 = ref()
                    const date1 = ref('')

                    const handleSubmit = () => {
                        const isValid1 = datePicker1.value?.validateOnSubmit()
                        
                        if (!isValid1) {
                            alert('Corrigez les erreurs avant de soumettre !')
                        } else {
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
			const datePicker1 = ref()
			const date1 = ref('')

			const handleSubmit = () => {
				const isValid1 = datePicker1.value?.validateOnSubmit()
				if (!isValid1) {
					alert('Corrigez les erreurs avant de soumettre !')
				}
				else {
					alert('Formulaire soumis avec succès !')
				}
			}

			return {
				datePicker1,
				date1,
				handleSubmit,
			}
		},
		template: `
            <div class="d-flex flex-wrap align-center pa-4">
                <form @submit.prevent="handleSubmit" style="width: 100%;">
                    <div style="display: flex; flex-direction: column; gap: 16px;">
                        <div>
                            <DatePicker
                                ref="datePicker1"
                                v-model="date1"
                                required
                                noCalendar
                                format="DD/MM/YYYY"
                                placeholder="Date requise"
                            />
                        </div>
                    </div>
                    <button type="submit" style="margin-top: 16px; padding: 8px 16px; background-color:#0c419a; color: white; border: none; border-radius: 4px; cursor: pointer;">
                        Soumettre
                    </button>
                </form>
            </div>
        `,
	}),
}

export const WithCustomRulesAndRequired: StoryObj = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
                <template>
                    <v-form @submit.prevent="handleSubmit">
                        <div style="display: flex; flex-direction: column; gap: 16px;">
                            <div>
                                <h3 class="mb-4">Avec calendrier</h3>
                                <DatePicker
                                    ref="datePicker1"
                                    v-model="date1"
                                    required
                                    format="DD/MM/YYYY"
                                    placeholder="Date requise"
                                    noCalendar
                                    :customRules="[
            { type: 'notAfterToday', options: { message: 'La date ne peut pas être après aujourd'hui' } },
        ]"
                                />
                            </div>
                        </div>
                        <button type="submit" style="margin-top: 16px; padding: 8px 16px; background-color:#0c419a; color: white; border: none; border-radius: 4px; cursor: pointer;">
                            Soumettre
                        </button>
                    </v-form>
                </template>
                `,
			},
			{
				name: 'Script',
				code: `
                <script setup lang="ts">
                    import { ref } from 'vue'
                    import { DatePicker } from '@cnamts/synapse'

                    const datePicker1 = ref()
                    const date1 = ref('01/01/2100')

                    const handleSubmit = () => {
                        const isValid1 = datePicker1.value?.validateOnSubmit()
                        
                        if (!isValid1) {
                            alert('Corrigez les erreurs avant de soumettre !')
                        } else {
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
			const datePicker1 = ref()
			const date1 = ref('01/01/2100')

			const handleSubmit = () => {
				const isValid1 = datePicker1.value?.validateOnSubmit()

				if (!isValid1) {
					alert('Corrigez les erreurs avant de soumettre !')
				}
				else {
					alert('Formulaire soumis avec succès !')
				}
			}

			return {
				datePicker1,
				date1,
				handleSubmit,
			}
		},
		template: `
            <div class="d-flex flex-wrap align-center pa-4">
                <form @submit.prevent="handleSubmit" style="width: 100%;">
                    <div style="display: flex; flex-direction: column; gap: 16px;">
                        <div>
                            <DatePicker
                                ref="datePicker1"
                                v-model="date1"
                                required
                                format="DD/MM/YYYY"
                                placeholder="Date requise"
                                noCalendar
                                :custom-rules="[
            { 		type: 'notAfterToday', options: { message: 'La date ne peut pas être après aujourdhui' } },
        ]"
                            />
                        </div>
                    </div>
                    <button type="submit" style="margin-top: 16px; padding: 8px 16px; background-color:#0c419a; color: white; border: none; border-radius: 4px; cursor: pointer;">
                        Soumettre
                    </button>
                </form>
            </div>
        `,
	}),
}
