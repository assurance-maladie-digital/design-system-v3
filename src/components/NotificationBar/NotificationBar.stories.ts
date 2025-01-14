import type { Meta, StoryFn } from '@storybook/vue3'
import NotificationBar from './NotificationBar.vue'
import { VBtn } from 'vuetify/components'
import { ref, toRefs, watch } from 'vue'
import { useNotificationService } from '@/services/NotificationService'
import type { Notification } from '@/components/NotificationBar/types'

interface StoryArgs {
	closeBtnText: string
	type: Notification['type']
	bottom: boolean
	rounded: string
}

const meta: Meta<typeof NotificationBar> = {
	title: 'Composants/Feedback/NotificationBar',
	parameters: {
		layout: 'fullscreen',
	},
	argTypes: {
		closeBtnText: { control: 'text', type: 'string' },
		bottom: { control: 'boolean', type: 'boolean' },
		rounded: { control: 'text', type: 'string' },
	},
}

export default meta

type Story = StoryFn<StoryArgs>

export const Default: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
				<div class="d-flex flex-wrap align-center justify-center">
					<NotificationBar
						v-model="showNotification"
						:close-btn-text="closeBtnText"
						:bottom="bottom"
						:rounded="rounded"
					>
						<template #default>This is a {{ typeRef }} notification</template>
					</NotificationBar>
					<VBtn
						color="primary"
						@click="envoyerNotification('This is a ' + typeRef + ' notification')"
						class="ma-6"
					>
						Afficher la notification
					</VBtn>
				</div>
				`,
			}, {
				name: 'Script',
				code: `
				<script setup lang="ts">
					import { VBtn } from 'vuetify/components'
					import { NotificationBar } from '@cnamts/synapse'
					
					const { addNotification } = useNotificationService()
					const showNotification = ref(false)
					const { type: typeRef, closeBtnText } = toRefs(args)

					const envoyerNotification = (message: string) => {
						const notification: Notification = {
						id: Date.now().toString(),
						message,
						type: typeRef.value,
						timeout: -1,
					}
					addNotification(notification)
					showNotification.value = true
				}
				</script>
				`,
			},
		],
	},
	args: {
		closeBtnText: 'Fermer',
		type: 'info',
		bottom: false,
		rounded: 'rounded',
	},
	render: (args) => {
		return {
			components: { NotificationBar, VBtn },
			setup() {
				const { addNotification } = useNotificationService()
				const showNotification = ref(false)
				const { type: typeRef, closeBtnText } = toRefs(args)

				const envoyerNotification = (message: string) => {
					const notification: Notification = {
						id: Date.now().toString(),
						message,
						type: typeRef.value,
						timeout: -1,
					}
					addNotification(notification)
					showNotification.value = true
				}

				return {
					showNotification,
					typeRef,
					closeBtnText,
					envoyerNotification,
				}
			},
			template: `
				<div class="d-flex flex-wrap align-center justify-center">
					<NotificationBar
						v-model="showNotification"
						:close-btn-text="closeBtnText"
						:bottom="bottom"
						:rounded="rounded"
					>
						<template #default>This is a {{ typeRef }} notification</template>
					</NotificationBar>
					<VBtn
						color="primary"
						@click="envoyerNotification('This is a ' + typeRef + ' notification')"
						class="ma-6"
					>
						Afficher la notification
					</VBtn>
				</div>
			`,
		}
	},
}
