import type { Meta, StoryObj } from '@storybook/vue3'

import { defineComponent, ref } from 'vue'
import { VBtn, VSelect, VTextField, VTextarea } from 'vuetify/components'

import SyAlert from '../../components/SyAlert/SyAlert.vue'
import '../styles/shared.css'

const JiraCollectorPage = defineComponent({
	components: { VBtn, VSelect, VTextField, VTextarea, SyAlert },
	props: {
		createIssueEndpoint: {
			type: String,
			default: '',
		},
		jiraCreateIssueUrl: {
			type: String,
			default: '',
		},
		mockShouldFail: {
			type: Boolean,
			default: false,
		},
	},
	setup(props) {
		const severityItems = ['Bloquante', 'Majeure', 'Mineure']
		const summary = ref('')
		const description = ref('')
		const email = ref('')
		const severity = ref<typeof severityItems[number] | ''>('')

		const pending = ref(false)
		const errorMessage = ref('')
		const success = ref<{ key: string, url?: string } | null>(null)

		const validate = (): string => {
			if (!summary.value.trim()) {
				return 'Veuillez renseigner un titre.'
			}
			if (!description.value.trim()) {
				return 'Veuillez renseigner une description.'
			}
			return ''
		}

		const submit = async (): Promise<void> => {
			errorMessage.value = ''
			success.value = null
			const validationError = validate()
			if (validationError) {
				errorMessage.value = validationError
				return
			}

			pending.value = true
			try {
				if (props.createIssueEndpoint) {
					const response = await fetch(props.createIssueEndpoint, {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify({
							summary: summary.value,
							description: description.value,
							email: email.value,
							severity: severity.value,
						}),
					})

					if (!response.ok) {
						throw new Error('La création du ticket a échoué.')
					}

					const data = await response.json() as { key?: string, url?: string }
					if (!data.key) {
						throw new Error('Réponse inattendue lors de la création du ticket.')
					}

					success.value = { key: data.key, url: data.url }
				}
				else {
					await new Promise(resolve => setTimeout(resolve, 600))
					if (props.mockShouldFail) {
						throw new Error('Erreur simulée : impossible de créer le ticket.')
					}
					success.value = {
						key: 'STD-123',
						url: 'https://jiracnam.ramage/browse/STD-123',
					}
				}
			}
			catch (error) {
				errorMessage.value = error instanceof Error ? error.message : 'Une erreur est survenue.'
			}
			finally {
				pending.value = false
			}
		}

		return { props, severityItems, summary, description, email, severity, pending, errorMessage, success, submit }
	},
	template: `
		<div class="header">
			<h1>Signaler une anomalie</h1>
		</div>

		<p>
			Description de la page.
		</p>

		<div class="mt-4">
			<SyAlert
				type="info"
				variant="tonal"
				:closable="false"
			>
				<template #default>
					Vous devez être connecté au VPN Cnam pour pouvoir faire une demande
				</template>
			</SyAlert>
		</div>

		<div class="mt-6" style="max-width: 720px;">
			<VTextField
				v-model="summary"
				label="Titre"
				variant="outlined"
				:disabled="pending"
			/>
			<VSelect
				v-model="severity"
				:items="severityItems"
				label="Sévérité"
				variant="outlined"
				:disabled="pending"
				class="mt-3"
			/>
			<VTextField
				v-model="email"
				label="Email (optionnel)"
				variant="outlined"
				:disabled="pending"
				class="mt-3"
			/>
			<VTextarea
				v-model="description"
				label="Description"
				variant="outlined"
				:disabled="pending"
				auto-grow
				class="mt-3"
			/>

			<SyAlert
				v-if="errorMessage"
				type="error"
				variant="tonal"
				:closable="false"
				class="mt-4"
			>
				<template #default>
					{{ errorMessage }}
				</template>
			</SyAlert>

			<SyAlert
				v-if="success"
				type="success"
				variant="tonal"
				:closable="false"
				class="mt-4"
			>
				<template #default>
					Ticket créé :
					<a v-if="success.url" :href="success.url" target="_blank" rel="noopener">{{ success.key }}</a>
					<span v-else>{{ success.key }}</span>
				</template>
			</SyAlert>

			<VBtn
				color="primary"
				class="mt-4"
				:loading="pending"
				@click="submit"
			>
				Envoyer
			</VBtn>
		</div>
		
		<hr class="mt-6" />

		<div class="mt-6">
			<VBtn
				v-if="props.jiraCreateIssueUrl"
				color="primary"
				:href="props.jiraCreateIssueUrl"
				target="_blank"
				rel="noopener"
			>
				Créer une issue
			</VBtn>
		</div>
	`,
})

const meta: Meta = {
	title: 'Démarrer/Signaler une anomalie (Jira)',
	component: JiraCollectorPage,
	argTypes: {
		createIssueEndpoint: {
			description: 'URL d\'un endpoint interne (proxy) qui crée un ticket Jira. Si vide, la page fonctionne en mock local (aucun appel réseau).',
			control: 'text',
		},
		jiraCreateIssueUrl: {
			description: 'URL Jira à ouvrir dans un nouvel onglet pour créer une issue via l\'interface Jira.',
			control: 'text',
		},
		mockShouldFail: {
			description: 'Force une erreur en mode mock, pour vérifier l\'affichage des erreurs.',
			control: 'boolean',
		},
	},
}

export default meta

type Story = StoryObj<typeof meta>

export const Page: Story = {
	args: {
		createIssueEndpoint: '',
		jiraCreateIssueUrl: 'https://jiracnam.ramage/projects/STD/issues/STD-62',
		mockShouldFail: false,
	},
	tags: ['!dev'],
}
