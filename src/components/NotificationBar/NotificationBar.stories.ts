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
	showAll: boolean
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
		showAll: {
			control: 'boolean',
			description: 'Afficher toutes les notifications au lieu de la dernière uniquement',
			table: {
				type: {
					summary: 'boolean',
				},
				defaultValue: {
					summary: 'false',
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
			const argsType = args.type || 'info'
			const envoyerNotification = (message: string) => {
				const notification: Notification = {
					id: Date.now().toString(),
					message,
					type: argsType,
					timeout: -1,
				}
				addNotification(notification)
			}

			return {
				args,
				argsType,
				envoyerNotification,
			}
		},
		template: `
          <div class="d-flex flex-wrap align-center justify-center">
            <NotificationBar
                v-bind="args"
            />
            <VBtn
                color="colorPrimary"
                @click="envoyerNotification('Ceci est une notification de type : ' + argsType)"
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
				/>
				<VBtn
					color="colorPrimary"
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
				import { ref } from 'vue'
				import { useNotificationService, NotificationBar } from '@cnamts/synapse'

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
					color="colorPrimary"
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
				/>
				<VBtn
					color="colorPrimary"
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

export const DefaultSlot: Story = (args) => {
	return {
		components: { NotificationBar, VBtn },
		setup() {
			const { addNotification } = useNotificationService()

			const envoyerNotification = () => {
				const notification: Notification = {
					id: Date.now().toString(),
					message: 'Notification avec contenu principal personnalisé.',
					type: 'info',
					timeout: -1,
				}
				addNotification(notification)
			}

			return { args, envoyerNotification }
		},
		template: `
          <div class="d-flex flex-wrap align-center justify-center">
            <NotificationBar v-bind="args">
              <template #default="{ notification }">
                Contenu personnalisé pour <strong>{{ notification.id }}</strong>
              </template>
            </NotificationBar>
            <VBtn
                color="colorPrimary"
                @click="envoyerNotification()"
                class="ma-6"
            >
              Afficher la notification
            </VBtn>
          </div>
        `,
	}
}

DefaultSlot.args = {
	...Default.args,
}

DefaultSlot.parameters = {
	sourceCode: [
		{
			name: 'Template',
			code: `
			<NotificationBar>
				<template #default="{ notification }">
					Contenu personnalisé pour <strong>{{ notification.id }}</strong>
				</template>
			</NotificationBar>
			`,
		},
		{
			name: 'Script',
			code: `
			<script setup lang="ts">
				import { NotificationBar, useNotificationService } from '@cnamts/synapse'

				const { addNotification } = useNotificationService()

				const envoyerNotification = () => {
					addNotification({
						id: Date.now().toString(),
						message: 'Notification avec contenu principal personnalisé.',
						type: 'info',
						timeout: -1,
					})
				}
			</script>
			`,
		},
	],
}

export const ActionSlot: Story = (args) => {
	return {
		components: { NotificationBar, VBtn },
		setup() {
			const { addNotification } = useNotificationService()

			const envoyerNotification = () => {
				const notification: Notification = {
					id: Date.now().toString(),
					message: 'Notification avec contenu personnalisé via slot.',
					type: 'info',
					timeout: -1,
				}
				addNotification(notification)
			}

			return { args, envoyerNotification }
		},
		template: `
          <div class="d-flex flex-wrap align-center justify-center">
            <NotificationBar v-bind="args">
              <template #action>
                <VBtn variant="outlined">
                  Voir le détail
                </VBtn>
              </template>
            </NotificationBar>
            <VBtn
                color="colorPrimary"
                @click="envoyerNotification()"
                class="ma-6"
            >
              Afficher la notification
            </VBtn>
          </div>
        `,
	}
}

ActionSlot.args = {
	...Default.args,
}

ActionSlot.parameters = {
	sourceCode: [
		{
			name: 'Template',
			code: `
			<NotificationBar>
				<template #action>
					<VBtn variant="outlined">
						Voir le détail
					</VBtn>
				</template>
			</NotificationBar>
			`,
		},
		{
			name: 'Script',
			code: `
			<script setup lang="ts">
				import { NotificationBar, useNotificationService } from '@cnamts/synapse'

				const { addNotification } = useNotificationService()

				const envoyerNotification = () => {
					addNotification({
						id: Date.now().toString(),
						message: 'Notification avec contenu personnalisé via slot.',
						type: 'info',
						timeout: -1,
					})
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
                  color="colorPrimary"
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
			<p class="mt-4">Ajoutez plusieurs notifications pour tester l'affichage.</p>
          </div>
        `,
	}
}

WithClearQueue.args = {
	...Default.args,
	bottom: true,
}

export const showAll: Story = (args) => {
	return {
		components: { NotificationBar, VBtn },
		setup() {
			const { addNotification, clearQueue } = useNotificationService()

			const envoyerNotification = (message: string, type: Notification['type'] = 'info') => {
				const notification: Notification = {
					id: Date.now().toString(),
					message,
					type: type,
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
				  color="colorPrimary"
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
			<p class="mt-4">Ajoutez plusieurs notifications pour tester l'affichage.</p>
		  </div>
		`,
	}
}

showAll.args = {
	...Default.args,
	showAll: true,
	bottom: true,
}

showAll.parameters = {
	sourceCode: [
		{
			name: 'Template',
			code: `
			<div class="d-flex flex-column align-center justify-center ga-4">
				<div class="d-flex flex-wrap justify-center ga-4">
					<VBtn
						color="colorPrimary"
						@click="envoyerNotification('Notification info', 'info')"
					>
						Ajouter une notification info
					</VBtn>
					<VBtn
						color="success"
						@click="envoyerNotification('Notification succès', 'success')"
					>
						Ajouter une notification succès
					</VBtn>
					<VBtn
						color="warning"
						@click="envoyerNotification('Notification avertissement', 'warning')"
					>
						Ajouter une notification avertissement
					</VBtn>
					<VBtn
						color="error"
						@click="envoyerNotification('Notification erreur', 'error')"
					>
						Ajouter une notification erreur
					</VBtn>
				</div>
				<p class="mt-4">Ajoutez plusieurs notifications pour tester l'affichage.</p>
				<NotificationBar
					close-btn-text="Fermer"
					show-all
				/>
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

				const envoyerNotification = (message: string, type: string = 'info') => {
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
