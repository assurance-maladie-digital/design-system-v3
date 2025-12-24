/* eslint-disable no-useless-escape */
import type { Meta, StoryFn } from '@storybook/vue3'
import NotificationBar from './NotificationBar.vue'
import { VBtn } from 'vuetify/components'
import { useNotificationService } from '@/services/NotificationService'
import type { Notification } from '@/components/NotificationBar/types'

interface StoryArgs {
	closeBtnText: string
	type: Notification['type']
	bottom: boolean
	rounded: string | number | boolean
}

const meta: Meta<typeof NotificationBar> = {
	title: 'Composants/Feedback/NotificationBar',
	parameters: {
		layout: 'fullscreen',
		controls: { exclude: ['currentNotification', 'isNotificationVisible', 'hasActionSlot', 'isMobileVersion', 'hasLongContent', 'color', 'icon', 'contentStyle', 'smallCloseBtn', 'isVertical', 'type'] },
	},
	component: NotificationBar,
	argTypes: {
		closeBtnText: {
			control: 'text',
			table: {
				type: {
					summary: 'string',
				},
				defaultValue: {
					summary: 'Fermer',
				},
			},
		},
		bottom: {
			control: 'boolean',
			table: {
				type: {
					summary: 'boolean',
				},
				defaultValue: {
					summary: 'false',
				},
			},
		},
		rounded: {
			control: 'select',
			options: [0, 1, 2, 3, 4, 'xs', 'sm', true, 'lg', 'xl', 'pill', 'circle', 'shaped'],
			table: {
				type: {
					summary: '0, 1, 2, 3, 4, \'xs\', \'sm\', true, \'lg\', \'xl\', \'pill\', \'circle\', \'shaped\'',
				},
				defaultValue: {
					summary: '4',
				},
			},
		},
	},
}

export default meta

type Story = StoryFn<StoryArgs>

export const Default: Story = (args) => {
	return {
		components: { NotificationBar, VBtn },
		setup() {
			const { addNotification } = useNotificationService()

			const envoyerNotification = (message: string) => {
				const notification: Notification = {
					id: Date.now().toString(),
					message,
					type: args.type || 'info',
					timeout: -1,
				}
				addNotification(notification)
			}

			return {
				args,
				envoyerNotification,
			}
		},
		template: `
          <div class="d-flex flex-wrap align-center justify-center">
            <NotificationBar
                v-bind="args"
            />
            <VBtn
                color="primary"
                @click="envoyerNotification('Ceci est une notification de type : ', args.type)"
                class="ma-6"
            >
              Afficher la notification
            </VBtn>
          </div>
        `,
	}
}

Default.args = {
	closeBtnText: 'Fermer',
	bottom: false,
	rounded: 4,
}

Default.parameters = {
	sourceCode: [
		{
			name: 'Template',
			code: `
			<div class="d-flex flex-wrap align-center justify-center">
				<NotificationBar
					close-btn-text="Fermer"
					bottom
				/>
				<VBtn
					color="primary"
					@click="envoyerNotification('Ceci est une notification')"
					class="ma-6"
				>
					Afficher la notification
				</VBtn>
			</div>
			`,
		},
		{
			name: 'Script',
			code: `
			<script setup lang="ts">
				import { VBtn } from 'vuetify/components'
                import { NotificationBar, useNotificationService } from '@cnamts/synapse'
				import { ref } from 'vue'

				const { addNotification } = useNotificationService()

				const envoyerNotification = (message: string) => {
					const notification = {
						id: Date.now().toString(),
						message,
						type: 'info',
						timeout: -1,
					}
					addNotification(notification)
				}
			</script>
			`,
		},
	],
}

export const Success: Story = Default.bind({})
Success.args = {
	...Default.args,
	type: 'success',
}
Success.parameters = {
	sourceCode: [
		{
			name: 'Template',
			code: `
			<div class="d-flex flex-wrap align-center justify-center">
				<NotificationBar
					close-btn-text="Fermer"
					bottom
				>
				<VBtn
					color="success"
					@click="envoyerNotification('Ceci est une notification de succès')"
					class="ma-6"
				>
					Afficher la notification
				</VBtn>
			</div>
			`,
		},
		{
			name: 'Script',
			code: `
			<script setup lang="ts">
				import { VBtn } from 'vuetify/components'
				import { ref } from 'vue'
				import { useNotificationService, NotificationBar } from '@cnamts/synpase'

				const { addNotification } = useNotificationService()

				const envoyerNotification = (message: string) => {
					const notification = {
						id: Date.now().toString(),
						message,
						type: 'success',
						timeout: -1,
					}
					addNotification(notification)
				}
			</script>
			`,
		},
	],
}

export const Warning: Story = Default.bind({})
Warning.args = {
	...Default.args,
	type: 'warning',
}
Warning.parameters = {
	sourceCode: [
		{
			name: 'Template',
			code: `
			<div class="d-flex flex-wrap align-center justify-center">
				<NotificationBar
					close-btn-text="Fermer"
					bottom
				/>
				<VBtn
					color="warning"
					@click="envoyerNotification('Ceci est une notification d\'avertissement')"
					class="ma-6"
				>
					Afficher la notification
				</VBtn>
			</div>
			`,
		},
		{
			name: 'Script',
			code: `
			<script setup lang="ts">
				import { VBtn } from 'vuetify/components'
				import { NotificationBar, useNotificationService } from '@cnamts/synapse'
				import { ref } from 'vue'

				const { addNotification } = useNotificationService()

				const envoyerNotification = (message: string) => {
					const notification = {
						id: Date.now().toString(),
						message,
						type: 'warning',
						timeout: -1,
					}
					addNotification(notification)
				}
			</script>
			`,
		},
	],
}

export const Error: Story = Default.bind({})
Error.args = {
	...Default.args,
	type: 'error',
}
Error.parameters = {
	sourceCode: [
		{
			name: 'Template',
			code: `
			<div class="d-flex flex-wrap align-center justify-center">
				<NotificationBar
					close-btn-text="Fermer"
					bottom
				/>
				<VBtn
					color="error"
					@click="envoyerNotification('Ceci est une notification d\'erreur')"
					class="ma-6"
				>
					Afficher la notification
				</VBtn>
			</div>
			`,
		},
		{
			name: 'Script',
			code: `
			<script setup lang="ts">
				import { VBtn } from 'vuetify/components'
				import { NotificationBar, useNotificationService } from '@cnamts/synapse'
				import { ref } from 'vue'

				const { addNotification } = useNotificationService()

				const envoyerNotification = (message: string) => {
					const notification = {
						id: Date.now().toString(),
						message,
						type: 'error',
						timeout: -1,
					}
					addNotification(notification)
				}
			</script>
			`,
		},
	],
}

export const Bottom: Story = Default.bind({})
Bottom.args = {
	...Default.args,
	bottom: true,
}
Bottom.parameters = {
	sourceCode: [
		{
			name: 'Template',
			code: `
			<div class="d-flex flex-wrap align-center justify-center">
				<NotificationBar
					close-btn-text="Fermer"
					bottom
				/>
				<VBtn
					color="primary"
					@click="envoyerNotification('Ceci est une notification affichée en bas de l\'écran')"
					class="ma-6"
				>
					Afficher la notification
				</VBtn>
			</div>
			`,
		},
		{
			name: 'Script',
			code: `
			<script setup lang="ts">
				import { VBtn } from 'vuetify/components'
				import { NotificationBar, useNotificationService } from '@cnamts/synapse'
				import { ref } from 'vue'

				const { addNotification } = useNotificationService()

				const envoyerNotification = (message: string) => {
					const notification = {
						id: Date.now().toString(),
						message,
						type: 'info',
						timeout: -1,
					}
					addNotification(notification)
				}
			</script>
			`,
		},
	],
}

export const CustomCloseBtnText: Story = Default.bind({})
CustomCloseBtnText.args = {
	...Default.args,
	closeBtnText: 'Masquer',
}
CustomCloseBtnText.parameters = {
	sourceCode: [
		{
			name: 'Template',
			code: `
			<div class="d-flex flex-wrap align-center justify-center">
				<NotificationBar
					close-btn-text="Masquer"
					bottom
				/>
				<VBtn
					color="primary"
					@click="envoyerNotification('Ceci est une notification avec un texte de bouton personnalisé')"
					class="ma-6"
				>
					Afficher la notification
				</VBtn>
			</div>
			`,
		},
		{
			name: 'Script',
			code: `
			<script setup lang="ts">
				import { VBtn } from 'vuetify/components'
				import { NotificationBar, useNotificationService } from '@cnamts/synapse'
				import { ref } from 'vue'

				const { addNotification } = useNotificationService()

				const envoyerNotification = (message: string) => {
					const notification = {
						id: Date.now().toString(),
						message,
						type: 'info',
						timeout: -1,
					}
					addNotification(notification)
				}
			</script>
			`,
		},
	],
}

export const Customization: Story = Default.bind({})
Customization.args = {
	...Default.args,
	rounded: 'pill',
	type: 'success',
}
Customization.parameters = {
	sourceCode: [
		{
			name: 'Template',
			code: `
			<div class="d-flex flex-wrap align-center justify-center">
				<NotificationBar
					close-btn-text="closeBtnText"
					bottom
					rounded="pill"
				/>
				<VBtn
					color="success"
					@click="envoyerNotification('Ceci est une notification de succès')"
					class="ma-6"
				>
					Afficher la notification
				</VBtn>
			</div>
			`,
		},
		{
			name: 'Script',
			code: `
			<script setup lang="ts">
				import { VBtn } from 'vuetify/components'
				import { NotificationBar, useNotificationService } from '@cnamts/synapse'
				import { ref } from 'vue'

				const { addNotification } = useNotificationService()

				const envoyerNotification = (message: string) => {
					const notification = {
						id: Date.now().toString(),
						message,
						type: 'success',
						timeout: -1,
					}
					addNotification(notification)
				}
			</script>
			`,
		},
	],
}

export const WithClearQueue: Story = (args) => {
	return {
		components: { NotificationBar, VBtn },
		setup() {
			const { addNotification, clearQueue } = useNotificationService()

			// Fonction pour ajouter une notification avec un type spécifique
			const envoyerNotification = (message: string, type: Notification['type'] = 'info') => {
				const notification: Notification = {
					id: Date.now().toString(),
					message,
					type,
					timeout: -1,
				}
				addNotification(notification)
			}

			return {
				args,
				envoyerNotification,
				clearQueue,
			}
		},
		template: `
          <div class="d-flex flex-column align-center justify-center ga-4">
            <NotificationBar
                v-bind="args"
            />
            <div class="d-flex flex-wrap justify-center ga-4">
              <VBtn
                  color="primary"
                  @click="envoyerNotification('Notification info', 'info')"
              >
                Ajouter info
              </VBtn>
              <VBtn
                  color="success"
                  @click="envoyerNotification('Notification succès', 'success')"
              >
                Ajouter succès
              </VBtn>
              <VBtn
                  color="warning"
                  @click="envoyerNotification('Notification avertissement', 'warning')"
              >
                Ajouter avertissement
              </VBtn>
              <VBtn
                  color="error"
                  @click="envoyerNotification('Notification erreur', 'error')"
              >
                Ajouter erreur
              </VBtn>
              <VBtn
                  color="grey-darken-1"
                  @click="clearQueue()"
              >
                Fermer toutes les notifications
              </VBtn>
            </div>
          </div>
        `,
	}
}

WithClearQueue.args = {
	...Default.args,
	bottom: true,
}

WithClearQueue.parameters = {
	sourceCode: [
		{
			name: 'Template',
			code: `
			<div class="d-flex flex-column align-center justify-center ga-4">
				<NotificationBar
					bottom
				/>
				<div class="d-flex flex-wrap justify-center ga-4">
					<!-- Boutons pour ajouter des notifications -->
					<VBtn
						color="primary"
						@click="envoyerNotification('Notification info', 'info')"
					>
						Ajouter info
					</VBtn>
					<!-- ... autres boutons ... -->
					<VBtn
						color="grey-darken-1"
						@click="clearQueue()"
					>
						Fermer toutes les notifications
					</VBtn>
				</div>
			</div>
			`,
		},
		{
			name: 'Script',
			code: `
			<script setup lang="ts">

				const { addNotification, clearQueue } = useNotificationService()

				const envoyerNotification = (message: string, type = 'info') => {
					const notification = {
						id: Date.now().toString(),
						message,
						type,
						timeout: -1,
					}
					addNotification(notification)
				}
			</script>
			`,
		},
	],
}
